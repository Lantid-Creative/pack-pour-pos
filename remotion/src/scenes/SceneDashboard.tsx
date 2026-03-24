import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, soraFont, interFont } from "../fonts";

const MetricCard = ({ label, value, prefix, color, delay, frame, fps }: any) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 15 } });
  const countUp = Math.round(interpolate(s, [0, 1], [0, value]));
  return (
    <div style={{
      background: COLORS.bgCard, borderRadius: 16, padding: "24px 28px",
      border: `1px solid ${COLORS.border}`, flex: 1,
      transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
      opacity: s,
    }}>
      <p style={{ fontFamily: interFont, fontSize: 14, color: COLORS.textMuted, marginBottom: 8 }}>{label}</p>
      <p style={{ fontFamily: soraFont, fontSize: 36, fontWeight: 800, color }}>
        {prefix}{countUp.toLocaleString()}
      </p>
    </div>
  );
};

export const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleX = interpolate(frame, [0, 20], [-40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const descOp = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Chart bars animation
  const barHeights = [65, 82, 45, 90, 72, 58, 95, 68, 78, 55, 88, 73];

  // Callout
  const calloutOp = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const calloutY = interpolate(frame, [80, 100], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Section label */}
      <div style={{
        position: "absolute", left: 80, top: 60,
        opacity: titleOp, transform: `translateX(${titleX}px)`,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "6px 16px", borderRadius: 20,
          background: COLORS.primaryGlow, border: `1px solid ${COLORS.primary}33`,
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 13, fontWeight: 600, color: COLORS.primary, textTransform: "uppercase", letterSpacing: 2 }}>
            Dashboard
          </span>
        </div>
        <h2 style={{ fontFamily: soraFont, fontSize: 52, fontWeight: 800, color: COLORS.text, marginTop: 12 }}>
          Real-Time Analytics
        </h2>
      </div>

      {/* Description */}
      <div style={{
        position: "absolute", left: 80, top: 185, maxWidth: 600,
        opacity: descOp,
      }}>
        <p style={{ fontFamily: interFont, fontSize: 20, color: COLORS.textMuted, lineHeight: 1.6 }}>
          Monitor your store's performance at a glance. Track revenue, sales count, profit margins, and payment breakdowns — all updating in real-time.
        </p>
      </div>

      {/* Metric cards */}
      <div style={{
        position: "absolute", left: 80, top: 280, right: 80,
        display: "flex", gap: 20,
      }}>
        <MetricCard label="Today's Revenue" value={285400} prefix="₦" color={COLORS.primary} delay={20} frame={frame} fps={fps} />
        <MetricCard label="Total Sales" value={47} prefix="" color={COLORS.accent} delay={28} frame={frame} fps={fps} />
        <MetricCard label="Gross Profit" value={98200} prefix="₦" color={COLORS.warning} delay={36} frame={frame} fps={fps} />
        <MetricCard label="Items Sold" value={312} prefix="" color={COLORS.text} delay={44} frame={frame} fps={fps} />
      </div>

      {/* Revenue chart */}
      <div style={{
        position: "absolute", left: 80, top: 440, width: 1000,
        background: COLORS.bgCard, borderRadius: 16, padding: 28,
        border: `1px solid ${COLORS.border}`,
        opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(frame, [40, 60], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
      }}>
        <p style={{ fontFamily: interFont, fontSize: 16, fontWeight: 600, color: COLORS.text, marginBottom: 20 }}>Hourly Revenue</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 200 }}>
          {barHeights.map((h, i) => {
            const barS = spring({ frame: frame - 50 - i * 3, fps, config: { damping: 12 } });
            return (
              <div key={i} style={{
                flex: 1, height: h * 2.2 * barS, borderRadius: 6,
                background: `linear-gradient(to top, ${COLORS.primary}, ${COLORS.accent})`,
                opacity: 0.7 + barS * 0.3,
              }} />
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          {["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm"].map((t, i) => (
            <span key={i} style={{ fontFamily: interFont, fontSize: 11, color: COLORS.textMuted, flex: 1, textAlign: "center" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Payment breakdown pie */}
      <div style={{
        position: "absolute", right: 80, top: 440, width: 680,
        background: COLORS.bgCard, borderRadius: 16, padding: 28,
        border: `1px solid ${COLORS.border}`,
        opacity: interpolate(frame, [55, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <p style={{ fontFamily: interFont, fontSize: 16, fontWeight: 600, color: COLORS.text, marginBottom: 20 }}>Payment Methods</p>
        {[
          { label: "Cash", pct: 45, color: COLORS.primary },
          { label: "POS", pct: 28, color: COLORS.accent },
          { label: "Transfer", pct: 20, color: COLORS.warning },
          { label: "Credit", pct: 7, color: COLORS.danger },
        ].map((m, i) => {
          const barW = spring({ frame: frame - 60 - i * 6, fps, config: { damping: 20 } });
          return (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: interFont, fontSize: 14, color: COLORS.textMuted }}>{m.label}</span>
                <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.text }}>{m.pct}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: COLORS.bgMuted }}>
                <div style={{ height: "100%", borderRadius: 4, background: m.color, width: `${m.pct * barW}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Callout */}
      <div style={{
        position: "absolute", right: 100, top: 90,
        opacity: calloutOp, transform: `translateY(${calloutY}px)`,
        background: COLORS.bgCard, borderRadius: 12, padding: "14px 22px",
        border: `1px solid ${COLORS.primary}44`,
        boxShadow: `0 8px 30px ${COLORS.primaryGlow}`,
      }}>
        <span style={{ fontFamily: interFont, fontSize: 15, fontWeight: 600, color: COLORS.primary }}>
          ✦ Updates in real-time as sales happen
        </span>
      </div>
    </AbsoluteFill>
  );
};
