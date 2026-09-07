import { Quaternion, TubeGeometry, Vector3 } from 'three';

const UP_AXIS = new Vector3(0, 1, 0);

/**
 * Builds a TubeGeometry that tapers smoothly from `radiusStart` to
 * `radiusEnd` along the curve, giving stems a natural, organic profile
 * instead of a uniform cylinder.
 */
export function createTaperedTubeGeometry(curve, { radiusStart, radiusEnd, tubularSegments = 24, radialSegments = 8, closed = false }) {
  const geometry = new TubeGeometry(curve, tubularSegments, 1, radialSegments, closed);
  const positions = geometry.attributes.position;

  for (let i = 0; i <= tubularSegments; i += 1) {
    const t = i / tubularSegments;
    const radius = radiusStart + (radiusEnd - radiusStart) * t;
    const center = curve.getPointAt(t);

    for (let j = 0; j <= radialSegments; j += 1) {
      const index = i * (radialSegments + 1) + j;
      const x = positions.getX(index);
      const y = positions.getY(index);
      const z = positions.getZ(index);
      positions.setXYZ(
        index,
        center.x + (x - center.x) * radius,
        center.y + (y - center.y) * radius,
        center.z + (z - center.z) * radius,
      );
    }
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Returns a quaternion that rotates the +Y axis to point along
 * `direction` — used to orient leaves along a stem's tangent.
 */
export function quaternionFromDirection(direction) {
  const normalized = direction.clone().normalize();
  return new Quaternion().setFromUnitVectors(UP_AXIS, normalized);
}
