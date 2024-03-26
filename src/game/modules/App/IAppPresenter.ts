import { IPresenter } from '../../core';

export interface IAppPresenter extends IPresenter {
  start(): Promise<void>;
  continue(): Promise<void>;
}
