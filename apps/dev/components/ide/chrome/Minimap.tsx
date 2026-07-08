"use client";

import { FILES } from "../fileConfig";
import { useIDE } from "../IDEContext";

/**
 * A tiny abstract minimap on the right edge, like VSCode's. Each "block"
 * stands for one file; the active file glows. A floating viewport indicator
 * tracks scroll progress.
 */
export function Minimap() {
  const { activeFile, fileProgress } = useIDE();

  return (
    <div className="hidden xl:flex w-14 shrink-0 flex-col bg-[#0a0d13] border-l border-white/[0.04] py-2 px-1.5 select-none">
      <div className="flex-1 relative">
        {FILES.map((file) => {
          const isActive = file.id === activeFile;
          // each file occupies a portion of vertical height
          return (
            <div
              key={file.id}
              className="relative mb-2 last:mb-0"
              style={{ height: `${100 / FILES.length}%` }}
            >
              <div
                className="absolute inset-0 rounded-sm transition-opacity"
                style={{
                  background: file.accent,
                  opacity: isActive ? 0.18 : 0.045,
                }}
              />
              {/* fake code lines */}
              <div className="absolute inset-0 p-1.5 flex flex-col gap-[2px]">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[2px] rounded-full"
                    style={{
                      background: isActive
                        ? `${file.accent}b3`
                        : "rgba(120,120,140,0.18)",
                      width: `${30 + ((i * 47) % 60)}%`,
                    }}
                  />
                ))}
              </div>
              {/* file label */}
              <div
                className="absolute right-1 top-1 font-mono text-[7.5px] uppercase tracking-[0.18em]"
                style={{
                  color: isActive ? file.accent : "#3f3f46",
                }}
              >
                {file.filename.replace(".md", "")}
              </div>
            </div>
          );
        })}

        {/* viewport indicator */}
        <div
          className="absolute left-0 right-0 border border-emerald-300/40 rounded-sm pointer-events-none transition-[top] duration-150"
          style={{
            top: `calc(${fileProgress * 90}% )`,
            height: "10%",
            background: "rgba(52, 211, 153, 0.06)",
          }}
        />
      </div>
    </div>
  );
}
