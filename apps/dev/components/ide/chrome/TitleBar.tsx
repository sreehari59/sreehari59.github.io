"use client";

import { GitBranch, Mail, Menu, Search, Settings } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../../ui/BrandIcons";
import { profile } from "@/lib/data";
import { LiveGlyphLazy } from "../LiveGlyphLazy";
import { useIDE } from "../IDEContext";

export function TitleBar() {
  const { toggleNav } = useIDE();

  return (
    <div className="h-9 shrink-0 flex items-center justify-between gap-3 px-2 sm:px-3 bg-[#181b22] border-b border-black/40 text-zinc-300 select-none">
      {/* left: hamburger (mobile) + traffic lights + project */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* mobile Explorer trigger — replaces the hidden Sidebar below lg */}
        <button
          type="button"
          onClick={toggleNav}
          aria-label="Open Explorer"
          className="lg:hidden size-8 -ml-0.5 grid place-items-center rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
        >
          <Menu className="size-4" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>

        {/* project label: full meta on sm+, compact name on mobile */}
        <span className="sm:hidden font-mono text-[12px] text-zinc-200 truncate">
          sreehari.portfolio
        </span>

        <div className="hidden sm:flex items-center gap-2 ml-3 min-w-0">
          <div className="size-5 rounded shrink-0 overflow-hidden">
            <LiveGlyphLazy />
          </div>
          <span className="font-mono text-[12px] text-zinc-200 truncate">
            sreehari.portfolio
          </span>
          <span className="text-zinc-600">—</span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-zinc-500">
            <GitBranch className="size-3" />
            main
          </span>
        </div>
      </div>

      {/* center: command palette-ish search */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-black/30 border border-white/[0.04] w-72 max-w-[40%] text-zinc-500">
        <Search className="size-3.5" />
        <span className="font-mono text-[11.5px]">
          sreehari.portfolio
        </span>
      </div>

      {/* right: contact + settings */}
      <div className="flex items-center gap-1 shrink-0">
        <span
          className="hidden lg:inline font-mono text-[10.5px] uppercase tracking-[0.18em] text-emerald-400/80 mr-2"
          aria-hidden
        >
          ● available
        </span>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="size-7 grid place-items-center rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
        >
          <GithubIcon className="size-3.5" />
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="size-7 grid place-items-center rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
        >
          <LinkedinIcon className="size-3.5" />
        </a>
        <a
          href={`mailto:${profile.email}`}
          aria-label="Email"
          className="size-7 grid place-items-center rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
        >
          <Mail className="size-3.5" />
        </a>
        <Settings className="size-3.5 text-zinc-600 ml-1" aria-hidden />
      </div>
    </div>
  );
}
