export const ONE_DAY_MS = 24 * 60 * 60 * 1000;
export const MISSED_GRACE_MS = ONE_DAY_MS * 2;
export const WEEK_LENGTH = 7;
export const COINS_PER_WEEK = 10;

const HELMET_SHAPES = ['angular', 'elongated', 'rounded', 'asymmetric', 'sculptural', 'geometric'];
const MATERIALS = ['champagne-gold', 'polished-gold', 'black-chrome', 'dark-metallic', 'ivory-ceramic', 'brushed-metal'];
const VISORS = ['black-glass', 'mirrored-gold', 'dark-bronze', 'smoked-glass'];
const DETAILS = ['engraved', 'mechanical', 'symbol', 'asymmetric-line', 'noviciado-mark'];

/**
 * Deterministic 32-bit string hash (djb2 variant). Used only to seed
 * cosmetic avatar/garden generation — not a security or cryptographic
 * primitive, so a dependency-free implementation is appropriate here.
 */
export function hashSeed(seed) {
  const text = String(seed ?? 'noviciado');
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(index);
    hash |= 0;
  }

  return hash >>> 0;
}

/**
 * mulberry32: small, fast, deterministic PRNG. Public-domain algorithm,
 * used here purely to turn a numeric seed into a repeatable sequence of
 * pseudo-random floats in [0, 1) for cosmetic trait selection.
 */
function mulberry32(seed) {
  let state = seed;

  return function random() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(random, list) {
  return list[Math.floor(random() * list.length) % list.length];
}

export function deriveAvatarTraits(seed) {
  const random = mulberry32(hashSeed(seed));

  return {
    helmetShape: pick(random, HELMET_SHAPES),
    material: pick(random, MATERIALS),
    visor: pick(random, VISORS),
    detail: pick(random, DETAILS),
  };
}

export function deriveGardenNumber(seed) {
  const hash = hashSeed(`${seed}-garden`);
  const number = (hash % 998) + 1;
  return `No. ${String(number).padStart(3, '0')}`;
}

export function createGardenState(seed) {
  return {
    seed,
    gardenNumber: deriveGardenNumber(seed),
    avatarTraits: deriveAvatarTraits(seed),
    currentDay: 0,
    lastCheckIn: null,
    currentStreak: 0,
    longestStreak: 0,
    completedWeeks: 0,
    coinBalance: 0,
    rewardHistory: [],
    rewardPending: false,
    devClockOffsetMs: 0,
    message: 'Your garden awaits its first ritual.',
  };
}

/**
 * Logical "now" for this garden. In production this is the real clock.
 * In dev/test mode, `devClockOffsetMs` lets the developer fast-forward
 * the simulated calendar without bypassing any of the real cooldown or
 * progression arithmetic below.
 */
export function getNow(state) {
  return Date.now() + (state.devClockOffsetMs ?? 0);
}

export function getCooldownRemainingMs(state) {
  if (!state.lastCheckIn) {
    return 0;
  }

  const elapsed = getNow(state) - state.lastCheckIn;
  return Math.max(0, ONE_DAY_MS - elapsed);
}

export function canWaterToday(state) {
  if (state.rewardPending) {
    return false;
  }

  if (state.currentDay >= WEEK_LENGTH) {
    return false;
  }

  return getCooldownRemainingMs(state) === 0;
}

export function getStatusMessage(state) {
  if (state.rewardPending) {
    return 'The garden has reached its final form.';
  }

  if (state.currentDay === 0) {
    return 'Begin the ritual. Water the garden for the first time.';
  }

  if (!canWaterToday(state)) {
    return 'The ritual is complete for today.';
  }

  const gapMs = state.lastCheckIn ? getNow(state) - state.lastCheckIn : 0;

  if (gapMs > MISSED_GRACE_MS) {
    return 'The garden missed you. Return today to continue.';
  }

  return 'The garden is ready for today\u2019s ritual.';
}

export function waterGarden(state) {
  if (!canWaterToday(state)) {
    return state;
  }

  const now = getNow(state);
  const gapMs = state.lastCheckIn ? now - state.lastCheckIn : 0;
  const continuesStreak = !state.lastCheckIn || gapMs <= MISSED_GRACE_MS;
  const nextStreak = continuesStreak ? state.currentStreak + 1 : 1;
  const nextDay = Math.min(WEEK_LENGTH, state.currentDay + 1);

  return {
    ...state,
    currentDay: nextDay,
    lastCheckIn: now,
    currentStreak: nextStreak,
    longestStreak: Math.max(state.longestStreak, nextStreak),
    rewardPending: nextDay >= WEEK_LENGTH,
    message: nextDay >= WEEK_LENGTH
      ? 'The garden has reached its final form.'
      : `Garden watered. Day ${nextDay} of ${WEEK_LENGTH}.`,
  };
}

export function claimWeeklyReward(state) {
  if (!state.rewardPending || state.currentDay < WEEK_LENGTH) {
    return state;
  }

  const now = getNow(state);

  return {
    ...state,
    coinBalance: state.coinBalance + COINS_PER_WEEK,
    completedWeeks: state.completedWeeks + 1,
    rewardHistory: [
      ...state.rewardHistory,
      { week: state.completedWeeks + 1, coins: COINS_PER_WEEK, claimedAt: now },
    ],
    currentDay: 0,
    rewardPending: false,
    message: 'Weekly reward claimed. The garden continues.',
  };
}

/**
 * Dev/test-mode only: advances the simulated clock by exactly one day.
 * This does not force-unlock the cooldown flag directly — it shifts the
 * clock that `getNow` and `getCooldownRemainingMs` already use, so the
 * real cooldown math naturally reports "ready" once 24 simulated hours
 * have passed. This keeps test mode behaviorally identical to production.
 */
export function advanceDevDay(state) {
  return {
    ...state,
    devClockOffsetMs: (state.devClockOffsetMs ?? 0) + ONE_DAY_MS,
  };
}

export function isValidGardenState(candidate) {
  return Boolean(
    candidate
      && typeof candidate.currentDay === 'number'
      && typeof candidate.coinBalance === 'number'
      && typeof candidate.completedWeeks === 'number'
      && candidate.avatarTraits
      && typeof candidate.gardenNumber === 'string',
  );
}

export function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value) => String(value).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
