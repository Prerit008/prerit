// src/app/not-found.tsx
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react' // Using the icon you already have

export const metadata = {
  title: '404: Slug not found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <section className="blog-page py-28 text-center">
      <p className="eyebrow">404 / Slug not found</p>
      <h1 className="mb-6">
        That slug
        <br />
        <span className="hero-highlight">is missing.</span>
      </h1>
      <p className="mb-8">
        Sorry, I couldn't find the page you were looking for. It may have been moved or deleted.
      </p>
      <Link className="button button-primary inline-flex items-center gap-2" href="/">
        <IconArrowLeft size={18} /> Back to Home
      </Link>
    </section>
  )
}