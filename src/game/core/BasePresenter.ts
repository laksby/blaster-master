import { IPresenter } from './IPresenter';
import { IView } from './IView';

export abstract class BasePresenter<V extends IView, M> implements IPresenter {
  private readonly _view: V;
  private readonly _model: M;

  constructor(view: V, model: M) {
    this._view = view;
    this._model = model;
  }

  public async initializePresenter(): Promise<void> {
    await this.prepare();
    await this.refresh();
  }

  public async refreshView(): Promise<void> {
    await this.refresh();
  }

  protected prepare(): void | Promise<void> {
    // Virtual
  }

  protected refresh(): void | Promise<void> {
    // Virtual
  }

  protected get view(): V {
    return this._view;
  }

  protected get model(): M {
    return this._model;
  }
}
