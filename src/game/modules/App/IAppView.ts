import { PointData } from 'pixi.js';
import { IView } from '../../core';

export interface IAppView extends IView {
  shockWave(position: PointData): Promise<void>;
}
