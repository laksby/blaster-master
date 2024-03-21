import { PointData } from 'pixi.js';

export function vectorLerp(from: PointData, to: PointData, amount: number): PointData {
  return {
    x: (1 - amount) * from.x + amount * to.x,
    y: (1 - amount) * from.y + amount * to.y,
  };
}
