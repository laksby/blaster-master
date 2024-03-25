import { PointData } from 'pixi.js';
import { BasePresenter } from '../../core';
import { GameModel } from '../../model';
import { TileType } from '../../types';
import { IBoardPresenter } from './IBoardPresenter';
import { IBoardView } from './IBoardView';

export class BoardPresenter extends BasePresenter<IBoardView, GameModel> implements IBoardPresenter {
  protected prepare(): void {
    this.model.events.on('shuffle', async shifts => {
      await this.switchTiles(shifts);
    });
  }

  public async generate(): Promise<void> {
    this.model.populateBoard();
    await this.updateTiles();
  }

  public async click(position: PointData): Promise<void> {
    const type = this.model.board.getTile(position);

    if (!type) {
      return;
    }

    const group: PointData[] = [];
    this.model.searchClearCandidates(position, type, group);

    if (group.length >= this.model.board.clearThreshold) {
      await this.clearTiles(group);
      await this.model.updateScore(group);

      const shifts = this.model.applyGravity();
      await this.shiftTiles(shifts);
      await this.fillEmptyTiles();

      await this.model.updateTurn();
    }
  }

  private async updateTiles(): Promise<void> {
    for (let y = 0; y < this.model.board.rows; y++) {
      await Promise.all(
        this.model.board.getRow(y).map((type, x) => {
          return this.view.setTile({ x, y }, type);
        }),
      );
    }
  }

  private async clearTiles(group: PointData[]): Promise<void> {
    for (const item of group) {
      this.model.board.setTile(item, undefined);
    }

    const emptyPositions = this.model.getEmptyPositions();

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
    const emptyPositions = this.model.getEmptyPositions();

    for (const position of emptyPositions) {
      const tile = this.model.populateBoardTile(position);
      tileRenderPull.push([position, tile]);
    }

    await Promise.all(
      tileRenderPull.map(([position, type]) => {
        return this.view.setTile(position, type);
      }),
    );
  }
}
