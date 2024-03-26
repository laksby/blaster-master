import { IPresenter } from '../../core';

export interface IAppPresenter extends IPresenter {
  startNextLevel(): Promise<void>;
}
