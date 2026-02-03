import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import { BillingCancel, BillingReturn, BillingSuccess } from "./pages/Billing";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/billing/success" element={<BillingSuccess />} />
      <Route path="/billing/cancel" element={<BillingCancel />} />
      <Route path="/billing/return" element={<BillingReturn />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
