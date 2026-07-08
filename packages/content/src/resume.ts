// Single source of truth for site content — edit this file to re-skin the portfolio
// for someone else without touching any app code. `apps/web`, `apps/dev` and
// `apps/worker` all import from here via @portfolio/content.
//
// Fields that depend on a specific app's runtime (e.g. base-URL-relative asset
// paths) are deliberately NOT here — those are composed in each app's own code.

export const profile = {
  name: "Sreehari Pradeep Kumar",
  title: "Full Stack AI Engineer",
  location: "Mannheim, Baden-Württemberg, Germany",
  email: "sreeharipradeepkumar1996@gmail.com",
  phone: "+49 176 88459397",
  linkedin: "https://www.linkedin.com/in/sreeharipradeep",
  github: "https://www.github.com/sreehari59",
  website: "https://sreehari59.github.io",
  // Relative to each app's own asset base — see resumePdfPath usage in apps/web and apps/dev.
  resumePdfPath: "assets/pdf/CV.pdf",
  tagline:
    "I design, ship, and orchestrate multi-agent AI systems end-to-end — from RAG and graph retrieval through agent runtimes, voice and email, all the way to the React frontend.",
  shortBio:
    "Full Stack AI Engineer based in Mannheim, Germany. Founding AI Team member at SartechLabs, building multi-agent runtimes, RAG systems, and B2C apps for clients in the UK, Switzerland and India. M.Sc. Data Science from Universität Mannheim. Frequent hackathon winner (WEF Davos, Würth, Exxeta, Karlsruhe, Berlin, JIVs).",
};

export type Experience = {
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    role: "Full Stack AI Engineer",
    company: "Self-employed · SartechLabs",
    location: "Germany",
    start: "Jan 2025",
    end: "Present",
    bullets: [
      "Founding AI Team member at SartechLabs — building a multi-agent runtime framework with tool calls integrating live voice, email and autonomous RAG agents.",
      "Orchestrated pipelines processing 1M+ docs for 8K concurrent user queries; won funding at the NCIIPC Startup India AI Grand Challenge.",
      "Building SeaPulse, a B2C maritime application for a UK client — React 19, Tailwind v4, Supabase, deployed on Cloudflare Workers.",
      "Built InsightDesk, an AI SaaS platform for real estate agencies integrated into Slack and Outlook, automating document analysis through to contract generation.",
      "Shipped Trade & Logistics, an end-to-end multi-agent app processing multilingual commodity emails for a Swiss client.",
    ],
    stack: ["Azure", "CrewAI", "Twilio", "Vapi", "FastAPI", "Agno", "Qdrant", "LangGraph", "Neo4j", "LangChain"],
  },
  {
    role: "AI Engineer",
    company: "DPS-UnternehmerTUM · Deutsches Rotes Kreuz",
    location: "Munich, Germany",
    start: "Sep 2024",
    end: "Dec 2024",
    bullets: [
      "Built KIRK (KI Rotes Kreuz) — an agentic AI reporting tool that reduces reporting time by 96%.",
      "Scalable dockerized tool handling 1000+ documents, integrated with RAG (LangChain) and CrewAI multi-agents.",
      "Implemented LLMOps workflows using LangSmith for prompt/version tracking and evaluation.",
      "Evaluated agentic AI tooling using implicit user feedback, retrieval and LLM evaluation metrics.",
    ],
    stack: ["LangChain", "Llama", "Qdrant", "Docker", "Qwen", "Coolify", "FastAPI", "Flask", "Vertex AI Studio", "PostgreSQL"],
  },
  {
    role: "Data Scientist (Student Assistant)",
    company: "Philipps University Marburg & ZEW",
    location: "Mannheim, Germany",
    start: "Jun 2023",
    end: "Sep 2024",
    bullets: [
      "Built a RAG-based system with a fine-tuned LLM and NER agent to process 1.4M privacy policies.",
      "Developed a time-series system to detect boilerplate content in German privacy policies using BERT.",
      "Orchestrated multiprocess scraping of 7.5M+ docs on AWS; analyzed data for 662K firms using BigQuery SQL.",
    ],
    stack: ["spaCy", "Docker", "GitLab", "AWS", "EKS", "Longformer", "Weights & Biases", "HuggingFace", "R", "Flask"],
  },
  {
    role: "Data Scientist (Intern → Working Student)",
    company: "Würth-Gruppe",
    location: "Künzelsau, Germany",
    start: "Jun 2022",
    end: "Mar 2023",
    bullets: [
      "Improved ML model accuracy on a 1.5M customer dataset using XGBoost, ensemble models and neural networks.",
      "Built a hybrid recommendation system with 75% accuracy using deep neural networks.",
      "Developed an interactive customer-segmentation tool empowering stakeholder decision-making.",
      "Optimized ML pipelines for business use cases, enhancing processing speed by 80%.",
    ],
    stack: ["PyTorch", "MLflow", "SHAP", "MongoDB", "Plotly", "PySpark"],
  },
  {
    role: "System Engineer",
    company: "Tata Consultancy Services",
    location: "USA & Germany",
    start: "Nov 2018",
    end: "Aug 2021",
    bullets: [
      "Accelerated ML model deployment by 50% through orchestration, CI/CD pipelines and ML model monitoring.",
      "Collaborated on a review classification model — 40% improvement in customer handling efficiency.",
      "Worked with PMs and C-level stakeholders across geographies on AI requirements and PoCs.",
      "Reduced application testing time by 90% with Selenium and Java automation scripts.",
    ],
    stack: ["Git", "MySQL", "Jenkins", "Python", "Java", "RPA"],
  },
];

export type Project = {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  url?: string;
};

// Presentational accent colors (Tailwind gradient classes) are NOT content —
// each app defines its own accent palette keyed by project name, since the
// two sites use different color themes. See the projectAccents map in
// apps/web/src/data/resume.ts and apps/dev/lib/data.ts.
export const projects: Project[] = [
  {
    name: "ForgeAlign",
    tagline: "Agent-to-Agent orchestration for manufacturing",
    description:
      "Demonstrates the A2A protocol — autonomous agents negotiate manufacturing decisions without human intervention.",
    stack: ["LangGraph", "TypeScript", "Railway"],
  },
  {
    name: "AlphaGuide",
    tagline: "Agentic AI investment advisory",
    description:
      "Multi-agent AI platform for investment advisory with real-time market analysis and strategy backtesting.",
    stack: ["LangGraph", "TypeScript", "Azure", "Gemini", "Llama", "OpenAI", "HuggingFace", "SQL"],
  },
  {
    name: "ProjectDebAIt",
    tagline: "Multi-agent debate platform",
    description:
      "Generates arguments on any topic, judges the winner using an LLM, and includes an AI avatar to practice debating against.",
    stack: ["LangGraph", "Agno", "AgentSDK", "ElevenLabs", "MistralAI", "CrewAI", "TTS", "STT"],
  },
  {
    name: "Hemy",
    tagline: "Restaurant-focused personalized voicebot",
    description:
      "Voicebot that strips background noise, identifies returning customers by voice, and personalizes responses using a voice-based RAG system.",
    stack: ["AWS", "pyannote", "Diarization", "Whisper", "Vector DB", "TTS", "STT"],
  },
  {
    name: "SeaPulse",
    tagline: "B2C maritime industry app (UK client)",
    description:
      "Production B2C app for the maritime industry, currently shipping with React 19, Tailwind v4, Supabase and Cloudflare Workers.",
    stack: ["React 19", "Tailwind v4", "Supabase", "Cloudflare Workers"],
  },
  {
    name: "InsightDesk",
    tagline: "AI SaaS for real-estate agencies",
    description:
      "Slack- and Outlook-integrated platform that automates the full pipeline from document analysis through to contract generation.",
    stack: ["LangGraph", "Slack API", "Outlook API", "RAG"],
  },
];

export type Award = {
  date: string;
  title: string;
  location: string;
  highlight?: boolean;
};

export const awards: Award[] = [
  { date: "Aug 2025", title: "Theme Winner — JIVs Hackathon on Data & AI", location: "Kreuzlingen, Switzerland" },
  { date: "Jul 2025", title: "Winner — AI Search Analytics Hackathon", location: "Berlin, Germany" },
  { date: "Jun 2025", title: "Winner — AI track, AI Hackathon", location: "Karlsruhe, Germany" },
  { date: "May 2025", title: "1st Runner Up — HackXplore Würth Elektronik AI Challenge", location: "Karlsruhe, Germany" },
  { date: "Apr 2025", title: "1st Runner Up — Q Hack Exxeta AI Challenge", location: "Mannheim, Germany" },
  { date: "Jan 2025", title: "1st Runner Up — AI Hackathon @ World Economic Forum", location: "Davos, Switzerland", highlight: true },
  { date: "Aug 2024", title: "Theme Winner — JIVs Hackathon on Data & AI", location: "Kreuzlingen, Switzerland" },
  { date: "Nov 2023", title: "Runner Up — Data Science Datathon by STADS", location: "Mannheim, Germany" },
];

export const education = [
  {
    school: "Universität Mannheim",
    degree: "M.Sc. Data Science",
    location: "Mannheim, Germany",
    start: "Sep 2021",
    end: "Jun 2024",
    notes:
      "Thesis: Out-of-Distribution Detection for Textual Product Offers (RoBERTa + Contrastive Learning). Specialization: Deep Learning, Advanced Text Analytics, Generative AI.",
  },
  {
    school: "Mar Athanasius College of Engineering",
    degree: "B.Tech. Electronics & Communication Engineering",
    location: "Kerala, India",
    start: "Aug 2014",
    end: "Aug 2018",
    notes: "",
  },
];

export const skills: Record<string, string[]> = {
  Languages: ["Python", "TypeScript", "JavaScript", "Java", "C", "R"],
  "AI & ML": ["PyTorch", "HuggingFace", "LangChain", "LangGraph", "CrewAI", "Agno", "LLMOps", "MLOps"],
  "Data & Cloud": ["PostgreSQL", "VectorDB", "Qdrant", "MongoDB", "Neo4j", "Azure", "AWS", "Cloudflare Workers"],
  Frontend: ["React 19", "Next.js", "Tailwind v4", "Supabase"],
  Tools: ["Claude Code", "GitHub Copilot", "Cursor", "n8n", "JIRA", "Confluence"],
};

export const languages = [
  { name: "English", level: "C1 — Proficient" },
  { name: "German", level: "B1 — Intermediate" },
  { name: "Malayalam", level: "Native" },
];
