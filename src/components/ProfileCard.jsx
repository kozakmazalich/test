import { useEffect, useState } from 'react';
import { GardenAvatar } from './GardenAvatar.jsx';
import { WEEK_LENGTH } from '../garden/garden-logic.js';
import { CheckIcon, CopyIcon } from './icons.jsx';

function shortAddress(address) {
  if (!address) {
    return '—';
  }

  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

/**
 * Member dialog. Opens from the MEMBER control in the top-right corner:
 * a holographic avatar card (the real 3D avatar in a gold gradient frame)
 * above the profile rows, with wallet copy, Escape/outside-click close.
 */
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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleCopy = () => {
    if (!walletAddress) {
      return;
    }

    navigator.clipboard?.writeText(walletAddress).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const rows = [
    ['Garden', gardenNumber],
    ['Current streak', `${currentStreak} days`],
    ['Longest streak', `${longestStreak} days`],
    ['This week', `${currentDay} / ${WEEK_LENGTH}`],
    ['Completed weeks', String(completedWeeks)],
  ];

  return (
    <div className="profile-backdrop" onClick={onClose} role="presentation">
      <aside
        className="profile-card"
        role="dialog"
        aria-label="Member profile"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="profile-close" onClick={onClose} aria-label="Close profile">
          ×
        </button>

        <h2 className="profile-title">Member</h2>
        <p className="profile-kicker">The keeper of {gardenNumber}</p>

        <div className="profile-avatar-card" aria-label="Member identity card">
          <div className="profile-avatar-card-inner">
            <GardenAvatar traits={traits} size="small" />
            <div className="avatar-card-holo" aria-hidden="true" />
            <div className="avatar-card-label avatar-card-label-top" aria-hidden="true">
              <span>Auric</span>
              <span>★ VII</span>
            </div>
            <div className="avatar-card-label avatar-card-label-bottom" aria-hidden="true">
              <span>Keeper · Holo</span>
              <span>{gardenNumber}</span>
            </div>
          </div>
        </div>

        <dl className="profile-rows">
          <div className="profile-row">
            <dt>Wallet</dt>
            <dd>
              <button type="button" className="profile-copy" onClick={handleCopy}>
                {shortAddress(walletAddress)}
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </dd>
          </div>
          {rows.map(([label, value]) => (
            <div key={label} className="profile-row">
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="profile-balance">
          <p className="profile-balance-label">Coin balance</p>
          <p className="profile-balance-value">{coinBalance}</p>
        </div>
      </aside>
    </div>
  );
}
