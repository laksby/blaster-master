import { PointData } from 'pixi.js';
import { TileType } from '../types';

export type OnShuffleHandler = (shifts: [PointData, PointData][]) => void | Promise<void>;

export class GameModel {
  public static readonly singleton = new GameModel();

  private _cols = 9;
  private _rows = 10;
  private _types = Object.values(TileType);
  private _tiles: (TileType | undefined)[][] = [];
  private _shuffles = 3;
  private _onShuffle?: OnShuffleHandler;

  private constructor() {}

  public get cols(): number {
    return this._cols;
  }

  public get rows(): number {
    return this._rows;
  }

  public get types(): TileType[] {
    return this._types;
  }

  public get tiles(): (TileType | undefined)[][] {
    return this._tiles;
  }

  public get shuffles(): number {
    return this._shuffles;
  }

  public getRow(index: number): (TileType | undefined)[] {
    return this.tiles[index];
  }

  public getTile(position: PointData): TileType | undefined {
    return this.tiles[position.y][position.x];
  }

  public setTile(position: PointData, tile: TileType | undefined): void {
    this.tiles[position.y][position.x] = tile;
  }

  public getEmptyPositions(): PointData[] {
    const emptyPositions: PointData[] = [];

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (!this.tiles[y][x]) {
          emptyPositions.push({ x, y });
        }
      }
    }

    return emptyPositions;
  }

  public generate() {
    this._tiles = [];

    for (let y = 0; y < this.rows; y++) {
      this.tiles.push([]);

      for (let x = 0; x < this.cols; x++) {
        const tile = this.getGeneratedTile();
        this.tiles[y].push(tile);
      }
    }
  }

  public generateTile(position: PointData): TileType {
    const tile = this.getGeneratedTile();
    this.setTile(position, tile);
    return tile;
  }

  public searchClearCandidates(position: PointData, type: TileType, group: PointData[]): void {
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
          this.searchClearCandidates(neighbor, type, group);
        }
      }
    });
  }

  public applyGravity(): [PointData, PointData][] {
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

    return shifts;
  }

  public shuffle(): [PointData, PointData][] {
    const shifts: [PointData, PointData][] = [];

    for (let y = 0; y < this.rows; y++) {
      for (let x = this.cols - 1; x > 0; x--) {
        const newX = Math.floor(Math.random() * (x + 1));
        [this.tiles[y][x], this.tiles[y][newX]] = [this.tiles[y][newX], this.tiles[y][x]];
        shifts.push([
          { x, y },
          { x: newX, y },
        ]);
      }
    }

    this._shuffles--;
    this._onShuffle?.(shifts);

    return shifts;
  }

  public onShuffle(onShuffle: OnShuffleHandler): void {
    this._onShuffle = onShuffle;
  }

  private getGeneratedTile(): TileType {
    const random = Math.floor(Math.random() * this.types.length);
    return this.types[random];
  }

  private getClosestTopTileY(position: PointData): number {
    let level = position.y - 1;

    while (level >= 0 && !this.tiles[level][position.x]) {
      level--;
    }

    return level;
  }
}
