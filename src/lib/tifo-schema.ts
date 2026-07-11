import { z } from "zod";

export const teamIds = [
  "argentina",
  "brazil",
  "croatia",
  "france",
  "japan",
  "morocco",
  "spain",
  "united-states",
] as const;

export const emotionIds = [
  "believe",
  "defy",
  "unite",
  "remember",
] as const;

export const symbolIds = [
  "crown",
  "phoenix",
  "lightning",
  "heart",
  "rising-sun",
  "wings",
] as const;

export const layoutIds = [
  "center-emblem",
  "diagonal-rise",
  "split-banner",
  "radiating-burst",
] as const;

export const animationIds = [
  "row-wave",
  "center-out",
  "diagonal-sweep",
  "stadium-pulse",
] as const;

export const tifoRequestSchema = z.object({
  team: z.enum(teamIds),
  emotion: z.enum(emotionIds),
  symbol: z.enum(symbolIds),
});

export const tifoDesignSchema = z.object({
  slogan: z.string().min(2).max(24),
  layout: z.enum(layoutIds),
  animation: z.enum(animationIds),
  energy: z.number().int().min(60).max(100),
  designReason: z.string().min(10).max(180),
});

export type TifoRequest = z.infer<typeof tifoRequestSchema>;
export type TifoDesign = z.infer<typeof tifoDesignSchema>;

export const fallbackTifoDesign: TifoDesign = {
  slogan: "ONE HEART. ONE STAND.",
  layout: "center-emblem",
  animation: "row-wave",
  energy: 90,
  designReason:
    "A unified central display transforms individual passion into one collective stadium statement.",
};
