import { PointData } from 'pixi.js';
import { BasePresenter } from '../../core';
import { GameModel, TileType } from '../../model';
import { IAppPresenter } from './IAppPresenter';
import { IAppView } from './IAppView';

export class AppPresenter extends BasePresenter<IAppView, GameModel> implements IAppPresenter {
  protected prepare(): void {
    this.model.events.on('whenTileGroupClear', (position, tile) => this.clearingTiles(position, tile));

    this.model.events.on('victory', () => {
      console.log('Victory');
    });

    this.model.events.on('defeat', reason => {
      console.log(`Defeat. Reason: ${reason}`);
    });
  }

  private async clearingTiles(position: PointData, tile: TileType): Promise<void> {
    switch (tile) {
      case TileType.SpecialBlast:
        this.view.shockWave(position);
        break;
    }
  }
}
