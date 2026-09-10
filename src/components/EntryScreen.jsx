import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

/**
 * Cinematic entry: centered NOVICIADO brand, a gold drop line, the serif
 * title, one ritual action. The wallet modal is restyled to match the
 * black-and-gold system via the .wallet-adapter-* overrides in styles.css.
 */
export function EntryScreen() {
  const { connecting } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <section className="entry-screen">
      <div className="entry-composition">
        <div className="entry-branch" aria-hidden="true">
          <span className="entry-branch-gem" />
        </div>

        <p className="brand-kicker">Noviciado</p>
        <h1 className="brand-title">The Garden</h1>
        <p className="entry-subtitle">A seven-day ritual. One gold coin.</p>

        <button
          type="button"
          className="primary-button entry-cta"
          onClick={() => setVisible(true)}
          disabled={connecting}
        >
          <span className="button-dot" aria-hidden="true" />
          {connecting ? 'Connecting…' : 'Connect wallet'}
        </button>

        <p className="entry-chain-label">Solana · Devnet</p>
      </div>

      <p className="entry-footnote">A private digital ritual by Noviciado.</p>
    </section>
  );
}
