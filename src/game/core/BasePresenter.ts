import { IPresenter } from './IPresenter';
import { IView } from './IView';

export abstract class BasePresenter<V extends IView> implements IPresenter {
  private readonly _view: V;

  constructor(view: V) {
    this._view = view;
  }

  public async initializePresenter(): Promise<void> {
    await this.prepare();
  }

  protected prepare(): void | Promise<void> {
    // Virtual
  }

  protected get view(): V {
    return this._view;
  }
}
