import { Assets, Sprite, Text, Texture } from 'pixi.js';
import { BaseView } from '../../core';
import { attachHover, getProportionalSize } from '../../utils';
import { IShufflePresenter } from './IShufflePresenter';
import { IShuffleView } from './IShuffleView';
import { ShufflePresenter } from './ShufflePresenter';

export class ShuffleView extends BaseView<IShufflePresenter> implements IShuffleView {
  private _content?: Text;

  protected async load(): Promise<void> {
    this.usePresenter(ShufflePresenter);

    await this.loadButton();
  }

  public updateShuffles(shuffles: number): void {
    this._content!.text = shuffles > 0 ? `Shuffle - ${shuffles} remaining` : 'No more shuffles!';
  }

  private async loadButton(): Promise<void> {
    const texture: Texture = await Assets.load('button');

    const offset = 16;
    const { width, height } = getProportionalSize(texture, { height: 80 });

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

    this._content = this.find<Text>('content');
  }
}
