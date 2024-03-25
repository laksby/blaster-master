import { PointData } from 'pixi.js';
import { GameBoard } from './GameBoard';
import { GameEvents } from './GameEvents';
import { GameLevel } from './GameLevel';
import { TileType } from './TileType';

export class GameModel {
  private readonly _events = new GameEvents();
  private readonly _level = new GameLevel();
  private readonly _board = new GameBoard();

  public get events(): GameEvents {
    return this._events;
  }

  public get level(): GameLevel {
    return this._level;
  }

  public get board(): GameBoard {
    return this._board;
  }

  public populateBoard() {
    this.board.fill(() => this.level.generateTile());
  }

  public populateBoardTile(position: PointData): TileType {
    return this.board.setTile(position, this.level.generateTile())!;
  }

  public getEmptyPositions(): PointData[] {
    const emptyPositions: PointData[] = [];

    for (let y = 0; y < this.board.rows; y++) {
      for (let x = 0; x < this.board.cols; x++) {
        if (!this.board.hasTile({ x, y })) {
          emptyPositions.push({ x, y });
        }
      }
    }

    return emptyPositions;
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
      position.x < this.board.cols - 1 ? { x: position.x + 1, y: position.y } : undefined,
      // Bottom
      position.y < this.board.rows - 1 ? { x: position.x, y: position.y + 1 } : undefined,
    ];

    neighbors.forEach(neighbor => {
      if (neighbor) {
        if (this.board.checkTile(neighbor, type)) {
          this.searchClearCandidates(neighbor, type, group);
        }
      }
    });
  }

  public applyGravity(): [PointData, PointData][] {
    const shifts: [PointData, PointData][] = [];

    for (let y = this.board.rows - 1; y >= 0; y--) {
      const row = this.board.getRow(y);

      for (let x = 0; x < this.board.cols; x++) {
        const tile = row[x];

        if (!tile) {
          const position = { x, y };
          const topY = this.getClosestTopTileY(position);

          if (topY >= 0 && topY < position.y) {
            const topTilePosition = { x, y: topY };
            const topTile = this._board.getTile(topTilePosition);

            if (topTile) {
              this.board.setTile(position, topTile);
              this.board.setTile(topTilePosition, undefined);

              shifts.push([{ x, y: topY }, position]);
            }
          }
        }
      }
    }

    return shifts;
  }

  public async updateScore(clearedGroup: PointData[]): Promise<void> {
    this.level.increaseScore(clearedGroup.length);
    await this.events.emit('scoreUpdate', [this.level.score]);

    if (this.level.isScoreVictory) {
      await this.victory();
    }
  }

  public async updateTurn(): Promise<void> {
    this.level.increaseTurn();
    await this.events.emit('turnUpdate', [this.level.turn]);

    if (this.level.isTurnDefeat) {
      await this.defeat('Not reached score in limited turns');
    }
  }

  public async shuffle(): Promise<[PointData, PointData][]> {
    const shifts: [PointData, PointData][] = [];

    if (this.level.shuffles <= 0) {
      return shifts;
    }

    for (let y = 0; y < this.board.rows; y++) {
      for (let x = this.board.cols - 1; x > 0; x--) {
        const newX = Math.floor(Math.random() * (x + 1));
        this.board.swapTiles({ x, y }, { x: newX, y });
        shifts.push([
          { x, y },
          { x: newX, y },
        ]);
      }
    }

    this.level.decreaseShuffles();
    await this.events.emit('shuffle', [shifts]);

    if (this.level.shuffles <= 0) {
      const combinations = this.analyzeForCombinations();

      if (combinations.length <= 0) {
        await this.defeat('No more combinations on board');
      }
    }

    return shifts;
  }

  private getClosestTopTileY(position: PointData): number {
    let level = position.y - 1;

    while (level >= 0 && !this.board.hasTile({ x: position.x, y: level })) {
      level--;
    }

    return level;
  }

  private async defeat(reason: string): Promise<void> {
    await this.events.emit('defeat', [reason]);
  }

  private async victory(): Promise<void> {
    await this.events.emit('victory', []);
  }

  private analyzeForCombinations(): PointData[][] {
    const allPositions: PointData[] = [];
    const combinations: PointData[][] = [];

    for (let y = 0; y < this.board.rows; y++) {
      for (let x = 0; x < this.board.cols; x++) {
        allPositions.push({ x, y });
      }
    }

    while (allPositions.length > 0) {
      const group: PointData[] = [];
      const position = allPositions[0];
      const tile = this.board.getTile(position);

      if (!tile) {
        allPositions.splice(0, 1);
      } else {
        this.searchClearCandidates(position, tile, group);

        if (group.length >= this.board.clearThreshold) {
          combinations.push(group);
        }

        for (const item of group) {
          const index = allPositions.findIndex(position => position.x === item.x && position.y === item.y);

          if (index >= 0) {
            allPositions.splice(index, 1);
          }
        }
      }
    }

    return combinations;
  }
}
