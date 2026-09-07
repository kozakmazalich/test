import { useEffect, useState } from 'react';
import { GardenAvatar } from './GardenAvatar.jsx';
import { playIdentityChime } from '../garden/sound-engine.js';

export function AvatarSequence({ traits, gardenNumber, onEnter, soundOn, reducedMotion }) {
  const [phase, setPhase] = useState(reducedMotion ? 'ready' : 'assembling');

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    playIdentityChime(soundOn);
    const createdTimer = setTimeout(() => setPhase('created'), 1600);
    const readyTimer = setTimeout(() => setPhase('ready'), 2500);

    return () => {
      clearTimeout(createdTimer);
      clearTimeout(readyTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <section className="avatar-sequence">
      <p className="sequence-kicker">
        {phase === 'assembling' ? 'GENERATING YOUR IDENTITY…' : 'IDENTITY CREATED'}
      </p>

      <div className={`assembly-stage phase-${phase}`}>
        {phase === 'assembling' ? (
          <div className="assembly-fragments" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className="fragment" style={{ animationDelay: `${index * 0.12}s` }} />
            ))}
          </div>
        ) : (
          <GardenAvatar traits={traits} size="large" />
        )}
      </div>

      {phase === 'ready' ? (
        <div className="sequence-ready">
          <p className="sequence-garden">GOLDEN GARDEN {gardenNumber}</p>
          <p className="sequence-subtitle">YOUR GARDEN AWAITS</p>
          <button type="button" className="primary-button" onClick={onEnter}>
            ENTER
          </button>
        </div>
      ) : null}
    </section>
  );
}
