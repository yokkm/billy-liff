function Shell({ title, desc }: { title: string; desc: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(255, 237, 213, 0.9), rgba(255, 251, 247, 0.95) 55%, #ffffff 100%)",
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 18px 32px" }}>
        <div
          style={{
            border: "1px solid rgba(15, 23, 42, 0.08)",
            borderRadius: 20,
            padding: 18,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,248,240,0.92) 100%)",
            boxShadow:
              "0 10px 30px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.06)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>{title}</div>
          <div style={{ marginTop: 8, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
            {desc}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: "#94a3b8" }}>
            You can close this page and return to LINE.
          </div>
        </div>
      </div>
    </div>
  );
}

export function BillingSuccess() {
  return <Shell title="Payment complete ✅" desc="Your plan will update after Stripe webhook is processed." />;
}

export function BillingCancel() {
  return <Shell title="Payment cancelled" desc="No changes were made. You can try again from the LIFF page." />;
}

export function BillingReturn() {
  return <Shell title="Back to Billy" desc="If you updated your subscription, it may take a moment to reflect." />;
}
