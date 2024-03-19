import { Container } from 'pixi.js';

export interface IView {
  container: Container;
  initializeView(): void;
}
