import type { Metadata } from "next";
import "./globals.css";
import data from "../../data.json";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL(data.site.url),
  title: {
    default: `${data.site.name} | ${data.personal.name}`,
    template: `%s | ${data.site.name}`,
  },
  description: data.site.description,
  applicationName: data.site.name,
  keywords: [
    "Prerit Agarwal",
    "software engineer",
    "full stack developer",
    "web developer",
    "React developer",
    "Next.js developer",
    "portfolio",
  ],
  authors: [{ name: data.personal.name, url: data.site.url }],
  creator: data.personal.name,
  publisher: data.site.name,
  alternates: { canonical: data.site.url },
  icons: {
    icon: [{ url: data.site.iconUrl, type: "image/png" }],
    apple: [{ url: data.site.iconUrl }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: data.site.url,
    siteName: data.site.name,
    title: `${data.site.name} | ${data.personal.name}`,
    description: data.site.description,
    images: [
      {
        url: data.site.thumbUrl,
        width: 3584,
        height: 2240,
        alt: `${data.personal.name} portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${data.site.name} | ${data.personal.name}`,
    description: data.site.description,
    images: [data.site.iconUrl],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" data-scroll-behavior="smooth">
      <body>
        <main
          className="mx-auto w-full max-w-[1240px] overflow-hidden px-6 md:my-[18px] 
        md:border-4 md:border-[var(--border)] md:px-[58px] md:shadow-[14px_14px_0_var(--border)]"
        >
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
