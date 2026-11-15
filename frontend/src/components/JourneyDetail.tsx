import DetailShell, { Block, BulletList } from "@/components/DetailShell";
import type { JourneyEntry } from "@/data/types";

export default function JourneyDetail({
  entry, entries,
}: { entry: JourneyEntry; entries: JourneyEntry[] }) {
  const i = entries.findIndex((e) => e.slug === entry.slug);
  const link = (e?: JourneyEntry) =>
    e ? { href: `/${e.kind}/${e.slug}/`, title: e.title } : undefined;

  return (
    <DetailShell
      backHref="/#experience"
      backLabel="Experience & education"
      label={entry.kind === "experience" ? "Experience" : "Education"}
      title={entry.title}
      meta={[entry.org, entry.period]}
      prev={link(entries[i - 1])}
      next={link(entries[i + 1])}
    >
      <Block title="Summary">
        <p className="max-w-[65ch] text-[clamp(1.1rem,1.8vw,1.4rem)] font-medium text-paper/90">
          {entry.description ?? entry.bullets[0]}
        </p>
      </Block>
      <Block title="Highlights">
        <BulletList items={entry.highlights ?? entry.bullets} />
      </Block>
    </DetailShell>
  );
}