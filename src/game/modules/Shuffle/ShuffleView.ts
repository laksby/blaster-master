import { Assets, ColorMatrixFilter, Sprite, Text, Texture } from 'pixi.js';
import { BaseView } from '../../core';
import { GlobalOptions } from '../../types';
import { IShufflePresenter } from './IShufflePresenter';
import { IShuffleView } from './IShuffleView';
import { ShufflePresenter } from './ShufflePresenter';

export class ShuffleView extends BaseView<IShufflePresenter> implements IShuffleView {
  private readonly options: GlobalOptions;

  private buttonWidth = 0;
  private buttonHeight = 0;
  private content?: Text;

  constructor(options: GlobalOptions) {
    super();
    this.options = options;
  }

  protected async load(): Promise<void> {
    this.usePresenter(ShufflePresenter);

    await this.loadButton();
    this.loadContent();
  }

  public updateShuffles(shuffles: number): void {
    this.content!.text = shuffles > 0 ? `Shuffle - ${shuffles} remaining` : 'No more shuffles!';
  }

  private async loadButton(): Promise<void> {
    const hoverFilter = new ColorMatrixFilter();
    hoverFilter.brightness(1.2, true);

    const texture: Texture = await Assets.load('button');

    this.buttonWidth = texture.width * this.options.uiScale;
    this.buttonHeight = texture.height * this.options.uiScale;

    this.container.position.set(
      this.app.screen.width / 2 - this.buttonWidth / 2,
      this.app.screen.height - this.buttonHeight,
    );

    const button = this.use(
      new Sprite({
        texture,
        eventMode: 'static',
        cursor: 'pointer',
        width: this.buttonWidth,
        height: this.buttonHeight,
        zIndex: 1,
      }),
    );

    button.on('mouseover', () => {
      button.filters = [hoverFilter];
    });

    button.on('mouseleave', () => {
      button.filters = [];
    });

    button.on('pointerdown', () => {
      this.presenter.shuffle();
    });
  }

  private loadContent(): void {
    this.content = this.use(
      new Text({
        anchor: {
          x: 0.5,
          y: 0.6,
        },
        zIndex: 2,
        position: {
          x: this.buttonWidth / 2,
          y: this.buttonHeight / 2,
        },
        style: {
          fontFamily: 'Super Squad',
          fontSize: 32,
          fill: 0xffffff,
          letterSpacing: 2,
        },
      }),
    );
  }
}
