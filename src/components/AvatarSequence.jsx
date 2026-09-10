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
        {phase === 'assembling' ? 'Cultivating identity…' : 'Identity created'}
      </p>

      <div className={`assembly-stage phase-${phase}`}>
        {phase === 'assembling' ? (
          <div className="assembly-fragments" aria-hidden="true">
            {Array.from({ length: 6 }, (_, index) => (
              <span key={index} className="fragment" style={{ animationDelay: `${index * 0.16}s` }} />
            ))}
          </div>
        ) : (
          <GardenAvatar traits={traits} size="large" />
        )}
      </div>

      <p className="sequence-garden">Garden {gardenNumber}</p>
      <div className="sequence-progress" aria-hidden="true">
        <span />
      </div>

      {phase === 'ready' ? (
        <div className="sequence-ready">
          <p className="sequence-subtitle">Your garden awaits</p>
          <button type="button" className="primary-button" onClick={onEnter}>
            Enter
          </button>
        </div>
      ) : null}
    </section>
  );
}
