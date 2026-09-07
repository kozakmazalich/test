import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createEmblemTexture, createReverseTexture } from './canvasTextures.js';
import { useOptionalTexture } from './useOptionalTexture.js';

const COIN_RADIUS = 0.62;
const COIN_THICKNESS = 0.14;

/**
 * A real 3D gold coin: genuine thickness (a cylinder side wall, not a
 * flat sprite), a beveled rim (torus rings at each edge), a metallic
 * gold PBR material with studio reflections, and the reference emblem
 * mapped onto the obverse face as a texture on its own flat circular
 * face (not the cylinder's built-in cap) — this keeps the UV mapping
 * simple and predictable: a front-facing `CircleGeometry` maps its
 * texture with x→u and y→v directly, so the artwork renders upright
 * and unmirrored exactly as drawn, with no implicit rotation from a
 * cylinder-cap parametrization.
 *
 * Tries `/coin-emblem.png` first (drop the real reference file there
 * for pixel-exact fidelity) and falls back to the in-app reproduction
 * if that file isn't present — see useOptionalTexture.js.
 */
export function CoinMesh({ position = [0, 0, 0], spin = true, revealDelay = 0, exiting = false, exitTarget = [0, -3.2, -1] }) {
  const groupRef = useRef(null);
  const mountTimeRef = useRef(performance.now());
  const exitStartRef = useRef(null);

  const frontTexture = useOptionalTexture('/coin-emblem.png', createEmblemTexture);
  const backTextureRef = useRef(null);

  if (!backTextureRef.current) {
    backTextureRef.current = createReverseTexture();
  }

  useEffect(() => {
    const backTexture = backTextureRef.current;
    return () => backTexture?.dispose();
  }, []);

  useEffect(() => {
    if (exiting && exitStartRef.current === null) {
      exitStartRef.current = performance.now();
    }
  }, [exiting]);

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const elapsed = (performance.now() - mountTimeRef.current) / 1000 - revealDelay;

    if (elapsed < 0) {
      groupRef.current.visible = false;
      return;
    }

    groupRef.current.visible = true;

    if (exiting && exitStartRef.current !== null) {
      const exitElapsed = (performance.now() - exitStartRef.current) / 1000;
      const exitProgress = Math.min(1, exitElapsed / 0.6);
      groupRef.current.position.x = THREE.MathUtils.lerp(position[0], exitTarget[0], exitProgress);
      groupRef.current.position.y = THREE.MathUtils.lerp(position[1], exitTarget[1], exitProgress);
      groupRef.current.position.z = THREE.MathUtils.lerp(position[2], exitTarget[2], exitProgress);
      groupRef.current.scale.setScalar(Math.max(0.001, 1 - exitProgress));
      return;
    }

    const introProgress = Math.min(1, elapsed / 0.55);
    const eased = 1 - Math.pow(1 - introProgress, 3);
    groupRef.current.position.set(position[0], position[1] + (1 - eased) * -1.2, position[2]);
    groupRef.current.scale.setScalar(0.3 + eased * 0.7);

    if (spin) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.9 + revealDelay;
    }
  });

  if (!frontTexture) {
    return null;
  }

  return (
    <group ref={groupRef} visible={false}>
      {/* Side wall — genuine thickness, open-ended so it doesn't add its own caps */}
      <mesh castShadow>
        <cylinderGeometry args={[COIN_RADIUS, COIN_RADIUS, COIN_THICKNESS, 64, 1, true]} />
        <meshPhysicalMaterial color="#cfa356" metalness={1} roughness={0.22} envMapIntensity={1.6} />
      </mesh>

      {/* Obverse face — the reference emblem, upright, unrotated */}
      <mesh position={[0, 0, COIN_THICKNESS / 2]}>
        <circleGeometry args={[COIN_RADIUS, 64]} />
        <meshStandardMaterial map={frontTexture} metalness={0.35} roughness={0.4} envMapIntensity={1.1} />
      </mesh>

      {/* Reverse face */}
      <mesh position={[0, 0, -COIN_THICKNESS / 2]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[COIN_RADIUS, 64]} />
        <meshStandardMaterial map={backTextureRef.current} metalness={0.5} roughness={0.35} envMapIntensity={1.1} />
      </mesh>

      {/* Beveled rim highlights */}
      <mesh position={[0, 0, COIN_THICKNESS / 2 + 0.001]}>
        <torusGeometry args={[COIN_RADIUS - 0.02, 0.035, 12, 64]} />
        <meshPhysicalMaterial color="#f6e4b0" metalness={1} roughness={0.18} envMapIntensity={1.7} />
      </mesh>
      <mesh position={[0, 0, -(COIN_THICKNESS / 2 + 0.001)]}>
        <torusGeometry args={[COIN_RADIUS - 0.02, 0.035, 12, 64]} />
        <meshPhysicalMaterial color="#f6e4b0" metalness={1} roughness={0.18} envMapIntensity={1.7} />
      </mesh>
    </group>
  );
}
