import { Container } from 'pixi.js';
import { IPresenter } from './IPresenter';
import { IView } from './IView';

export abstract class BaseView<T extends IPresenter> implements IView {
  private readonly _container: Container;
  private readonly _presenter: T;

  protected constructor(presenterType: Function, container = new Container()) {
    this._container = container;
    this._presenter = Reflect.construct(presenterType, [this]);
  }

  public initializeView(): void {
    this.presenter.initializePresenter();
  }

  public get container(): Container {
    return this._container;
  }

  protected get presenter(): T {
    return this._presenter;
  }

  protected use<T extends Container>(container: T): T {
    this.container.addChild(container);
    return container;
  }
}
