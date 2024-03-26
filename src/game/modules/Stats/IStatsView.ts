import { IView } from '../../core';

export interface IStatsView extends IView {
  updateScore(score: number, maxScore: number): void;
  updateTurn(turn: number, maxTurn: number): void;
  updateLevel(level: number): void;
}
