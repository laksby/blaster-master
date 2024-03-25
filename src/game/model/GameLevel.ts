import { TileType } from './TileType';

export class GameLevel {
  private _shuffles = 3;
  private _score = 0;
  private _turn = 0;
  private _maxScore = 100;
  private _maxTurn = 20;
  private _allTileTypes = Object.values(TileType);

  public get shuffles(): number {
    return this._shuffles;
  }

  public get score(): number {
    return this._score;
  }

  public get turn(): number {
    return this._turn;
  }

  public get maxScore(): number {
    return this._maxScore;
  }

  public get maxTurn(): number {
    return this._maxTurn;
  }

  public get allTileTypes(): TileType[] {
    return this._allTileTypes;
  }

  public get isScoreVictory(): boolean {
    return this._score >= this._maxScore;
  }

  public get isTurnDefeat(): boolean {
    return this._turn === this._maxTurn && this._score < this._maxScore;
  }

  public decreaseShuffles(): void {
    this._shuffles--;
  }

  public increaseScore(cleared: number): void {
    this._score += 2 ** (cleared - 1);
  }

  public increaseTurn(): void {
    this._turn++;
  }

  public generateTile(): TileType {
    const random = Math.floor(Math.random() * this._allTileTypes.length);
    return this._allTileTypes[random];
  }
}
