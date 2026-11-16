"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const HeroBadge = dynamic(() => import("@/components/HeroBadge"), { ssr: false });

export default function HeroBadgeLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <HeroBadge active={active} />
    </div>
  );
}