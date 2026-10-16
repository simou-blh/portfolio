import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return (
    <Section id="projects" label="02 — Projects" title="Selected work.">
      {featured.map((p) => <ProjectCard key={p.slug} p={p} />)}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[22px]">
        {rest.map((p) => <ProjectCard key={p.slug} p={p} />)}
      </div>
    </Section>
  );
}