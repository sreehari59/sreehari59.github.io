"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { FILES } from "../fileConfig";
import {
  PANEL_MAX_RATIO,
  PANEL_MIN_HEIGHT,
  useIDE,
} from "../IDEContext";

const TAB_LIST = ["PROBLEMS", "OUTPUT", "TERMINAL", "DEBUG CONSOLE"] as const;

const TERMINAL_LINES_FOR: Record<string, string[]> = {
  readme: [
    "$ scroll ↓ to continue reading",
    "$ tip: click any file in the explorer to jump to it",
  ],
  projects: [
    "$ ls projects/",
    "forgealign  alphaguide  projectdebait  hemy  seapulse  insightdesk",
    "$ # all shipped, all production-grade",
  ],
  experience: [
    "$ git log --since='2018-01-01' --pretty=format:'%cs %s'",
    "2025-01-01  founding ai team @ sartechlabs",
    "2024-09-01  ai engineer @ deutsches rotes kreuz",
    "2023-06-01  data scientist @ zew mannheim",
  ],
  awards: [
    "$ awards.filter(a => a.highlight)",
    "→ 2025-01  WEF Davos · AI Hackathon · 1st runner up",
    "$ # 7 total wins to date",
  ],
  skills: [
    "$ python -m sreehari.skills --summary",
    "languages: 6   ai/ml: 8   data/cloud: 8   frontend: 4   tools: 6",
  ],
  contact: [
    "$ open mailto:sreeharipradeepkumar1996@gmail.com",
    "$ # available for full-stack ai engineering work",
  ],
};

export function BottomPanel() {
  const {
    activeFile,
    fileProgress,
    panelOpen,
    panelHeight,
    setPanelOpen,
    setPanelHeight,
  } = useIDE();

  const [activeTab, setActiveTab] = useState<(typeof TAB_LIST)[number]>("TERMINAL");
  const [clock, setClock] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    function tick() {
      const d = new Date();
      setClock(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const startResize = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startH = panelHeight;
      setDragging(true);
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";

      function onMove(ev: PointerEvent) {
        const delta = startY - ev.clientY;
        setPanelHeight(startH + delta);
      }
      function onUp() {
        setDragging(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [panelHeight, setPanelHeight]
  );

  // Double-click handle resets to default
  const resetHeight = useCallback(() => {
    if (typeof window === "undefined") return;
    setPanelHeight(Math.min(220, window.innerHeight * PANEL_MAX_RATIO));
    void PANEL_MIN_HEIGHT;
  }, [setPanelHeight]);

  if (!panelOpen) return null;

  const file = FILES.find((f) => f.id === activeFile)!;
  const terminalLines = TERMINAL_LINES_FOR[activeFile] ?? [];

  return (
    <div
      className="hidden md:flex shrink-0 flex-col bg-[#0d1117] border-t border-white/[0.04] relative"
      style={{ height: panelHeight }}
    >
      {/* resize handle — sits across the top edge of the panel */}
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize panel"
        onPointerDown={startResize}
        onDoubleClick={resetHeight}
        className="absolute -top-1 left-0 right-0 h-2 z-30 cursor-ns-resize group"
        style={{ touchAction: "none" }}
      >
        <div
          className={`absolute left-0 right-0 top-1 h-px transition-colors ${
            dragging
              ? "bg-emerald-400"
              : "bg-transparent group-hover:bg-emerald-400/60"
          }`}
        />
      </div>

      {/* tab header */}
      <div className="h-7 shrink-0 flex items-center justify-between bg-[#0d1117] border-b border-white/[0.04] px-3 select-none">
        <div className="flex items-center gap-1">
          {TAB_LIST.map((t) => {
            const isActive = t === activeTab;
            return (
              <button
                type="button"
                key={t}
                onClick={() => setActiveTab(t)}
                className={`relative h-7 px-2.5 text-[10.5px] font-mono uppercase tracking-[0.18em] transition-colors ${
                  isActive
                    ? "text-zinc-200"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-emerald-400" />
                )}
                {t}
                {t === "PROBLEMS" && (
                  <span className="ml-1 text-[9px] px-1 rounded bg-white/[0.06] text-zinc-500">
                    0
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            aria-label="Hide panel"
            title="Hide panel"
            className="size-5 grid place-items-center rounded text-zinc-500 hover:text-white hover:bg-white/[0.06] transition"
          >
            <ChevronDown className="size-3" />
          </button>
          <button
            type="button"
            onClick={() => setPanelOpen(false)}
            aria-label="Close panel"
            title="Close panel"
            className="size-5 grid place-items-center rounded text-zinc-500 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="size-3" />
          </button>
        </div>
      </div>

      {/* tab body */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-2 font-mono text-[11.5px] leading-[1.7]">
        {activeTab === "TERMINAL" && (
          <div className="space-y-0.5">
            <div className="text-zinc-500">
              <span className="text-emerald-400">sreehari@portfolio</span>
              <span className="text-zinc-700"> in </span>
              <span style={{ color: file.accent }}>~/{file.filename}</span>
              <span className="text-zinc-700"> · </span>
              <span className="text-zinc-500">{clock}</span>
            </div>
            {terminalLines.map((l, i) => (
              <div
                key={i}
                className={
                  l.startsWith("$")
                    ? "text-zinc-300"
                    : l.startsWith("→") || l.startsWith("✓")
                      ? "text-emerald-300/90"
                      : "text-zinc-500"
                }
              >
                {l}
              </div>
            ))}
            <div className="text-zinc-300 mt-1">
              <span className="text-emerald-400">$ </span>
              <span className="text-zinc-100">_</span>
              <span className="inline-block w-2 h-3.5 ml-0.5 bg-emerald-400/70 animate-pulse align-middle" />
            </div>
          </div>
        )}

        {activeTab === "OUTPUT" && (
          <div className="text-zinc-500 space-y-0.5">
            <div>[render] {file.filename} … OK</div>
            <div>
              [scroll]{" "}
              <span style={{ color: file.accent }}>
                {(fileProgress * 100).toFixed(1)}%
              </span>{" "}
              of editor
            </div>
            <div>[active] {file.filename} · {file.description}</div>
          </div>
        )}

        {activeTab === "PROBLEMS" && (
          <div className="text-zinc-600">
            No problems have been detected in the workspace.
          </div>
        )}

        {activeTab === "DEBUG CONSOLE" && (
          <div className="text-zinc-600 italic">
            // no debug session is active.
          </div>
        )}
      </div>
    </div>
  );
}
