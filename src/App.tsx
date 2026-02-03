import { useEffect, useMemo, useState } from "react";
import liff from "@line/liff";

type Status = "loading" | "ready" | "working" | "error";

const PROJECT_REF = import.meta.env.VITE_SUPABASE_PROJECT_REF as string;
const LIFF_ID = import.meta.env.VITE_LIFF_ID as string;

const FN_BASE = `https://${PROJECT_REF}.supabase.co/functions/v1`;

async function callFn(path: string, payload: any) {
  const res = await fetch(`${FN_BASE}/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${text}`);
  return JSON.parse(text);
}

export default function App() {
  const [status, setStatus] = useState<Status>("loading");
  const [msg, setMsg] = useState("Initializing…");
  const [workspaceId, setWorkspaceId] = useState("");

  const canUse = useMemo(() => status === "ready", [status]);

  useEffect(() => {
    (async () => {
      try {
        if (!LIFF_ID) throw new Error("Missing VITE_LIFF_ID");
        await liff.init({ liffId: LIFF_ID });

        if (!liff.isLoggedIn()) {
          setMsg("Redirecting to LINE login…");
          liff.login();
          return;
        }

        // Keep it minimal for V1: we just ensure LIFF session is valid
        const idToken = liff.getIDToken();
        if (!idToken) {
          setStatus("error");
          setMsg("Could not get ID token. Please reopen this page inside LINE.");
          return;
        }

        setStatus("ready");
        setMsg("Ready.");
      } catch (e: any) {
        setStatus("error");
        setMsg(e?.message ?? String(e));
      }
    })();
  }, []);

  async function onUpgrade(plan_key: "baby" | "big") {
    try {
      if (!workspaceId.trim()) {
        setStatus("error");
        setMsg("Please paste workspace_id (temporary for V1).");
        return;
      }
      setStatus("working");
      setMsg("Creating checkout…");

      const out = await callFn("stripe-create-checkout", {
        workspace_id: workspaceId.trim(),
        plan_key,
      });

      window.location.href = out.url;
    } catch (e: any) {
      setStatus("error");
      setMsg(e?.message ?? String(e));
    } finally {
      setTimeout(() => setStatus("ready"), 400);
    }
  }

  async function onPortal() {
    try {
      if (!workspaceId.trim()) {
        setStatus("error");
        setMsg("Please paste workspace_id (temporary for V1).");
        return;
      }
      setStatus("working");
      setMsg("Opening portal…");

      const out = await callFn("stripe-create-portal", {
        workspace_id: workspaceId.trim(),
      });

      window.location.href = out.url;
    } catch (e: any) {
      setStatus("error");
      setMsg(e?.message ?? String(e));
    } finally {
      setTimeout(() => setStatus("ready"), 400);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#111827" }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: 18 }}>
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            Billy — Manage subscription
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
            Upgrade plan or open customer portal.
          </div>

          {/* Temporary V1 workspace id input (we will remove after liff-whoami linking) */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
              Workspace ID (temporary for V1)
            </div>
            <input
              value={workspaceId}
              onChange={(e) => setWorkspaceId(e.target.value)}
              placeholder="e.g. 2b2c...-....-...."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <button
              disabled={!canUse}
              onClick={() => onUpgrade("baby")}
              style={{
                width: "100%",
                padding: "12px 12px",
                borderRadius: 12,
                border: "1px solid #111827",
                background: "#111827",
                color: "#fff",
                fontWeight: 700,
                cursor: canUse ? "pointer" : "not-allowed",
                opacity: canUse ? 1 : 0.6,
              }}
            >
              Upgrade Baby
            </button>

            <button
              disabled={!canUse}
              onClick={() => onUpgrade("big")}
              style={{
                width: "100%",
                padding: "12px 12px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#fff",
                color: "#111827",
                fontWeight: 700,
                cursor: canUse ? "pointer" : "not-allowed",
                opacity: canUse ? 1 : 0.6,
              }}
            >
              Upgrade Big
            </button>
          </div>

          <button
            disabled={!canUse}
            onClick={onPortal}
            style={{
              width: "100%",
              padding: "12px 12px",
              borderRadius: 12,
              border: "1px solid #e5e7eb",
              background: "#fff",
              color: "#111827",
              fontWeight: 700,
              cursor: canUse ? "pointer" : "not-allowed",
              opacity: canUse ? 1 : 0.6,
            }}
          >
            Manage in Stripe Portal
          </button>

          <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280" }}>
            Status: {msg}
          </div>

          <div style={{ marginTop: 10, fontSize: 12, color: "#9ca3af" }}>
            Next: we’ll remove the Workspace ID field by adding a LIFF identity resolver
            endpoint (recommended).
          </div>
        </div>
      </div>
    </div>
  );
}
