import { BasePresenter } from '../../core';
import { GameModel } from '../../model';
import { IShufflePresenter } from './IShufflePresenter';
import { IShuffleView } from './IShuffleView';

export class ShufflePresenter extends BasePresenter<IShuffleView> implements IShufflePresenter {
  protected prepare(): void {
    this.view.updateShuffles(GameModel.singleton.shuffles);
  }

  public async shuffle(): Promise<void> {
    GameModel.singleton.shuffle();
    this.view.updateShuffles(GameModel.singleton.shuffles);
  }
}
