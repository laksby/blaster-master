import { IPresenter } from '../../core';

export interface IAppPresenter extends IPresenter {
  continue(): Promise<void>;
}
