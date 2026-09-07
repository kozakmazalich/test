# Spec: The Garden — a Noviciado Digital Ritual

## Objective
A premium daily digital ritual, hidden inside the Noviciado brand world. A member connects a wallet, receives a persistent generated identity (avatar + garden), and performs one daily "watering" ritual for 7 days. Completing a 7-day cycle awards 10 collectible gold coins, then the cycle resets.

The avatar, golden weed, and coins are rendered as **real WebGL 3D objects** (Three.js via React Three Fiber) — genuine geometry, physically based metallic/glass materials, real lighting and shadows, and real texture-mapped surfaces — not CSS/SVG approximations.

### Assumptions and explicitly flagged deviations
1. **Wallet stack**: the app uses a real, working **Solana** wallet-adapter integration (from a prior session), restyled to Noviciado copy. The original brief named MetaMask/WalletConnect/Coinbase (Ethereum wallets, a different chain); adding that is a separate, deferred integration.
2. **3D engine**: this pass adds `three` and `@react-three/fiber` (React 19-compatible) as real dependencies. Lighting/reflections use a **procedurally generated studio environment** (`three/addons/environments/RoomEnvironment.js`) built entirely in the browser — no external HDRI or texture is fetched over the network, so the app remains self-contained.
3. **Coin/emblem artwork — important honest limitation**: the "golden weed" emblem textured onto the coin faces is an **original in-app reproduction** (drawn at runtime on an offscreen canvas, using the same five-blade fan geometry as the 3D plant), not a decoded copy of the user-attached chat image. This tool has no mechanism to save a pasted chat attachment as a binary asset file. For pixel-exact fidelity, drop the real file at `src/assets/weed-emblem.png` and swap `createEmblemTexture()` in `src/three/canvasTextures.js` for a `TextureLoader` load of that file.
4. **Bundle size**: adding a real 3D engine increased the production JS bundle from ~200KB gzip to ~445KB gzip. This is disclosed as a deliberate, honest tradeoff for genuine 3D rendering rather than a CSS fake — no code-splitting/lazy-loading was added in this pass, since the 3D hero is visible on the very first screen.
5. **Dev/Test mode**: implemented via Vite's real `import.meta.env.DEV` flag, so the `NEXT DAY` control is compiled out of production builds — verified by grepping the built bundle.

## Tech Stack
- React + Vite
- `three`, `@react-three/fiber` (real WebGL 3D — no `drei`, kept dependency-light and free of any CDN asset fetch)
- `@solana/wallet-adapter-react` + `-react-ui` + `-base`, `@solana/web3.js`
- Web Audio API for synthesized sound (no audio files)
- Node.js built-in test runner for the garden state machine
- `localStorage` for per-wallet persistence

## Commands
- Start locally: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`
- Run tests: `npm test`
- Syntax/build check: `npm run check`

## Project Structure
- `index.html` → Vite entry HTML
- `src/main.jsx` → React entry point
- `src/App.jsx` → screen orchestration, persistence, dev mode
- `src/components/SolanaProvider.jsx` → Solana wallet provider tree
- `src/components/EntryScreen.jsx` → cinematic entry / connect wallet (3D hero)
- `src/components/AvatarSequence.jsx` → identity generation sequence
- `src/components/GardenAvatar.jsx` → 3D helmet avatar (Canvas wrapper)
- `src/components/GardenPlant.jsx` → 3D golden weed + pot (Canvas wrapper)
- `src/components/DayProgress.jsx` → 7-day ritual indicator
- `src/components/WateringOverlay.jsx` → cinematic watering reaction (3D)
- `src/components/RewardSequence.jsx` → 7-day completion + 3D coin reveal
- `src/components/ProfileCard.jsx` → member profile panel
- `src/three/StudioEnvironment.jsx` → procedural lighting/reflections rig
- `src/three/canvasTextures.js` → canvas-drawn emblem/label textures
- `src/three/HelmetMesh.jsx` → the fixed avatar helmet + gold neon scan
- `src/three/WeedBlades.jsx` → the 5-blade extruded golden weed sculpture
- `src/three/PotMesh.jsx` / `PottedWeed.jsx` → the pot and pot+weed composition
- `src/three/WateringScene.jsx` → the watering reaction scene
- `src/three/CoinMesh.jsx` / `RewardCoinsScene.jsx` → the 3D coin and reward composition
- `src/garden/garden-logic.js` → pure, deterministic ritual state machine
- `src/garden/sound-engine.js` → Web Audio synthesized chimes
- `src/styles.css` → black/gold layout, typography, panels (3D objects render inside sized wrapper `<div>`s)
- `tests/garden-logic.test.js` → automated tests for the ritual state machine

## Code Style
- Keep the ritual state machine pure and deterministic (`src/garden/garden-logic.js`) — untouched by this visual pass
- Keep 3D scene composition (`src/three/*`) separate from React screen/state components
- Dispose Three.js geometries, materials, and textures on unmount (see `useEffect` cleanup in every `src/three/*` file) to avoid GPU memory leaks
- Gate all continuous 3D motion behind a `reducedMotion` prop; short, purposeful state-change animations (e.g. the water-pulse glow) may still play briefly under reduced motion

## Testing Strategy
- `node --test` covers the ritual state machine (untouched by this pass)
- 3D rendering is verified by a successful production build and manual browser/device checks (see `tasks/todo.md`)

## Boundaries
- Always: keep wallet handling client-side, keep the dev-only control excluded from production builds, dispose 3D resources on unmount, keep the daily ritual frictionless (no gas, no signing)
- Ask first: adding a second (EVM) wallet stack, adding `drei` or any CDN-hosted HDRI/texture, adding paid/speculative token mechanics
- Never: make the coins read as a tradeable financial asset, punish a missed day by destroying progress, ship secrets/keys in code

## Success Criteria
- Avatar, golden weed, and coins are real WebGL 3D objects with genuine depth, metallic PBR materials, and real lighting/shadows
- The coin's obverse face carries the emblem artwork as a real texture map, not a flat icon
- The gold neon check-in scan light travels across the avatar's face on every successful watering
- The watering reaction (light enters pot → plant responds → light travels through blades → particles) plays as a real 3D scene
- The Day 7 reward plays as a cinematic 3D coin composition, not popping icons
- Reduced motion and a sound toggle are both respected
- Progress survives a page refresh; the ritual state machine remains fully tested and untouched

## Open Questions
- Do you want the literal attached image file wired in as the coin texture (drop it at `src/assets/weed-emblem.png`)?
- Do you want a second, EVM-specific wallet stack in addition to Solana?
- Is the current bundle-size tradeoff (~445KB gzip) acceptable, or should a follow-up add code-splitting for the 3D chunk?
