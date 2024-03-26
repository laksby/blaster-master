import { PointData } from 'pixi.js';
import { BasePresenter } from '../../core';
import { GameModel, TileType } from '../../model';
import { IAppPresenter } from './IAppPresenter';
import { IAppView } from './IAppView';

export class AppPresenter extends BasePresenter<IAppView, GameModel> implements IAppPresenter {
  protected prepare(): void {
    this.model.events.on('whenTileGroupClear', (position, tile) => this.clearingTiles(position, tile));
    this.model.events.on('victory', level => this.view.showVictory(level));
    this.model.events.on('defeat', reason => this.view.showDefeat(reason));
  }

  public async continue(): Promise<void> {
    this.view.hideOverlay();

    if (this.model.level.isDefeat) {
      this.model.restartGame();
    } else {
      await this.model.startLevel(true);
    }
  }

  private async clearingTiles(position: PointData, tile: TileType): Promise<void> {
    switch (tile) {
      case TileType.SpecialBlast:
        await this.view.shockWave(position);
        break;
    }
  }
}
