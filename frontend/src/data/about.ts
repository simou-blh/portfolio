import type { Side } from "@/lib/side";
import { site } from "@/data/site";

export const aboutText: Record<Side, string> = {
  dev: site.about,
  sec: "I'm a 4th-year Computer Science student at ESTIN in Guelma, Algeria, focused on cybersecurity. I think like an attacker to build things that hold: secure authentication, REST APIs and defensive design, backed by the full-stack skills to ship real products.",
};

export const aboutFocus: Record<Side, { value: string; sub: string }> = {
  dev: {
    value: "Full-stack products",
    sub: "Database, secure authentication, REST APIs and polished responsive interfaces.",
  },
  sec: {
    value: "Security mindset",
    sub: "Secure web development, vulnerability research and defensive thinking.",
  },
};