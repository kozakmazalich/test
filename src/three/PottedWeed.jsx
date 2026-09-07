import { PotMesh } from './PotMesh.jsx';
import { GoldenBloom } from './GoldenBloom.jsx';

/**
 * Composes the pot and the golden plant at the correct relative offset
 * so every consumer (main garden screen, watering overlay, entry hero)
 * shares one source of truth for the composition.
 */
export function PottedWeed({ stage, waterPulse = 0, reducedMotion = false }) {
  return (
    <group>
      <PotMesh />
      <group position={[0, -0.06, 0.05]}>
        <GoldenBloom stage={stage} waterPulse={waterPulse} reducedMotion={reducedMotion} />
      </group>
    </group>
  );
}
