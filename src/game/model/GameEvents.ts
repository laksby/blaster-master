import { PointData } from 'pixi.js';

export interface Events {
  victory(this: GameEvents): void | Promise<void>;
  defeat(this: GameEvents, reason: string): void | Promise<void>;
  shuffle(this: GameEvents, shifts: [PointData, PointData][]): void | Promise<void>;
  scoreUpdate(this: GameEvents, score: number): void | Promise<void>;
  turnUpdate(this: GameEvents, turn: number): void | Promise<void>;
}

export type EventPool = {
  [E in keyof Events]: Events[E][];
};

export class GameEvents {
  private readonly _eventPool: Partial<EventPool> = {};

  public on<E extends keyof Events>(event: E, handler: Events[E]): void {
    if (!(event in this._eventPool)) {
      this._eventPool[event] = [];
    }

    this._eventPool[event]!.push(handler);
  }

  public async emit<E extends keyof Events>(event: E, parameters: Parameters<Events[E]>): Promise<void> {
    if (event in this._eventPool) {
      const handlers = this._eventPool[event]!;

      for (const handler of handlers) {
        await (handler as Function).apply(this, parameters);
      }
    }
  }
}
