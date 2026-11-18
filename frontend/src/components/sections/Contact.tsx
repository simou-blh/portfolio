import type { ReactNode } from "react";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { site } from "@/data/site";
import ContactForm from "@/components/ContactForm";
import Comments from "@/components/Comments";
import Reveal from "@/components/motion/Reveal";

const links: { name: string; handle: string; href: string; icon: ReactNode }[] = [
  { name: "LinkedIn", handle: "boulouh-ahmed-ouassim", href: site.linkedin, icon: <FaLinkedinIn /> },
  { name: "GitHub", handle: "@simou-blh", href: site.github, icon: <FaGithub /> },
  { name: "Instagram", handle: "@simoublh", href: site.instagram, icon: <FaInstagram /> },
];

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className="shrink-0 opacity-60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export default function Contact() {
  return (
    <footer id="contact" className="border-t-2 border-line pb-12 pt-[clamp(40px,7vw,80px)]">
      <span className="mb-2.5 block text-center font-medium text-mint">{"04 \u2014 Contact"}</span>
      <h2 className="mb-12 text-center text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold leading-none tracking-[-0.03em]">
        Contact me
      </h2>

      <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h3 className="mb-1 text-[1.9rem] font-extrabold leading-tight text-mint">Get in touch</h3>
            <p className="mb-6 max-w-[34ch] text-[1.05rem] opacity-80">
              Something to discuss? Send me a message directly.
            </p>
            <ContactForm />

            <div className="mt-8 border-t border-white/10 pt-7">
              <h4 className="mb-4 text-[1.35rem] font-extrabold uppercase tracking-[0.04em]">Find me</h4>
              <div className="grid gap-3.5">
                {links.map((l) => (
                  <a
                    key={l.name} href={l.href} target="_blank" rel="noopener"
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-mint/60 hover:bg-white/[0.06]"
                  >
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white/10 text-[1.5rem] text-mint">
                      {l.icon}
                    </span>
                    <span className="grow">
                      <b className="block text-[1.15rem] font-bold leading-tight">{l.name}</b>
                      <span className="text-[0.95rem] opacity-70">{l.handle}</span>
                    </span>
                    <Arrow />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Comments />
        </Reveal>
      </div>

      <p className="mt-9 text-center text-[0.9rem] opacity-70">
        {site.location}
        {" \u00b7 \u00a9 "}
        {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}