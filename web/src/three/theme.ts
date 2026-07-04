import { Color } from "three";

export const swarmTheme = {
  cyan: new Color("#22d3ee"),
  violet: new Color("#8b5cf6"),
  edgeBase: new Color("#1e3a5f"),
  background: "#06080f",
  // simulation
  nodeCount: 90,
  edgeDistance: 3.4, // world units to connect two nodes
  maxEdgesPerNode: 4,
  bounds: { x: 14, y: 9, z: 5 },
  repelRadius: 3.2,
  repelStrength: 26,
  spring: 2.4, // pull back to home
  damping: 0.86,
  drift: 0.22,
  // bloom
  bloom: { intensity: 0.9, luminanceThreshold: 0.15, luminanceSmoothing: 0.4, mipmapBlur: true },
} as const;
