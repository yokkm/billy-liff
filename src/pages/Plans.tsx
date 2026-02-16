import { useState } from "react";

const BRAND = {
  orange: "#f97316",
  orangeDeep: "#c2410c",
  peach: "#fed7aa",
  ink: "#0f172a",
  muted: "#64748b",
  border: "rgba(15, 23, 42, 0.08)",
  soft: "rgba(255, 247, 237, 0.95)",
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: `1px solid ${BRAND.border}`,
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

function PillTabs({
  active,
  onChange,
}: {
  active: "en" | "th";
  onChange: (v: "en" | "th") => void;
}) {
  const items = [
    { key: "en" as const, label: "EN" },
    { key: "th" as const, label: "TH" },
  ];
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 6,
        padding: 4,
        borderRadius: 999,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        background: "rgba(255, 255, 255, 0.85)",
      }}
    >
      {items.map((t) => {
        const isActive = active === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: `1px solid ${isActive ? "rgba(249,115,22,0.35)" : "transparent"}`,
              background: isActive ? BRAND.soft : "transparent",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 900,
              color: BRAND.ink,
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 16, fontWeight: 950, color: BRAND.ink, marginTop: 12 }}>
      {children}
    </div>
  );
}

function Subtle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 6, fontSize: 12, color: BRAND.muted, lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

function PlanBlock({
  title,
  price,
  body,
  bullets,
  highlight,
  footer,
}: {
  title: string;
  price: string;
  body: string;
  bullets: string[];
  highlight?: boolean;
  footer?: string;
}) {
  return (
    <div
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 16,
        border: highlight ? "1px solid rgba(249, 115, 22, 0.25)" : "1px solid rgba(15, 23, 42, 0.08)",
        background: highlight ? BRAND.soft : "rgba(255, 255, 255, 0.9)",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 950, color: BRAND.ink }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 12, color: BRAND.muted }}>{body}</div>
      <div style={{ marginTop: 8, fontSize: 18, fontWeight: 950, color: BRAND.ink }}>{price}</div>
      <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
        {bullets.map((b) => (
          <div key={b} style={{ fontSize: 12, color: BRAND.ink, lineHeight: 1.5 }}>
            {b}
          </div>
        ))}
      </div>
      {footer && (
        <div style={{ marginTop: 10, fontSize: 12, color: BRAND.muted, lineHeight: 1.6 }}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default function Plans() {
  const [lang, setLang] = useState<"en" | "th">("en");

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(254, 215, 170, 0.55), rgba(255, 250, 244, 0.96) 55%, #ffffff 100%)",
        color: BRAND.ink,
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "22px 18px 36px" }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <LogoMark />
              <div>
                <div style={{ fontSize: 20, fontWeight: 950, letterSpacing: -0.3 }}>
                  {lang === "th" ? "💛 Billy Plans" : "💛 Billy Plans"}
                </div>
                <div style={{ marginTop: 4, fontSize: 12, color: BRAND.muted }}>
                  {lang === "th" ? "แผนเรียบง่ายสำหรับทุกคน" : "Simple plans for everyone"}
                </div>
              </div>
            </div>
            <PillTabs active={lang} onChange={setLang} />
          </div>

          {lang === "en" ? (
            <>
              <SectionTitle>Simple plans.</SectionTitle>
              <Subtle>No accounting terms. Just clear money records that feel right.</Subtle>

              <PlanBlock
                title="🆓 Free"
                price="0 THB / month"
                body="Try Billy. No pressure."
                bullets={[
                  "Best for: getting started with Billy",
                  "👤 Invite 1 member",
                  "🧾 Up to 20 entries / month",
                  "📷 Up to 20 scans / month",
                  "🗂️ View/export includes last 45 days",
                  "📷 Upload receipts or add by text",
                ]}
                footer="“Perfect for getting started.”"
              />

              <PlanBlock
                title="🌱 Baby Billy"
                price="199 THB / month"
                body="Everyday money, done right."
                bullets={[
                  "Best for: personal finance or small teams",
                  "👥 Invite up to 3 members",
                  "🧮 Invite 1 trusted accountant",
                  "🧾 Up to 100 entries / month",
                  "📷 Up to 100 scans / month",
                  "➕ Top-ups available for busy months",
                  "🗂️ View/export includes last 90 days",
                  "📷 Receipts, slips, text — all together",
                  "Why people choose Baby Billy",
                  "Enough space for real life",
                  "Calm collaboration",
                  "No pressure, no clutter",
                ]}
                footer="“Small team. Clear records.”"
              />

              <PlanBlock
                title="🐘 Big Billy"
                price="599 THB / month"
                body="When money matters more."
                bullets={[
                  "Best for: long-term visibility or serious volume",
                  "👥 Invite up to 5 members",
                  "🧮 Invite 1 trusted accountant",
                  "🧾 Up to 500 entries / month",
                  "📷 Up to 500 scans / month",
                  "🗂️ View/export includes last 365 days",
                  "📊 Full-year visibility",
                  "Why Big Billy",
                  "Long-term clarity",
                  "Serious volume",
                  "Peace of mind, all year round",
                ]}
                footer="“For people who take money seriously.”"
                highlight
              />

              <SectionTitle>➕ Top-ups (Baby only)</SectionTitle>
              <Subtle>
                Add extra quota for busy months. Top-ups add to both scan + confirmed usage for this month only.
                <br />
                • +50 entries — 99 THB
                <br />
                • +150 entries — 249 THB
              </Subtle>

              <SectionTitle>🧠 Good to know (All plans)</SectionTitle>
              <Subtle>
                Entries include receipts and text inputs. Members can upload. Owners confirm. No accounting jargon.
                No POS setup. No learning curve.
                <br />
                Scan processing follows your monthly plan.
                <br />
                “Just send it. Billy will sort it out.”
              </Subtle>

              <SectionTitle>🔄 Upgrade anytime</SectionTitle>
              <Subtle>
                Upgrade when life gets busier. Downgrade when things are quiet. No lock-in, no drama.
                <br />
                “Billy grows with you.”
              </Subtle>
            </>
          ) : (
            <>
              <SectionTitle>แผนเรียบง่าย</SectionTitle>
              <Subtle>ไม่ต้องรู้ศัพท์บัญชี แค่เก็บเรื่องเงินให้ชัด</Subtle>

              <PlanBlock
                title="🆓 Free"
                price="0 บาท / เดือน"
                body="ลองใช้ Billy แบบสบาย ๆ"
                bullets={[
                  "เหมาะสำหรับ: คนที่อยากลองใช้ Billy แบบสบาย ๆ",
                  "สิ่งที่ได้",
                  "👤 เชิญสมาชิกได้ 1 คน",
                  "🧾 บันทึกได้ 20 รายการ/เดือน",
                  "📷 สแกนได้สูงสุด 20 ครั้ง/เดือน",
                  "🗂️ ดูย้อนหลัง/ส่งออกได้ 45 วัน",
                  "📷 ส่งรูปใบเสร็จ หรือพิมพ์ข้อความ",
                ]}
                footer="“เหมาะสำหรับลองใช้ก่อนตัดสินใจ”"
              />

              <PlanBlock
                title="🌱 Baby Billy"
                price="199 บาท / เดือน"
                body="การเงินประจำวันแบบชัด ๆ"
                bullets={[
                  "เหมาะสำหรับ: การเงินส่วนตัว หรือทีมเล็ก ๆ ที่อยากจัดระเบียบ",
                  "สิ่งที่ได้",
                  "👥 เชิญสมาชิกได้สูงสุด 3 คน",
                  "🧮 เชิญนักบัญชีที่ไว้ใจได้ 1 คน",
                  "🧾 บันทึกได้ 100 รายการ/เดือน",
                  "📷 สแกนได้สูงสุด 100 ครั้ง/เดือน",
                  "➕ ซื้อท็อปอัปเพิ่มได้เมื่อใช้เยอะ",
                  "🗂️ ดูย้อนหลัง/ส่งออกได้ 90 วัน",
                  "📷 ใบเสร็จ สลิป ข้อความ — รวมไว้ที่เดียว",
                  "ทำไมคนเลือก Baby Billy",
                  "พื้นที่พอดีกับชีวิตจริง",
                  "ทำงานร่วมกันแบบไม่วุ่นวาย",
                  "ไม่รก ไม่กดดัน",
                ]}
                footer="“ทีมเล็ก แต่ข้อมูลชัด”"
              />

              <PlanBlock
                title="🐘 Big Billy"
                price="599 บาท / เดือน"
                body="เมื่อเรื่องเงินเริ่มจริงจัง"
                bullets={[
                  "เหมาะสำหรับ: คนที่อยากเห็นภาพการเงินระยะยาว หรือมีข้อมูลเยอะจริง ๆ",
                  "สิ่งที่ได้",
                  "👥 เชิญสมาชิกได้สูงสุด 5 คน",
                  "🧮 เชิญนักบัญชีที่ไว้ใจได้ 1 คน",
                  "🧾 บันทึกได้ 500 รายการ/เดือน",
                  "📷 สแกนได้สูงสุด 500 ครั้ง/เดือน",
                  "🗂️ ดูย้อนหลัง/ส่งออกได้ 365 วัน",
                  "📊 มองภาพการเงินทั้งปี",
                  "ทำไมต้อง Big Billy",
                  "เห็นภาพระยะยาว",
                  "รองรับข้อมูลเยอะ",
                  "สบายใจได้ทั้งปี",
                ]}
                footer="“สำหรับคนที่เอาเรื่องเงินจริงจัง”"
                highlight
              />

              <SectionTitle>➕ ท็อปอัป (เฉพาะ Baby)</SectionTitle>
              <Subtle>
                เพิ่มโควต้าเฉพาะเดือนนี้ ทั้งสแกน + ยืนยัน จะเพิ่มพร้อมกัน
                <br />
                • เพิ่ม 50 รายการ — 99 บาท
                <br />
                • เพิ่ม 150 รายการ — 249 บาท
              </Subtle>

              <SectionTitle>🧠 สิ่งที่ควรรู้ (ทุกแผน)</SectionTitle>
              <Subtle>
                รายการรวมถึงรูปใบเสร็จ/สลิป และข้อความ สมาชิกส่งได้ เจ้าของยืนยัน ไม่ต้องรู้ศัพท์บัญชี ไม่มี
                POS ไม่ต้องเรียนรู้อะไรเยอะ
                <br />
                โควต้าอ่านรูปเป็นไปตามแผนรายเดือน
                <br />
                “แค่ส่งมา เดี๋ยว Billy จัดการให้”
              </Subtle>

              <SectionTitle>🔄 อัปเกรดได้ตลอด</SectionTitle>
              <Subtle>
                อัปเกรดเมื่อชีวิตยุ่งขึ้น ดาวน์เกรดเมื่ออยากช้าลง ไม่มีสัญญาผูกมัด ไม่มีดราม่า
                <br />
                “Billy โตไปพร้อมคุณ”
              </Subtle>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
