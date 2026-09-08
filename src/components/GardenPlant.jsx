import { Canvas } from '@react-three/fiber';
import { StudioEnvironment } from '../three/StudioEnvironment.jsx';
import { PottedWeed } from '../three/PottedWeed.jsx';

/**
 * The golden garden sculpture, rendered as a real WebGL 3D scene
 * (faceted extruded gold blades in a lathed obsidian pot) built
 * directly from the reference image, replacing the previous CSS
 * approximation entirely.
 */
export function GardenPlant({ stage, reducedMotion = false }) {
  const isFinalForm = stage >= 7;

  return (
    <div className={`garden-plant${isFinalForm ? ' is-final-form' : ''}`} aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 5.8], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
      >
        <StudioEnvironment />
        <PottedWeed stage={stage} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
