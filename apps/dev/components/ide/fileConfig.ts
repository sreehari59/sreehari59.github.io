export type FileId =
  | "readme"
  | "projects"
  | "experience"
  | "awards"
  | "skills"
  | "contact";

export type OutlineEntry = {
  id: string; // anchor id used inside the file
  level: 1 | 2 | 3;
  text: string;
};

export type FileMeta = {
  index: number;
  id: FileId;
  filename: string;
  language: "Markdown";
  accent: string;
  description: string;
  outline: OutlineEntry[];
};

export const FILES: FileMeta[] = [
  {
    index: 0,
    id: "readme",
    filename: "readme.md",
    language: "Markdown",
    accent: "#34d399",
    description: "introduction & summary",
    outline: [
      { id: "hi", level: 1, text: "Hi, I'm Sreehari" },
      { id: "what-i-work-on", level: 2, text: "What I work on" },
      { id: "a-bit-of-history", level: 2, text: "A bit of history" },
      { id: "recognition", level: 2, text: "Recognition" },
    ],
  },
  {
    index: 1,
    id: "projects",
    filename: "projects.md",
    language: "Markdown",
    accent: "#22d3ee",
    description: "selected work",
    outline: [
      { id: "projects", level: 1, text: "Projects" },
      { id: "forgealign", level: 2, text: "ForgeAlign" },
      { id: "alphaguide", level: 2, text: "AlphaGuide" },
      { id: "projectdebait", level: 2, text: "ProjectDebAIt" },
      { id: "hemy", level: 2, text: "Hemy" },
      { id: "seapulse", level: 2, text: "SeaPulse" },
      { id: "insightdesk", level: 2, text: "InsightDesk" },
    ],
  },
  {
    index: 2,
    id: "experience",
    filename: "experience.md",
    language: "Markdown",
    accent: "#60a5fa",
    description: "career timeline",
    outline: [
      { id: "experience", level: 1, text: "Experience" },
      { id: "sartechlabs", level: 2, text: "SartechLabs" },
      { id: "drk", level: 2, text: "Deutsches Rotes Kreuz" },
      { id: "zew", level: 2, text: "ZEW Mannheim" },
      { id: "wurth", level: 2, text: "Würth-Gruppe" },
      { id: "tcs", level: 2, text: "TCS" },
    ],
  },
  {
    index: 3,
    id: "awards",
    filename: "awards.md",
    language: "Markdown",
    accent: "#fbbf24",
    description: "hackathon wins & recognitions",
    outline: [
      { id: "awards", level: 1, text: "Awards" },
      { id: "2025", level: 2, text: "2025" },
      { id: "2024", level: 2, text: "2024" },
      { id: "2023", level: 2, text: "2023" },
    ],
  },
  {
    index: 4,
    id: "skills",
    filename: "skills.md",
    language: "Markdown",
    accent: "#a78bfa",
    description: "tools, frameworks, languages",
    outline: [
      { id: "skills", level: 1, text: "Skills" },
      { id: "languages", level: 2, text: "Languages" },
      { id: "ai-ml", level: 2, text: "AI & ML" },
      { id: "data-cloud", level: 2, text: "Data & Cloud" },
      { id: "frontend", level: 2, text: "Frontend" },
      { id: "tools", level: 2, text: "Tools" },
    ],
  },
  {
    index: 5,
    id: "contact",
    filename: "contact.md",
    language: "Markdown",
    accent: "#f472b6",
    description: "let's build something",
    outline: [
      { id: "contact", level: 1, text: "Contact" },
      { id: "channels", level: 2, text: "Channels" },
      { id: "based-in", level: 2, text: "Based in" },
    ],
  },
];

export function fileById(id: FileId): FileMeta {
  return FILES.find((f) => f.id === id)!;
}
