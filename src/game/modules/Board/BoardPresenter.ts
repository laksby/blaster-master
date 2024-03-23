import { PointData } from 'pixi.js';
import { BasePresenter } from '../../core';
import { GameModel } from '../../model';
import { TileType } from '../../types';
import { IBoardPresenter } from './IBoardPresenter';
import { IBoardView } from './IBoardView';

export class BoardPresenter extends BasePresenter<IBoardView> implements IBoardPresenter {
  protected prepare(): void {
    GameModel.singleton.onShuffle(async shifts => {
      await this.switchTiles(shifts);
    });
  }

  public async generate(): Promise<void> {
    await this.generateTiles();
  }

  public async click(position: PointData): Promise<void> {
    const type = GameModel.singleton.getTile(position);

    if (!type) {
      return;
    }

    const group: PointData[] = [];
    GameModel.singleton.searchClearCandidates(position, type, group);

    if (group.length >= GameModel.singleton.clearThreshold) {
      await this.clearTiles(group);
      GameModel.singleton.updateScore(group);

      const shifts = GameModel.singleton.applyGravity();
      await this.shiftTiles(shifts);
      await this.fillEmptyTiles();

      GameModel.singleton.updateTurn();
    }
  }

  private async generateTiles(): Promise<void> {
    GameModel.singleton.generate();
    await this.updateTiles();
  }

  private async updateTiles(): Promise<void> {
    for (let y = 0; y < GameModel.singleton.rows; y++) {
      await Promise.all(
        GameModel.singleton.getRow(y).map((type, x) => {
          return this.view.setTile({ x, y }, type);
        }),
      );
    }
  }

  private async clearTiles(group: PointData[]): Promise<void> {
    for (const item of group) {
      GameModel.singleton.setTile(item, undefined);
    }

    const emptyPositions = GameModel.singleton.getEmptyPositions();

    await Promise.all(
      emptyPositions.map(position => {
        return this.view.setTile(position, undefined);
      }),
    );
  }

  private async shiftTiles(shifts: [PointData, PointData][]): Promise<void> {
    await Promise.all(
      shifts.map(([from, to]) => {
        return this.view.moveTile(from, to);
      }),
    );
  }

  private async switchTiles(shifts: [PointData, PointData][]): Promise<void> {
    await Promise.all(
      shifts.map(([from, to]) => {
        return this.view.switchTiles(from, to);
      }),
    );
  }

  private async fillEmptyTiles(): Promise<void> {
    const tileRenderPull: [PointData, TileType][] = [];
    const emptyPositions = GameModel.singleton.getEmptyPositions();

    for (const position of emptyPositions) {
      const tile = GameModel.singleton.generateTile(position);
      tileRenderPull.push([position, tile]);
    }

    await Promise.all(
      tileRenderPull.map(([position, type]) => {
        return this.view.setTile(position, type);
      }),
    );
  }
}
