"use client";

import { AnimatePresence, motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import { IDEProvider, useIDE } from "./IDEContext";
import { TitleBar } from "./chrome/TitleBar";
import { ActivityBar } from "./chrome/ActivityBar";
import { Sidebar, MobileNavDrawer } from "./chrome/Sidebar";
import { TabBar } from "./chrome/TabBar";
import { Breadcrumb } from "./chrome/Breadcrumb";
import { Minimap } from "./chrome/Minimap";
import { BottomPanel } from "./chrome/BottomPanel";
import { StatusBar } from "./chrome/StatusBar";
import { Editor } from "./editor/Editor";
import { ChatPanel } from "./chat/ChatPanel";

/**
 * Floating "Ask Claude" trigger for small screens, where the ActivityBar
 * (the only desktop chat entry point) is hidden. Sits clear of the StatusBar
 * and hides itself while the chat sheet is open.
 */
function MobileChatFab() {
  const { chatOpen, toggleChat } = useIDE();
  return (
    <AnimatePresence>
      {!chatOpen && (
        <motion.button
          type="button"
          onClick={toggleChat}
          aria-label="Ask Claude"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.18 }}
          className="sm:hidden fixed bottom-9 right-4 z-40 flex items-center gap-2 h-12 pl-4 pr-5 rounded-full bg-[#e87052] text-black font-semibold text-[13px] shadow-lg shadow-black/30 active:scale-95 transition-transform"
        >
          <MessageSquare className="size-[18px]" strokeWidth={2} />
          Ask Claude
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function IDEInner() {
  const { chatOpen } = useIDE();
  return (
    <div className="ide-root fixed inset-0 flex flex-col bg-[#0d1117] text-zinc-300 overflow-hidden">
      <TitleBar />
      <div className="flex-1 min-h-0 flex">
        <ActivityBar />
        <Sidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <TabBar />
          <Breadcrumb />
          <div className="flex-1 min-h-0 flex">
            <div className="flex-1 min-w-0">
              <Editor />
            </div>
            <Minimap />
            <AnimatePresence>
              {chatOpen && <ChatPanel key="chat" />}
            </AnimatePresence>
          </div>
          <BottomPanel />
        </div>
      </div>
      <StatusBar />

      {/* mobile-only affordances */}
      <MobileNavDrawer />
      <MobileChatFab />
    </div>
  );
}

export function IDE() {
  return (
    <IDEProvider>
      <IDEInner />
    </IDEProvider>
  );
}
