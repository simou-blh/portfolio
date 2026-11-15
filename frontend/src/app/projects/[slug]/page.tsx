import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DetailShell, { Block, BulletList } from "@/components/DetailShell";
import Tag from "@/components/Tag";
import { projects, getProject } from "@/data/projects";

export const dynamicParams = false; // static export: only known slugs exist

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${p.title} — Ahmed Ouassim Boulouh`, description: p.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i === -1) notFound();
  const p = projects[i];
  const prev = projects[i - 1];
  const next = projects[i + 1];

  return (
    <DetailShell
      backHref="/#projects"
      backLabel="All projects"
      label={`Project ${p.number}`}
      title={p.title}
      meta={[p.kind, p.year, p.role]}
      actions={
        <>
          {p.demoUrl && (
            <a href={p.demoUrl} target="_blank" rel="noopener" className="btn main">Open live demo</a>
          )}
          {p.repoUrl && (
            <a href={p.repoUrl} target="_blank" rel="noopener" className="btn">View code</a>
          )}
        </>
      }
      prev={prev && { href: `/projects/${prev.slug}/`, title: prev.title }}
      next={next && { href: `/projects/${next.slug}/`, title: next.title }}
    >
      <Block title="Overview">
        <p className="max-w-[65ch] text-[clamp(1.1rem,1.8vw,1.4rem)] font-medium text-paper/90">
          {p.overview ?? p.summary}
        </p>
      </Block>
      <Block title="What I built">
        <BulletList items={p.highlights ?? p.bullets} />
      </Block>
      {p.challenges && (
        <Block title="Challenges & decisions">
          <BulletList items={p.challenges} />
        </Block>
      )}
      <Block title="Stack">
        <div className="flex flex-wrap gap-2">
          {p.tags.map((t) => <Tag key={t.name} {...t} />)}
        </div>
      </Block>
    </DetailShell>
  );
}