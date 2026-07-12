# Tifo Forge

> **What should 50,000 supporters feel together?**

Tifo Forge turns a team, a supporter emotion, and a visual symbol into an animated stadium tifo directed by Google Gemini.

Instead of generating a static image, Gemini creates a structured creative plan—**chant, formation, reveal tempo, and crowd intensity**—which Tifo Forge renders procedurally as a living card mosaic.

**One feeling. One stand. One voice.**

[Launch Tifo Forge](https://tifo-forge.vercel.app/) · [DEV Weekend Challenge: Passion Edition](https://dev.to/challenges/weekend-2026-07-09)

---

## The experience

1. Choose a national team.
2. Choose what the crowd should feel: **Believe, Defy, Unite, or Remember**.
3. Choose a symbol.
4. Raise the tifo.

The stadium darkens, the mosaic forms, the emblem arrives, and a chant emerges across the stand.

Tifo Forge is designed around the emotion before kickoff: thousands of individuals becoming one crowd.

> **Hero example:** Spain · Defy · Lightning → **SHOCK THE WORLD**

<!-- Add your strongest reveal GIF here:
![Tifo Forge reveal](./public/tifo-forge-reveal.gif)
-->

## Why it stands out

Most AI creative tools stop at text or a generated image. Tifo Forge uses Gemini as a **creative director**, then turns its decisions into a responsive visual system.

Gemini chooses:

- **Message** — a short, supporter-ready chant
- **Formation** — the mosaic composition
- **Tempo** — the reveal animation
- **Intensity** — the energy of the stadium moment

The browser then renders the result with SVG geometry, national-team-inspired palettes, passion-specific patterns, and accessible motion.

## Google AI integration

The Gemini API returns validated structured output:

```json
{
  "slogan": "SHOCK THE WORLD",
  "layout": "radiating-burst",
  "animation": "stadium-pulse",
  "energy": 95,
  "designReason": "..."
}
```

That output directly controls the rendered experience—Gemini is not decorative or used only for copy.

To remain responsive on the Gemini free tier, Tifo Forge caches successful Gemini plans and includes a polished deterministic fallback for temporary quota limits. The interface always labels the engine honestly.

## Built with

- Next.js 16
- TypeScript
- React
- Motion for React
- Google Gemini API
- Zod structured-output validation
- Procedural SVG rendering
- Vercel

## Run locally

```bash
git clone https://github.com/mneang/tifo-forge.git
cd tifo-forge
npm install
```

Create `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Design principles

- **Passion first:** every choice changes the emotional direction.
- **One-screen clarity:** minimal scrolling and no unnecessary modes.
- **Inclusive visual language:** modern supporter palettes without historical, military, political, or controversial flag references.
- **Accessible motion:** reduced-motion support and restrained effects without strobing.
- **Resilient by design:** Gemini-first generation with transparent fallback behavior.

## Challenge

Built for the **DEV Weekend Challenge: Passion Edition**, where entries are judged on theme relevance, creativity, technical execution, writing quality, and meaningful use of prize-category technology.

Tifo Forge enters the **Best Use of Google AI** category.

## License

MIT

---

Built solo during the challenge window.

**Directed by Gemini. Rendered procedurally. Raised by the crowd.**