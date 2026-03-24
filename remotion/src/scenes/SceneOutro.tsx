import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, soraFont, interFont } from "../fonts";

export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoS = spring({ frame, fps, config: { damping: 10, stiffness: 80 } });
  const titleS = spring({ frame: frame - 15, fps, config: { damping: 15 } });

  const features = [
    "Real-Time Dashboard",
    "Smart POS Terminal",
    "Inventory Management",
    "Split Payments",
    "Crate Tracking",
    "Credit Management",
    "Customer Database",
    "Staff & Roles",
  ];

  const urlOp = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const urlScale = spring({ frame: frame - 60, fps, config: { damping: 12 } });

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: 100 + (i * 97) % 1720,
    y: 80 + (i * 53) % 920,
    size: 3 + (i % 5) * 2,
    drift: Math.sin((frame + i * 25) * 0.025) * 15,
    driftY: Math.cos((frame + i * 18) * 0.02) * 10,
    op: 0.1 + (i % 4) * 0.08,
  }));

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% 50%, ${COLORS.primaryGlow} 0%, ${COLORS.bg} 60%)`,
    }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x + p.drift, top: p.y + p.driftY,
          width: p.size, height: p.size, borderRadius: "50%",
          background: i % 3 === 0 ? COLORS.primary : i % 3 === 1 ? COLORS.accent : COLORS.warning,
          opacity: p.op,
        }} />
      ))}

      {/* Logo */}
      <div style={{
        position: "absolute", left: "50%", top: "22%",
        transform: `translate(-50%, -50%) scale(${logoS})`,
      }}>
        <div style={{
          width: 90, height: 90, borderRadius: 22,
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 20px 60px ${COLORS.primaryGlow}`,
        }}>
          <span style={{ fontSize: 44, fontWeight: 800, color: "white", fontFamily: soraFont }}>L</span>
        </div>
      </div>

      {/* Title */}
      <div style={{
        position: "absolute", left: "50%", top: "35%",
        transform: `translate(-50%, 0) translateY(${interpolate(titleS, [0, 1], [30, 0])}px)`,
        opacity: titleS, textAlign: "center",
      }}>
        <h1 style={{ fontFamily: soraFont, fontSize: 60, fontWeight: 800, color: COLORS.text }}>
          Lantid Store
        </h1>
        <p style={{ fontFamily: interFont, fontSize: 22, color: COLORS.textMuted, marginTop: 8 }}>
          Everything you need to run your store
        </p>
      </div>

      {/* Feature grid */}
      <div style={{
        position: "absolute", left: "50%", top: "55%",
        transform: "translateX(-50%)",
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14,
        width: 900,
      }}>
        {features.map((f, i) => {
          const s = spring({ frame: frame - 30 - i * 4, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{
              padding: "14px 16px", borderRadius: 12, textAlign: "center",
              background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
              transform: `scale(${s})`, opacity: s,
            }}>
              <span style={{ fontFamily: interFont, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{f}</span>
            </div>
          );
        })}
      </div>

      {/* URL */}
      <div style={{
        position: "absolute", left: "50%", bottom: "12%",
        transform: `translate(-50%, 0) scale(${urlScale})`,
        opacity: urlOp,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          padding: "16px 40px", borderRadius: 40,
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          boxShadow: `0 12px 40px ${COLORS.primaryGlow}`,
        }}>
          <span style={{ fontFamily: soraFont, fontSize: 26, fontWeight: 700, color: "white" }}>
            www.lantid.store
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
