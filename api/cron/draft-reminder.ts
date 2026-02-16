export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return res.status(500).json({ error: "missing_CRON_SECRET" });
  }

  const authHeader = String(req.headers?.authorization ?? "");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const target = process.env.BILLY_DRAFT_WORKER_URL;
  if (!target) {
    return res.status(500).json({ error: "missing_BILLY_DRAFT_WORKER_URL" });
  }

  try {
    const url = new URL(target);
    if (req.query?.force) {
      url.searchParams.set("force", String(req.query.force));
    }

    const upstream = await fetch(url.toString(), { method: "POST" });
    const text = await upstream.text();

    res.status(upstream.status);
    res.setHeader("content-type", upstream.headers.get("content-type") || "text/plain");
    return res.send(text);
  } catch (e: any) {
    return res.status(500).json({ error: "cron_call_failed", detail: String(e?.message ?? e) });
  }
}
