export type Tone = "mint" | "coral" | "ice";
export type Tech = { name: string; tone?: Tone };

export type Project = {
  slug: string;
  number: string;
  title: string;
  kind: string;
  summary: string;
  bullets: string[];
  tags: Tech[];
  featured?: boolean;
  demoUrl?: string;
};

export type JourneyEntry = {
  slug: string;
  kind: "experience" | "education";
  title: string;
  org: string;
  period: string;
  bullets: string[];
  hasPage: boolean; // gets its own detail page
};