import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { StudioEnvironment } from './StudioEnvironment.jsx';
import { PottedWeed } from './PottedWeed.jsx';

function WaterDroplet({ active, reducedMotion }) {
  const ref = useRef(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (active) {
      startRef.current = performance.now();
    }
  }, [active]);

  useFrame(() => {
    if (!ref.current) {
      return;
    }

    const duration = reducedMotion ? 0.5 : 1.1;
    const elapsed = active ? (performance.now() - startRef.current) / 1000 : duration;
    const progress = Math.min(1, elapsed / duration);

    ref.current.visible = active && progress < 1;
    ref.current.position.y = 2.2 - progress * 2.6;
    ref.current.material.opacity = active ? Math.min(1, 1 - progress + 0.3) : 0;
  });

  return (
    <mesh ref={ref} position={[0, 2.2, 0.35]} visible={false}>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshPhysicalMaterial
        color="#f3e2b8"
        transparent
        opacity={0}
        metalness={0.2}
        roughness={0.05}
        transmission={0.4}
        thickness={0.2}
      />
    </mesh>
  );
}

function RisingParticles({ active }) {
  const pointsRef = useRef(null);
  const startRef = useRef(0);

  const positions = useMemo(() => {
    const array = new Float32Array(24 * 3);
    for (let i = 0; i < 24; i += 1) {
      array[i * 3] = (Math.random() - 0.5) * 1.1;
      array[i * 3 + 1] = -0.7 + Math.random() * 0.3;
      array[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    return array;
  }, []);

  useEffect(() => {
    if (active) {
      startRef.current = performance.now();
    }
  }, [active]);

  useFrame(() => {
    if (!pointsRef.current) {
      return;
    }

    const elapsed = (performance.now() - startRef.current) / 1000;
    const visible = active && elapsed < 2;
    pointsRef.current.visible = visible;

    if (visible) {
      pointsRef.current.position.y = elapsed * 0.5;
      pointsRef.current.material.opacity = Math.max(0, 1 - elapsed / 2);
    }
  });

  return (
    <points ref={pointsRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#f6e4b0" size={0.045} transparent opacity={0} sizeAttenuation toneMapped={false} />
    </points>
  );
}

/**
 * The full watering reaction: light/water enters the pot, the golden
 * plant physically responds (growth lerp + traveling emissive pulse via
 * PottedWeed/GoldenBloom), and small particles rise from the soil — all
 * real 3D motion driven by `phase`, not CSS keyframes.
 */
export function WateringScene({ fromStage, toStage, phase, reducedMotion }) {
  const [growthStage, setGrowthStage] = useState(fromStage);

  useEffect(() => {
    if (phase === 'settling' || phase === 'result') {
      setGrowthStage(toStage);
    }
  }, [phase, toStage]);

  return (
    <>
      <StudioEnvironment />
      <PottedWeed stage={growthStage} waterPulse={1} reducedMotion={reducedMotion} />
      <WaterDroplet active={phase === 'pouring'} reducedMotion={reducedMotion} />
      <RisingParticles active={phase === 'settling'} />
    </>
  );
}
