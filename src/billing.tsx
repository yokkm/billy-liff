export function BillingSuccess() {
  return (
    <div style={{ padding: 18, fontFamily: "system-ui" }}>
      <h3>Payment complete ✅</h3>
      <p>You can close this page and return to LINE.</p>
    </div>
  );
}

export function BillingCancel() {
  return (
    <div style={{ padding: 18, fontFamily: "system-ui" }}>
      <h3>Payment cancelled</h3>
      <p>You can close this page and try again in LINE.</p>
    </div>
  );
}

export function BillingReturn() {
  return (
    <div style={{ padding: 18, fontFamily: "system-ui" }}>
      <h3>Back to Billy</h3>
      <p>You can close this page and return to LINE.</p>
    </div>
  );
}
