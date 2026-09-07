import { useEffect, useState } from 'react';

/**
 * A gold neon radial progress ring overlaid on the avatar frame's
 * center, showing day-by-day ritual progress across the 7-day cycle.
 * Pure SVG/CSS — deliberately not part of the 3D scene, so it stays
 * simple, predictable, and legible over either the real avatar photo
 * or the 3D fallback beneath it.
 */
function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export function DayHalo({ currentDay = 0, totalDays = 7, scanPulse = 0 }) {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (!scanPulse) {
      return;
    }

    setIsPulsing(true);
    const timer = setTimeout(() => setIsPulsing(false), 1200);
    return () => clearTimeout(timer);
  }, [scanPulse]);

  const radius = 33;
  const center = 50;
  const gapDeg = 7;
  const segmentSpan = (360 - gapDeg * totalDays) / totalDays;
  const chargingIndex = currentDay - 1;

  return (
    <svg className="day-halo" viewBox="0 0 100 100" aria-hidden="true">
      {Array.from({ length: totalDays }, (_, index) => {
        const startAngle = -90 + index * (segmentSpan + gapDeg);
        const endAngle = startAngle + segmentSpan;
        const completed = index < currentDay;
        const charging = isPulsing && index === chargingIndex;
        const path = describeArc(center, center, radius, startAngle, endAngle);

        return (
          <path
            key={index}
            d={path}
            fill="none"
            className={`day-halo-segment${completed ? ' is-complete' : ''}${charging ? ' is-charging' : ''}`}
          />
        );
      })}
    </svg>
  );
}
