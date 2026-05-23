"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { use3DStore } from "@/lib/3d-store";
import type * as THREE from "three";

interface SwitchProps {
  id: number;
  position: [number, number, number];
}

export default function Switch3D({ id, position }: SwitchProps) {
  const sw = use3DStore((s) => s.switches[id]);
  const toggleSwitch = use3DStore((s) => s.toggleSwitch);
  const characterPos = use3DStore((s) => s.characterPos);
  const leverRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const isNear =
    Math.abs(characterPos.x - sw.position.x) <= 1 &&
    Math.abs(characterPos.z - sw.position.z) <= 1 &&
    !(characterPos.x === sw.position.x && characterPos.z === sw.position.z);

  useFrame(() => {
    if (!leverRef.current) return;
    const targetRotZ = sw.isOn ? -Math.PI / 4 : Math.PI / 4;
    leverRef.current.rotation.z += (targetRotZ - leverRef.current.rotation.z) * 0.1;
  });

  const handleClick = () => {
    if (isNear) toggleSwitch(id);
  };

  return (
    <group position={position}>
      {/* Switch base plate */}
      <mesh
        onClick={handleClick}
        onPointerOver={() => isNear && setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.3, 0.3, 0.05]} />
        <meshStandardMaterial
          color={hovered && isNear ? "#3a3a5a" : "#2a2a3a"}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>

      {/* Lever handle */}
      <mesh ref={leverRef} position={[0, 0.05, 0.03]}>
        <boxGeometry args={[0.04, 0.2, 0.04]} />
        <meshStandardMaterial
          color={sw.isOn ? "#44ff44" : "#ff4444"}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Indicator light */}
      <mesh position={[0, -0.1, 0.04]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial
          color={sw.isOn ? "#44ff44" : "#441111"}
          emissive={sw.isOn ? "#44ff44" : "#000"}
          emissiveIntensity={sw.isOn ? 1 : 0}
        />
      </mesh>

      {/* Label number */}
      <mesh position={[0, -0.18, 0.04]}>
        <boxGeometry args={[0.08, 0.01, 0.01]} />
        <meshStandardMaterial color="#888" />
      </mesh>

      {/* Interaction hint glow when near */}
      {isNear && (
        <mesh position={[0, 0, 0.01]}>
          <boxGeometry args={[0.35, 0.35, 0.02]} />
          <meshStandardMaterial
            color="#4a9eff"
            transparent
            opacity={0.15}
          />
        </mesh>
      )}
    </group>
  );
}
