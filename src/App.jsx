import { useCallback, useEffect, useMemo, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  WEEK_LENGTH,
  advanceDevDay,
  canWaterToday,
  claimWeeklyReward,
  createGardenState,
  formatCountdown,
  getCooldownRemainingMs,
  getStatusMessage,
  isValidGardenState,
  waterGarden,
} from './garden/garden-logic.js';
import { playConnectChime, playDayCompleteChime, playWaterChime } from './garden/sound-engine.js';
import { EntryScreen } from './components/EntryScreen.jsx';
import { AvatarSequence } from './components/AvatarSequence.jsx';
import { GardenAvatar } from './components/GardenAvatar.jsx';
import { GardenPlant } from './components/GardenPlant.jsx';
import { DayProgress } from './components/DayProgress.jsx';
import { WateringOverlay } from './components/WateringOverlay.jsx';
import { RewardSequence } from './components/RewardSequence.jsx';
import { ProfileCard } from './components/ProfileCard.jsx';

const PREFS_KEY = 'noviciado-garden-prefs';

// Vite's real dev/production flag. Using the exact `import.meta.env.DEV`
// expression (no optional chaining) lets Vite statically replace it with
// `false` at build time, so the dev-only branch below is dead-code
// eliminated from production builds rather than merely hidden at runtime.
const isDevMode = import.meta.env.DEV === true;

function gardenStorageKey(address) {
  return `noviciado-garden:${address}`;
}

function loadGardenState(address) {
  try {
    const raw = window.localStorage.getItem(gardenStorageKey(address));

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return isValidGardenState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveGardenState(address, state) {
  window.localStorage.setItem(gardenStorageKey(address), JSON.stringify(state));
}

function loadPrefs() {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);

    if (!raw) {
      return { soundOn: true, reducedMotion: false };
    }

    const parsed = JSON.parse(raw);

    return {
      soundOn: typeof parsed.soundOn === 'boolean' ? parsed.soundOn : true,
      reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : false,
    };
  } catch {
    return { soundOn: true, reducedMotion: false };
  }
}

function savePrefs(prefs) {
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function usePrefersReducedMotion() {
  const [systemPref, setSystemPref] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSystemPref(query.matches);
    const listener = (event) => setSystemPref(event.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  return systemPref;
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

export function App() {
  const { connected, connecting, publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() ?? null;

  const initialPrefs = useMemo(() => loadPrefs(), []);
  const [soundOn, setSoundOn] = useState(initialPrefs.soundOn);
  const [reducedMotionOverride, setReducedMotionOverride] = useState(initialPrefs.reducedMotion);
  const systemReducedMotion = usePrefersReducedMotion();
  const reducedMotion = reducedMotionOverride || systemReducedMotion;

  const [gardenState, setGardenState] = useState(null);
  const [screen, setScreen] = useState('entry');
  const [showWatering, setShowWatering] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [cooldownLabel, setCooldownLabel] = useState('00:00:00');
  const [scanPulse, setScanPulse] = useState(0);

  useEffect(() => {
    savePrefs({ soundOn, reducedMotion: reducedMotionOverride });
  }, [soundOn, reducedMotionOverride]);

  useEffect(() => {
    if (!connected || !walletAddress) {
      setScreen('entry');
      setGardenState(null);
      return;
    }

    playConnectChime(soundOn);
    const existing = loadGardenState(walletAddress);

    if (existing) {
      setGardenState(existing);
      setScreen('garden');
    } else {
      setGardenState(createGardenState(walletAddress));
      setScreen('generating');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, walletAddress]);

  useEffect(() => {
    if (!walletAddress || !gardenState) {
      return;
    }

    saveGardenState(walletAddress, gardenState);
  }, [walletAddress, gardenState]);

  useEffect(() => {
    if (!gardenState || screen !== 'garden') {
      return;
    }

    const update = () => setCooldownLabel(formatCountdown(getCooldownRemainingMs(gardenState)));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [gardenState, screen]);

  useEffect(() => {
    if (gardenState?.rewardPending && screen === 'garden' && !showReward) {
      const timer = setTimeout(() => setShowReward(true), 900);
      return () => clearTimeout(timer);
    }
  }, [gardenState, screen, showReward]);

  const handleEnterGarden = useCallback(() => setScreen('garden'), []);

  const handleWaterClick = useCallback(() => {
    if (!gardenState || !canWaterToday(gardenState)) {
      return;
    }

    setShowWatering(true);
  }, [gardenState]);

  const handleWateringComplete = useCallback(() => {
    setShowWatering(false);
    setGardenState((current) => {
      if (!current) {
        return current;
      }

      const next = waterGarden(current);

      if (next.currentDay !== current.currentDay) {
        playWaterChime(soundOn);
        setScanPulse((value) => value + 1);

        if (next.currentDay >= WEEK_LENGTH) {
          playDayCompleteChime(soundOn);
        }
      }

      return next;
    });
  }, [soundOn]);

  const handleRewardClose = useCallback(() => {
    setGardenState((current) => (current ? claimWeeklyReward(current) : current));
    setShowReward(false);
  }, []);

  const handleDevNextDay = useCallback(() => {
    setGardenState((current) => (current ? advanceDevDay(current) : current));
  }, []);

  if (!connected) {
    return <EntryScreen />;
  }

  if (screen === 'generating' && gardenState) {
    return (
      <AvatarSequence
        traits={gardenState.avatarTraits}
        gardenNumber={gardenState.gardenNumber}
        onEnter={handleEnterGarden}
        soundOn={soundOn}
        reducedMotion={reducedMotion}
      />
    );
  }

  if (!gardenState) {
    return (
      <div className="loading-state" role="status">
        <p>PREPARING YOUR GARDEN…</p>
      </div>
    );
  }

  const canWater = canWaterToday(gardenState);
  const displayDay = gardenState.currentDay === 0 ? 1 : gardenState.currentDay;
  const daysUntilReward = WEEK_LENGTH - gardenState.currentDay;
  const statusMessage = getStatusMessage(gardenState);

  return (
    <main className="app" data-reduced-motion={reducedMotion}>
      <header className="app-header">
        <div>
          <p className="brand-kicker">NOVICIADO</p>
          <p className="brand-title">THE GARDEN</p>
        </div>

        <div className="header-controls">
          <button
            type="button"
            className="icon-toggle"
            onClick={() => setSoundOn((value) => !value)}
            aria-pressed={soundOn}
          >
            {soundOn ? 'SOUND ON' : 'SOUND OFF'}
          </button>
          <button
            type="button"
            className="icon-toggle"
            onClick={() => setReducedMotionOverride((value) => !value)}
            aria-pressed={reducedMotionOverride}
          >
            {reducedMotionOverride ? 'MOTION REDUCED' : 'REDUCE MOTION'}
          </button>
          <button type="button" className="icon-toggle" onClick={() => setShowProfile(true)}>
            MEMBER
          </button>
        </div>
      </header>

      <section className="garden-stage">
        <div className="garden-column avatar-column">
          <GardenAvatar
            size="large"
            scanPulse={scanPulse}
            reducedMotion={reducedMotion}
            currentDay={gardenState.currentDay}
            totalDays={WEEK_LENGTH}
          />
        </div>

        <div className="garden-column plant-column">
          <GardenPlant stage={gardenState.currentDay} reducedMotion={reducedMotion} />
        </div>
      </section>

      <section className="ritual-panel">
        <p className="ritual-day-label">DAY {pad2(displayDay)} / {pad2(WEEK_LENGTH)}</p>
        <p className="ritual-status" aria-live="polite">{statusMessage}</p>

        {canWater ? (
          <button type="button" className="primary-button ritual-cta" onClick={handleWaterClick}>
            WATER THE GARDEN
          </button>
        ) : (
          <div className="ritual-cooldown">
            <p className="ritual-cooldown-title">GARDEN WATERED</p>
            {!gardenState.rewardPending ? (
              <>
                <p className="ritual-cooldown-caption">NEXT RITUAL IN</p>
                <p className="ritual-cooldown-timer">{cooldownLabel}</p>
              </>
            ) : null}
          </div>
        )}

        <DayProgress currentDay={gardenState.currentDay} />

        {daysUntilReward > 0 && gardenState.currentDay > 0 ? (
          <p className="ritual-countdown-label">{daysUntilReward} DAYS UNTIL REWARD</p>
        ) : null}

        {isDevMode ? (
          <button type="button" className="dev-button" onClick={handleDevNextDay}>
            DEV / TEST MODE — NEXT DAY
          </button>
        ) : null}
      </section>

      {showWatering ? (
        <WateringOverlay
          onComplete={handleWateringComplete}
          reducedMotion={reducedMotion}
          fromStage={gardenState.currentDay}
          toStage={Math.min(WEEK_LENGTH, gardenState.currentDay + 1)}
        />
      ) : null}

      {showReward ? (
        <RewardSequence
          onClose={handleRewardClose}
          balance={gardenState.coinBalance + 10}
          soundOn={soundOn}
          reducedMotion={reducedMotion}
        />
      ) : null}

      {showProfile ? (
        <ProfileCard
          walletAddress={walletAddress}
          traits={gardenState.avatarTraits}
          gardenNumber={gardenState.gardenNumber}
          currentDay={gardenState.currentDay}
          currentStreak={gardenState.currentStreak}
          longestStreak={gardenState.longestStreak}
          completedWeeks={gardenState.completedWeeks}
          coinBalance={gardenState.coinBalance}
          onClose={() => setShowProfile(false)}
        />
      ) : null}

      <p className="footer-note">A private digital ritual by Noviciado.</p>
    </main>
  );
}
