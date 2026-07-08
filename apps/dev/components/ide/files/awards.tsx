"use client";

import { Trophy } from "lucide-react";
import { H1, H2, P, Strong, Badge } from "../editor/md";
import { awards } from "@/lib/data";

export function Awards() {
  // Group by year (parse end of date string)
  const grouped = new Map<string, typeof awards>();
  for (const a of awards) {
    const year = a.date.slice(-4);
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year)!.push(a);
  }
  const years = Array.from(grouped.keys()).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <H1 id="awards">Awards</H1>
      <P>
        Seven hackathon wins to date, including the AI Hackathon at the{" "}
        <Strong>World Economic Forum in Davos</Strong> (2025) — flagged below.
      </P>

      {years.map((year) => (
        <div key={year}>
          <H2 id={year}>{year}</H2>
          <div className="space-y-2.5">
            {grouped.get(year)!.map((a) => (
              <div
                key={a.date + a.title}
                className={`flex items-start gap-3 rounded-md border p-3 ${
                  a.highlight
                    ? "border-amber-400/40 bg-amber-400/[0.04]"
                    : "border-white/[0.06] bg-white/[0.015]"
                }`}
              >
                <div
                  className={`mt-0.5 size-7 rounded-md grid place-items-center shrink-0 ${
                    a.highlight
                      ? "bg-amber-400/15 text-amber-300"
                      : "bg-white/[0.04] text-zinc-500"
                  }`}
                >
                  <Trophy className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-[14px] text-zinc-100 leading-snug">
                      {a.title}
                    </span>
                    {a.highlight && <Badge color="#fbbf24">★ flagship</Badge>}
                  </div>
                  <p className="text-[12.5px] text-zinc-500 mt-0.5">
                    {a.date} · {a.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
