import { PointData } from 'pixi.js';
import { IView } from '../../core';
import { TileType } from '../../model';

export interface IBoardView extends IView {
  reset(): void;
  setTile(position: PointData, type: TileType | undefined): Promise<void>;
  setBlastTile(position: PointData): Promise<void>;
  moveTile(from: PointData, to: PointData): Promise<void>;
  switchTiles(from: PointData, to: PointData): Promise<void>;
  soundClear(): Promise<void>;
  soundBlast(): Promise<void>;
}
