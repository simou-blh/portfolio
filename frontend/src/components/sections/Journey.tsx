import Link from "next/link";
import Section from "@/components/Section";
import Reveal from "@/components/motion/Reveal";
import Logo from "@/components/Logo";
import { journey } from "@/data/journey";
import type { JourneyEntry } from "@/data/types";

function Entry({ j }: { j: JourneyEntry }) {
  const body = (
    <article className="card lift flex items-center gap-4 !p-5">
      <Logo text={j.org} />
      <div className="min-w-0">
        <h4 className="text-[1.15rem] font-extrabold leading-tight">{j.title}</h4>
        <p className="mt-0.5 text-[0.95rem] opacity-80">{j.org}</p>
        <p className="mt-1 text-[0.95rem] font-bold text-mint">{j.period}</p>
      </div>
    </article>
  );
  return j.hasPage ? <Link href={`/${j.kind}/${j.slug}/`} className="block">{body}</Link> : body;
}

function Column({ title, kind, delay }: { title: string; kind: JourneyEntry["kind"]; delay: number }) {
  const items = journey.filter((j) => j.kind === kind);
  return (
    <div>
      <h3 className="mb-5 text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold tracking-tight">{title}</h3>
      <div className="flex flex-col gap-4">
        {items.map((j, i) => (
          <Reveal key={j.slug} delay={delay + i * 0.08}>
            <Entry j={j} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Journey() {
  return (
    <Section id="experience" label={"02 \u2014 Education & experience"} title="The path so far.">
      <div className="grid gap-10 lg:grid-cols-2">
        <Column title="Education" kind="education" delay={0} />
        <Column title="Experience" kind="experience" delay={0.1} />
      </div>
    </Section>
  );
}