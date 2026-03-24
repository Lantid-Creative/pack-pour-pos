import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, soraFont, interFont } from "../fonts";

const inventoryProducts = [
  { name: "Coca-Cola 50cl", category: "Soft Drinks", price: 2800, cost: 2200, stock: 48, threshold: 10 },
  { name: "Guinness 60cl", category: "Beer", price: 4200, cost: 3400, stock: 8, threshold: 12 },
  { name: "Star Lager 60cl", category: "Beer", price: 3600, cost: 2900, stock: 36, threshold: 10 },
  { name: "Pepsi 50cl", category: "Soft Drinks", price: 2600, cost: 2000, stock: 52, threshold: 10 },
  { name: "Malta Guinness 33cl", category: "Malt", price: 5400, cost: 4500, stock: 3, threshold: 15 },
  { name: "Fanta Orange 50cl", category: "Soft Drinks", price: 2700, cost: 2100, stock: 44, threshold: 10 },
];

export const SceneInventory: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Callout about product library
  const libCallout = interpolate(frame, [85, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <div style={{ position: "absolute", left: 80, top: 50, opacity: titleOp }}>
        <div style={{
          display: "inline-flex", padding: "6px 16px", borderRadius: 20,
          background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
          marginBottom: 12,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 13, fontWeight: 600, color: COLORS.danger, textTransform: "uppercase", letterSpacing: 2 }}>
            Inventory
          </span>
        </div>
        <h2 style={{ fontFamily: soraFont, fontSize: 48, fontWeight: 800, color: COLORS.text, marginTop: 12 }}>
          Stock Management
        </h2>
        <p style={{ fontFamily: interFont, fontSize: 20, color: COLORS.textMuted, marginTop: 12, maxWidth: 700, lineHeight: 1.6 }}>
          Add products from a library of 230+ Nigerian wholesale drink brands, set prices and cost prices, track margins, and get low-stock alerts automatically.
        </p>
      </div>

      {/* Product table */}
      <div style={{
        position: "absolute", left: 80, right: 80, top: 270,
        background: COLORS.bgCard, borderRadius: 18, overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
      }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px",
          padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`,
        }}>
          {["Product", "Category", "Price", "Cost", "Stock", "Margin"].map(h => (
            <span key={h} style={{ fontFamily: interFont, fontSize: 12, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>{h}</span>
          ))}
        </div>

        {inventoryProducts.map((p, i) => {
          const rowS = spring({ frame: frame - 25 - i * 6, fps, config: { damping: 18 } });
          const margin = Math.round((1 - p.cost / p.price) * 100);
          const isLowStock = p.stock <= p.threshold;
          return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 100px",
              padding: "14px 24px", borderBottom: `1px solid ${COLORS.border}`,
              opacity: rowS, transform: `translateX(${interpolate(rowS, [0, 1], [-30, 0])}px)`,
              background: isLowStock ? "rgba(239,68,68,0.05)" : "transparent",
            }}>
              <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.text }}>{p.name}</span>
              <span style={{ fontFamily: interFont, fontSize: 13, color: COLORS.textMuted }}>{p.category}</span>
              <span style={{ fontFamily: soraFont, fontSize: 14, fontWeight: 700, color: COLORS.primary }}>₦{p.price.toLocaleString()}</span>
              <span style={{ fontFamily: interFont, fontSize: 13, color: COLORS.textMuted }}>₦{p.cost.toLocaleString()}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontFamily: soraFont, fontSize: 14, fontWeight: 700,
                  color: isLowStock ? COLORS.danger : COLORS.text,
                }}>{p.stock}</span>
                {isLowStock && (
                  <span style={{
                    fontFamily: interFont, fontSize: 10, fontWeight: 700,
                    color: COLORS.danger, background: "rgba(239,68,68,0.15)",
                    padding: "2px 6px", borderRadius: 4,
                  }}>LOW</span>
                )}
              </div>
              <span style={{
                fontFamily: soraFont, fontSize: 14, fontWeight: 700,
                color: margin > 20 ? COLORS.primary : COLORS.warning,
              }}>{margin}%</span>
            </div>
          );
        })}
      </div>

      {/* Callouts */}
      <div style={{
        position: "absolute", left: 100, bottom: 60, opacity: libCallout,
        display: "flex", gap: 20,
      }}>
        <div style={{
          background: COLORS.bgCard, borderRadius: 12, padding: "12px 20px",
          border: `1px solid ${COLORS.danger}44`,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.danger }}>
            ✦ Low-stock alerts with configurable thresholds
          </span>
        </div>
        <div style={{
          background: COLORS.bgCard, borderRadius: 12, padding: "12px 20px",
          border: `1px solid ${COLORS.primary}44`,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.primary }}>
            ✦ 230+ products in the built-in library
          </span>
        </div>
        <div style={{
          background: COLORS.bgCard, borderRadius: 12, padding: "12px 20px",
          border: `1px solid ${COLORS.accent}44`,
        }}>
          <span style={{ fontFamily: interFont, fontSize: 14, fontWeight: 600, color: COLORS.accent }}>
            ✦ Multi-tier bulk pricing support
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
