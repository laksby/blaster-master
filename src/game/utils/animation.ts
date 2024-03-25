import { PointData } from 'pixi.js';

export function vectorLerp(from: PointData, to: PointData, amount: number): PointData {
  return {
    x: (1 - amount) * from.x + amount * to.x,
    y: (1 - amount) * from.y + amount * to.y,
  };
}

export function scalarOscillate(from: number, to: number, amount: number) {
  const amplitude = (to - from) / 2;
  return from + amplitude * Math.sin(2 * Math.PI * amount);
}
