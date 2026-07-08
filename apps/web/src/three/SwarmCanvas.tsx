import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  Color,
  InstancedMesh,
  Object3D,
  BufferAttribute,
  type BufferGeometry,
  AdditiveBlending,
  MathUtils,
} from "three";
import { swarmTheme } from "./theme";
import { buildSwarm, settleAccel, repelAccel } from "./useSwarm";
import { Negotiation } from "./negotiation";

const dummy = new Object3D();
const cA = new Color();
const cB = new Color();

function Swarm() {
  const swarm = useMemo(() => buildSwarm(), []);
  const negotiation = useMemo(() => new Negotiation(), []);
  const meshRef = useRef<InstancedMesh>(null);
  const edgeGeoRef = useRef<BufferGeometry>(null);
  const groupRotX = useRef(0);
  const groupRotY = useRef(0);
  const groupRef = useRef<import("three").Group>(null);
  const { viewport } = useThree();

  const edgeCount = swarm.edges.length / 2;
  const edgePositions = useMemo(() => new Float32Array(edgeCount * 2 * 3), [edgeCount]);
  const edgeColors = useMemo(() => new Float32Array(edgeCount * 2 * 3), [edgeCount]);

  // Node base colors (cyan → violet by tint)
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < swarm.count; i++) {
      cA.copy(swarmTheme.cyan).lerp(swarmTheme.violet, swarm.tint[i]);
      mesh.setColorAt(i, cA);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [swarm]);

  useLayoutEffect(() => {
    const geo = edgeGeoRef.current;
    if (!geo) return;
    geo.setAttribute("position", new BufferAttribute(edgePositions, 3));
    geo.setAttribute("color", new BufferAttribute(edgeColors, 3));
  }, [edgePositions, edgeColors]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh || document.hidden) return;
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    // Cursor in world units at z=0 plane
    const cx = state.pointer.x * (viewport.width / 2);
    const cy = state.pointer.y * (viewport.height / 2);

    const { pos, vel, home, count } = swarm;
    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // spring to home
      let fx = settleAccel(pos[ix], home[ix], swarmTheme.spring);
      let fy = settleAccel(pos[ix + 1], home[ix + 1], swarmTheme.spring);
      let fz = settleAccel(pos[ix + 2], home[ix + 2], swarmTheme.spring);
      // gentle drift
      fx += Math.cos(t * 0.3 + i * 1.7) * swarmTheme.drift;
      fy += Math.sin(t * 0.4 + i * 2.3) * swarmTheme.drift;
      fz += Math.sin(t * 0.25 + i * 0.9) * swarmTheme.drift * 0.5;
      // cursor repulsion (xy)
      const r = repelAccel(pos[ix], pos[ix + 1], cx, cy, swarmTheme.repelRadius, swarmTheme.repelStrength);
      fx += r.x;
      fy += r.y;

      vel[ix] = (vel[ix] + fx * dt) * swarmTheme.damping;
      vel[ix + 1] = (vel[ix + 1] + fy * dt) * swarmTheme.damping;
      vel[ix + 2] = (vel[ix + 2] + fz * dt) * swarmTheme.damping;
      pos[ix] += vel[ix] * dt;
      pos[ix + 1] += vel[ix + 1] * dt;
      pos[ix + 2] += vel[ix + 2] * dt;

      const pulse = 1 + Math.sin(t * 1.5 + i) * 0.18;
      dummy.position.set(pos[ix], pos[ix + 1], pos[ix + 2]);
      dummy.scale.setScalar(pulse);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // Negotiation glow + edge geometry
    negotiation.update(dt, swarm.edgeIntensity, swarm.edges);
    for (let e = 0; e < edgeCount; e++) {
      const a = swarm.edges[e * 2] * 3;
      const b = swarm.edges[e * 2 + 1] * 3;
      const v = e * 6;
      edgePositions[v] = pos[a];
      edgePositions[v + 1] = pos[a + 1];
      edgePositions[v + 2] = pos[a + 2];
      edgePositions[v + 3] = pos[b];
      edgePositions[v + 4] = pos[b + 1];
      edgePositions[v + 5] = pos[b + 2];

      const intensity = swarm.edgeIntensity[e];
      // base dim edge → bright cyan/violet when negotiating
      cA.copy(swarmTheme.edgeBase);
      cB.copy(swarmTheme.cyan).lerp(swarmTheme.violet, (Math.sin(t + e) + 1) / 2);
      cA.lerp(cB, intensity);
      const base = 0.28 + intensity * 0.9;
      edgeColors[v] = cA.r * base;
      edgeColors[v + 1] = cA.g * base;
      edgeColors[v + 2] = cA.b * base;
      edgeColors[v + 3] = cA.r * base;
      edgeColors[v + 4] = cA.g * base;
      edgeColors[v + 5] = cA.b * base;
    }
    const geo = edgeGeoRef.current;
    if (geo) {
      (geo.attributes.position as BufferAttribute).needsUpdate = true;
      (geo.attributes.color as BufferAttribute).needsUpdate = true;
    }

    // Parallax: whole group tilts toward cursor
    groupRotY.current = MathUtils.lerp(groupRotY.current, state.pointer.x * 0.18, 0.05);
    groupRotX.current = MathUtils.lerp(groupRotX.current, -state.pointer.y * 0.12, 0.05);
    if (groupRef.current) {
      groupRef.current.rotation.y = groupRotY.current;
      groupRef.current.rotation.x = groupRotX.current;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, swarm.count]} frustumCulled={false}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={edgeGeoRef} />
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.9}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </lineSegments>
    </group>
  );
}

export default function SwarmCanvas() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 18], fov: 55 }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={[swarmTheme.background]} />
        <fog attach="fog" args={[swarmTheme.background, 16, 30]} />
        <Swarm />
        <EffectComposer>
          <Bloom
            intensity={swarmTheme.bloom.intensity}
            luminanceThreshold={swarmTheme.bloom.luminanceThreshold}
            luminanceSmoothing={swarmTheme.bloom.luminanceSmoothing}
            mipmapBlur={swarmTheme.bloom.mipmapBlur}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
