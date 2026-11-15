"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Float } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { markSceneReady } from "@/lib/sceneReady";

const MINT = "#6ef3c5";
const CORAL = "#ff7a90";
const PAPER = "#f3f1ff";
const INK = "#10143a";

// Seeded PRNG so the network is identical on every render.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNetwork(count: number, link: number) {
  const rnd = mulberry32(42);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const u = rnd() * 2 - 1;
    const theta = rnd() * Math.PI * 2;
    const r = 2.4 + rnd() * 1.5;
    const s = Math.sqrt(1 - u * u);
    pts.push(new THREE.Vector3(r * s * Math.cos(theta), r * u, r * s * Math.sin(theta)));
  }

  const nodes: number[] = [];
  const accents: number[] = [];
  pts.forEach((p, i) => {
    if (i % 7 === 0) accents.push(p.x, p.y, p.z);
    else nodes.push(p.x, p.y, p.z);
  });

  const lines: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      if (pts[i].distanceTo(pts[j]) < link) {
        lines.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
      }
    }
  }
  return {
    nodes: new Float32Array(nodes),
    accents: new Float32Array(accents),
    lines: new Float32Array(lines),
  };
}

function Network({ compact }: { compact: boolean }) {
  const { nodes, accents, lines } = useMemo(
    () => buildNetwork(compact ? 28 : 52, compact ? 2.6 : 2.1),
    [compact],
  );
  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={PAPER} transparent opacity={0.3} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodes, 3]} />
        </bufferGeometry>
        <pointsMaterial color={MINT} size={0.09} sizeAttenuation />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[accents, 3]} />
        </bufferGeometry>
        <pointsMaterial color={CORAL} size={0.15} sizeAttenuation />
      </points>
    </group>
  );
}

function Lock() {
  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.7}>
      <group>
        <mesh position={[0, -0.25, 0]}>
          <boxGeometry args={[1.7, 1.35, 0.75]} />
          <meshBasicMaterial color={INK} />
          <Edges color={MINT} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <torusGeometry args={[0.52, 0.1, 10, 28, Math.PI]} />
          <meshBasicMaterial color={MINT} wireframe />
        </mesh>
        <mesh position={[0, -0.12, 0.38]}>
          <circleGeometry args={[0.13, 20]} />
          <meshBasicMaterial color={CORAL} />
        </mesh>
        <mesh position={[0, -0.42, 0.38]}>
          <boxGeometry args={[0.08, 0.3, 0.01]} />
          <meshBasicMaterial color={CORAL} />
        </mesh>
      </group>
    </Float>
  );
}

function Scene({ compact }: { compact: boolean }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const viewport = useThree((s) => s.viewport);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, dt) => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    o.rotation.x = THREE.MathUtils.damp(o.rotation.x, pointer.current.y * 0.2, 3, dt);
    o.rotation.y = THREE.MathUtils.damp(o.rotation.y, pointer.current.x * 0.35, 3, dt);
    i.rotation.y += dt * 0.05;
  });

  const wide = viewport.width / viewport.height > 1.1;
  return (
    <group ref={outer} position={[wide ? viewport.width * 0.18 : 0, 0, 0]} scale={wide ? 1 : 0.8}>
      <group ref={inner}>
        <Network compact={compact} />
      </group>
      <Lock />
    </group>
  );
}

export default function HeroScene({ active, compact }: { active: boolean; compact: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      dpr={[1, compact ? 1 : 1.5]}
      gl={{ alpha: true, antialias: !compact }}
      frameloop={active ? "always" : "never"}
      onCreated={markSceneReady}
    >
      <Scene compact={compact} />
    </Canvas>
  );
}