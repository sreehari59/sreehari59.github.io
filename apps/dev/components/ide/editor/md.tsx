"use client";

import type { ReactNode } from "react";

/**
 * Markdown-preview primitives. These mirror what VS Code's markdown preview
 * shows when you `cmd+shift+v` a .md file. Edge-styled, monospace for code.
 */

export function H1({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h1
      id={id}
      className="scroll-mt-8 text-[28px] sm:text-[32px] font-semibold tracking-tight text-zinc-100 mt-2 mb-5 pb-3 border-b border-white/10"
    >
      {children}
    </h1>
  );
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-8 text-[20px] sm:text-[22px] font-semibold tracking-tight text-zinc-100 mt-10 mb-3 pb-1.5 border-b border-white/[0.06]"
    >
      {children}
    </h2>
  );
}

export function H3({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h3
      id={id}
      className="scroll-mt-8 text-[15px] sm:text-[16px] font-semibold text-zinc-200 mt-6 mb-2"
    >
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-[14.5px] leading-[1.75] text-zinc-300/90 my-3">
      {children}
    </p>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="my-3 space-y-1.5 text-[14.5px] leading-[1.75] text-zinc-300/90 pl-6 list-disc marker:text-zinc-600">
      {children}
    </ul>
  );
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="my-3 space-y-1.5 text-[14.5px] leading-[1.75] text-zinc-300/90 pl-6 list-decimal marker:text-zinc-600">
      {children}
    </ol>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return <li className="pl-1">{children}</li>;
}

export function A({
  href,
  children,
  external = true,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external && href.startsWith("http")
        ? { target: "_blank", rel: "noreferrer" }
        : {})}
      className="text-emerald-300 underline decoration-emerald-300/30 underline-offset-2 hover:decoration-emerald-300 transition"
    >
      {children}
    </a>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="font-mono text-[12.5px] px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-amber-200">
      {children}
    </code>
  );
}

export function CodeBlock({
  lang,
  children,
}: {
  lang?: string;
  children: ReactNode;
}) {
  return (
    <div className="my-4 rounded-md border border-white/10 bg-black/40 overflow-hidden">
      {lang && (
        <div className="px-3 py-1.5 border-b border-white/5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-zinc-500">
          {lang}
        </div>
      )}
      <pre className="px-4 py-3 font-mono text-[12.5px] leading-[1.7] text-zinc-300/90 overflow-x-auto whitespace-pre">
        {children}
      </pre>
    </div>
  );
}

export function HR() {
  return <hr className="my-8 border-t border-white/[0.06]" />;
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-zinc-100">{children}</strong>;
}

export function Em({ children }: { children: ReactNode }) {
  return <em className="italic text-zinc-300">{children}</em>;
}

export function Blockquote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-4 pl-4 border-l-2 border-emerald-400/40 text-zinc-400 italic text-[14px] leading-[1.7]">
      {children}
    </blockquote>
  );
}

/** Section badge — small accented tag e.g. "★ flagship" */
export function Badge({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <span
      className="font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded border"
      style={{
        color,
        borderColor: `${color}40`,
        background: `${color}10`,
      }}
    >
      {children}
    </span>
  );
}
