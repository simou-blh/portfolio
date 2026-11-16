import * as THREE from "three";

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