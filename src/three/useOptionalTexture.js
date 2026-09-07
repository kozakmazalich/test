import { useEffect, useState } from 'react';
import { SRGBColorSpace, TextureLoader } from 'three';

/**
 * Tries to load a real texture from a user-supplied public asset
 * (e.g. `public/coin-emblem.png`, served at `/coin-emblem.png`) with
 * zero reinterpretation. If the file is missing or fails to load,
 * falls back to a procedurally generated texture so the app keeps
 * working — and upgrades to the exact file automatically the moment
 * it's added to `public/`, no code change required.
 */
export function useOptionalTexture(url, createFallback) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let disposed = false;
    let activeTexture = null;
    const loader = new TextureLoader();

    loader.load(
      url,
      (loaded) => {
        if (disposed) {
          loaded.dispose();
          return;
        }

        loaded.colorSpace = SRGBColorSpace;
        activeTexture = loaded;
        setTexture(loaded);
      },
      undefined,
      () => {
        if (disposed) {
          return;
        }

        const fallback = createFallback();
        activeTexture = fallback;
        setTexture(fallback);
      },
    );

    return () => {
      disposed = true;
      activeTexture?.dispose();
    };
  }, [url, createFallback]);

  return texture;
}
