// import { useEffect, useMemo, useRef, useState } from "react";
// import liff from "@line/liff";
// import { callFn, callFnResponse } from "../lib/api";
// import { shortId, titleCasePlan } from "../lib/format";

// type WhoAmI = {
//   workspace_id: string;
//   role: "owner" | "member" | "accountant" | string;
//   plan_key: string;
//   status: "active" | "inactive" | string;
//   current_period_end: string | null;
// };

// type ViewState =
//   | { kind: "boot"; message: string }
//   | { kind: "ready"; who: WhoAmI; lineUserId: string; displayName?: string }
//   | { kind: "link-needed"; message: string }
//   | { kind: "error"; message: string };

// const BRAND = {
//   orange: "#f97316",
//   orangeDeep: "#c2410c",
//   peach: "#fed7aa",
//   ink: "#0f172a",
//   muted: "#64748b",
// };

// function Card({ children }: { children: React.ReactNode }) {
//   return (
//     <div
//       style={{
//         border: "1px solid rgba(15, 23, 42, 0.05)",
//         borderRadius: 20,
//         padding: 18,
//         background: "rgba(255, 255, 255, 0.92)",
//         boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
//         backdropFilter: "blur(8px)",
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function LogoMark() {
//   return (
//     <img
//       src="/billy-logo.png"
//       alt="Billy"
//       style={{
//         width: 36,
//         height: 36,
//         borderRadius: 12,
//         objectFit: "cover",
//         boxShadow: "0 6px 14px rgba(249, 115, 22, 0.25)",
//       }}
//       onError={(e) => {
//         e.currentTarget.style.display = "none";
//       }}
//     />
//   );
// }

// function Button({
//   children,
//   onClick,
//   variant = "primary",
//   disabled,
//   size = "normal",
// }: {
//   children: React.ReactNode;
//   onClick?: () => void;
//   variant?: "primary" | "secondary" | "ghost";
//   disabled?: boolean;
//   size?: "normal" | "small";
// }) {
//   const isPrimary = variant === "primary";
//   const isSecondary = variant === "secondary";
//   const isSmall = size === "small";

//   const borderColor = isPrimary
//     ? BRAND.orangeDeep
//     : isSecondary
//       ? "rgba(249, 115, 22, 0.35)"
//       : "rgba(15, 23, 42, 0.12)";

//   const backgroundColor = isPrimary
//     ? `linear-gradient(135deg, ${BRAND.orangeDeep} 0%, ${BRAND.orange} 100%)`
//     : isSecondary
//       ? "rgba(255, 247, 237, 0.95)"
//       : "rgba(255,255,255,0.9)";

//   const textColor = isPrimary ? "#fff" : BRAND.ink;

//   return (
//     <button
//       disabled={disabled}
//       onClick={onClick}
//       style={{
//         width: "100%",
//         padding: isSmall ? "10px 12px" : "12px 14px",
//         borderRadius: 14,
//         border: `1px solid ${borderColor}`,
//         background: backgroundColor,
//         color: textColor,
//         fontWeight: isSmall ? 600 : 700,
//         fontSize: isSmall ? 13 : 14,
//         letterSpacing: 0.1,
//         cursor: disabled ? "not-allowed" : "pointer",
//         opacity: disabled ? 0.6 : 1,
//         boxShadow: isPrimary
//           ? "0 10px 18px rgba(249, 115, 22, 0.22)"
//           : "0 4px 10px rgba(15, 23, 42, 0.05)",
//       }}
//     >
//       {children}
//     </button>
//   );
// }

// function Pill({ children }: { children: React.ReactNode }) {
//   return (
//     <span
//       style={{
//         display: "inline-flex",
//         alignItems: "center",
//         padding: "4px 8px",
//         borderRadius: 999,
//         border: "1px solid rgba(15, 23, 42, 0.08)",
//         fontSize: 11,
//         color: "#475569",
//         background: "rgba(255, 247, 237, 0.9)",
//         fontWeight: 600,
//       }}
//     >
//       {children}
//     </span>
//   );
// }

// function SummaryList({
//   items,
// }: {
//   items: { label: string; value: React.ReactNode }[];
// }) {
//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
//         rowGap: 10,
//         columnGap: 16,
//       }}
//     >
//       {items.map((item) => (
//         <div key={item.label} style={{ minWidth: 0 }}>
//           <div style={{ fontSize: 11, color: BRAND.muted, fontWeight: 600 }}>
//             {item.label}
//           </div>
//           <div
//             style={{
//               marginTop: 4,
//               fontSize: 13,
//               fontWeight: 800,
//               color: BRAND.ink,
//               whiteSpace: "nowrap",
//               overflow: "hidden",
//               textOverflow: "ellipsis",
//             }}
//           >
//             {item.value}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function LoadingScreen({ message }: { message: string }) {
//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "radial-gradient(circle at top, rgba(254, 215, 170, 0.45), rgba(255, 251, 246, 0.98) 55%, #ffffff 100%)",
//         color: BRAND.ink,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "24px 18px",
//       }}
//     >
//       <div
//         style={{
//           width: "100%",
//           maxWidth: 420,
//           border: "1px solid rgba(15, 23, 42, 0.05)",
//           borderRadius: 18,
//           padding: 18,
//           background: "rgba(255, 255, 255, 0.92)",
//           boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
//           textAlign: "center",
//         }}
//       >
//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <img
//             src="/billy-logo.png"
//             alt="Billy"
//             className="billy-bounce"
//             style={{
//               width: 56,
//               height: 56,
//               borderRadius: 16,
//               objectFit: "cover",
//               boxShadow: "0 8px 16px rgba(249, 115, 22, 0.25)",
//             }}
//             onError={(e) => {
//               e.currentTarget.style.display = "none";
//             }}
//           />
//         </div>
//         <div style={{ marginTop: 12, fontSize: 16, fontWeight: 900 }}>
//           Billy is warming up…
//         </div>
//         <div style={{ marginTop: 6, fontSize: 13, color: BRAND.muted }}>
//           {message}
//         </div>
//       </div>
//     </div>
//   );
// }

// function toISODateLocal(d: Date) {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}-${m}-${day}`;
// }

// function isValidDateRange(start: string, end: string) {
//   if (!start || !end) return true;
//   return new Date(start).getTime() <= new Date(end).getTime();
// }

// async function copyToClipboard(text: string) {
//   try {
//     await navigator.clipboard.writeText(text);
//     return true;
//   } catch {
//     return false;
//   }
// }

// /** ✅ Always open external browser (avoid LINE blank pages) */
// function openExternal(url: string) {
//   try {
//     if (liff.isInClient()) {
//       liff.openWindow({ url, external: true });
//     } else {
//       window.open(url, "_blank", "noopener,noreferrer");
//     }
//   } catch {
//     window.open(url, "_blank", "noopener,noreferrer");
//   }
// }

// function pickBestUrl(out: any): string | null {
//   const downloadUrl = typeof out?.download_url === "string" ? out.download_url : "";
//   const signedUrl = typeof out?.signed_url === "string" ? out.signed_url : "";
//   if (downloadUrl) return downloadUrl; // preferred: token endpoint that redirects to fresh signed url
//   if (signedUrl) return signedUrl;
//   return null;
// }

// function getQueryParam(name: string) {
//   try {
//     const u = new URL(window.location.href);
//     return u.searchParams.get(name);
//   } catch {
//     return null;
//   }
// }

// export default function Home() {
//   const [view, setView] = useState<ViewState>({
//     kind: "boot",
//     message: "Initializing LIFF…",
//   });

//   const [busy, setBusy] = useState(false);
//   const [exportBusy, setExportBusy] = useState<null | "csv">(null);
//   const [exportError, setExportError] = useState<string | null>(null);

//   const [zipStatus, setZipStatus] = useState<
//     "idle" | "creating" | "processing" | "ready" | "error"
//   >("idle");
//   const [zipUrl, setZipUrl] = useState<string | null>(null);
//   const [zipJobId, setZipJobId] = useState<string | null>(null);
//   const [zipCopied, setZipCopied] = useState(false);

//   const [toast, setToast] = useState<string | null>(null);
//   const [showPlanDetails, setShowPlanDetails] = useState(false);

//   const aliveRef = useRef(true);

//   const today = useMemo(() => new Date(), []);
//   const [exportStart, setExportStart] = useState(() =>
//     toISODateLocal(new Date(today.getFullYear(), today.getMonth(), 1)),
//   );
//   const [exportEnd, setExportEnd] = useState(() => toISODateLocal(today));

//   const canOwner = useMemo(() => view.kind === "ready" && view.who.role === "owner", [view]);

//   const planLabel = useMemo(() => {
//     if (view.kind !== "ready") return "";
//     const key = view.who.plan_key;
//     if (key === "baby") return "Baby Billy";
//     if (key === "pro" || key === "big") return "Big Billy";
//     if (key === "free") return "Free";
//     return key;
//   }, [view]);

//   const isBabyPlan = view.kind === "ready" && view.who.plan_key === "baby";

//   useEffect(() => {
//     if (!toast) return;
//     const t = setTimeout(() => setToast(null), 2800);
//     return () => clearTimeout(t);
//   }, [toast]);

//   useEffect(() => {
//     aliveRef.current = true;
//     return () => {
//       aliveRef.current = false;
//     };
//   }, []);

//   // Reset ZIP UI when date range changes (but do NOT wipe if user came from LINE with job_id)
//   useEffect(() => {
//     if (zipStatus === "processing" || zipStatus === "creating") return;
//     setZipStatus("idle");
//     setZipUrl(null);
//     setZipJobId(null);
//     setZipCopied(false);
//     setExportError(null);
//   }, [exportStart, exportEnd]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const liffId = import.meta.env.VITE_LIFF_ID as string;
//         if (!liffId) throw new Error("Missing VITE_LIFF_ID");

//         await liff.init({ liffId });

//         if (!liff.isLoggedIn()) {
//           setView({ kind: "boot", message: "Sending you to LINE login…" });
//           liff.login();
//           return;
//         }

//         const id_token = liff.getIDToken();
//         if (!id_token) {
//           setView({
//             kind: "error",
//             message: "Could not get ID token. Please open this page inside LINE.",
//           });
//           return;
//         }

//         const profile = await liff.getProfile();
//         const line_user_id = profile.userId;

//         try {
//           const who = await callFn<WhoAmI>("liff-whoami", { id_token, line_user_id });

//           setView({
//             kind: "ready",
//             who,
//             lineUserId: line_user_id,
//             displayName: profile.displayName,
//           });
//         } catch (e: any) {
//           const msg = e?.message ?? String(e);
//           if (msg.includes("workspace_not_linked")) {
//             setView({
//               kind: "link-needed",
//               message:
//                 "This account is not linked to a Billy workspace yet.\n\nPlease send any message to Billy in LINE Official Account first, then reopen this page.",
//             });
//             return;
//           }
//           setView({ kind: "error", message: msg });
//         }
//       } catch (e: any) {
//         setView({ kind: "error", message: e?.message ?? String(e) });
//       }
//     })();
//   }, []);

//   // ✅ Auto-start polling if user opened LIFF from LINE message with ?job_id=
//   useEffect(() => {
//     if (view.kind !== "ready") return;
//     if (!canOwner) return;

//     const jobId = getQueryParam("job_id");
//     if (!jobId) return;

//     // If already have same jobId, do nothing
//     if (zipJobId && zipJobId === jobId) return;

//     setZipJobId(jobId);
//     setZipStatus("processing");
//     setZipUrl(null);
//     setZipCopied(false);
//     setExportError(null);
//     setToast("Found an export job from LINE. Checking status…");

//     pollZipStatus(jobId).catch((e) => {
//       setZipStatus("error");
//       setExportError(e?.message ?? String(e));
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [view.kind, canOwner]);

//   async function openCheckout(plan_key: "baby" | "big") {
//     if (view.kind !== "ready") return;
//     try {
//       setBusy(true);
//       const id_token = liff.getIDToken();
//       const line_user_id = view.lineUserId;
//       if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

//       const out = await callFn<{ url: string }>("liff-stripe-create-checkout", {
//         id_token,
//         line_user_id,
//         plan_key,
//       });
//       if (!out?.url) throw new Error("Missing checkout url");
//       openExternal(out.url);
//     } catch (e: any) {
//       setView({ kind: "error", message: e?.message ?? String(e) });
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function openPortal() {
//     if (view.kind !== "ready") return;
//     try {
//       setBusy(true);
//       const id_token = liff.getIDToken();
//       const line_user_id = view.lineUserId;
//       if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

//       const out = await callFn<{ url: string }>("liff-stripe-create-portal", {
//         id_token,
//         line_user_id,
//       });
//       if (!out?.url) throw new Error("Missing portal url");
//       openExternal(out.url);
//     } catch (e: any) {
//       setView({ kind: "error", message: e?.message ?? String(e) });
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function exportCsv() {
//     if (view.kind !== "ready") return;
//     try {
//       setExportBusy("csv");
//       setExportError(null);

//       const id_token = liff.getIDToken();
//       const line_user_id = view.lineUserId;
//       if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

//       // Prefer URL mode
//       try {
//         const out = await callFn<{ url?: string }>("billy-liff-export", {
//           id_token,
//           line_user_id,
//           action: "csv_url",
//           start_date: exportStart || null,
//           end_date: exportEnd || null,
//         });

//         const url = typeof out?.url === "string" ? out.url : "";
//         if (url) {
//           openExternal(url);
//           return;
//         }
//       } catch (e: any) {
//         const msg = e?.message ?? String(e);
//         if (!msg.includes("invalid_action")) throw e;
//       }

//       // Fallback blob
//       const res = await callFnResponse("billy-liff-export", {
//         id_token,
//         line_user_id,
//         action: "csv",
//         start_date: exportStart || null,
//         end_date: exportEnd || null,
//       });

//       const blob = await res.blob();
//       const filename = `billy_export_${exportStart || "all"}_${exportEnd || "all"}.csv`;

//       if (liff.isInClient()) {
//         const u = URL.createObjectURL(blob);
//         openExternal(u);
//         setTimeout(() => URL.revokeObjectURL(u), 10_000);
//         return;
//       }

//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch (e: any) {
//       setExportError(e?.message ?? String(e));
//     } finally {
//       setExportBusy(null);
//     }
//   }

//   // ✅ Tell user in LINE immediately: “working on it”
//   async function sendWorkingLineMessage(jobId: string) {
//     try {
//       const id_token = liff.getIDToken();
//       const line_user_id = view.kind === "ready" ? view.lineUserId : "";
//       if (!id_token || !line_user_id) return;

//       await callFn("billy-liff-export-zip-notify", {
//         id_token,
//         line_user_id,
//         job_id: jobId,
//         kind: "queued",
//         start_date: exportStart || null,
//         end_date: exportEnd || null,
//       });
//     } catch {
//       // best effort (do nothing)
//     }
//   }

//   async function createZipJob() {
//     if (view.kind !== "ready") return;
//     try {
//       setZipStatus("creating");
//       setZipUrl(null);
//       setZipJobId(null);
//       setZipCopied(false);
//       setExportError(null);

//       const id_token = liff.getIDToken();
//       const line_user_id = view.lineUserId;
//       if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

//       if (!isValidDateRange(exportStart, exportEnd)) {
//         setZipStatus("error");
//         setExportError("Start date must be before end date.");
//         return;
//       }

//       const out = await callFn<any>("billy-liff-export-zip", {
//         id_token,
//         line_user_id,
//         action: "create",
//         start_date: exportStart || null,
//         end_date: exportEnd || null,
//       });

//       if (!out?.job_id) throw new Error("Missing job id");

//       setZipJobId(out.job_id);
//       setZipStatus("processing");

//       // ✅ Immediately message the user (so they can close LIFF)
//       await sendWorkingLineMessage(out.job_id);

//       setToast("Ok boss 🫡 I’m packing your ZIP. You can close this page.");
//       await pollZipStatus(out.job_id);
//     } catch (e: any) {
//       setZipStatus("error");
//       setExportError(e?.message ?? String(e));
//     }
//   }

//   async function pollZipStatus(jobId: string) {
//     if (view.kind !== "ready") return;

//     const id_token = liff.getIDToken();
//     const line_user_id = view.lineUserId;
//     if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

//     // 80s max
//     for (let i = 0; i < 40; i += 1) {
//       const out = await callFn<any>("billy-liff-export-zip", {
//         id_token,
//         line_user_id,
//         action: "status",
//         job_id: jobId,
//       });

//       const status = String(out?.status ?? "");
//       if (status === "ready") {
//         const best = pickBestUrl(out);
//         if (!best) {
//           setZipStatus("error");
//           setExportError("ZIP is ready but missing download link.");
//           return;
//         }

//         if (!aliveRef.current) return;
//         setZipUrl(best);
//         setZipStatus("ready");
//         setToast("ZIP is ready 🎁 Tap download (opens browser).");
//         return;
//       }

//       if (status === "failed") {
//         if (!aliveRef.current) return;
//         setZipStatus("error");
//         setExportError("ZIP export failed. Please retry.");
//         return;
//       }

//       await new Promise((r) => setTimeout(r, 2000));
//     }

//     setZipStatus("error");
//     setExportError("This is taking longer than usual. I’ll notify you in LINE when it’s ready.");
//   }

//   return view.kind === "boot" ? (
//     <LoadingScreen message={view.message} />
//   ) : (
//     <div
//       style={{
//         minHeight: "100vh",
//         background:
//           "radial-gradient(circle at top, rgba(254, 215, 170, 0.45), rgba(255, 251, 246, 0.98) 55%, #ffffff 100%)",
//         color: BRAND.ink,
//       }}
//     >
//       <div style={{ maxWidth: 520, margin: "0 auto", padding: "22px 18px 28px" }}>
//         <Card>
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
//             <div>
//               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                 <LogoMark />
//                 <div style={{ fontSize: "clamp(17px, 4.2vw, 21px)", fontWeight: 900, letterSpacing: -0.3 }}>
//                   Billy — Manage subscription
//                 </div>
//               </div>
//               <div style={{ marginTop: 6, fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>
//                 Upgrade your plan or open the customer portal.
//               </div>
//             </div>
//             <Pill>LIFF</Pill>
//           </div>

//           <div style={{ height: 1, background: "rgba(15, 23, 42, 0.06)", margin: "10px 0 10px" }} />

//           <div>
//             {view.kind === "link-needed" && (
//               <>
//                 <div style={{ fontSize: 13, color: BRAND.ink, whiteSpace: "pre-line" }}>
//                   {view.message}
//                 </div>
//                 <div style={{ marginTop: 12 }}>
//                   <Button variant="ghost" onClick={() => openExternal("https://line.me")}>
//                     Open LINE
//                   </Button>
//                 </div>
//               </>
//             )}

//             {view.kind === "error" && (
//               <>
//                 <div
//                   style={{
//                     fontSize: 13,
//                     color: "#9a3412",
//                     whiteSpace: "pre-line",
//                     background: "rgba(255, 237, 213, 0.7)",
//                     border: "1px solid rgba(253, 186, 116, 0.6)",
//                     padding: "10px 12px",
//                     borderRadius: 12,
//                     fontWeight: 700,
//                   }}
//                 >
//                   {view.message}
//                 </div>
//                 <div style={{ marginTop: 10 }}>
//                   <Button variant="ghost" size="small" onClick={() => window.location.reload()}>
//                     Reload
//                   </Button>
//                 </div>
//               </>
//             )}

//             {view.kind === "ready" && (
//               <>
//                 <div
//                   style={{
//                     marginTop: 6,
//                     padding: 12,
//                     borderRadius: 14,
//                     border: "1px solid rgba(15, 23, 42, 0.05)",
//                     background: "rgba(255, 255, 255, 0.9)",
//                   }}
//                 >
//                   <div style={{ fontSize: 11, color: BRAND.muted, fontWeight: 800 }}>
//                     Account
//                   </div>
//                   <div style={{ marginTop: 8 }}>
//                     <SummaryList
//                       items={[
//                         { label: "Workspace", value: shortId(view.who.workspace_id) },
//                         { label: "Role", value: view.who.role },
//                         { label: "Plan", value: titleCasePlan(view.who.plan_key) },
//                         { label: "Status", value: view.who.status },
//                       ]}
//                     />
//                   </div>

//                   {view.who.current_period_end && (
//                     <div style={{ marginTop: 10, fontSize: 12, color: BRAND.muted }}>
//                       Current period ends: {new Date(view.who.current_period_end).toLocaleString()}
//                     </div>
//                   )}

//                   {view.who.role !== "owner" && (
//                     <div style={{ marginTop: 10, fontSize: 12, color: BRAND.muted }}>
//                       Only the workspace <b>owner</b> can upgrade or open billing portal.
//                     </div>
//                   )}
//                 </div>

//                 <div style={{ height: 1, background: "rgba(15, 23, 42, 0.06)", margin: "12px 0" }} />

//                 <div style={{ fontSize: 11, color: BRAND.muted, fontWeight: 900, marginBottom: 8 }}>
//                   Billing Actions
//                 </div>

//                 <div style={{ display: "grid", gap: 10 }}>
//                   <Button disabled={!canOwner || busy} onClick={() => openCheckout("big")}>
//                     Upgrade Big Billy
//                   </Button>

//                   <Button
//                     variant="secondary"
//                     disabled={!canOwner || busy || isBabyPlan}
//                     onClick={() => openCheckout("baby")}
//                   >
//                     {isBabyPlan ? "Current package" : "Upgrade Baby Billy"}
//                   </Button>
//                 </div>

//                 <div style={{ marginTop: 8 }}>
//                   <button
//                     type="button"
//                     onClick={openPortal}
//                     disabled={!canOwner || busy}
//                     style={{
//                       width: "100%",
//                       padding: "8px 10px",
//                       borderRadius: 12,
//                       border: "1px solid rgba(15, 23, 42, 0.08)",
//                       background: "transparent",
//                       color: BRAND.muted,
//                       fontSize: 12,
//                       fontWeight: 800,
//                       cursor: !canOwner || busy ? "not-allowed" : "pointer",
//                       opacity: !canOwner || busy ? 0.6 : 1,
//                     }}
//                   >
//                     Manage in Stripe Portal (opens browser)
//                   </button>
//                 </div>

//                 <div style={{ marginTop: 6 }}>
//                   <button
//                     type="button"
//                     onClick={() => setShowPlanDetails((v) => !v)}
//                     style={{
//                       width: "100%",
//                       padding: "8px 10px",
//                       borderRadius: 12,
//                       border: "1px solid rgba(15, 23, 42, 0.06)",
//                       background: "transparent",
//                       color: BRAND.muted,
//                       fontSize: 12,
//                       fontWeight: 800,
//                       cursor: "pointer",
//                     }}
//                   >
//                     {showPlanDetails ? "Hide plan details" : "Plan details"}
//                   </button>
//                 </div>

//                 {showPlanDetails && (
//                   <div
//                     style={{
//                       marginTop: 10,
//                       padding: 12,
//                       borderRadius: 14,
//                       border: "1px solid rgba(15, 23, 42, 0.08)",
//                       background: "rgba(255, 255, 255, 0.8)",
//                       fontSize: 12,
//                       color: BRAND.muted,
//                       lineHeight: 1.6,
//                     }}
//                   >
//                     <div style={{ color: BRAND.ink, fontWeight: 900 }}>
//                       Current plan: {planLabel || titleCasePlan(view.who.plan_key)}
//                     </div>
//                     <div style={{ marginTop: 6 }}>Baby Billy: 50 slips/month</div>
//                     <div>Big Billy: 200 slips/month</div>
//                     <div style={{ marginTop: 6, fontSize: 11 }}>
//                       Tip: Upgrading increases monthly OCR limits.
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </Card>
//       </div>

//       <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 18px 40px" }}>
//         <Card>
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <div>
//               <div style={{ fontSize: 11, color: BRAND.muted, fontWeight: 900 }}>
//                 Export Tools
//               </div>
//               <div style={{ marginTop: 4, fontSize: 16, fontWeight: 900 }}>
//                 Export data
//               </div>
//             </div>
//             <Pill>Owner only</Pill>
//           </div>

//           <div style={{ marginTop: 4, fontSize: 12, color: BRAND.muted, lineHeight: 1.6 }}>
//             CSV = transactions. ZIP = receipt/payslip images. Downloads open in browser.
//           </div>

//           {view.kind === "ready" && view.who.role !== "owner" && (
//             <div style={{ marginTop: 10, fontSize: 12, color: BRAND.muted }}>
//               Only the workspace owner can export data.
//             </div>
//           )}

//           {view.kind === "ready" && view.who.role === "owner" && (
//             <>
//               {/* Date Range */}
//               <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
//                 <div style={{ flex: 1 }}>
//                   <label style={{ fontSize: 12, color: BRAND.muted, fontWeight: 800 }}>Start date</label>
//                   <input
//                     type="date"
//                     value={exportStart}
//                     onChange={(e) => setExportStart(e.target.value)}
//                     style={{
//                       width: "100%",
//                       marginTop: 6,
//                       padding: "8px 10px",
//                       borderRadius: 10,
//                       border: "1px solid rgba(15, 23, 42, 0.12)",
//                       fontSize: 13,
//                       minWidth: 140,
//                     }}
//                   />
//                 </div>

//                 <div style={{ flex: 1 }}>
//                   <label style={{ fontSize: 12, color: BRAND.muted, fontWeight: 800 }}>End date</label>
//                   <input
//                     type="date"
//                     value={exportEnd}
//                     onChange={(e) => setExportEnd(e.target.value)}
//                     style={{
//                       width: "100%",
//                       marginTop: 6,
//                       padding: "8px 10px",
//                       borderRadius: 10,
//                       border: "1px solid rgba(15, 23, 42, 0.12)",
//                       fontSize: 13,
//                       minWidth: 140,
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* Quick range chips */}
//               <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
//                 {[
//                   {
//                     label: "This month",
//                     onClick: () => {
//                       const d = new Date();
//                       const start = new Date(d.getFullYear(), d.getMonth(), 1);
//                       setExportStart(toISODateLocal(start));
//                       setExportEnd(toISODateLocal(d));
//                     },
//                   },
//                   {
//                     label: "Last 30 days",
//                     onClick: () => {
//                       const d = new Date();
//                       const start = new Date(d.getTime() - 29 * 24 * 60 * 60 * 1000);
//                       setExportStart(toISODateLocal(start));
//                       setExportEnd(toISODateLocal(d));
//                     },
//                   },
//                   { label: "All time", onClick: () => (setExportStart(""), setExportEnd("")) },
//                 ].map((x) => (
//                   <button
//                     key={x.label}
//                     type="button"
//                     onClick={x.onClick}
//                     style={{
//                       padding: "6px 11px",
//                       borderRadius: 999,
//                       border: "1px solid rgba(15, 23, 42, 0.12)",
//                       fontSize: 12,
//                       background: "rgba(255,255,255,0.9)",
//                       cursor: "pointer",
//                       fontWeight: 800,
//                     }}
//                   >
//                     {x.label}
//                   </button>
//                 ))}

//                 {!isValidDateRange(exportStart, exportEnd) && (
//                   <span style={{ fontSize: 12, color: "#9a3412", fontWeight: 800 }}>
//                     Start date must be before end date
//                   </span>
//                 )}
//               </div>

//               {/* CSV */}
//               <div
//                 style={{
//                   marginTop: 14,
//                   padding: 12,
//                   borderRadius: 14,
//                   border: "1px solid rgba(15, 23, 42, 0.08)",
//                   background: "rgba(255, 255, 255, 0.85)",
//                 }}
//               >
//                 <div style={{ fontSize: 13, fontWeight: 900, color: BRAND.ink }}>CSV export</div>
//                 <div style={{ marginTop: 4, fontSize: 12, color: BRAND.muted, lineHeight: 1.5 }}>
//                   Transactions only (no images).
//                 </div>
//                 <div style={{ marginTop: 10 }}>
//                   <Button
//                     disabled={exportBusy !== null || !isValidDateRange(exportStart, exportEnd)}
//                     onClick={exportCsv}
//                   >
//                     {exportBusy === "csv" ? "Cooking CSV…" : "Download Summary Sheet"}
//                   </Button>
//                 </div>
//               </div>

//               {/* ZIP */}
//               <div
//                 style={{
//                   marginTop: 10,
//                   padding: 12,
//                   borderRadius: 14,
//                   border: "1px solid rgba(15, 23, 42, 0.08)",
//                   background: "rgba(255, 255, 255, 0.85)",
//                 }}
//               >
//                 <div style={{ fontSize: 13, fontWeight: 900, color: BRAND.ink }}>ZIP export (images)</div>

//                 {zipStatus === "idle" && (
//                   <div style={{ marginTop: 4, fontSize: 12, color: BRAND.muted, lineHeight: 1.5 }}>
//                     I’ll pack your receipts & payslips. You’ll get a LINE message when it’s ready.
//                   </div>
//                 )}

//                 {(zipStatus === "creating" || zipStatus === "processing") && (
//                   <div
//                     style={{
//                       marginTop: 8,
//                       padding: "10px 12px",
//                       borderRadius: 12,
//                       border: "1px solid rgba(249, 115, 22, 0.25)",
//                       background: "rgba(255, 247, 237, 0.95)",
//                       color: BRAND.orangeDeep,
//                       fontSize: 12,
//                       fontWeight: 900,
//                       lineHeight: 1.55,
//                     }}
//                   >
//                     🧳 Billy is packing your ZIP… <br />
//                     You can close this page — I’ll DM you in LINE when it’s ready.
//                     {zipJobId && (
//                       <div style={{ marginTop: 6, fontSize: 11, color: BRAND.muted, fontWeight: 800 }}>
//                         Job: <span style={{ fontFamily: "monospace" }}>{zipJobId.slice(0, 8)}…</span>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {zipStatus === "ready" && (
//                   <div
//                     style={{
//                       marginTop: 8,
//                       padding: "10px 12px",
//                       borderRadius: 12,
//                       border: "1px solid rgba(15, 23, 42, 0.10)",
//                       background: "rgba(255,255,255,0.95)",
//                       color: BRAND.ink,
//                       fontSize: 12,
//                       fontWeight: 900,
//                       lineHeight: 1.55,
//                     }}
//                   >
//                     ✅ ZIP is ready. Download will open in your browser (not inside LINE).
//                   </div>
//                 )}

//                 <div style={{ marginTop: 10 }}>
//                   <Button
//                     variant="secondary"
//                     disabled={
//                       exportBusy !== null ||
//                       zipStatus === "creating" ||
//                       zipStatus === "processing" ||
//                       !isValidDateRange(exportStart, exportEnd)
//                     }
//                     onClick={createZipJob}
//                   >
//                     {zipStatus === "idle" && "Create ZIP export"}
//                     {zipStatus === "creating" && "Starting…"}
//                     {zipStatus === "processing" && "Working…"}
//                     {zipStatus === "ready" && "Create another ZIP"}
//                     {zipStatus === "error" && "Retry ZIP export"}
//                   </Button>
//                 </div>

//                 {/* ✅ Only show download/copy when READY */}
//                 {zipStatus === "ready" && zipUrl && (
//                   <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
//                     <button
//                       type="button"
//                       onClick={() => openExternal(zipUrl)}
//                       style={{
//                         padding: "12px",
//                         borderRadius: 10,
//                         border: "1px solid rgba(249, 115, 22, 0.35)",
//                         background: "rgba(255, 247, 237, 0.95)",
//                         fontSize: 13,
//                         fontWeight: 900,
//                         color: BRAND.orangeDeep,
//                         cursor: "pointer",
//                         textAlign: "center",
//                       }}
//                     >
//                       ⬇️ Download ZIP (opens browser)
//                     </button>

//                     <button
//                       type="button"
//                       onClick={async () => {
//                         const ok = await copyToClipboard(zipUrl);
//                         setZipCopied(ok);
//                         setToast(ok ? "Copied ZIP link ✅" : "Copy failed");
//                       }}
//                       style={{
//                         padding: "10px",
//                         borderRadius: 10,
//                         border: "1px solid rgba(15, 23, 42, 0.12)",
//                         background: "rgba(255,255,255,0.9)",
//                         fontSize: 12,
//                         fontWeight: 900,
//                         cursor: "pointer",
//                       }}
//                     >
//                       {zipCopied ? "Copied ✅" : "Copy link"}
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {exportError && (
//                 <div
//                   style={{
//                     marginTop: 12,
//                     fontSize: 12,
//                     color: "#9a3412",
//                     whiteSpace: "pre-line",
//                     background: "rgba(255, 237, 213, 0.7)",
//                     border: "1px solid rgba(253, 186, 116, 0.6)",
//                     padding: "10px 12px",
//                     borderRadius: 12,
//                     fontWeight: 900,
//                   }}
//                 >
//                   {exportError}
//                 </div>
//               )}

//               {toast && (
//                 <div
//                   style={{
//                     marginTop: 12,
//                     fontSize: 12,
//                     color: BRAND.ink,
//                     background: "rgba(255, 247, 237, 0.95)",
//                     border: "1px solid rgba(249, 115, 22, 0.25)",
//                     padding: "10px 12px",
//                     borderRadius: 12,
//                     fontWeight: 900,
//                     textAlign: "center",
//                   }}
//                 >
//                   {toast}
//                 </div>
//               )}
//             </>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useRef, useState } from "react";
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

type TabKey = "export" | "billing";

const BRAND = {
  orange: "#f97316",
  orangeDeep: "#c2410c",
  peach: "#fed7aa",
  ink: "#0f172a",
  muted: "#64748b",
  border: "rgba(15, 23, 42, 0.08)",
  bg: "rgba(255, 255, 255, 0.92)",
  soft: "rgba(255, 247, 237, 0.95)",
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid rgba(15, 23, 42, 0.05)",
        borderRadius: 20,
        padding: 18,
        background: BRAND.bg,
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
      ? BRAND.soft
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
        fontWeight: isSmall ? 700 : 800,
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
        background: BRAND.soft,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(15, 23, 42, 0.06)", margin: "12px 0" }} />;
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
          <div style={{ fontSize: 11, color: BRAND.muted, fontWeight: 800 }}>{item.label}</div>
          <div
            style={{
              marginTop: 4,
              fontSize: 13,
              fontWeight: 900,
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
          background: BRAND.bg,
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
        <div style={{ marginTop: 12, fontSize: 16, fontWeight: 900 }}>Billy is warming up…</div>
        <div style={{ marginTop: 6, fontSize: 13, color: BRAND.muted }}>{message}</div>
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

function isValidDateRange(start: string, end: string) {
  if (!start || !end) return true;
  return new Date(start).getTime() <= new Date(end).getTime();
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** ✅ Always open external browser (avoid LINE blank pages) */
function openExternal(url: string) {
  try {
    if (liff.isInClient()) {
      liff.openWindow({ url, external: true });
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

function pickBestUrl(out: any): string | null {
  const downloadUrl = typeof out?.download_url === "string" ? out.download_url : "";
  const signedUrl = typeof out?.signed_url === "string" ? out.signed_url : "";
  if (downloadUrl) return downloadUrl; // preferred: token endpoint that redirects to fresh signed url
  if (signedUrl) return signedUrl;
  return null;
}

function getQueryParam(name: string) {
  try {
    const u = new URL(window.location.href);
    return u.searchParams.get(name);
  } catch {
    return null;
  }
}

function TabPills({
  active,
  onChange,
  canOwner,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
  canOwner: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {[
        { key: "export" as const, label: "Export Center" },
        { key: "billing" as const, label: "Plan & Billing" },
      ].map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            style={{
              padding: "7px 10px",
              borderRadius: 999,
              border: `1px solid ${isActive ? "rgba(249,115,22,0.45)" : "rgba(15,23,42,0.12)"}`,
              background: isActive ? "rgba(255, 247, 237, 0.95)" : "rgba(255,255,255,0.9)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 900,
              color: BRAND.ink,
              opacity: t.key === "billing" && !canOwner ? 0.85 : 1,
            }}
            aria-pressed={isActive}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function LockScreen({
  title,
  desc,
  onOpenBilling,
}: {
  title: string;
  desc: string;
  onOpenBilling: () => void;
}) {
  return (
    <div
      style={{
        marginTop: 10,
        borderRadius: 16,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        background: "rgba(255,255,255,0.9)",
        padding: 14,
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 900, color: BRAND.ink }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 12, color: BRAND.muted, lineHeight: 1.6, whiteSpace: "pre-line" }}>
        {desc}
      </div>
      <div style={{ marginTop: 10 }}>
        <Button variant="secondary" onClick={onOpenBilling}>
          View plans
        </Button>
      </div>
    </div>
  );
}

function TinyLinkRow({
  label,
  value,
  onClick,
  hint,
}: {
  label: string;
  value: string;
  onClick: () => void;
  hint?: string;
}) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 11, color: BRAND.muted, fontWeight: 900 }}>{label}</div>
      <button
        type="button"
        onClick={onClick}
        style={{
          width: "100%",
          marginTop: 6,
          padding: "10px 12px",
          borderRadius: 12,
          border: "1px solid rgba(15, 23, 42, 0.10)",
          background: "rgba(255,255,255,0.9)",
          textAlign: "left",
          cursor: "pointer",
        }}
        title="Tap to copy"
      >
        <div
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
            fontSize: 12,
            fontWeight: 900,
            color: BRAND.ink,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {value}
        </div>
        {hint && <div style={{ marginTop: 6, fontSize: 11, fontWeight: 800, color: BRAND.muted }}>{hint}</div>}
      </button>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<ViewState>({
    kind: "boot",
    message: "Initializing LIFF…",
  });

  const [activeTab, setActiveTab] = useState<TabKey>("export");

  const [busy, setBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState<null | "csv">(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const [zipStatus, setZipStatus] = useState<
    "idle" | "creating" | "processing" | "ready" | "background" | "error"
  >("idle");
  const [zipUrl, setZipUrl] = useState<string | null>(null);
  const [zipJobId, setZipJobId] = useState<string | null>(null);
  const [zipCopied, setZipCopied] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [showAccount, setShowAccount] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [showExportHelp, setShowExportHelp] = useState(false);

  const aliveRef = useRef(true);

  const today = useMemo(() => new Date(), []);
  const [exportStart, setExportStart] = useState(() =>
    toISODateLocal(new Date(today.getFullYear(), today.getMonth(), 1)),
  );
  const [exportEnd, setExportEnd] = useState(() => toISODateLocal(today));

  const canOwner = useMemo(() => view.kind === "ready" && view.who.role === "owner", [view]);
  const planKey = useMemo(() => (view.kind === "ready" ? view.who.plan_key : ""), [view]);

  const planLabel = useMemo(() => {
    if (view.kind !== "ready") return "";
    const key = view.who.plan_key;
    if (key === "baby") return "Baby Billy";
    if (key === "pro" || key === "big") return "Big Billy";
    if (key === "free") return "Free";
    return key;
  }, [view]);

  const isBabyPlan = view.kind === "ready" && view.who.plan_key === "baby";
  const isFreePlan = view.kind === "ready" && view.who.plan_key === "free";

  // ✅ default tab: if user enters from LINE with job_id => Export Center
  useEffect(() => {
    const jobId = getQueryParam("job_id");
    if (jobId) setActiveTab("export");
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // Reset ZIP UI when date range changes (but do NOT wipe if user came from LINE with job_id)
  useEffect(() => {
    const hasJobFromUrl = Boolean(getQueryParam("job_id"));
    if (hasJobFromUrl) return;

    if (zipStatus === "processing" || zipStatus === "creating") return;

    setZipStatus("idle");
    setZipUrl(null);
    setZipJobId(null);
    setZipCopied(false);
    setExportError(null);
  }, [exportStart, exportEnd]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    (async () => {
      try {
        const liffId = import.meta.env.VITE_LIFF_ID as string;
        if (!liffId) throw new Error("Missing VITE_LIFF_ID");

        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          setView({ kind: "boot", message: "Sending you to LINE login…" });
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

        try {
          const who = await callFn<WhoAmI>("liff-whoami", { id_token, line_user_id });

          setView({
            kind: "ready",
            who,
            lineUserId: line_user_id,
            displayName: profile.displayName,
          });

          // If non-owner, keep them away from billing actions by default
          if (who.role !== "owner") setActiveTab("export");
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

  // ✅ Auto-start polling if user opened LIFF from LINE message with ?job_id=
  useEffect(() => {
    if (view.kind !== "ready") return;
    if (!canOwner) return;

    const jobId = getQueryParam("job_id");
    if (!jobId) return;

    if (zipJobId && zipJobId === jobId) return;

    setActiveTab("export");
    setZipJobId(jobId);
    setZipStatus("processing");
    setZipUrl(null);
    setZipCopied(false);
    setExportError(null);
    setToast("Found an export job from LINE. Checking status…");

    pollZipStatus(jobId).catch((e) => {
      setZipStatus("error");
      setExportError(e?.message ?? String(e));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.kind, canOwner]);

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
      if (!out?.url) throw new Error("Missing checkout url");
      openExternal(out.url);
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
      if (!out?.url) throw new Error("Missing portal url");
      openExternal(out.url);
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

      // Prefer URL mode
      try {
        const out = await callFn<{ url?: string }>("billy-liff-export", {
          id_token,
          line_user_id,
          action: "csv_url",
          start_date: exportStart || null,
          end_date: exportEnd || null,
        });

        const url = typeof out?.url === "string" ? out.url : "";
        if (url) {
          openExternal(url);
          return;
        }
      } catch (e: any) {
        const msg = e?.message ?? String(e);
        if (!msg.includes("invalid_action")) throw e;
      }

      // Fallback blob
      const res = await callFnResponse("billy-liff-export", {
        id_token,
        line_user_id,
        action: "csv",
        start_date: exportStart || null,
        end_date: exportEnd || null,
      });

      const blob = await res.blob();
      const filename = `billy_export_${exportStart || "all"}_${exportEnd || "all"}.csv`;

      if (liff.isInClient()) {
        const u = URL.createObjectURL(blob);
        openExternal(u);
        setTimeout(() => URL.revokeObjectURL(u), 10_000);
        return;
      }

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

  // ✅ Tell user in LINE immediately: “working on it”
  async function sendWorkingLineMessage(jobId: string) {
    try {
      const id_token = liff.getIDToken();
      const line_user_id = view.kind === "ready" ? view.lineUserId : "";
      if (!id_token || !line_user_id) return;

      await callFn("billy-liff-export-zip-notify", {
        id_token,
        line_user_id,
        job_id: jobId,
        kind: "queued",
        start_date: exportStart || null,
        end_date: exportEnd || null,
      });
    } catch {
      // best effort (do nothing)
    }
  }

  async function createZipJob() {
    if (view.kind !== "ready") return;
    try {
      setZipStatus("creating");
      setZipUrl(null);
      setZipJobId(null);
      setZipCopied(false);
      setExportError(null);

      const id_token = liff.getIDToken();
      const line_user_id = view.lineUserId;
      if (!id_token || !line_user_id) throw new Error("Missing LIFF identity");

      if (!isValidDateRange(exportStart, exportEnd)) {
        setZipStatus("error");
        setExportError("Start date must be before end date.");
        return;
      }

      const out = await callFn<any>("billy-liff-export-zip", {
        id_token,
        line_user_id,
        action: "create",
        start_date: exportStart || null,
        end_date: exportEnd || null,
      });

      if (!out?.job_id) throw new Error("Missing job id");

      setZipJobId(out.job_id);
      setZipStatus("processing");

      // ✅ Immediately message the user (so they can close LIFF)
      await sendWorkingLineMessage(out.job_id);

      // Minimal, premium: one short toast
      setToast("Packing started. You can close this page — I’ll DM you when it’s ready.");
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

    // 80s max
    for (let i = 0; i < 40; i += 1) {
      const out = await callFn<any>("billy-liff-export-zip", {
        id_token,
        line_user_id,
        action: "status",
        job_id: jobId,
      });

      const status = String(out?.status ?? "");
      if (status === "ready") {
        const best = pickBestUrl(out);
        if (!best) {
          setZipStatus("error");
          setExportError("ZIP is ready but missing download link.");
          return;
        }

        if (!aliveRef.current) return;
        setZipUrl(best);
        setZipStatus("ready");
        setToast("ZIP is ready 🎁");
        return;
      }

      if (status === "failed") {
        if (!aliveRef.current) return;
        setZipStatus("error");
        setExportError("ZIP export failed. Please retry.");
        return;
      }

      await new Promise((r) => setTimeout(r, 2000));
    }

    // ✅ IMPORTANT: timeout is NOT an error
    setZipStatus("background");
    setExportError(null);
    setToast("Still packing in background. I’ll DM you in LINE when it’s ready.");
  }

  const pageTitle = useMemo(() => {
    if (activeTab === "export") return "Billy — Export Center";
    return "Billy — Plan & Billing";
  }, [activeTab]);

  // Upsell message (gentle + persuasive)
  const upsell = useMemo(() => {
    if (view.kind !== "ready") return null;
    if (view.who.role !== "owner") return null;

    // Adjust copy to your tiers
    if (isFreePlan) {
      return {
        title: "Unlock Big Billy ✨",
        body: "More slips, smoother OCR, faster workflows. Upgrade anytime — takes 30 seconds.",
        cta: "Upgrade Big Billy",
        cta2: "See Baby Billy",
      };
    }

    if (isBabyPlan) {
      return {
        title: "Need more slips this month?",
        body: "Big Billy is built for heavy receipt/payslip users — more volume, less hassle.",
        cta: "Upgrade Big Billy",
        cta2: "View plan details",
      };
    }

    return null;
  }, [view, isFreePlan, isBabyPlan]);

  return view.kind === "boot" ? (
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
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <LogoMark />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "clamp(17px, 4.2vw, 21px)", fontWeight: 950, letterSpacing: -0.3 }}>
                    {pageTitle}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 13, color: BRAND.muted, lineHeight: 1.55 }}>
                    Downloads open in browser (works better than LINE in-chat).
                  </div>
                </div>
              </div>

              {view.kind === "ready" && (
                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Pill>
                    Plan: <span style={{ marginLeft: 6 }}>{titleCasePlan(view.who.plan_key)}</span>
                  </Pill>
                  <Pill>
                    Role: <span style={{ marginLeft: 6 }}>{view.who.role}</span>
                  </Pill>
                  {view.who.current_period_end && (
                    <Pill>
                      Renews:{" "}
                      <span style={{ marginLeft: 6 }}>
                        {new Date(view.who.current_period_end).toLocaleDateString()}
                      </span>
                    </Pill>
                  )}
                </div>
              )}
            </div>

            {view.kind === "ready" && (
              <TabPills
                active={activeTab}
                onChange={setActiveTab}
                canOwner={view.who.role === "owner"}
              />
            )}
          </div>

          {/* States */}
          {view.kind === "link-needed" && (
            <>
              <Divider />
              <div style={{ fontSize: 13, color: BRAND.ink, whiteSpace: "pre-line" }}>{view.message}</div>
              <div style={{ marginTop: 12 }}>
                <Button variant="ghost" onClick={() => openExternal("https://line.me")}>
                  Open LINE
                </Button>
              </div>
            </>
          )}

          {view.kind === "error" && (
            <>
              <Divider />
              <div
                style={{
                  fontSize: 13,
                  color: "#9a3412",
                  whiteSpace: "pre-line",
                  background: "rgba(255, 237, 213, 0.7)",
                  border: "1px solid rgba(253, 186, 116, 0.6)",
                  padding: "10px 12px",
                  borderRadius: 12,
                  fontWeight: 800,
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
              <Divider />

              {/* Account (collapsed) */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAccount((v) => !v)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 14,
                    border: `1px solid ${BRAND.border}`,
                    background: "rgba(255,255,255,0.9)",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <div style={{ fontSize: 13, fontWeight: 950, color: BRAND.ink }}>Account</div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: BRAND.muted }}>
                      {showAccount ? "Hide" : "Show"}
                    </div>
                  </div>
                  <div style={{ marginTop: 4, fontSize: 12, color: BRAND.muted }}>
                    Workspace, role, and plan details.
                  </div>
                </button>

                {showAccount && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: 12,
                      borderRadius: 14,
                      border: "1px solid rgba(15, 23, 42, 0.06)",
                      background: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    <SummaryList
                      items={[
                        { label: "Workspace", value: shortId(view.who.workspace_id) },
                        { label: "Role", value: view.who.role },
                        { label: "Plan", value: titleCasePlan(view.who.plan_key) },
                        { label: "Status", value: view.who.status },
                      ]}
                    />
                    {view.who.role !== "owner" && (
                      <div style={{ marginTop: 10, fontSize: 12, color: BRAND.muted }}>
                        Only the workspace <b>owner</b> can export and manage billing.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Upsell (owner only) */}
              {upsell && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 14,
                    borderRadius: 16,
                    border: "1px solid rgba(249, 115, 22, 0.22)",
                    background: BRAND.soft,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 950, color: BRAND.orangeDeep }}>{upsell.title}</div>
                  <div style={{ marginTop: 6, fontSize: 12, color: BRAND.muted, lineHeight: 1.6 }}>
                    {upsell.body}
                  </div>
                  <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                    <Button disabled={!canOwner || busy} onClick={() => openCheckout("big")}>
                      {upsell.cta}
                    </Button>

                    <Button
                      variant="secondary"
                      disabled={!canOwner || busy || isBabyPlan}
                      onClick={() => openCheckout("baby")}
                    >
                      {isBabyPlan ? "Current: Baby Billy" : upsell.cta2}
                    </Button>
                  </div>
                </div>
              )}

              {/* Tab content */}
              {activeTab === "billing" ? (
                <>
                  <Divider />
                  {view.who.role !== "owner" ? (
                    <LockScreen
                      title="Billing is owner-only 🔒"
                      desc={"Ask your workspace owner to upgrade or manage billing."}
                      onOpenBilling={() => setActiveTab("export")}
                    />
                  ) : (
                    <>
                      <div style={{ fontSize: 11, color: BRAND.muted, fontWeight: 950, marginBottom: 8 }}>
                        Billing actions
                      </div>

                      <div style={{ display: "grid", gap: 10 }}>
                        <Button disabled={!canOwner || busy} onClick={() => openCheckout("big")}>
                          Upgrade Big Billy
                        </Button>

                        <Button
                          variant="secondary"
                          disabled={!canOwner || busy || isBabyPlan}
                          onClick={() => openCheckout("baby")}
                        >
                          {isBabyPlan ? "Current: Baby Billy" : "Upgrade Baby Billy"}
                        </Button>
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <button
                          type="button"
                          onClick={openPortal}
                          disabled={!canOwner || busy}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid rgba(15, 23, 42, 0.10)",
                            background: "rgba(255,255,255,0.9)",
                            color: BRAND.muted,
                            fontSize: 12,
                            fontWeight: 900,
                            cursor: !canOwner || busy ? "not-allowed" : "pointer",
                            opacity: !canOwner || busy ? 0.6 : 1,
                            textAlign: "center",
                          }}
                        >
                          Manage in Stripe Portal (opens browser)
                        </button>
                      </div>

                      <div style={{ marginTop: 10 }}>
                        <button
                          type="button"
                          onClick={() => setShowPlanDetails((v) => !v)}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: 12,
                            border: "1px solid rgba(15, 23, 42, 0.08)",
                            background: "transparent",
                            color: BRAND.muted,
                            fontSize: 12,
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          {showPlanDetails ? "Hide plan details" : "Plan details"}
                        </button>
                      </div>

                      {showPlanDetails && (
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
                          <div style={{ color: BRAND.ink, fontWeight: 950 }}>
                            Current plan: {planLabel || titleCasePlan(view.who.plan_key)}
                          </div>
                          <div style={{ marginTop: 6 }}>Baby Billy: 50 slips/month</div>
                          <div>Big Billy: 200 slips/month</div>
                          <div style={{ marginTop: 6, fontSize: 11 }}>
                            Tip: Upgrading increases monthly OCR limits.
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Export Center */}
                  <Divider />
                  {view.who.role !== "owner" ? (
                    <LockScreen
                      title="Export is owner-only 🔒"
                      desc={
                        "This workspace is protected.\n\nOnly the owner can export CSV or ZIP files."
                      }
                      onOpenBilling={() => setActiveTab("billing")}
                    />
                  ) : (
                    <>
                      {/* Date Range */}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 12, color: BRAND.muted, fontWeight: 900 }}>Start date</label>
                          <input
                            type="date"
                            value={exportStart}
                            onChange={(e) => setExportStart(e.target.value)}
                            style={{
                              width: "100%",
                              marginTop: 6,
                              padding: "9px 10px",
                              borderRadius: 12,
                              border: "1px solid rgba(15, 23, 42, 0.12)",
                              fontSize: 13,
                              minWidth: 140,
                            }}
                          />
                        </div>

                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 12, color: BRAND.muted, fontWeight: 900 }}>End date</label>
                          <input
                            type="date"
                            value={exportEnd}
                            onChange={(e) => setExportEnd(e.target.value)}
                            style={{
                              width: "100%",
                              marginTop: 6,
                              padding: "9px 10px",
                              borderRadius: 12,
                              border: "1px solid rgba(15, 23, 42, 0.12)",
                              fontSize: 13,
                              minWidth: 140,
                            }}
                          />
                        </div>
                      </div>

                      {/* Quick range chips */}
                      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        {[
                          {
                            label: "This month",
                            onClick: () => {
                              const d = new Date();
                              const start = new Date(d.getFullYear(), d.getMonth(), 1);
                              setExportStart(toISODateLocal(start));
                              setExportEnd(toISODateLocal(d));
                            },
                          },
                          {
                            label: "Last 30 days",
                            onClick: () => {
                              const d = new Date();
                              const start = new Date(d.getTime() - 29 * 24 * 60 * 60 * 1000);
                              setExportStart(toISODateLocal(start));
                              setExportEnd(toISODateLocal(d));
                            },
                          },
                          {
                            label: "All time",
                            onClick: () => {
                              setExportStart("");
                              setExportEnd("");
                            },
                          },
                        ].map((x) => (
                          <button
                            key={x.label}
                            type="button"
                            onClick={x.onClick}
                            style={{
                              padding: "7px 11px",
                              borderRadius: 999,
                              border: "1px solid rgba(15, 23, 42, 0.12)",
                              fontSize: 12,
                              background: "rgba(255,255,255,0.9)",
                              cursor: "pointer",
                              fontWeight: 900,
                            }}
                          >
                            {x.label}
                          </button>
                        ))}

                        {!isValidDateRange(exportStart, exportEnd) && (
                          <span style={{ fontSize: 12, color: "#9a3412", fontWeight: 900 }}>
                            Start date must be before end date
                          </span>
                        )}
                      </div>

                      {/* ZIP Primary tile */}
                      <div
                        style={{
                          marginTop: 14,
                          padding: 14,
                          borderRadius: 16,
                          border: "1px solid rgba(249, 115, 22, 0.20)",
                          background: BRAND.soft,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 950, color: BRAND.ink }}>Receipts & Payslips (ZIP)</div>
                            <div style={{ marginTop: 4, fontSize: 12, color: BRAND.muted, lineHeight: 1.55 }}>
                              Premium download. We’ll DM you when it’s ready.
                            </div>
                          </div>
                          <Pill>ZIP</Pill>
                        </div>

                        {/* Minimal “after click” view */}
                        {(zipStatus === "creating" || zipStatus === "processing" || zipStatus === "background") && zipJobId ? (
                          <div
                            style={{
                              marginTop: 12,
                              padding: "10px 12px",
                              borderRadius: 14,
                              border: "1px solid rgba(249, 115, 22, 0.22)",
                              background: "rgba(255, 255, 255, 0.65)",
                            }}
                          >
                            <div style={{ fontSize: 12, fontWeight: 950, color: BRAND.orangeDeep, lineHeight: 1.6 }}>
                              ✅ You can close this page — I’ll DM you when it’s ready.
                            </div>

                            <div style={{ marginTop: 8, fontSize: 11, color: BRAND.muted, fontWeight: 900 }}>
                              Job:{" "}
                              <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
                                {zipJobId}
                              </span>
                            </div>

                            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                              <Button
                                variant="secondary"
                                disabled={exportBusy !== null}
                                onClick={() => {
                                  if (!zipJobId) return;
                                  setZipStatus("processing");
                                  setExportError(null);
                                  pollZipStatus(zipJobId).catch((e) => {
                                    setZipStatus("error");
                                    setExportError(e?.message ?? String(e));
                                  });
                                }}
                              >
                                Check status
                              </Button>

                              {zipStatus === "background" && (
                                <div style={{ fontSize: 12, color: BRAND.muted, fontWeight: 800, lineHeight: 1.6 }}>
                                  Still packing in background. No action needed.
                                </div>
                              )}
                            </div>
                          </div>
                        ) : zipStatus === "ready" ? (
                          <div
                            style={{
                              marginTop: 12,
                              padding: "10px 12px",
                              borderRadius: 14,
                              border: "1px solid rgba(15, 23, 42, 0.10)",
                              background: "rgba(255,255,255,0.9)",
                              color: BRAND.ink,
                              fontSize: 12,
                              fontWeight: 950,
                              lineHeight: 1.55,
                            }}
                          >
                            ✅ ZIP is ready. Download opens in your browser.
                          </div>
                        ) : null}

                        <div style={{ marginTop: 12 }}>
                          <Button
                            disabled={
                              exportBusy !== null ||
                              zipStatus === "creating" ||
                              zipStatus === "processing" ||
                              !isValidDateRange(exportStart, exportEnd)
                            }
                            onClick={createZipJob}
                          >
                            {zipStatus === "idle" && "Download receipts (ZIP)"}
                            {zipStatus === "creating" && "Starting…"}
                            {zipStatus === "processing" && "Packing…"}
                            {zipStatus === "background" && "Packing in background…"}
                            {zipStatus === "ready" && "Create another ZIP"}
                            {zipStatus === "error" && "Retry ZIP export"}
                          </Button>
                        </div>

                        {/* ✅ Ready actions (minimal + premium) */}
                        {zipStatus === "ready" && zipUrl && (
                          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                            <button
                              type="button"
                              onClick={() => openExternal(zipUrl)}
                              style={{
                                padding: "12px",
                                borderRadius: 12,
                                border: "1px solid rgba(249, 115, 22, 0.35)",
                                background: "rgba(255, 255, 255, 0.85)",
                                fontSize: 13,
                                fontWeight: 950,
                                color: BRAND.orangeDeep,
                                cursor: "pointer",
                                textAlign: "center",
                              }}
                            >
                              ⬇️ Download ZIP (opens browser)
                            </button>

                            {/* Copy link as a clean tappable text row (not a big button) */}
                            <TinyLinkRow
                              label={zipCopied ? "Copied ✅" : "Tap to copy link"}
                              value={zipUrl}
                              hint="Use this only if download has issues."
                              onClick={async () => {
                                const ok = await copyToClipboard(zipUrl);
                                setZipCopied(ok);
                                setToast(ok ? "Copied ZIP link ✅" : "Copy failed");
                              }}
                            />
                          </div>
                        )}

                        <div style={{ marginTop: 12 }}>
                          <button
                            type="button"
                            onClick={() => setShowExportHelp((v) => !v)}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: 12,
                              border: "1px solid rgba(15, 23, 42, 0.08)",
                              background: "transparent",
                              color: BRAND.muted,
                              fontSize: 12,
                              fontWeight: 900,
                              cursor: "pointer",
                            }}
                          >
                            {showExportHelp ? "Hide help" : "Help"}
                          </button>

                          {showExportHelp && (
                            <div
                              style={{
                                marginTop: 10,
                                padding: 12,
                                borderRadius: 14,
                                border: "1px solid rgba(15, 23, 42, 0.08)",
                                background: "rgba(255, 255, 255, 0.85)",
                                fontSize: 12,
                                color: BRAND.muted,
                                lineHeight: 1.65,
                              }}
                            >
                              <div style={{ fontWeight: 950, color: BRAND.ink }}>Export tips</div>
                              <div style={{ marginTop: 6 }}>
                                • ZIP is prepared in the background and delivered via LINE button.
                                <br />
                                • If download looks blank in LINE, open Export Center and it will launch browser.
                                <br />
                                • If it’s huge, try narrowing the date range.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CSV Secondary tile */}
                      <div
                        style={{
                          marginTop: 10,
                          padding: 14,
                          borderRadius: 16,
                          border: "1px solid rgba(15, 23, 42, 0.08)",
                          background: "rgba(255, 255, 255, 0.85)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 950, color: BRAND.ink }}>
                              Transactions (CSV)
                            </div>
                            <div style={{ marginTop: 4, fontSize: 12, color: BRAND.muted, lineHeight: 1.55 }}>
                              Fast download. No images.
                            </div>
                          </div>
                          <Pill>CSV</Pill>
                        </div>

                        <div style={{ marginTop: 12 }}>
                          <Button
                            variant="secondary"
                            disabled={exportBusy !== null || !isValidDateRange(exportStart, exportEnd)}
                            onClick={exportCsv}
                          >
                            {exportBusy === "csv" ? "Cooking CSV…" : "Download transactions (CSV)"}
                          </Button>
                        </div>
                      </div>

                      {exportError && (
                        <div
                          style={{
                            marginTop: 12,
                            fontSize: 12,
                            color: "#9a3412",
                            whiteSpace: "pre-line",
                            background: "rgba(255, 237, 213, 0.7)",
                            border: "1px solid rgba(253, 186, 116, 0.6)",
                            padding: "10px 12px",
                            borderRadius: 12,
                            fontWeight: 950,
                          }}
                        >
                          {exportError}
                        </div>
                      )}

                      {toast && (
                        <div
                          style={{
                            marginTop: 12,
                            fontSize: 12,
                            color: BRAND.ink,
                            background: BRAND.soft,
                            border: "1px solid rgba(249, 115, 22, 0.22)",
                            padding: "10px 12px",
                            borderRadius: 12,
                            fontWeight: 950,
                            textAlign: "center",
                          }}
                        >
                          {toast}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
