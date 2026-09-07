import { StudioEnvironment } from './StudioEnvironment.jsx';
import { CoinMesh } from './CoinMesh.jsx';

const TOTAL_COINS = 10;
const ARC_RADIUS = 2.6;
const ARC_SPAN = Math.PI * 0.9;

function coinPosition(index, total) {
  const t = total > 1 ? index / (total - 1) : 0.5;
  const angle = -ARC_SPAN / 2 + t * ARC_SPAN;
  const x = Math.sin(angle) * ARC_RADIUS;
  const z = -Math.cos(angle) * ARC_RADIUS * 0.4;
  const y = Math.cos(angle * 1.4) * 0.5 - 0.2;
  return [x, y, z];
}

/**
 * The Day 7 reward composition: real 3D gold coins materializing one
 * by one into an elegant arc, each rotating with metallic reflections,
 * then flying toward the balance on claim — not popping 2D icons.
 */
export function RewardCoinsScene({ visibleCount, claiming, reducedMotion }) {
  return (
    <>
      <StudioEnvironment />
      {Array.from({ length: visibleCount }, (_, index) => (
        <CoinMesh
          key={index}
          position={coinPosition(index, TOTAL_COINS)}
          revealDelay={reducedMotion ? 0 : index * 0.03}
          exiting={claiming}
        />
      ))}
    </>
  );
}
