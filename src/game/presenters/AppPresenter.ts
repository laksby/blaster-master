import { BasePresenter } from '../core';
import { IAppPresenter } from '../interfaces/presenters';
import { IAppView } from '../interfaces/views';

export class AppPresenter extends BasePresenter<IAppView> implements IAppPresenter {
  private value = 0;

  protected prepare(): void {
    this.view.setText(`Value ${this.value}`);
  }

  public increment(): void {
    this.value++;
    this.view.setText(`Value ${this.value}`);
  }
}
