import { BasePresenter } from '../../core';
import { GameModel } from '../../model';
import { IAppPresenter } from './IAppPresenter';
import { IAppView } from './IAppView';

export class AppPresenter extends BasePresenter<IAppView, GameModel> implements IAppPresenter {
  protected prepare(): void {
    this.model.events.on('victory', () => {
      console.log('Victory');
    });

    this.model.events.on('defeat', reason => {
      console.log(`Defeat. Reason: ${reason}`);
    });
  }
}
