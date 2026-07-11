"use client";

import { useMemo, useState } from "react";

import {
  emotionIds,
  fallbackTifoDesign,
  symbolIds,
  teamIds,
  type TifoDesign,
} from "@/lib/tifo-schema";
import {
  emotions,
  symbols,
  teams,
  type EmotionId,
  type SymbolId,
  type TeamId,
} from "@/lib/tifo-options";

type DesignResponse = {
  ok: boolean;
  source: "gemini" | "fallback";
  design: TifoDesign;
  warning?: string;
  error?: string;
};

function SymbolGlyph({
  symbol,
  color,
}: {
  symbol: SymbolId;
  color: string;
}) {
  if (symbol === "crown") {
    return (
      <g fill={color} stroke={color} strokeLinejoin="round">
        <path d="M12 70 20 28 42 50 50 18 58 50 80 28 88 70Z" />
        <rect x="16" y="70" width="68" height="14" rx="4" />
      </g>
    );
  }

  if (symbol === "phoenix") {
    return (
      <g stroke={color} strokeLinejoin="round">
        <path
          d="M50 8C60 28 78 31 89 17C86 42 69 50 58 43C72 58 70 77 50 92C30 77 28 58 42 43C31 50 14 42 11 17C22 31 40 28 50 8Z"
          fill="none"
          strokeWidth="7"
        />
        <path
          d="M50 27C41 43 42 59 50 72C58 59 59 43 50 27Z"
          fill={color}
          strokeWidth="3"
        />
      </g>
    );
  }

  if (symbol === "lightning") {
    return (
      <polygon
        points="57,7 25,55 46,55 37,93 76,43 54,43"
        fill={color}
        stroke={color}
        strokeLinejoin="round"
        strokeWidth="5"
      />
    );
  }

  if (symbol === "heart") {
    return (
      <path
        d="M50 86 17 55C-5 33 10 7 32 13C42 16 48 24 50 31C52 24 58 16 68 13C90 7 105 33 83 55Z"
        fill={color}
      />
    );
  }

  if (symbol === "rising-sun") {
    return (
      <g stroke={color} strokeLinecap="round">
        <circle cx="50" cy="54" r="22" fill={color} strokeWidth="5" />
        <path
          d="M50 9V23M18 22L29 33M82 22L71 33M6 54H21M94 54H79M19 84L30 73M81 84L70 73"
          fill="none"
          strokeWidth="7"
        />
        <path d="M10 86H90" fill="none" strokeWidth="8" />
      </g>
    );
  }

  return (
    <g
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="8"
    >
      <path d="M47 72C34 77 20 74 10 64C27 61 34 50 38 33C44 44 47 57 47 72Z" />
      <path d="M53 72C66 77 80 74 90 64C73 61 66 50 62 33C56 44 53 57 53 72Z" />
      <path d="M50 30V83" />
    </g>
  );
}

function getSeatColor(
  layout: TifoDesign["layout"],
  row: number,
  column: number,
  rows: number,
  columns: number,
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  },
) {
  const centerRow = (rows - 1) / 2;
  const centerColumn = (columns - 1) / 2;
  const distance = Math.sqrt(
    Math.pow(row - centerRow, 2) + Math.pow(column - centerColumn, 2),
  );

  if (layout === "center-emblem") {
    if (distance < 4.4) return palette.accent;
    return (row + column) % 2 === 0
      ? palette.primary
      : palette.secondary;
  }

  if (layout === "diagonal-rise") {
    const diagonal = column - row * 1.35;

    if (diagonal > 8 && diagonal < 13) return palette.accent;
    return diagonal >= 13 ? palette.secondary : palette.primary;
  }

  if (layout === "split-banner") {
    if (Math.abs(column - centerColumn) < 2) return palette.accent;
    return column < centerColumn ? palette.primary : palette.secondary;
  }

  if (distance < 2.7) return palette.accent;

  const ring = Math.floor(distance / 2);

  return ring % 2 === 0 ? palette.primary : palette.secondary;
}

function getRevealDelay(
  animation: TifoDesign["animation"],
  row: number,
  column: number,
  rows: number,
  columns: number,
) {
  if (animation === "row-wave") {
    return row * 65 + column * 5;
  }

  if (animation === "diagonal-sweep") {
    return (row + column) * 34;
  }

  if (animation === "center-out") {
    const centerRow = (rows - 1) / 2;
    const centerColumn = (columns - 1) / 2;

    return (
      Math.sqrt(
        Math.pow(row - centerRow, 2) +
          Math.pow(column - centerColumn, 2),
      ) * 42
    );
  }

  return (row % 2) * 110 + column * 8;
}

function TifoPreview({
  team,
  symbol,
  design,
  generationId,
}: {
  team: TeamId;
  symbol: SymbolId;
  design: TifoDesign;
  generationId: number;
}) {
  const teamData = teams[team];
  const columns = 26;
  const rows = 12;

  const seats = useMemo(
    () =>
      Array.from({ length: rows * columns }, (_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;

        return {
          index,
          row,
          column,
          x: 92 + column * 39,
          y: 145 + row * 31,
        };
      }),
    [],
  );

  const gradientId = `stadium-sky-${generationId}`;
  const glowId = `symbol-glow-${generationId}`;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl shadow-black/40">
      <svg
        key={generationId}
        viewBox="0 0 1200 680"
        className="block h-auto w-full"
        role="img"
        aria-label={`${teamData.name} supporter tifo reading ${design.slogan}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#07111f" />
            <stop offset="62%" stopColor="#111b31" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="1200" height="680" fill={`url(#${gradientId})`} />

        <circle cx="120" cy="90" r="4" fill="#ffffff" opacity="0.45" />
        <circle cx="248" cy="54" r="3" fill="#ffffff" opacity="0.35" />
        <circle cx="1010" cy="72" r="4" fill="#ffffff" opacity="0.4" />
        <circle cx="1100" cy="124" r="2.5" fill="#ffffff" opacity="0.3" />

        <path
          d="M42 128H1158L1098 565H102L42 128Z"
          fill="#111827"
          stroke="#334155"
          strokeWidth="6"
        />

        <path
          d="M78 137H1122L1074 538H126L78 137Z"
          fill="#020617"
          stroke="#1e293b"
          strokeWidth="3"
        />

        <g>
          {seats.map(({ index, row, column, x, y }) => {
            const delay = getRevealDelay(
              design.animation,
              row,
              column,
              rows,
              columns,
            );

            const fill = getSeatColor(
              design.layout,
              row,
              column,
              rows,
              columns,
              teamData.colors,
            );

            return (
              <rect
                key={index}
                x={x}
                y={y}
                width="28"
                height="20"
                rx="4"
                fill={fill}
                className="tifo-seat"
                style={
                  {
                    "--seat-delay": `${Math.round(delay)}ms`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </g>

        <g
          transform="translate(500 208) scale(2)"
          filter={`url(#${glowId})`}
          className="tifo-symbol"
        >
          <SymbolGlyph symbol={symbol} color={teamData.colors.accent} />
        </g>

        <rect
          x="220"
          y="515"
          width="760"
          height="100"
          rx="24"
          fill="#020617"
          opacity="0.88"
          stroke={teamData.colors.accent}
          strokeWidth="3"
          className="tifo-banner"
        />

        <text
          x="600"
          y="580"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="58"
          fontWeight="900"
          letterSpacing="4"
          className="tifo-slogan"
        >
          {design.slogan}
        </text>

        <text
          x="72"
          y="642"
          fill="#94a3b8"
          fontSize="21"
          fontWeight="700"
          letterSpacing="3"
        >
          TIFO FORGE
        </text>

        <text
          x="1128"
          y="642"
          textAnchor="end"
          fill="#94a3b8"
          fontSize="21"
          fontWeight="700"
          letterSpacing="3"
        >
          {teamData.code} · ENERGY {design.energy}
        </text>
      </svg>
    </div>
  );
}

export default function TifoForge() {
  const [selectedTeam, setSelectedTeam] = useState<TeamId>("croatia");
  const [selectedEmotion, setSelectedEmotion] =
    useState<EmotionId>("defy");
  const [selectedSymbol, setSelectedSymbol] =
    useState<SymbolId>("phoenix");

  const [design, setDesign] =
    useState<TifoDesign>(fallbackTifoDesign);
  const [source, setSource] =
    useState<"gemini" | "fallback" | null>(null);
  const [generationId, setGenerationId] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState(
    "Choose the passion you want the whole stadium to raise.",
  );

  async function generateTifo() {
    setIsGenerating(true);
    setMessage("Gemini is directing the stadium display...");

    try {
      const response = await fetch("/api/design", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team: selectedTeam,
          emotion: selectedEmotion,
          symbol: selectedSymbol,
        }),
      });

      const result = (await response.json()) as DesignResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "The design request failed.");
      }

      setDesign(result.design);
      setSource(result.source);
      setGenerationId((current) => current + 1);

      setMessage(
        result.source === "gemini"
          ? "Gemini designed the plan. Tifo Forge raised the stand."
          : "The safe fallback design kept the stadium alive.",
      );
    } catch (error) {
      console.error(error);
      setMessage(
        error instanceof Error
          ? error.message
          : "The stadium could not raise the display.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#172554_0%,_#07111f_36%,_#020617_100%)] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-4xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-300/25 bg-orange-300/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.22em] text-orange-200">
            Built for passion
          </div>

          <h1 className="text-5xl font-black tracking-[-0.055em] sm:text-6xl lg:text-8xl">
            One feeling.
            <span className="block text-orange-300">
              Fifty thousand cards.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            Choose a team, an emotion, and a symbol. Gemini directs the
            creative plan. Tifo Forge turns it into a living stadium
            mosaic.
          </p>
        </header>

        <div className="grid gap-8 xl:grid-cols-[0.88fr_1.4fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8">
            <div className="space-y-9">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-[0.24em] text-slate-300">
                    1 · Choose your team
                  </h2>
                  <span className="text-sm text-slate-500">
                    {teams[selectedTeam].region}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {teamIds.map((teamId) => {
                    const team = teams[teamId];
                    const active = selectedTeam === teamId;

                    return (
                      <button
                        key={teamId}
                        type="button"
                        onClick={() => setSelectedTeam(teamId)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-orange-300 bg-orange-300/15 shadow-lg shadow-orange-950/30"
                            : "border-white/10 bg-slate-950/45 hover:border-white/25 hover:bg-white/[0.07]"
                        }`}
                      >
                        <div className="text-2xl">{team.flag}</div>
                        <div className="mt-2 font-black">{team.name}</div>
                        <div className="mt-1 text-xs text-slate-400">
                          {team.code}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-slate-300">
                  2 · Choose the passion
                </h2>

                <div className="grid gap-3 sm:grid-cols-2">
                  {emotionIds.map((emotionId) => {
                    const emotion = emotions[emotionId];
                    const active = selectedEmotion === emotionId;

                    return (
                      <button
                        key={emotionId}
                        type="button"
                        onClick={() => setSelectedEmotion(emotionId)}
                        className={`rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-orange-300 bg-orange-300/15"
                            : "border-white/10 bg-slate-950/45 hover:border-white/25"
                        }`}
                      >
                        <div className="font-black">{emotion.label}</div>
                        <div className="mt-1 text-sm leading-6 text-slate-400">
                          {emotion.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-slate-300">
                  3 · Choose the symbol
                </h2>

                <div className="grid grid-cols-3 gap-3">
                  {symbolIds.map((symbolId) => {
                    const symbol = symbols[symbolId];
                    const active = selectedSymbol === symbolId;

                    return (
                      <button
                        key={symbolId}
                        type="button"
                        onClick={() => setSelectedSymbol(symbolId)}
                        className={`flex min-h-28 flex-col items-center justify-center rounded-2xl border p-3 text-center transition ${
                          active
                            ? "border-orange-300 bg-orange-300/15 text-orange-200"
                            : "border-white/10 bg-slate-950/45 text-slate-300 hover:border-white/25"
                        }`}
                      >
                        <svg
                          viewBox="0 0 100 100"
                          className="h-9 w-9"
                          aria-hidden="true"
                        >
                          <SymbolGlyph
                            symbol={symbolId}
                            color="currentColor"
                          />
                        </svg>
                        <span className="mt-2 text-sm font-black">
                          {symbol.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={generateTifo}
                disabled={isGenerating}
                className="w-full rounded-2xl bg-orange-300 px-6 py-5 text-base font-black uppercase tracking-[0.19em] text-slate-950 shadow-xl shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-orange-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? "Raising the stand..." : "Raise the tifo"}
              </button>

              <p className="text-center text-sm leading-6 text-slate-400">
                {message}
              </p>
            </div>
          </section>

          <section className="space-y-5">
            <TifoPreview
              team={selectedTeam}
              symbol={selectedSymbol}
              design={design}
              generationId={generationId}
            />

            <div className="grid gap-4 sm:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-6">
                <div className="text-xs font-black uppercase tracking-[0.24em] text-orange-200">
                  Creative direction
                </div>
                <p className="mt-3 text-base leading-7 text-slate-300">
                  {design.designReason}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-6">
                <div className="text-xs font-black uppercase tracking-[0.24em] text-orange-200">
                  Engine
                </div>
                <div className="mt-3 text-xl font-black">
                  {source === "gemini"
                    ? "Google Gemini"
                    : source === "fallback"
                      ? "Safe fallback"
                      : "Ready"}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Structured AI direction. Procedural stadium rendering.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-6">
              <p className="text-sm font-bold leading-7 text-slate-300">
                “{teams[selectedTeam].passionLine}”
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
