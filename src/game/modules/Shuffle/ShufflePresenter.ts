import { BasePresenter } from '../../core';
import { GameModel } from '../../model';
import { IShufflePresenter } from './IShufflePresenter';
import { IShuffleView } from './IShuffleView';

export class ShufflePresenter extends BasePresenter<IShuffleView, GameModel> implements IShufflePresenter {
  protected prepare(): void {
    this.view.updateShuffles(this.model.level.shuffles);
  }

  public async shuffle(): Promise<void> {
    await this.model.shuffle();
    this.view.updateShuffles(this.model.level.shuffles);
  }
}
