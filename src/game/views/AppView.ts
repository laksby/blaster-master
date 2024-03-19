import { Text } from 'pixi.js';
import { BaseView } from '../core';
import { IAppPresenter } from '../interfaces/presenters';
import { IAppView } from '../interfaces/views';
import { AppPresenter } from '../presenters/AppPresenter';

export class AppView extends BaseView<IAppPresenter> implements IAppView {
  private readonly message: Text;

  constructor() {
    super(AppPresenter);

    this.message = this.use(
      new Text({
        x: 100,
        y: 100,
        eventMode: 'static',
        cursor: 'pointer',
        style: {
          fontFamily: 'Super Squad',
          fontSize: 24,
          fill: 0xffffff,
          align: 'center',
          letterSpacing: 2,
        },
      }),
    );

    this.message.on('pointerdown', () => this.presenter.increment());
  }

  public setText(text: string): void {
    this.message.text = text;
  }
}
