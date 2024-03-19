import FontFaceObserver from 'fontfaceobserver';
import { Application, Loader } from 'pixi.js';
import { AppView } from './views/AppView';

export async function initializeGame(canvas: HTMLCanvasElement): Promise<void> {
  const app = new Application();
  const loader = new Loader();

  await app.init({
    canvas,
    background: 0xa3a3a3,
    antialias: true,
    width: 1920,
    height: 1080,
    resizeTo: window,
  });

  await loader.load([
    {
      alias: ['board'],
      src: 'img/board.png',
    },
  ]);

  const font = new FontFaceObserver('Super Squad');
  await font.load();

  const appView = new AppView();
  appView.initializeView();

  app.stage.addChild(appView.container);
}
