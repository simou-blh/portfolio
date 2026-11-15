import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JourneyDetail from "@/components/JourneyDetail";
import { journey } from "@/data/journey";

const entries = journey.filter((j) => j.kind === "experience" && j.hasPage);

export const dynamicParams = false;

export function generateStaticParams() {
  return entries.map((j) => ({ slug: j.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const e = entries.find((x) => x.slug === slug);
  if (!e) return {};
  return { title: `${e.title} — Ahmed Ouassim Boulouh`, description: e.description ?? e.bullets[0] };
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params;
  const entry = entries.find((x) => x.slug === slug);
  if (!entry) notFound();
  return <JourneyDetail entry={entry} entries={entries} />;
}