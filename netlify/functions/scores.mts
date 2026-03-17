import { getStore } from "@netlify/blobs";
import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const store = getStore({ name: "battamot-scores", consistency: "strong" });

  if (req.method === "GET") {
    const data = await store.get("all-scores", { type: "json" });
    return new Response(
      JSON.stringify(data || { results: {}, bracket: { qf: {}, sf: {}, f: {} } }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  if (req.method === "POST") {
    const body = await req.json();
    await store.setJSON("all-scores", body);
    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/scores"
};
