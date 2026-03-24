import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, soraFont, interFont } from "../fonts";

export const SceneStaff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const staff = [
    { name: "Ade Bakare", role: "Owner", email: "ade@store.com", color: COLORS.primary },
    { name: "Ngozi Eze", role: "Manager", email: "ngozi@store.com", color: COLORS.accent },
    { name: "Ibrahim Yusuf", role: "Cashier", email: "ibrahim@store.com", color: COLORS.warning },
  ];

  const permissions = [
    { label: "Dashboard Access", owner: true, manager: true, cashier: true },
    { label: "POS Terminal", owner: true, manager: true, cashier: true },
    { label: "Edit Products", owner: true, manager: true, cashier: false },
    { label: "Delete Products", owner: true, manager: false, cashier: false },
    { label: "View Revenue", owner: true, manager: true, cashier: false },
    { label: "Manage Staff", owner: true, manager: false, cashier: false },
    { label: "View Cost Prices", owner: true, manager: false, cashier: false },
  ];

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <div style={{ position: "absolute", left: 80, top: 50, opacity: titleOp }}>
        <div style={{
          display: "inline-flex", padding: "6px 16px", borderRadius: 20,
          background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 13, fontWeight: 600, color: COLORS.accent, textTransform: "uppercase", letterSpacing: 2 }}>
            Team Management
          </span>
        </div>
        <h2 style={{ fontFamily: soraFont, fontSize: 48, fontWeight: 800, color: COLORS.text, marginTop: 12 }}>
          Staff & Permissions
        </h2>
        <p style={{ fontFamily: interFont, fontSize: 20, color: COLORS.textMuted, marginTop: 12, maxWidth: 700, lineHeight: 1.6 }}>
          Create staff accounts with Owner, Manager, or Cashier roles. Customize exactly which pages and actions each role can access.
        </p>
      </div>

      {/* Staff cards */}
      <div style={{
        position: "absolute", left: 80, top: 280, display: "flex", gap: 20,
      }}>
        {staff.map((s, i) => {
          const cardS = spring({ frame: frame - 20 - i * 10, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{
              width: 280, background: COLORS.bgCard, borderRadius: 16, padding: 24,
              border: `1px solid ${COLORS.border}`, transform: `scale(${cardS})`, opacity: cardS,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: `linear-gradient(135deg, ${s.color}, ${s.color}88)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 14,
              }}>
                <span style={{ fontFamily: soraFont, fontSize: 22, fontWeight: 800, color: "white" }}>
                  {s.name[0]}
                </span>
              </div>
              <p style={{ fontFamily: interFont, fontSize: 17, fontWeight: 700, color: COLORS.text }}>{s.name}</p>
              <p style={{ fontFamily: interFont, fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>{s.email}</p>
              <span style={{
                display: "inline-block", marginTop: 10,
                fontFamily: interFont, fontSize: 11, fontWeight: 700,
                color: s.color, textTransform: "uppercase",
                padding: "4px 12px", borderRadius: 20,
                background: `${s.color}15`,
              }}>{s.role}</span>
            </div>
          );
        })}
      </div>

      {/* Permissions matrix */}
      <div style={{
        position: "absolute", right: 80, top: 280, width: 620,
        background: COLORS.bgCard, borderRadius: 16, overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
        opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
          <span style={{ fontFamily: interFont, fontSize: 15, fontWeight: 700, color: COLORS.text }}>Role Permissions</span>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
          padding: "10px 20px", borderBottom: `1px solid ${COLORS.border}`,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 11, fontWeight: 600, color: COLORS.textMuted }}>PERMISSION</span>
          <span style={{ fontFamily: interFont, fontSize: 11, fontWeight: 600, color: COLORS.primary, textAlign: "center" }}>OWNER</span>
          <span style={{ fontFamily: interFont, fontSize: 11, fontWeight: 600, color: COLORS.accent, textAlign: "center" }}>MANAGER</span>
          <span style={{ fontFamily: interFont, fontSize: 11, fontWeight: 600, color: COLORS.warning, textAlign: "center" }}>CASHIER</span>
        </div>
        {permissions.map((p, i) => {
          const rowS = spring({ frame: frame - 50 - i * 4, fps, config: { damping: 18 } });
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
              padding: "10px 20px", borderBottom: `1px solid ${COLORS.border}`,
              opacity: rowS,
            }}>
              <span style={{ fontFamily: interFont, fontSize: 13, color: COLORS.text }}>{p.label}</span>
              {[p.owner, p.manager, p.cashier].map((val, j) => (
                <div key={j} style={{ textAlign: "center" }}>
                  <span style={{
                    fontFamily: interFont, fontSize: 14, fontWeight: 700,
                    color: val ? COLORS.primary : COLORS.textMuted,
                  }}>{val ? "✓" : "—"}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
