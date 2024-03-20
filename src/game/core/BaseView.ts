import { Application, Container } from 'pixi.js';
import { IPresenter } from './IPresenter';
import { IView } from './IView';

export abstract class BaseView<P extends IPresenter> implements IView {
  private _app?: Application;
  private _container?: Container;
  private _presenter?: P;

  public async initializeView(app: Application, parent: Container): Promise<void> {
    this._app = app;

    await this.load();
    await this.presenter.initializePresenter();
    parent.addChild(this.container);
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

  protected useContainer(container = new Container()): Container {
    this._container = container;
    return this._container;
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

  private throwNotInitialized(target: string): never {
    throw new Error(`${target} not initialized inside view`);
  }
}
