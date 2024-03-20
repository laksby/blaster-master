import { Assets, ColorMatrixFilter, Sprite, Texture } from 'pixi.js';
import { BaseView } from '../../core';
import { TileType } from '../../types';
import { BoardPresenter } from './BoardPresenter';
import { IBoardPresenter } from './IBoardPresenter';
import { IBoardView } from './IBoardView';

export class BoardView extends BaseView<IBoardPresenter> implements IBoardView {
  private readonly scale = 0.4;

  private backgroundWidth = 0;
  private backgroundHeight = 0;
  private tileWidth = 0;
  private tileHeight = 0;
  private paddingX = 0;
  private paddingY = 0;
  private tileShift = 0.89;
  private cols = 9;
  private rows = 10;
  private tiles = new Map<string, Sprite>();
  private tileTextures = new Map<TileType, Texture>();

  protected async load(): Promise<void> {
    this.useContainer();
    this.usePresenter(BoardPresenter);

    await this.loadBackground();
    await this.loadTileTextures();

    this.container.position.set(this.app.screen.width / 2 - this.backgroundWidth, 100);
    this.paddingX = (this.backgroundWidth - this.tileWidth * this.cols) / 2;
    this.paddingY = (this.backgroundHeight - this.tileHeight * this.tileShift * (this.rows - 1) - this.tileHeight) / 2;

    this.presenter.generate(this.cols, this.rows);
  }

  public setTile(x: number, y: number, type: TileType): void {
    const tile = this.tiles.get(this.getTileKey(x, y));
    const texture = this.tileTextures.get(type)!;

    if (tile) {
      tile.texture = texture;
    } else {
      this.tiles.set(this.getTileKey(x, y), this.createTile(x, y, texture));
    }
  }

  public clearTile(x: number, y: number): void {
    const tile = this.tiles.get(this.getTileKey(x, y));

    if (tile) {
      this.container.removeChild(tile);
      this.tiles.delete(this.getTileKey(x, y));
    }
  }

  private getTileKey(x: number, y: number): string {
    return `${x}.${y}`;
  }

  private async loadBackground(): Promise<void> {
    const texture: Texture = await Assets.load('board');

    this.backgroundWidth = texture.width * this.scale;
    this.backgroundHeight = texture.height * this.scale;

    this.use(
      new Sprite({
        texture,
        width: this.backgroundWidth,
        height: this.backgroundHeight,
        zIndex: 1,
      }),
    );
  }

  private async loadTileTextures(): Promise<void> {
    const tileTypes = Object.values(TileType);
    const tileTextures: Texture[] = await Promise.all(tileTypes.map(type => Assets.load(`tile-${type}`)));

    this.tileWidth = (tileTextures[0]?.width ?? 0) * this.scale;
    this.tileHeight = (tileTextures[0]?.height ?? 0) * this.scale;

    tileTypes.forEach((type, index) => {
      this.tileTextures.set(type, tileTextures[index]);
    });
  }

  private createTile(x: number, y: number, texture: Texture): Sprite {
    const hoverFilter = new ColorMatrixFilter();
    hoverFilter.brightness(1.2, true);

    const tile = this.use(
      new Sprite({
        texture,
        width: this.tileWidth,
        height: this.tileHeight,
        eventMode: 'static',
        cursor: 'pointer',
        position: {
          x: this.paddingX + x * this.tileWidth,
          y: this.paddingY + y * this.tileHeight * this.tileShift,
        },
        zIndex: 2 + this.rows - y,
      }),
    );

    tile.on('mouseover', () => {
      tile.filters = [hoverFilter];
    });

    tile.on('mouseleave', () => {
      tile.filters = [];
    });

    tile.on('click', () => {
      this.presenter.click(x, y);
    });

    return tile;
  }
}
