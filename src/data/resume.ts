// Single source of truth for the portfolio.
// Rendered by the page components and served as JSON by the routes in src/app/api/v1.

export const SITE_URL = "https://rocknrold.github.io";

export const profile = {
  id: 1,
  name: "Harold Aaron",
  goes_by: "Aaron",
  title: "Senior Back-End Developer & Project Team Lead",
  company: "KMC Solutions",
  location: { city: "Taguig City", region: "Metro Manila", country: "PH" },
  primary_stacks: ["PHP / Laravel", "C# / .NET Core / ASP.NET Core"],
  /** `{years}` is filled in from careerStart; never hard-code the number. */
  summary:
    "Senior Back-End Developer and Project Team Lead with {years}+ years of experience designing, building, and scaling enterprise web applications in PHP (Laravel) and C# (.NET Core, ASP.NET Core). Leads cross-functional teams through the full SDLC, from system architecture and REST API design to CI/CD and Microsoft Azure deployment. Builds AI-powered business tools with Claude Code, the OpenAI API, and the Model Context Protocol.",
  links: {
    email: "aaronharoldc@gmail.com",
    github: "https://github.com/rocknrold",
    linkedin: "https://www.linkedin.com/in/aaronharoldc",
    stackoverflow: "https://stackoverflow.com/users/13042396/rocknrold",
    portfolio: SITE_URL,
  },
};

export type Role = {
  title: string;
  company: string;
  client?: string;
  start: string; // YYYY-MM
  end: string | null; // null = present
  highlights: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    title: "Senior Back-End Developer & Project Team Lead",
    company: "KMC Solutions",
    start: "2023-01",
    end: null,
    highlights: [
      "Architected and led end-to-end delivery of a company-wide Employee Performance Management System, from system design and database modeling through Azure deployment. It won KMC Project of the Year – Performance Hero (2025).",
      "Lead a cross-functional team of developers, QA engineers, a project manager, and a product owner across requirements, architecture, development, testing, and release.",
      "Built a Model Context Protocol (MCP) server in Laravel that exposes the ticketing platform's API as LLM tools, plus a custom tool-calling loop that lets OpenAI GPT query ticket data.",
      "Building an @AI assistant inside the support ticketing platform (vtiger CRM) that answers technicians and requesters with context scoped to the ticket.",
      "Develop and maintain KMC's support ticketing CRM, ERP system, and a quotes configurator for the company's services and products.",
      "Ship enhancements continuously through CI/CD pipelines, keeping mission-critical internal tools highly available.",
    ],
    stack: ["PHP", "Laravel", "C#", "ASP.NET Core", "Vue.js", "React", "MySQL", "SQL Server", "Azure", "OpenAI API", "MCP"],
  },
  {
    title: "PHP Developer",
    company: "Octal Philippines Inc.",
    client: "Sky Cable Corporation",
    start: "2022-02",
    end: "2023-01",
    highlights: [
      "Engineered financial and customer messaging systems handling high-volume data and critical customer-relations modules.",
      "Cut SQL execution times by profiling and restructuring key queries and processes.",
      "Developed scalable REST APIs and real-time webhooks that sped up data access for customer-facing teams.",
      "Built a digital Official Receipt system audited and approved by the Philippine Bureau of Internal Revenue (BIR).",
      "Automated the Contact Us page with chatbot workflows.",
    ],
    stack: ["PHP", "Laravel", ".NET", "ASP.NET Core", "MySQL", "REST APIs", "Webhooks"],
  },
  {
    title: "React Native Developer Intern",
    company: "Chimes Consulting OPC",
    start: "2022-06",
    end: "2022-08",
    highlights: [
      "Launched a revamped cross-platform mobile app in React Native, integrated with a Laravel REST API back end.",
    ],
    stack: ["React Native", "Laravel", "REST APIs"],
  },
];

/**
 * Start of the professional career: the earliest role above. Every "N+ years"
 * figure on the site is computed from this, so it never needs editing.
 */
export const careerStart = experience.map((r) => r.start).sort()[0];

export type Work = {
  slug: string;
  name: string;
  context: string;
  summary: string;
  tags: string[];
  icon: IconName;
  badge?: string;
  featured?: boolean;
};

export type IconName =
  | "trophy" | "bot" | "plug" | "server" | "zap" | "clipboard" | "users" | "receipt"
  | "github" | "linkedin" | "mail" | "map-pin" | "arrow-right" | "arrow-up-right"
  | "copy" | "check" | "sun" | "moon" | "send" | "git-branch" | "database" | "cloud"
  | "code" | "layers" | "shield" | "graduation" | "award" | "x" | "menu" | "terminal"
  | "workflow" | "sparkles" | "external";

export const work: Work[] = [
  {
    slug: "performance-management",
    name: "Employee Performance Management System",
    context: "KMC Solutions · Company-wide",
    summary:
      "Architected and led delivery end to end, from system design and database modeling through Azure deployment, for a platform used across the company.",
    tags: ["System design", "Database modeling", "Azure", "Team lead"],
    icon: "trophy",
    badge: "Project of the Year 2025",
    featured: true,
  },
  {
    slug: "mcp-server",
    name: "Laravel MCP Server",
    context: "KMC Solutions · AI platform",
    summary:
      "Exposes the ticketing platform's endpoints as Model Context Protocol tools, with a custom tool-calling loop that lets GPT query live ticket data.",
    tags: ["Laravel", "MCP", "OpenAI GPT"],
    icon: "plug",
  },
  {
    slug: "ai-ticket-assistant",
    name: "@AI Ticket Assistant",
    context: "KMC Solutions · vtiger CRM",
    summary:
      "An @AI mention in ticket comments prompts OpenAI GPT with answers scoped to that ticket, for technicians and requesters alike.",
    tags: ["vtiger CRM", "OpenAI API", "PHP"],
    icon: "bot",
    badge: "In progress",
  },
  {
    slug: "internal-platforms",
    name: "Ticketing CRM, ERP & Quotes Configurator",
    context: "KMC Solutions · Internal platforms",
    summary:
      "Develop and maintain the support ticketing CRM, the ERP system, and a quotes configurator for the company's services and products.",
    tags: ["PHP", "Laravel", "vtiger CRM", "CI/CD"],
    icon: "server",
  },
  {
    slug: "gencon-bidding",
    name: "GenCon Bidding Automation",
    context: "KMC Solutions · Workflow automation",
    summary: "Automates the preparation of project bids, replacing manual steps in the bidding process.",
    tags: ["Automation", "Process design"],
    icon: "zap",
  },
  {
    slug: "service-delivery",
    name: "Service Delivery App for Quantity Surveyors",
    context: "KMC Solutions · Operations",
    summary: "Shortened vendor-engagement turnaround and gave management real-time visibility into tasks.",
    tags: ["Workflow", "Reporting"],
    icon: "clipboard",
  },
  {
    slug: "hr-platform",
    name: "HR Employee Resource Platform",
    context: "KMC Solutions · HR & Operations",
    summary: "Streamlines the hiring process for HR and Operations teams, built across PHP and .NET C#.",
    tags: ["PHP", ".NET", "C#"],
    icon: "users",
  },
  {
    slug: "bir-official-receipts",
    name: "BIR-Approved Digital Official Receipts",
    context: "Sky Cable Corporation · via Octal",
    summary:
      "A digital Official Receipt system audited and approved by the Bureau of Internal Revenue, alongside financial and customer messaging modules.",
    tags: ["PHP", "Compliance", "REST", "Webhooks"],
    icon: "receipt",
  },
];

export type SideProject = {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  image: string;
  repo?: string;
  live?: string;
  note?: string;
};

export const sideProjects: SideProject[] = [
  {
    name: "SITCOM",
    tagline: "Supervised Industrial Training monitoring",
    description:
      "Undergraduate capstone: a web and Android system that computerizes internship monitoring at TUP Taguig for students, supervisors, and coordinators, with messaging and grade computation.",
    stack: ["Laravel", "Node.js", "Express", "React", "Redux", "Android", "MySQL"],
    image: "https://user-images.githubusercontent.com/43779189/147080304-c430a26b-c9f4-47f0-b5e4-8891bb22f739.png",
    note: "Private repository",
  },
  {
    name: "ReCite",
    tagline: "Research citation library",
    description: "Open access to research, articles, and journals for the academic community.",
    stack: ["Laravel", "MySQL", "jQuery", "AJAX", "Material UI"],
    image: "https://user-images.githubusercontent.com/43779189/114821491-3c58d300-9df3-11eb-904e-d9dad42d2537.png",
    repo: "https://github.com/rocknrold/ReCite-Research-Citation",
  },
  {
    name: "AFLEX",
    tagline: "Movies & TV catalogue",
    description: "A full MERN-stack catalogue of movies, films, and TV shows with Google sign-in and Cloudinary media.",
    stack: ["MongoDB", "Express", "React", "Node.js", "Cloudinary"],
    image: "https://user-images.githubusercontent.com/43779189/147208604-d159ae95-379f-4b6e-bf22-3c90a7375fb9.png",
    live: "https://aflex.netlify.app/",
  },
  {
    name: "Scheduler",
    tagline: "General scheduling system",
    description: "Scheduling app with Google Identity sign-in and Google Charts reporting.",
    stack: ["Laravel", "MySQL", "jQuery", "Bootstrap"],
    image: "https://user-images.githubusercontent.com/43779189/147075921-8f2ab7e7-0e6a-4389-8e0d-70892c278574.png",
    repo: "https://github.com/rocknrold/Scheduler",
  },
  {
    name: "Energy Counter",
    tagline: "Axie Infinity energy tracker",
    description: "A small React + Redux utility for tracking in-game energy per round.",
    stack: ["React", "Redux", "React Bootstrap"],
    image: "https://user-images.githubusercontent.com/43779189/147050970-84bd6536-daf4-4d42-9dc1-30c4abda26d0.png",
    repo: "https://github.com/rocknrold/energy-counter",
  },
];

export const skills: { group: string; icon: IconName; items: string[] }[] = [
  { group: "Languages & Frameworks", icon: "code", items: ["PHP", "Laravel", "CodeIgniter", "C#", ".NET Core", "ASP.NET Core", "JavaScript", "Node.js", "Express.js", "Vue.js", "React", "Next.js", "React Native", "Python"] },
  { group: "APIs & Architecture", icon: "layers", items: ["RESTful APIs", "Webhooks", "Third-party integrations", "Microservices", "MVC", "OOP", "SOLID"] },
  { group: "Databases & Caching", icon: "database", items: ["MySQL", "SQL Server", "PostgreSQL", "MongoDB", "Firebase", "Redis"] },
  { group: "Cloud & DevOps", icon: "cloud", items: ["Microsoft Azure", "Docker", "CI/CD", "Git", "GitHub", "Linux", "Heroku", "Cloudways"] },
  { group: "AI & Agentic Development", icon: "sparkles", items: ["Claude Code", "OpenAI API (GPT)", "Cursor", "MCP server development", "LLM tool calling", "AI-assisted coding"] },
  { group: "Leadership & Delivery", icon: "users", items: ["Technical leadership", "Agile", "SDLC", "Performance optimization", "vtiger CRM"] },
];

export const education = {
  degree: "BS Information Technology, Cum Laude",
  school: "Technological University of the Philippines – Taguig",
  year: 2022,
};

export const certifications: { name: string; issuer: string; url?: string }[] = [
  {
    name: "Software Development Lifecycle",
    issuer: "University of Minnesota",
    url: "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~TZR5K5XSPPHU/CERTIFICATE_LANDING_PAGE~TZR5K5XSPPHU.jpeg",
  },
  {
    name: "Linux for Developers",
    issuer: "The Linux Foundation",
    url: "https://s3.amazonaws.com/coursera_assets/meta_images/generated/CERTIFICATE_LANDING_PAGE/CERTIFICATE_LANDING_PAGE~QYZRXNB8938R/CERTIFICATE_LANDING_PAGE~QYZRXNB8938R.jpeg",
  },
  { name: "Technical Support Fundamentals", issuer: "Google" },
];

export const awards: { name: string; issuer: string; years: number[] }[] = [
  { name: "Project of the Year – Performance Hero", issuer: "KMC Solutions", years: [2025] },
  { name: "Culture Champion Award", issuer: "KMC Solutions", years: [2025] },
  { name: "Best Performance Certificate", issuer: "KMC Solutions", years: [2023, 2025] },
];
