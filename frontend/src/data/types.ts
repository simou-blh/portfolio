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
  // detail-page fields (all optional)
  repoUrl?: string;
  year?: string;
  role?: string;
  overview?: string;
  highlights?: string[];
  challenges?: string[];
};

export type JourneyEntry = {
  slug: string;
  kind: "experience" | "education";
  title: string;
  org: string;
  period: string;
  bullets: string[];
  hasPage: boolean; // gets its own detail page
  // detail-page fields (optional)
  description?: string;
  highlights?: string[];
};