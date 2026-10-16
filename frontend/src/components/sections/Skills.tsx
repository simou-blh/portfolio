import Section from "@/components/Section";
import Tag from "@/components/Tag";
import { skillGroups, certifications } from "@/data/skills";

export default function Skills() {
  return (
    <Section id="skills" label="04 — Skills & certifications" title="Toolbox.">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[22px]">
        {skillGroups.map((g) => (
          <div key={g.title} className="card">
            <h3 className="mb-2.5 text-[1.1rem] font-extrabold text-mint">{g.title}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((t) => <Tag key={t.name} {...t} />)}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-9">
        {certifications.map((c) => (
          <div key={c.title} className="flex flex-wrap justify-between gap-x-4 gap-y-1.5 border-b-[1.5px] border-line py-3.5 font-medium">
            <span>{c.title}</span>
            <small className="text-[0.95rem] opacity-75">{c.issuer} · {c.date}</small>
          </div>
        ))}
      </div>
    </Section>
  );
}