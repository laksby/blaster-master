import { Size } from 'pixi.js';

export function getProportionalSize(base: Size, input: Partial<Size>): Size {
  if (input.width) {
    return {
      width: input.width,
      height: (base.height * input.width) / base.width,
    };
  } else if (input.height) {
    return {
      width: (base.width * input.height) / base.height,
      height: input.height,
    };
  } else {
    throw new Error('Either width or height should be provided');
  }
}

export function getWidthFitSize(widthToFit: number, input: Size): Size {
  const width = Math.min(widthToFit, input.width);
  return getProportionalSize(input, { width });
}
