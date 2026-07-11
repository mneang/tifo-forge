import type {
  EmotionId,
} from "@/lib/tifo-options";
import {
  emotions,
  symbols,
  teams,
} from "@/lib/tifo-options";
import type {
  TifoDesign,
  TifoRequest,
} from "@/lib/tifo-schema";

const fallbackPlans: Record<
  EmotionId,
  Omit<TifoDesign, "designReason">
> = {
  believe: {
    slogan: "BELIEF BECOMES ROAR",
    layout: "radiating-burst",
    animation: "center-out",
    energy: 88,
  },
  defy: {
    slogan: "STILL WE RISE",
    layout: "diagonal-rise",
    animation: "diagonal-sweep",
    energy: 95,
  },
  unite: {
    slogan: "ONE STAND. ONE VOICE.",
    layout: "split-banner",
    animation: "row-wave",
    energy: 91,
  },
  remember: {
    slogan: "NEVER FORGOTTEN",
    layout: "center-emblem",
    animation: "stadium-pulse",
    energy: 84,
  },
};

export function buildFallbackTifoDesign(
  selection: TifoRequest,
): TifoDesign {
  const plan = fallbackPlans[selection.emotion];
  const team = teams[selection.team];
  const emotion = emotions[selection.emotion];
  const symbol = symbols[selection.symbol];

  return {
    ...plan,
    designReason: `The ${symbol.label.toLowerCase()} transforms ${team.name}'s ${emotion.label.toLowerCase()} passion into one stadium-wide statement.`,
  };
}
