"use client";

import { H1, H2, P, UL, LI, Code, Badge, Strong } from "../editor/md";
import { projects } from "@/lib/data";

const PROJECT_BADGES: Record<string, { label: string; color: string }> = {
  ForgeAlign: { label: "open source", color: "#34d399" },
  AlphaGuide: { label: "hackathon · winner", color: "#fbbf24" },
  ProjectDebAIt: { label: "experimental", color: "#a78bfa" },
  Hemy: { label: "voice ai", color: "#22d3ee" },
  SeaPulse: { label: "client work · live", color: "#60a5fa" },
  InsightDesk: { label: "ai saas", color: "#f472b6" },
};

const idOf: Record<string, string> = {
  ForgeAlign: "forgealign",
  AlphaGuide: "alphaguide",
  ProjectDebAIt: "projectdebait",
  Hemy: "hemy",
  SeaPulse: "seapulse",
  InsightDesk: "insightdesk",
};

export function Projects() {
  return (
    <>
      <H1 id="projects">Projects</H1>
      <P>
        A mix of production work, hackathon wins and open experiments — all
        built on multi-agent runtimes, retrieval, and modern web stacks.
      </P>

      {projects.map((p) => {
        const badge = PROJECT_BADGES[p.name];
        return (
          <div key={p.name}>
            <H2 id={idOf[p.name] ?? p.name.toLowerCase()}>{p.name}</H2>
            <div className="flex items-center gap-2 -mt-1 mb-3 text-zinc-500 text-[13px]">
              <Strong>{p.tagline}</Strong>
              {badge && <Badge color={badge.color}>{badge.label}</Badge>}
            </div>
            <P>{p.description}</P>
            <P>
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-zinc-500">
                Built with
              </span>
              <span className="ml-2 inline-flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <Code key={s}>{s}</Code>
                ))}
              </span>
            </P>
          </div>
        );
      })}
    </>
  );
}
