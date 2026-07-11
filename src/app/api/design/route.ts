import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import { buildFallbackTifoDesign } from "@/lib/fallback-design";
import {
  tifoDesignSchema,
  tifoRequestSchema,
} from "@/lib/tifo-schema";
import { emotions, symbols, teams } from "@/lib/tifo-options";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const tifoDesignJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slogan: {
      type: "string",
      description:
        "An unforgettable uppercase stadium slogan of 2 to 4 words and no more than 24 total characters.",
    },
    layout: {
      type: "string",
      enum: [
        "center-emblem",
        "diagonal-rise",
        "split-banner",
        "radiating-burst",
      ],
      description: "The visual composition of the stadium card mosaic.",
    },
    animation: {
      type: "string",
      enum: [
        "row-wave",
        "center-out",
        "diagonal-sweep",
        "stadium-pulse",
      ],
      description: "How the supporter cards reveal the finished tifo.",
    },
    energy: {
      type: "integer",
      minimum: 60,
      maximum: 100,
      description: "The emotional intensity of the display.",
    },
    designReason: {
      type: "string",
      description:
        "One concise sentence explaining how the design expresses the selected supporter emotion.",
    },
  },
  required: [
    "slogan",
    "layout",
    "animation",
    "energy",
    "designReason",
  ],
};

function buildPrompt(
  teamName: string,
  passionLine: string,
  emotionLabel: string,
  emotionDescription: string,
  symbolLabel: string,
  symbolDescription: string,
) {
  return `
You are the creative director for Tifo Forge, a passion-centered stadium
card-mosaic experience.

Create one disciplined, emotionally powerful tifo design plan.

SELECTION
Team: ${teamName}
Team spirit: ${passionLine}
Emotion: ${emotionLabel}
Emotion meaning: ${emotionDescription}
Central symbol: ${symbolLabel}
Symbol meaning: ${symbolDescription}

STRICT RULES
- The slogan must contain 2 to 4 words.
- The slogan must be uppercase.
- The slogan must contain no more than 24 characters including spaces.
- Do not include the team or country name in the slogan.
- Avoid clichés such as "GO TEAM" or "WE WILL WIN".
- Make the slogan express passion, identity, devotion, resilience, or unity.
- Select only one supported layout.
- Select only one supported animation.
- Energy must be an integer from 60 through 100.
- The design reason must be one short sentence.
- Do not discuss colors because the application controls the team palette.
- Do not return commentary outside the required JSON.
`;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "The request body must be valid JSON.",
      },
      { status: 400 },
    );
  }

  const requestResult = tifoRequestSchema.safeParse(body);

  if (!requestResult.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid team, emotion, or symbol selection.",
      },
      { status: 400 },
    );
  }

  const selection = requestResult.data;
  const fallbackDesign = buildFallbackTifoDesign(selection);

  const team = teams[selection.team];
  const emotion = emotions[selection.emotion];
  const symbol = symbols[selection.symbol];
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      source: "fallback",
      design: fallbackDesign,
      warning: "Gemini API key is unavailable.",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: buildPrompt(
        team.name,
        team.passionLine,
        emotion.label,
        emotion.description,
        symbol.label,
        symbol.description,
      ),
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: tifoDesignJsonSchema,
      },
      store: false,
    });

    if (!interaction.output_text) {
      throw new Error("Gemini returned no design text.");
    }

    const generatedDesign: unknown = JSON.parse(
      interaction.output_text,
    );

    const validatedDesign =
      tifoDesignSchema.parse(generatedDesign);

    return NextResponse.json({
      ok: true,
      source: "gemini",
      design: {
        ...validatedDesign,
        slogan: validatedDesign.slogan.trim().toUpperCase(),
        designReason: validatedDesign.designReason.trim(),
      },
    });
  } catch (error) {
    console.error("Tifo design generation failed:", error);

    return NextResponse.json({
      ok: true,
      source: "fallback",
      design: fallbackDesign,
      warning:
        "Gemini was temporarily unavailable, so the local creative plan was used.",
    });
  }
}
