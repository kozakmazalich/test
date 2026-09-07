import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const DOME_RADIUS = 1;

/**
 * A 3D reconstruction of the Noviciado member helmet (glossy black
 * dome, polished gold rails and chin band). This is used only as a
 * fallback inside GardenAvatar when the real reference photo hasn't
 * been added to the project yet — see src/components/GardenAvatar.jsx.
 */
export function HelmetMesh({ reducedMotion = false, floatEnabled = true }) {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const t = state.clock.getElapsedTime();

    if (floatEnabled && !reducedMotion) {
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.05;
      groupRef.current.rotation.y = Math.sin(t * 0.25) * 0.18;
    } else {
      groupRef.current.position.y = 0;
      groupRef.current.rotation.y = 0;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <sphereGeometry args={[DOME_RADIUS, 64, 64, 0, Math.PI * 2, 0, Math.PI / 1.65]} />
        <meshPhysicalMaterial
          color="#050505"
          metalness={0.2}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={1.4}
        />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh key={side} castShadow position={[side * 0.86, -0.25, 0.18]} rotation={[0, 0, side * -0.12]}>
          <capsuleGeometry args={[0.14, 0.75, 8, 16]} />
          <meshPhysicalMaterial color="#cfa356" metalness={1} roughness={0.24} envMapIntensity={1.6} />
        </mesh>
      ))}

      <mesh castShadow position={[0, -0.72, 0.32]} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[0.62, 0.13, 16, 48, Math.PI * 1.05]} />
        <meshPhysicalMaterial color="#e8cf9a" metalness={1} roughness={0.22} envMapIntensity={1.6} />
      </mesh>
    </group>
  );
}
