import { endpoints, jsonRoute } from "@/lib/api";

export const dynamic = "force-static";

export const GET = jsonRoute(endpoints.find((e) => e.path.endsWith("/credentials.json"))!);
