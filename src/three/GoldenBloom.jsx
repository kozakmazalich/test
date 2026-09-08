import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createTaperedTubeGeometry, quaternionFromDirection } from './geometryUtils.js';

function targetGrowth(stage) {
  if (stage <= 0) return 0.05;
  const progress = stage / 7;
  return Math.max(0.05, progress);
}

function targetBloom(stage) {
  if (stage < 6) return 0;
  if (stage === 6) return 0.4;
  return 1;
}

function createLeafShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.1, 0.14, 0.07, 0.32);
  shape.quadraticCurveTo(0.03, 0.44, 0, 0.5);
  shape.quadraticCurveTo(-0.03, 0.44, -0.07, 0.32);
  shape.quadraticCurveTo(-0.1, 0.14, 0, 0);
  shape.closePath();
  return shape;
}

function createFacetedBladeGeometry(length, width, thickness) {
  const geom = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    // Front top left
    0, length, 0,
    -width / 2, length * 0.35, 0,
    0, length * 0.35, thickness,

    // Front top right
    0, length, 0,
    0, length * 0.35, thickness,
    width / 2, length * 0.35, 0,

    // Front bottom left
    0, length * 0.35, thickness,
    -width / 2, length * 0.35, 0,
    0, 0, 0,

    // Front bottom right
    0, length * 0.35, thickness,
    0, 0, 0,
    width / 2, length * 0.35, 0,

    // Back top left
    0, length, 0,
    0, length * 0.35, -thickness,
    -width / 2, length * 0.35, 0,

    // Back top right
    0, length, 0,
    width / 2, length * 0.35, 0,
    0, length * 0.35, -thickness,

    // Back bottom left
    0, length * 0.35, -thickness,
    0, 0, 0,
    -width / 2, length * 0.35, 0,

    // Back bottom right
    0, length * 0.35, -thickness,
    width / 2, length * 0.35, 0,
    0, 0, 0,
  ]);

  geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geom.computeVertexNormals();
  return geom;
}

const HALF_LEAF_CONFIG = [
  { angle: 0, scaleX: 1.0, scaleY: 1.0, scaleZ: 1.0 },                 // Center (tallest)
  { angle: 0.55, scaleX: 0.9, scaleY: 0.75, scaleZ: 0.8 },             // Left 1 (points up-left)
  { angle: 1.1, scaleX: 0.8, scaleY: 0.5, scaleZ: 0.6 },               // Left 2 (points left)
  { angle: 1.65, scaleX: 0.65, scaleY: 0.35, scaleZ: 0.45 },           // Left 3 (points down-left)
  { angle: Math.PI, scaleX: 0.2, scaleY: 0.25, scaleZ: 0.3 }           // Bottom stem
];

const LEAF_COORDINATES = [0.22, 0.45, 0.72];

function Leaf({ curve, t, reveal, side }) {
  const groupRef = useRef(null);

  const geometry = useMemo(() => {
    const shape = createLeafShape();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 2,
      curveSegments: 6,
    });
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(Math.max(0.0001, reveal) * 0.45);
    }
  });

  const clampedT = Math.min(0.999, t);
  const position = useMemo(() => curve.getPointAt(clampedT), [curve, clampedT]);
  const quaternion = useMemo(() => {
    const tangent = curve.getTangentAt(clampedT);
    const base = quaternionFromDirection(tangent);
    const twist = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), side * 1.1);
    return base.multiply(twist);
  }, [curve, clampedT, side]);

  return (
    <group ref={groupRef} position={position} quaternion={quaternion} scale={0.0001}>
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial color="#cfa356" metalness={1} roughness={0.24} clearcoat={0.5} envMapIntensity={1.4} />
      </mesh>
    </group>
  );
}

function Flower({ opennessRef, reducedMotion }) {
  const bladeRefs = useRef([]);
  const lightRef = useRef(null);
  const scaleRef = useRef(0.0001);

  const baseBladeGeometry = useMemo(() => createFacetedBladeGeometry(0.75, 0.2, 0.05), []);

  useEffect(() => () => baseBladeGeometry.dispose(), [baseBladeGeometry]);

  useFrame((state) => {
    const openness = opennessRef.current;
    scaleRef.current += (Math.max(openness, 0.0001) - scaleRef.current) * 0.06;

    if (lightRef.current) {
      lightRef.current.intensity = scaleRef.current * 4.0;
    }

    HALF_LEAF_CONFIG.forEach((config, index) => {
      const mesh = bladeRefs.current[index];
      if (!mesh) return;

      const baseScale = scaleRef.current;
      mesh.scale.set(
        baseScale * config.scaleX,
        baseScale * config.scaleY,
        baseScale * config.scaleZ
      );

      if (index === 4) { // Bottom stem
        mesh.rotation.z = Math.PI;
      } else {
        const wobble = reducedMotion ? 0 : Math.sin(state.clock.getElapsedTime() * 0.5 + index) * 0.02;
        mesh.rotation.z = (config.angle * openness) + wobble;
      }
    });
  });

  return (
    <group position={[0, 0, 0]}>
      <pointLight
        ref={lightRef}
        position={[0, 0.4, 0.5]}
        color="#ffe88d"
        intensity={0}
        distance={4.0}
        decay={1.5}
        castShadow
      />

      {HALF_LEAF_CONFIG.map((config, index) => (
        <mesh
          key={index}
          ref={(element) => {
            bladeRefs.current[index] = element;
          }}
          geometry={baseBladeGeometry}
          castShadow
          scale={0.0001}
        >
          <meshPhysicalMaterial
            color="#d4af37"
            metalness={1.0}
            roughness={0.12}
            clearcoat={1.0}
            clearcoatRoughness={0.03}
            envMapIntensity={2.0}
          />
        </mesh>
      ))}
    </group>
  );
}

function GrowingStem({ stage, waterPulse, reducedMotion, onGrowthUpdate }) {
  const meshRef = useRef(null);
  const growthRef = useRef(0.0001);
  const pulseStartRef = useRef(-Infinity);
  const [smoothT, setSmoothT] = useState(0.0001);

  // The stem curves up gracefully
  const stemPoints = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.1, 0.4, 0.05),
    new THREE.Vector3(-0.05, 0.9, -0.05),
    new THREE.Vector3(0, 1.4, 0)
  ], []);

  const baseCurve = useMemo(() => new THREE.CatmullRomCurve3(stemPoints), [stemPoints]);

  const growthVelocityRef = useRef(0);

  useEffect(() => {
    if (waterPulse) {
      pulseStartRef.current = performance.now();
    }
  }, [waterPulse]);

  useFrame(() => {
    const target = targetGrowth(stage);

    if (reducedMotion) {
      growthRef.current += (target - growthRef.current) * 0.08;
    } else {
      // 2nd-order spring-damper physics solver for organic elastic sprout
      const growthForce = (target - growthRef.current) * 0.05;
      growthVelocityRef.current += growthForce;
      growthVelocityRef.current *= 0.83; // Friction dampening
      growthRef.current += growthVelocityRef.current;
    }

    const rounded = Math.round(growthRef.current * 100) / 100;
    if (Math.abs(rounded - smoothT) > 0.0001) {
      setSmoothT(rounded);
      onGrowthUpdate(rounded, baseCurve);
    }

    if (meshRef.current) {
      const pulseDuration = reducedMotion ? 0.6 : 1.8;
      const elapsed = (performance.now() - pulseStartRef.current) / 1000;
      const material = meshRef.current.material;

      if (elapsed >= 0 && elapsed < pulseDuration) {
        const wave = Math.max(0, Math.sin((elapsed / pulseDuration) * Math.PI));
        material.emissiveIntensity = 0.1 + wave * 1.5;
      } else {
        material.emissiveIntensity = 0.08;
      }
    }
  });

  const geometry = useMemo(() => {
    if (smoothT <= 0.02) return null;

    const sampleCount = 64;
    const grownSamples = Math.max(2, Math.round(sampleCount * smoothT));
    const points = baseCurve.getPoints(sampleCount).slice(0, grownSamples);
    const subCurve = new THREE.CatmullRomCurve3(points.length > 1 ? points : [points[0], points[0].clone().add(new THREE.Vector3(0, 0.01, 0))]);

    return createTaperedTubeGeometry(subCurve, {
      radiusStart: 0.05,
      radiusEnd: 0.015,
      tubularSegments: Math.max(8, Math.round(48 * smoothT)),
      radialSegments: 8,
    });
  }, [baseCurve, smoothT]);

  useEffect(() => () => geometry?.dispose(), [geometry]);

  return (
    <group>
      {geometry ? (
        <mesh ref={meshRef} geometry={geometry} castShadow>
          <meshPhysicalMaterial
            color="#cfa356"
            emissive="#f6e4b0"
            emissiveIntensity={0.08}
            metalness={1}
            roughness={0.2}
            clearcoat={0.6}
            envMapIntensity={1.5}
          />
        </mesh>
      ) : null}

      {LEAF_COORDINATES.map((t, index) => {
        const reveal = THREE.MathUtils.clamp((smoothT - t + 0.18) / 0.18, 0, 1);
        return reveal > 0.01 ? (
          <Leaf key={index} curve={baseCurve} t={t} reveal={reveal} side={index % 2 === 0 ? 1 : -1} />
        ) : null;
      })}
    </group>
  );
}

export function GoldenBloom({ stage, waterPulse = 0, reducedMotion = false }) {
  const groupRef = useRef(null);
  const bloomOpennessRef = useRef(0);
  const bloomVelocityRef = useRef(0);
  const [flowerPos, setFlowerPos] = useState([0, 0, 0]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // The plant dynamically centers and bounds itself beautifully based on stage
    const t = state.clock.getElapsedTime();
    if (!reducedMotion) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.03;
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.05;
    }

    const targetBloomVal = targetBloom(stage);
    
    if (reducedMotion) {
      bloomOpennessRef.current += (targetBloomVal - bloomOpennessRef.current) * 0.05;
    } else {
      // 2nd-order spring-damper physics solver for flower fanning out with organic elastic bounce
      const force = (targetBloomVal - bloomOpennessRef.current) * 0.04;
      bloomVelocityRef.current += force;
      bloomVelocityRef.current *= 0.82; // Friction dampening
      bloomOpennessRef.current += bloomVelocityRef.current;
    }
  });

  const handleGrowthUpdate = (smoothT, curve) => {
    // Keep flower at the very tip of the stem
    const tip = curve.getPointAt(Math.min(0.999, smoothT));
    setFlowerPos([tip.x, tip.y, tip.z]);
  };

  return (
    <group ref={groupRef}>
      <GrowingStem stage={stage} waterPulse={waterPulse} reducedMotion={reducedMotion} onGrowthUpdate={handleGrowthUpdate} />
      <group position={flowerPos}>
        {stage >= 5 && (
          <Flower opennessRef={bloomOpennessRef} reducedMotion={reducedMotion} />
        )}
      </group>
    </group>
  );
}
