import { systemPrompt } from "@portfolio/content/systemPrompt";
import { findCanned } from "@portfolio/content/canned";

export interface Env {
  ANTHROPIC_API_KEY: string;
  ALLOWED_ORIGINS?: string; // comma-separated; defaults below
}

type ChatMessage = { role: "user" | "assistant"; content: string };

const DEFAULT_ORIGINS = ["https://sreehari59.github.io", "http://localhost:5173", "http://localhost:4173"];
const MODEL = "claude-haiku-4-5-20251001";
const enc = new TextEncoder();

function corsHeaders(env: Env, origin: string | null): Record<string, string> {
  const allowed = (env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()) ?? DEFAULT_ORIGINS).filter(Boolean);
  const allow = origin && allowed.includes(origin) ? origin : allowed[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function sse(event: string, data: unknown) {
  return enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

async function streamCanned(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  paragraphs: string[],
  reveal: string | null | undefined,
) {
  for (let p = 0; p < paragraphs.length; p++) {
    const chunks = paragraphs[p].match(/\S+\s*/g) ?? [paragraphs[p]];
    for (const c of chunks) {
      await writer.write(sse("delta", { text: c }));
      await new Promise((r) => setTimeout(r, 16));
    }
    if (p < paragraphs.length - 1) await writer.write(sse("delta", { text: "\n\n" }));
  }
  if (reveal) await writer.write(sse("reveal", { section: reveal }));
  await writer.write(sse("done", { source: "canned" }));
}

/** Reads Anthropic's SSE stream and re-emits our simplified delta/done events. */
async function pipeAnthropic(writer: WritableStreamDefaultWriter<Uint8Array>, upstream: ReadableStream<Uint8Array>) {
  const reader = upstream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";
    for (const evt of events) {
      const dataLine = evt.split("\n").find((l) => l.startsWith("data:"));
      if (!dataLine) continue;
      try {
        const json = JSON.parse(dataLine.slice(5).trim());
        if (json.type === "content_block_delta" && json.delta?.type === "text_delta") {
          await writer.write(sse("delta", { text: json.delta.text }));
        }
      } catch {
        /* ignore */
      }
    }
  }
  await writer.write(sse("done", { source: "llm" }));
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = req.headers.get("Origin");
    const cors = corsHeaders(env, origin);

    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: cors });

    let messages: ChatMessage[] = [];
    try {
      const body = (await req.json()) as { messages?: ChatMessage[] };
      messages = (body.messages ?? []).slice(-12); // cap history
    } catch {
      return new Response("Bad Request", { status: 400, headers: cors });
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const canned = lastUser ? findCanned(lastUser.content) : null;

    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();

    const run = async () => {
      try {
        if (canned) {
          await streamCanned(writer, canned.paragraphs, canned.reveal);
        } else if (!env.ANTHROPIC_API_KEY) {
          await streamCanned(
            writer,
            [
              "The live model isn't configured on this deployment yet.",
              "Try a suggested question, or reach Sreehari at **sreeharipradeepkumar1996@gmail.com**.",
            ],
            "contact",
          );
        } else {
          const upstream = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-api-key": env.ANTHROPIC_API_KEY,
              "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
              model: MODEL,
              max_tokens: 600,
              stream: true,
              system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
              messages,
            }),
          });
          if (!upstream.ok || !upstream.body) {
            const detail = await upstream.text().catch(() => "");
            await writer.write(sse("error", { message: `upstream ${upstream.status}: ${detail.slice(0, 200)}` }));
          } else {
            await pipeAnthropic(writer, upstream.body);
          }
        }
      } catch (err) {
        await writer.write(sse("error", { message: err instanceof Error ? err.message : "unknown error" }));
      } finally {
        await writer.close();
      }
    };
    run();

    return new Response(readable, {
      headers: {
        ...cors,
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  },
};
