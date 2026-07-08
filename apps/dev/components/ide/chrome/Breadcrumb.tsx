"use client";

import { ChevronRight, FolderOpen, FileText } from "lucide-react";
import { FILES } from "../fileConfig";
import { useIDE } from "../IDEContext";

export function Breadcrumb() {
  const { activeFile, fileProgress } = useIDE();
  const file = FILES.find((f) => f.id === activeFile)!;

  return (
    <div className="h-7 shrink-0 flex items-center justify-between gap-2 px-4 bg-[#0d1117] border-b border-white/[0.04] select-none font-mono text-[11px]">
      <div className="flex items-center gap-1.5 text-zinc-500 truncate">
        <FolderOpen className="size-3 text-amber-400/70 shrink-0" />
        <span>sreehari.portfolio</span>
        <ChevronRight className="size-3 text-zinc-700" />
        <FileText
          className="size-3 shrink-0"
          style={{ color: file.accent }}
        />
        <span style={{ color: file.accent }}>{file.filename}</span>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-zinc-600">
        <span>{(fileProgress * 100).toFixed(0)}%</span>
        <div className="w-24 h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full transition-[width] duration-150"
            style={{
              width: `${fileProgress * 100}%`,
              background: file.accent,
              boxShadow: `0 0 10px ${file.accent}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
