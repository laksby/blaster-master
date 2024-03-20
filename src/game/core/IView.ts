import { Application, Container } from 'pixi.js';

export interface IView {
  container: Container;
  initializeView(app: Application, parent: Container): Promise<void>;
}
