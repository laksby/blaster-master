import { Assets, ColorMatrixFilter, PointData, Sprite, Texture } from 'pixi.js';
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
  private tilePositions = new Map<Sprite, PointData>();
  private tileTextures = new Map<TileType, Texture>();
  private canInteract = true;

  protected async load(): Promise<void> {
    this.usePresenter(BoardPresenter);

    await this.loadBackground();
    await this.loadTileTextures();

    this.paddingX = (this.backgroundWidth - this.tileWidth * this.cols) / 2;
    this.paddingY = (this.backgroundHeight - this.tileHeight * this.tileShift * (this.rows - 1) - this.tileHeight) / 2;

    await this.presenter.generate(this.cols, this.rows);
  }

  public async setTile(position: PointData, type: TileType | undefined): Promise<void> {
    const tile = this.findTile(position);

    // Update tile
    if (tile && type) {
      tile.texture = this.tileTextures.get(type)!;
    }
    // Delete tile
    else if (tile && !type) {
      tile.destroy();
      this.tilePositions.delete(tile);
    }
    // Create tile
    else if (!tile && type) {
      this.canInteract = false;
      const newTile = this.createTile(position, this.tileTextures.get(type)!);
      await this.animateAppear(newTile, 100);

      this.tilePositions.set(newTile, position);
      this.canInteract = true;
    }
    // Error
    else {
      throw new Error('Cannot create tile without type');
    }
  }

  public async moveTile(from: PointData, to: PointData): Promise<void> {
    const tile = this.findTile(from);

    if (tile) {
      this.canInteract = false;
      const newCoordinates = this.getTileCoordinates(to);
      this.tilePositions.set(tile, to);

      await this.animateMove(tile, newCoordinates, 300);
      tile.zIndex = 2 + this.rows - to.y;
      this.canInteract = true;
    }
  }

  private async loadBackground(): Promise<void> {
    const texture: Texture = await Assets.load('board');

    this.backgroundWidth = texture.width * this.scale;
    this.backgroundHeight = texture.height * this.scale;

    this.container.position.set(this.app.screen.width / 2 - this.backgroundWidth, 100);

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
    const tileTextures: Texture[] = await Promise.all(
      tileTypes.map(type => {
        return Assets.load(`tile-${type}`);
      }),
    );

    this.tileWidth = (tileTextures[0]?.width ?? 0) * this.scale;
    this.tileHeight = (tileTextures[0]?.height ?? 0) * this.scale;

    tileTypes.forEach((type, index) => {
      this.tileTextures.set(type, tileTextures[index]);
    });
  }

  private findTile(position: PointData): Sprite | undefined {
    for (const [tile, tilePosition] of this.tilePositions) {
      if (tilePosition.x === position.x && tilePosition.y === position.y) {
        return tile;
      }
    }

    return undefined;
  }

  private getTileCoordinates(position: PointData): PointData {
    return {
      x: this.paddingX + position.x * this.tileWidth + this.tileWidth / 2,
      y: this.paddingY + position.y * this.tileHeight * this.tileShift + this.tileHeight / 2,
    };
  }

  private createTile(position: PointData, texture: Texture): Sprite {
    const coordinates = this.getTileCoordinates(position);
    const hoverFilter = new ColorMatrixFilter();
    hoverFilter.brightness(1.2, true);

    const tile = this.use(
      new Sprite({
        texture,
        anchor: 0.5,
        width: this.tileWidth,
        height: this.tileHeight,
        eventMode: 'static',
        cursor: 'pointer',
        position: coordinates,
        zIndex: 2 + this.rows - position.y,
      }),
    );

    tile.on('mouseover', () => {
      tile.filters = [hoverFilter];
    });

    tile.on('mouseleave', () => {
      tile.filters = [];
    });

    tile.on('pointerdown', () => {
      if (this.canInteract) {
        this.presenter.click(this.tilePositions.get(tile)!);
      }
    });

    return tile;
  }
}
