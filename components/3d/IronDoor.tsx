"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { use3DStore } from "@/lib/3d-store";
import type * as THREE from "three";

export default function IronDoor() {
  const doorOpen = use3DStore((s) => s.doorOpen);
  const doorRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!doorRef.current) return;
    const targetY = doorOpen ? -2.5 : 0;
    doorRef.current.position.y += (targetY - doorRef.current.position.y) * 0.05;
  });

  return (
    <group position={[1.5, 0, 0.05]}>
      {/* Door frame */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[1.05, 2.55, 0.15]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Door panel — slides down when open */}
      <mesh ref={doorRef} position={[0, 1.25, 0.05]}>
        <boxGeometry args={[0.9, 2.4, 0.08]} />
        <meshStandardMaterial
          color={doorOpen ? "#2a4a2a" : "#3a3a4a"}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Door handle */}
      <mesh position={[0.3, 1.25, 0.12]}>
        <boxGeometry args={[0.05, 0.2, 0.05]} />
        <meshStandardMaterial color="#666" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Status light */}
      <mesh position={[0, 2.6, 0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color={doorOpen ? "#44ff44" : "#ff4444"}
          emissive={doorOpen ? "#44ff44" : "#ff4444"}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
