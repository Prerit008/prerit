"use client";

import { useEffect, useState } from "react";

const greetings = [
  "Hello!",
  "Namaste!",
  "Hola!",
  "Bonjour!",
  "こんにちは！",
  "Building for the web.",
  "Writing code with intent.",
];

export default function HeroGreeting() {
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentGreeting = greetings[greetingIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          const nextText = currentGreeting.slice(0, displayText.length + 1);
          setDisplayText(nextText);

          if (nextText === currentGreeting) {
            setIsDeleting(true);
          }
        } else {
          const nextText = currentGreeting.slice(0, displayText.length - 1);
          setDisplayText(nextText);

          if (nextText === "") {
            setIsDeleting(false);
            setGreetingIndex((prev) => (prev + 1) % greetings.length);
          }
        }
      },
      isDeleting
        ? 45
        : displayText.length === currentGreeting.length
          ? 6000
          : 100,
    );

    return () => clearTimeout(timeout);
  }, [displayText, greetingIndex, isDeleting]);

  return (
    <p className="eyebrow" aria-live="polite">
      {displayText}
      <span className="typewriter-cursor" aria-hidden="true">
        |
      </span>
    </p>
  );
}
