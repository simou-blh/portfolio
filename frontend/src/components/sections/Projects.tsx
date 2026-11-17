"use client";

import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/motion/Reveal";
import { projects } from "@/data/projects";
import { useSide } from "@/lib/side";

export default function Projects() {
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
    <Section id="projects" label={"02 \u2014 Projects"} title="Selected work.">
      {featured.map((p) => (
        <Reveal key={p.slug}>
          <ProjectCard p={p} />
        </Reveal>
      ))}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[22px]">
        {rest.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 3) * 0.08} className="h-full">
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}