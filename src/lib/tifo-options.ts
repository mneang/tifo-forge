import { emotionIds, symbolIds, teamIds } from "./tifo-schema";

export type TeamId = (typeof teamIds)[number];
export type EmotionId = (typeof emotionIds)[number];
export type SymbolId = (typeof symbolIds)[number];

type TeamOption = {
  name: string;
  code: string;
  flag: string;
  region: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  passionLine: string;
};

export const teams: Record<TeamId, TeamOption> = {
  argentina: {
    name: "Argentina",
    code: "ARG",
    flag: "🇦🇷",
    region: "South America",
    colors: {
      primary: "#75AADB",
      secondary: "#FFFFFF",
      accent: "#F6B40E",
    },
    passionLine: "Believe until the final whistle.",
  },
  brazil: {
    name: "Brazil",
    code: "BRA",
    flag: "🇧🇷",
    region: "South America",
    colors: {
      primary: "#FFDF00",
      secondary: "#009C3B",
      accent: "#002776",
    },
    passionLine: "Joy becomes a stadium language.",
  },
  croatia: {
    name: "Croatia",
    code: "CRO",
    flag: "🇭🇷",
    region: "Europe",
    colors: {
      primary: "#FF0000",
      secondary: "#FFFFFF",
      accent: "#171796",
    },
    passionLine: "Small nation. Endless belief.",
  },
  france: {
    name: "France",
    code: "FRA",
    flag: "🇫🇷",
    region: "Europe",
    colors: {
      primary: "#002395",
      secondary: "#FFFFFF",
      accent: "#ED2939",
    },
    passionLine: "Many voices rise as one.",
  },
  japan: {
    name: "Japan",
    code: "JPN",
    flag: "🇯🇵",
    region: "Asia",
    colors: {
      primary: "#001E62",
      secondary: "#FFFFFF",
      accent: "#BC002D",
    },
    passionLine: "Discipline carries belief forward.",
  },
  morocco: {
    name: "Morocco",
    code: "MAR",
    flag: "🇲🇦",
    region: "Africa",
    colors: {
      primary: "#C1272D",
      secondary: "#006233",
      accent: "#F5F1E8",
    },
    passionLine: "A continent dreams together.",
  },
  spain: {
    name: "Spain",
    code: "ESP",
    flag: "🇪🇸",
    region: "Europe",
    colors: {
      primary: "#AA151B",
      secondary: "#F1BF00",
      accent: "#1C2541",
    },
    passionLine: "Control the moment. Create the roar.",
  },
  "united-states": {
    name: "United States",
    code: "USA",
    flag: "🇺🇸",
    region: "North America",
    colors: {
      primary: "#3C3B6E",
      secondary: "#FFFFFF",
      accent: "#B22234",
    },
    passionLine: "One crowd. One rising voice.",
  },
};

export const emotions: Record<
  EmotionId,
  { label: string; description: string }
> = {
  believe: {
    label: "Believe",
    description: "Hope before the outcome is certain.",
  },
  defy: {
    label: "Defy",
    description: "Stand taller when the world doubts you.",
  },
  unite: {
    label: "Unite",
    description: "Turn thousands of voices into one.",
  },
  remember: {
    label: "Remember",
    description: "Honor the moments that shaped the supporters.",
  },
};

export const symbols: Record<
  SymbolId,
  { label: string; description: string }
> = {
  crown: {
    label: "Crown",
    description: "Ambition, excellence, and the pursuit of glory.",
  },
  phoenix: {
    label: "Phoenix",
    description: "Resilience, recovery, and rising again.",
  },
  lightning: {
    label: "Lightning",
    description: "Energy, speed, and sudden belief.",
  },
  heart: {
    label: "Heart",
    description: "Devotion that survives every result.",
  },
  "rising-sun": {
    label: "Rising Sun",
    description: "Hope, renewal, and a new beginning.",
  },
  wings: {
    label: "Wings",
    description: "Freedom, momentum, and fearless aspiration.",
  },
};
