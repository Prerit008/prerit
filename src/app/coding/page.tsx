import type { Metadata } from "next";
import CodingPage from "../../components/CodingPage";
import site from "../../../data.json";

export const metadata: Metadata = {
  title: "Coding Activity | " + site.personal.shortName,
  description:
    "Live stats and problem solving activity across coding platforms.",
};

export default function Page() {
  return <CodingPage />;
}
