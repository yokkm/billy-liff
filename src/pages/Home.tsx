import { useEffect, useMemo, useState } from "react";
import liff from "@line/liff";
import { callFn } from "../lib/api";
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
        border: "1px solid rgba(15, 23, 42, 0.06)",
        borderRadius: 22,
        padding: 20,
        background: "rgba(255, 255, 255, 0.86)",
        boxShadow:
          "0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.06)",
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
  variant?: "primary" | "ghost";
  disabled?: boolean;
  size?: "normal" | "small";
}) {
  const isPrimary = variant === "primary";
  const isSmall = size === "small";
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        padding: isSmall ? "10px 12px" : "12px 14px",
        borderRadius: 14,
        border: isPrimary
          ? `1px solid ${BRAND.orangeDeep}`
          : "1px solid rgba(15, 23, 42, 0.12)",
        background: isPrimary
          ? `linear-gradient(135deg, ${BRAND.orangeDeep} 0%, ${BRAND.orange} 100%)`
          : "rgba(255,255,255,0.9)",
        color: isPrimary ? "#fff" : BRAND.ink,
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

export default function Home() {
  const [view, setView] = useState<ViewState>({
    kind: "boot",
    message: "Initializing LIFF…",
  });
  const [busy, setBusy] = useState(false);

  const canUpgrade = useMemo(() => {
    if (view.kind !== "ready") return false;
    return view.who.role === "owner";
  }, [view]);

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(254, 215, 170, 0.55), rgba(255, 250, 244, 0.96) 55%, #ffffff 100%)",
        color: BRAND.ink,
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "28px 18px 36px" }}>
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
                    fontSize: "clamp(18px, 4.5vw, 22px)",
                    fontWeight: 800,
                    letterSpacing: -0.3,
                  }}
                >
                  Billy — Manage subscription
                </div>
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
                Upgrade your plan or open the customer portal.
              </div>
            </div>
            <Pill>LIFF</Pill>
          </div>

          <div style={{ marginTop: 12 }}>
            {view.kind === "boot" && (
              <div style={{ fontSize: 13, color: BRAND.muted }}>{view.message}</div>
            )}

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
                    marginTop: 8,
                    padding: 12,
                    borderRadius: 16,
                    border: "1px solid rgba(15, 23, 42, 0.06)",
                    background: "rgba(255, 255, 255, 0.85)",
                    boxShadow: "0 6px 16px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Pill>
                      Workspace: <b style={{ marginLeft: 6 }}>{shortId(view.who.workspace_id)}</b>
                    </Pill>
                    <Pill>
                      Role: <b style={{ marginLeft: 6 }}>{view.who.role}</b>
                    </Pill>
                    <Pill>
                      Plan: <b style={{ marginLeft: 6 }}>{titleCasePlan(view.who.plan_key)}</b>
                    </Pill>
                    <Pill>
                      Status: <b style={{ marginLeft: 6 }}>{view.who.status}</b>
                    </Pill>
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

                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <Button
                      disabled={!canUpgrade || busy}
                      onClick={() => openCheckout("baby")}
                    >
                      Upgrade Baby
                    </Button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Button
                      variant="ghost"
                      disabled={!canUpgrade || busy}
                      onClick={() => openCheckout("big")}
                    >
                      Upgrade Big
                    </Button>
                  </div>
                </div>

                <div style={{ marginTop: 8 }}>
                  <Button
                    disabled={!canUpgrade || busy}
                    variant="ghost"
                    size="small"
                    onClick={openPortal}
                  >
                    Manage in Stripe Portal
                  </Button>
                </div>

                <div style={{ marginTop: 10, fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
                  Tip: If billing status doesn’t update instantly, wait 10–30 seconds for webhook processing, then reopen.
                </div>
              </>
            )}
          </div>
        </Card>

        <div style={{ marginTop: 14, fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          Open this page from LINE. URL:{" "}
          <span style={{ color: "#64748b" }}>https://liff.line.me/2009033715-OOA33Qwj</span>
        </div>
      </div>
    </div>
  );
}
