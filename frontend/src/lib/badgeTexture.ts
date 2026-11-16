import * as THREE from "three";
import type { Side } from "@/lib/side";

/**
 * The badge art is 1099x1431. The card itself sits at x 119..977, y 72..1339
 * (the rest is dark background + the lanyard ring, which we replace in 3D).
 * All coordinates below are in that 1099x1431 space and get scaled if the
 * exported art has a different resolution.
 */
const ART_W = 1099;
const CROP = { x: 119, y: 72, w: 859, h: 1268 };
export const CARD_RATIO = CROP.w / CROP.h;

const OUT_W = 1024;
const OUT_H = Math.round(OUT_W / CARD_RATIO);
const CORNER = 62;

/** The inner "screen" where the photo goes (polygon with the chamfered top-right). */
const FRAME: [number, number][] = [
  [182, 448],
  [722, 448],
  [824, 548],
  [824, 872],
  [182, 872],
];
/** Photo placement inside the frame: ax/ay = anchor (0..1), zoom >= 1 */
const PHOTO = { ax: 0.5, ay: 0.12, zoom: 1 };
const FEATHER = 22;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function loadFirst(srcs: string[]) {
  for (const s of srcs) {
    const img = await loadImage(s);
    if (img) return img;
  }
  return null;
}

export async function composeBadge(base: string, photos: string[]): Promise<HTMLCanvasElement> {
  const [art, photo] = await Promise.all([loadImage(base), loadFirst(photos)]);
  const canvas = document.createElement("canvas");
  canvas.width = OUT_W;
  canvas.height = OUT_H;
  const g = canvas.getContext("2d")!;
  if (!art) {
    console.warn("[badge] image not found:", base);
    g.fillStyle = "#0b1e55";
    g.fillRect(0, 0, OUT_W, OUT_H);
    return canvas;
  }

  const k = art.naturalWidth / ART_W; // art px -> natural px
  const s = OUT_W / CROP.w; // art px -> canvas px

  g.save();
  g.beginPath();
  g.roundRect(0, 0, OUT_W, OUT_H, CORNER * s);
  g.clip();
  g.drawImage(art, CROP.x * k, CROP.y * k, CROP.w * k, CROP.h * k, 0, 0, OUT_W, OUT_H);

  if (photo) {
    const pts = FRAME.map(([x, y]) => [(x - CROP.x) * s, (y - CROP.y) * s] as const);
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const bw = maxX - minX;
    const bh = maxY - minY;

    const layer = document.createElement("canvas");
    layer.width = OUT_W;
    layer.height = OUT_H;
    const lg = layer.getContext("2d")!;
    const cover = Math.max(bw / photo.width, bh / photo.height) * PHOTO.zoom;
    const dw = photo.width * cover;
    const dh = photo.height * cover;
    lg.drawImage(photo, minX + (bw - dw) * PHOTO.ax, minY + (bh - dh) * PHOTO.ay, dw, dh);

    // soft-edged mask: the polygon's shadow, drawn off-canvas and offset back in
    const mask = document.createElement("canvas");
    mask.width = OUT_W;
    mask.height = OUT_H;
    const mg = mask.getContext("2d")!;
    mg.shadowColor = "#000";
    mg.shadowBlur = FEATHER;
    mg.shadowOffsetX = OUT_W;
    mg.fillStyle = "#000";
    mg.beginPath();
    pts.forEach(([x, y], i) => (i ? mg.lineTo(x - OUT_W, y) : mg.moveTo(x - OUT_W, y)));
    mg.closePath();
    mg.fill();

    lg.globalCompositeOperation = "destination-in";
    lg.drawImage(mask, 0, 0);
    g.drawImage(layer, 0, 0);
  }
  g.restore();
  return canvas;
}

export function toTexture(canvas: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

/** Repeating lanyard texture with the name on it (u runs along the strap). */
export async function composeStrap(side: Side): Promise<HTMLCanvasElement> {
  try {
    await document.fonts.ready;
  } catch {}
  const W = 640;
  const H = 128;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  const sec = side === "sec";
  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, sec ? "#2a0509" : "#0d2a8a");
  grad.addColorStop(0.5, sec ? "#14030a" : "#0a1d63");
  grad.addColorStop(1, sec ? "#2a0509" : "#0d2a8a");
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  // edge stitching
  g.strokeStyle = sec ? "rgba(255,90,110,0.55)" : "rgba(143,184,255,0.6)";
  g.lineWidth = 3;
  g.setLineDash([10, 8]);
  g.strokeRect(0, 10, W, H - 20);
  g.setLineDash([]);
  const stack =
    getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim() || "system-ui, sans-serif";
  g.font = `800 46px ${stack}`;
  g.textBaseline = "middle";
  g.fillStyle = "#ffffff";
  g.fillText("AHMED OUASSIM BOULOUH", 14, H / 2 + 2);
  g.fillStyle = sec ? "#ff3b4e" : "#7fd6ff";
  g.fillText(sec ? "#" : "</>", W - 62, H / 2 + 2);
  return c;
}

export function toStrapTexture(canvas: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}