import { IView } from '../../core';

export interface IShuffleView extends IView {
  updateShuffles(shuffles: number): void;
  soundShuffle(): Promise<void>;
  soundShuffleError(): Promise<void>;
}
