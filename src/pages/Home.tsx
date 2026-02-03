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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 16,
        background: "#fff",
        boxShadow: "0 1px 0 rgba(0,0,0,0.03)",
      }}
    >
      {children}
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  disabled?: boolean;
}) {
  const isPrimary = variant === "primary";
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "12px 12px",
        borderRadius: 12,
        border: isPrimary ? "1px solid #111827" : "1px solid #e5e7eb",
        background: isPrimary ? "#111827" : "#fff",
        color: isPrimary ? "#fff" : "#111827",
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
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
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #e5e7eb",
        fontSize: 12,
        color: "#374151",
        background: "#fff",
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

      window.location.href = out.url;
    } catch (e: any) {
      setView({ kind: "error", message: e?.message ?? String(e) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#111827" }}>
      <div style={{ maxWidth: 460, margin: "0 auto", padding: 18 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.2 }}>
                Billy — Manage subscription
              </div>
              <div style={{ marginTop: 4, fontSize: 13, color: "#6b7280", lineHeight: 1.35 }}>
                Upgrade your plan or open the customer portal.
              </div>
            </div>
            <Pill>LIFF</Pill>
          </div>

          <div style={{ marginTop: 14 }}>
            {view.kind === "boot" && (
              <div style={{ fontSize: 13, color: "#6b7280" }}>{view.message}</div>
            )}

            {view.kind === "link-needed" && (
              <>
                <div style={{ fontSize: 13, color: "#111827", whiteSpace: "pre-line" }}>
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
                <div style={{ fontSize: 13, color: "#b91c1c", whiteSpace: "pre-line" }}>
                  {view.message}
                </div>
                <div style={{ marginTop: 12 }}>
                  <Button variant="ghost" onClick={() => window.location.reload()}>
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
                    borderRadius: 14,
                    border: "1px solid #e5e7eb",
                    background: "#fff",
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
                    <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                      Current period ends:{" "}
                      {new Date(view.who.current_period_end).toLocaleString()}
                    </div>
                  )}

                  {view.who.role !== "owner" && (
                    <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
                      Only the workspace <b>owner</b> can upgrade or open the billing portal.
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
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

                <div style={{ marginTop: 10 }}>
                  <Button disabled={!canUpgrade || busy} variant="ghost" onClick={openPortal}>
                    Manage in Stripe Portal
                  </Button>
                </div>

                <div style={{ marginTop: 12, fontSize: 12, color: "#9ca3af" }}>
                  Tip: If billing status doesn’t update instantly, wait 10–30 seconds for webhook processing, then reopen.
                </div>
              </>
            )}
          </div>
        </Card>

        <div style={{ marginTop: 12, fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
          Open this page from LINE. URL:{" "}
          <span style={{ color: "#6b7280" }}>https://liff.line.me/2009033715-OOA33Qwj</span>
        </div>
      </div>
    </div>
  );
}
