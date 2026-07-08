import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sections, profile } from "@/data/resume";
import { Search, CornerDownLeft, FileText, Mail } from "lucide-react";

type Action = { id: string; label: string; hint: string; run: () => void };

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const actions = useMemo<Action[]>(() => {
    const goto = (id: string) => () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      onClose();
    };
    return [
      { id: "top", label: "Top / Hero", hint: "section", run: goto("top") },
      ...sections.map((s) => ({ id: s.id, label: s.label, hint: "section", run: goto(s.id) })),
      {
        id: "resume",
        label: "Download résumé (PDF)",
        hint: "action",
        run: () => {
          window.open(profile.resumePdf, "_blank");
          onClose();
        },
      },
      {
        id: "email",
        label: "Email Sreehari",
        hint: "action",
        run: () => {
          window.location.href = `mailto:${profile.email}`;
          onClose();
        },
      },
    ];
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [query, actions]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => setCursor(0), [query]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[cursor]?.run();
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[18vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            className="w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-zinc-900/95 shadow-2xl"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4">
              <Search className="size-4 text-zinc-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to a section…"
                className="w-full bg-transparent py-3.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
                aria-label="Search sections and actions"
              />
              <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
                esc
              </kbd>
            </div>
            <ul className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-zinc-500">No matches.</li>
              )}
              {filtered.map((a, i) => (
                <li key={a.id}>
                  <button
                    onMouseEnter={() => setCursor(i)}
                    onClick={a.run}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      i === cursor ? "bg-cyan-400/10 text-white" : "text-zinc-300 hover:bg-white/5"
                    }`}
                  >
                    {a.hint === "action" ? (
                      a.id === "resume" ? (
                        <FileText className="size-4 text-violet-300" />
                      ) : (
                        <Mail className="size-4 text-cyan-300" />
                      )
                    ) : (
                      <span className="size-1.5 rounded-full bg-cyan-400/70" />
                    )}
                    <span className="flex-1">{a.label}</span>
                    {i === cursor && <CornerDownLeft className="size-3.5 text-zinc-500" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
