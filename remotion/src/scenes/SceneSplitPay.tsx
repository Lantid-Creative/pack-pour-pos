import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, soraFont, interFont } from "../fonts";

export const SceneSplitPay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Split payment card
  const cardS = spring({ frame: frame - 20, fps, config: { damping: 14 } });

  // Individual splits animate in
  const splits = [
    { method: "CASH", amount: 12000, color: COLORS.primary },
    { method: "TRANSFER", amount: 5000, color: COLORS.accent },
    { method: "CREDIT", amount: 3200, color: COLORS.warning },
  ];

  // Receipt preview
  const receiptOp = interpolate(frame, [90, 115], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const receiptX = interpolate(frame, [90, 115], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <div style={{ position: "absolute", left: 80, top: 60, opacity: titleOp }}>
        <div style={{
          display: "inline-flex", padding: "6px 16px", borderRadius: 20,
          background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)",
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 13, fontWeight: 600, color: COLORS.warning, textTransform: "uppercase", letterSpacing: 2 }}>
            Split Payments
          </span>
        </div>
        <h2 style={{ fontFamily: soraFont, fontSize: 48, fontWeight: 800, color: COLORS.text, marginTop: 12 }}>
          Flexible Payment Options
        </h2>
        <p style={{ fontFamily: interFont, fontSize: 20, color: COLORS.textMuted, marginTop: 12, maxWidth: 600, lineHeight: 1.6 }}>
          Customers can pay with up to 4 methods in a single transaction. Part cash, part transfer? No problem. Even include a credit portion.
        </p>
      </div>

      {/* Split payment demo card */}
      <div style={{
        position: "absolute", left: 100, top: 320, width: 700,
        background: COLORS.bgCard, borderRadius: 20, padding: 36,
        border: `1px solid ${COLORS.border}`,
        transform: `scale(${cardS})`, opacity: cardS,
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
          <span style={{ fontFamily: soraFont, fontSize: 18, fontWeight: 700, color: COLORS.text }}>Split Payment</span>
          <span style={{ fontFamily: soraFont, fontSize: 18, fontWeight: 700, color: COLORS.textMuted }}>Total: ₦20,200</span>
        </div>

        {splits.map((s, i) => {
          const splitS = spring({ frame: frame - 40 - i * 12, fps, config: { damping: 15 } });
          const barWidth = interpolate(splitS, [0, 1], [0, (s.amount / 20200) * 100]);
          return (
            <div key={i} style={{
              marginBottom: 20, opacity: splitS,
              transform: `translateX(${interpolate(splitS, [0, 1], [40, 0])}px)`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    padding: "4px 14px", borderRadius: 6,
                    background: s.color, fontFamily: interFont,
                    fontSize: 12, fontWeight: 700, color: "white",
                  }}>{s.method}</div>
                </div>
                <span style={{ fontFamily: soraFont, fontSize: 22, fontWeight: 700, color: COLORS.text }}>
                  ₦{s.amount.toLocaleString()}
                </span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: COLORS.bgMuted }}>
                <div style={{ height: "100%", borderRadius: 3, background: s.color, width: `${barWidth}%` }} />
              </div>
            </div>
          );
        })}

        <div style={{
          display: "flex", justifyContent: "center", marginTop: 12,
          padding: "4px 0",
        }}>
          <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.primary }}>
            ✓ Fully Allocated
          </span>
        </div>
      </div>

      {/* Receipt preview */}
      <div style={{
        position: "absolute", right: 100, top: 260, width: 480,
        background: "#fafaf8", borderRadius: 16, padding: 36,
        color: "#111", opacity: receiptOp,
        transform: `translateX(${receiptX}px)`,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontFamily: soraFont, fontSize: 20, fontWeight: 800 }}>LANTID STORE</p>
          <p style={{ fontFamily: interFont, fontSize: 12, color: "#666", marginTop: 4 }}>Receipt Preview</p>
        </div>
        <div style={{ borderTop: "1px dashed #ccc", borderBottom: "1px dashed #ccc", padding: "16px 0", marginBottom: 16 }}>
          {[
            { name: "Coca-Cola ×3", amount: "₦8,400" },
            { name: "Guinness ×2", amount: "₦8,400" },
            { name: "Star Lager ×1", amount: "₦3,400" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontFamily: interFont, fontSize: 14 }}>{item.name}</span>
              <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600 }}>{item.amount}</span>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: interFont, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Payment Breakdown:</p>
          {splits.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: interFont, fontSize: 13, color: "#555" }}>{s.method}</span>
              <span style={{ fontFamily: interFont, fontSize: 13, fontWeight: 600 }}>₦{s.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed #ccc", paddingTop: 12 }}>
          <span style={{ fontFamily: soraFont, fontSize: 18, fontWeight: 800 }}>TOTAL</span>
          <span style={{ fontFamily: soraFont, fontSize: 18, fontWeight: 800 }}>₦20,200</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
