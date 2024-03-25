import { ColorMatrixFilter, Container, Filter } from 'pixi.js';

export function attachHover(container: Container): void {
  const hoverFilter = attachFilter(container, new ColorMatrixFilter());
  hoverFilter.brightness(1.2, true);
  hoverFilter.enabled = false;

  container.on('mouseover', () => {
    hoverFilter.enabled = true;
  });

  container.on('mouseleave', () => {
    hoverFilter.enabled = false;
  });
}

export function attachFilter<T extends Filter>(container: Container, filter: T): T {
  container.filters = [...((container.filters as []) || []), filter];

  return filter;
}

export function removeFilter(container: Container, filter: Filter): void {
  if (container.filters) {
    container.filters = (container.filters as []).filter(f => f !== filter);
  }
}
