import { IView } from '../../core';

export interface IAppView extends IView {
  setText(text: string): void;
}
