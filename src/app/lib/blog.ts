import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import sanitizeHtml from "sanitize-html";
import type { Post, PostInput } from "@/types/blog";
import { pool } from "./db";

let schemaReady: Promise<void> | undefined;

async function ensureSchema() {
  schemaReady ??= pool
    .query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        slug VARCHAR(180) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        excerpt TEXT NOT NULL,
        published TINYINT(1) NOT NULL DEFAULT 1,
        body LONGTEXT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
    `)
    .then(() =>
      pool.query("ALTER TABLE blog_posts MODIFY body LONGTEXT NOT NULL"),
    )
    .then(async () => {
      const [indexes] = await pool.query("SHOW INDEX FROM blog_posts");
      const hasTitleIndex = (indexes as Array<{ Key_name: string }>).some(
        (index) => index.Key_name === "blog_posts_title_unique",
      );
      if (!hasTitleIndex) {
        await pool.query(
          "ALTER TABLE blog_posts ADD UNIQUE KEY blog_posts_title_unique (title)",
        );
      }
    })
    .then(() => undefined)
    .catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  return schemaReady;
}

const allowedTags = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "a",
  "h2",
  "h3",
  "h4",
  "ul",
  "ol",
  "li",
  "blockquote",
  "pre",
  "code",
  "hr",
  "mark",
];

function cleanContent(value: unknown) {
  return sanitizeHtml(typeof value === "string" ? value : "", {
    allowedTags,
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto"],
    disallowedTagsMode: "discard",
  }).trim();
}

function readPost(row: Record<string, unknown>): Post {
  const content = cleanContent(row.body);
  const date = String(row.created_at ?? row.updated_at);
  const minutes = Math.max(
    1,
    Math.ceil(
      content
        .replace(/<[^>]*>/g, " ")
        .split(/\s+/)
        .filter(Boolean).length / 220,
    ),
  );
  return {
    slug: String(row.slug),
    title: String(row.title),
    category: String(row.category),
    excerpt: String(row.excerpt),
    date,
    readTime: `${minutes} min read`,
    published: Number(row.published) === 1,
    content,
  };
}

export async function listPosts(includeDrafts = false) {
  await ensureSchema();
  const [rows] = await pool.query(
    `SELECT slug, title, category, excerpt, published, body, created_at, updated_at
     FROM blog_posts ${includeDrafts ? "" : "WHERE published = 1"}
     ORDER BY updated_at DESC`,
  );
  return (rows as Record<string, unknown>[]).map(readPost);
}

export async function findPost(slug: string, includeDrafts = false) {
  await ensureSchema();
  const [rows] = await pool.query(
    `SELECT slug, title, category, excerpt, published, body, created_at, updated_at
     FROM blog_posts WHERE slug = ? ${includeDrafts ? "" : "AND published = 1"} LIMIT 1`,
    [slug],
  );
  const row = (rows as Record<string, unknown>[])[0];
  return row ? readPost(row) : null;
}

export async function savePost(input: PostInput, previousSlug?: string) {
  await ensureSchema();
  const slug = input.slug.trim().toLowerCase();
  const title = input.title.trim();
  if (!title) {
    throw new Error("A blog title is required.");
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      "Slug must contain lowercase letters, numbers, and hyphens only.",
    );
  }
  const [existingTitles] = await pool.query(
    "SELECT slug FROM blog_posts WHERE title = ? AND slug <> ? LIMIT 1",
    [title, previousSlug ?? slug],
  );
  if ((existingTitles as Array<{ slug: string }>).length > 0) {
    throw new Error("A blog with this title already exists.");
  }
  const content = cleanContent(input.content);
  await pool.query(
    `INSERT INTO blog_posts (slug, title, category, excerpt, published, body)
     VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), category = VALUES(category),
     excerpt = VALUES(excerpt), published = VALUES(published), body = VALUES(body)`,
    [
      slug,
      title,
      input.category.trim(),
      input.excerpt.trim(),
      input.published ? 1 : 0,
      content,
    ],
  );
  if (previousSlug && previousSlug !== slug) {
    await pool.query("DELETE FROM blog_posts WHERE slug = ?", [previousSlug]);
  }
  return findPost(slug, true);
}

export async function deletePost(slug: string) {
  await ensureSchema();
  await pool.query("DELETE FROM blog_posts WHERE slug = ?", [slug]);
}

const sessionSecret = () => process.env.BLOG_ADMIN_PASSWORD ?? "";

export function createAdminToken() {
  const username = process.env.BLOG_ADMIN_USERNAME;
  const password = sessionSecret();
  if (!username || !password)
    throw new Error(
      "BLOG_ADMIN_USERNAME and BLOG_ADMIN_PASSWORD are required.",
    );
  const payload = `${username}:${Date.now()}`;
  const signature = createHmac("sha256", password)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function isAdminTokenValid(token: string | undefined) {
  if (!token || !process.env.BLOG_ADMIN_USERNAME || !sessionSecret())
    return false;
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const [username, issuedAt, signature] = decoded.split(":");
    const payload = `${username}:${issuedAt}`;
    const expected = createHmac("sha256", sessionSecret())
      .update(payload)
      .digest("hex");
    return (
      username === process.env.BLOG_ADMIN_USERNAME &&
      Number.isFinite(Number(issuedAt)) &&
      Date.now() - Number(issuedAt) < 1000 * 60 * 60 * 24 * 7 &&
      signature?.length === expected.length &&
      timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    );
  } catch {
    return false;
  }
}

export function hashPassword(value: string) {
  return createHash("sha256").update(value).digest("hex");
}
