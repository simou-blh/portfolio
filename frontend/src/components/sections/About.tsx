"use client";

import { AnimatePresence, motion } from "motion/react";
import Section from "@/components/Section";
import Reveal from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";
import { site } from "@/data/site";
import { aboutFocus, aboutText } from "@/data/about";
import { useSide } from "@/lib/side";

const languages = [
  { name: "Arabic", level: "Fluent" },
  { name: "French", level: "B2" },
  { name: "English", level: "B2" },
  { name: "German", level: "A2" },
];

const label = "text-[0.78rem] font-bold uppercase tracking-[0.14em] text-mint";

export default function About() {
  const side = useSide();
  const focus = aboutFocus[side];

  return (
    <Section id="about" label={"01 \u2014 About"} title="Building end to end.">
      <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <AnimatePresence mode="wait">
            <motion.p
              key={side}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="max-w-[60ch] text-[clamp(1.1rem,1.8vw,1.4rem)] font-medium leading-[1.5] text-paper/90"
            >
              {aboutText[side]}
            </motion.p>
          </AnimatePresence>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Reveal delay={0.05}>
            <Tilt className="glass h-full rounded-2xl p-5">
              <span className={label}>Based in</span>
              <b className="mt-2 block text-[1.25rem] font-extrabold leading-tight">{site.location}</b>
            </Tilt>
          </Reveal>
          <Reveal delay={0.12}>
            <Tilt className="glass h-full rounded-2xl p-5">
              <span className={label}>Status</span>
              <b className="mt-2 block text-[1.25rem] font-extrabold leading-tight">{site.status}</b>
            </Tilt>
          </Reveal>

          <Reveal delay={0.19} className="sm:col-span-2">
            <Tilt className="glass h-full rounded-2xl p-5">
              <span className={label}>Languages</span>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
                {languages.map((l) => (
                  <li key={l.name}>
                    <b className="block text-[1.1rem] font-extrabold leading-tight">{l.name}</b>
                    <span className="text-[0.9rem] font-semibold text-mint">{l.level}</span>
                  </li>
                ))}
              </ul>
            </Tilt>
          </Reveal>

          <Reveal delay={0.26} className="sm:col-span-2">
            <Tilt className="glass h-full rounded-2xl p-5">
              <span className={label}>Focus</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={side}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <b className="mt-2 block text-[1.25rem] font-extrabold leading-tight">{focus.value}</b>
                  <span className="mt-1.5 block text-[0.95rem] leading-snug opacity-80">{focus.sub}</span>
                </motion.div>
              </AnimatePresence>
            </Tilt>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}