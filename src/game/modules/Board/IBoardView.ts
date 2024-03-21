import { PointData } from 'pixi.js';
import { IView } from '../../core';
import { TileType } from '../../types';

export interface IBoardView extends IView {
  setTile(position: PointData, type: TileType | undefined): Promise<void>;
  moveTile(from: PointData, to: PointData): Promise<void>;
  switchTiles(from: PointData, to: PointData): Promise<void>;
}
