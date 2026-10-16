import Link from "next/link";
import Section from "@/components/Section";
import { journey } from "@/data/journey";

export default function Journey() {
  return (
    <Section id="experience" label="03 — Experience & education" title="The path so far.">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-[22px]">
        {journey.map((j) => (
          <article key={j.slug} className="card">
            <h3 className="text-[clamp(1.3rem,2.4vw,1.8rem)] font-extrabold leading-[1.1] tracking-tight">
              {j.hasPage ? (
                <Link href={`/${j.kind}/${j.slug}/`} className="hover:underline">{j.title}</Link>
              ) : j.title}
            </h3>
            <p className="mb-3 mt-1.5 text-[0.95rem] opacity-80">{j.org} · {j.period}</p>
            <ul className="list-disc pl-[1.15rem]">
              {j.bullets.map((b) => <li key={b} className="my-1.5">{b}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}