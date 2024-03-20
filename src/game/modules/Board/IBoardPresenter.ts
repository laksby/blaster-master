import { IPresenter } from '../../core';

export interface IBoardPresenter extends IPresenter {
  generate(cols: number, rows: number): void;
  click(x: number, y: number): void;
}
