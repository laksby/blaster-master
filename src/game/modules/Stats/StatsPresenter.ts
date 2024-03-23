import { BasePresenter } from '../../core';
import { GameModel } from '../../model';
import { IStatsPresenter } from './IStatsPresenter';
import { IStatsView } from './IStatsView';

export class StatsPresenter extends BasePresenter<IStatsView> implements IStatsPresenter {
  protected prepare(): void {
    GameModel.singleton.onScoreUpdate(async score => {
      this.view.updateScore(score, GameModel.singleton.maxScore);
    });

    GameModel.singleton.onTurnUpdate(async turn => {
      this.view.updateTurn(turn, GameModel.singleton.maxTurn);
    });

    this.view.updateScore(GameModel.singleton.score, GameModel.singleton.maxScore);
    this.view.updateTurn(GameModel.singleton.turn, GameModel.singleton.maxTurn);
  }
}
