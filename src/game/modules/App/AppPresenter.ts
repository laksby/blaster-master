import { PointData } from 'pixi.js';
import { BasePresenter } from '../../core';
import { GameModel, TileType } from '../../model';
import { IAppPresenter } from './IAppPresenter';
import { IAppView } from './IAppView';

export class AppPresenter extends BasePresenter<IAppView, GameModel> implements IAppPresenter {
  private _isStarted = false;

  protected prepare(): void {
    this.model.events.on('whenTileGroupClear', (position, tile) => this.clearingTiles(position, tile));
    this.model.events.on('victory', level => this.victory(level));
    this.model.events.on('defeat', reason => this.defeat(reason));
  }

  public async start(): Promise<void> {
    this.view.showStart();
  }

  public async continue(): Promise<void> {
    this.view.hideOverlay();

    if (!this._isStarted) {
      this._isStarted = true;
      this.view.soundIntro();
      await this.model.startLevel(false);
    } else if (this.model.level.isDefeat) {
      this.model.restartGame();
      this.view.soundIntro();
    } else {
      await this.model.startLevel(true);
    }
  }

  private victory(level: number): void {
    this.view.soundLevelUp();
    this.view.showVictory(level);
  }

  private defeat(reason: string): void {
    this.view.soundDefeat();
    this.view.showDefeat(reason);
  }

  private async clearingTiles(position: PointData, tile: TileType): Promise<void> {
    switch (tile) {
      case TileType.SpecialBlast:
        await this.view.shockWave(position);
        break;
    }
  }
}
