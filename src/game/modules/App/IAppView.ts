import { PointData } from 'pixi.js';
import { IView } from '../../core';

export interface IAppView extends IView {
  shockWave(position: PointData): Promise<void>;
  hideOverlay(): void;
  showVictory(level: number): void;
  showDefeat(reason: string): void;
}
