# Deck Snap (Next.js)

A snap-style card game built with Next.js (App Router) + TypeScript + Tailwind CSS.

Draw from a shuffled deck, show current & previous cards, detect SNAP (value / suit / both), keep a counter, and display probabilities for the next draw.

API: https://deckofcardsapi.com (no API key required)

---

## Features

- Shuffled deck initialization
- Draw a card; previous/current card panes
- SNAP detection
  - "SNAP VALUE!", "SNAP SUIT!", "SNAP BOTH!" banner + optional sound
- Counter: "Card N of 52"
- Probabilities for the next draw
  - P(value match), P(suit match), P(either)
- Reshuffle resets state
- Test suite (Jest + Testing Library)

---

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Jest + @testing-library/react + jsdom

---

## Getting Started

1) Install

```bash
npm install
```

2) Run the dev server

```bash
npm run dev
# open http://localhost:3000
```

3) Optional: add a snap sound

Place a short sound file at `public/snap.mp3`. It plays whenever a SNAP occurs.

---

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "test": "jest --passWithNoTests",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

**Run tests:**

```bash
npm test
```

---

## Project Structure

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    CardImage.tsx
    ui/
      Button.tsx
  hooks/
    useDeck.ts
  lib/
    deckApi.ts
  __tests__/
    page.test.tsx
    useDeck.prob.test.tsx
jest.config.js
jest.setup.ts
tsconfig.json
tsconfig.jest.json
tailwind.config.js
postcss.config.js
public/
  snap.mp3   (optional)
```

---

## How It Works

- `lib/deckApi.ts` wraps the Deck of Cards API (create deck, draw 1, reshuffle).
- `hooks/useDeck.ts` holds game state:
  - `deckId`, `current`, `previous`, `remaining`
  - counts of drawn by value and suit (for probability math)
  - `draw()`, `reset()`, computed `snap`, `probabilities`, `counterText`
- `app/page.tsx` renders the UI and plays a small sound when SNAP occurs.
- `components/CardImage.tsx` displays a card with a simple fade-in.
- `components/ui/Button.tsx` provides rounded, accessible buttons using Tailwind.

### Probability logic (next card)

Given the current card:

- Same value remaining = `3 - (seenValueCount - 1)` (min 0)
- Same suit remaining  = `12 - (seenSuitCount - 1)` (min 0)
  - We subtract `1` to exclude the current card.
- Either (value or suit) = `valueRemaining + suitRemaining`
- Probability = `favourable / remainingCards`

---

## Configuration Notes

- Path alias `@/*` -> `./src/*` (see `tsconfig.json`).
- Tailwind scans `src/**` for classes (see `tailwind.config.js`).
- Tests use `ts-jest` with a Jest-only TS config:
  - `tsconfig.jest.json` sets `"jsx": "react-jsx"` so Jest compiles TSX.

---

## Troubleshooting

- **Tailwind classes not applying**
  - Ensure `tailwind.config.js` has `content: ["./src/**/*.{ts,tsx}"]`
  - Confirm `import "./globals.css"` is present in `src/app/layout.tsx`
  - Restart `npm run dev` after config changes

- **Windows PowerShell & `npx` quirks**
  - If `npx tailwindcss ...` fails, try `npm exec tailwindcss init -p`
  - Avoid `\` line breaks; PowerShell uses backticks (`) for multiline

- **Jest "Unexpected token <" in tests**
  - Ensure `jest.config.js` points `ts-jest` to `tsconfig.jest.json` (with `"jsx": "react-jsx"`)

---

## Accessibility

- Buttons are keyboard-focusable with visible focus rings.
- SNAP banner is text-based and announced to screen readers.

---

## Roadmap / Ideas

- Persist deck across refresh via localStorage
- "Draw 5" auto-draw with small delays
- History list of drawn cards
- Theme toggle (light/dark)

---

## Deployment

**Vercel**

1. Push this repo to GitHub/GitLab.
2. Import the project in Vercel.
3. Build & deploy (no env vars required).

**Self-host**

```bash
npm run build
npm start
# http://localhost:3000
```

---

## License

MIT
