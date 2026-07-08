import { useCallback, useRef, useState } from "react";
import { findCanned, type Reveal } from "@/data/canned";

export type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

const CHAT_URL = import.meta.env.VITE_CHAT_URL as string | undefined;

const initialAssistant: Msg = {
  id: "boot",
  role: "assistant",
  content:
    "Hi — I'm the AI assistant on Sreehari's portfolio. Ask me anything about his work, projects or hackathon record, and I'll scroll the relevant section into view as I answer.",
};

function revealSection(section: Reveal) {
  if (!section) return;
  const el = document.getElementById(section);
  if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 450);
}

export function useChat() {
  const [messages, setMessages] = useState<Msg[]>([initialAssistant]);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const patch = useCallback((id: string, updater: (m: Msg) => Msg) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
  }, []);

  const streamCanned = useCallback(
    async (id: string, paragraphs: string[], reveal: Reveal) => {
      let acc = "";
      for (let p = 0; p < paragraphs.length; p++) {
        const words = paragraphs[p].match(/\S+\s*/g) ?? [paragraphs[p]];
        for (const w of words) {
          acc += w;
          patch(id, (m) => ({ ...m, content: acc }));
          await new Promise((r) => setTimeout(r, 16));
        }
        if (p < paragraphs.length - 1) {
          acc += "\n\n";
          await new Promise((r) => setTimeout(r, 60));
        }
      }
      patch(id, (m) => ({ ...m, streaming: false }));
      revealSection(reveal);
    },
    [patch],
  );

  const streamFromWorker = useCallback(
    async (id: string, history: Msg[]) => {
      const res = await fetch(CHAT_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok || !res.body) throw new Error("chat request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const evt of events) {
          const lines = evt.split("\n");
          const name = lines.find((l) => l.startsWith("event:"))?.slice(6).trim();
          const data = lines.find((l) => l.startsWith("data:"))?.slice(5).trim();
          if (!name || !data) continue;
          try {
            const parsed = JSON.parse(data);
            if (name === "delta" && parsed.text) {
              acc += parsed.text;
              patch(id, (m) => ({ ...m, content: acc }));
            } else if (name === "reveal" && parsed.section) {
              revealSection(parsed.section as Reveal);
            } else if (name === "done") {
              patch(id, (m) => ({ ...m, streaming: false }));
            } else if (name === "error") {
              throw new Error(parsed.message ?? "stream error");
            }
          } catch {
            /* ignore parse errors */
          }
        }
      }
      patch(id, (m) => ({ ...m, streaming: false }));
    },
    [patch],
  );

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || busyRef.current) return;
      busyRef.current = true;
      setBusy(true);

      const userMsg: Msg = { id: `u-${Date.now()}`, role: "user", content: text };
      const assistantId = `a-${Date.now()}`;
      const history = [...messages, userMsg];
      setMessages([...history, { id: assistantId, role: "assistant", content: "", streaming: true }]);

      try {
        const canned = findCanned(text);
        if (canned) {
          await streamCanned(assistantId, canned.paragraphs, canned.reveal ?? null);
        } else if (CHAT_URL) {
          await streamFromWorker(assistantId, history);
        } else {
          await streamCanned(
            assistantId,
            [
              "I can only answer from a fixed set of topics right now — the live model isn't wired up on this deployment.",
              "Try a suggested question below, or reach Sreehari directly at **sreeharipradeepkumar1996@gmail.com**.",
            ],
            "contact",
          );
        }
      } catch {
        patch(assistantId, (m) => ({
          ...m,
          streaming: false,
          content:
            "Something went wrong reaching the assistant. You can still browse the page below, or email **sreeharipradeepkumar1996@gmail.com**.",
        }));
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [messages, patch, streamCanned, streamFromWorker],
  );

  return { messages, busy, send };
}
