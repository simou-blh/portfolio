"use client";

import { AnimatePresence, motion } from "motion/react";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { certifications } from "@/data/skills";
import { sideContent } from "@/data/sides";
import { useSide } from "@/lib/side";
import WordReveal from "@/components/motion/WordReveal";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import CountUp from "@/components/motion/CountUp";
import HeroBadgeLoader from "@/components/HeroBadgeLoader";

export default function Hero() {
  const side = useSide();
  const c = sideContent[side];
  const stats = [
    { to: 4, suffix: "th", label: "year at ESTIN" },
    { to: projects.length, suffix: "", label: "projects shipped or prototyped" },
    { to: certifications.length, suffix: "", label: "certifications in 2026" },
    { to: 3, suffix: "", label: "languages: AR / FR / EN" },
  ];
  return (
    <header
      id="top"
      className="relative isolate flex min-h-[clamp(640px,92vh,880px)] flex-col justify-center gap-10 pb-[clamp(40px,7vw,90px)] pt-[clamp(16px,4vw,48px)]"
    >
      {/* full-width badge layer, behind the text */}
      <div className="absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2">
        <HeroBadgeLoader />
      </div>

      <div className="pointer-events-none relative z-10 max-lg:mt-[340px] lg:max-w-[52%]">
        <Reveal y={16}>
          <div className="mb-6 inline-flex items-center gap-2.5 font-medium">
            <span className="dot" aria-hidden="true" />
            {site.status}
          </div>
        </Reveal>
        <h1 className="text-[clamp(2.4rem,5.6vw,5.4rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
          <WordReveal text="Ahmed Ouassim" delay={0.1} className="block" />
          <WordReveal text="Boulouh." className="block text-mint" delay={0.3} />
        </h1>
        <AnimatePresence mode="wait">
          <motion.div
            key={side}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
          >
            <span className="glass mt-6 inline-flex rounded-full px-4 py-1.5 text-[0.95rem] font-bold text-mint">
              {c.role}
            </span>
            <p className="mt-5 max-w-[52ch] text-[clamp(1.05rem,1.8vw,1.35rem)] font-medium leading-[1.4] text-paper/90">
              {c.tagline}
            </p>
          </motion.div>
        </AnimatePresence>
        <Reveal delay={0.75}>
          <div className="pointer-events-auto mt-8 flex flex-wrap gap-3.5">
            <Magnetic>
              <a href="#projects" className="btn main">See my work</a>
            </Magnetic>
            <Magnetic>
              <a href={site.linkedin} target="_blank" rel="noopener" className="btn">LinkedIn</a>
            </Magnetic>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.9} className="pointer-events-none relative z-10">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5">
          {stats.map((s) => (
            <div key={s.label} className="border-t-2 border-line pt-3">
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