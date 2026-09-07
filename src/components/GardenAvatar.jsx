import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { StudioEnvironment } from '../three/StudioEnvironment.jsx';
import { HelmetMesh } from '../three/HelmetMesh.jsx';
import { DayHalo } from './DayHalo.jsx';

const HELMET_IMAGE_SRC = '/avatar-helmet.png';

/**
 * The Noviciado member avatar. Tries to display the exact reference
 * photo — drop it at `public/avatar-helmet.png` — with zero rotation,
 * cropping, or reinterpretation; a plain <img>, not a 3D reconstruction.
 * If that file isn't present yet, falls back to a 3D reconstruction
 * (src/three/HelmetMesh.jsx) so the app keeps working either way.
 * Never randomized — every member sees this exact avatar.
 *
 * A gold neon radial "day halo" overlays the frame's center, showing
 * day-by-day ritual progress and pulsing on every successful check-in.
 */
export function GardenAvatar({
  size = 'large',
  scanPulse = 0,
  reducedMotion = false,
  currentDay = 0,
  totalDays = 7,
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={`garden-avatar garden-avatar-${size}`}>
      <div className="avatar-frame">
        {imageFailed ? (
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0.15, 3.4], fov: 32 }}
            gl={{ alpha: true, antialias: true }}
          >
            <StudioEnvironment />
            <HelmetMesh reducedMotion={reducedMotion} floatEnabled />
          </Canvas>
        ) : (
          <img
            src={HELMET_IMAGE_SRC}
            alt="Member avatar"
            className="avatar-frame-image"
            onError={() => setImageFailed(true)}
          />
        )}

        <DayHalo currentDay={currentDay} totalDays={totalDays} scanPulse={scanPulse} />
      </div>
    </div>
  );
}
