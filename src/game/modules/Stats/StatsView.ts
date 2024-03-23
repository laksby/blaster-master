import { Assets, Sprite, Text, Texture } from 'pixi.js';
import { BaseView } from '../../core';
import { GlobalOptions } from '../../types';
import { IStatsPresenter } from './IStatsPresenter';
import { IStatsView } from './IStatsView';
import { StatsPresenter } from './StatsPresenter';

export class StatsView extends BaseView<IStatsPresenter> implements IStatsView {
  public readonly options: GlobalOptions;

  private score?: Text;
  private turn?: Text;

  constructor(options: GlobalOptions) {
    super();
    this.options = options;
  }

  protected async load(): Promise<void> {
    this.usePresenter(StatsPresenter);

    await this.loadScore();
    await this.loadTurn();
  }

  public updateScore(score: number, maxScore: number): void {
    this.score!.text = `${score} / ${maxScore}`;
  }

  public updateTurn(turn: number, maxTurn: number): void {
    this.turn!.text = `${turn} / ${maxTurn}`;
  }

  private async loadScore(): Promise<void> {
    const texture: Texture = await Assets.load('score');

    const offset = 16;
    const height = 60;
    const width = (texture.width * height) / texture.height;

    this.use(
      new Sprite({
        texture,
        height,
        width,
        position: {
          x: this.options.containerRightBound - width,
          y: offset,
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

    this.score = this.find<Text>('score');
  }

  private async loadTurn(): Promise<void> {
    const texture: Texture = await Assets.load('turn');

    const offset = 16;
    const height = 60;
    const width = (texture.width * height) / texture.height;

    this.use(
      new Sprite({
        texture,
        height,
        width,
        position: {
          x: this.options.containerLeftBound,
          y: offset,
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

    this.turn = this.find<Text>('turn');
  }
}
