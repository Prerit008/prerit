import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import data from "../../data.json";

export const metadata: Metadata = {
  title: data.site.title,
  description: data.site.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <main className="mx-auto w-full max-w-[1240px] overflow-hidden px-6 md:my-[18px] 
        md:border-4 md:border-[var(--border)] md:px-[58px] md:shadow-[14px_14px_0_var(--border)]">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
