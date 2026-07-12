import {
  emotions,
  symbols,
  teams,
  type EmotionId,
  type TeamId,
} from "@/lib/tifo-options";
import type {
  TifoDesign,
  TifoRequest,
} from "@/lib/tifo-schema";

const countrySlogans: Record<
  TeamId,
  Record<EmotionId, string>
> = {
  argentina: {
    believe: "BELIEVE ALWAYS",
    defy: "NEVER BOW",
    unite: "ONE SOUL",
    remember: "GLORY LIVES",
  },

  brazil: {
    believe: "DREAM IN COLOR",
    defy: "PLAY WITHOUT FEAR",
    unite: "ONE RHYTHM",
    remember: "JOY REMAINS",
  },

  croatia: {
    believe: "BELIEVE BEYOND",
    defy: "STILL WE RISE",
    unite: "ONE PROUD VOICE",
    remember: "NEVER FORGOTTEN",
  },

  france: {
    believe: "DARE TO DREAM",
    defy: "STAND UNBROKEN",
    unite: "RISE AS ONE",
    remember: "HONOR ENDURES",
  },

  japan: {
    believe: "HOPE MOVES US",
    defy: "STAND WITH HONOR",
    unite: "ONE HEART RISES",
    remember: "PRIDE ENDURES",
  },

  morocco: {
    believe: "DREAM TOGETHER",
    defy: "FEAR NO HEIGHT",
    unite: "ONE GREAT ROAR",
    remember: "PRIDE REMAINS",
  },

  spain: {
    believe: "CREATE THE DREAM",
    defy: "OWN THE MOMENT",
    unite: "ONE GAME FLOWS",
    remember: "PASSION ENDURES",
  },

  "united-states": {
    believe: "DREAM FORWARD",
    defy: "RISE UNAFRAID",
    unite: "ONE RISING VOICE",
    remember: "WE CARRY ON",
  },
};

const emotionPlans: Record<
  EmotionId,
  Pick<TifoDesign, "layout" | "animation" | "energy">
> = {
  believe: {
    layout: "radiating-burst",
    animation: "center-out",
    energy: 88,
  },

  defy: {
    layout: "diagonal-rise",
    animation: "diagonal-sweep",
    energy: 95,
  },

  unite: {
    layout: "split-banner",
    animation: "row-wave",
    energy: 91,
  },

  remember: {
    layout: "center-emblem",
    animation: "stadium-pulse",
    energy: 84,
  },
};

export function buildFallbackTifoDesign(
  selection: TifoRequest,
): TifoDesign {
  const team = teams[selection.team];
  const emotion = emotions[selection.emotion];
  const symbol = symbols[selection.symbol];
  const plan = emotionPlans[selection.emotion];

  return {
    slogan:
      countrySlogans[selection.team][selection.emotion],
    ...plan,
    designReason:
      `${symbol.label} expresses ${team.name}'s ` +
      `${emotion.label.toLowerCase()} through a modern, ` +
      `inclusive stadium composition.`,
  };
}
