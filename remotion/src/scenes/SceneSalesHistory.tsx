import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, soraFont, interFont } from "../fonts";

export const SceneSalesHistory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const sales = [
    { id: "#A2F4D1", time: "2:45 PM", cashier: "Ibrahim", items: 5, total: "₦18,600", method: "Cash", color: COLORS.primary },
    { id: "#B7E3C2", time: "2:32 PM", cashier: "Ngozi", items: 3, total: "₦12,400", method: "POS", color: COLORS.accent },
    { id: "#C9D1B8", time: "2:18 PM", cashier: "Ibrahim", items: 8, total: "₦34,200", method: "Split", color: COLORS.warning },
    { id: "#D4A2E7", time: "1:55 PM", cashier: "Ngozi", items: 2, total: "₦7,800", method: "Transfer", color: COLORS.accent },
    { id: "#E1F5C3", time: "1:40 PM", cashier: "Ibrahim", items: 6, total: "₦25,100", method: "Credit", color: COLORS.danger },
    { id: "#F3B4D9", time: "1:22 PM", cashier: "Ngozi", items: 4, total: "₦16,000", method: "Cash", color: COLORS.primary },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <div style={{ position: "absolute", left: 80, top: 50, opacity: titleOp }}>
        <div style={{
          display: "inline-flex", padding: "6px 16px", borderRadius: 20,
          background: COLORS.primaryGlow, border: `1px solid ${COLORS.primary}33`,
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 13, fontWeight: 600, color: COLORS.primary, textTransform: "uppercase", letterSpacing: 2 }}>
            Sales History
          </span>
        </div>
        <h2 style={{ fontFamily: soraFont, fontSize: 48, fontWeight: 800, color: COLORS.text, marginTop: 12 }}>
          Complete Sales Records
        </h2>
        <p style={{ fontFamily: interFont, fontSize: 20, color: COLORS.textMuted, marginTop: 12, maxWidth: 700, lineHeight: 1.6 }}>
          View every transaction with full details — items sold, payment method breakdowns, cashier info, and timestamps. Filter by date, cashier, or payment type.
        </p>
      </div>

      {/* Sales table */}
      <div style={{
        position: "absolute", left: 80, right: 80, top: 270,
        background: COLORS.bgCard, borderRadius: 18, overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 0.7fr 1fr 1fr",
          padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`,
        }}>
          {["Sale ID", "Time", "Cashier", "Items", "Total", "Payment"].map(h => (
            <span key={h} style={{ fontFamily: interFont, fontSize: 12, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{h}</span>
          ))}
        </div>
        {sales.map((s, i) => {
          const rowS = spring({ frame: frame - 20 - i * 6, fps, config: { damping: 18 } });
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr 0.7fr 1fr 1fr",
              padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`,
              opacity: rowS, transform: `translateX(${interpolate(rowS, [0, 1], [-20, 0])}px)`,
            }}>
              <span style={{ fontFamily: interFont, fontSize: 14, color: COLORS.accent, fontWeight: 600 }}>{s.id}</span>
              <span style={{ fontFamily: interFont, fontSize: 14, color: COLORS.textMuted }}>{s.time}</span>
              <span style={{ fontFamily: interFont, fontSize: 14, color: COLORS.text }}>{s.cashier}</span>
              <span style={{ fontFamily: interFont, fontSize: 14, color: COLORS.text }}>{s.items}</span>
              <span style={{ fontFamily: soraFont, fontSize: 15, fontWeight: 700, color: COLORS.text }}>{s.total}</span>
              <span style={{
                fontFamily: interFont, fontSize: 12, fontWeight: 700,
                color: s.color, textTransform: "uppercase",
                display: "inline-block", padding: "3px 10px", borderRadius: 8,
                background: `${s.color}15`, width: "fit-content",
              }}>{s.method}</span>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div style={{
        position: "absolute", left: 80, bottom: 60,
        display: "flex", gap: 20,
        opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: "12px 20px", border: `1px solid ${COLORS.primary}44` }}>
          <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.primary }}>✦ Filter by date range, cashier, or method</span>
        </div>
        <div style={{ background: COLORS.bgCard, borderRadius: 12, padding: "12px 20px", border: `1px solid ${COLORS.accent}44` }}>
          <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.accent }}>✦ Print or share receipts anytime</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
