"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { use3DStore } from "@/lib/3d-store";
import type * as THREE from "three";

export default function Character3D() {
  const characterPos = use3DStore((s) => s.characterPos);
  const moveCharacter = use3DStore((s) => s.moveCharacter);
  const groupRef = useRef<THREE.Group>(null);

  // Smooth movement via lerp
  useFrame(() => {
    if (!groupRef.current) return;
    const target = { x: characterPos.x + 0.5, z: characterPos.z + 0.5 };
    groupRef.current.position.x += (target.x - groupRef.current.position.x) * 0.15;
    groupRef.current.position.z += (target.z - groupRef.current.position.z) * 0.15;
  });

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "w": case "W": case "ArrowUp":
          moveCharacter(0, -1);
          break;
        case "s": case "S": case "ArrowDown":
          moveCharacter(0, 1);
          break;
        case "a": case "A": case "ArrowLeft":
          moveCharacter(-1, 0);
          break;
        case "d": case "D": case "ArrowRight":
          moveCharacter(1, 0);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveCharacter]);

  return (
    <group ref={groupRef} position={[1.5, 0, 1.5]}>
      {/* Shadow on ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#000" transparent opacity={0.3} />
      </mesh>

      {/* Body — capsule-like shape */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.35, 8, 16]} />
        <meshStandardMaterial color="#c4a0ff" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#d4b8a0" />
      </mesh>

      {/* Eyes — simple dark dots */}
      <mesh position={[0.04, 0.78, 0.1]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[-0.04, 0.78, 0.1]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </group>
  );
}
