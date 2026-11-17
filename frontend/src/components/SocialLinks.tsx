import type { ReactNode } from "react";
import { site } from "@/data/site";

const svg = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const links: { label: string; href: string; icon: ReactNode }[] = [
  {
    label: "GitHub",
    href: site.github,
    icon: (
      <svg {...svg}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: `mailto:${site.email}`,
    icon: (
      <svg {...svg}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: site.instagram,
    icon: (
      <svg {...svg}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <path d="M17.5 6.5h.01" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: site.discord,
    icon: (
      <svg {...svg}>
        <path d="M5 6c2-1.2 4-1.8 7-1.8S17 4.8 19 6c1.5 3 2.2 6 2 10-1.8 1.5-3.4 2.3-5 2.8l-1-1.8c-1 .3-2 .4-3 .4s-2-.1-3-.4l-1 1.8c-1.6-.5-3.2-1.3-5-2.8-.2-4 .5-7 2-10z" />
        <circle cx="9" cy="12" r="1.2" />
        <circle cx="15" cy="12" r="1.2" />
      </svg>
    ),
  },
];

export default function SocialLinks() {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-4">
      <span className="text-[0.95rem] font-bold uppercase tracking-[0.14em] opacity-80">Find me</span>
      <ul className="flex items-center gap-3">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.label === "Email" ? undefined : "_blank"}
              rel="noopener"
              aria-label={l.label}
              title={l.label}
              className="glass inline-flex h-11 w-11 items-center justify-center rounded-full transition duration-200 hover:-translate-y-0.5 hover:text-mint"
            >
              {l.icon}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}