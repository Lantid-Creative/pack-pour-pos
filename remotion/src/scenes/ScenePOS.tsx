import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, soraFont, interFont } from "../fonts";

const products = [
  { name: "Coca-Cola", size: "50cl × 12", price: 2800, stock: 48 },
  { name: "Guinness", size: "60cl × 12", price: 4200, stock: 24 },
  { name: "Star Lager", size: "60cl × 12", price: 3600, stock: 36 },
  { name: "Pepsi", size: "50cl × 12", price: 2600, stock: 52 },
  { name: "Malta Guinness", size: "33cl × 24", price: 5400, stock: 18 },
  { name: "Fanta Orange", size: "50cl × 12", price: 2700, stock: 44 },
];

const cartItems = [
  { name: "Coca-Cola", qty: 3, price: 2800 },
  { name: "Guinness", qty: 2, price: 4200 },
  { name: "Star Lager", qty: 1, price: 3600 },
];

export const ScenePOS: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleX = interpolate(frame, [0, 20], [-40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const descOp = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Product grid animation
  const gridOp = interpolate(frame, [25, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Cart slide in
  const cartX = interpolate(frame, [60, 85], [400, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cartOp = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Payment methods highlight
  const payOp = interpolate(frame, [100, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  
  // Checkout button pulse
  const pulse = frame > 130 ? Math.sin((frame - 130) * 0.1) * 0.05 + 1 : 1;

  // Callouts
  const callout1Op = interpolate(frame, [45, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const callout2Op = interpolate(frame, [110, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* Header */}
      <div style={{ position: "absolute", left: 80, top: 50, opacity: titleOp, transform: `translateX(${titleX}px)` }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "6px 16px", borderRadius: 20,
          background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 13, fontWeight: 600, color: COLORS.accent, textTransform: "uppercase", letterSpacing: 2 }}>
            POS Terminal
          </span>
        </div>
        <h2 style={{ fontFamily: soraFont, fontSize: 48, fontWeight: 800, color: COLORS.text, marginTop: 12 }}>
          Fast & Intuitive Checkout
        </h2>
      </div>

      <div style={{ position: "absolute", left: 80, top: 170, maxWidth: 700, opacity: descOp }}>
        <p style={{ fontFamily: interFont, fontSize: 20, color: COLORS.textMuted, lineHeight: 1.6 }}>
          Tap products to add them to the cart. Automatic bulk pricing kicks in when quantity thresholds are met. Supports Cash, POS, Transfer, Credit, and Split payments.
        </p>
      </div>

      {/* Product grid */}
      <div style={{
        position: "absolute", left: 80, top: 270, width: 850,
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14,
        opacity: gridOp,
      }}>
        {products.map((p, i) => {
          const s = spring({ frame: frame - 30 - i * 4, fps, config: { damping: 15 } });
          const isInCart = cartItems.some(c => c.name === p.name);
          return (
            <div key={i} style={{
              background: isInCart && frame > 60 ? `${COLORS.primary}15` : COLORS.bgCard,
              borderRadius: 14, padding: "18px 16px",
              border: `1px solid ${isInCart && frame > 60 ? COLORS.primary + "44" : COLORS.border}`,
              transform: `scale(${s})`, opacity: s,
            }}>
              <p style={{ fontFamily: interFont, fontSize: 15, fontWeight: 700, color: COLORS.text }}>{p.name}</p>
              <p style={{ fontFamily: interFont, fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{p.size}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <span style={{ fontFamily: soraFont, fontSize: 18, fontWeight: 700, color: COLORS.primary }}>₦{p.price.toLocaleString()}</span>
                <span style={{
                  fontFamily: interFont, fontSize: 11, fontWeight: 600,
                  color: p.stock < 20 ? COLORS.warning : COLORS.textMuted,
                  padding: "2px 8px", borderRadius: 8, background: COLORS.bgMuted,
                }}>Stock: {p.stock}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart sidebar */}
      <div style={{
        position: "absolute", right: 60, top: 270, width: 440,
        background: COLORS.bgCard, borderRadius: 18, padding: 28,
        border: `1px solid ${COLORS.border}`,
        transform: `translateX(${cartX}px)`, opacity: cartOp,
        boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontFamily: soraFont, fontSize: 20, fontWeight: 700, color: COLORS.text }}>Current Order</span>
          <span style={{
            fontFamily: interFont, fontSize: 12, fontWeight: 700,
            background: COLORS.primary, color: "white",
            padding: "3px 10px", borderRadius: 20,
          }}>3 items</span>
        </div>

        {cartItems.map((item, i) => {
          const s = spring({ frame: frame - 70 - i * 8, fps, config: { damping: 15 } });
          return (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", borderBottom: i < cartItems.length - 1 ? `1px solid ${COLORS.border}` : "none",
              opacity: s, transform: `translateX(${interpolate(s, [0, 1], [30, 0])}px)`,
            }}>
              <div>
                <p style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.text }}>{item.name}</p>
                <p style={{ fontFamily: interFont, fontSize: 12, color: COLORS.textMuted }}>×{item.qty}</p>
              </div>
              <span style={{ fontFamily: soraFont, fontSize: 16, fontWeight: 700, color: COLORS.text }}>
                ₦{(item.price * item.qty).toLocaleString()}
              </span>
            </div>
          );
        })}

        {/* Payment methods */}
        <div style={{ marginTop: 20, opacity: payOp }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["CASH", "POS", "TRANSFER", "CREDIT"].map((m, i) => (
              <div key={m} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, textAlign: "center",
                background: i === 0 ? COLORS.primary : COLORS.bgMuted,
                color: i === 0 ? "white" : COLORS.textMuted,
                fontFamily: interFont, fontSize: 11, fontWeight: 700,
              }}>{m}</div>
            ))}
          </div>
        </div>

        {/* Total & checkout */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 16, borderTop: `1px solid ${COLORS.border}`,
          marginTop: 8,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 14, color: COLORS.textMuted }}>Total</span>
          <span style={{ fontFamily: soraFont, fontSize: 28, fontWeight: 800, color: COLORS.text }}>₦20,200</span>
        </div>

        <div style={{
          marginTop: 14, padding: "14px 0", borderRadius: 12, textAlign: "center",
          background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
          fontFamily: soraFont, fontSize: 16, fontWeight: 700, color: "white",
          transform: `scale(${pulse})`,
          boxShadow: `0 8px 30px ${COLORS.primaryGlow}`,
        }}>
          CHECKOUT — ₦20,200
        </div>
      </div>

      {/* Callouts */}
      <div style={{
        position: "absolute", left: 100, bottom: 80,
        opacity: callout1Op,
        background: COLORS.bgCard, borderRadius: 12, padding: "12px 20px",
        border: `1px solid ${COLORS.accent}44`,
      }}>
        <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.accent }}>
          ✦ Smart bulk pricing auto-applies based on quantity
        </span>
      </div>

      <div style={{
        position: "absolute", right: 100, bottom: 80,
        opacity: callout2Op,
        background: COLORS.bgCard, borderRadius: 12, padding: "12px 20px",
        border: `1px solid ${COLORS.primary}44`,
      }}>
        <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.primary }}>
          ✦ Split payments across multiple methods
        </span>
      </div>
    </AbsoluteFill>
  );
};
