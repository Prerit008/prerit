"use client";

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconCheck,
  IconMail,
  IconMapPin,
  IconSend,
  IconLoader2,
} from "@tabler/icons-react";
import { type FormEvent, useState, useRef } from "react";
import { NeobrutalistCaptcha, type CaptchaRef } from "@/components/NeobrutalistCaptcha";
import data from "../../data.json"
const socialLinks = [
  {
    name: data.socialLinks[0].name,
    handle: data.socialLinks[0].handle,
    href: data.socialLinks[0].url,
    icon: data.socialLinks[0].icon === "github" ? IconBrandGithub : IconBrandLinkedin,
  },
  {
    name: data.socialLinks[1].name,
    handle: "@" + data.socialLinks[1].handle,
    href: data.socialLinks[1].url,
    icon: data.socialLinks[1].icon === "github" ? IconBrandGithub : IconBrandLinkedin,
  },
  {
    name: "Email",
    handle: data.personal.email,
    href: `mailto:${data.personal.email}`,
    icon: IconMail,
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const captchaRef = useRef<CaptchaRef>(null);
  const [loadTime] = useState(() => Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Validate custom CAPTCHA
    if (!captchaRef.current?.validate()) {
      setErrorMessage("Please solve the verification challenge.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      website: formData.get("website"), // Honeypot field
      formLoadTime: loadTime,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send message. Please try again.");
      }

      setIsSent(true);
      form.reset();
      captchaRef.current?.reset();
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="contact-page py-16 md:py-28">
      <div className="grid gap-14 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <div>
          <p className="eyebrow">06 / Contact</p>
          <h1>
            Let&apos;s make
            <br />
            <span className="hero-highlight">something useful.</span>
          </h1>
          <p className="contact-lede">
            Have a project, an idea, or a question? Send a note and I&apos;ll
            get back to you as soon as I can.
          </p>
          <div className="contact-facts">
            <span>
              <IconMapPin size={18} /> India / IST
            </span>
            <span>
              <IconMail size={18} /> Usually replies within 48 hours
            </span>
          </div>
          <div className="social-list">
            {socialLinks.map(({ name, handle, href, icon: Icon }) => (
              <a
                className="social-link"
                href={href}
                key={name}
                rel={
                  href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                target={href.startsWith("http") ? "_blank" : undefined}
              >
                <Icon size={21} />
                <span>
                  <b>{name}</b>
                  <small>{handle}</small>
                </span>
              </a>
            ))}
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <span>DROP A LINE</span>
            <span>FORM / 001</span>
          </div>

          {/* 🛡️ Honeypot Field */}
          <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <label>
            Your name
            <input name="name" placeholder="Rahul" required />
          </label>
          <label>
            Email address
            <input name="email" type="email" placeholder="you@example.com" required />
          </label>
          <label>
            What can I help with?
            <select defaultValue="" name="subject" required>
              <option disabled value="">Choose a topic</option>
              <option>Product design</option>
              <option>Frontend engineering</option>
              <option>Open source</option>
              <option>Something else</option>
            </select>
          </label>
          <label>
            Your message
            <textarea
              name="message"
              placeholder="Tell me a little about the thing you want to make..."
              required
              rows={5}
            />
          </label>

          {/* 🎨 Custom Neobrutalist CAPTCHA */}
          <NeobrutalistCaptcha
            ref={captchaRef}
            onVerify={(isValid) => setIsCaptchaValid(isValid)}
          />

          {errorMessage && (
            <p className="text-red-600 font-bold text-sm mt-1 uppercase tracking-wide">
              {errorMessage}
            </p>
          )}

          <button
            className="button button-primary form-submit"
            type="submit"
            disabled={isSubmitting || !isCaptchaValid}
          >
            {isSubmitting ? (
              <>
                Sending... <IconLoader2 size={18} className="animate-spin" />
              </>
            ) : isSent ? (
              <>
                Message Sent! <IconCheck size={18} />
              </>
            ) : (
              <>
                Send message <IconSend size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}