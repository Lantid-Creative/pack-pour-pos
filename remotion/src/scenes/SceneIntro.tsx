import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, soraFont, interFont } from "../fonts";

export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 100 } });
  const logoRotate = interpolate(logoScale, [0, 1], [-15, 0]);
  const titleY = spring({ frame: frame - 15, fps, config: { damping: 15 } });
  const subtitleOp = interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleY = interpolate(frame, [35, 55], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const urlOp = interpolate(frame, [55, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const urlY = interpolate(frame, [55, 75], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Floating particles
  const particles = Array.from({ length: 12 }, (_, i) => {
    const x = 200 + i * 140;
    const y = 100 + (i % 3) * 300;
    const drift = Math.sin((frame + i * 30) * 0.03) * 20;
    const driftY = Math.cos((frame + i * 20) * 0.02) * 15;
    const size = 3 + (i % 4) * 2;
    const op = interpolate(frame, [i * 3, i * 3 + 20], [0, 0.3 + (i % 3) * 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { x: x + drift, y: y + driftY, size, op };
  });

  // Background gradient pulse
  const pulse = Math.sin(frame * 0.05) * 0.3 + 0.7;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${COLORS.primaryGlow} 0%, ${COLORS.bg} 70%)` }}>
      {/* Floating dots */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: p.x, top: p.y,
          width: p.size, height: p.size, borderRadius: "50%",
          background: i % 2 === 0 ? COLORS.primary : COLORS.accent,
          opacity: p.op,
        }} />
      ))}

      {/* Radial ring */}
      <div style={{
        position: "absolute", left: "50%", top: "42%",
        transform: `translate(-50%, -50%) scale(${logoScale * 1.5})`,
        width: 320, height: 320, borderRadius: "50%",
        border: `2px solid ${COLORS.primary}`,
        opacity: 0.15 * pulse,
      }} />
      <div style={{
        position: "absolute", left: "50%", top: "42%",
        transform: `translate(-50%, -50%) scale(${logoScale * 2})`,
        width: 320, height: 320, borderRadius: "50%",
        border: `1px solid ${COLORS.primary}`,
        opacity: 0.08 * pulse,
      }} />

      {/* Logo icon */}
      <div style={{
        position: "absolute", left: "50%", top: "32%",
        transform: `translate(-50%, -50%) scale(${logoScale}) rotate(${logoRotate}deg)`,
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: 24,
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 20px 60px ${COLORS.primaryGlow}`,
        }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: "white", fontFamily: soraFont }}>L</span>
        </div>
      </div>

      {/* Title */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: `translate(-50%, ${interpolate(titleY, [0, 1], [40, 0])}px)`,
        opacity: titleY,
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: soraFont, fontSize: 72, fontWeight: 800,
          color: COLORS.text, letterSpacing: -2,
          textShadow: `0 4px 30px ${COLORS.primaryGlow}`,
        }}>
          Lantid Store
        </h1>
      </div>

      {/* Subtitle */}
      <div style={{
        position: "absolute", left: "50%", top: "62%",
        transform: `translate(-50%, ${subtitleY}px)`,
        opacity: subtitleOp, textAlign: "center",
      }}>
        <p style={{
          fontFamily: interFont, fontSize: 28, fontWeight: 500,
          color: COLORS.textMuted, maxWidth: 700,
        }}>
          The Complete POS & Inventory Management Platform
        </p>
      </div>

      {/* URL */}
      <div style={{
        position: "absolute", left: "50%", top: "72%",
        transform: `translate(-50%, ${urlY}px)`,
        opacity: urlOp, textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 28px", borderRadius: 30,
          background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.primary }} />
          <span style={{ fontFamily: interFont, fontSize: 22, fontWeight: 600, color: COLORS.primary }}>
            www.lantid.store
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
