import {
  IconArrowUpRight,
  IconBook2,
  IconBrandCpp,
  IconBrandDocker,
  IconBrandGit,
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandPython,
  IconBrandReact,
  IconBrandTypescript,
  IconBriefcase2,
  IconCode,
  IconDatabase,
  IconDeviceLaptop,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import data from "../../data.json";
import HeroGame from "../components/HeroGame";
import HeroGreeting from "../components/HeroGreeting";

const { personal, socialLinks } = data;

const skills = [
  { name: "TypeScript", icon: IconBrandTypescript },
  { name: "React", icon: IconBrandReact },
  { name: "Next.js", icon: IconBrandNextjs },
  { name: "Node.js", icon: IconBrandNodejs },
  { name: "Python", icon: IconBrandPython },
  { name: "C++", icon: IconBrandCpp },
  { name: "SQL", icon: IconDatabase },
  { name: "Git", icon: IconBrandGit },
  { name: "Docker", icon: IconBrandDocker },
  { name: "Frontend", icon: IconCode },
];

const marqueeSkills = [
  ...skills.map((skill) => ({ key: `first-${skill.name}`, ...skill })),
  ...skills.map((skill) => ({ key: `second-${skill.name}`, ...skill })),
];

const socialIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  github: IconBrandGithub,
  linkedin: IconBrandLinkedin,
};

const homeRoutes = [
  {
    eyebrow: "01 / Selected work",
    title: "Things I build.",
    description:
      "Product interfaces, intelligent systems, and practical software built to solve real problems.",
    href: "/work",
    label: "Explore projects",
    icon: IconBriefcase2,
    accent: "home-route-purple",
  },
  {
    eyebrow: "02 / Problem solving",
    title: "How I think.",
    description:
      "A live view of solved problems and coding activity across the platforms where I practice.",
    href: "/coding",
    label: "View coding profile",
    icon: IconDeviceLaptop,
    accent: "home-route-yellow",
  },
  {
    eyebrow: "03 / Notes",
    title: "What I learn.",
    description:
      "Short field notes about engineering, design decisions, and making the web more useful.",
    href: "/blog",
    label: "Read the blog",
    icon: IconBook2,
    accent: "home-route-blue",
  },
  {
    eyebrow: "04 / The person",
    title: "What shaped me.",
    description: "The journey, education, and principles behind the work.",
    href: "/about",
    label: "Get to know me",
    icon: IconUser,
    accent: "home-route-pink",
  },
];

export default function HomePage() {
  return (
    <>
      <section
        className="relative flex min-h-[570px] flex-col justify-center gap-12 py-16 md:grid md:grid-cols-[minmax(0,1fr)_minmax(280px,390px)] md:items-center md:gap-14 md:py-24"
      >
        <div className="hero-copy max-w-[760px]">
          <HeroGreeting />
          <h2>
            I'm
            <br />
            <span className="hero-highlight">{personal.name}.</span>
          </h2>
          <p className="hero-intro">{personal.bio}</p>
          <div className="hero-actions mt-9 flex flex-wrap items-center gap-5">
            <Link className="button button-primary" href="/contact">
              Let&apos;s talk <IconArrowUpRight size={18} />
            </Link>

            {socialLinks.map((social) => {
              const IconTemp = socialIcons[social.icon];
              return (
                <a
                  className="text-link"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={social.name}
                  aria-label={social.name}
                >
                  <IconTemp size={28} />
                </a>
              );
            })}
          </div>
        </div>
        <div className="hero-game-wrapper mt-6 flex w-full justify-center md:mt-0">
          <HeroGame />
        </div>
      </section>
      <section className="marquee" aria-label="Technologies I work with">
        <div className="marquee-track">
          {marqueeSkills.map(({ key, name, icon: Icon }) => (
            <span className="marquee-skill" key={key}>
              <Icon size={22} stroke={1.8} aria-hidden="true" />
              <span>{name}</span>
            </span>
          ))}
        </div>
      </section>

      <section
        className="home-routes py-20 md:py-32"
        aria-labelledby="home-routes-title"
      >
        <div className="section-heading mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Start anywhere</p>
            <h2 id="home-routes-title">
              A closer look.
              <br />
              <span className="hero-highlight">Your call.</span>
            </h2>
          </div>
          <p className="section-note block">
            Pick a direction. Every page is a different angle on how I work.
          </p>
        </div>

        <div className="home-route-grid">
          {homeRoutes.map(
            ({
              eyebrow,
              title,
              description,
              href,
              label,
              icon: Icon,
              accent,
            }) => (
              <Link
                className={`home-route-card ${accent}`}
                href={href}
                key={href}
              >
                <div className="card-topline">
                  <span>{eyebrow}</span>
                  <Icon size={25} stroke={1.8} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="text-link">
                  {label} <IconArrowUpRight size={17} />
                </span>
              </Link>
            ),
          )}
        </div>
      </section>

      <section className="home-proof grid gap-6 py-4 pb-20 md:grid-cols-[1.25fr_0.75fr] md:gap-8 md:pb-32">
        <div className="home-proof-panel">
          <div className="card-topline">
            <span>THE SHORT VERSION</span>
            <span className="live-dot">AVAILABLE</span>
          </div>
          <h2>
            Design with intent.
            <br />
            Build with care.
          </h2>
          <p>
            I work across product thinking, frontend craft, backend systems, and
            the details that make software feel considered.
          </p>
          <Link className="button button-primary" href="/about">
            See the full story <IconArrowUpRight size={18} />
          </Link>
        </div>
        <div className="home-contact-panel">
          <IconMail size={28} aria-hidden="true" />
          <p className="eyebrow">Have a good problem?</p>
          <h3>Let&apos;s make something useful.</h3>
          <Link className="text-link" href="/contact">
            Start a conversation <IconArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}
