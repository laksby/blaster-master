import FontFaceObserver from 'fontfaceobserver';
import { Application, Assets } from 'pixi.js';
import { AppView } from './modules/App';

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
  Assets.add({ alias: 'tile-blue', src: 'img/tile-blue.png' });
  Assets.add({ alias: 'tile-pink', src: 'img/tile-pink.png' });
  Assets.add({ alias: 'tile-red', src: 'img/tile-red.png' });
  Assets.add({ alias: 'tile-yellow', src: 'img/tile-yellow.png' });
  Assets.add({ alias: 'tile-green', src: 'img/tile-green.png' });

  const font = new FontFaceObserver('Super Squad');
  await font.load();

  const appView = new AppView();
  await appView.initializeView(app, app.stage);
}
