"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Glyph() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += dt * 0.6;
    meshRef.current.rotation.x += dt * 0.25;
    meshRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.4) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 3]} intensity={2.4} color="#34d399" />
      <pointLight position={[-2, -1, 2]} intensity={1.4} color="#22d3ee" />
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial
          color="#0a0d13"
          emissive="#34d399"
          emissiveIntensity={0.35}
          roughness={0.18}
          metalness={0.85}
        />
      </mesh>
    </>
  );
}

/**
 * Tiny 3D glyph used in the title bar — a slowly rotating icosahedron.
 * The only 3D detail in the entire IDE.
 */
export default function LiveGlyph() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 2.3], fov: 50 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <Glyph />
    </Canvas>
  );
}
