import { Assets, ColorMatrixFilter, Sprite, Text, Texture } from 'pixi.js';
import { BaseView } from '../../core';
import { GlobalOptions } from '../../types';
import { IShufflePresenter } from './IShufflePresenter';
import { IShuffleView } from './IShuffleView';
import { ShufflePresenter } from './ShufflePresenter';
import { attachHover } from '../../utils';

export class ShuffleView extends BaseView<IShufflePresenter> implements IShuffleView {
  public readonly options: GlobalOptions;

  private content?: Text;

  constructor(options: GlobalOptions) {
    super();
    this.options = options;
  }

  protected async load(): Promise<void> {
    this.usePresenter(ShufflePresenter);

    await this.loadButton();
  }

  public updateShuffles(shuffles: number): void {
    this.content!.text = shuffles > 0 ? `Shuffle - ${shuffles} remaining` : 'No more shuffles!';
  }

  private async loadButton(): Promise<void> {
    const texture: Texture = await Assets.load('button');

    const offset = 16;
    const height = 80;
    const width = (texture.width * height) / texture.height;

    const button = this.use(
      new Sprite({
        texture,
        eventMode: 'static',
        cursor: 'pointer',
        width,
        height,
        position: {
          x: (this.app.screen.width - width) / 2,
          y: this.app.screen.height - offset - height,
        },
        zIndex: 1,
      }),
      [
        new Text({
          label: 'content',
          anchor: { x: 0.5, y: 0.6 },
          zIndex: 2,
          position: { x: texture.width / 2, y: texture.height / 2 },
          style: {
            fontFamily: 'Super Squad',
            fontSize: 72,
            fill: 0xffffff,
            letterSpacing: 2,
          },
        }),
      ],
    );

    attachHover(button);
    button.on('pointerdown', () => this.presenter.shuffle());

    this.content = this.find<Text>('content');
  }
}
