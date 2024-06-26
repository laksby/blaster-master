import { AdjustmentFilter, ShockwaveFilter, ShockwaveFilterOptions } from 'pixi-filters';
import { Application, Container, PointData } from 'pixi.js';
import { attachFilter, removeFilter, scalarOscillate, vectorLerp } from '../utils';
import { AnimationHandle } from './AnimationHandle';

export class Animator {
  private readonly _app: Application;

  constructor(app: Application) {
    this._app = app;
  }

  public async shockWave(container: Container, duration: number, options?: ShockwaveFilterOptions): Promise<void> {
    const filter = attachFilter(container, new ShockwaveFilter(options));

    await this.generic(elapsed => {
      filter.time = elapsed / duration;
    }, duration);

    removeFilter(container, filter);
  }

  public glowStart(container: Container, speed: number, handle?: AnimationHandle): void {
    const filter = attachFilter(container, new AdjustmentFilter({ saturation: 0.5 }));

    handle?.onDestroy(() => removeFilter(container, filter));

    this.generic(
      elapsed => {
        const contrast = scalarOscillate(2, 3, (elapsed % speed) / speed);
        filter.brightness = contrast;
      },
      undefined,
      handle,
    );
  }

  public async appear(container: Container, duration: number): Promise<void> {
    const originalX = container.scale.x;
    const originalY = container.scale.y;
    container.scale.set(0, 0);

    await this.generic(elapsed => {
      const { x, y } = vectorLerp(container.scale, { x: originalX, y: originalY }, elapsed / duration);
      container.scale.set(x, y);
    }, duration);
    container.scale.set(originalX, originalY);
  }

  public async hide(container: Container, duration: number): Promise<void> {
    await this.generic(elapsed => {
      const { x, y } = vectorLerp(container.scale, { x: 0, y: 0 }, elapsed / duration);
      container.scale.set(x, y);
    }, duration);
    container.scale.set(0, 0);
  }

  public async move(container: Container, newPosition: PointData, duration: number): Promise<void> {
    await this.generic(elapsed => {
      const { x, y } = vectorLerp(container.position, newPosition, elapsed / duration);
      container.position.set(x, y);
    }, duration);
    container.position.set(newPosition.x, newPosition.y);
  }

  public async generic(
    action: (elapsed: number) => void,
    duration: number | undefined,
    handle?: AnimationHandle,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let elapsed = 0;

      const destroy = () => {
        this._app.ticker.remove(update);
        resolve();
      };

      const update = () => {
        elapsed += this._app.ticker.deltaMS;
        action(elapsed);

        if (duration !== undefined && elapsed > duration) {
          destroy();
        }
      };

      if (handle) {
        handle.onDestroy(destroy);
      }

      try {
        this._app.ticker.add(update);
      } catch (err) {
        reject(err);
      }
    });
  }
}
