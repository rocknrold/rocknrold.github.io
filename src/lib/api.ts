import { roleDuration, yearsSince } from "@/lib/dates";
import {
  awards,
  careerStart,
  certifications,
  education,
  experience,
  profile,
  sideProjects,
  skills,
  work,
} from "@/data/resume";

/** Icons are a presentation detail; keep them out of the API payloads. */
function withoutIcon<T extends { icon: unknown }>(item: T): Omit<T, "icon"> {
  const copy: Partial<T> = { ...item };
  delete copy.icon;
  return copy as Omit<T, "icon">;
}

export type Endpoint = {
  name: string;
  path: string;
  description: string;
  build: () => unknown;
};

const base = "/api/v1";

export const endpoints: Endpoint[] = [
  {
    name: "Get profile",
    path: `${base}/profile.json`,
    description: "Who I am, what I do, and where to reach me.",
    build: () => {
      const years = yearsSince(careerStart, new Date());
      return {
        ...profile,
        summary: profile.summary.replace("{years}", String(years)),
        career_start: careerStart,
        experience_years: years,
      };
    },
  },
  {
    name: "List experience",
    path: `${base}/experience.json`,
    description: "Roles in reverse-chronological order. A null end date means current.",
    build: () => experience.map((role) => ({ ...role, duration: roleDuration(role.start, role.end, new Date()) })),
  },
  {
    name: "List projects",
    path: `${base}/projects.json`,
    description: "Featured professional work plus earlier personal projects.",
    build: () => ({
      featured: work.map(withoutIcon),
      earlier: sideProjects,
    }),
  },
  {
    name: "List skills",
    path: `${base}/skills.json`,
    description: "Technical skills grouped by domain.",
    build: () => skills.map(withoutIcon),
  },
  {
    name: "Get credentials",
    path: `${base}/credentials.json`,
    description: "Education, certifications, and awards.",
    build: () => ({ education, certifications, awards }),
  },
];

/** Legacy endpoint from the previous portfolio (`#/api/v1/details`): everything in one payload. */
export const detailsEndpoint: Endpoint = {
  name: "Get details (legacy)",
  path: `${base}/details.json`,
  description: "Every resource in one payload. Kept for links to the old portfolio.",
  build: () =>
    Object.fromEntries(
      endpoints.map((e) => [e.path.split("/").pop()!.replace(".json", ""), e.build()]),
    ),
};

export function envelope(endpoint: Endpoint) {
  const data = endpoint.build();
  return {
    status: "success",
    code: 200,
    message: "OK",
    data,
    // Computed values (experience_years, durations) are as of this timestamp.
    // CI rebuilds monthly, so they never drift by more than a month.
    meta: { generated_at: new Date().toISOString() },
    links: {
      self: endpoint.path,
      ...Object.fromEntries(
        endpoints
          .filter((e) => e.path !== endpoint.path)
          .map((e) => [e.path.split("/").pop()!.replace(".json", ""), e.path]),
      ),
    },
  };
}

export function jsonRoute(endpoint: Endpoint) {
  return () => Response.json(envelope(endpoint));
}
