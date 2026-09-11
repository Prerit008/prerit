export type Post = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  published: boolean;
  content: string;
};

export type PostInput = Omit<Post, "date" | "readTime"> & {
  date?: string;
};
