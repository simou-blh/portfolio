import Section from "@/components/Section";
import Reveal from "@/components/motion/Reveal";
import { site } from "@/data/site";

export default function About() {
  return (
    <Section id="about" label="01 — About" title="Building end to end.">
      <Reveal>
        <p className="max-w-[60ch] text-[clamp(1.1rem,1.8vw,1.4rem)] font-medium text-paper/90">{site.about}</p>
      </Reveal>
    </Section>
  );
}