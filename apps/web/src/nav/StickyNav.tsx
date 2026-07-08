import { useEffect, useState } from "react";
import { sections, profile } from "@/data/resume";
import { useActiveSection, useScrollProgress } from "@/lib/useActiveSection";
import { CommandPalette } from "./CommandPalette";
import { Command, Github, Linkedin, FileText, Menu, X, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/cn";

const ids = sections.map((s) => s.id);

export function StickyNav() {
  const active = useActiveSection(ids);
  const progress = useScrollProgress();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="border-b border-white/5 bg-[#06080f]/70 backdrop-blur-md">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                jump("top");
              }}
              className="font-display text-sm font-semibold tracking-tight text-white"
            >
              SPK<span className="text-cyan-400">.</span>
            </a>

            <ul className="hidden items-center gap-1 md:flex">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => jump(s.id)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm transition-colors",
                      active === s.id ? "text-cyan-300" : "text-zinc-400 hover:text-zinc-100",
                    )}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPaletteOpen(true)}
                className="hidden items-center gap-1.5 rounded-md border border-white/10 px-2 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-200 sm:flex"
                aria-label="Open command palette"
              >
                <Command className="size-3.5" /> K
              </button>
              <a
                href="/?gate=1"
                className="rounded-md p-1.5 text-zinc-400 transition-colors hover:text-cyan-300"
                aria-label="Switch view"
                title="Switch view"
              >
                <ArrowLeftRight className="size-4" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-1.5 text-zinc-400 transition-colors hover:text-cyan-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-4" />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-md p-1.5 text-zinc-400 transition-colors hover:text-cyan-300"
                aria-label="GitHub"
              >
                <Github className="size-4" />
              </a>
              <a
                href={profile.resumePdf}
                target="_blank"
                rel="noreferrer"
                className="ml-1 hidden items-center gap-1.5 rounded-md bg-cyan-400/90 px-3 py-1.5 text-xs font-medium text-[#06080f] transition-colors hover:bg-cyan-300 sm:flex"
              >
                <FileText className="size-3.5" /> Résumé
              </a>
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="rounded-md p-1.5 text-zinc-300 md:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>
          {/* scroll progress */}
          <div className="h-px w-full bg-transparent">
            <div
              className="h-px bg-gradient-to-r from-cyan-400 to-violet-500 transition-[width] duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* mobile menu */}
        {mobileOpen && (
          <div className="border-b border-white/10 bg-[#06080f]/95 backdrop-blur-md md:hidden">
            <ul className="mx-auto max-w-6xl px-6 py-3">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => jump(s.id)}
                    className={cn(
                      "block w-full py-2 text-left text-sm",
                      active === s.id ? "text-cyan-300" : "text-zinc-300",
                    )}
                  >
                    {s.label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href={profile.resumePdf}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-cyan-400/90 px-3 py-1.5 text-xs font-medium text-[#06080f]"
                >
                  <FileText className="size-3.5" /> Résumé
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
