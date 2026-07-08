"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { Moon, Sun, TerminalSquare, X } from "lucide-react";
import { useIDE } from "../IDEContext";

/* ---- theme: mirrors the global `dark` class + localStorage convention ---- */
function subscribe(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}
function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}
function getServerSnapshot() {
  return true;
}
function applyTheme(dark: boolean) {
  const root = document.documentElement;
  if (dark) root.classList.add("dark");
  else root.classList.remove("dark");
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {}
}

export function SettingsDialog({ onClose }: { onClose: () => void }) {
  const { panelOpen, setPanelOpen } = useIDE();
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const stop = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-[2px] p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onClick={stop}
        className="w-full max-w-sm rounded-lg border border-white/10 bg-[#181b22] text-zinc-200 shadow-2xl"
      >
        {/* header */}
        <div className="flex items-center justify-between px-4 h-11 border-b border-white/[0.06]">
          <span className="text-[13px] font-medium tracking-wide">Settings</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="size-6 grid place-items-center rounded text-zinc-500 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* appearance */}
          <section>
            <h3 className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-2">
              Appearance
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <ThemeOption
                active={isDark}
                onClick={() => applyTheme(true)}
                icon={<Moon className="size-4" />}
                label="Dark"
              />
              <ThemeOption
                active={!isDark}
                onClick={() => applyTheme(false)}
                icon={<Sun className="size-4" />}
                label="Light"
              />
            </div>
          </section>

          {/* terminal / panel */}
          <section>
            <h3 className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 mb-2">
              Panel
            </h3>
            <button
              type="button"
              onClick={() => setPanelOpen(!panelOpen)}
              className="w-full flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left hover:bg-white/[0.04] transition"
            >
              <span className="flex items-center gap-2 text-[13px]">
                <TerminalSquare className="size-4 text-emerald-400" />
                Terminal panel
              </span>
              <span
                aria-hidden
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  panelOpen ? "bg-emerald-500/80" : "bg-zinc-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${
                    panelOpen ? "left-[18px]" : "left-0.5"
                  }`}
                />
              </span>
            </button>
            <p className="mt-1.5 text-[11px] text-zinc-500">
              Closed the terminal? Toggle it back on here, or use the{" "}
              <span className="text-zinc-400">panel</span> button in the status
              bar.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function ThemeOption({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-[13px] transition ${
        active
          ? "border-emerald-400/60 bg-emerald-400/10 text-white"
          : "border-white/[0.06] bg-white/[0.02] text-zinc-400 hover:bg-white/[0.04]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
