import { BasePresenter } from '../../core';
import { GameModel } from '../../model';
import { IAppPresenter } from './IAppPresenter';
import { IAppView } from './IAppView';

export class AppPresenter extends BasePresenter<IAppView> implements IAppPresenter {
  protected prepare(): void {
    GameModel.singleton.onVictory(() => {
      console.log('Victory');
    });

    GameModel.singleton.onDefeat(reason => {
      console.log(`Defeat. Reason: ${reason}`);
    });
  }
}
