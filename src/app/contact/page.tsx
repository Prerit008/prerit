import type { Metadata } from "next";
import ContactPage from "../../components/ContactPage";
import site from "../../../data.json"
export const metadata: Metadata = {
  title: "Contact | " + site.site.title,
  description: "Get in touch with " + site.personal.name,
};

export default function Page() {
  return <ContactPage />;
}
