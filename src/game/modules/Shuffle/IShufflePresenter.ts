import { IPresenter } from '../../core';

export interface IShufflePresenter extends IPresenter {
  shuffle(): Promise<void>;
}
