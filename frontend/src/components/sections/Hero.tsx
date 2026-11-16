import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { certifications } from "@/data/skills";
import WordReveal from "@/components/motion/WordReveal";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import CountUp from "@/components/motion/CountUp";

export default function Hero() {
  const stats = [
    { to: 4, suffix: "th", label: "year at ESTIN" },
    { to: projects.length, suffix: "", label: "projects shipped or prototyped" },
    { to: certifications.length, suffix: "", label: "certifications in 2026" },
    { to: 3, suffix: "", label: "languages: AR · FR · EN" },
  ];
  return (
    <header id="top" className="relative isolate pb-[clamp(40px,7vw,90px)] pt-[clamp(40px,9vw,120px)]">
      <Reveal y={16}>
        <div className="mb-6 inline-flex items-center gap-2.5 font-medium">
          <span className="dot" aria-hidden="true" />
          {site.status}
        </div>
      </Reveal>
      <h1 className="text-[clamp(2.8rem,10.5vw,8.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
        <WordReveal text="Ahmed Ouassim" delay={0.1} />{" "}
        <WordReveal text="Boulouh." className="text-mint" delay={0.3} />
      </h1>
      <Reveal delay={0.6}>
        <p className="mt-7 max-w-[52ch] text-[clamp(1.1rem,2vw,1.55rem)] font-medium leading-[1.35] text-paper/90">
          {site.tagline}
        </p>
      </Reveal>
      <Reveal delay={0.75}>
        <div className="mt-8 flex flex-wrap gap-3.5">
          <Magnetic>
            <a href="#projects" className="btn main">See my work</a>
          </Magnetic>
          <Magnetic>
            <a href={site.linkedin} target="_blank" rel="noopener" className="btn">LinkedIn</a>
          </Magnetic>
        </div>
      </Reveal>
      <Reveal delay={0.9} className="mt-[clamp(36px,6vw,64px)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
          {stats.map((s) => (
            <div key={s.label} className="border-t-2 border-paper pt-3">
              <b className="block text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none">
                <CountUp to={s.to} suffix={s.suffix} />
              </b>
              <span className="text-[0.95rem] opacity-85">{s.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </header>
  );
}