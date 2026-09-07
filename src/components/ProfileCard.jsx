import { GardenAvatar } from './GardenAvatar.jsx';
import { WEEK_LENGTH } from '../garden/garden-logic.js';

function shortAddress(address) {
  if (!address) {
    return '—';
  }

  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function ProfileCard({
  walletAddress,
  traits,
  gardenNumber,
  currentDay,
  currentStreak,
  longestStreak,
  completedWeeks,
  coinBalance,
  onClose,
}) {
  return (
    <aside className="profile-card" role="dialog" aria-label="Member profile" aria-modal="true">
      <button type="button" className="profile-close" onClick={onClose} aria-label="Close profile">
        ×
      </button>

      <p className="profile-kicker">MEMBER</p>
      <GardenAvatar traits={traits} size="small" />

      <dl className="profile-details">
        <div>
          <dt>WALLET</dt>
          <dd>{shortAddress(walletAddress)}</dd>
        </div>
        <div>
          <dt>GARDEN</dt>
          <dd>GOLDEN GARDEN {gardenNumber}</dd>
        </div>
        <div>
          <dt>CURRENT STREAK</dt>
          <dd>{currentStreak} DAYS</dd>
        </div>
        <div>
          <dt>LONGEST STREAK</dt>
          <dd>{longestStreak} DAYS</dd>
        </div>
        <div>
          <dt>THIS WEEK</dt>
          <dd>{currentDay} / {WEEK_LENGTH}</dd>
        </div>
        <div>
          <dt>COMPLETED WEEKS</dt>
          <dd>{completedWeeks}</dd>
        </div>
        <div>
          <dt>COINS</dt>
          <dd>{coinBalance}</dd>
        </div>
      </dl>
    </aside>
  );
}
