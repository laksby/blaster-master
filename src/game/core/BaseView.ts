import { Application, Container, PointData } from 'pixi.js';
import { vectorLerp } from '../utils';
import { IPresenter } from './IPresenter';
import { IView } from './IView';

export abstract class BaseView<P extends IPresenter> implements IView {
  private _app?: Application;
  private _container?: Container;
  private _presenter?: P;

  public async initializeView(app: Application, parent: Container): Promise<void> {
    this._app = app;
    this._container = this.createContainer();

    parent.addChild(this.container);

    await this.load();
    await this.presenter.initializePresenter();
  }

  public get container(): Container {
    return this._container || this.throwNotInitialized('Container');
  }

  protected get app(): Application {
    return this._app || this.throwNotInitialized('Application');
  }

  protected get presenter(): P {
    return this._presenter || this.throwNotInitialized('Presenter');
  }

  protected load(): void | Promise<void> {
    // Virtual
  }

  protected createContainer(): Container {
    // Virtual
    return new Container();
  }

  protected usePresenter(presenterType: Function): P {
    this._presenter = Reflect.construct(presenterType, [this]) as P;
    return this._presenter;
  }

  protected use<C extends Container>(container: C): C {
    this.container.addChild(container);
    return container;
  }

  protected async useChild<V extends IView>(view: V): Promise<V> {
    await view.initializeView(this.app, this.container);
    return view;
  }

  protected async animateAppear(container: Container, duration: number): Promise<void> {
    const originalX = container.scale.x;
    const originalY = container.scale.y;
    container.scale.set(0, 0);

    await this.animate(elapsed => {
      const { x, y } = vectorLerp(container.scale, { x: originalX, y: originalY }, elapsed / duration);
      container.scale.set(x, y);
    }, duration);
    container.scale.set(originalX, originalY);
  }

  protected async animateMove(container: Container, newPosition: PointData, duration: number): Promise<void> {
    await this.animate(elapsed => {
      const { x, y } = vectorLerp(container.position, newPosition, elapsed / duration);
      container.position.set(x, y);
    }, duration);
    container.position.set(newPosition.x, newPosition.y);
  }

  protected async animate(action: (elapsed: number) => void, duration: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let elapsed = 0;

      const update = () => {
        elapsed += this.app.ticker.deltaMS;
        action(elapsed);

        if (elapsed > duration) {
          this.app.ticker.remove(update);
          resolve();
        }
      };

      try {
        this.app.ticker.add(update);
      } catch (err) {
        reject(err);
      }
    });
  }

  private throwNotInitialized(target: string): never {
    throw new Error(`${target} not initialized inside view`);
  }
}
