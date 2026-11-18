"use client";

import { useEffect, useRef, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiJavascript, SiDocker, SiGit,
  SiTailwindcss, SiPython, SiPostgresql, SiMongodb, SiTensorflow, SiPytorch,
  SiHuggingface, SiKalilinux, SiLinux, SiBurpsuite, SiOwasp, SiJsonwebtokens, SiWireshark,
  SiMetasploit, SiHackthebox, SiTryhackme, SiBitwarden, SiLetsencrypt, SiOpenssl, SiTorproject, SiProtonvpn, SiGnuprivacyguard, SiVirustotal,
} from "react-icons/si";
import { useSide } from "@/lib/side";
import type { Side } from "@/lib/side";

type RGB = [number, number, number];
type Star = { x: number; y: number; v: number; r: number; a: number; tf: number; ph: number; tint: boolean };
type Item = { x: number; y: number; vy: number; sway: number; swayF: number; ph: number; rot: number; d: number; label: string; next: string | null; sw: number };
type Comet = { x: number; y: number; vx: number; vy: number; len: number };

const ACCENT: Record<Side, RGB> = { dev: [110, 231, 200], sec: [248, 113, 113] };

// real brand logos (key -> icon + colour). If tsc says an icon doesn't exist, delete its line here and in POOL.
const LOGOS: Record<string, { Icon: ComponentType<{ size?: number; color?: string }>; color: string }> = {
  react: { Icon: SiReact, color: "#61DAFB" },
  next: { Icon: SiNextdotjs, color: "#FFFFFF" },
  node: { Icon: SiNodedotjs, color: "#5FA04E" },
  ts: { Icon: SiTypescript, color: "#3178C6" },
  js: { Icon: SiJavascript, color: "#F7DF1E" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  git: { Icon: SiGit, color: "#F05032" },
  tailwind: { Icon: SiTailwindcss, color: "#06B6D4" },
  python: { Icon: SiPython, color: "#4B8BBE" },
  postgres: { Icon: SiPostgresql, color: "#5B86E5" },
  mongo: { Icon: SiMongodb, color: "#47A248" },
  tensorflow: { Icon: SiTensorflow, color: "#FF6F00" },
  pytorch: { Icon: SiPytorch, color: "#EE4C2C" },
  hf: { Icon: SiHuggingface, color: "#FFD21E" },
  kali: { Icon: SiKalilinux, color: "#6AA0C8" },
  linux: { Icon: SiLinux, color: "#FCC624" },
  burp: { Icon: SiBurpsuite, color: "#FF6633" },
  owasp: { Icon: SiOwasp, color: "#FFFFFF" },
  jwt: { Icon: SiJsonwebtokens, color: "#D63AFF" },
  wireshark: { Icon: SiWireshark, color: "#1679A7" },
  metasploit: { Icon: SiMetasploit, color: "#2596CD" },
  htb: { Icon: SiHackthebox, color: "#9FEF00" },
  thm: { Icon: SiTryhackme, color: "#C11111" },
  bitwarden: { Icon: SiBitwarden, color: "#175DDC" },
  letsencrypt: { Icon: SiLetsencrypt, color: "#FFFFFF" },
  openssl: { Icon: SiOpenssl, color: "#721412" },
  tor: { Icon: SiTorproject, color: "#7D4698" },
  proton: { Icon: SiProtonvpn, color: "#6D4AFF" },
  gpg: { Icon: SiGnuprivacyguard, color: "#0093DD" },
  virustotal: { Icon: SiVirustotal, color: "#394EFF" },
};

// keys in LOGOS = brand logo, keys starting with "#" = drawn icons
const POOL: Record<Side, string[]> = {
  dev: [
    "react", "next", "node", "ts", "js", "docker", "git", "tailwind", "python", "postgres", "mongo",
    "tensorflow", "pytorch", "hf", "#atom", "#net", "#chip", "#atom", "#net",
  ],
  sec: [
    "kali", "linux", "burp", "owasp", "jwt", "wireshark", "metasploit", "htb", "thm", "bitwarden", "letsencrypt", "openssl", "tor", "proton", "gpg", "virustotal",
    "#shield", "#shield", "#shield",
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

// turn each react-icon into an <img> once, so the canvas can drawImage() it every frame
function loadLogos() {
  const out: Record<string, HTMLImageElement> = {};
  for (const [key, { Icon, color }] of Object.entries(LOGOS)) {
    const svg = renderToStaticMarkup(<Icon size={64} color={color} />);
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    out[key] = img;
  }
  return out;
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

    const logos = loadLogos();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 0.15 : 1;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let nextComet = last + 1500;
    let lastSide: Side = sideRef.current;
    let stars: Star[] = [];
    let items: Item[] = [];
    const comets: Comet[] = [];
    const cur: RGB = [...ACCENT[sideRef.current]] as RGB;

    const pick = () => {
      const pool = POOL[sideRef.current];
      return pool[Math.floor(Math.random() * pool.length)];
    };

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
        label: pick(), next: null, sw: 1,
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

      // badge flipped: give every floating item a logo from the new side
      if (sideRef.current !== lastSide) {
        lastSide = sideRef.current;
        for (const it of items) setTimeout(() => { it.next = pick(); }, Math.random() * 700);
      }

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

      // floating logos / icons
      for (const it of items) {
        it.y += it.vy * dt * k;
        if (it.y < -80) Object.assign(it, newItem(false));
        const x = it.x + Math.sin(t * it.swayF + it.ph) * it.sway;
        const rot = it.rot + Math.sin(t * 0.4 + it.ph) * 0.15;
        const fade = clamp(it.y / 140, 0, 1) * clamp((h + 60 - it.y) / 140, 0, 1);
        const alpha = 0.85 * fade * clamp(it.d, 0.6, 1);
        if (it.next) { it.sw -= dt * 4; if (it.sw <= 0) { it.label = it.next; it.next = null; } } else if (it.sw < 1) { it.sw = Math.min(1, it.sw + dt * 4); }
        if (alpha <= 0.01) continue;

        g.save();
        g.translate(x, it.y);
        g.rotate(rot);
        g.scale(Math.max(0.001, it.sw), Math.max(0.001, it.sw));
        g.globalAlpha = alpha;
        g.strokeStyle = `rgba(${ac},0.9)`;
        g.fillStyle = `rgba(${ac},0.9)`;
        if (it.label.startsWith("#")) {
          g.shadowColor = `rgba(${ac},0.6)`;
          g.shadowBlur = 10;
          drawIcon(g, it.label, 17 * it.d);
        } else {
          const img = logos[it.label];
          const R = 20 * it.d; // glass disc radius
          // soft glass disc behind the logo
          g.shadowColor = `rgba(${ac},0.5)`;
          g.shadowBlur = 12;
          g.fillStyle = `rgba(${ac},0.08)`;
          g.strokeStyle = `rgba(${ac},0.45)`;
          g.lineWidth = 1;
          g.beginPath();
          g.arc(0, 0, R, 0, Math.PI * 2);
          g.fill();
          g.stroke();
          g.shadowBlur = 0;
          if (img && img.complete && img.naturalWidth > 0) {
            const s = R * 1.15;
            g.drawImage(img, -s / 2, -s / 2, s, s);
          }
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