/**
 * Minimal, dependency-free sound engine using the Web Audio API.
 * No external audio assets are required. Every call is a no-op when
 * `enabled` is false, when running outside a browser, or when the
 * browser has no AudioContext implementation.
 */
let audioContext = null;

function getAudioContext() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      return null;
    }

    audioContext = new AudioContextClass();
  }

  return audioContext;
}

function playTone({ frequency, duration = 0.35, type = 'sine', gain = 0.05, delay = 0 }) {
  const context = getAudioContext();

  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  const startTime = context.currentTime + delay;
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.05);
}

export function playConnectChime(enabled) {
  if (!enabled) return;
  playTone({ frequency: 420, duration: 0.4, type: 'sine', gain: 0.04 });
}

export function playIdentityChime(enabled) {
  if (!enabled) return;
  playTone({ frequency: 260, duration: 0.2, type: 'triangle', gain: 0.05 });
  playTone({ frequency: 520, duration: 0.25, type: 'triangle', gain: 0.04, delay: 0.12 });
}

export function playWaterChime(enabled) {
  if (!enabled) return;
  playTone({ frequency: 300, duration: 0.6, type: 'sine', gain: 0.035 });
  playTone({ frequency: 620, duration: 0.5, type: 'sine', gain: 0.02, delay: 0.15 });
}

export function playDayCompleteChime(enabled) {
  if (!enabled) return;
  playTone({ frequency: 440, duration: 0.3, type: 'triangle', gain: 0.045 });
}

export function playCoinChime(enabled, index = 0) {
  if (!enabled) return;
  const frequency = 480 + index * 18;
  playTone({ frequency, duration: 0.35, type: 'triangle', gain: 0.035 });
}

export function playRewardFanfare(enabled) {
  if (!enabled) return;
  [392, 494, 587, 784].forEach((frequency, index) => {
    playTone({ frequency, duration: 0.5, type: 'sine', gain: 0.04, delay: index * 0.12 });
  });
}
