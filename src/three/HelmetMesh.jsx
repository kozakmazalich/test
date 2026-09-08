import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A proper premium 3D member helmet designed after the Daft Punk-style
 * reference: a glossy obsidian elongated visor, polished gold side caps,
 * and a wrapping gold chin collar.
 *
 * When check-in succeeds (scanPulse > 0), a gold/neon scanning light
 * sweeps down across the glossy black visor.
 */
export function HelmetMesh({ reducedMotion = false, floatEnabled = true, scanPulse = 0 }) {
  const groupRef = useRef(null);
  const scanRef = useRef(null);
  const scanStartRef = useRef(-Infinity);
  const prevScanPulseRef = useRef(scanPulse);

  useEffect(() => {
    if (scanPulse > 0 && scanPulse !== prevScanPulseRef.current) {
      scanStartRef.current = performance.now();
    }
    prevScanPulseRef.current = scanPulse;
  }, [scanPulse]);

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

    // Gold neon scan sweep animation
    if (scanRef.current) {
      const scanDuration = 1.5;
      const elapsed = (performance.now() - scanStartRef.current) / 1000;
      const progress = elapsed / scanDuration;

      if (progress >= 0 && progress < 1) {
        scanRef.current.visible = true;

        // Sweep down the elongated visor
        // Visor goes from approx y = 1.0 to y = -0.6
        const scanY = THREE.MathUtils.lerp(1.0, -0.6, progress);
        scanRef.current.position.y = scanY;

        // Hug the capsule shape mathematically
        // It's a sphere of radius 0.95 vertically stretched by 1.3
        // So normalized Y is scanY / 1.3
        const normY = scanY / 1.3;
        const rSphere = 0.96; // slightly larger than visor radius 0.95
        const scaleXZ = Math.sqrt(Math.max(0.01, rSphere * rSphere - normY * normY));
        scanRef.current.scale.set(scaleXZ, 1, scaleXZ);

        const intensityFactor = Math.sin(progress * Math.PI);
        scanRef.current.material.emissiveIntensity = 4.0 * intensityFactor;
      } else {
        scanRef.current.visible = false;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Glossy Black Obsidian Visor (Elongated Capsule/Sphere) */}
      <mesh castShadow receiveShadow position={[0, 0.2, 0.1]}>
        <sphereGeometry args={[0.95, 64, 64]} />
        <meshPhysicalMaterial
          color="#050505"
          metalness={0.6}
          roughness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.02}
          envMapIntensity={2.0}
        />
        {/* Vertically stretch the sphere to create a pill/helmet shape */}
        <primitive object={new THREE.Vector3(1, 1.3, 1)} attach="scale" />
      </mesh>

      {/* Side gold ear caps and mechanical plates */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {/* Main side plate */}
          <mesh castShadow position={[side * 0.88, 0, 0]} rotation={[0, 0, side * -0.1]}>
            <boxGeometry args={[0.2, 1.2, 0.8]} />
            <meshPhysicalMaterial color="#cfa356" metalness={1.0} roughness={0.15} envMapIntensity={1.8} />
          </mesh>

          {/* Circular ear hub */}
          <mesh castShadow position={[side * 0.92, -0.1, 0]} rotation={[0, side * Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
            <meshPhysicalMaterial color="#d4af37" metalness={1.0} roughness={0.12} envMapIntensity={1.8} />
          </mesh>

          {/* Inner dark vent inside ear hub */}
          <mesh position={[side * 0.95, -0.1, 0]} rotation={[0, side * Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.16, 32]} />
            <meshPhysicalMaterial color="#111" metalness={0.8} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* Gold chin collar wrapping around the bottom */}
      <mesh castShadow position={[0, -0.75, 0.2]} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[0.85, 0.15, 32, 64, Math.PI * 1.1]} />
        <meshPhysicalMaterial color="#e8cf9a" metalness={1.0} roughness={0.14} envMapIntensity={1.8} />
      </mesh>

      {/* Front-facing neon gold scanning laser arc that hugs the visor */}
      <mesh
        ref={scanRef}
        visible={false}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.45, 0.1]}
      >
        <torusGeometry args={[1.0, 0.02, 16, 64, Math.PI * 0.6]} />
        <meshPhysicalMaterial
          color="#ffe54b"
          emissive="#ffbb00"
          emissiveIntensity={0}
          toneMapped={false}
        />
        {/* We center the torus cut so it sweeps nicely over the front */}
        <primitive object={new THREE.Vector3(1, 1, 1)} attach="scale" />
        <primitive object={new THREE.Euler(Math.PI / 2, 0, -Math.PI * 0.3)} attach="rotation" />
      </mesh>
    </group>
  );
}
