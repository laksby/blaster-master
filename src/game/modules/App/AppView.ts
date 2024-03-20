import { BaseView } from '../../core';
import { BoardView } from '../Board';
import { AppPresenter } from './AppPresenter';
import { IAppPresenter } from './IAppPresenter';
import { IAppView } from './IAppView';

export class AppView extends BaseView<IAppPresenter> implements IAppView {
  protected async load(): Promise<void> {
    this.useContainer();
    this.usePresenter(AppPresenter);

    await this.useChild(new BoardView());
  }
}
