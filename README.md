# Tifo Forge

> **Turn supporter emotion into a stadium-wide tifo.**

Tifo Forge is a Gemini-powered football experience that converts three choices — **team, passion, and symbol** — into an animated stadium display.

**Live demo:** https://tifo-forge.vercel.app/  
**DEV submission:** https://dev.to/challenges/weekend-2026-07-09

---

## The problem

Football supporters often express passion through tifos: huge coordinated displays built from color, symbols, banners, and movement.

Most digital approaches flatten that experience into either a static image or a slogan generator. Neither captures the full stadium moment.

Tifo Forge treats the tifo as a coordinated system: **message, formation, motion, and intensity**.

---

## Why existing approaches fall short

A free-form image generator can create striking artwork, but it does not guarantee readable terrace messages, consistent stadium geometry, controlled animation, or predictable output in a live demo.

A fixed template system has the opposite problem: it is reliable, but repetitive.

Tifo Forge combines both strengths:

- **Gemini** makes the creative decisions;
- a **procedural SVG renderer** executes them consistently.

---

## Live demo

https://tifo-forge.vercel.app/

Choose a national team, a supporter emotion, and a visual symbol. Then select **Raise the Tifo**.

The reveal can be replayed, reset, or saved as an SVG artifact.

---

## Architecture

<img width="1774" height="887" alt="Tifo Forge architecture showing user selections flowing into Gemini structured output, Zod validation, a procedural SVG renderer, and the final animated stadium tifo." src="https://github.com/user-attachments/assets/e823b94d-f485-4a84-a9cd-571d09bfebc2" />

The model never writes HTML, CSS, or SVG directly. It returns a constrained plan:

```json
{
  "slogan": "SHOCK THE WORLD",
  "layout": "radiating-burst",
  "animation": "stadium-pulse",
  "energy": 95,
  "designReason": "A radiating burst of electric energy mimics a lightning strike, galvanizing the crowd to defy all doubts and roar as one."
}
```

Each field maps to a tested renderer path:

- `slogan` → terrace message
- `layout` → mosaic geometry
- `animation` → reveal sequence
- `energy` → motion and visual intensity

---

## Google AI at the center

Gemini is not a decorative text layer. It translates abstract supporter intent into coordinated visual direction:

```text
TEAM IDENTITY
+ SUPPORTER EMOTION
+ VISUAL SYMBOL
        ↓
MESSAGE
+ FORMATION
+ MOTION
+ INTENSITY
```

Successful Gemini responses are validated, normalized, and cached. If the free-tier quota is temporarily unavailable, the app uses a deterministic local plan and labels the active source clearly.

---

## Impact

Tifo Forge gives any supporter a fast way to explore how emotion, symbolism, and crowd choreography fit together.

It is designed to be:

- **immediate** — no account or upload required;
- **visual** — every choice affects the final stand;
- **replayable** — the reveal can be watched again;
- **portable** — the finished tifo can be saved as SVG;
- **accessible** — keyboard focus and reduced-motion support are included.

---

## Screenshots

### Spain · Defy · Lightning

<img width="1280" height="720" alt="Spain-themed Tifo Forge result with the chant SHOCK THE WORLD, a radiating burst formation, stadium-pulse motion, and intensity 95." src="https://github.com/user-attachments/assets/cc5e2872-f542-4b7c-97c8-30449312d046" />

### Japan · Unite · Dawn

<img width="1414" height="709" alt="Japan-themed Tifo Forge result showing the selected inputs, completed stadium tifo, and Gemini creative direction panel." src="https://github.com/user-attachments/assets/1e94f1a3-3bcf-4ff0-8625-81bae294e504" />

---

## Tech stack

- Next.js
- TypeScript
- Google Gemini API
- Zod
- Motion for React
- Procedural SVG
- Vercel

---

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

Then run:

```bash
npm run dev
```

Open http://localhost:3000.

---

## Future work

- more tested formations and reveal patterns;
- supporter-group presets for clubs and national teams;
- shareable links that preserve a generated design;
- collaborative stands where multiple supporters contribute to one tifo.

The core stays the same: Gemini directs the idea, while the renderer keeps the result clear and reliable.

---

Built for the **DEV Weekend Challenge: Passion Edition**  
Prize category: **Best Use of Google AI**
