import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/**
 * Builds a procedural studio environment map entirely in the browser
 * (three.js's built-in RoomEnvironment) so metallic gold and glossy
 * black materials get realistic reflections without fetching any
 * external HDRI/texture file over the network. Paired with a small
 * three-point light rig for dramatic, directional studio lighting and
 * real shadow casting.
 */
export function StudioEnvironment() {
  const { gl, scene } = useThree();
  const pmremGenerator = useMemo(() => new PMREMGenerator(gl), [gl]);

  useEffect(() => {
    const envScene = new RoomEnvironment();
    const renderTarget = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = renderTarget.texture;

    return () => {
      renderTarget.dispose();
      scene.environment = null;
    };
  }, [pmremGenerator, scene]);

  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={2.6}
        color="#fff3d8"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 1.6, -3]} intensity={0.85} color="#8fa6ff" />
      <pointLight position={[0, -1.6, 3]} intensity={0.5} color="#e8cf9a" />
    </>
  );
}
