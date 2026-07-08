"use client";

import dynamic from "next/dynamic";

const LiveGlyph = dynamic(() => import("./LiveGlyph"), {
  ssr: false,
  loading: () => (
    <div className="size-full rounded bg-gradient-to-br from-emerald-400 to-cyan-400" />
  ),
});

export function LiveGlyphLazy() {
  return <LiveGlyph />;
}
