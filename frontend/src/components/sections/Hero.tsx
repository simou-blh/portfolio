import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { certifications } from "@/data/skills";

export default function Hero() {
  const stats = [
    ["4th", "year at ESTIN"],
    [String(projects.length), "projects shipped or prototyped"],
    [String(certifications.length), "certifications in 2026"],
    ["3", "languages: AR · FR · EN"],
  ];
  return (
    <header id="top" className="pb-[clamp(40px,7vw,90px)] pt-[clamp(40px,9vw,120px)]">
      <div className="mb-6 inline-flex items-center gap-2.5 font-medium">
        <span className="dot" aria-hidden="true" />
        {site.status}
      </div>
      <h1 className="text-[clamp(2.8rem,10.5vw,8.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
        Ahmed Ouassim <span className="text-mint">Boulouh.</span>
      </h1>
      <p className="mt-7 max-w-[36ch] text-[clamp(1.1rem,2vw,1.55rem)] font-medium leading-[1.35] text-paper/90">
        {site.tagline}
      </p>
      <div className="mt-8 flex flex-wrap gap-3.5">
        <a href="#projects" className="btn main">See my work</a>
        <a href={site.linkedin} target="_blank" rel="noopener" className="btn">LinkedIn</a>
      </div>
      <div className="mt-[clamp(36px,6vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
        {stats.map(([n, label]) => (
          <div key={label} className="border-t-2 border-paper pt-3">
            <b className="block text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none">{n}</b>
            <span className="text-[0.95rem] opacity-85">{label}</span>
          </div>
        ))}
      </div>
    </header>
  );
}