import { PointData } from 'pixi.js';
import { BasePresenter } from '../../core';
import { TileType } from '../../types';
import { IBoardPresenter } from './IBoardPresenter';
import { IBoardView } from './IBoardView';

export class BoardPresenter extends BasePresenter<IBoardView> implements IBoardPresenter {
  private cols = 0;
  private rows = 0;
  private tiles: (TileType | undefined)[][] = [];
  private types = Object.values(TileType);

  public async generate(cols: number, rows: number): Promise<void> {
    this.cols = cols;
    this.rows = rows;
    await this.generateTiles();
  }

  public async click(position: PointData): Promise<void> {
    const type = this.tiles[position.y][position.x];

    if (!type) {
      return;
    }

    const group: PointData[] = [];
    this.fillClearGroup(position, type, group);

    if (group.length >= 2) {
      await this.clearTiles(group);
      await this.shiftTiles();
      await this.fillEmptyTiles();
    }
  }

  protected async generateTiles(): Promise<void> {
    this.tiles = [];

    for (let y = 0; y < this.rows; y++) {
      this.tiles.push([]);
      const tileRenderPull: [PointData, TileType][] = [];

      for (let x = 0; x < this.cols; x++) {
        const tile = this.generateTile();
        this.tiles[y].push(tile);
        tileRenderPull.push([{ x, y }, tile]);
      }

      await Promise.all(
        tileRenderPull.map(([position, type]) => {
          return this.view.setTile(position, type);
        }),
      );
    }
  }

  protected async clearTiles(group: PointData[]): Promise<void> {
    for (const item of group) {
      this.tiles[item.y][item.x] = undefined;
      await this.view.setTile(item, undefined);
    }
  }

  private generateTile(): TileType {
    const random = Math.floor(Math.random() * this.types.length);
    return this.types[random];
  }

  private fillClearGroup(position: PointData, type: TileType, group: PointData[]): void {
    if (group.some(item => item.x === position.x && item.y === position.y)) {
      return;
    }

    group.push(position);

    const neighbors = [
      // Top
      position.y > 0 ? { x: position.x, y: position.y - 1 } : undefined,
      // Left
      position.x > 0 ? { x: position.x - 1, y: position.y } : undefined,
      // Right
      position.x < this.cols - 1 ? { x: position.x + 1, y: position.y } : undefined,
      // Bottom
      position.y < this.rows - 1 ? { x: position.x, y: position.y + 1 } : undefined,
    ];

    neighbors.forEach(neighbor => {
      if (neighbor) {
        if (this.tiles[neighbor.y][neighbor.x] === type) {
          this.fillClearGroup(neighbor, type, group);
        }
      }
    });
  }

  private async shiftTiles(): Promise<void> {
    const shifts: [PointData, PointData][] = [];

    for (let y = this.rows - 1; y >= 0; y--) {
      const row = this.tiles[y];

      for (let x = 0; x < this.cols; x++) {
        const tile = row[x];

        if (!tile) {
          const position = { x, y };
          const topY = this.getClosestTopTileY(position);

          if (topY >= 0 && topY < position.y) {
            const topTile = this.tiles[topY][x];

            if (topTile) {
              this.tiles[y][x] = this.tiles[topY][x];
              this.tiles[topY][x] = undefined;

              shifts.push([{ x, y: topY }, position]);
            }
          }
        }
      }
    }

    await Promise.all(
      shifts.map(([from, to]) => {
        return this.view.moveTile(from, to);
      }),
    );
  }

  private async fillEmptyTiles(): Promise<void> {
    const tileRenderPull: [PointData, TileType][] = [];

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (!this.tiles[y][x]) {
          const tile = this.generateTile();
          this.tiles[y][x] = tile;
          tileRenderPull.push([{ x, y }, tile]);
        }
      }
    }

    await Promise.all(
      tileRenderPull.map(([position, type]) => {
        return this.view.setTile(position, type);
      }),
    );
  }

  private getClosestTopTileY(position: PointData): number {
    let level = position.y - 1;

    while (level >= 0 && !this.tiles[level][position.x]) {
      level--;
    }

    return level;
  }
}
