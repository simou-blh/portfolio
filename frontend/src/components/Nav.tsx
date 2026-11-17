"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toggleSide, useSide } from "@/lib/side";

const links = [
  { label: "Home", id: "top", mobile: true },
  { label: "About", id: "about", mobile: true },
  { label: "Education", id: "experience", mobile: false },
  { label: "Portfolio", id: "projects", mobile: true },
  { label: "Contact", id: "contact", mobile: true },
];

export default function Nav() {
  const side = useSide();
  const [active, setActive] = useState("top");

  useEffect(() => {
    const els = links
      .map((l) => document.getElementById(l.id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Main"
      className="glass fixed left-1/2 top-4 z-40 flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-1 rounded-full p-1.5"
    >
      {links.map((l) => (
        <Link
          key={l.id}
          href={`/#${l.id}`}
          className={`nav-link ${l.mobile ? "" : "hidden sm:inline-flex"} ${active === l.id ? "is-active" : ""}`}
        >
          {l.label}
        </Link>
      ))}
      <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
      <button
        type="button"
        onClick={toggleSide}
        aria-label={side === "dev" ? "Switch to security side" : "Switch to developer side"}
        title={side === "dev" ? "Security side" : "Developer side"}
        className="nav-switch"
      >
        {side === "dev" ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6z" />
          </svg>
        )}
      </button>
    </nav>
  );
}