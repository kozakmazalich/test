# The Garden — 3D Visual Upgrade Checklist

- [x] Task 1: Install and verify `three` + `@react-three/fiber`
  - Acceptance: React 19-compatible versions installed; production build succeeds
  - Verify: `npm run build`
  - Files: `package.json`

- [x] Task 2: Procedural studio environment
  - Acceptance: metallic materials get realistic reflections with zero external network requests
  - Verify: manual browser check (Network tab shows no HDRI/texture fetches)
  - Files: `src/three/StudioEnvironment.jsx`

- [x] Task 3: Avatar as real 3D helmet with gold neon check-in scan
  - Acceptance: fixed (non-randomized) helmet matches the reference image; a gold neon band sweeps the dome on every successful watering
  - Verify: manual browser check — water the garden, confirm the scan plays and fades
  - Files: `src/three/HelmetMesh.jsx`, `src/components/GardenAvatar.jsx`

- [x] Task 4: Golden weed as real faceted 3D sculpture
  - Acceptance: 5 extruded, beveled gold blades fan from one base point, matching the reference image; growth increases with `stage`
  - Verify: manual browser check across dev-mode `NEXT DAY` presses
  - Files: `src/three/WeedBlades.jsx`, `src/three/PotMesh.jsx`, `src/three/PottedWeed.jsx`, `src/components/GardenPlant.jsx`

- [x] Task 5: Cinematic watering reaction
  - Acceptance: water/light enters the pot, the weed reacts, light travels through the blades, particles rise
  - Verify: manual browser check — trigger `WATER THE GARDEN`
  - Files: `src/three/WateringScene.jsx`, `src/components/WateringOverlay.jsx`

- [x] Task 6: Real 3D gold coins with the emblem texture-mapped onto the face
  - Acceptance: genuine thickness, beveled rim, metallic material, front/back/side geometry, emblem visible on the obverse face
  - Verify: manual browser check — reach Day 7 in dev mode and view the reward
  - Files: `src/three/CoinMesh.jsx`, `src/three/canvasTextures.js`

- [x] Task 7: Cinematic Day 7 reward composition
  - Acceptance: coins materialize one by one into an arc, rotate, then fly toward the balance on claim
  - Verify: manual browser check — complete a full 7-day dev-mode cycle
  - Files: `src/three/RewardCoinsScene.jsx`, `src/components/RewardSequence.jsx`

- [x] Task 8: Cinematic main-page hero
  - Acceptance: avatar + weed shown together as 3D collectible objects in a dark, lit scene before wallet connect
  - Verify: manual browser check on the entry screen
  - Files: `src/components/EntryScreen.jsx`

- [x] Task 9: CSS cleanup
  - Acceptance: no dead CSS classes/keyframes remain from the removed CSS-based visuals
  - Verify: `grep` for old class names returns no matches
  - Files: `src/styles.css`

- [x] Task 10: Final verification
  - Acceptance: tests pass, build succeeds, dev-only control excluded from the bundle, diagnostics clean
  - Verify: `npm test`, `npm run build`, `grep -c "NEXT DAY" dist/assets/*.js` (expect 0), diagnostics
  - Files: whole project

## Manual checks still needed (require a real browser + wallet extension)
- [ ] Confirm the gold neon scan is clearly visible and readable on real hardware
- [ ] Confirm coin rotation/reflections look correct on a lower-end GPU/mobile device
- [ ] Confirm `prefers-reduced-motion` (OS-level) and the in-app "REDUCE MOTION" toggle both calm the 3D scenes as expected
- [ ] Confirm frame rate stays smooth with the watering overlay and reward sequence open at the same time as the main garden scene mounted behind them
