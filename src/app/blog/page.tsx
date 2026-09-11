import type { Metadata } from "next";
import BlogPage from "../../components/BlogPage";
import site from "../../../data.json";
export const metadata: Metadata = {
  title: "Notes & Writing | " + site.personal.shortName,
  description:
    "Ideas about design, engineering, and building useful things on the web.",
};

export default function Page() {
  return <BlogPage />;
}
