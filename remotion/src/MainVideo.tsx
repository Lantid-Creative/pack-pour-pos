import { AbsoluteFill } from "remotion";
import { TransitionSeries, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";
import { SceneIntro } from "./scenes/SceneIntro";
import { SceneDashboard } from "./scenes/SceneDashboard";
import { ScenePOS } from "./scenes/ScenePOS";
import { SceneSplitPay } from "./scenes/SceneSplitPay";
import { SceneInventory } from "./scenes/SceneInventory";
import { SceneCrates } from "./scenes/SceneCrates";
import { SceneCredit } from "./scenes/SceneCredit";
import { SceneCustomers } from "./scenes/SceneCustomers";
import { SceneSalesHistory } from "./scenes/SceneSalesHistory";
import { SceneStaff } from "./scenes/SceneStaff";
import { SceneOutro } from "./scenes/SceneOutro";

const T = 20; // transition frames

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={180}>
          <SceneIntro />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={210}>
          <SceneDashboard />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={210}>
          <ScenePOS />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={180}>
          <SceneSplitPay />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={180}>
          <SceneInventory />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={180}>
          <SceneCrates />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={170}>
          <SceneCredit />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={150}>
          <SceneCustomers />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={170}>
          <SceneSalesHistory />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={170}>
          <SceneStaff />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()} timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
        />
        <TransitionSeries.Sequence durationInFrames={200}>
          <SceneOutro />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
