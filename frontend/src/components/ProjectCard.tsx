import Link from "next/link";
import type { Project } from "@/data/types";
import Tag from "./Tag";

export default function ProjectCard({ p }: { p: Project }) {
  const href = `/projects/${p.slug}/`;
  return (
    <article className={`card ${p.featured ? "light mb-[22px]" : ""}`}>
      {p.featured ? (
        <span className="mb-2.5 inline-block rounded-full bg-mint px-3 py-1 text-[0.8rem] font-extrabold text-ink">
          {p.kind}
        </span>
      ) : (
        <div className="mb-2 text-[2.4rem] font-extrabold leading-none text-coral">{p.number}</div>
      )}
      <h3 className="text-[clamp(1.3rem,2.4vw,1.8rem)] font-extrabold leading-[1.1] tracking-tight">
        <Link href={href} className="hover:underline">{p.title}</Link>
      </h3>
      {!p.featured && <p className="mb-3 mt-1.5 text-[0.95rem] opacity-80">{p.kind}</p>}
      {p.featured && <p className="mt-3">{p.summary}</p>}
      <ul className="mt-3 list-disc pl-[1.15rem]">
        {p.bullets.map((b) => <li key={b} className="my-1.5">{b}</li>)}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tags.map((t) => <Tag key={t.name} {...t} />)}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={href} className="btn">Case study</Link>
        {p.demoUrl && (
          <a href={p.demoUrl} target="_blank" rel="noopener" className="btn">Open live demo</a>
        )}
      </div>
    </article>
  );
}