import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "GEMINI_API_KEY is missing from .env.local.",
      },
      { status: 500 }
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: 'Return only the words "TIFO FORGE READY".',
      store: false,
    });

    const message = interaction.output_text?.trim() ?? "";

    return NextResponse.json({
      ok: message.toUpperCase().includes("TIFO FORGE READY"),
      message,
    });
  } catch (error) {
    console.error("Gemini test failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "An unknown Gemini error occurred.",
      },
      { status: 500 }
    );
  }
}
