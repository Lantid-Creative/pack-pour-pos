import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, soraFont, interFont } from "../fonts";

export const SceneCrates: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const crateProducts = [
    { name: "Coca-Cola Crate", total: 50, filled: 32, empty: 18 },
    { name: "Guinness Crate", total: 30, filled: 18, empty: 12 },
    { name: "Star Lager Crate", total: 40, filled: 28, empty: 12 },
  ];

  const deposits = [
    { product: "Coca-Cola", crates: 5, brought: 3, owed: 2, deposit: "₦1,000", status: "pending" },
    { product: "Guinness", crates: 3, brought: 3, owed: 0, deposit: "₦0", status: "returned" },
    { product: "Star Lager", crates: 4, brought: 0, owed: 4, deposit: "₦2,000", status: "pending" },
  ];

  // Flow diagram
  const flowStep = (delay: number) => spring({ frame: frame - delay, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <div style={{ position: "absolute", left: 80, top: 50, opacity: titleOp }}>
        <div style={{
          display: "inline-flex", padding: "6px 16px", borderRadius: 20,
          background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)",
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 13, fontWeight: 600, color: COLORS.warning, textTransform: "uppercase", letterSpacing: 2 }}>
            Crate Management
          </span>
        </div>
        <h2 style={{ fontFamily: soraFont, fontSize: 48, fontWeight: 800, color: COLORS.text, marginTop: 12 }}>
          Track Crates & Deposits
        </h2>
        <p style={{ fontFamily: interFont, fontSize: 20, color: COLORS.textMuted, marginTop: 12, maxWidth: 700, lineHeight: 1.6 }}>
          Mark products as crate-based, set deposit fees, and track empty vs filled crates. Customers who bring their own crates skip the deposit entirely.
        </p>
      </div>

      {/* Crate inventory cards */}
      <div style={{
        position: "absolute", left: 80, top: 280,
        display: "flex", gap: 20,
      }}>
        {crateProducts.map((cp, i) => {
          const s = spring({ frame: frame - 25 - i * 8, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{
              width: 260, background: COLORS.bgCard, borderRadius: 16, padding: 24,
              border: `1px solid ${COLORS.border}`, transform: `scale(${s})`, opacity: s,
            }}>
              <p style={{ fontFamily: interFont, fontSize: 16, fontWeight: 700, color: COLORS.text }}>{cp.name}</p>
              <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <p style={{ fontFamily: soraFont, fontSize: 28, fontWeight: 800, color: COLORS.text }}>{cp.total}</p>
                  <p style={{ fontFamily: interFont, fontSize: 11, color: COLORS.textMuted }}>TOTAL</p>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <p style={{ fontFamily: soraFont, fontSize: 28, fontWeight: 800, color: COLORS.primary }}>{cp.filled}</p>
                  <p style={{ fontFamily: interFont, fontSize: 11, color: COLORS.textMuted }}>FILLED</p>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <p style={{ fontFamily: soraFont, fontSize: 28, fontWeight: 800, color: COLORS.warning }}>{cp.empty}</p>
                  <p style={{ fontFamily: interFont, fontSize: 11, color: COLORS.textMuted }}>EMPTY</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit tracking table */}
      <div style={{
        position: "absolute", left: 80, right: 80, top: 520,
        background: COLORS.bgCard, borderRadius: 16, overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
        opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ padding: "14px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
          <span style={{ fontFamily: interFont, fontSize: 15, fontWeight: 700, color: COLORS.text }}>Active Deposits</span>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px",
          padding: "10px 24px", borderBottom: `1px solid ${COLORS.border}`,
        }}>
          {["Product", "Crates", "Brought", "Owed", "Deposit", "Status"].map(h => (
            <span key={h} style={{ fontFamily: interFont, fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>
        {deposits.map((d, i) => {
          const rowS = spring({ frame: frame - 70 - i * 6, fps, config: { damping: 18 } });
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px",
              padding: "12px 24px", borderBottom: `1px solid ${COLORS.border}`,
              opacity: rowS,
            }}>
              <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.text }}>{d.product}</span>
              <span style={{ fontFamily: interFont, fontSize: 14, color: COLORS.text }}>{d.crates}</span>
              <span style={{ fontFamily: interFont, fontSize: 14, color: COLORS.primary }}>{d.brought}</span>
              <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 700, color: d.owed > 0 ? COLORS.warning : COLORS.primary }}>{d.owed}</span>
              <span style={{ fontFamily: soraFont, fontSize: 14, fontWeight: 700, color: COLORS.text }}>{d.deposit}</span>
              <span style={{
                fontFamily: interFont, fontSize: 11, fontWeight: 700,
                color: d.status === "pending" ? COLORS.warning : COLORS.primary,
                textTransform: "uppercase",
              }}>{d.status}</span>
            </div>
          );
        })}
      </div>

      {/* Callout */}
      <div style={{
        position: "absolute", right: 100, top: 100,
        opacity: interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        background: COLORS.bgCard, borderRadius: 12, padding: "12px 20px",
        border: `1px solid ${COLORS.warning}44`,
      }}>
        <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.warning }}>
          ✦ No deposit when customer brings crates
        </span>
      </div>
    </AbsoluteFill>
  );
};
