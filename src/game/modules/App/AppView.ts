import { Assets, Texture } from 'pixi.js';
import { BaseView } from '../../core';
import { TileType } from '../../model';
import { BoardView } from '../Board';
import { ShuffleView } from '../Shuffle';
import { StatsView } from '../Stats';
import { AppPresenter } from './AppPresenter';
import { IAppPresenter } from './IAppPresenter';
import { IAppView } from './IAppView';

export interface AppViewOptions {
  cols: number;
  rows: number;
  allTileTypes: TileType[];
}

export class AppView extends BaseView<IAppPresenter> implements IAppView {
  protected readonly _options: AppViewOptions;

  constructor(options: AppViewOptions) {
    super();
    this._options = options;
  }

  protected async load(): Promise<void> {
    this.usePresenter(AppPresenter);

    const textures = await Promise.all(this._options.allTileTypes.map(type => Assets.load(`tile-${type}`)));

    const tileTextures = new Map<TileType, Texture>(
      this._options.allTileTypes.map((type, index) => [type, textures[index]]),
    );

    const boardView = await this.useChild(
      new BoardView({
        cols: this._options.cols,
        rows: this._options.rows,
        tileVerticalProportion: 0.89,
        tileTextures,
      }),
    );

    await this.useChild(new ShuffleView());

    await this.useChild(
      new StatsView({
        leftBound: boardView.background.position.x,
        rightBound: boardView.background.position.x + boardView.background.width,
      }),
    );
  }
}
