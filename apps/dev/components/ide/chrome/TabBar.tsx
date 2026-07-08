"use client";

import { FileText, X } from "lucide-react";
import { FILES } from "../fileConfig";
import { useIDE } from "../IDEContext";

export function TabBar() {
  const { activeFile, jumpToFile } = useIDE();

  return (
    <div className="h-9 shrink-0 flex items-end bg-[#181b22] border-b border-black/40 select-none overflow-x-auto scrollbar-thin">
      {FILES.map((file) => {
        const isActive = file.id === activeFile;
        return (
          <button
            type="button"
            key={file.id}
            onClick={() => jumpToFile(file.id)}
            className={`group h-full relative flex items-center gap-2 pl-3 pr-2 text-[11.5px] font-mono border-r border-black/40 shrink-0 transition-colors ${
              isActive
                ? "bg-[#0d1117] text-zinc-100"
                : "bg-[#1a1d24] text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {isActive && (
              <span
                className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{ background: file.accent }}
              />
            )}
            <FileText
              className="size-3.5"
              style={{ color: isActive ? file.accent : "#6b7280" }}
            />
            <span>{file.filename}</span>
            <span
              aria-hidden
              className={`ml-1 size-4 grid place-items-center rounded transition ${
                isActive
                  ? "text-zinc-500 group-hover:text-zinc-300 group-hover:bg-white/[0.06]"
                  : "text-transparent group-hover:text-zinc-500"
              }`}
            >
              <X className="size-3" />
            </span>
          </button>
        );
      })}
      <div className="flex-1 h-full bg-[#181b22] border-b border-black/40" />
    </div>
  );
}
