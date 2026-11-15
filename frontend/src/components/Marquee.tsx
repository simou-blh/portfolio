import { skillGroups } from "@/data/skills";

const items = [...new Set(skillGroups.flatMap((g) => g.items.map((t) => t.name)))];

function Row() {
  return (
    <div className="flex shrink-0 gap-8 pr-8">
      {items.map((n) => (
        <span key={n} className="flex items-center gap-8 whitespace-nowrap">
          {n}
          <span className="text-coral">{"\u2726"}</span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y-2 border-line py-5 text-[clamp(1.4rem,3vw,2.2rem)] font-extrabold uppercase tracking-tight"
    >
      <div className="marquee">
        <Row />
        <Row />
      </div>
    </div>
  );
}