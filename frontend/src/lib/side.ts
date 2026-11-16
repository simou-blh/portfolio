import { useSyncExternalStore } from "react";

export type Side = "dev" | "sec";

const KEY = "side";
const listeners = new Set<() => void>();

export function getSide(): Side {
  if (typeof document === "undefined") return "dev";
  return document.documentElement.dataset.side === "sec" ? "sec" : "dev";
}

export function setSide(s: Side) {
  const el = document.documentElement;
  el.classList.add("side-flip");
  el.dataset.side = s;
  try {
    localStorage.setItem(KEY, s);
  } catch {}
  listeners.forEach((l) => l());
  window.setTimeout(() => el.classList.remove("side-flip"), 900);
}

export function toggleSide() {
  setSide(getSide() === "dev" ? "sec" : "dev");
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useSide(): Side {
  return useSyncExternalStore(subscribe, getSide, () => "dev" as Side);
}