import { site } from "@/data/site";

export default function Contact() {
  return (
    <footer id="contact" className="border-t-2 border-line pb-12 pt-[clamp(40px,7vw,80px)]">
      <span className="mb-2.5 block font-medium text-mint">05 — Contact</span>
      <h2 className="mb-5 text-[clamp(2rem,5.5vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">
        Let&apos;s build something.
      </h2>
      <div className="flex flex-wrap gap-3.5">
        <a href={site.linkedin} target="_blank" rel="noopener" className="btn main">Message me on LinkedIn</a>
      </div>
      <p className="mt-9 text-[0.9rem] opacity-70">
        {site.location} · © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}