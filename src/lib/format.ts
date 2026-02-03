export function titleCasePlan(plan: string | null | undefined) {
  const p = (plan ?? "free").toLowerCase();
  if (p === "baby") return "Baby";
  if (p === "big") return "Big";
  return "Free";
}

export function shortId(id: string) {
  if (!id) return "";
  if (id.length <= 14) return id;
  return `${id.slice(0, 6)}…${id.slice(-6)}`;
}
