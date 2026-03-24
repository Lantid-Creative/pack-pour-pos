import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, soraFont, interFont } from "../fonts";

export const SceneCustomers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const customers = [
    { name: "Emeka Johnson", phone: "0801-234-5678", purchases: 24, total: "₦156,000", lastVisit: "Today" },
    { name: "Aisha Mohammed", phone: "0902-345-6789", purchases: 18, total: "₦98,400", lastVisit: "Yesterday" },
    { name: "Chidi Okafor", phone: "0803-456-7890", purchases: 32, total: "₦245,600", lastVisit: "2 days ago" },
    { name: "Fatima Bello", phone: "0705-567-8901", purchases: 12, total: "₦62,800", lastVisit: "3 days ago" },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <div style={{ position: "absolute", left: 80, top: 50, opacity: titleOp }}>
        <div style={{
          display: "inline-flex", padding: "6px 16px", borderRadius: 20,
          background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)",
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 13, fontWeight: 600, color: COLORS.primary, textTransform: "uppercase", letterSpacing: 2 }}>
            Customers
          </span>
        </div>
        <h2 style={{ fontFamily: soraFont, fontSize: 48, fontWeight: 800, color: COLORS.text, marginTop: 12 }}>
          Customer Management
        </h2>
        <p style={{ fontFamily: interFont, fontSize: 20, color: COLORS.textMuted, marginTop: 12, maxWidth: 700, lineHeight: 1.6 }}>
          Build your customer database. Track purchase history, manage credit accounts, and add new customers right from the POS during checkout.
        </p>
      </div>

      {/* Customer cards */}
      <div style={{
        position: "absolute", left: 80, right: 80, top: 280,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
      }}>
        {customers.map((c, i) => {
          const s = spring({ frame: frame - 20 - i * 8, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{
              background: COLORS.bgCard, borderRadius: 16, padding: 28,
              border: `1px solid ${COLORS.border}`,
              transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
              opacity: s, display: "flex", gap: 20, alignItems: "center",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: `linear-gradient(135deg, ${COLORS.primary}${(30 + i * 20).toString(16)}, ${COLORS.accent}${(30 + i * 20).toString(16)})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: soraFont, fontSize: 24, fontWeight: 800, color: COLORS.text }}>{c.name[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: interFont, fontSize: 18, fontWeight: 700, color: COLORS.text }}>{c.name}</p>
                <p style={{ fontFamily: interFont, fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{c.phone}</p>
                <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
                  <div>
                    <p style={{ fontFamily: interFont, fontSize: 11, color: COLORS.textMuted }}>Purchases</p>
                    <p style={{ fontFamily: soraFont, fontSize: 16, fontWeight: 700, color: COLORS.accent }}>{c.purchases}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: interFont, fontSize: 11, color: COLORS.textMuted }}>Total Spent</p>
                    <p style={{ fontFamily: soraFont, fontSize: 16, fontWeight: 700, color: COLORS.primary }}>{c.total}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: interFont, fontSize: 11, color: COLORS.textMuted }}>Last Visit</p>
                    <p style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.text }}>{c.lastVisit}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
