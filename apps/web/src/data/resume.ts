// Content itself lives in @portfolio/content (shared with apps/dev and apps/worker).
// This file only adds what's specific to this Vite build: the BASE_URL-relative
// résumé path, project accent colors (this site's own palette), and section nav.
import { profile as baseProfile, projects as baseProjects, type Project as ContentProject } from "@portfolio/content/resume";

export { experience, awards, education, languages, skills } from "@portfolio/content/resume";
export type { Experience, Award } from "@portfolio/content/resume";

export const profile = {
  ...baseProfile,
  resumePdf: `${import.meta.env.BASE_URL}${baseProfile.resumePdfPath}`,
};

const projectAccents: Record<string, string> = {
  ForgeAlign: "from-cyan-400 to-sky-400",
  AlphaGuide: "from-violet-400 to-fuchsia-400",
  ProjectDebAIt: "from-fuchsia-400 to-rose-400",
  Hemy: "from-sky-400 to-indigo-400",
  SeaPulse: "from-teal-400 to-cyan-400",
  InsightDesk: "from-violet-400 to-purple-400",
};

export type Project = ContentProject & { accent: string };
export const projects: Project[] = baseProjects.map((p) => ({
  ...p,
  accent: projectAccents[p.name] ?? "from-cyan-400 to-violet-400",
}));

export type SectionId = "top" | "about" | "experience" | "projects" | "awards" | "skills" | "contact";

export const sections: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "awards", label: "Awards" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];
