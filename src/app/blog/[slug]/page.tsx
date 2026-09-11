import type { Metadata } from "next";
import { findPost } from "@/app/lib/blog";
import site from "../../../../data.json";
import { BlogDetailPage } from "../../../components/BlogPage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await findPost(slug).catch(() => null);
  if (!post) {
    return {
      title: `Note not found | ${site.site.name}`,
      description: site.site.description,
      robots: { index: false, follow: false },
    };
  }
  const canonical = `${site.site.url}/blog/${post.slug}`;
  return {
    metadataBase: new URL(site.site.url),
    title: `${post.title} | ${site.site.name}`,
    description: post.excerpt,
    alternates: { canonical },
    keywords: [
      post.category,
      "software engineering",
      "web development",
      "Prerit Agarwal",
    ],
    openGraph: {
      type: "article",
      url: canonical,
      title: post.title,
      description: post.excerpt,
      siteName: site.site.name,
      publishedTime: post.date,
      authors: [site.personal.name],
      images: [{ url: site.site.iconUrl, alt: `${post.title} cover` }],
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.excerpt,
      images: [site.site.iconUrl],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <BlogDetailPage slug={slug} />;
}
