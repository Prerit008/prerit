import Link from "next/link";
import {
  IconArrowUpRight,
  IconCode,
  IconSparkles,
} from "@tabler/icons-react";

export default function UnderDevelopment() {
  return (
    <main className="under-development">
      <div className="under-development__grid" aria-hidden="true" />

      <div className="under-development__topline">
        <span className="under-development__mark">
          <IconCode size={18} aria-hidden="true" />
          PRERIT.DEV
        </span>

        <span className="under-development__status">
          <span className="under-development__dot" />
          In the lab
        </span>
      </div>

      <section
        className="under-development__content"
        aria-labelledby="development-title"
      >
        <p className="under-development__eyebrow">
          <IconSparkles size={18} aria-hidden="true" />
          A new digital space is taking shape
        </p>

        <h1 id="development-title">
          Good things
          <span> are compiling.</span>
        </h1>

        <p className="under-development__intro">
          prerit.dev is currently under development. I&apos;m building a
          sharper, more useful home for experiments, ideas, and things worth
          shipping.
        </p>

        <div
          className="under-development__progress"
          aria-label="Development in progress"
        >
          <div className="under-development__progress-label">
            <span>BUILD STATUS</span>
            <span>IN PROGRESS</span>
          </div>

          <div className="under-development__progress-track">
            <span />
          </div>
        </div>

        <div className="under-development__actions">
          <Link
            className="under-development__button"
            href="mailto:contact@prerit.dev"
          >
            Say hello
            <IconArrowUpRight size={19} aria-hidden="true" />
          </Link>

          <Link
            className="under-development__text-link"
            href="https://prerit.dev"
          >
            Visit portfolio
            <IconArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className="under-development__footer">
        <span>© Prerit Agarwal</span>
        <span>Greater Noida, India</span>
      </footer>
    </main>
  );
}