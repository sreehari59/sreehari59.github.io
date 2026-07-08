import React from "react";

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // **bold**, [link](url), and *italic*
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
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
        <strong key={`${keyPrefix}-b-${i++}`} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("[")) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        nodes.push(
          <a
            key={`${keyPrefix}-l-${i++}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-300 underline-offset-4 hover:underline"
          >
            {linkMatch[1]}
          </a>,
        );
      }
    } else {
      nodes.push(
        <em key={`${keyPrefix}-i-${i++}`} className="italic text-zinc-300">
          {token.slice(1, -1)}
        </em>,
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

export function MiniMarkdown({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <div className="space-y-2 font-mono">
      {paragraphs.map((para, i) => (
        <p key={i} className="text-zinc-200/90 leading-relaxed whitespace-pre-wrap">
          {renderInline(para, `p${i}`)}
        </p>
      ))}
    </div>
  );
}
