import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadSora } from "@remotion/google-fonts/Sora";

export const { fontFamily: interFont } = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const { fontFamily: soraFont } = loadSora("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

export const COLORS = {
  bg: "#0a0a0f",
  bgCard: "#12121a",
  bgMuted: "#1a1a25",
  border: "#2a2a3a",
  text: "#f0f0f5",
  textMuted: "#8888a0",
  primary: "#22c55e",
  primaryDark: "#16a34a",
  primaryGlow: "rgba(34, 197, 94, 0.15)",
  accent: "#3b82f6",
  warning: "#f59e0b",
  danger: "#ef4444",
  gradient1: "#22c55e",
  gradient2: "#3b82f6",
};
