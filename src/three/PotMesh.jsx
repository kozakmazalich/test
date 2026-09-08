import { useEffect, useMemo } from 'react';
import { LatheGeometry, Vector2 } from 'three';

/**
 * Premium sculptural pot: a dark, glossy ceramic vessel revolved from
 * a simple profile curve (LatheGeometry — real 3D geometry, not a flat
 * shape), finished with a thin polished-gold rim to tie into the
 * avatar and weed materials.
 */
export function PotMesh() {
  const geometry = useMemo(() => {
    const points = [
      new Vector2(0, 0),
      new Vector2(0.55, 0),
      new Vector2(0.62, 0.08),
      new Vector2(0.5, 0.85),
      new Vector2(0.62, 0.95),
      new Vector2(0.66, 1.02),
    ];
    return new LatheGeometry(points, 48);
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <group position={[0, -1.1, 0]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#0c0a08"
          metalness={0.3}
          roughness={0.28}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
          envMapIntensity={1.1}
        />
      </mesh>
    </group>
  );
}
