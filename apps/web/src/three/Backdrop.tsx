import { lazy, Suspense, useEffect, useState } from "react";
import { StaticSwarm } from "./StaticSwarm";
import { useReducedMotion, hasWebGL } from "@/lib/useReducedMotion";

const SwarmCanvas = lazy(() => import("./SwarmCanvas"));

/** Picks the live R3F swarm, or a static fallback for reduced-motion / no-WebGL. */
export function Backdrop() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || reduced || !hasWebGL()) return <StaticSwarm />;
  return (
    <Suspense fallback={<StaticSwarm />}>
      <SwarmCanvas />
    </Suspense>
  );
}
