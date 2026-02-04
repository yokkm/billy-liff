import { useEffect, useMemo, useState } from "react";
import liff from "@line/liff";
import { callFn, callFnResponse } from "../lib/api";
import { shortId, titleCasePlan } from "../lib/format";

type WhoAmI = {
  workspace_id: string;
  role: "owner" | "member" | "accountant" | string;
  plan_key: string;
  status: "active" | "inactive" | string;
  current_period_end: string | null;
};

type ViewState =
  | { kind: "boot"; message: string }
  | { kind: "ready"; who: WhoAmI; lineUserId: string; displayName?: string }
  | { kind: "link-needed"; message: string }
  | { kind: "error"; message: string };

const BRAND = {
  orange: "#f97316",
  orangeDeep: "#c2410c",
  peach: "#fed7aa",
  ink: "#0f172a",
  muted: "#64748b",
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid rgba(15, 23, 42, 0.05)",
        borderRadius: 20,
        padding: 18,
        background: "rgba(255, 255, 255, 0.92)",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        backdropFilter: "blur(8px)",
      }}
    >
      {children}
    </div>
  );
}

function LogoMark() {
  return (
    <img
      src="/billy-logo.png"
      alt="Billy"
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        objectFit: "cover",
        boxShadow: "0 6px 14px rgba(249, 115, 22, 0.25)",
      }}
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  size = "normal",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  size?: "normal" | "small";
}) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isSmall = size === "small";
  const borderColor = isPrimary
    ? BRAND.orangeDeep
    : isSecondary
      ? "rgba(249, 115, 22, 0.35)"
      : "rgba(15, 23, 42, 0.12)";
  const backgroundColor = isPrimary
    ? `linear-gradient(135deg, ${BRAND.orangeDeep} 0%, ${BRAND.orange} 100%)`
    : isSecondary
      ? "rgba(255, 247, 237, 0.95)"
      : "rgba(255,255,255,0.9)";
  const textColor = isPrimary ? "#fff" : BRAND.ink;
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        padding: isSmall ? "10px 12px" : "12px 14px",
        borderRadius: 14,
        border: `1px solid ${borderColor}`,
        background: backgroundColor,
        color: textColor,
        fontWeight: isSmall ? 500 : 600,
        fontSize: isSmall ? 13 : 14,
        letterSpacing: 0.1,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        boxShadow: isPrimary
          ? "0 10px 18px rgba(249, 115, 22, 0.22)"
          : "0 4px 10px rgba(15, 23, 42, 0.05)",
      }}
    >
      {children}
    </button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 8px",
        borderRadius: 999,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        fontSize: 11,
        color: "#475569",
        background: "rgba(255, 247, 237, 0.9)",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function SummaryList({
  items,
}: {
  items: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        rowGap: 10,
        columnGap: 16,
      }}
    >
      {items.map((item) => (
        <div key={item.label} style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, color: BRAND.muted, fontWeight: 500 }}>
            {item.label}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 13,
              fontWeight: 600,
              color: BRAND.ink,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(254, 215, 170, 0.45), rgba(255, 251, 246, 0.98) 55%, #ffffff 100%)",
        color: BRAND.ink,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 18px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          border: "1px solid rgba(15, 23, 42, 0.05)",
          borderRadius: 18,
          padding: 18,
          background: "rgba(255, 255, 255, 0.92)",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/billy-logo.png"
            alt="Billy"
            className="billy-bounce"
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              objectFit: "cover",
              boxShadow: "0 8px 16px rgba(249, 115, 22, 0.25)",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <div style={{ marginTop: 12, fontSize: 16, fontWeight: 700 }}>
          Billy is getting ready
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: BRAND.muted }}>
          {message}
        </div>
      </div>
    </div>
  );
}

function toISODateLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Home() {
  const [view, setView] = useState<ViewState>({
    kind: "boot",
    message: "Initializing LIFF…",
  });
  const [busy, setBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState<null | "csv" | "files">(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportFiles, setExportFiles] = useState<
    { attachment_id: string; transaction_id: string; storage_path: string; url: string | null }[]
  >([]);
  const [exportOffset, setExportOffset] = useState(0);
  const exportLimit = 50;
  const [zipStatus, setZipStatus] = useState<"idle" | "creating" | "processing" | "ready" | "error">("idle");
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  const today = useMemo(() => new Date(), []);
  const [exportStart, setExportStart] = useState(() =>
    toISODateLocal(new Date(today.getFullYear(), today.getMonth(), 1)),
  );
  const [exportEnd, setExportEnd] = useState(() => toISODateLocal(today));

  const canUpgrade = useMemo(() => {
    if (view.kind !== "ready") return false;
    return view.who.role === "owner";
  }, [view]);

  const planLabel = useMemo(() => {
    if (view.kind !== "ready") return "";
    const key = view.who.plan_key;
    if (key === "baby") return "Baby Billy";
    if (key === "pro" || key === "big") return "Big Billy";
    if (key === "free") return "Free";
    return key;
  }, [view]);

  const isBabyPlan = view.kind === "ready" && view.who.plan_key === "baby";

  useEffect(() => {
    (async () => {
      try {
        const liffId = import.meta.env.VITE_LIFF_ID as string;
        if (!liffId) throw new Error("Missing VITE_LIFF_ID");

        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          setView({ kind: "boot", message: "Redirecting to LINE login…" });
          liff.login();
          return;
        }

        const id_token = liff.getIDToken();
        if (!id_token) {
          setView({
            kind: "error",
            message: "Could not get ID token. Please open this page inside LINE.",
          });
          return;
        }

        const profile = await liff.getProfile();
        const line_user_id = profile.userId;

        // Resolve workspace + role + plan from backend
        try {
          const who = await callFn<WhoAmI>("liff-whoami", {
            id_token,
            line_user_id,
          });

          setView({
            kind: "ready",
            who,
            lineUserId: line_user_id,
            displayName: profile.displayName,
          });
        } catch (e: any) {
          const msg = e?.message ?? String(e);
          if (msg.includes("workspace_not_linked")) {
            setView({
              kind: "link-needed",
              message:
                "This account is not linked to a Billy workspace yet.\n\nPlease send any message to Billy in LINE Official Account first, then reopen this page.",
            });
            return;
          }
          setView({ kind: "error", message: msg });
        }
      } catch (e: any) {
        setView({ kind: "error", message: e?.message ?? String(e) });
      }
    })();
  }, []);

  async function openCheckout(plan_key: "baby" | "big") {
    if (view.kind !== "ready") return;
    try {
      setBusy(true);

      const id_token = liff.getIDToken();
      const line_user_id = view.lineUserId;
      if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

      const out = await callFn<{ url: string }>("liff-stripe-create-checkout", {
        id_token,
        line_user_id,
        plan_key,
      });

      window.location.href = out.url;
    } catch (e: any) {
      setView({ kind: "error", message: e?.message ?? String(e) });
    } finally {
      setBusy(false);
    }
  }

  async function openPortal() {
    if (view.kind !== "ready") return;
    try {
      setBusy(true);

      const id_token = liff.getIDToken();
      const line_user_id = view.lineUserId;
      if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

      const out = await callFn<{ url: string }>("liff-stripe-create-portal", {
        id_token,
        line_user_id,
      });

      if (liff.isInClient()) {
        liff.openWindow({ url: out.url, external: true });
      } else {
        window.location.href = out.url;
      }
    } catch (e: any) {
      setView({ kind: "error", message: e?.message ?? String(e) });
    } finally {
      setBusy(false);
    }
  }

  async function exportCsv() {
    if (view.kind !== "ready") return;
    try {
      setExportBusy("csv");
      setExportError(null);

      const id_token = liff.getIDToken();
      const line_user_id = view.lineUserId;
      if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

      try {
        const out = await callFn<{ url?: string }>("billy-liff-export", {
          id_token,
          line_user_id,
          action: "csv_url",
          start_date: exportStart || null,
          end_date: exportEnd || null,
        });

        const url = String(out?.url ?? "");
        if (!url) throw new Error("csv_url_missing");

        if (liff.isInClient()) {
          liff.openWindow({ url, external: true });
        } else {
          window.location.href = url;
        }
        return;
      } catch (e: any) {
        const msg = e?.message ?? String(e);
        if (!msg.includes("invalid_action")) throw e;
      }

      const res = await callFnResponse("billy-liff-export", {
        id_token,
        line_user_id,
        action: "csv",
        start_date: exportStart || null,
        end_date: exportEnd || null,
      });

      const blob = await res.blob();
      const filename =
        `billy_export_${exportStart || "all"}_${exportEnd || "all"}.csv`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setExportError(e?.message ?? String(e));
    } finally {
      setExportBusy(null);
    }
  }

  async function loadFiles(nextOffset = 0, append = false) {
    if (view.kind !== "ready") return;
    try {
      setExportBusy("files");
      setExportError(null);

      const id_token = liff.getIDToken();
      const line_user_id = view.lineUserId;
      if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

      const out = await callFn<{
        files: { attachment_id: string; transaction_id: string; storage_path: string; url: string | null }[];
      }>("billy-liff-export", {
        id_token,
        line_user_id,
        action: "files",
        limit: exportLimit,
        offset: nextOffset,
      });

      const rows = out.files ?? [];
      setExportFiles((prev) => (append ? [...prev, ...rows] : rows));
      setExportOffset(nextOffset + rows.length);
    } catch (e: any) {
      setExportError(e?.message ?? String(e));
    } finally {
      setExportBusy(null);
    }
  }

  async function createZipJob() {
    if (view.kind !== "ready") return;
    try {
      setZipStatus("creating");
      setZipUrl(null);
      setExportError(null);

      const id_token = liff.getIDToken();
      const line_user_id = view.lineUserId;
      if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

      const out = await callFn<{ job_id: string }>("billy-liff-export-zip", {
        id_token,
        line_user_id,
        action: "create",
        start_date: exportStart || null,
        end_date: exportEnd || null,
      });

      if (!out.job_id) throw new Error("Missing job id");
      setZipStatus("processing");
      await pollZipStatus(out.job_id);
    } catch (e: any) {
      setZipStatus("error");
      setExportError(e?.message ?? String(e));
    }
  }

  async function pollZipStatus(jobId: string) {
    if (view.kind !== "ready") return;
    const id_token = liff.getIDToken();
    const line_user_id = view.lineUserId;
    if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

    for (let i = 0; i < 40; i += 1) {
      const out = await callFn<{ status: string; url?: string | null }>("billy-liff-export-zip", {
        id_token,
        line_user_id,
        action: "status",
        job_id: jobId,
      });

      if (out.status === "ready" && out.url) {
        setZipUrl(out.url);
        setZipStatus("ready");
        return;
      }

      if (out.status === "failed") {
        setZipStatus("error");
        return;
      }

      await new Promise((r) => setTimeout(r, 2000));
    }

    setZipStatus("error");
    setExportError("ZIP is taking too long. Please try again in a moment.");
  }

  return (
    view.kind === "boot" ? (
      <LoadingScreen message={view.message} />
    ) : (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(254, 215, 170, 0.45), rgba(255, 251, 246, 0.98) 55%, #ffffff 100%)",
        color: BRAND.ink,
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "22px 18px 28px" }}>
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <LogoMark />
                <div
                  style={{
                    fontSize: "clamp(17px, 4.2vw, 21px)",
                    fontWeight: 800,
                    letterSpacing: -0.3,
                  }}
                >
                  Billy — Manage subscription
                </div>
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>
                Upgrade your plan or open the customer portal.
              </div>
            </div>
            <Pill>LIFF</Pill>
          </div>

          <div
            style={{
              height: 1,
              background: "rgba(15, 23, 42, 0.06)",
              margin: "10px 0 10px",
            }}
          />

          <div>
            {view.kind === "link-needed" && (
              <>
                <div style={{ fontSize: 13, color: BRAND.ink, whiteSpace: "pre-line" }}>
                  {view.message}
                </div>
                <div style={{ marginTop: 12 }}>
                  <Button
                    variant="ghost"
                    onClick={() => liff.openWindow({ url: "https://line.me", external: true })}
                  >
                    Open LINE
                  </Button>
                </div>
              </>
            )}

            {view.kind === "error" && (
              <>
                <div
                  style={{
                    fontSize: 13,
                    color: "#9a3412",
                    whiteSpace: "pre-line",
                    background: "rgba(255, 237, 213, 0.7)",
                    border: "1px solid rgba(253, 186, 116, 0.6)",
                    padding: "10px 12px",
                    borderRadius: 12,
                  }}
                >
                  {view.message}
                </div>
                <div style={{ marginTop: 10 }}>
                  <Button variant="ghost" size="small" onClick={() => window.location.reload()}>
                    Reload
                  </Button>
                </div>
              </>
            )}

            {view.kind === "ready" && (
              <>
                <div
                  style={{
                    marginTop: 6,
                    padding: 12,
                    borderRadius: 14,
                    border: "1px solid rgba(15, 23, 42, 0.05)",
                    background: "rgba(255, 255, 255, 0.9)",
                  }}
                >
                  <div style={{ fontSize: 11, color: BRAND.muted, fontWeight: 600 }}>
                    Account
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <SummaryList
                      items={[
                        { label: "Workspace", value: shortId(view.who.workspace_id) },
                        { label: "Role", value: view.who.role },
                        { label: "Plan", value: titleCasePlan(view.who.plan_key) },
                        { label: "Status", value: view.who.status },
                      ]}
                    />
                  </div>

                  {view.who.current_period_end && (
                    <div style={{ marginTop: 10, fontSize: 12, color: BRAND.muted }}>
                      Current period ends:{" "}
                      {new Date(view.who.current_period_end).toLocaleString()}
                    </div>
                  )}

                  {view.who.role !== "owner" && (
                    <div style={{ marginTop: 10, fontSize: 12, color: BRAND.muted }}>
                      Only the workspace <b>owner</b> can upgrade or open the billing portal.
                    </div>
                  )}
                </div>

                <div
                  style={{
                    height: 1,
                    background: "rgba(15, 23, 42, 0.06)",
                    margin: "12px 0",
                  }}
                />

                <div style={{ fontSize: 11, color: BRAND.muted, fontWeight: 600, marginBottom: 8 }}>
                  Billing Actions
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  <Button
                    disabled={!canUpgrade || busy}
                    onClick={() => openCheckout("big")}
                  >
                    Upgrade Big Billy
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={!canUpgrade || busy || isBabyPlan}
                    onClick={() => openCheckout("baby")}
                  >
                    {isBabyPlan ? "Current package" : "Upgrade Baby Billy"}
                  </Button>
                </div>

                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={openPortal}
                    disabled={!canUpgrade || busy}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 12,
                      border: "1px solid rgba(15, 23, 42, 0.08)",
                      background: "transparent",
                      color: BRAND.muted,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: !canUpgrade || busy ? "not-allowed" : "pointer",
                      opacity: !canUpgrade || busy ? 0.6 : 1,
                    }}
                  >
                    Manage in Stripe Portal
                  </button>
                </div>

                <div style={{ marginTop: 6 }}>
                  <button
                    type="button"
                    onClick={() => setShowPlanDetails((v) => !v)}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: 12,
                      border: "1px solid rgba(15, 23, 42, 0.06)",
                      background: "transparent",
                      color: BRAND.muted,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {showPlanDetails ? "Hide plan details" : "Plan details"}
                  </button>
                </div>

                {showPlanDetails && view.kind === "ready" && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(15, 23, 42, 0.08)",
                      background: "rgba(255, 255, 255, 0.8)",
                      fontSize: 12,
                      color: BRAND.muted,
                      lineHeight: 1.6,
                    }}
                  >
                    <div style={{ color: BRAND.ink, fontWeight: 600 }}>
                      Current plan: {planLabel || titleCasePlan(view.who.plan_key)}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      Baby Billy: 50 slips/month
                    </div>
                    <div>
                      Big Billy: 200 slips/month
                    </div>
                    <div style={{ marginTop: 6, fontSize: 11 }}>
                      Tip: Upgrading increases monthly OCR limits.
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
                  Tip: If billing status doesn’t update instantly, wait 10–30 seconds for webhook processing, then reopen.
                </div>
              </>
            )}
          </div>
        </Card>

        <div style={{ marginTop: 10, fontSize: 11, color: "#94a3b8", textAlign: "center" }}>
          Open this page from LINE. URL:{" "}
          <span style={{ color: "#94a3b8" }}>https://liff.line.me/2009033715-OOA33Qwj</span>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 18px 40px" }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, color: BRAND.muted, fontWeight: 600 }}>
                Export Tools
              </div>
              <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700 }}>
                Export data
              </div>
            </div>
            <Pill>Owner only</Pill>
          </div>
          <div style={{ marginTop: 4, fontSize: 12, color: BRAND.muted, lineHeight: 1.6 }}>
            Download CSV or get file links for your workspace uploads.
          </div>

          {view.kind === "ready" && view.who.role !== "owner" && (
            <div style={{ marginTop: 10, fontSize: 12, color: BRAND.muted }}>
              Only the workspace owner can export data.
            </div>
          )}

          {view.kind === "ready" && view.who.role === "owner" && (
            <>
              <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: BRAND.muted }}>Start date</label>
                  <input
                    type="date"
                    value={exportStart}
                    onChange={(e) => setExportStart(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid rgba(15, 23, 42, 0.12)",
                      fontSize: 13,
                      minWidth: 140,
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: BRAND.muted }}>End date</label>
                  <input
                    type="date"
                    value={exportEnd}
                    onChange={(e) => setExportEnd(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: 6,
                      padding: "8px 10px",
                      borderRadius: 10,
                      border: "1px solid rgba(15, 23, 42, 0.12)",
                      fontSize: 13,
                      minWidth: 140,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    const start = new Date(d.getFullYear(), d.getMonth(), 1);
                    setExportStart(toISODateLocal(start));
                    setExportEnd(toISODateLocal(d));
                  }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(15, 23, 42, 0.12)",
                    fontSize: 12,
                    background: "rgba(255,255,255,0.9)",
                    cursor: "pointer",
                  }}
                >
                  This month
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date();
                    const start = new Date(d.getTime() - 29 * 24 * 60 * 60 * 1000);
                    setExportStart(toISODateLocal(start));
                    setExportEnd(toISODateLocal(d));
                  }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(15, 23, 42, 0.12)",
                    fontSize: 12,
                    background: "rgba(255,255,255,0.9)",
                    cursor: "pointer",
                  }}
                >
                  Last 30 days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExportStart("");
                    setExportEnd("");
                  }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 999,
                    border: "1px solid rgba(15, 23, 42, 0.12)",
                    fontSize: 12,
                    background: "rgba(255,255,255,0.9)",
                    cursor: "pointer",
                  }}
                >
                  All time
                </button>
              </div>

              <div style={{ marginTop: 8 }}>
                <Button
                  disabled={exportBusy !== null}
                  onClick={exportCsv}
                >
                  {exportBusy === "csv" ? "Preparing CSV…" : "Download CSV"}
                </Button>
              </div>

              <div style={{ marginTop: 8 }}>
                <Button
                  variant="secondary"
                  disabled={exportBusy !== null}
                  onClick={() => loadFiles(0, false)}
                >
                  {exportBusy === "files" ? "Loading files…" : "Get file links"}
                </Button>
              </div>

              <div style={{ marginTop: 8 }}>
                <Button
                  variant="ghost"
                  disabled={zipStatus === "creating" || zipStatus === "processing"}
                  size="small"
                  onClick={createZipJob}
                >
                  {zipStatus === "creating" && "Creating ZIP…"}
                  {zipStatus === "processing" && "Preparing ZIP…"}
                  {zipStatus === "idle" && "Download ZIP (async)"}
                  {zipStatus === "ready" && "Download ZIP (ready)"}
                  {zipStatus === "error" && "Retry ZIP export"}
                </Button>
              </div>

              {zipUrl && (
                <div style={{ marginTop: 8 }}>
                  <a
                    href={zipUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 12,
                      color: BRAND.orangeDeep,
                      textDecoration: "none",
                      border: "1px solid rgba(249, 115, 22, 0.25)",
                      padding: "8px 10px",
                      borderRadius: 10,
                      background: "rgba(255, 247, 237, 0.9)",
                      display: "inline-block",
                    }}
                  >
                    Open ZIP download
                  </a>
                </div>
              )}

              {exportError && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    color: "#9a3412",
                    whiteSpace: "pre-line",
                    background: "rgba(255, 237, 213, 0.7)",
                    border: "1px solid rgba(253, 186, 116, 0.6)",
                    padding: "10px 12px",
                    borderRadius: 12,
                  }}
                >
                  {exportError}
                </div>
              )}

              {exportFiles.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: BRAND.muted }}>
                    Showing latest {exportFiles.length} files
                  </div>
                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                    {exportFiles.map((f) => (
                      <a
                        key={f.attachment_id}
                        href={f.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          fontSize: 12,
                          color: BRAND.orangeDeep,
                          textDecoration: "none",
                          border: "1px solid rgba(249, 115, 22, 0.25)",
                          padding: "8px 10px",
                          borderRadius: 10,
                          background: "rgba(255, 247, 237, 0.9)",
                        }}
                      >
                        {f.storage_path}
                      </a>
                    ))}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Button
                      variant="ghost"
                      size="small"
                      disabled={exportBusy !== null}
                      onClick={() => loadFiles(exportOffset, true)}
                    >
                      Load more
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
    )
  );
}
