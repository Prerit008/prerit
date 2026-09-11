"use client";

import { IconArrowLeft, IconArrowUpRight } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "@/types/blog";
import { HtmlRenderer } from "./BlockRenderer";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/blog")
      .then(async (response) => {
        const value = (await response.json()) as Post[] | { error?: string };
        if (!response.ok) {
          throw new Error(
            "error" in value && value.error
              ? value.error
              : "Blog posts could not be loaded.",
          );
        }
        if (!Array.isArray(value)) {
          throw new Error("The blog API returned an invalid posts response.");
        }
        return value;
      })
      .then(setPosts)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);
  return { posts, error, loading };
}

export default function BlogPage() {
  const { posts, error, loading } = usePosts();
  return (
    <section className="blog-page py-16 md:py-28">
      <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">04 / Notes from the field</p>
          <h1 className="mb-0">
            Thinking out
            <br />
            <span className="hero-highlight">loud.</span>
          </h1>
        </div>
        <p className="blog-lede">
          Ideas about design, engineering, and making useful things on the web.
        </p>
      </div>
      {loading && <p className="coding-empty">Loading notes...</p>}
      {error && <p className="coding-empty">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="coding-empty">No published notes yet.</p>
      )}
      <div className="blog-list">
        {posts.map((post, index) => (
          <article className="blog-card" key={post.slug}>
            <div className="blog-card-index">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="blog-card-content">
              <div className="blog-meta">
                <span>{post.category}</span>
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span>{post.readTime}</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <Link className="text-link" href={`/blog/${post.slug}`}>
                Read note <IconArrowUpRight size={17} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function BlogDetailPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`/api/blog/${encodeURIComponent(slug)}`)
      .then((response) => {
        if (!response.ok) throw new Error("This note could not be found.");
        return response.json() as Promise<Post>;
      })
      .then(setPost)
      .catch((reason: Error) => setError(reason.message));
  }, [slug]);
  if (error)
    return (
      <section className="blog-detail py-16 md:py-28">
        <p className="coding-empty">{error}</p>
      </section>
    );
  if (!post)
    return (
      <section className="blog-detail py-16 md:py-28">
        <p className="coding-empty">Loading note...</p>
      </section>
    );
  return (
    <article className="blog-detail py-16 md:py-28">
      <Link className="back-link" href="/blog">
        <IconArrowLeft size={17} /> All notes
      </Link>
      <header className="blog-detail-header">
        <div className="blog-meta">
          <span>{post.category}</span>
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span>{post.readTime}</span>
        </div>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
      </header>
      <div className="blog-body">
        <HtmlRenderer content={post.content} />
      </div>
      <Link className="button button-primary" href="/blog">
        <IconArrowLeft size={18} /> More notes
      </Link>
    </article>
  );
}
