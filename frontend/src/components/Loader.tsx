"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { SCENE_READY_EVENT, isSceneReady } from "@/lib/sceneReady";

export default function Loader() {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) return;

    const flags = {
      fonts: false,
      scene: isSceneReady(),
      page: document.readyState === "complete",
    };
    document.fonts.ready.then(() => {
      flags.fonts = true;
    });
    const onScene = () => {
      flags.scene = true;
    };
    const onLoad = () => {
      flags.page = true;
    };
    window.addEventListener(SCENE_READY_EVENT, onScene);
    window.addEventListener("load", onLoad);

    let raf = 0;
    let timer = 0;
    let shown = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const target =
        now - start > 4000
          ? 100
          : (flags.fonts ? 34 : 0) + (flags.scene ? 33 : 0) + (flags.page ? 33 : 0);
      shown += (target - shown) * 0.1;
      if (target - shown < 0.5) shown = target;
      setValue(Math.round(shown));
      if (shown >= 100) {
        timer = window.setTimeout(() => setDone(true), 300);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener(SCENE_READY_EVENT, onScene);
      window.removeEventListener("load", onLoad);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          role="status"
          aria-label="Loading"
          className="loader blueprint fixed inset-0 z-[100] flex flex-col justify-between p-[clamp(20px,5vw,64px)] text-paper"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <span className="font-medium text-mint">A.O. Boulouh — Portfolio</span>
          <div aria-hidden="true">
            <p className="text-[clamp(5rem,22vw,16rem)] font-extrabold leading-[0.85] tracking-[-0.05em] tabular-nums">
              {value}
              <span className="text-mint">%</span>
            </p>
            <div className="mt-6 h-1 w-full bg-paper/20">
              <div className="h-full bg-mint" style={{ width: `${value}%` }} />
            </div>
          </div>
          <span className="font-medium opacity-80">Loading assets…</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}