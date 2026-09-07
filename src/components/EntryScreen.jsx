import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Canvas } from '@react-three/fiber';
import { StudioEnvironment } from '../three/StudioEnvironment.jsx';
import { PottedWeed } from '../three/PottedWeed.jsx';
import { GardenAvatar } from './GardenAvatar.jsx';

/**
 * Cinematic hero: the member avatar (real photo or 3D fallback) and
 * the golden plant together as premium collectible objects in a dark,
 * lit scene — replacing the previous CSS rotating-facet placeholder.
 */
function EntryPlant() {
  return (
    <div className="entry-plant" aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0.4, 0.25, 5.2], fov: 30 }}
        gl={{ alpha: true, antialias: true }}
      >
        <StudioEnvironment />
        <PottedWeed stage={7} />
      </Canvas>
    </div>
  );
}

export function EntryScreen() {
  const { connecting } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <section className="entry-screen">
      <div className="entry-scene">
        <GardenAvatar size="medium" />
        <EntryPlant />
      </div>

      <p className="entry-kicker">NOVICIADO</p>
      <h1 className="entry-title">ENTER THE GARDEN</h1>
      <p className="entry-subtitle">A daily ritual for the curious.</p>

      <button
        type="button"
        className="primary-button entry-cta"
        onClick={() => setVisible(true)}
        disabled={connecting}
      >
        {connecting ? 'CONNECTING…' : 'CONNECT WALLET'}
      </button>

      <p className="entry-footnote">A private digital ritual by Noviciado.</p>
    </section>
  );
}
