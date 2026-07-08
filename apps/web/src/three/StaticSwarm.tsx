import { useMemo } from "react";

/** Static, animation-free fallback for reduced-motion / no-WebGL. */
export function StaticSwarm() {
  const { nodes, edges } = useMemo(() => {
    let s = 7;
    const rand = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    const n: { x: number; y: number; r: number }[] = [];
    const cols = 8;
    const rows = 6;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        n.push({
          x: (c + 0.5) * (100 / cols) + (rand() - 0.5) * 6,
          y: (r + 0.5) * (100 / rows) + (rand() - 0.5) * 6,
          r: 0.4 + rand() * 0.5,
        });
      }
    }
    const e: [number, number][] = [];
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        const d = Math.hypot(n[i].x - n[j].x, n[i].y - n[j].y);
        if (d < 16 && rand() > 0.5) e.push([i, j]);
      }
    }
    return { nodes: n, edges: e };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#06080f]" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.14),transparent_45%),radial-gradient(circle_at_75%_65%,rgba(139,92,246,0.12),transparent_50%)]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="url(#edge-grad)"
            strokeWidth={0.09}
            opacity={0.25}
          />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={i % 3 === 0 ? "#8b5cf6" : "#22d3ee"} opacity={0.7} />
        ))}
      </svg>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 35%, #06080f 88%)" }}
      />
    </div>
  );
}
