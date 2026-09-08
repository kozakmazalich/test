import { CanvasTexture, SRGBColorSpace } from 'three';

const BLADE_ANGLES = [0, -38, -76, -114, 38, 76, 114, 180];
const BLADE_LENGTHS = [0.95, 0.82, 0.65, 0.45, 0.82, 0.65, 0.45, 0.35];
const BLADE_WIDTHS = [0.18, 0.16, 0.14, 0.11, 0.16, 0.14, 0.11, 0.08];

function drawBlade(ctx, angleDeg, length, width, size) {
  const angle = (angleDeg * Math.PI) / 180;
  ctx.save();
  ctx.rotate(angle);

  const tipY = -length * size;
  const shoulderY = tipY * 0.6;
  const halfWidth = (width * size) / 2;

  // Left half of the blade
  const lightGradient = ctx.createLinearGradient(-halfWidth, shoulderY, 0, tipY);
  lightGradient.addColorStop(0, '#8a6425');
  lightGradient.addColorStop(0.55, '#e8cf9a');
  lightGradient.addColorStop(1, '#fff6e2');
  ctx.fillStyle = lightGradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-halfWidth, shoulderY);
  ctx.lineTo(0, tipY);
  ctx.closePath();
  ctx.fill();

  // Right half of the blade
  const darkGradient = ctx.createLinearGradient(0, shoulderY, halfWidth, 0);
  darkGradient.addColorStop(0, '#f6e4b0');
  darkGradient.addColorStop(0.5, '#a9812f');
  darkGradient.addColorStop(1, '#5a3f18');
  ctx.fillStyle = darkGradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, tipY);
  ctx.lineTo(halfWidth, shoulderY);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 248, 224, 0.3)';
  ctx.lineWidth = Math.max(1, size * 0.004);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, tipY);
  ctx.stroke();

  ctx.restore();
}

export function createEmblemTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#050403';
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  // Center it properly
  ctx.translate(size * 0.5, size * 0.55);
  BLADE_ANGLES.forEach((angle, index) => {
    drawBlade(ctx, angle, BLADE_LENGTHS[index], BLADE_WIDTHS[index], size * 0.45);
  });
  ctx.restore();

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createReverseTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#5a3f18';
  ctx.fillRect(0, 0, size, size);

  const center = size / 2;

  for (let radius = size * 0.46; radius > 10; radius -= 10) {
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = radius % 20 < 10 ? 'rgba(246, 228, 176, 0.35)' : 'rgba(90, 63, 24, 0.4)';
    ctx.lineWidth = 6;
    ctx.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
