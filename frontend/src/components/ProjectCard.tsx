"use client";

import Link from "next/link";
import type { Project } from "@/data/types";
import { useSide } from "@/lib/side";
import Tag from "./Tag";

export default function ProjectCard({ p }: { p: Project }) {
  const side = useSide();
  const href = `/projects/${p.slug}/`;
  return (
    <article className={`card lift ${p.featured ? "light mb-[22px]" : "h-full"}`}>
      {p.image && (
        <Link href={href} className="mb-4 block overflow-hidden rounded-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.title} loading="lazy" className="aspect-[16/9] w-full object-cover" />
        </Link>
      )}
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
      {side === "sec" && p.securityNote && (
        <p className="mt-3 rounded-lg border border-current/20 px-3 py-2 text-[0.92rem] leading-snug">
          <b className="mr-1.5 text-[0.75rem] font-extrabold uppercase tracking-[0.12em]">Security</b>
          {p.securityNote}
        </p>
      )}
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