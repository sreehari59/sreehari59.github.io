"use client";

import React from "react";

function renderInline(
  text: string,
  keyPrefix: string,
  isDark: boolean
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong
          key={`${keyPrefix}-b-${i++}`}
          className={isDark ? "font-semibold text-white" : "font-semibold text-gray-900"}
        >
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*")) {
      nodes.push(
        <em
          key={`${keyPrefix}-i-${i++}`}
          className={isDark ? "italic text-zinc-300" : "italic text-gray-700"}
        >
          {token.slice(1, -1)}
        </em>
      );
    } else {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        nodes.push(
          <a
            key={`${keyPrefix}-l-${i++}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            className={
              isDark
                ? "text-[#e87052] underline-offset-4 hover:underline"
                : "text-[#c75a3a] underline-offset-4 hover:underline"
            }
          >
            {linkMatch[1]}
          </a>
        );
      }
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export function MiniMarkdown({
  text,
  theme = "dark",
}: {
  text: string;
  theme?: "dark" | "light";
}) {
  const isDark = theme === "dark";
  const paragraphs = text.split(/\n{2,}/);
  return (
    <div className="space-y-2">
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className={`leading-relaxed whitespace-pre-wrap text-[13px] ${
            isDark ? "text-zinc-300" : "text-gray-700"
          }`}
        >
          {renderInline(para, `p${i}`, isDark)}
        </p>
      ))}
    </div>
  );
}
