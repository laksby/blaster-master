import { IView } from '../../core';
import { TileType } from '../../types';

export interface IBoardView extends IView {
  setTile(x: number, y: number, type: TileType): void;
  clearTile(x: number, y: number): void;
}
