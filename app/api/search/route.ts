import { searchParts } from "@/lib/parts";

/** GET /api/search?q=servo — quick suggestions for the global search panel. */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.slice(0, 80) ?? "";
  const suggestions = q.trim().length >= 2 ? await searchParts(q, 6) : [];
  return Response.json(
    { suggestions },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } },
  );
}
