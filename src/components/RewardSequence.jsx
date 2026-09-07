import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { playCoinChime, playRewardFanfare } from '../garden/sound-engine.js';
import { RewardCoinsScene } from '../three/RewardCoinsScene.jsx';

const REVEAL_STEP_MS = 220;
const TOTAL_COINS = 10;

export function RewardSequence({ onClose, balance, soundOn, reducedMotion }) {
  const [visibleCoins, setVisibleCoins] = useState(reducedMotion ? TOTAL_COINS : 0);
  const [phase, setPhase] = useState(reducedMotion ? 'claimed' : 'intro');
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    playRewardFanfare(soundOn);
  }, [soundOn]);

  useEffect(() => {
    if (reducedMotion || phase !== 'intro') {
      return;
    }

    const introTimer = setTimeout(() => setPhase('coins'), 900);
    return () => clearTimeout(introTimer);
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase !== 'coins' || reducedMotion) {
      return;
    }

    if (visibleCoins >= TOTAL_COINS) {
      const claimedTimer = setTimeout(() => setPhase('claimed'), 500);
      return () => clearTimeout(claimedTimer);
    }

    const coinTimer = setTimeout(() => {
      playCoinChime(soundOn, visibleCoins);
      setVisibleCoins((count) => count + 1);
    }, REVEAL_STEP_MS);

    return () => clearTimeout(coinTimer);
  }, [phase, visibleCoins, reducedMotion, soundOn]);

  const handleClose = () => {
    if (reducedMotion) {
      onClose();
      return;
    }

    setClaiming(true);
    setTimeout(onClose, 650);
  };

  return (
    <div className="reward-sequence" role="dialog" aria-modal="true" aria-label="Weekly reward">
      <p className="reward-kicker">THE GARDEN IS COMPLETE</p>
      <h2 className="reward-title">YOUR WEEKLY REWARD</h2>

      <div className="coin-canvas" aria-hidden="true">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0.6, 6.4], fov: 42 }}
          gl={{ alpha: true, antialias: true }}
        >
          <RewardCoinsScene visibleCount={visibleCoins} claiming={claiming} reducedMotion={reducedMotion} />
        </Canvas>
      </div>

      {phase === 'claimed' ? (
        <div className="reward-claimed">
          <p className="reward-plus">+10</p>
          <p className="reward-label">WEEKLY REWARD CLAIMED</p>
          <p className="reward-balance">BALANCE {balance}</p>
          <button type="button" className="primary-button" onClick={handleClose}>
            RETURN TO GARDEN
          </button>
        </div>
      ) : null}
    </div>
  );
}
