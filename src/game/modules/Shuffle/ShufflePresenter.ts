import { BasePresenter } from '../../core';
import { GameModel } from '../../model';
import { IShufflePresenter } from './IShufflePresenter';
import { IShuffleView } from './IShuffleView';

export class ShufflePresenter extends BasePresenter<IShuffleView, GameModel> implements IShufflePresenter {
  protected prepare(): void {
    this.model.events.on('startLevel', () => this.refreshView());
    this.model.events.on('shuffle', () => this.refreshView());
  }

  protected refresh(): void {
    this.view.updateShuffles(this.model.level.shuffles);
  }

  public async shuffle(): Promise<void> {
    if (this.model.level.shuffles > 0) {
      this.view.soundShuffle();
    } else {
      this.view.soundShuffleError();
    }

    await this.model.shuffle();
  }
}
