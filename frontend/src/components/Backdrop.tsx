"use client";

import { useEffect } from "react";
import { markSceneReady } from "@/lib/sceneReady";

export default function Backdrop() {
  useEffect(() => {
    markSceneReady();
  }, []);
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="bd bd-dev" />
      <div className="bd bd-sec" />
      <div className="bd-stars" />
    </div>
  );
}