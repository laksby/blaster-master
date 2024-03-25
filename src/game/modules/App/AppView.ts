import { Assets, PointData, Texture } from 'pixi.js';
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

  private boardView?: BoardView;

  constructor(options: AppViewOptions) {
    super(AppPresenter);
    this._options = options;
  }

  protected async load(): Promise<void> {
    const textures = await Promise.all(this._options.allTileTypes.map(type => Assets.load(`tile-${type}`)));

    const tileTextures = new Map<TileType, Texture>(
      this._options.allTileTypes.map((type, index) => [type, textures[index]]),
    );

    this.boardView = await this.useChild(
      new BoardView({
        cols: this._options.cols,
        rows: this._options.rows,
        tileVerticalProportion: 0.89,
        tileTextures,
      }),
    );

    await this.useChild(
      new ShuffleView({
        topBound: this.boardView.background.position.y + this.boardView.background.height,
      }),
    );

    await this.useChild(
      new StatsView({
        bottomBound: this.boardView.background.position.y,
        leftBound: this.boardView.background.position.x,
        rightBound: this.boardView.background.position.x + this.boardView.background.width,
      }),
    );
  }

  public async shockWave(position: PointData): Promise<void> {
    const coordinates = this.boardView!.getTileCoordinates(position);

    this.animator.shockWave(this.container, 1000, {
      speed: 2000,
      amplitude: 30,
      wavelength: 160,
      brightness: 1,
      radius: -1,
      center: {
        x: coordinates.x - this.boardView!.background.width / 2,
        y: coordinates.y,
      },
    });
  }
}
