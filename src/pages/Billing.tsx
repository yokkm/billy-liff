const BRAND = {
  orange: "#f97316",
  orangeDeep: "#c2410c",
  peach: "#fed7aa",
  ink: "#0f172a",
  muted: "#64748b",
};

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

function Shell({ title, desc }: { title: string; desc: string }) {
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LogoMark />
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.3 }}>{title}</div>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: BRAND.muted, lineHeight: 1.6 }}>
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
