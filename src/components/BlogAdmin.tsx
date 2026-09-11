"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/types/blog";

const emptyPost: Omit<Post, "date" | "readTime"> = {
  slug: "",
  title: "",
  category: "Engineering",
  excerpt: "",
  published: false,
  content: "",
};

export default function BlogAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState(emptyPost);
  const [previousSlug, setPreviousSlug] = useState("");
  const [message, setMessage] = useState("");

  function loadPosts() {
    fetch("/api/blog?admin=1")
      .then(async (response) => {
        const value = (await response.json()) as Post[] | { error?: string };
        if (!response.ok) {
          throw new Error(
            "error" in value && value.error
              ? value.error
              : "Could not load blog posts.",
          );
        }
        if (!Array.isArray(value)) {
          throw new Error("The blog API returned an invalid posts response.");
        }
        return value;
      })
      .then((value) => {
        setPosts(value);
        setAuthenticated(true);
      })
      .catch((error: Error) => {
        setPosts([]);
        setMessage(error.message);
        setAuthenticated(false);
      });
  }
  useEffect(loadPosts, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/blog/auth", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      setMessage((await response.json()).error);
      return;
    }
    setMessage("");
    loadPosts();
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(
      previousSlug ? `/api/blog/${previousSlug}` : "/api/blog",
      {
        method: previousSlug ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      },
    );
    const result = await response.json();
    if (!response.ok) {
      setMessage(result.error);
      return;
    }
    setMessage("Saved.");
    setEditing(emptyPost);
    setPreviousSlug("");
    loadPosts();
  }

  async function remove(slug: string) {
    if (!window.confirm(`Delete "${slug}"?`)) return;
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    loadPosts();
  }

  if (!authenticated)
    return (
      <section className="admin-page py-16 md:py-28">
        <div className="admin-card">
          <p className="eyebrow">Blog admin</p>
          <h1>Sign in.</h1>
          <form className="contact-form" onSubmit={login}>
            <label>
              Username
              <input
                required
                value={credentials.username}
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    username: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Password
              <input
                required
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    password: event.target.value,
                  })
                }
              />
            </label>
            <button className="button button-primary" type="submit">
              Login
            </button>
            {message && <p>{message}</p>}
          </form>
        </div>
      </section>
    );

  return (
    <section className="admin-page py-16 md:py-28">
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Blog admin</p>
          <h1>Publish ideas.</h1>
        </div>
        <button
          className="text-link"
          onClick={() => {
            fetch("/api/blog/auth", { method: "DELETE" });
            setAuthenticated(false);
          }}
          type="button"
        >
          Sign out
        </button>
      </div>
      <div className="admin-layout">
        <div className="admin-card">
          <form className="contact-form" onSubmit={save}>
            <div className="form-heading">
              <span>{previousSlug ? "EDIT NOTE" : "NEW NOTE"}</span>
              <span>{editing.published ? "PUBLISHED" : "DRAFT"}</span>
            </div>
            <label>
              Title
              <input
                required
                value={editing.title}
                onChange={(event) =>
                  setEditing({ ...editing, title: event.target.value })
                }
              />
            </label>
            <label>
              Slug
              <input
                required
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                value={editing.slug}
                onChange={(event) =>
                  setEditing({ ...editing, slug: event.target.value })
                }
                placeholder="my-first-note"
              />
            </label>
            <label>
              Category
              <input
                required
                value={editing.category}
                onChange={(event) =>
                  setEditing({ ...editing, category: event.target.value })
                }
              />
            </label>
            <label>
              Excerpt
              <textarea
                required
                value={editing.excerpt}
                onChange={(event) =>
                  setEditing({ ...editing, excerpt: event.target.value })
                }
              />
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={editing.published}
                onChange={(event) =>
                  setEditing({ ...editing, published: event.target.checked })
                }
              />{" "}
              Publish this note
            </label>
            <label>
              HTML content
              <textarea
                className="blog-html-editor"
                required
                value={editing.content}
                onChange={(event) =>
                  setEditing({ ...editing, content: event.target.value })
                }
                placeholder="<h2>Heading</h2>\n<p>Write your note...</p>\n<ul><li>A point</li></ul>"
              />
            </label>
            <p className="admin-help">
              Use basic HTML such as <code>&lt;h2&gt;</code>,{" "}
              <code>&lt;p&gt;</code>, <code>&lt;ul&gt;</code>,{" "}
              <code>&lt;pre&gt;&lt;code&gt;</code>, and links. Unsafe tags are
              removed before saving.
            </p>
            <button className="button button-primary" type="submit">
              {previousSlug ? "Update note" : "Save note"}
            </button>
            {message && <p>{message}</p>}
          </form>
        </div>
        <div className="admin-card">
          <div className="form-heading">
            <span>YOUR NOTES</span>
            <span>{posts.length}</span>
          </div>
          {posts.map((post) => (
            <div className="admin-post" key={post.slug}>
              <div>
                <b>{post.title}</b>
                <small>
                  {post.published ? "Published" : "Draft"} · {post.slug}
                </small>
              </div>
              <div>
                <button
                  className="text-link"
                  onClick={() => {
                    setEditing({ ...post });
                    setPreviousSlug(post.slug);
                  }}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className="text-link danger"
                  onClick={() => remove(post.slug)}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
