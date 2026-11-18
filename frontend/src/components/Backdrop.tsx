"use client";

import { useEffect, useRef } from "react";
import { useSide } from "@/lib/side";
import type { Side } from "@/lib/side";

type RGB = [number, number, number];
type Star = { x: number; y: number; v: number; r: number; a: number; tf: number; ph: number; tint: boolean };
type Item = { x: number; y: number; vy: number; sway: number; swayF: number; ph: number; rot: number; d: number; label: string };
type Comet = { x: number; y: number; vx: number; vy: number; len: number };

const ACCENT: Record<Side, RGB> = { dev: [110, 231, 200], sec: [248, 113, 113] };

// labels starting with "#" are drawn icons, the rest are chips
const POOL: Record<Side, string[]> = {
  dev: [
    "</>", "React", "Next.js", "Node.js", "TypeScript", "REST API", "SQL", "Docker", "Git", "{ }", "npm",
    "Tailwind", "AI", "LLM", "ML", "Python", "Agent", "RAG", "Tensor", "#atom", "#net", "#chip", "#atom", "#net",
  ],
  sec: [
    "Auth", "JWT", "XSS", "SQLi", "Nmap", "Kali", "Burp", "TLS", "OWASP", "CVE", "CSRF", "Hash",
    "Linux", "Python", "AI", "REST API", "#shield", "#shield", "#chip", "#net", "</>",
  ],
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function drawIcon(g: CanvasRenderingContext2D, kind: string, s: number) {
  g.lineWidth = Math.max(1.2, s * 0.09);
  g.lineJoin = "round";
  g.lineCap = "round";
  if (kind === "#atom") {
    for (let i = 0; i < 3; i++) {
      g.save();
      g.rotate((i * Math.PI) / 3);
      g.beginPath();
      g.ellipse(0, 0, s, s * 0.38, 0, 0, Math.PI * 2);
      g.stroke();
      g.restore();
    }
    g.beginPath();
    g.arc(0, 0, s * 0.14, 0, Math.PI * 2);
    g.fill();
  } else if (kind === "#net") {
    const L: [number, number][][] = [
      [[-s, -s * 0.5], [-s, s * 0.5]],
      [[0, -s * 0.8], [0, 0], [0, s * 0.8]],
      [[s, -s * 0.5], [s, s * 0.5]],
    ];
    g.globalAlpha *= 0.7;
    for (let l = 0; l < 2; l++) {
      for (const a of L[l]) {
        for (const b of L[l + 1]) {
          g.beginPath();
          g.moveTo(a[0], a[1]);
          g.lineTo(b[0], b[1]);
          g.stroke();
        }
      }
    }
    g.globalAlpha /= 0.7;
    for (const col of L) {
      for (const p of col) {
        g.beginPath();
        g.arc(p[0], p[1], s * 0.15, 0, Math.PI * 2);
        g.fill();
      }
    }
  } else if (kind === "#chip") {
    const q = s * 0.62;
    g.strokeRect(-q, -q, q * 2, q * 2);
    g.strokeRect(-q * 0.4, -q * 0.4, q * 0.8, q * 0.8);
    for (let i = -1; i <= 1; i++) {
      const o = i * q * 0.55;
      g.beginPath();
      g.moveTo(o, -q); g.lineTo(o, -q - s * 0.3);
      g.moveTo(o, q); g.lineTo(o, q + s * 0.3);
      g.moveTo(-q, o); g.lineTo(-q - s * 0.3, o);
      g.moveTo(q, o); g.lineTo(q + s * 0.3, o);
      g.stroke();
    }
  } else if (kind === "#shield") {
    g.beginPath();
    g.moveTo(0, -s);
    g.lineTo(s * 0.8, -s * 0.55);
    g.lineTo(s * 0.7, s * 0.2);
    g.quadraticCurveTo(s * 0.5, s * 0.75, 0, s);
    g.quadraticCurveTo(-s * 0.5, s * 0.75, -s * 0.7, s * 0.2);
    g.lineTo(-s * 0.8, -s * 0.55);
    g.closePath();
    g.stroke();
    g.beginPath();
    g.moveTo(-s * 0.3, 0);
    g.lineTo(-s * 0.05, s * 0.28);
    g.lineTo(s * 0.35, -s * 0.22);
    g.stroke();
  }
}

export default function Backdrop() {
  const ref = useRef<HTMLCanvasElement>(null);
  const side = useSide();
  const sideRef = useRef<Side>(side);

  useEffect(() => {
    sideRef.current = side;
  }, [side]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const g = canvas.getContext("2d");
    if (!g) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 0.15 : 1;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let nextComet = last + 1500;
    let stars: Star[] = [];
    let items: Item[] = [];
    const comets: Comet[] = [];
    const cur: RGB = [...ACCENT[sideRef.current]] as RGB;

    const newStar = (initial: boolean): Star => {
      const z = rand(0.15, 1);
      return {
        x: rand(0, w),
        y: initial ? rand(0, h) : h + 10,
        v: 10 + z * z * 90,
        r: 0.4 + z * 1.4,
        a: 0.25 + z * 0.75,
        tf: rand(0.8, 2.6),
        ph: rand(0, 6.28),
        tint: Math.random() < 0.18,
      };
    };

    const newItem = (initial: boolean): Item => {
      const pool = POOL[sideRef.current];
      const d = rand(0.65, 1.25);
      return {
        x: rand(0.04, 0.96) * w,
        y: initial ? rand(0, h) : h + rand(40, 160),
        vy: -rand(10, 26) * d,
        sway: rand(8, 28),
        swayF: rand(0.25, 0.6),
        ph: rand(0, 6.28),
        rot: rand(-0.25, 0.25),
        d,
        label: pool[Math.floor(Math.random() * pool.length)],
      };
    };

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const small = w < 700;
      stars = Array.from({ length: Math.min(small ? 160 : 380, Math.round((w * h) / 5200)) }, () => newStar(true));
      items = Array.from({ length: small ? 8 : 16 }, () => newItem(true));
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      g.clearRect(0, 0, w, h);

      const target = ACCENT[sideRef.current];
      for (let i = 0; i < 3; i++) cur[i] += (target[i] - cur[i]) * Math.min(1, dt * 3);
      const ac = `${Math.round(cur[0])},${Math.round(cur[1])},${Math.round(cur[2])}`;

      // stars travelling upward
      for (const s of stars) {
        s.y -= s.v * dt * k;
        if (s.y < -10) Object.assign(s, newStar(false));
        const a = s.a * (0.6 + 0.4 * Math.sin(t * s.tf + s.ph));
        const streak = s.v * 0.03 * k;
        g.fillStyle = s.tint ? `rgba(${ac},${a})` : `rgba(255,255,255,${a})`;
        g.strokeStyle = g.fillStyle;
        if (streak > 2) {
          g.lineWidth = s.r;
          g.lineCap = "round";
          g.beginPath();
          g.moveTo(s.x, s.y);
          g.lineTo(s.x, s.y + streak);
          g.stroke();
        } else {
          g.beginPath();
          g.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          g.fill();
        }
      }

      // comets
      if (now > nextComet && comets.length < 2 && !reduce) {
        const ang = Math.PI * rand(0.7, 0.85);
        const sp = rand(650, 1000);
        comets.push({ x: rand(w * 0.35, w * 1.1), y: rand(-60, h * 0.35), vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, len: rand(200, 340) });
        nextComet = now + rand(2500, 7000);
      }
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        if (c.x < -400 || c.y > h + 400) {
          comets.splice(i, 1);
          continue;
        }
        const sp = Math.hypot(c.vx, c.vy);
        const tx = c.x - (c.vx / sp) * c.len;
        const ty = c.y - (c.vy / sp) * c.len;
        const grad = g.createLinearGradient(c.x, c.y, tx, ty);
        grad.addColorStop(0, "rgba(255,255,255,0.95)");
        grad.addColorStop(0.3, `rgba(${ac},0.45)`);
        grad.addColorStop(1, `rgba(${ac},0)`);
        g.strokeStyle = grad;
        g.lineWidth = 2.2;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(c.x, c.y);
        g.lineTo(tx, ty);
        g.stroke();
        const glow = g.createRadialGradient(c.x, c.y, 0, c.x, c.y, 14);
        glow.addColorStop(0, "rgba(255,255,255,0.9)");
        glow.addColorStop(1, `rgba(${ac},0)`);
        g.fillStyle = glow;
        g.beginPath();
        g.arc(c.x, c.y, 14, 0, Math.PI * 2);
        g.fill();
      }

      // floating dev / AI items
      for (const it of items) {
        it.y += it.vy * dt * k;
        if (it.y < -80) Object.assign(it, newItem(false));
        const x = it.x + Math.sin(t * it.swayF + it.ph) * it.sway;
        const rot = it.rot + Math.sin(t * 0.4 + it.ph) * 0.15;
        const fade = clamp(it.y / 140, 0, 1) * clamp((h + 60 - it.y) / 140, 0, 1);
        const alpha = 0.7 * fade * clamp(it.d, 0.6, 1);
        if (alpha <= 0.01) continue;

        g.save();
        g.translate(x, it.y);
        g.rotate(rot);
        g.globalAlpha = alpha;
        g.strokeStyle = `rgba(${ac},0.9)`;
        g.fillStyle = `rgba(${ac},0.9)`;
        if (it.label.startsWith("#")) {
          g.shadowColor = `rgba(${ac},0.6)`;
          g.shadowBlur = 10;
          drawIcon(g, it.label, 17 * it.d);
        } else {
          g.font = `600 ${Math.round(13 * it.d)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
          const tw = g.measureText(it.label).width;
          const px = 10 * it.d;
          const ph = 26 * it.d;
          g.shadowColor = `rgba(${ac},0.5)`;
          g.shadowBlur = 10;
          g.fillStyle = `rgba(${ac},0.08)`;
          g.strokeStyle = `rgba(${ac},0.5)`;
          g.lineWidth = 1;
          g.beginPath();
          g.roundRect(-tw / 2 - px, -ph / 2, tw + px * 2, ph, ph / 2);
          g.fill();
          g.stroke();
          g.shadowBlur = 0;
          g.fillStyle = `rgba(${ac},0.95)`;
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText(it.label, 0, 1);
        }
        g.restore();
      }

      raf = requestAnimationFrame(frame);
    };

    init();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <div className="backdrop" aria-hidden="true">
      <div className="bd bd-dev" />
      <div className="bd bd-sec" />
      <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
    </div>
  );
}