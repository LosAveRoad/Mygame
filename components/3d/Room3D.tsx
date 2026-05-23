"use client";

export default function Room3D() {
  const wallColor = "#1a1a2e";
  const floorColor = "#0a0e17";
  const gridSize = 3;

  return (
    <group>
      {/* Floor — 3x3 grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0, 1]} receiveShadow>
        <planeGeometry args={[gridSize, gridSize]} />
        <meshStandardMaterial color={floorColor} />
      </mesh>

      {/* Grid lines on floor */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={`grid-${i}`}>
          <mesh position={[i, 0.001, 1]}>
            <boxGeometry args={[0.02, 0.005, gridSize]} />
            <meshStandardMaterial color="#1a2a3a" />
          </mesh>
          <mesh position={[1, 0.001, i]}>
            <boxGeometry args={[gridSize, 0.005, 0.02]} />
            <meshStandardMaterial color="#1a2a3a" />
          </mesh>
        </group>
      ))}

      {/* West wall (x=0, facing +x) */}
      <mesh position={[0, 1.5, 1]}>
        <boxGeometry args={[0.1, 3, gridSize]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* East wall (x=3, facing -x) */}
      <mesh position={[3, 1.5, 1]}>
        <boxGeometry args={[0.1, 3, gridSize]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* North wall (z=0, facing +z) — with door cutout handled by IronDoor */}
      {/* Left of door */}
      <mesh position={[0.5, 1.5, 0]}>
        <boxGeometry args={[1, 3, 0.1]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      {/* Right of door */}
      <mesh position={[2.5, 1.5, 0]}>
        <boxGeometry args={[1, 3, 0.1]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      {/* Above door */}
      <mesh position={[1.5, 2.75, 0]}>
        <boxGeometry args={[1, 0.5, 0.1]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* South wall (z=3) — with switch area */}
      {/* Left section */}
      <mesh position={[0.5, 1.5, 3]}>
        <boxGeometry args={[1, 3, 0.1]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      {/* Right section */}
      <mesh position={[2.5, 1.5, 3]}>
        <boxGeometry args={[1, 3, 0.1]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[1, 3, 1]}>
        <planeGeometry args={[gridSize, gridSize]} />
        <meshStandardMaterial color="#0d0d1a" />
      </mesh>
    </group>
  );
}
