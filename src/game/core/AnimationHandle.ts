import { Action } from '../utils';

export class AnimationHandle {
  private _onDestroy = new Set<Action>();

  public destroyAll(): void {
    this._onDestroy.forEach(event => event());
  }

  public clear(): void {
    this._onDestroy.clear();
  }

  public onDestroy(action: Action) {
    this._onDestroy.add(action);
  }
}
