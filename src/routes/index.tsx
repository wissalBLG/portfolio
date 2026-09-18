import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";

import "../portfolio.css";
import heroImage from "@/assets/hero-circuit.jpg";
import portraitImage from "@/assets/portrait.jpg";
import { submitContact } from "@/lib/contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Belazreg Wissal Akila — Web Developer & Designer" },
      {
        name: "description",
        content:
          "Creative portfolio of Wissal Akila Belazreg: web development and embedded systems.",
      },
      { property: "og:title", content: "Belazreg Wissal Akila — Creative Portfolio" },
      {
        property: "og:description",
        content: "Web development and embedded systems — an elegant creative portfolio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.wissalblg.com/" },
      { property: "og:image", content: heroImage },
      {
        name: "keywords",
        content: "Wissal Akila Belazreg, web developer, React, IoT, embedded systems, Biskra",
      },
      { name: "theme-color", content: "#05100c" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Belazreg Wissal Akila — Web Developer & Designer" },
      { name: "twitter:description", content: "Web development and embedded systems portfolio." },
      { name: "twitter:image", content: heroImage },
    ],
    links: [{ rel: "canonical", href: "https://www.wissalblg.com/" }],
  }),
  component: Portfolio,
});

const NAV = [
  ["about", "ABOUT ME"],
  ["education", "EDUCATION"],
  ["skills", "SKILLS"],
  ["projects", "PROJECTS"],
  ["details", "DETAILS"],
  ["contact", "CONTACT"],
  ["thankyou", "THANK YOU"],
] as const;

const SKILLS = [
  ["Next.js", 85],
  ["React", 85],
  ["JavaScript", 85],
  ["Tailwind CSS", 90],
  ["C/C++", 70],
  ["ESP32 / MQTT / IoT", 78],
  ["Git & GitHub", 82],
  ["UI/UX Design (Figma)", 80],
] as const;

const EDUCATION = [
  {
    title: "B.Sc. in Computer Science — Mohamed Khider University of Biskra",
    meta: "2024 – Present · Biskra, Algeria",
    text: "Focus: Web Development, Data Structures, Operating Systems, Relational Databases, and IoT Systems.",
  },
  {
    title: "Baccalaureate in Experimental Sciences",
    meta: "2024",
    text: "Completed secondary education with a foundation in experimental sciences.",
  },
  {
    title: "IoT & Embedded Systems Integration",
    meta: "Certification",
    text: "Built practical knowledge of connected devices, embedded systems, and IoT integration.",
  },
];

const PROJECTS = [
  {
    name: "CentinelAgro IoT Solution",
    description:
      "Agricultural monitoring setup with real-time sensor telemetry and cloud rule chains.",
    tags: ["IoT", "Sensors", "MQTT"],
    link: "https://github.com/wissalBLG/CentinelaAgro",
  },
  {
    name: "Personal Developer Portfolio",
    description: "Responsive web portfolio featuring modern UI design and interactive sections.",
    tags: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    name: "Tripora Landing Page",
    description:
      "Modern landing page design for a travel website with interactive destinations and clean UI components.",
    tags: ["React", "Tailwind CSS", "UI/UX"],
  },
  {
    name: "Meadow Watch",
    description:
      "ESP32-S3 pet-care monitor that tracks water level and motion, logs readings to Supabase, and provides a Vercel dashboard for feed and refill commands.",
    tags: ["ESP32-S3", "Supabase", "IoT", "Vercel"],
    link: "https://meadow-watch.vercel.app/",
  },
];

const DETAILS = [
  ["Location", "Biskra, Algeria"],
  ["Languages", "Arabic (Native), English (Fluent), French (Fluent)"],
  ["Focus", "Web Development & Embedded Systems"],
  ["Interests", "IoT, Smart Technologies, Front-End UI/UX"],
  ["Tools", "VS Code, Figma, ThingsBoard, Git"],
  ["Availability", "Open for entry-level projects and learning opportunities"],
] as const;

function scrollToId(id: string, reduced: boolean) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const reducedRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setLoaded(true);

    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".reveal"));

    const fill = (el: HTMLElement) => {
      el.querySelectorAll<HTMLElement>(".skill-bar-fill").forEach((bar) => {
        const target = bar.dataset["fill"];
        if (target) bar.style.width = `${target}%`;
      });
    };

    if (reducedRef.current || !("IntersectionObserver" in window)) {
      els.forEach((el) => {
        el.classList.add("in-view");
        fill(el);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            fill(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ text: string; ok: boolean }>({ text: "", ok: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: Record<string, string> = {};
    if (!name) next["name"] = "Please enter your name.";
    if (!email) next["email"] = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next["email"] = "Please enter a valid email address.";
    if (!message) next["message"] = "Please enter a message.";
    setErrors(next);
    return { valid: Object.keys(next).length === 0, name };
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const { valid, name } = validate(form);
    if (!valid) {
      setStatus({ text: "Please fix the highlighted fields before sending.", ok: false });
      return;
    }
    const email = String(new FormData(form).get("email") ?? "").trim();
    const message = String(new FormData(form).get("message") ?? "").trim();
    const website = String(new FormData(form).get("website") ?? "").trim();
    setIsSubmitting(true);
    setStatus({ text: "Sending your message...", ok: true });

    try {
      await submitContact({ data: { name, email, message, website } });
      setStatus({ text: "Thanks! Your message has been sent.", ok: true });
      form.reset();
      setErrors({});
    } catch (error) {
      console.error("Contact form submission failed", error);
      setStatus({
        text: "We could not send your message. Please try again later.",
        ok: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadClass = (i: number) => `reveal-load${loaded ? " in-view" : ""}`;
  const loadStyle = (i: number): CSSProperties => ({ transitionDelay: `${150 + i * 160}ms` });

  return (
    <div ref={rootRef} style={{ "--hero-image": `url(${heroImage})` } as CSSProperties}>
      <section className="home" id="home">
        <div className={loadClass(0)} style={loadStyle(0)}>
          <h4>
            BELAZREG <span className="accent-name">WISSAL AKILA</span>
          </h4>
        </div>
        <div className={`h5 ${loadClass(1)}`} style={loadStyle(1)}>
          <h1>
            <span className="gradient-text">PORTFOLIO</span>
          </h1>
        </div>
        <div className={`line ${loadClass(2)}`} style={loadStyle(2)}>
          <div className="h52">
            <h4>
              <em>CREATIVE</em> PORTFOLIO
            </h4>
          </div>
          <div className="h53">
            <h4>www.wissalblg.com</h4>
          </div>
        </div>
      </section>

      <section className="abt-me" id="toc">
        <h2 className="tab">table of content</h2>
        <div className="btn-menu" role="navigation" aria-label="Section navigation">
          {NAV.map(([target, label]) => (
            <button
              key={target}
              className="btn1"
              type="button"
              onClick={() => scrollToId(target, reducedRef.current)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="def" id="about">
        <h2 className="tab">about me</h2>
        <div className="content-col">
          <div className="hud-wrapper">
            <div className="circle" aria-hidden="true" />
            <div className="portrait reveal">
              <img
                src={portraitImage}
                alt="Portrait of Wissal Akila Belazreg"
                width={400}
                height={400}
                loading="lazy"
              />
            </div>
          </div>
          <p className="p reveal">
            Hello, I'm <strong className="accent-text">Wissal</strong> — a{" "}
            <strong className="highlight">web developer</strong> with a strong interest in{" "}
            <em className="accent-text-soft">embedded systems and smart technologies</em>. I enjoy
            building at every level, from intuitive user interfaces to low-level systems that
            interact directly with hardware. I speak{" "}
            <strong className="accent-text">Arabic, English, and French</strong>, bridging
            communication between design, code, and diverse teams. Curious and detail-driven, I'm
            always experimenting with new tools, frameworks, and embedded solutions to push ideas
            further.
          </p>
        </div>
      </section>

      <Divider />

      <section className="panel" id="education">
        <div className="panel-inner">
          <h2 className="tab">education</h2>
          <p className="section-note reveal">
            Building a strong foundation in software engineering, web development, and connected
            systems.
          </p>
          <Timeline items={EDUCATION} />
        </div>
      </section>

      <Divider />

      <section className="panel" id="skills">
        <div className="panel-inner">
          <h2 className="tab">skills</h2>
          <div className="skills-grid reveal">
            {SKILLS.map(([name, value], i) => (
              <div className="skill" key={`${name}-${i}`}>
                <h4>{name}</h4>
                <div className="skill-bar">
                  <div className="skill-bar-fill" data-fill={value} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      <section className="panel" id="projects">
        <div className="panel-inner">
          <h2 className="tab">projects</h2>
          <p className="section-note reveal">
            Selected projects combining thoughtful interfaces with practical connected technology.
          </p>
          <div className="project-grid reveal">
            {PROJECTS.map((project, i) => (
              <article className="project-card" key={i}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                {"link" in project && (
                  <a
                    className="project-link"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View project
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      <section className="panel" id="details">
        <div className="panel-inner">
          <h2 className="tab">details</h2>
          <ul className="details-list reveal">
            {DETAILS.map(([label, value]) => (
              <li key={label}>
                <strong>{label}</strong>
                {value}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Divider />

      <section className="panel" id="contact">
        <div className="panel-inner">
          <h2 className="tab">contact</h2>
          <div className="contact-layout">
            <form className="contact-form reveal" onSubmit={onSubmit} noValidate>
              <div className="honeypot" aria-hidden="true">
                <label htmlFor="cf-website">Website</label>
                <input
                  id="cf-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div className="field">
                <label htmlFor="cf-name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="cf-name"
                  placeholder="Your name"
                  autoComplete="name"
                  maxLength={100}
                  required
                  aria-describedby="cf-name-error"
                  aria-invalid={Boolean(errors["name"])}
                  className={errors["name"] ? "invalid" : ""}
                />
                <span id="cf-name-error" className="field-error">
                  {errors["name"] ?? ""}
                </span>
              </div>
              <div className="field">
                <label htmlFor="cf-email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="cf-email"
                  placeholder="Your email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  aria-describedby="cf-email-error"
                  aria-invalid={Boolean(errors["email"])}
                  className={errors["email"] ? "invalid" : ""}
                />
                <span id="cf-email-error" className="field-error">
                  {errors["email"] ?? ""}
                </span>
              </div>
              <div className="field">
                <label htmlFor="cf-message">Message</label>
                <textarea
                  name="message"
                  id="cf-message"
                  rows={5}
                  placeholder="Your message"
                  maxLength={5000}
                  required
                  aria-describedby="cf-message-error"
                  aria-invalid={Boolean(errors["message"])}
                  className={errors["message"] ? "invalid" : ""}
                />
                <span id="cf-message-error" className="field-error">
                  {errors["message"] ?? ""}
                </span>
              </div>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
              <p
                className="form-status"
                role="status"
                aria-live="polite"
                style={status.ok ? undefined : { color: "#ffb3b3" }}
              >
                {status.text}
              </p>
            </form>
            <div className="contact-links reveal">
              <a href="mailto:wassowissal633@gmail.com">Email: wassowissal633@gmail.com</a>
              <a href="https://www.wissalblg.com" target="_blank" rel="noopener">
                Website: www.wissalblg.com
              </a>
              <a href="https://github.com/wissalBLG" target="_blank" rel="noopener">
                GitHub: github.com/wissalBLG
              </a>
              <a
                href="https://www.linkedin.com/in/wissal-belazreg-194a92389/"
                target="_blank"
                rel="noopener"
              >
                LinkedIn: linkedin.com/in/wissal-belazreg-194a92389
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="panel thankyou" id="thankyou">
        <h2 className="reveal">
          THANK <em>YOU</em>
        </h2>
        <p className="reveal">
          Thanks for taking the time to look through my portfolio. Feel free to reach out through
          the contact section, I'd <strong className="accent-text">love</strong> to hear from you.
        </p>
        <button
          className="back-to-top reveal"
          type="button"
          onClick={() => scrollToId("home", reducedRef.current)}
        >
          Back to top
        </button>
      </section>
    </div>
  );
}

function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <span />
    </div>
  );
}

function Timeline({ items }: { items: { title: string; meta: string; text: string }[] }) {
  return (
    <ul className="timeline reveal">
      {items.map((item, i) => (
        <li key={i}>
          <h3>{item.title}</h3>
          <span className="meta">{item.meta}</span>
          <p>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}
