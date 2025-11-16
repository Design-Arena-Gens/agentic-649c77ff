"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { ColorRepresentation } from "three";
import { Color } from "three";

export type DoctorAppearance = {
  primaryColor: string;
  accentColor: string;
  skinTone: string;
  accessory: "stethoscope" | "clipboard" | "none";
};

function usePalette(appearance: DoctorAppearance) {
  return useMemo(() => {
    const toThree = (value: string): ColorRepresentation => new Color(value);

    return {
      coat: toThree(appearance.primaryColor),
      scrubs: toThree(appearance.accentColor),
      skin: toThree(appearance.skinTone),
      mask: toThree("#eaf2ff")
    };
  }, [appearance]);
}

const DoctorBody = ({ palette, appearance }: { palette: ReturnType<typeof usePalette>; appearance: DoctorAppearance }) => {
  return (
    <group>
      <Float floatIntensity={0.3} rotationIntensity={0.2} speed={1.5}>
        <group position={[0, -0.1, 0]}>
          <mesh position={[0, 0.55, 0]}>
            <capsuleGeometry args={[0.22, 0.7, 16, 32]} />
            <meshStandardMaterial color={palette.coat} metalness={0.05} roughness={0.35} />
          </mesh>

          <mesh position={[0, 1.2, 0]}>
            <capsuleGeometry args={[0.21, 0.25, 16, 32]} />
            <meshStandardMaterial color={palette.skin} roughness={0.45} />
          </mesh>

          <mesh position={[0, 1.4, 0.1]} rotation={[Math.PI / 2.3, 0, 0]}>
            <torusGeometry args={[0.17, 0.11, 16, 32]} />
            <meshStandardMaterial color={palette.skin} roughness={0.45} />
          </mesh>

          <mesh position={[0, 1.22, 0.18]}>
            <sphereGeometry args={[0.075, 32, 32]} />
            <meshStandardMaterial color="#10141f" />
          </mesh>

          <mesh position={[-0.08, 1.23, 0.18]}>
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshStandardMaterial color="#10141f" />
          </mesh>
          <mesh position={[0.08, 1.23, 0.18]}>
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshStandardMaterial color="#10141f" />
          </mesh>

          <mesh position={[0, 1.19, 0.215]}>
            <planeGeometry args={[0.09, 0.12]} />
            <meshStandardMaterial color={palette.mask} roughness={0.2} metalness={0.1} />
          </mesh>

          <mesh position={[0, 0.05, 0]}>
            <capsuleGeometry args={[0.2, 0.4, 12, 24]} />
            <meshStandardMaterial color={palette.scrubs} roughness={0.6} />
          </mesh>

          <mesh position={[0, -0.45, 0.02]}>
            <capsuleGeometry args={[0.16, 0.4, 12, 24]} />
            <meshStandardMaterial color="#111827" />
          </mesh>

          <mesh position={[-0.25, 0.55, 0]} rotation={[0, 0, 0.35]}>
            <capsuleGeometry args={[0.09, 0.45, 12, 24]} />
            <meshStandardMaterial color={palette.coat} metalness={0.05} roughness={0.35} />
          </mesh>
          <mesh position={[0.25, 0.55, 0]} rotation={[0, 0, -0.35]}>
            <capsuleGeometry args={[0.09, 0.45, 12, 24]} />
            <meshStandardMaterial color={palette.coat} metalness={0.05} roughness={0.35} />
          </mesh>

          {appearance.accessory === "stethoscope" && (
            <group>
              <mesh position={[0, 0.95, 0.08]} rotation={[Math.PI * 0.52, 0, 0]}>
                <torusGeometry args={[0.26, 0.02, 12, 64]} />
                <meshStandardMaterial color="#10141f" roughness={0.3} metalness={0.15} />
              </mesh>
              <mesh position={[0.18, 0.72, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.18, 16]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
              <mesh position={[-0.18, 0.72, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.18, 16]} />
                <meshStandardMaterial color="#1f2937" />
              </mesh>
              <mesh position={[0, 0.55, 0.22]}>
                <cylinderGeometry args={[0.045, 0.04, 0.07, 16]} />
                <meshStandardMaterial color="#6b7280" />
              </mesh>
            </group>
          )}

          {appearance.accessory === "clipboard" && (
            <group position={[0.28, 0.35, 0.1]} rotation={[0, -0.3, 0.4]}>
              <mesh>
                <boxGeometry args={[0.18, 0.26, 0.01]} />
                <meshStandardMaterial color="#374151" />
              </mesh>
              <mesh position={[0, 0.12, 0.03]}>
                <boxGeometry args={[0.08, 0.02, 0.02]} />
                <meshStandardMaterial color="#9ca3af" />
              </mesh>
            </group>
          )}
        </group>
      </Float>
    </group>
  );
};

export function DoctorScene({ appearance }: { appearance: DoctorAppearance }) {
  const palette = usePalette(appearance);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true }}
    >
      <PerspectiveCamera makeDefault position={[2.1, 1.6, 2.3]} fov={32} />
      <color attach="background" args={["#040509"]} />
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        intensity={1}
        position={[3.2, 3.5, 1.8]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        intensity={0.8}
        position={[-2.1, 2.8, 1.2]}
        angle={0.6}
        penumbra={0.35}
      />
      <DoctorBody palette={palette} appearance={appearance} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]} receiveShadow>
        <circleGeometry args={[3.4, 64]} />
        <meshStandardMaterial color="#0b1220" metalness={0.05} roughness={0.9} />
      </mesh>
      <Environment preset="studio" />
      <OrbitControls enablePan={false} enableZoom maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
}

export function DoctorSceneSuspense(props: { appearance: DoctorAppearance }) {
  return (
    <Suspense fallback={<div className="canvas-fallback">Loading doctor model…</div>}>
      <DoctorScene {...props} />
    </Suspense>
  );
}
