import { IPresenter } from './IPresenter';
import { IView } from './IView';

export abstract class BasePresenter<T extends IView> implements IPresenter {
  private readonly _view: T;

  constructor(view: T) {
    this._view = view;
  }

  public initializePresenter(): void {
    this.prepare();
  }

  protected prepare(): void {
    // Virtual
  }

  protected get view(): T {
    return this._view;
  }
}
