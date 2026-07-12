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
      minLength: 2,
      maxLength: 18,
      description:
        "A forceful uppercase stadium chant of 2 or 3 words and no more than 18 total characters.",
    },
    layout: {
      type: "string",
      enum: [
        "center-emblem",
        "diagonal-rise",
        "split-banner",
        "radiating-burst",
      ],
      description: "The composition of the stadium card mosaic.",
    },
    animation: {
      type: "string",
      enum: [
        "row-wave",
        "center-out",
        "diagonal-sweep",
        "stadium-pulse",
      ],
      description: "How the supporter display reveals itself.",
    },
    energy: {
      type: "integer",
      minimum: 60,
      maximum: 100,
      description: "The emotional intensity of the crowd display.",
    },
    designReason: {
      type: "string",
      description:
        "One concise sentence connecting the team spirit, emotion, symbol, and visual direction.",
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
  recommendedSymbols: string,
  emotionLabel: string,
  emotionDescription: string,
  symbolLabel: string,
  symbolDescription: string,
) {
  return `
You are the creative director for Tifo Forge, a stadium card-mosaic
experience about supporter passion.

Create one bold, coherent and immediately readable tifo design.

SELECTION
Team: ${teamName}
Supporter spirit: ${passionLine}
Recommended visual symbols: ${recommendedSymbols}
Chosen passion: ${emotionLabel}
Passion meaning: ${emotionDescription}
Chosen symbol: ${symbolLabel}
Symbol meaning: ${symbolDescription}

STRICT CREATIVE RULES
- Produce language that a real supporter could proudly raise across an entire stand.
- Write a terrace declaration, not advertising copy, a sentence, or a book title.
- Use exactly 2 or 3 uppercase words.
- Use no more than 18 total characters, including spaces.
- Do not use the team or country name.
- Prefer emotional ideas such as belief, pride, courage, unity, memory, rhythm, hope, and resilience.
- Avoid empty motivational clichés such as GO TEAM, WE WILL WIN, NEVER GIVE UP, CHASE GREATNESS, or DREAM BIG.
- Avoid awkward poetry, corporate language, exaggerated heroism, or phrases that sound generated.
- The slogan should feel natural when shouted by thousands of supporters.
- Avoid stereotypes, political references, religious claims, or historical claims.
- Never reference or imitate historical, military, colonial, imperial, or political flags, uniforms, insignia, slogans, or symbols.
- Keep the design celebratory, inclusive, modern, and appropriate for a global football audience.
- Do not use royal or monarchy language unless the chosen symbol is Crown.
- The words must feel forceful enough to be read across an entire stadium.
- Connect the slogan to the chosen passion and symbol.
- Choose only one supported layout.
- Choose only one supported animation.
- Energy must be an integer from 60 through 100.
- The design reason must be one short sentence.
- Do not discuss colors; the application controls the team palette.
- Return only the required JSON.
`;
}


function normalizeSlogan(value: unknown) {
  if (typeof value !== "string") {
    return "ONE VOICE";
  }

  const cleaned = value
    .toUpperCase()
    .replace(/[^A-Z0-9 '&-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned
    .split(" ")
    .filter(Boolean)
    .slice(0, 3);

  while (
    words.join(" ").length > 18 &&
    words.length > 1
  ) {
    words.pop();
  }

  const slogan = words.join(" ");

  return slogan.length >= 2
    ? slogan.slice(0, 18).trim()
    : "ONE VOICE";
}

function normalizeGeminiDesign(
  value: unknown,
): unknown {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return value;
  }

  const design = value as Record<string, unknown>;

  return {
    ...design,
    slogan: normalizeSlogan(design.slogan),
    energy:
      typeof design.energy === "number"
        ? Math.round(
            Math.max(
              60,
              Math.min(100, design.energy),
            ),
          )
        : 85,
    designReason:
      typeof design.designReason === "string"
        ? design.designReason
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 180)
        : "A focused stadium composition transforms supporter passion into one collective statement.",
  };
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
        team.recommendedSymbols
          .map((symbolId) => symbols[symbolId].label)
          .join(", "),
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

    const normalizedDesign =
      normalizeGeminiDesign(generatedDesign);

    const validatedDesign =
      tifoDesignSchema.parse(normalizedDesign);

    return NextResponse.json({
      ok: true,
      source: "gemini",
      design: validatedDesign,
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
