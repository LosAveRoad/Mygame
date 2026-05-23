"use client";

import { Canvas } from "@react-three/fiber";
import SceneSetup from "./SceneSetup";
import Room3D from "./Room3D";
import IronDoor from "./IronDoor";
import Switch3D from "./Switch3D";
import Character3D from "./Character3D";

export default function Scene3DContent() {
  return (
    <Canvas shadows>
      <SceneSetup />

      <Room3D />

      <IronDoor />

      <Switch3D id={0} position={[0.5, 0.8, 2.95]} />
      <Switch3D id={1} position={[1.5, 0.8, 2.95]} />
      <Switch3D id={2} position={[2.5, 0.8, 2.95]} />

      <Character3D />
    </Canvas>
  );
}
