function Shell({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: "#111827" }}>
      <div style={{ maxWidth: 520, margin: "0 auto", padding: 18 }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
          <div style={{ marginTop: 8, fontSize: 13, color: "#6b7280", lineHeight: 1.45 }}>
            {desc}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: "#9ca3af" }}>
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
