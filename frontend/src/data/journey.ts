import type { JourneyEntry } from "./types";

export const journey: JourneyEntry[] = [
  {
    slug: "algerie-telecom-intern",
    kind: "experience",
    title: "Software Engineer Intern",
    org: "Algérie Télécom · Guelma, hybrid",
    period: "Jun 2026",
    bullets: ["Software design and full-stack development for an internal IT support platform."],
    hasPage: true,
  },
  {
    slug: "estin",
    kind: "education",
    title: "ESTIN — Computer Science",
    org: "ESTIN, Guelma",
    period: "Sep 2023 – Jul 2028",
    bullets: ["Algorithms and complexity, relational databases, operations research, cryptography."],
    hasPage: true,
  },
  {
    slug: "baccalaureate",
    kind: "education",
    title: "Baccalaureate, Experimental Sciences",
    org: "Lycée Mahmoud Ben Mahmoud",
    period: "2021 – 2023",
    bullets: ["Grade: Très bien (17.79)."],
    hasPage: false,
  },
];

export const getJourneyEntry = (slug: string) => journey.find((j) => j.slug === slug);