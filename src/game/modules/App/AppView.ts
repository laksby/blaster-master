import { BaseView } from '../../core';
import { GlobalOptions } from '../../types';
import { BoardView } from '../Board';
import { ShuffleView } from '../Shuffle';
import { StatsView } from '../Stats';
import { AppPresenter } from './AppPresenter';
import { IAppPresenter } from './IAppPresenter';
import { IAppView } from './IAppView';

export class AppView extends BaseView<IAppPresenter> implements IAppView {
  private readonly options: GlobalOptions;

  constructor(options: GlobalOptions) {
    super();
    this.options = options;
  }

  protected async load(): Promise<void> {
    this.usePresenter(AppPresenter);

    await this.useChild(new BoardView(this.options));
    await this.useChild(new ShuffleView(this.options));
    await this.useChild(new StatsView(this.options));
  }
}
