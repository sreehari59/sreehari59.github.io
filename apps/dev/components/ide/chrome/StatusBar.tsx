"use client";

import {
  Check,
  GitBranch,
  Wifi,
  Bell,
  ChevronUp,
  TerminalSquare,
} from "lucide-react";
import Link from "next/link";
import { FILES } from "../fileConfig";
import { useIDE } from "../IDEContext";

export function StatusBar() {
  const { activeFile, fileProgress, panelOpen, togglePanel } = useIDE();
  const file = FILES.find((f) => f.id === activeFile)!;
  const indexInFiles = file.index + 1;

  // fake line/col derived from progress so it looks alive
  const fakeLine = Math.floor(fileProgress * 320) + 1;
  const fakeCol = Math.floor((fileProgress * 53) % 80) + 1;

  return (
    <div
      className="h-6 shrink-0 flex items-stretch justify-between text-[10.5px] font-mono select-none"
      style={{
        background: `linear-gradient(90deg, ${file.accent}, ${file.accent}cc)`,
        color: "#0a0d13",
      }}
    >
      {/* left cluster */}
      <div className="flex items-stretch">
        <Cell><GitBranch className="size-3" /> main*</Cell>
        <Cell><Check className="size-3" /> 0</Cell>
        <Cell>
          <ChevronUp className="size-3" /> Outline
        </Cell>
        <Cell hideOnSmall>
          {file.filename} — {file.description}
        </Cell>
      </div>

      {/* right cluster */}
      <div className="flex items-stretch">
        <Cell hideOnSmall>
          Section {indexInFiles}/{FILES.length}
        </Cell>
        <Cell>Ln {fakeLine}, Col {fakeCol}</Cell>
        <Cell hideOnSmall>UTF-8</Cell>
        <Cell hideOnSmall>{file.language}</Cell>
        <Cell hideOnSmall><Wifi className="size-3" /> live</Cell>
        <Link
          href="/classic"
          className="flex items-center gap-1 px-2.5 hover:bg-black/15 transition cursor-pointer"
        >
          2d.fallback
        </Link>
        <button
          type="button"
          onClick={togglePanel}
          aria-label={panelOpen ? "Hide panel" : "Show panel"}
          title={panelOpen ? "Hide panel" : "Show panel"}
          className={`flex items-center gap-1 px-2.5 transition cursor-pointer ${
            panelOpen ? "hover:bg-black/15" : "bg-black/25 hover:bg-black/35"
          }`}
        >
          <TerminalSquare className="size-3" />
          <span className="hidden sm:inline">panel</span>
        </button>
        <Cell><Bell className="size-3" /></Cell>
      </div>
    </div>
  );
}

function Cell({
  children,
  hideOnSmall,
}: {
  children: React.ReactNode;
  hideOnSmall?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1 px-2.5 hover:bg-black/15 transition cursor-default ${
        hideOnSmall ? "hidden md:flex" : ""
      }`}
    >
      {children}
    </div>
  );
}
