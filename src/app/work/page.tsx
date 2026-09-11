import type { Metadata } from "next";
import WorkPage from "../../components/WorkPage";
import site from "../../../data.json";

export const metadata: Metadata = {
  title: "Work | " + site.personal.shortName,
  description: "Featured projects and work by " + site.personal.shortName + ".",
};

export default function Page() {
  return <WorkPage />;
}
