# Lovable Design Brief — "The Garden" by Noviciado

A complete instruction pack for lovable.dev. Build the UI/UX exactly to this
brief, then polish it beyond it: the goal is a premium, cinematic,
black-and-gold daily ritual that feels like a private luxury object, not a
dashboard.

---

## 1. One-sentence mission

> A private daily ritual: connect your wallet, receive a generated 3D golden
> identity, water your garden once every 24 hours for 7 days, and earn a
> collectible gold coin — wrapped in a premium, minimal, black-and-gold
> experience.

## 2. Product context (what already exists)

The app is a React + Vite SPA (current design is a baseline, not a ceiling):

- **Entry screen** — cinematic hero, wallet connect (Solana, Devnet)
- **Identity generation** — avatar "assembles" from fragments after first connect
- **Garden screen** — 3D avatar + 3D golden plant side by side, day progress (7 days), water CTA or cooldown countdown
- **Watering overlay** — full-screen cinematic reaction when watering succeeds
- **Reward sequence** — after day 7: 3D coin reveal, +10 coins, streak stats
- **Profile card** — wallet address, avatar traits, garden number, streaks, coin balance
- 24h cooldown, streaks, weekly reward, localStorage persistence per wallet

You are **redesigning the presentation layer**. Keep the flow and states
identical, make everything look and feel 10x more premium.

## 3. Brand & visual direction

**Moodboard keywords:** private ritual, luxury, occult-minimal, museum at
midnight, candle-lit gold, quiet power, cinematic stillness.

**Reference vibes (direction only, do not copy):** dark high-end watch
landing pages, A24 title sequences, jewelry boutiques, "The Garden" aesthetic
— black velvet + aged gold + soft radial light.

### Color tokens (use these exact values)

| Token | Hex | Role |
| --- | --- | --- |
| `--noir` | `#060605` | App background, deepest black |
| `--noir-2` | `#0d0c0a` | Elevated surfaces |
| `--panel` | `#111009` | Cards, panels |
| `--panel-border` | `rgba(201,164,92,0.22)` | Hairline gold borders |
| `--ivory` | `#ece6d8` | Primary text |
| `--muted` | `#8f8676` | Secondary text, labels |
| `--gold` | `#cfa356` | Primary accent, CTA |
| `--gold-soft` | `#e8cf9a` | Hover accent, gradients |
| `--champagne` | `#f3e2b8` | Headings, highlights |
| `--bronze` | `#6b4a26` | Deep accent, shadows |
| `--smoke` | `rgba(20,18,14,0.72)` | Overlay scrim |
| `--danger` | `#d98a6b` | Errors only |

Rules:
- Always dark mode. Never a light background.
- Gold is precious: use it for one primary action per screen, progress, and
  key numerals. Do not spray gold everywhere.
- Gradients: subtle `--gold` → `--gold-soft` on primary CTA; radial light
  pools (`#14120c` → `--noir`) behind heroes.

### Typography

- **Display (headings, hero numerals):** a refined serif with high contrast
  (e.g. Cormorant Garamond, Playfair Display, or Fraunces) — elegant, not
  gothic.
- **Labels/UI:** uppercase, letterspacing 0.14em–0.3em, small sizes
  (0.66–0.78rem), muted or champagne color. Keep the "kicker + title" pairing
  (e.g. `NOVICIADO` / `THE GARDEN`).
- **Numerals (timers, day counts, balances):** tabular figures
  (`font-variant-numeric: tabular-nums`) so countdowns don't jitter.
- Load from Google Fonts, 2 families max.

## 4. Screen-by-screen spec

### 4.1 Entry screen

- Centered composition on `--noir`, radial gold light pool behind content.
- Brand: small `NOVICIADO` kicker, large `THE GARDEN` display title,
  one-line poetic subtitle ("A seven-day ritual. One gold coin.")
- Wallet connect button (Solana wallet adapter UI): gold-outlined pill,
  gold fill on hover, subtle glow. Wallet selection modal styled to match
  (dark panels, gold accents).
- Optional flourish: slow floating gold dust particles (CSS/canvas, cheap),
  faint vignette, "scroll-free" — everything fits one viewport.
- Footer whisper: "A private digital ritual by Noviciado."

### 4.2 Identity generation (AvatarSequence)

- Cinematic sequence: 6 avatar "fragments" fly in from screen edges and
  assemble into the 3D avatar with a soft gold flash.
- Progress captions in muted uppercase ("CULTIVATING IDENTITY…",
  "GARDEN № 0007").
- Respect reduced-motion: skip animation, show final state with a fade.

### 4.3 Garden screen (main)

- Two-column stage on desktop (avatar | plant), stacked/compact on mobile.
- Both subjects on invisible pedestals with soft radial light pools.
- **Ritual panel** below: `DAY 03 / 07` label, status line (`aria-live`),
  then either:
  - `WATER THE GARDEN` — the only gold CTA on screen, generous hit area;
  - `GARDEN WATERED — NEXT RITUAL IN 14:32:07` — tabular countdown.
- Day progress: 7 gold segments (halo or rail), completed = filled gold,
  current = pulsing champagne, future = faint outline.
- Header: brand left, right: SOUND toggle, MOTION toggle, MEMBER (profile).
  Icon-style quiet buttons, gold hover states.
- Footer: "X DAYS UNTIL REWARD" when relevant.
- Empty states matter: everything idle still looks composed.

### 4.4 Watering overlay

- Full-screen cinematic takeover: gold light sweeps across the avatar's face,
  plant grows one stage, particles rise, then overlay dissolves.
- No interaction needed; auto-advance. ~3–4s, skippable via reduced-motion.

### 4.5 Reward sequence

- Day 7 climax: 3D gold coin spins in, soft bloom, "+10 COINS", streak and
  week stats, then a "CONTINUE" close.
- Confetti restrained: gold dust, not carnival.

### 4.6 Profile card

- Dark panel, hairline gold border, rounded corners (16–20px), soft shadow.
- Rows: wallet address (truncated, copyable), avatar traits, garden number,
  current/longest streak, completed weeks, coin balance (gold numeral).
- Close: X top-right or click-outside + Esc.

## 5. Motion & micro-interactions

- Principle: **quiet luxury**. Ease everything (`cubic-bezier(0.22,1,0.36,1)`),
  durations 300–700ms for UI, up to 4s only for cinematic overlays.
- Hover: buttons lift 1–2px, gold border brightens, faint glow — never jumpy.
- Press: subtle scale 0.98.
- Countdown ticking must not cause layout shift (tabular numerals).
- Screen transitions: gentle crossfade + 10px rise.
- Sound toggle: on/off chime is synthesized in-app (already exists).
- **Reduced motion:** `prefers-reduced-motion` collapses all cinematics to
  short fades, disables particles and glow pulses. Provide an in-app
  REDUCE MOTION toggle too.

## 6. UX principles

- **One primary action per screen.** The ritual CTA is always obvious.
- **Mobile-first.** This is a daily phone ritual; design at 375px width first,
  then make the desktop layout a composed two-column stage. Never horizontal
  scroll.
- **Accessibility (WCAG AA):**
  - Text contrast ≥ 4.5:1 on `--noir` (ivory/champagne pass; keep muted text
    for decorative labels only, paired with readable info).
  - Visible focus rings (gold outline) on all interactive elements.
  - `aria-live="polite"` for status/cooldown changes.
  - Buttons ≥ 44px hit area on mobile.
  - All icons/text-only toggles get `aria-pressed` / accessible labels.
- **Copy tone:** sparse, ceremonial, uppercase micro-labels. No exclamation
  marks, no marketing noise.
- Empty/loading states styled, never raw text on black.

## 7. Technical requirements (Lovable)

- **Stack:** React + Vite + Tailwind CSS (or CSS variables matching the
  tokens above). Framer Motion for UI animation.
- **3D:** avatar, golden plant, and coin are real WebGL — Three.js +
  React Three Fiber (already in the project, keep them). If WebGL is
  unavailable, fall back gracefully to a styled SVG/CSS placeholder instead
  of a blank box.
- **Wallet:** `@solana/wallet-adapter-react` (Devnet), connection state used
  as identity. Keep wallet-adapter's modal but restyle it.
- **State/persistence:** localStorage per wallet address
  (`noviciado-garden:<address>`); prefs at `noviciado-garden-prefs`
  (soundOn, reducedMotion). Do not change the data schema.
- **Logic:** reuse the existing pure state machine (`garden-logic.js`
  semantics): 7-day cycle, 24h cooldown, streaks, reward pending → claimed.
- **Organization:** one component per screen state; design tokens in a single
  place; no inline magic values.
- **No lorem ipsum, no fake data, no placeholders** — real copy from this
  brief.
- Deliver desktop + mobile layouts; verify no layout break at 320px and
  1440px.

## 8. What NOT to do

- No light theme, no rainbow gradients, no glassmorphism.
- No emoji icons, no generic SaaS landing-page hero, no carousels.
- No white or blue buttons. No third-party font bloat beyond 2 families.
- Do not add new screens, gamification loops, leaderboards, or social features.
- Do not change the ritual logic (7 days, 24h cooldown, +10 coins).

## 9. Acceptance checklist (for Lovable's final pass)

- [ ] All 6 screens exist and match the flow (entry → generating → garden → watering → reward → profile).
- [ ] Exact color tokens used; dark-only; gold used sparingly.
- [ ] Serif display + uppercase micro-labels pairing.
- [ ] Garden screen works at 375px and 1440px without scroll/overflow.
- [ ] One obvious gold CTA per screen; countdown uses tabular numerals.
- [ ] Reduced-motion path: cinematics collapse to fades.
- [ ] Focus states, aria-live, ≥44px targets, WCAG AA contrast.
- [ ] WebGL subjects render; graceful fallback when WebGL unavailable.
- [ ] Wallet connect works on Devnet; state persists per wallet.
- [ ] No lorem ipsum, no placeholder assets.

---

## 10. Single prompt to paste into Lovable

Paste this first, then iterate screen-by-screen using Section 4.

```
Build a premium, minimal, black-and-gold "daily ritual" web app called
THE GARDEN by NOVICIADO, in React + Vite + Tailwind, mobile-first.

Concept: connect a Solana wallet (Devnet, wallet-adapter) to receive a
generated 3D identity; water your golden garden once every 24 hours for
7 days; after day 7 earn a collectible gold coin. Private, ceremonial,
luxury — dark museum at midnight, candle-lit gold.

Design system (use exactly):
background #060605, elevated #0d0c0a, panels #111009 with hairline gold
borders rgba(201,164,92,0.22), text ivory #ece6d8, muted #8f8676,
gold #cfa356, gold-soft #e8cf9a, champagne #f3e2b8, bronze #6b4a26.
Typography: refined high-contrast serif (Fraunces or Cormorant) for
display, uppercase micro-labels with 0.14–0.3em letterspacing for UI,
tabular numerals for timers. Always dark mode.

Screens:
1. Entry — cinematic hero, radial gold light, NOVICIADO kicker +
   THE GARDEN title, poetic subtitle, gold-outlined wallet connect.
2. Identity generation — 6 avatar fragments assemble with a gold flash.
3. Garden — 3D avatar + 3D golden plant stage, DAY 03/07 label,
   gold "WATER THE GARDEN" CTA or "NEXT RITUAL IN 14:32:07" countdown,
   7-segment gold day progress, quiet header toggles (sound, motion,
   member profile).
4. Watering — full-screen gold light sweep, plant grows one stage,
   dissolves after ~3s.
5. Reward — 3D coin reveal, +10 COINS, streaks, CONTINUE.
6. Profile — dark gold-bordered card: address, traits, streaks,
   coin balance.

Motion: quiet luxury easing (cubic-bezier(0.22,1,0.36,1)), 300–700ms UI,
up to 4s cinematics; respect prefers-reduced-motion; visible gold focus
rings; aria-live statuses; ≥44px targets; WCAG AA contrast.

3D: keep Three.js + React Three Fiber for avatar/plant/coin with a
graceful SVG fallback. State persists per wallet in localStorage.

Rules: one gold CTA per screen, no light theme, no glassmorphism, no
emoji, no lorem ipsum, no extra screens or gamification. Deliver mobile
(375px) and desktop (1440px) layouts that never overflow.
```
