import { PointData } from 'pixi.js';
import { IPresenter } from '../../core';

export interface IBoardPresenter extends IPresenter {
  generate(): Promise<void>;
  click(position: PointData): Promise<void>;
}
