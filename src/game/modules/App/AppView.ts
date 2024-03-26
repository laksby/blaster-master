import { Assets, Color, Container, Graphics, PointData, Text, Texture } from 'pixi.js';
import { BaseView } from '../../core';
import { TileType } from '../../model';
import { BoardView } from '../Board';
import { ShuffleView } from '../Shuffle';
import { StatsView } from '../Stats';
import { AppPresenter } from './AppPresenter';
import { IAppPresenter } from './IAppPresenter';
import { IAppView } from './IAppView';
import { sound } from '@pixi/sound';

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

  public get overlay(): Container {
    return this.ensureChild<Container>('overlay');
  }

  public get icon(): Text {
    return this.ensureChild<Text>('icon');
  }

  public get primaryText(): Text {
    return this.ensureChild<Text>('primary-text');
  }

  public get secondaryText(): Text {
    return this.ensureChild<Text>('secondary-text');
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

    await this.loadOverlay();
    await this.presenter.start();
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
        x: coordinates.x - this.boardView!.background.position.x,
        y: coordinates.y - this.boardView!.background.position.y,
      },
    });
  }

  public hideOverlay(): void {
    this.overlay.visible = false;
  }

  public showStart(): void {
    this.icon.text = '💥';
    this.primaryText.text = 'Blaster Master';
    this.secondaryText.text = 'Welcome to Blaster Master game';
    this.overlay.visible = true;
  }

  public showVictory(level: number): void {
    this.icon.text = '🎉';
    this.primaryText.text = 'Victory!';
    this.secondaryText.text = `You reached level ${level + 1}`;
    this.overlay.visible = true;
  }

  public showDefeat(reason: string): void {
    this.icon.text = '⛔';
    this.primaryText.text = 'Defeat!';
    this.secondaryText.text = reason;
    this.overlay.visible = true;
  }

  public async soundIntro(): Promise<void> {
    await sound.play('intro', { volume: 0.5 });
  }

  public async soundLevelUp(): Promise<void> {
    await sound.play('level-up');
  }

  public async soundDefeat(): Promise<void> {
    await sound.play('defeat');
  }

  private async loadOverlay(): Promise<void> {
    const overlayColor = new Color(0x20366f);
    overlayColor.setAlpha(0.8);

    const overlay = this.use(
      new Container({
        label: 'overlay',
        eventMode: 'static',
        cursor: 'pointer',
        zIndex: 100,
        visible: false,
      }),
      [
        new Graphics().rect(0, 0, this.app.screen.width, this.app.screen.height).fill(overlayColor),
        new Text({
          label: 'icon',
          anchor: { x: 0.5, y: 1 },
          position: {
            x: this.app.screen.width / 2,
            y: this.app.screen.height / 2 - 140,
          },
          style: {
            fontFamily: 'Super Squad',
            fontSize: 100,
            fill: 0xffffff,
            letterSpacing: 2,
          },
        }),
        new Text({
          label: 'primary-text',
          anchor: { x: 0.5, y: 1 },
          position: {
            x: this.app.screen.width / 2,
            y: this.app.screen.height / 2,
          },
          style: {
            fontFamily: 'Super Squad',
            fontSize: 72,
            fill: 0xffffff,
            letterSpacing: 2,
          },
        }),
        new Text({
          label: 'secondary-text',
          anchor: { x: 0.5, y: 0.2 },
          position: {
            x: this.app.screen.width / 2,
            y: this.app.screen.height / 2,
          },
          style: {
            fontFamily: 'Super Squad',
            fontSize: 32,
            fill: 0xffffff,
            letterSpacing: 2,
          },
        }),
        new Text({
          text: 'Click anywhere to continue...',
          anchor: { x: 0.5, y: 0 },
          position: {
            x: this.app.screen.width / 2,
            y: this.app.screen.height / 2 + 60,
          },
          style: {
            fontFamily: 'Super Squad',
            fontSize: 24,
            fill: 0xffffff,
            letterSpacing: 2,
            wordWrap: true,
            wordWrapWidth: this.app.screen.width - 20,
          },
        }),
      ],
    );

    overlay.on('pointerdown', () => this.presenter.continue());
  }
}
