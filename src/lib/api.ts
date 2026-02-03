export const PROJECT_REF = import.meta.env.VITE_SUPABASE_PROJECT_REF as string;

if (!PROJECT_REF) {
  // eslint-disable-next-line no-console
  console.warn("Missing VITE_SUPABASE_PROJECT_REF");
}

export const FN_BASE = `https://${PROJECT_REF}.supabase.co/functions/v1`;

export async function callFn<T = any>(path: string, payload: any): Promise<T> {
  const res = await fetch(`${FN_BASE}/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // ignore
  }

  if (!res.ok) {
    const msg =
      (json && (json.error || json.message)) ||
      text ||
      `${path} failed (${res.status})`;
    throw new Error(msg);
  }

  return (json ?? {}) as T;
}

export async function callFnResponse(path: string, payload: any): Promise<Response> {
  const res = await fetch(`${FN_BASE}/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    let json: any = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // ignore
    }
    const msg =
      (json && (json.error || json.message)) ||
      text ||
      `${path} failed (${res.status})`;
    throw new Error(msg);
  }

  return res;
}
