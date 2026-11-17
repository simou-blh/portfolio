import type { ReactNode } from "react";
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedinIn, FaLocationDot } from "react-icons/fa6";
import { site } from "@/data/site";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/motion/Reveal";

const links: { name: string; handle: string; href: string; icon: ReactNode }[] = [
  { name: "LinkedIn", handle: "boulouh-ahmed-ouassim", href: site.linkedin, icon: <FaLinkedinIn /> },
  { name: "GitHub", handle: "@simou-blh", href: site.github, icon: <FaGithub /> },
  { name: "Instagram", handle: "@simoublh", href: site.instagram, icon: <FaInstagram /> },
];

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 opacity-60 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function Info({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-mint">{icon}</span>
      <div>
        <span className="block text-[0.78rem] font-bold uppercase tracking-[0.14em] opacity-60">{label}</span>
        {children}
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <footer id="contact" className="border-t-2 border-line pb-12 pt-[clamp(40px,7vw,80px)]">
      <span className="mb-2.5 block text-center font-medium text-mint">{"04 \u2014 Contact"}</span>
      <h2 className="mb-3 text-center text-[clamp(2rem,5.5vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">
        Let&apos;s build something.
      </h2>
      <p className="mx-auto mb-10 max-w-[50ch] text-center text-[clamp(1.05rem,1.6vw,1.25rem)] font-medium text-paper/85">
        Have a project, an internship offer or a question? Send me a message and I&apos;ll reply.
      </p>

      <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h3 className="mb-1 text-[1.6rem] font-extrabold text-mint">Send a message</h3>
            <p className="mb-6 opacity-80">It goes straight to my inbox.</p>
            <ContactForm />

            <div className="mt-8 border-t border-white/10 pt-6">
              <h4 className="mb-4 text-[0.95rem] font-extrabold uppercase tracking-[0.18em]">Find me</h4>
              <div className="grid gap-3">
                {links.map((l) => (
                  <a
                    key={l.name}
                    href={l.href}
                    target="_blank"
                    rel="noopener"
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-mint/60 hover:bg-white/[0.06]"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/10 text-[1.35rem] text-mint">
                      {l.icon}
                    </span>
                    <span className="grow">
                      <b className="block text-[1.05rem] font-bold leading-tight">{l.name}</b>
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
          <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:sticky lg:top-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 animate-pulse rounded-full bg-mint/20 blur-3xl"
            />
            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2.5 font-medium">
                <span className="dot" aria-hidden="true" />
                {site.status}
              </div>
              <h3 className="mb-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
                Let&apos;s talk.
              </h3>
              <p className="mb-7 max-w-[42ch] text-[1.05rem] leading-[1.5] opacity-85">
                Internship, project or just a question? I read every message and reply as soon as I can.
              </p>

              <div className="mb-8 grid gap-5">
                <Info icon={<FaEnvelope />} label="Email">
                  <a href={`mailto:${site.email}`} className="font-bold transition hover:text-mint">
                    {site.email}
                  </a>
                </Info>
                <Info icon={<FaLocationDot />} label="Based in">
                  <b className="font-bold">{site.location}</b>
                </Info>
              </div>

              <div className="flex flex-wrap gap-3.5">
                <a href={site.cvUrl} download className="btn main">
                  Download my CV
                </a>
                <a href={site.linkedin} target="_blank" rel="noopener" className="btn">
                  Message me on LinkedIn
                </a>
              </div>
            </div>
          </div>
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