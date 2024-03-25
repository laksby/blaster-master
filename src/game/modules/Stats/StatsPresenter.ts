import { BasePresenter } from '../../core';
import { GameModel } from '../../model';
import { IStatsPresenter } from './IStatsPresenter';
import { IStatsView } from './IStatsView';

export class StatsPresenter extends BasePresenter<IStatsView, GameModel> implements IStatsPresenter {
  protected prepare(): void {
    this.model.events.on('scoreUpdate', async score => {
      this.view.updateScore(score, this.model.level.maxScore);
    });

    this.model.events.on('turnUpdate', async turn => {
      this.view.updateTurn(turn, this.model.level.maxTurn);
    });

    this.view.updateScore(this.model.level.score, this.model.level.maxScore);
    this.view.updateTurn(this.model.level.turn, this.model.level.maxTurn);
  }
}
