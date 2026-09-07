import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ONE_DAY_MS,
  WEEK_LENGTH,
  COINS_PER_WEEK,
  advanceDevDay,
  canWaterToday,
  claimWeeklyReward,
  createGardenState,
  deriveAvatarTraits,
  deriveGardenNumber,
  formatCountdown,
  getCooldownRemainingMs,
  waterGarden,
} from '../src/garden/garden-logic.js';

test('deriveAvatarTraits is deterministic for the same seed', () => {
  const first = deriveAvatarTraits('wallet-address-1');
  const second = deriveAvatarTraits('wallet-address-1');

  assert.deepEqual(first, second);
});

test('deriveGardenNumber returns a stable formatted number for the same seed', () => {
  const first = deriveGardenNumber('wallet-address-1');
  const second = deriveGardenNumber('wallet-address-1');

  assert.equal(first, second);
  assert.match(first, /^No\. \d{3}$/);
});

test('a fresh garden allows watering on day zero', () => {
  const state = createGardenState('wallet-address-1');

  assert.equal(canWaterToday(state), true);
});

test('watering advances the day and blocks a second watering within 24 hours', () => {
  const state = createGardenState('wallet-address-1');
  const watered = waterGarden(state);

  assert.equal(watered.currentDay, 1);
  assert.equal(canWaterToday(watered), false);
  assert.ok(getCooldownRemainingMs(watered) > 0);
});

test('advancing the dev clock by one day unlocks watering again', () => {
  const state = createGardenState('wallet-address-1');
  const watered = waterGarden(state);
  const nextDay = advanceDevDay(watered);

  assert.equal(canWaterToday(nextDay), true);
  assert.equal(getCooldownRemainingMs(nextDay), 0);
});

test('completing seven waterings marks the weekly reward as pending', () => {
  let state = createGardenState('wallet-address-1');

  for (let day = 0; day < WEEK_LENGTH; day += 1) {
    state = waterGarden(state);
    state = advanceDevDay(state);
  }

  assert.equal(state.currentDay, WEEK_LENGTH);
  assert.equal(state.rewardPending, true);
});

test('claiming the weekly reward grants exactly ten coins once', () => {
  let state = createGardenState('wallet-address-1');

  for (let day = 0; day < WEEK_LENGTH; day += 1) {
    state = waterGarden(state);
    state = advanceDevDay(state);
  }

  const claimed = claimWeeklyReward(state);

  assert.equal(claimed.coinBalance, COINS_PER_WEEK);
  assert.equal(claimed.completedWeeks, 1);
  assert.equal(claimed.currentDay, 0);
  assert.equal(claimed.rewardPending, false);
});

test('claiming twice without a new completed week does not double-award coins', () => {
  let state = createGardenState('wallet-address-1');

  for (let day = 0; day < WEEK_LENGTH; day += 1) {
    state = waterGarden(state);
    state = advanceDevDay(state);
  }

  const claimedOnce = claimWeeklyReward(state);
  const claimedTwice = claimWeeklyReward(claimedOnce);

  assert.equal(claimedTwice.coinBalance, COINS_PER_WEEK);
  assert.equal(claimedTwice.completedWeeks, 1);
});

test('a gap longer than the grace period resets the current streak but preserves progress', () => {
  let state = createGardenState('wallet-address-1');
  state = waterGarden(state);
  state = {
    ...state,
    devClockOffsetMs: state.devClockOffsetMs + ONE_DAY_MS * 5,
  };

  const watered = waterGarden(state);

  assert.equal(watered.currentStreak, 1);
  assert.equal(watered.currentDay, 2);
});

test('formatCountdown renders zero-padded HH:MM:SS', () => {
  assert.equal(formatCountdown(0), '00:00:00');
  assert.equal(formatCountdown(3661 * 1000), '01:01:01');
});
