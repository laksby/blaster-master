import FontFaceObserver from 'fontfaceobserver';
import { Application, Assets } from 'pixi.js';
import { GameModel } from './model';
import { AppView } from './modules/App';
import { GlobalOptions } from './types';

export async function initializeGame(canvas: HTMLCanvasElement): Promise<void> {
  const app = new Application();

  await app.init({
    canvas,
    background: 0xa3a3a3,
    antialias: true,
    width: 1920,
    height: 1080,
    resizeTo: window,
  });

  Assets.add({ alias: 'board', src: 'img/board.png' });
  Assets.add({ alias: 'button', src: 'img/button.png' });
  Assets.add({ alias: 'tile-blue', src: 'img/tile-blue.png' });
  Assets.add({ alias: 'tile-pink', src: 'img/tile-pink.png' });
  Assets.add({ alias: 'tile-red', src: 'img/tile-red.png' });
  Assets.add({ alias: 'tile-yellow', src: 'img/tile-yellow.png' });
  Assets.add({ alias: 'tile-green', src: 'img/tile-green.png' });

  const font = new FontFaceObserver('Super Squad');
  await font.load();

  const options: GlobalOptions = {
    cols: GameModel.singleton.cols,
    rows: GameModel.singleton.rows,
    uiScale: 0.4,
    tileTypes: GameModel.singleton.types,
  };

  const appView = new AppView(options);
  await appView.initializeView(app, app.stage);
}
