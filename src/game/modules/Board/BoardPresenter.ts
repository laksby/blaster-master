import { PointData } from 'pixi.js';
import { BasePresenter } from '../../core';
import { GameModel, TileType } from '../../model';
import { IBoardPresenter } from './IBoardPresenter';
import { IBoardView } from './IBoardView';

export class BoardPresenter extends BasePresenter<IBoardView, GameModel> implements IBoardPresenter {
  private _isEnabledInteraction = true;

  protected prepare(): void {
    this.model.events.on('startLevel', () => this.generate());
    this.model.events.on('shuffle', shifts => this.switchTiles(shifts));
  }

  protected async refresh(): Promise<void> {
    for (let y = 0; y < this.model.board.rows; y++) {
      const row = this.model.board.getRow(y);

      await Promise.all(
        row.map((type, x) => {
          return this.view.setTile({ x, y }, type);
        }),
      );
    }
  }

  public async click(position: PointData): Promise<void> {
    if (!this._isEnabledInteraction) {
      return;
    }

    this._isEnabledInteraction = false;

    const tile = this.model.board.getTile(position);

    if (!tile) {
      return;
    }

    switch (tile) {
      case TileType.SpecialBlast:
        await this.handleBlastTile(position);
        break;
      default:
        await this.handleStandardTile(position, tile);
        break;
    }

    this._isEnabledInteraction = true;
  }

  private async generate(): Promise<void> {
    this._isEnabledInteraction = false;

    this.model.populateBoard();
    await this.refreshView();

    this._isEnabledInteraction = true;
  }

  private async handleBlastTile(position: PointData): Promise<void> {
    const group: PointData[] = [];
    this.model.searchBlastCandidates(position, group);

    await this.handleClearGroup(position, TileType.SpecialBlast, group);
  }

  private async handleStandardTile(position: PointData, tile: TileType): Promise<void> {
    const group: PointData[] = [];
    this.model.searchClearCandidates(position, tile, group);

    if (group.length >= this.model.board.clearThreshold) {
      const isBlast = group.length >= this.model.board.blastThreshold;
      const groupAdjusted = isBlast ? group.filter(item => !(item.x === position.x && item.y === position.y)) : group;

      this.model.board.setTile(position, TileType.SpecialBlast);
      this.view.setBlastTile(position);

      await this.handleClearGroup(position, tile, groupAdjusted);
    }
  }

  private async handleClearGroup(position: PointData, tile: TileType, group: PointData[]): Promise<void> {
    await this.model.clearTiles(position, tile, group);
    await this.model.updateScore(tile, group);

    await Promise.all(this.model.getEmptyPositions().map(position => this.view.setTile(position, undefined)));

    const shifts = this.model.applyGravity();

    await Promise.all(shifts.map(([from, to]) => this.view.moveTile(from, to)));
    await this.fillEmptyTiles();

    await this.model.updateTurn();
  }

  private async switchTiles(shifts: [PointData, PointData][]): Promise<void> {
    await Promise.all(shifts.map(([from, to]) => this.view.switchTiles(from, to)));
  }

  private async fillEmptyTiles(): Promise<void> {
    const tileRenderPull: [PointData, TileType][] = [];
    const emptyPositions = this.model.getEmptyPositions();

    for (const position of emptyPositions) {
      const tile = this.model.populateBoardTile(position);
      tileRenderPull.push([position, tile]);
    }

    await Promise.all(tileRenderPull.map(([position, type]) => this.view.setTile(position, type)));
  }
}
