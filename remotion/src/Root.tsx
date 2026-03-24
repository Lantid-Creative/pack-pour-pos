import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

// 10 scenes, ~60s at 30fps = 1800 frames
// Accounting for transitions (9 transitions × 20 frames = 180 frames overlap)
// Scene durations total ~1980, minus 180 overlap = 1800
export const RemotionRoot = () => (
  <Composition
    id="main"
    component={MainVideo}
    durationInFrames={1800}
    fps={30}
    width={1920}
    height={1080}
  />
);
