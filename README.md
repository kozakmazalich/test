# The Garden — a Noviciado Digital Ritual

A private daily digital ritual, hidden inside the Noviciado brand world. Connect a wallet, receive a persistent generated identity, and water your golden garden once a day for 7 days to earn 10 collectible gold coins.

## What this is
- A premium, minimal, black-and-gold daily check-in experience
- A real Solana wallet connection (Devnet) used as identity, not as a payment flow
- A **real WebGL 3D** avatar, golden weed, and coin reward (Three.js + React Three Fiber) — genuine geometry, metallic PBR materials, real lighting/shadows, built directly from two reference images
- A gold neon light that sweeps across the avatar's face on every successful daily check-in
- A 7-day watering ritual with a 24-hour cooldown, streaks, and a weekly coin reward
- A dev-only test mode to simulate the full 7-day loop in minutes

## Explicitly flagged simplifications
- **Wallet**: uses the existing real Solana wallet-adapter integration (Devnet). The original brief also named MetaMask/WalletConnect/Coinbase (Ethereum wallets, a different chain) — that would be a separate integration; ask if you want it added.
- **Coin emblem fidelity**: the artwork on the coin's face is an **original in-app reproduction** of the reference golden-weed image, drawn at runtime on a canvas — not the literal attached file. This tool has no way to save a pasted chat image as a binary asset. To use the exact file: drop it at `src/assets/weed-emblem.png` and swap `createEmblemTexture()` in `src/three/canvasTextures.js` for a texture load of that file (one line).
- **Bundle size**: adding a real 3D engine grew the production bundle from ~200KB to ~445KB gzip. This is the honest cost of true WebGL 3D instead of a CSS fake; code-splitting is a possible follow-up if load time becomes a concern.
- **No external network calls added**: lighting/reflections use a studio environment generated procedurally in the browser (`three/addons/environments/RoomEnvironment.js`), not a fetched HDRI file.

## Run it

### Install dependencies
```bash
npm install
```

### Start the app
```bash
npm run dev
```
Then open `http://localhost:4173`. Dev mode also enables the **DEV / TEST MODE — NEXT DAY** control, which fast-forwards the simulated clock by 24 hours without bypassing the real cooldown/streak logic.

### Production build
```bash
npm run build
npm run preview
```
The dev-only `NEXT DAY` control is compiled out of production builds automatically.

## Validate
```bash
npm test
npm run check
```

## Project layout
- `index.html` — Vite entry HTML
- `src/main.jsx` — React entry point
- `src/App.jsx` — screen flow, persistence, dev mode
- `src/components/SolanaProvider.jsx` — Solana wallet provider tree
- `src/components/EntryScreen.jsx` — cinematic entry / connect wallet (3D hero)
- `src/components/AvatarSequence.jsx` — identity generation animation
- `src/components/GardenAvatar.jsx` — 3D helmet avatar
- `src/components/GardenPlant.jsx` — 3D golden weed + pot
- `src/components/DayProgress.jsx` — 7-day ritual indicator
- `src/components/WateringOverlay.jsx` — cinematic watering reaction
- `src/components/RewardSequence.jsx` — 7-day completion + 3D coin reveal
- `src/components/ProfileCard.jsx` — member profile panel
- `src/three/` — all Three.js / React Three Fiber scene code
- `src/garden/garden-logic.js` — pure ritual state machine
- `src/garden/sound-engine.js` — synthesized sound effects
- `src/styles.css` — black/gold design system and layout
- `tests/garden-logic.test.js` — automated tests
- `docs/SPEC.md` — implementation spec
- `tasks/plan.md` — implementation plan
- `tasks/todo.md` — task checklist, including remaining manual browser checks
