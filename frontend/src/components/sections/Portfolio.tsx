"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import TechIcon from "@/components/TechIcon";
import Tilt from "@/components/motion/Tilt";
import { projects } from "@/data/projects";
import { certifications, skillGroups } from "@/data/skills";
import { useSide } from "@/lib/side";

type TabId = "projects" | "certificates" | "stack";

const ico = {
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

const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
  {
    id: "projects",
    label: "Projects",
    icon: (
      <svg {...ico}>
        <path d="m16 18 6-6-6-6" />
        <path d="m8 6-6 6 6 6" />
      </svg>
    ),
  },
  {
    id: "certificates",
    label: "Certificates",
    icon: (
      <svg {...ico}>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
      </svg>
    ),
  },
  {
    id: "stack",
    label: "Tech Stack",
    icon: (
      <svg {...ico}>
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
      </svg>
    ),
  },
];

function ProjectsPanel() {
  const side = useSide();
  const featured = projects.filter((p) => p.featured);
  const rest = projects
    .filter((p) => !p.featured)
    .map((p, i) => ({ p, i }))
    .sort((a, b) => {
      if (side !== "sec") return a.i - b.i;
      return Number(!!b.p.securityNote) - Number(!!a.p.securityNote) || a.i - b.i;
    })
    .map((x) => x.p);
  return (
    <>
      {featured.map((p) => (
        <ProjectCard key={p.slug} p={p} />
      ))}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[22px]">
        {rest.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>
    </>
  );
}

function CertificatesPanel() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[22px]">
      {certifications.map((c) => (
        <Tilt key={c.title} className="glass flex h-full flex-col justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.05] p-6 backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-mint">
              <svg {...ico}>
                <circle cx="12" cy="8" r="6" />
                <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
              </svg>
            </span>
            <h4 className="text-[1.15rem] font-extrabold leading-snug">{c.title}</h4>
          </div>
          <p className="text-[0.95rem] opacity-80">
            <span className="font-bold text-mint">{c.issuer}</span> · {c.date}
          </p>
        </Tilt>
      ))}
    </div>
  );
}

function StackPanel() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[22px]">
      {skillGroups.map((g) => (
        <div key={g.title} className="glass rounded-2xl border border-white/15 bg-white/[0.05] p-5 backdrop-blur-xl">
          <h4 className="mb-4 text-[1.1rem] font-extrabold text-mint">{g.title}</h4>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] gap-3">
            {g.items.map((t) => (
              <li
                key={t.name}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center transition duration-200 hover:-translate-y-0.5 hover:border-white/25"
              >
                <TechIcon name={t.name} />
                <span className="text-[0.82rem] font-semibold leading-tight">{t.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function Portfolio() {
  const [tab, setTab] = useState<TabId>("projects");

  return (
    <Section id="projects" label={"03 \u2014 Portfolio"} title="Portfolio.">
      <span id="skills" aria-hidden="true" />
      <div className="mb-10 flex justify-center">
        <div role="tablist" className="glass inline-flex max-w-full flex-wrap gap-1 rounded-2xl p-1.5">
          {tabs.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => setTab(t.id)}
                className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[0.95rem] font-bold transition-colors ${
                  on ? "text-ink" : "opacity-80 hover:opacity-100"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="portfolio-tab"
                    className="absolute inset-0 rounded-xl bg-mint"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-2">
                  {t.icon}
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          role="tabpanel"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-[22px]"
        >
          {tab === "projects" && <ProjectsPanel />}
          {tab === "certificates" && <CertificatesPanel />}
          {tab === "stack" && <StackPanel />}
        </motion.div>
      </AnimatePresence>
    </Section>
  );
}