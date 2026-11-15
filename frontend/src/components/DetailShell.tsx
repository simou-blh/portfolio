import Link from "next/link";
import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import Contact from "@/components/sections/Contact";

type Neighbor = { href: string; title: string };

export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t-2 border-line pt-8">
      <h2 className="mb-4 text-[clamp(1.3rem,2.6vw,1.9rem)] font-extrabold tracking-tight text-mint">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="max-w-[65ch] list-disc space-y-2.5 pl-[1.15rem] text-[clamp(1.05rem,1.6vw,1.25rem)]">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

type Props = {
  backHref: string;
  backLabel: string;
  label: string;
  title: string;
  meta?: (string | undefined)[];
  actions?: ReactNode;
  prev?: Neighbor;
  next?: Neighbor;
  children: ReactNode;
};

export default function DetailShell({
  backHref, backLabel, label, title, meta = [], actions, prev, next, children,
}: Props) {
  const metaItems = meta.filter(Boolean);
  return (
    <div className="wrap">
      <Nav />
      <main className="pb-[clamp(40px,7vw,88px)] pt-[clamp(20px,4vw,48px)]">
        <Link href={backHref} className="font-medium text-mint hover:underline">
          ← {backLabel}
        </Link>
        <span className="mb-2.5 mt-8 block font-medium text-mint">{label}</span>
        <h1 className="text-[clamp(2.2rem,7vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
          {title}
        </h1>
        {metaItems.length > 0 && (
          <p className="mt-6 text-[1.05rem] font-medium opacity-85">{metaItems.join(" · ")}</p>
        )}
        {actions && <div className="mt-7 flex flex-wrap gap-3.5">{actions}</div>}

        <div className="mt-[clamp(32px,5vw,64px)] grid gap-10">{children}</div>

        {(prev || next) && (
          <div className="mt-16 grid gap-[22px] sm:grid-cols-2">
            {prev ? (
              <Link href={prev.href} className="card font-extrabold hover:text-mint">← {prev.title}</Link>
            ) : <span />}
            {next ? (
              <Link href={next.href} className="card text-right font-extrabold hover:text-mint">{next.title} →</Link>
            ) : <span />}
          </div>
        )}
      </main>
      <Contact />
    </div>
  );
}