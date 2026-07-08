import { swarmTheme } from "./theme";

export type Vec3 = { x: number; y: number; z: number };

export type SwarmState = {
  count: number;
  home: Float32Array; // count*3
  pos: Float32Array; // count*3
  vel: Float32Array; // count*3
  /** node accent factor 0 = cyan, 1 = violet */
  tint: Float32Array; // count
  edges: Uint32Array; // pairs (a,b) flattened, length = edgeCount*2
  edgeIntensity: Float32Array; // per edge, 0..1 negotiation glow
};

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Force pulling a coordinate back toward its home (spring). Pure. */
export function settleAccel(coord: number, home: number, spring: number): number {
  return (home - coord) * spring;
}

/**
 * Repulsion acceleration on a node from a cursor point, in the XY plane.
 * Returns {x,y} acceleration; zero outside radius. Pure + unit-testable.
 */
export function repelAccel(
  nx: number,
  ny: number,
  cx: number,
  cy: number,
  radius: number,
  strength: number,
): { x: number; y: number } {
  const dx = nx - cx;
  const dy = ny - cy;
  const distSq = dx * dx + dy * dy;
  if (distSq >= radius * radius || distSq === 0) return { x: 0, y: 0 };
  const dist = Math.sqrt(distSq);
  const falloff = (1 - dist / radius) / dist; // normalize + linear falloff
  return { x: dx * falloff * strength, y: dy * falloff * strength };
}

export function buildSwarm(
  count: number = swarmTheme.nodeCount,
  bounds: { x: number; y: number; z: number } = swarmTheme.bounds,
  seed = 7,
): SwarmState {
  const rand = mulberry32(seed);
  const home = new Float32Array(count * 3);
  const pos = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  const tint = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const x = (rand() - 0.5) * 2 * bounds.x;
    const y = (rand() - 0.5) * 2 * bounds.y;
    const z = (rand() - 0.5) * 2 * bounds.z;
    home[i * 3] = x;
    home[i * 3 + 1] = y;
    home[i * 3 + 2] = z;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;
    tint[i] = rand(); // 0..1 cyan→violet
  }

  // Edges by proximity, capped per node.
  const edgeList: number[] = [];
  const degree = new Uint8Array(count);
  const dThresh = swarmTheme.edgeDistance;
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      if (degree[i] >= swarmTheme.maxEdgesPerNode) break;
      if (degree[j] >= swarmTheme.maxEdgesPerNode) continue;
      const dx = home[i * 3] - home[j * 3];
      const dy = home[i * 3 + 1] - home[j * 3 + 1];
      const dz = home[i * 3 + 2] - home[j * 3 + 2];
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < dThresh) {
        edgeList.push(i, j);
        degree[i]++;
        degree[j]++;
      }
    }
  }

  return {
    count,
    home,
    pos,
    vel,
    tint,
    edges: Uint32Array.from(edgeList),
    edgeIntensity: new Float32Array(edgeList.length / 2),
  };
}
