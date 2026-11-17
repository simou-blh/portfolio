"use client";

import { useState } from "react";

const slugs: Record<string, string> = {
  JavaScript: "javascript",
  TypeScript: "typescript",
  Python: "python",
  Dart: "dart",
  "HTML/CSS": "html5",
  React: "react",
  "Next.js": "nextdotjs",
  Vite: "vite",
  "Django REST": "django",
  FastAPI: "fastapi",
  "Node.js": "nodedotjs",
  JWT: "jsonwebtokens",
  PostgreSQL: "postgresql",
  MySQL: "mysql",
  SQLite: "sqlite",
  Git: "git",
  Vercel: "vercel",
  WordPress: "wordpress",
};

export default function TechIcon({ name, size = 30 }: { name: string; size?: number }) {
  const slug = slugs[name];
  const [failed, setFailed] = useState(false);

  if (!slug || failed) {
    return (
      <span
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="inline-flex items-center justify-center rounded-lg bg-white/10 text-[0.75rem] font-extrabold text-mint"
      >
        {name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}/ffffff`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
    />
  );
}