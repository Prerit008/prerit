// src/app/blog/not-found.tsx
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export const metadata = {
  title: "404: Note Not Found",
};

export default function BlogNotFound() {   // <-- MUST be default
  return (
    <section className="blog-page py-28">
      <p className="eyebrow">404 / Note not found</p>
      <h1>
        That note
        <br />
        <span className="hero-highlight">is missing.</span>
      </h1>
      <Link className="button button-primary" href="/blog">
        <IconArrowLeft size={18} /> Back to all notes
      </Link>
    </section>
  );
}