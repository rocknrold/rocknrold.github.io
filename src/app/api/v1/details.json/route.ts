import { detailsEndpoint, jsonRoute } from "@/lib/api";

export const dynamic = "force-static";

export const GET = jsonRoute(detailsEndpoint);
