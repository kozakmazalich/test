import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createTaperedTubeGeometry, quaternionFromDirection } from './geometryUtils.js';

/**
 * An original golden plant sculpture — NOT a recreation of the
 * reference leaf image. The reference informs material/style only
 * (metallic gold, faceted, premium). The structure here is organic:
 * curved tapering stems that lengthen day by day, small unfurling
 * leaves, and a flower head that buds and blooms across the final
 * days, rather than a static shape that merely scales or fades in.
 */
const STEMS = [
  {
    id: 'main',
    startStage: 1,
    growSpan: 3,
    points: [[0, 0, 0], [0.04, 0.55, 0.04], [0.12, 1.05, -0.04], [0.08, 1.55, 0.08]],
    radiusStart: 0.045,
    radiusEnd: 0.014,
    hasBloom: true,
    bloomFromStage: 5,
  },
  {
    id: 'left',
    startStage: 2,
    growSpan: 3,
    points: [[0, 0, 0], [-0.22, 0.32, 0.08], [-0.48, 0.68, 0.14], [-0.58, 0.98, 0.05]],
    radiusStart: 0.032,
    radiusEnd: 0.01,
    leafAt: [0.5, 0.88],
  },
  {
    id: 'right',
    startStage: 3,
    growSpan: 3,
    points: [[0, 0, 0], [0.26, 0.28, -0.1], [0.5, 0.62, -0.18], [0.6, 0.9, -0.1]],
    radiusStart: 0.03,
    radiusEnd: 0.01,
    leafAt: [0.55, 0.92],
  },
];

function targetGrowth(stage, stem) {
  if (stage < stem.startStage) {
    return stem.id === 'main' ? 0.06 : 0;
  }

  const progress = Math.min(1, (stage - stem.startStage + 1) / stem.growSpan);
  return Math.max(0.08, progress);
}

function targetBloom(stage, stem) {
  if (!stem.hasBloom || stage < stem.bloomFromStage) {
    return 0;
  }

  const span = 7 - stem.bloomFromStage + 1;
  return Math.min(1, (stage - stem.bloomFromStage + 1) / span);
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

function createPetalShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.16, 0.24, 0.11, 0.52);
  shape.quadraticCurveTo(0.05, 0.74, 0, 0.82);
  shape.quadraticCurveTo(-0.05, 0.74, -0.11, 0.52);
  shape.quadraticCurveTo(-0.16, 0.24, 0, 0);
  shape.closePath();
  return shape;
}

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
      groupRef.current.scale.setScalar(Math.max(0.0001, reveal));
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

function Bloom({ opennessRef, reducedMotion }) {
  const petalCount = 6;
  const coreRef = useRef(null);
  const petalRefs = useRef([]);
  const scaleRef = useRef(0.0001);

  const petalGeometry = useMemo(() => {
    const shape = createPetalShape();
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.015,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 2,
      curveSegments: 8,
    });
  }, []);

  useEffect(() => () => petalGeometry.dispose(), [petalGeometry]);

  useFrame((state) => {
    const openness = opennessRef.current;
    scaleRef.current += (Math.max(openness, 0.0005) - scaleRef.current) * 0.08;

    if (coreRef.current) {
      coreRef.current.scale.setScalar(scaleRef.current);
    }

    const closedAngle = 0.3;
    const openAngle = 1.35;

    petalRefs.current.forEach((petal, index) => {
      if (!petal) {
        return;
      }

      const wobble = reducedMotion ? 0 : Math.sin(state.clock.getElapsedTime() * 0.6 + index) * 0.02;
      petal.rotation.x = -(closedAngle + (openAngle - closedAngle) * openness + wobble);
      petal.scale.setScalar(scaleRef.current);
    });
  });

  return (
    <group>
      <mesh ref={coreRef} castShadow scale={0.0001}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshPhysicalMaterial color="#f6e4b0" metalness={1} roughness={0.16} envMapIntensity={1.6} />
      </mesh>

      {Array.from({ length: petalCount }, (_, index) => {
        const angle = (index / petalCount) * Math.PI * 2;
        return (
          <group key={index} rotation={[0, angle, 0]}>
            <group
              ref={(element) => {
                petalRefs.current[index] = element;
              }}
              position={[0, 0.02, 0.06]}
              scale={0.0001}
            >
              <mesh geometry={petalGeometry} castShadow>
                <meshPhysicalMaterial
                  color="#f3e2b8"
                  metalness={0.4}
                  roughness={0.18}
                  clearcoat={0.8}
                  transmission={0.12}
                  thickness={0.3}
                  envMapIntensity={1.5}
                />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}

function Stem({ stem, stage, waterPulse, reducedMotion }) {
  const meshRef = useRef(null);
  const growthRef = useRef(0.0001);
  const bloomOpennessRef = useRef(0);
  const pulseStartRef = useRef(-Infinity);
  const [smoothT, setSmoothT] = useState(0.0001);

  const baseCurve = useMemo(
    () => new THREE.CatmullRomCurve3(stem.points.map((point) => new THREE.Vector3(...point))),
    [stem.points],
  );

  useEffect(() => {
    if (waterPulse) {
      pulseStartRef.current = performance.now();
    }
  }, [waterPulse]);

  useFrame(() => {
    const target = targetGrowth(stage, stem);
    growthRef.current += (target - growthRef.current) * 0.05;

    const rounded = Math.round(growthRef.current * 80) / 80;
    if (Math.abs(rounded - smoothT) > 0.0001) {
      setSmoothT(rounded);
    }

    const bloomTarget = targetBloom(stage, stem);
    bloomOpennessRef.current += (bloomTarget - bloomOpennessRef.current) * 0.04;

    if (meshRef.current) {
      const pulseDuration = reducedMotion ? 0.6 : 1.8;
      const elapsed = (performance.now() - pulseStartRef.current) / 1000;
      const material = meshRef.current.material;

      if (elapsed >= 0 && elapsed < pulseDuration) {
        const wave = Math.max(0, Math.sin((elapsed / pulseDuration) * Math.PI));
        material.emissiveIntensity = 0.1 + wave * 1.2;
      } else {
        material.emissiveIntensity = 0.08;
      }

      if (!reducedMotion) {
        const t = performance.now() / 1000;
        meshRef.current.rotation.z = Math.sin(t * 0.4 + stem.startStage) * 0.015;
      }
    }
  });

  const geometry = useMemo(() => {
    if (smoothT <= 0.01) {
      return null;
    }

    const sampleCount = 48;
    const grownSamples = Math.max(2, Math.round(sampleCount * smoothT));
    const points = baseCurve.getPoints(sampleCount).slice(0, grownSamples);
    const subCurve = new THREE.CatmullRomCurve3(points.length > 1 ? points : [points[0], points[0].clone().add(new THREE.Vector3(0, 0.01, 0))]);

    return createTaperedTubeGeometry(subCurve, {
      radiusStart: stem.radiusStart,
      radiusEnd: THREE.MathUtils.lerp(stem.radiusStart, stem.radiusEnd, smoothT),
      tubularSegments: Math.max(4, Math.round(28 * smoothT)),
      radialSegments: 7,
    });
  }, [baseCurve, smoothT, stem]);

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
            roughness={0.22}
            clearcoat={0.5}
            envMapIntensity={1.4}
          />
        </mesh>
      ) : null}

      {stem.leafAt?.map((t, index) => {
        const reveal = THREE.MathUtils.clamp((smoothT - t + 0.18) / 0.18, 0, 1);
        return reveal > 0.01 ? (
          <Leaf key={index} curve={baseCurve} t={t} reveal={reveal} side={index % 2 === 0 ? 1 : -1} />
        ) : null;
      })}

      {stem.hasBloom ? (
        <group position={baseCurve.getPointAt(0.999)}>
          <Bloom opennessRef={bloomOpennessRef} reducedMotion={reducedMotion} />
        </group>
      ) : null}
    </group>
  );
}

export function GoldenBloom({ stage, waterPulse = 0, reducedMotion = false }) {
  return (
    <group>
      {STEMS.map((stem) => (
        <Stem key={stem.id} stem={stem} stage={stage} waterPulse={waterPulse} reducedMotion={reducedMotion} />
      ))}
    </group>
  );
}
