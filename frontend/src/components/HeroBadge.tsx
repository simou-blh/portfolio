"use client";

import * as THREE from "three";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame, useThree, type ThreeElement } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { toggleSide, useSide, type Side } from "@/lib/side";
import { CARD_RATIO, composeBadge, composeStrap, toStrapTexture, toTexture } from "@/lib/badgeTexture";
import { markSceneReady } from "@/lib/sceneReady";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const CARD_W = 1.6;
const CARD_H = CARD_W / CARD_RATIO;
const T = CARD_H / 2; // card top edge (local y)
const CLASP_H = 0.8;
const ANCHOR_Y = T + CLASP_H;

const FOV = 25;
const FIX_Y = 4;
const SEG = 0.6; // rope segment length
const STRAP_W = 0.34; // world width of the lanyard
const STRAP_LW = STRAP_W / Math.tan((FOV / 2) * (Math.PI / 180));

/** Pixels-per-unit based layout so the whole lanyard + card fits any canvas size. */
function getLayout(w: number, h: number) {
  const ppu = THREE.MathUtils.clamp(Math.min(w / 8, h / 5.3), 100, 175);
  const visW = w / ppu;
  const visH = h / ppu;
  const j3y = FIX_Y - 3 * SEG;
  const camY = j3y + 1.0 - visH / 2;
  const z = visH / (2 * Math.tan((FOV / 2) * (Math.PI / 180)));
  const anchorX = w / h > 1.15 ? visW * 0.18 : 0;
  return { camY, z, anchorX };
}

const PHOTO_SRCS = ["/images/me.webp", "/images/me.png", "/images/me.jpg"];
const BACK_PHOTO_SRCS = ["/images/hacker.webp", "/images/hacker.png", "/images/hacker.jpg"];

type Textures = {
  front: THREE.CanvasTexture;
  back: THREE.CanvasTexture;
  strap: Record<Side, THREE.CanvasTexture>;
};

function Rig() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const l = getLayout(size.width, size.height);
    camera.position.set(0, l.camY, l.z);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

function Clasp() {
  const metal = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#d7dbe4", metalness: 1, roughness: 0.2 }),
    [],
  );
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0a0f24", metalness: 0.3, roughness: 0.6 }), []);
  return (
    <group>
      {/* ring through the card slot */}
      <mesh position={[0, T - 0.01, 0]} rotation={[0, Math.PI / 2, 0]} material={metal}>
        <torusGeometry args={[0.11, 0.022, 16, 40]} />
      </mesh>
      {/* lobster claw */}
      <mesh position={[0, T + 0.25, 0]} scale={[0.72, 1.7, 1]} material={metal}>
        <torusGeometry args={[0.1, 0.02, 14, 40]} />
      </mesh>
      <mesh position={[0.075, T + 0.25, 0]} material={metal}>
        <boxGeometry args={[0.04, 0.15, 0.045]} />
      </mesh>
      {/* connector ring */}
      <mesh position={[0, T + 0.46, 0]} rotation={[0, Math.PI / 2, 0]} material={metal}>
        <torusGeometry args={[0.055, 0.016, 12, 32]} />
      </mesh>
      {/* crimp plate */}
      <RoundedBox args={[0.3, 0.3, 0.07]} radius={0.035} smoothness={4} position={[0, T + 0.64, 0]} material={metal} />
      <mesh position={[0, T + 0.6, 0]} material={dark}>
        <boxGeometry args={[0.2, 0.05, 0.075]} />
      </mesh>
      <mesh position={[0, T + 0.77, 0]} material={dark}>
        <boxGeometry args={[0.26, 0.035, 0.075]} />
      </mesh>
    </group>
  );
}

function Band({ textures }: { textures: Textures | null }) {
  const side = useSide();
  const { size } = useThree();
  const res = useMemo(() => new THREE.Vector2(size.width, size.height), [size.width, size.height]);
  const repeat = useMemo(() => new THREE.Vector2(-1.1, 1), []);
  const [anchorX] = useState(() => getLayout(size.width, size.height).anchorX);

  const band = useRef<THREE.Mesh>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const flip = useRef<THREE.Group>(null!);

  const [vec] = useState(() => new THREE.Vector3());
  const [dir] = useState(() => new THREE.Vector3());
  const [ang] = useState(() => new THREE.Vector3());
  const [rot] = useState(() => new THREE.Vector3());
  const [lerp1] = useState(() => new THREE.Vector3());
  const [lerp2] = useState(() => new THREE.Vector3());
  const lerpReady = useRef(false);
  const down = useRef({ x: 0, y: 0, t: 0 });

  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]),
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 2,
    linearDamping: 2,
  };

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], SEG]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], SEG]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], SEG]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, ANCHOR_Y, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      if (!lerpReady.current) {
        lerp1.copy(j1.current.translation() as THREE.Vector3);
        lerp2.copy(j2.current.translation() as THREE.Vector3);
        lerpReady.current = true;
      }
      const minSpeed = 10;
      const maxSpeed = 50;
      ([[j1, lerp1], [j2, lerp2]] as const).forEach(([r, l]) => {
        const t = r.current.translation();
        const clamped = Math.max(0.1, Math.min(1, l.distanceTo(t as THREE.Vector3)));
        l.lerp(t as THREE.Vector3, Math.min(1, delta * (minSpeed + clamped * (maxSpeed - minSpeed))));
      });
      curve.points[0].copy(j3.current.translation() as THREE.Vector3);
      curve.points[1].copy(lerp2);
      curve.points[2].copy(lerp1);
      curve.points[3].copy(fixed.current.translation() as THREE.Vector3);
      (band.current.geometry as MeshLineGeometry).setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel() as THREE.Vector3);
      rot.copy(card.current.rotation() as unknown as THREE.Vector3);
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }

    if (flip.current) {
      flip.current.rotation.y = THREE.MathUtils.damp(
        flip.current.rotation.y,
        side === "sec" ? Math.PI : 0,
        5,
        delta,
      );
    }
  });

  const edge = side === "sec" ? "#2a0509" : "#0b1e55";
  const bandColor = side === "sec" ? "#c1121f" : "#2563eb";

  return (
    <>
      <group position={[anchorX, FIX_Y, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.3, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.6, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.9, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, 0.03]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerDown={(e) => {
              (e.target as unknown as Element).setPointerCapture(e.pointerId);
              down.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY, t: performance.now() };
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation() as THREE.Vector3)));
            }}
            onPointerUp={(e) => {
              (e.target as unknown as Element).releasePointerCapture(e.pointerId);
              drag(false);
              const d = Math.hypot(e.nativeEvent.clientX - down.current.x, e.nativeEvent.clientY - down.current.y);
              if (d < 6 && performance.now() - down.current.t < 450) toggleSide();
            }}
          >
            <group ref={flip}>
            <RoundedBox args={[CARD_W - 0.01, CARD_H - 0.01, 0.035]} radius={0.075} smoothness={4}>
              <meshStandardMaterial color={edge} metalness={0.6} roughness={0.35} />
            </RoundedBox>
            {textures && (
              <>
                <mesh position={[0, 0, 0.0185]}>
                  <planeGeometry args={[CARD_W, CARD_H]} />
                  <meshBasicMaterial map={textures.front} transparent toneMapped={false} />
                </mesh>
                <mesh position={[0, 0, -0.0185]} rotation={[0, Math.PI, 0]}>
                  <planeGeometry args={[CARD_W, CARD_H]} />
                  <meshBasicMaterial map={textures.back} transparent toneMapped={false} />
                </mesh>
              </>
            )}
            </group>
            <Clasp />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band} frustumCulled={false}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: res, lineWidth: STRAP_LW }]}
          resolution={res}
          lineWidth={STRAP_LW}
          color={textures ? "white" : bandColor}
          useMap={textures ? 1 : 0}
          map={textures?.strap[side]}
          repeat={repeat}
        />
      </mesh>
    </>
  );
}

export default function HeroBadge({ active = true }: { active?: boolean }) {
  const [textures, setTextures] = useState<Textures | null>(null);

  useEffect(() => {
    let alive = true;
    const made: THREE.CanvasTexture[] = [];
    Promise.all([
      composeBadge("/images/badge-front.png", PHOTO_SRCS),
      composeBadge("/images/badge-back.png", BACK_PHOTO_SRCS),
      composeStrap("dev"),
      composeStrap("sec"),
    ]).then(([f, b, sd, ss]) => {
      if (!alive) return;
      const front = toTexture(f);
      const back = toTexture(b);
      const strap = { dev: toStrapTexture(sd), sec: toStrapTexture(ss) };
      made.push(front, back, strap.dev, strap.sec);
      setTextures({ front, back, strap });
      markSceneReady();
    });
    return () => {
      alive = false;
      made.forEach((t) => t.dispose());
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: FOV }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      frameloop={active ? "always" : "never"}
      style={{ opacity: textures ? 1 : 0, transition: "opacity 0.7s ease", touchAction: "pan-y" }}
    >
      <Rig />
      <ambientLight intensity={Math.PI} />
      <Physics gravity={[0, -40, 0]} timeStep={1 / 60} paused={!active}>
        <Band textures={textures} />
      </Physics>
      <Environment blur={0.75}>
        <color attach="background" args={["black"]} />
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}