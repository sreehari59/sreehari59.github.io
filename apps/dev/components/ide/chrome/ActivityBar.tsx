"use client";

import { useState } from "react";
import {
  Files,
  Search,
  GitBranch,
  Bug,
  Boxes,
  Settings,
  CircleUser,
  MessageSquare,
} from "lucide-react";
import { SettingsDialog } from "./SettingsDialog";
import { useIDE } from "../IDEContext";

const STATIC_ITEMS = [
  { icon: Files, label: "Explorer" },
  { icon: Search, label: "Search" },
  { icon: GitBranch, label: "Source Control" },
  { icon: Bug, label: "Run & Debug" },
  { icon: Boxes, label: "Extensions" },
];

export function ActivityBar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { chatOpen, toggleChat } = useIDE();

  return (
    <>
      <div className="hidden sm:flex w-12 shrink-0 flex-col justify-between bg-[#181b22] border-r border-black/40 py-1 select-none">
        <div className="flex flex-col items-stretch">
          {/* Static decorative items */}
          {STATIC_ITEMS.map(({ icon: Icon, label }, i) => (
            <div
              key={label}
              title={label}
              aria-hidden
              className={`relative h-11 grid place-items-center text-zinc-500 ${
                i === 0 ? "text-zinc-100" : ""
              }`}
            >
              {i === 0 && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-emerald-400" />
              )}
              <Icon className="size-[18px]" strokeWidth={1.5} />
            </div>
          ))}

          {/* Chat button — the only interactive item */}
          <button
            type="button"
            onClick={toggleChat}
            title={chatOpen ? "Close chat" : "Ask Claude"}
            aria-label={chatOpen ? "Close chat" : "Ask Claude"}
            aria-pressed={chatOpen}
            className={`relative h-11 grid place-items-center transition-colors hover:text-zinc-100 hover:bg-white/[0.04] ${
              chatOpen ? "text-emerald-400" : "text-zinc-500"
            }`}
          >
            {chatOpen && (
              <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-emerald-400" />
            )}
            <MessageSquare className="size-[18px]" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex flex-col items-stretch">
          <div
            aria-hidden
            className="h-11 grid place-items-center text-zinc-600"
            title="Account"
          >
            <CircleUser className="size-[18px]" strokeWidth={1.5} />
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
            aria-label="Open settings"
            aria-haspopup="dialog"
            className={`h-11 grid place-items-center transition-colors hover:text-zinc-100 hover:bg-white/[0.04] ${
              settingsOpen ? "text-zinc-100" : "text-zinc-600"
            }`}
          >
            <Settings className="size-[18px]" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {settingsOpen && <SettingsDialog onClose={() => setSettingsOpen(false)} />}
    </>
  );
}
