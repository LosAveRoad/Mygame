"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import type * as THREE from "three";

export default function SceneSetup() {
  return (
    <>
      <OrthographicCamera
        makeDefault
        position={[5, 6, 5]}
        zoom={55}
        near={0.1}
        far={100}
      />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 3]} intensity={0.8} castShadow />
      <pointLight position={[1, 2.5, 1]} intensity={0.4} color="#4a9eff" />
    </>
  );
}
