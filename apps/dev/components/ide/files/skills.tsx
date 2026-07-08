"use client";

import { H1, H2, P, Code } from "../editor/md";
import { skills, languages } from "@/lib/data";

const ID_OF: Record<string, string> = {
  Languages: "languages",
  "AI & ML": "ai-ml",
  "Data & Cloud": "data-cloud",
  Frontend: "frontend",
  Tools: "tools",
};

const HINT: Record<string, string> = {
  Languages: "What I write in day to day.",
  "AI & ML":
    "Frameworks I use to build, train, and operate agent systems and ML models.",
  "Data & Cloud":
    "Where data lives, how it moves, and where the systems I build run.",
  Frontend:
    "What I reach for when the agent needs a face.",
  Tools:
    "Things on my desktop that make the rest of this list possible.",
};

export function Skills() {
  return (
    <>
      <H1 id="skills">Skills</H1>
      <P>
        A mostly-up-to-date stack I work in. Grouped by where each tool tends
        to sit in the system.
      </P>

      {Object.entries(skills).map(([category, items]) => (
        <div key={category}>
          <H2 id={ID_OF[category] ?? category.toLowerCase()}>{category}</H2>
          <P>{HINT[category]}</P>
          <div className="flex flex-wrap gap-1.5 my-3">
            {items.map((s) => (
              <Code key={s}>{s}</Code>
            ))}
          </div>
        </div>
      ))}

      <H2 id="languages-spoken">Spoken languages</H2>
      <div className="space-y-1">
        {languages.map((l) => (
          <p key={l.name} className="text-[14px] text-zinc-300/90">
            <span className="text-zinc-100 font-medium">{l.name}</span>
            <span className="text-zinc-500"> — {l.level}</span>
          </p>
        ))}
      </div>
    </>
  );
}
