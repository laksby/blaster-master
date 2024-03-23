import { ColorMatrixFilter, Container } from 'pixi.js';

export function attachHover(container: Container): void {
  const hoverFilter = new ColorMatrixFilter();
  hoverFilter.brightness(1.2, true);

  container.on('mouseover', () => {
    container.filters = [hoverFilter];
  });

  container.on('mouseleave', () => {
    container.filters = [];
  });
}
