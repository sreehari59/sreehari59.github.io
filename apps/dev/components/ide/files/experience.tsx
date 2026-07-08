"use client";

import { H1, H2, P, UL, LI, Code, Strong, Badge } from "../editor/md";
import { experience } from "@/lib/data";

const ROLE_ID: Record<string, string> = {
  "Self-employed · SartechLabs": "sartechlabs",
  "DPS-UnternehmerTUM · Deutsches Rotes Kreuz": "drk",
  "Philipps University Marburg & ZEW": "zew",
  "Würth-Gruppe": "wurth",
  "Tata Consultancy Services": "tcs",
};

export function Experience() {
  return (
    <>
      <H1 id="experience">Experience</H1>
      <P>
        Seven years of building production data and AI systems — from
        recommender models for industrial supply, through NER on millions of
        privacy policies, to agentic runtimes for European clients.
      </P>

      {experience.map((exp) => (
        <div key={exp.role + exp.company}>
          <H2 id={ROLE_ID[exp.company] ?? exp.company.toLowerCase().split(" ")[0]}>
            {exp.role}
          </H2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 -mt-1 mb-3 text-[13px]">
            <Strong>{exp.company}</Strong>
            <span className="text-zinc-500">{exp.location}</span>
            <Badge color="#60a5fa">
              {exp.start} → {exp.end}
            </Badge>
          </div>

          <UL>
            {exp.bullets.map((b, i) => (
              <LI key={i}>{b}</LI>
            ))}
          </UL>

          <P>
            <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-zinc-500">
              Stack
            </span>
            <span className="ml-2 inline-flex flex-wrap gap-1.5">
              {exp.stack.map((s) => (
                <Code key={s}>{s}</Code>
              ))}
            </span>
          </P>
        </div>
      ))}
    </>
  );
}
