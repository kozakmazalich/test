import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { WateringScene } from '../three/WateringScene.jsx';

export function WateringOverlay({ onComplete, reducedMotion, fromStage = 0, toStage = 1 }) {
  const [phase, setPhase] = useState(reducedMotion ? 'result' : 'pouring');

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const timers = [
      setTimeout(() => setPhase('settling'), 1200),
      setTimeout(() => setPhase('result'), 2600),
    ];

    return () => timers.forEach(clearTimeout);
  }, [reducedMotion]);

  return (
    <div className="watering-overlay" role="status" aria-live="polite">
      <div className="watering-sweep" aria-hidden="true" />

      <button type="button" className="overlay-skip" onClick={onComplete}>
        Skip
      </button>

      <div className="watering-canvas" aria-hidden="true">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.5, 5.8], fov: 38 }}
          gl={{ alpha: true, antialias: true }}
        >
          <WateringScene fromStage={fromStage} toStage={toStage} phase={phase} reducedMotion={reducedMotion} />
        </Canvas>
      </div>

      {phase === 'result' ? (
        <div className="watering-result">
          <p className="result-title">The garden remembers.</p>
          <p className="result-caption">Growth stage {String(toStage).padStart(2, '0')} received</p>
          <button type="button" className="primary-button" onClick={onComplete}>
            Continue
          </button>
        </div>
      ) : null}
    </div>
  );
}
