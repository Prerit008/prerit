import type { Metadata } from "next";
import AboutPage from "../../components/AboutPage";
import site from "../../../data.json"
export const metadata: Metadata = {
  title: "About | " + site.site.title,
  description: "Background, timeline, and education.",
};

export default function Page() {
  return <AboutPage />;
}
