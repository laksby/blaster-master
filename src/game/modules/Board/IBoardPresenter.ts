import { PointData } from 'pixi.js';
import { IPresenter } from '../../core';

export interface IBoardPresenter extends IPresenter {
  click(position: PointData): Promise<void>;
}
