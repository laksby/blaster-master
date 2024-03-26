import { Assets, Sprite, Text, Texture } from 'pixi.js';
import { BaseView } from '../../core';
import { getProportionalSize, getWidthFitSize } from '../../utils';
import { IStatsPresenter } from './IStatsPresenter';
import { IStatsView } from './IStatsView';
import { StatsPresenter } from './StatsPresenter';

export interface StatsViewOptions {
  bottomBound: number;
  leftBound: number;
  rightBound: number;
}

export class StatsView extends BaseView<IStatsPresenter> implements IStatsView {
  protected readonly _options: StatsViewOptions;

  constructor(options: StatsViewOptions) {
    super(StatsPresenter);
    this._options = options;
  }

  public get scoreContainer(): Sprite {
    return this.ensureChild<Sprite>('scoreContainer');
  }

  public get turnContainer(): Sprite {
    return this.ensureChild<Sprite>('turnContainer');
  }

  public get score(): Text {
    return this.ensureChild<Text>('score');
  }

  public get turn(): Text {
    return this.ensureChild<Text>('turn');
  }

  public get level(): Text {
    return this.ensureChild<Text>('level');
  }

  protected async load(): Promise<void> {
    await this.loadScore();
    await this.loadTurn();
    await this.loadLevel();
  }

  public updateScore(score: number, maxScore: number): void {
    this.score.text = `${score} / ${maxScore}`;
  }

  public updateTurn(turn: number, maxTurn: number): void {
    this.turn.text = `${turn} / ${maxTurn}`;
  }

  public updateLevel(level: number): void {
    this.level.text = `Level ${level}`;
  }

  private async loadScore(): Promise<void> {
    const texture: Texture = await Assets.load('score');

    const minimalHeight = 60;

    const { width, height } = getWidthFitSize(
      this.app.screen.width / 3,
      getProportionalSize(texture, { height: minimalHeight }),
    );

    this.use(
      new Sprite({
        label: 'scoreContainer',
        texture,
        width,
        height,
        position: {
          x: this._options.rightBound - width,
          y:
            this._options.bottomBound < minimalHeight
              ? this._options.bottomBound - height / 2
              : this._options.bottomBound - height,
        },
        zIndex: 1,
      }),
      [
        new Text({
          text: 'Score',
          anchor: { x: 0.5, y: 0 },
          zIndex: 2,
          position: { x: texture.width / 2, y: 16 },
          style: {
            fontFamily: 'Super Squad',
            fontSize: 30,
            fill: 0xffffff,
            letterSpacing: 2,
          },
        }),
        new Text({
          label: 'score',
          anchor: { x: 0.5, y: 0.5 },
          zIndex: 2,
          position: { x: texture.width / 2, y: texture.height / 2 + 20 },
          style: {
            fontFamily: 'Super Squad',
            fontSize: 52,
            fill: 0xffffff,
            letterSpacing: 2,
          },
        }),
      ],
    );
  }

  private async loadTurn(): Promise<void> {
    const texture: Texture = await Assets.load('turn');

    const minimalHeight = 60;

    const { width, height } = getProportionalSize(texture, { height: this.scoreContainer.height });

    this.use(
      new Sprite({
        label: 'turnContainer',
        texture,
        width,
        height,
        position: {
          x: this._options.leftBound,
          y:
            this._options.bottomBound < minimalHeight
              ? this._options.bottomBound - height / 2
              : this._options.bottomBound - height,
        },
        zIndex: 1,
      }),
      [
        new Text({
          text: 'Turn',
          anchor: { x: 0.5, y: 0 },
          zIndex: 2,
          position: { x: texture.width / 2, y: 16 },
          style: {
            fontFamily: 'Super Squad',
            fontSize: 30,
            fill: 0xffffff,
            letterSpacing: 2,
          },
        }),
        new Text({
          label: 'turn',
          anchor: { x: 0.5, y: 0.5 },
          zIndex: 2,
          position: { x: texture.width / 2, y: texture.height / 2 + 20 },
          style: {
            fontFamily: 'Super Squad',
            fontSize: 52,
            fill: 0xffffff,
            letterSpacing: 2,
          },
        }),
      ],
    );
  }

  private async loadLevel(): Promise<void> {
    this.use(
      new Text({
        label: 'level',
        anchor: { x: 0.5, y: 1 },
        zIndex: 2,
        position: {
          x: this.app.screen.width / 2,
          y: this._options.bottomBound,
        },
        style: {
          fontFamily: 'Super Squad',
          fontSize: 20,
          fill: 0x20366f,
          letterSpacing: 2,
        },
      }),
    );
  }
}
