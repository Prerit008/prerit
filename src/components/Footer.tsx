import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import site from "../../data.json";
import packageJson from "../../package.json";

export const VERSION = packageJson.version;

const socialIcons = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
};

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="footer-main">
        <div className="footer-intro">
          <Link
            className="footer-brand"
            href="/"
            aria-label={`${site.site.name} home`}
          >
            P<span>.</span>
          </Link>
          <p>
            Software engineer and designer building thoughtful products, useful
            systems, and better web experiences.
          </p>
          <a className="footer-email" href={`mailto:${site.personal.email}`}>
            <IconMail size={17} />
            {site.personal.email}
          </a>
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          <div>
            <p className="footer-label">Explore</p>
            <Link href="/work">Work</Link>
            <Link href="/about">About</Link>
            <Link href="/coding">Coding</Link>
            <Link href="/blog">Blog</Link>
          </div>
          <div>
            <p className="footer-label">Connect</p>
            <Link href="/contact">Contact</Link>
            {site.socialLinks.map((social) => {
              const Icon = socialIcons[social.icon as keyof typeof socialIcons];
              return (
                <a
                  href={social.url}
                  key={social.name}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {Icon && <Icon size={15} />}
                  {social.name}
                </a>
              );
            })}
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {site.personal.name}
        </span>
        <span>Built with Next.js · v{VERSION}</span>
        <Link href="/#top">Back to top ↑</Link>
      </div>
    </footer>
  );
}
