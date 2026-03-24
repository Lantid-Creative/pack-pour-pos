import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, soraFont, interFont } from "../fonts";

export const SceneCredit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const creditSales = [
    { customer: "Emeka Johnson", total: "₦15,800", paid: "₦5,000", balance: "₦10,800", status: "partial" },
    { customer: "Aisha Mohammed", total: "₦8,400", paid: "₦0", balance: "₦8,400", status: "unpaid" },
    { customer: "Chidi Okafor", total: "₦22,600", paid: "₦22,600", balance: "₦0", status: "paid" },
    { customer: "Fatima Bello", total: "₦6,200", paid: "₦6,200", balance: "₦0", status: "paid" },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <div style={{ position: "absolute", left: 80, top: 50, opacity: titleOp }}>
        <div style={{
          display: "inline-flex", padding: "6px 16px", borderRadius: 20,
          background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 13, fontWeight: 600, color: COLORS.danger, textTransform: "uppercase", letterSpacing: 2 }}>
            Credit Sales
          </span>
        </div>
        <h2 style={{ fontFamily: soraFont, fontSize: 48, fontWeight: 800, color: COLORS.text, marginTop: 12 }}>
          Credit Management
        </h2>
        <p style={{ fontFamily: interFont, fontSize: 20, color: COLORS.textMuted, marginTop: 12, maxWidth: 700, lineHeight: 1.6 }}>
          Allow customers to buy on credit. Track unpaid balances, record partial or full payments, and maintain a complete payment history for every transaction.
        </p>
      </div>

      {/* Credit sales cards */}
      <div style={{
        position: "absolute", left: 80, right: 80, top: 280,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
      }}>
        {creditSales.map((sale, i) => {
          const s = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 14 } });
          const statusColor = sale.status === "paid" ? COLORS.primary : sale.status === "partial" ? COLORS.warning : COLORS.danger;
          return (
            <div key={i} style={{
              background: COLORS.bgCard, borderRadius: 16, padding: 28,
              border: `1px solid ${COLORS.border}`,
              transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
              opacity: s,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <p style={{ fontFamily: interFont, fontSize: 18, fontWeight: 700, color: COLORS.text }}>{sale.customer}</p>
                </div>
                <span style={{
                  fontFamily: interFont, fontSize: 11, fontWeight: 700,
                  color: statusColor, textTransform: "uppercase",
                  padding: "4px 12px", borderRadius: 20,
                  background: `${statusColor}15`,
                }}>{sale.status}</span>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                <div>
                  <p style={{ fontFamily: interFont, fontSize: 12, color: COLORS.textMuted }}>Total</p>
                  <p style={{ fontFamily: soraFont, fontSize: 20, fontWeight: 700, color: COLORS.text }}>{sale.total}</p>
                </div>
                <div>
                  <p style={{ fontFamily: interFont, fontSize: 12, color: COLORS.textMuted }}>Paid</p>
                  <p style={{ fontFamily: soraFont, fontSize: 20, fontWeight: 700, color: COLORS.primary }}>{sale.paid}</p>
                </div>
                <div>
                  <p style={{ fontFamily: interFont, fontSize: 12, color: COLORS.textMuted }}>Balance</p>
                  <p style={{ fontFamily: soraFont, fontSize: 20, fontWeight: 700, color: sale.balance === "₦0" ? COLORS.primary : COLORS.danger }}>{sale.balance}</p>
                </div>
              </div>
              {sale.status !== "paid" && (
                <div style={{
                  marginTop: 16, padding: "10px 0", borderRadius: 10, textAlign: "center",
                  background: COLORS.bgMuted, border: `1px solid ${COLORS.border}`,
                  fontFamily: interFont, fontSize: 13, fontWeight: 600, color: COLORS.text,
                }}>
                  Record Payment
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Flow callouts */}
      <div style={{
        position: "absolute", left: 80, bottom: 60,
        display: "flex", gap: 20,
        opacity: interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        {[
          { text: "Cashier selects customer at checkout", color: COLORS.accent },
          { text: "Admin sees all unpaid balances", color: COLORS.warning },
          { text: "Full payment history is preserved", color: COLORS.primary },
        ].map((c, i) => (
          <div key={i} style={{
            background: COLORS.bgCard, borderRadius: 12, padding: "12px 20px",
            border: `1px solid ${c.color}44`,
          }}>
            <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: c.color }}>✦ {c.text}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
