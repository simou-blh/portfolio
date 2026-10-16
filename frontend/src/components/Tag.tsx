import type { Tech } from "@/data/types";

export default function Tag({ name, tone }: Tech) {
  return <span className={`tag ${tone && tone !== "mint" ? tone : ""}`}>{name}</span>;
}