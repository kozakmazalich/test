# Implementation Plan: The Garden — a Noviciado Digital Ritual

## Overview
Replace every CSS/SVG-faked visual (avatar, golden weed, coins, main-page hero) with real WebGL 3D objects built with Three.js and React Three Fiber, based directly on the two reference images, while leaving the ritual state machine, wallet integration, layout, and copy untouched.

## Architecture Decisions
- Add `three` + `@react-three/fiber@9` (React 19-compatible) as real dependencies; skip `drei` to avoid its default CDN-hosted asset fetches and keep the app fully self-contained.
- Build lighting/reflections from a **procedural** environment (`three/addons/environments/RoomEnvironment.js` + `PMREMGenerator`) — no network calls for HDRI/textures.
- Compose all 3D content in `src/three/`, consumed by thin wrapper components (`GardenAvatar`, `GardenPlant`, and the 3D portions of `EntryScreen`, `WateringOverlay`, `RewardSequence`) that keep their existing external prop contracts unchanged, so `App.jsx` needed only minimal, additive edits.
- Build the golden weed as 5 `ExtrudeGeometry` blades (real bevels) fanning from one base point, matching the reference image's silhouette; growth and the watering light-pulse are driven by `useFrame`, not CSS transitions.
- Build the avatar as a partial-sphere dome + capsule rails + partial-torus chin band, matching the reference helmet image; the gold neon check-in scan is a real 3D band animated via `useFrame`, hugging the dome's curvature.
- Build coins as a real `CylinderGeometry` (genuine thickness) with beveled-rim `TorusGeometry` rings, and the emblem drawn onto a `CanvasTexture` mapped onto the coin's front face group.
- Disclose, rather than paper over, two real constraints: (1) the emblem texture is an original in-app reproduction, since the tool cannot extract a pasted chat image as a binary asset file; (2) the production bundle grew substantially (~200KB → ~445KB gzip) as the real cost of shipping true 3D instead of a CSS fake.

## Task List

### Phase 1: 3D foundation
- [x] Task 1: Add `three` + `@react-three/fiber`, verify React 19 compatibility
- [x] Task 2: Build `StudioEnvironment` (procedural lighting/reflections, no network calls)
- [x] Task 3: Build `canvasTextures.js` (emblem, reverse, and day-label textures)

### Checkpoint: Foundation
- [x] Production build succeeds with the new dependencies
- [x] No external network requests introduced

### Phase 2: Avatar, weed, and pot
- [x] Task 4: Build `HelmetMesh` (dome, rails, chin band, gold neon scan light)
- [x] Task 5: Build `WeedBlades`, `PotMesh`, `PottedWeed` (growth lerp + watering light-pulse reaction)
- [x] Task 6: Rewire `GardenAvatar` and `GardenPlant` to render these scenes, keeping their existing prop contracts

### Checkpoint: Core objects
- [x] Avatar and weed render with real depth, PBR materials, and shadows
- [x] Growth stage and check-in scan still driven by the same external props as before

### Phase 3: Coins and cinematic sequences
- [x] Task 7: Build `CoinMesh` (real thickness, beveled rim, texture-mapped emblem) and `RewardCoinsScene`
- [x] Task 8: Build `WateringScene` (droplet, plant reaction, particles) and rewire `WateringOverlay`
- [x] Task 9: Rewire `RewardSequence` to the 3D coin composition, including the fly-to-balance exit
- [x] Task 10: Rewire `EntryScreen`'s hero to a 3D avatar+weed composition

### Checkpoint: Cinematics
- [x] Watering plays a real 3D reaction, not CSS droplets
- [x] Day 7 reward plays a real 3D coin composition, not popping icons

### Phase 4: Cleanup and verification
- [x] Task 11: Remove all now-dead CSS (old helmet/blade/entry/watering/coin rules and keyframes)
- [x] Task 12: Update docs with the two honest limitations (emblem fidelity, bundle size) and run full verification

### Checkpoint: Complete
- [x] `npm test` passes (ritual state machine untouched)
- [x] `npm run build` succeeds; dev-only control still excluded from the bundle
- [x] No dead CSS classes or unused component references remain
- [x] Ready for review

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Bundle size increase hurts load time | Medium | Disclosed explicitly; code-splitting offered as a follow-up if needed |
| Emblem texture isn't pixel-identical to the attached file | Medium | Disclosed explicitly with a one-line swap path once the real file is added to the repo |
| Multiple simultaneous `<Canvas>` instances strain low-end devices | Low | Each scene is a handful of low-poly primitives; `reducedMotion` disables continuous idle motion |
| Reduced motion regresses under 3D | Medium | Every scene threads a `reducedMotion` prop that disables continuous animation while keeping short, purposeful state-change transitions |

## Open Questions
- See `docs/SPEC.md` Open Questions (real emblem file, EVM wallet, bundle-size follow-up)
