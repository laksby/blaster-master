import { PointData } from 'pixi.js';
import { IPresenter } from '../../core';

export interface IBoardPresenter extends IPresenter {
  generate(cols: number, rows: number): Promise<void>;
  click(position: PointData): Promise<void>;
}
