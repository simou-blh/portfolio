import { site } from "@/data/site";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <footer id="contact" className="border-t-2 border-line pb-12 pt-[clamp(40px,7vw,80px)]">
      <span className="mb-2.5 block font-medium text-mint">05 — Contact</span>
      <div className="grid gap-[clamp(28px,5vw,64px)] lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="mb-5 text-[clamp(2rem,5.5vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">
            Let&apos;s build something.
          </h2>
          <p className="mb-7 max-w-[40ch] text-[clamp(1.05rem,1.6vw,1.25rem)] font-medium text-paper/90">
            Have a project, an internship offer or a question? Send me a message and I&apos;ll reply.
          </p>
          <a href={site.linkedin} target="_blank" rel="noopener" className="btn main">
            Message me on LinkedIn
          </a>
        </div>
        <ContactForm />
      </div>
      <p className="mt-9 text-[0.9rem] opacity-70">
        {site.location} · © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}