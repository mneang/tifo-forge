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
    believe: "HEARTS BELIEVE",
    defy: "NEVER BACK DOWN",
    unite: "ONE SKY. ONE SOUL",
    remember: "GLORY LIVES ON",
  },

  brazil: {
    believe: "DREAM IN COLOR",
    defy: "PLAY WITHOUT FEAR",
    unite: "ONE RHYTHM RISES",
    remember: "JOY NEVER FADES",
  },

  croatia: {
    believe: "BELIEVE BEYOND",
    defy: "STILL WE STAND",
    unite: "ONE PROUD VOICE",
    remember: "PRIDE LIVES ON",
  },

  france: {
    believe: "DARE TO BELIEVE",
    defy: "STAND UNBROKEN",
    unite: "RISE AS ONE",
    remember: "HONOR LIVES ON",
  },

  japan: {
    believe: "ONE HEART FORWARD",
    defy: "STAND WITH HONOR",
    unite: "TOGETHER WE RISE",
    remember: "PRIDE ENDURES",
  },

  morocco: {
    believe: "DREAMS RISE HERE",
    defy: "FEAR NO HEIGHT",
    unite: "ONE GREAT ROAR",
    remember: "PRIDE NEVER FADES",
  },

  spain: {
    believe: "CREATE THE DREAM",
    defy: "OWN EVERY MOMENT",
    unite: "ONE RHYTHM FLOWS",
    remember: "PASSION LIVES ON",
  },

  "united-states": {
    believe: "DREAM FORWARD",
    defy: "RISE UNAFRAID",
    unite: "ONE VOICE RISING",
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
    energy: 92,
  },

  remember: {
    layout: "center-emblem",
    animation: "stadium-pulse",
    energy: 84,
  },
};

const supporterVoices: Record<TeamId, string> = {
  argentina:
    "collective belief, emotional intensity, and a crowd that never stops carrying the team",

  brazil:
    "joy, rhythm, imagination, and supporters expressing football through movement",

  croatia:
    "resilience, unity, and belief larger than the size of the nation",

  france:
    "confidence, strength, elegance, and many voices becoming one",

  japan:
    "discipline, unity, respect, and determined forward movement",

  morocco:
    "courage, shared dreams, pride, and the force of supporters standing together",

  spain:
    "rhythm, control, creativity, and confidence growing through collective play",

  "united-states":
    "momentum, optimism, and many different voices becoming one crowd",
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
      `The ${symbol.label.toLowerCase()} channels ` +
      `${team.name}'s ${emotion.label.toLowerCase()} through ` +
      `${supporterVoices[selection.team]}.`,
  };
}
