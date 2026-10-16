import type { ReactNode } from "react";

export default function Section({
  id, label, title, children,
}: { id: string; label: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="border-t-2 border-line py-[clamp(40px,7vw,88px)]">
      <span className="mb-2.5 block font-medium text-mint">{label}</span>
      <h2 className="mb-[clamp(22px,4vw,44px)] text-[clamp(2rem,5.5vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">
        {title}
      </h2>
      {children}
    </section>
  );
}