import type { Tech } from "./types";

export const skillGroups: { title: string; items: Tech[] }[] = [
  { title: "Languages", items: ["JavaScript", "TypeScript", "Python", "SQL", "Dart", "HTML/CSS"].map((name) => ({ name })) },
  { title: "Frontend", items: [{ name: "React" }, { name: "Next.js" }, { name: "Vite" }, { name: "RTL / i18n", tone: "coral" }] },
  { title: "Backend", items: ["Django REST", "FastAPI", "Node.js", "JWT"].map((name) => ({ name })) },
  {
    title: "Data & tools",
    items: [
      { name: "PostgreSQL" }, { name: "MySQL" }, { name: "SQLite" },
      { name: "Git", tone: "ice" }, { name: "Vercel", tone: "ice" },
      { name: "Azure ML", tone: "ice" }, { name: "WordPress", tone: "ice" },
    ],
  },
];

export const certifications = [
  { title: "Machine Learning Pipelines with Azure ML Studio", issuer: "Coursera", date: "Oct 2026" },
  { title: "React Hooks Crash Course", issuer: "GreatStack", date: "Sep 2026" },
  { title: "JavaScript Fundamentals", issuer: "GreatStack", date: "Sep 2026" },
  { title: "Protecting a Device with Malwarebytes", issuer: "IBM SkillsBuild", date: "Sep 2026" },
  { title: "Building WordPress Websites", issuer: "Coursera", date: "Aug 2026" },
];