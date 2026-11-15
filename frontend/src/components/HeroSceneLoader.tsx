"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { markSceneReady } from "@/lib/sceneReady";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const noop = () => () => {};
const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

function webglSupported() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function HeroSceneLoader() {
  const client = useIsClient();
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  const { enabled, compact } = useMemo(() => {
    if (!client) return { enabled: false, compact: false };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compact = window.matchMedia("(max-width: 767px)").matches;
    return { enabled: !reduce && webglSupported(), compact };
  }, [client]);

  // Nothing to load: tell the loader the "scene" is ready.
  useEffect(() => {
    if (client && !enabled) markSceneReady();
  }, [client, enabled]);

  // Pause rendering when the hero is off-screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-60 md:opacity-100"
    >
      {enabled && <HeroScene active={active} compact={compact} />}
    </div>
  );
}