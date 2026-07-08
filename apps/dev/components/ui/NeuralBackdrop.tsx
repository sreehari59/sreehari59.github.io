"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

type Node = { x: number; y: number; r: number };

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function NeuralBackdrop() {
  const { nodes, edges } = useMemo(() => {
    const rand = seededRandom(7);
    const n: Node[] = [];
    const cols = 7;
    const rows = 5;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        n.push({
          x: (c + 0.5) * (100 / cols) + (rand() - 0.5) * 6,
          y: (r + 0.5) * (100 / rows) + (rand() - 0.5) * 6,
          r: 0.4 + rand() * 0.5,
        });
      }
    }
    const e: Array<[number, number]> = [];
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        const dx = n[i].x - n[j].x;
        const dy = n[i].y - n[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 18 && rand() > 0.55) e.push([i, j]);
      }
    }
    return { nodes: n, edges: e };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.10),transparent_45%),radial-gradient(circle_at_75%_60%,rgba(34,211,238,0.08),transparent_50%),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.07),transparent_55%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.18),transparent_45%),radial-gradient(circle_at_75%_60%,rgba(34,211,238,0.14),transparent_50%),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.12),transparent_55%)]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
          <radialGradient id="node-grad">
            <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {edges.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="url(#edge-grad)"
            strokeWidth={0.08}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.35, 0.05] }}
            transition={{
              duration: 6 + (i % 5),
              repeat: Infinity,
              delay: (i % 11) * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}

        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill="#10b981"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.9, 0.2] }}
            transition={{
              duration: 4 + (i % 5),
              repeat: Infinity,
              delay: (i % 13) * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, var(--background) 85%)",
        }}
      />
    </div>
  );
}
