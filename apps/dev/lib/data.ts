// Content itself lives in @portfolio/content (shared with apps/web and apps/worker).
// This file only adds what's specific to this site: its own project accent palette.
import { projects as baseProjects, type Project as ContentProject } from "@portfolio/content/resume";

export { profile, experience, awards, education, languages, skills } from "@portfolio/content/resume";
export type { Experience, Award } from "@portfolio/content/resume";

const projectAccents: Record<string, string> = {
  ForgeAlign: "from-emerald-400 to-cyan-400",
  AlphaGuide: "from-violet-400 to-fuchsia-400",
  ProjectDebAIt: "from-amber-400 to-rose-400",
  Hemy: "from-sky-400 to-indigo-400",
  SeaPulse: "from-teal-400 to-blue-400",
  InsightDesk: "from-fuchsia-400 to-pink-400",
};

export type Project = ContentProject & { accent: string };
export const projects: Project[] = baseProjects.map((p) => ({
  ...p,
  accent: projectAccents[p.name] ?? "from-cyan-400 to-violet-400",
}));
