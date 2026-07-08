export type Reveal = "projects" | "experience" | "awards" | "skills" | "contact" | null;

export type CannedResponse = {
  id: string;
  match: (q: string) => boolean;
  question: string;
  reveal?: Reveal;
  paragraphs: string[];
};

const has = (q: string, ...words: string[]) =>
  words.some((w) => q.toLowerCase().includes(w.toLowerCase()));

export const suggestedQuestions = [
  "Who is Sreehari?",
  "Show me his projects",
  "What's his hackathon track record?",
  "How can I hire him?",
];

export const cannedResponses: CannedResponse[] = [
  {
    id: "intro",
    question: "Who is Sreehari?",
    match: (q) => has(q, "who", "about", "intro", "tell me about", "background", "sreehari"),
    reveal: null,
    paragraphs: [
      "Sreehari is a Full Stack AI Engineer based in Mannheim, Germany — currently a founding AI team member at SartechLabs.",
      "He builds end-to-end agentic systems: from LangGraph / CrewAI multi-agent runtimes and RAG pipelines, through FastAPI backends, all the way to React 19 + Tailwind frontends deployed on Cloudflare Workers and Azure.",
      "Master's in Data Science from Universität Mannheim, with prior roles at Würth, ZEW, the German Red Cross and Tata Consultancy Services. He's shipped production AI for clients in the UK, Switzerland and India.",
    ],
  },
  {
    id: "projects",
    question: "Show me his projects",
    match: (q) =>
      has(q, "project", "build", "built", "ship", "ForgeAlign", "AlphaGuide", "DebAIt", "Hemy", "SeaPulse", "InsightDesk"),
    reveal: "projects",
    paragraphs: [
      "Sreehari has shipped six projects worth highlighting — I've pulled them up below.",
      "Highlights: **ForgeAlign** demonstrates the Agent-to-Agent (A2A) protocol on manufacturing workflows. **AlphaGuide** is a multi-agent investment advisor with real-time analysis and backtesting. **ProjectDebAIt** is a multi-agent debate platform that even includes an AI avatar to practice against. **Hemy** is a voice-bot that recognises returning customers via diarization and personalizes responses with a voice-based RAG system.",
      "The two newest are **SeaPulse** (maritime B2C app for a UK client, React 19 + Supabase on Cloudflare Workers) and **InsightDesk** (Slack/Outlook-integrated real-estate AI SaaS that automates document analysis through to contract generation).",
    ],
  },
  {
    id: "experience",
    question: "Where has he worked?",
    match: (q) =>
      has(q, "experience", "work", "job", "role", "career", "company", "where has", "where did", "SartechLabs", "Würth", "TCS", "Tata"),
    reveal: "experience",
    paragraphs: [
      "Seven years of engineering experience, with the last three years AI-focused.",
      "He's currently founding-team at **SartechLabs** building a multi-agent runtime that won funding at the NCIIPC Startup India AI Grand Challenge — pipelines processing 1M+ docs for 8K concurrent user queries.",
      "Before that: **German Red Cross / DPS-UnternehmerTUM** (built KIRK, an agentic reporting tool that cut reporting time by 96%), **ZEW & Philipps University Marburg** (RAG over 1.4M privacy policies, scraping 7.5M+ docs on AWS), **Würth-Gruppe** (recommender system + customer segmentation on a 1.5M-customer dataset), and **TCS** (ML deployment + automation, US & Germany).",
    ],
  },
  {
    id: "awards",
    question: "What's his hackathon track record?",
    match: (q) =>
      has(q, "hackathon", "award", "win", "won", "winner", "competition", "prize", "Davos", "WEF"),
    reveal: "awards",
    paragraphs: [
      "It is *substantial* — eight hackathon podiums between Nov 2023 and Aug 2025.",
      "The headline one: **1st Runner Up at the AI Hackathon @ World Economic Forum, Davos** in January 2025.",
      "Wins in 2025 alone include the AI Search Analytics Hackathon in Berlin, the AI track at AI Hackathon Karlsruhe, the JIVs theme prize in Kreuzlingen, plus runner-up spots at HackXplore (Würth Elektronik) and Q Hack (Exxeta).",
    ],
  },
  {
    id: "skills",
    question: "What's his stack?",
    match: (q) =>
      has(q, "skill", "stack", "tech", "technology", "language", "framework", "tool", "what does he use", "what can he"),
    reveal: "skills",
    paragraphs: [
      "Full-stack, but AI-shaped.",
      "**Backend & AI:** Python, FastAPI, LangChain, LangGraph, CrewAI, Agno, PyTorch, HuggingFace, LLMOps with LangSmith. **Data:** PostgreSQL, Qdrant + other VectorDBs, MongoDB, Neo4j, BigQuery. **Cloud:** Azure, AWS, Cloudflare Workers. **Frontend:** TypeScript, React 19, Next.js, Tailwind v4, Supabase.",
      "Day-to-day he leans heavily on Claude Code, Cursor and GitHub Copilot — and ships German + English + Malayalam.",
    ],
  },
  {
    id: "education",
    question: "What did he study?",
    match: (q) => has(q, "study", "studied", "education", "degree", "university", "master", "bachelor", "thesis"),
    reveal: null,
    paragraphs: [
      "**M.Sc. Data Science, Universität Mannheim** (2021–2024). Specialization in Deep Learning, Advanced Text Analytics and Generative AI.",
      "His master's thesis was on Out-of-Distribution Detection for Textual Product Offers — RoBERTa + contrastive learning.",
      "Before that: **B.Tech. in Electronics & Communication Engineering** from Mar Athanasius College of Engineering in Kerala, India (2014–2018).",
    ],
  },
  {
    id: "contact",
    question: "How can I hire him?",
    match: (q) =>
      has(q, "hire", "contact", "reach", "email", "linkedin", "available", "freelance", "consult", "work with"),
    reveal: "contact",
    paragraphs: [
      "Sreehari is self-employed and currently taking on full-stack AI engineering work — building agent systems, RAG pipelines, and production AI apps end-to-end.",
      "Easiest way to reach him: **sreeharipradeepkumar1996@gmail.com**, or DM on [LinkedIn](https://www.linkedin.com/in/sreeharipradeep).",
      "Based in Mannheim — happy to work remotely or hybrid across the EU. Past clients include companies in the UK, Switzerland and India.",
    ],
  },
  {
    id: "location",
    question: "Where is he based?",
    match: (q) => has(q, "where", "location", "based", "live", "city", "country", "germany", "mannheim"),
    reveal: null,
    paragraphs: [
      "Mannheim, Baden-Württemberg, Germany. He's open to remote and hybrid roles across the EU.",
    ],
  },
];

export function findCanned(question: string): CannedResponse | null {
  return cannedResponses.find((r) => r.match(question)) ?? null;
}
