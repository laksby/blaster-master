import { PointData } from 'pixi.js';
import { TileType } from './TileType';

export interface Events {
  startLevel(this: GameEvents, level: number): void | Promise<void>;
  victory(this: GameEvents, level: number): void | Promise<void>;
  defeat(this: GameEvents, reason: string): void | Promise<void>;
  whenTileGroupClear(this: GameEvents, position: PointData, tile: TileType): void | Promise<void>;
  shuffle(this: GameEvents, shifts: [PointData, PointData][]): void | Promise<void>;
  scoreUpdate(this: GameEvents, score: number): void | Promise<void>;
  turnUpdate(this: GameEvents, turn: number): void | Promise<void>;
}

export type EventPool = {
  [E in keyof Events]: Set<Events[E]>;
};

export class GameEvents {
  private readonly _eventPool: Partial<EventPool> = {};

  public on<E extends keyof Events>(event: E, handler: Events[E]): void {
    if (!(event in this._eventPool)) {
      (this._eventPool as Record<string, unknown>)[event] = new Set<Events[E]>();
    }

    this._eventPool[event]!.add(handler);
  }

  public async emit<E extends keyof Events>(event: E, parameters: Parameters<Events[E]>): Promise<void> {
    if (event in this._eventPool) {
      await Promise.all(
        Array.from(this._eventPool[event]!).map(handler => (handler as Function).apply(this, parameters)),
      );
    }
  }
}
