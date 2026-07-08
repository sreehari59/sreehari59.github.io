"use client";

import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  FileText,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FILES } from "../fileConfig";
import { useIDE } from "../IDEContext";

/**
 * The Explorer body — file tree + outline. Shared between the always-on
 * desktop `<Sidebar>` and the small-screen `<MobileNavDrawer>`. `onNavigate`
 * lets the drawer close itself after the user jumps somewhere.
 */
function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { activeFile, jumpToFile } = useIDE();
  const active = FILES.find((f) => f.id === activeFile)!;

  return (
    <>
      {/* Explorer header */}
      <div className="flex items-center justify-between px-3 py-1.5 text-[10.5px] uppercase tracking-[0.18em] text-zinc-500">
        <span>Explorer</span>
      </div>

      {/* File tree */}
      <div className="px-1 pb-3">
        <button
          type="button"
          className="w-full flex items-center gap-1 px-2 py-1 rounded hover:bg-white/[0.03] text-zinc-300 transition"
        >
          <ChevronDown className="size-3 text-zinc-500" />
          <FolderOpen className="size-3.5 text-amber-400/80" />
          <span className="ml-1 text-[12px]">sreehari.portfolio</span>
        </button>

        <ul className="mt-0.5 ml-3">
          {FILES.map((file) => {
            const isActive = file.id === activeFile;
            return (
              <li key={file.id}>
                <button
                  type="button"
                  onClick={() => {
                    jumpToFile(file.id);
                    onNavigate?.();
                  }}
                  className={`w-full flex items-center gap-2 pl-4 pr-2 py-1.5 sm:py-1 rounded text-left transition-colors relative group ${
                    isActive
                      ? "bg-white/[0.06] text-white"
                      : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
                  }`}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-1 bottom-1 w-[2px] rounded-r"
                      style={{ background: file.accent }}
                    />
                  )}
                  <FileText
                    className="size-3.5 shrink-0"
                    style={{ color: isActive ? file.accent : "#6b7280" }}
                  />
                  <span className="truncate text-[12px]">{file.filename}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Outline */}
      <div className="px-3 py-1.5 text-[10.5px] uppercase tracking-[0.18em] text-zinc-500 border-t border-white/[0.04] mt-1">
        <span>Outline · {active.filename}</span>
      </div>
      <div className="flex-1 min-h-0 px-1 pb-3 overflow-y-auto scrollbar-thin">
        <ul className="ml-2">
          {active.outline.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => {
                  // smooth-scroll inside the editor scroll container
                  const root = document.querySelector<HTMLDivElement>(
                    "[data-editor-root]"
                  );
                  const target = document.getElementById(o.id);
                  if (root && target) {
                    const top =
                      target.getBoundingClientRect().top -
                      root.getBoundingClientRect().top +
                      root.scrollTop -
                      16;
                    root.scrollTo({ top, behavior: "smooth" });
                  }
                  onNavigate?.();
                }}
                className="w-full flex items-center gap-1.5 pl-2 pr-2 py-1 sm:py-0.5 rounded text-left text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200 transition truncate"
                style={{ paddingLeft: `${(o.level - 1) * 12 + 8}px` }}
              >
                <ChevronRight className="size-3 text-zinc-700 shrink-0" />
                <span
                  className={`font-mono text-[11px] ${
                    o.level === 1 ? "text-zinc-200" : ""
                  }`}
                >
                  {o.text}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/** Desktop Explorer — pinned to the left from `lg` up. */
export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-[#1a1d24] border-r border-black/30 text-[12px] text-zinc-300 select-none">
      <SidebarBody />
    </aside>
  );
}

/**
 * Mobile Explorer — a slide-in drawer that mirrors the desktop Sidebar so file
 * and outline navigation stay reachable on small screens (where the real
 * Sidebar is hidden). Width is viewport-relative and capped, never a fixed px.
 */
export function MobileNavDrawer() {
  const { navOpen, setNavOpen } = useIDE();

  return (
    <AnimatePresence>
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* backdrop */}
          <motion.button
            type="button"
            aria-label="Close navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
          />

          {/* panel */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex w-[80vw] max-w-xs flex-col bg-[#1a1d24] border-r border-black/30 text-[12px] text-zinc-300 select-none shadow-2xl shadow-black/40"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04]">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-zinc-500">
                sreehari.portfolio
              </span>
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                aria-label="Close navigation"
                className="size-8 -mr-1 grid place-items-center rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              <SidebarBody onNavigate={() => setNavOpen(false)} />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
