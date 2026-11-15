import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/motion/Reveal";
import { projects } from "@/data/projects";

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return (
    <Section id="projects" label="02 — Projects" title="Selected work.">
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