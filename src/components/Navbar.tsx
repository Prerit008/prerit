"use client";

import { IconMenu2, IconMoon, IconSun, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const nextTheme =
      storedTheme === "dark" || storedTheme === "light"
        ? storedTheme
        : prefersDark
          ? "dark"
          : "light";

    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (pathname) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    const updateTheme = () => {
      setTheme(nextTheme);
      document.documentElement.dataset.theme = nextTheme;
      window.localStorage.setItem("theme", nextTheme);
    };

    if ("startViewTransition" in document) {
      document.startViewTransition(updateTheme);
    } else {
      updateTheme();
    }
  }

  return (
    <nav
      className="topbar relative flex h-20 items-center justify-between border-b-2 border-[var(--border)]"
      aria-label="Main navigation"
    >
      <Link
        className="wordmark text-[28px] font-bold tracking-[-0.1em]"
        href="/"
      >
        P<span>.</span>
      </Link>
      <div
        id="main-navigation"
        className={`nav-links absolute left-0 right-0 top-[80px] z-10 flex-col gap-0 border-b-2 border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_4px_0_var(--border)] md:static md:flex md:flex-row md:items-center md:gap-[30px] md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
          isMenuOpen ? "flex" : "hidden"
        }`}
      >
        {[
          ["Home", "/"],
          ["Work", "/work"],
          ["About", "/about"],
          ["Coding", "/coding"],
          ["Blog", "/blog"],
          ["Contact", "/contact"],
        ].map(([label, href]) => (
          <Link
            className={`border-b border-[var(--border)] py-3 text-[13px] font-bold uppercase tracking-[0.04em] last:border-0 md:border-0 md:py-0 ${
              pathname === href ? "text-[var(--primary)]" : ""
            }`}
            href={href}
            key={label}
          >
            {label}
          </Link>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          className="icon-button flex h-[38px] w-[38px] items-center justify-center"
          onClick={toggleTheme}
          type="button"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <IconMoon size={19} /> : <IconSun size={19} />}
        </button>
        <button
          className="icon-button flex h-[38px] w-[38px] items-center justify-center md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
        >
          {isMenuOpen ? <IconX size={19} /> : <IconMenu2 size={19} />}
        </button>
      </div>
    </nav>
  );
}
