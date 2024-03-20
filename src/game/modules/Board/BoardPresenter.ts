import { BasePresenter } from '../../core';
import { TileType } from '../../types';
import { IBoardPresenter } from './IBoardPresenter';
import { IBoardView } from './IBoardView';

export class BoardPresenter extends BasePresenter<IBoardView> implements IBoardPresenter {
  private cols = 0;
  private rows = 0;
  private tiles: TileType[][] = [];

  public generate(cols: number, rows: number): void {
    this.cols = cols;
    this.rows = rows;
    this.tiles = this.generateTiles(cols, rows);

    this.tiles.forEach((row, y) =>
      row.forEach((tile, x) => {
        this.view.setTile(x, y, tile);
      }),
    );
  }

  public click(x: number, y: number): void {
    const group: [number, number][] = [];
    this.fillClearGroup(x, y, this.tiles[y][x], group);

    if (group.length >= 2) {
      group.forEach(item => {
        this.view.clearTile(item[0], item[1]);
      });
    }
  }

  protected generateTiles(cols: number, rows: number): TileType[][] {
    const types = Object.values(TileType);

    return new Array(rows).fill(0).map(() =>
      new Array(cols).fill(0).map(() => {
        return this.generateTile(types);
      }),
    );
  }

  private generateTile(types: TileType[]): TileType {
    const random = Math.floor(Math.random() * types.length);
    return types[random];
  }

  private fillClearGroup(x: number, y: number, type: TileType, group: [number, number][]): void {
    if (group.some(item => item[0] === x && item[1] === y)) {
      return;
    }

    group.push([x, y]);

    const neighbors = [
      // Top
      y > 0 ? [x, y - 1] : undefined,
      // Left
      x > 0 ? [x - 1, y] : undefined,
      // Right
      x < this.cols - 1 ? [x + 1, y] : undefined,
      // Bottom
      y < this.rows - 1 ? [x, y + 1] : undefined,
    ];

    neighbors.forEach(neighbor => {
      if (neighbor) {
        const [neighborX, neighborY] = neighbor;

        if (this.tiles[neighborY][neighborX] === type) {
          this.fillClearGroup(neighborX, neighborY, type, group);
        }
      }
    });
  }
}
