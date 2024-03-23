import { TileType } from './TileType';

export interface GlobalOptions {
  cols: number;
  rows: number;
  containerLeftBound: number;
  containerRightBound: number;
  uiScale: number;
  tileTypes: TileType[];
}
