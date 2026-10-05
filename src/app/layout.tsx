import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SITE_URL, profile } from "@/data/resume";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const description =
  "Harold Aaron: Senior Back-End Developer and Project Team Lead. Laravel and .NET, REST APIs, Azure, and production LLM tooling with OpenAI and the Model Context Protocol.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Harold Aaron | Senior Back-End Developer & Team Lead",
  description,
  authors: [{ name: profile.name, url: SITE_URL }],
  keywords: [
    "Senior Back-End Developer",
    "Team Lead",
    "Laravel",
    "PHP",
    ".NET",
    "C#",
    "REST API",
    "Azure",
    "Model Context Protocol",
    "OpenAI",
    "Philippines",
  ],
  openGraph: {
    type: "profile",
    url: SITE_URL,
    title: "Harold Aaron | Senior Back-End Developer & Team Lead",
    description,
    images: [{ url: "/Aaron.jpg", width: 479, height: 479, alt: "Harold Aaron" }],
  },
  twitter: { card: "summary", title: "Harold Aaron | Senior Back-End Developer", description },
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b1120" },
    { media: "(prefers-color-scheme: light)", color: "#f6f8fb" },
  ],
};

// Runs before paint:
// 1. Clickjacking guard. GitHub Pages can't send X-Frame-Options or a frame-ancestors
//    header (and meta CSP ignores frame-ancestors), so a framed page hides itself.
// 2. Applies the saved theme so it never flashes.
const headScript = `(function(){var d=document.documentElement;if(window.top!==window.self){d.style.display='none'}try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}d.dataset.theme=t}catch(e){d.dataset.theme='dark'}})()`;

// JSON.stringify doesn't escape "<", so "</script>" inside the data could close the tag early.
const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  email: `mailto:${profile.links.email}`,
  url: SITE_URL,
  image: `${SITE_URL}/Aaron.jpg`,
  address: { "@type": "PostalAddress", addressLocality: "Taguig City", addressRegion: "Metro Manila", addressCountry: "PH" },
  sameAs: [profile.links.github, profile.links.linkedin, profile.links.stackoverflow],
  worksFor: { "@type": "Organization", name: profile.company },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Technological University of the Philippines – Taguig" },
  knowsAbout: ["PHP", "Laravel", "C#", ".NET", "REST APIs", "Microsoft Azure", "Model Context Protocol", "OpenAI API"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(personLd) }} />
        {children}
      </body>
    </html>
  );
}
