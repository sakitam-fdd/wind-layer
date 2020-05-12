import { equals } from 'ol/array';
import { FrameState } from 'ol/PluggableMap';
import { Coordinate } from 'ol/coordinate';
import { Pixel } from 'ol/pixel';
import { fromUserExtent, fromUserCoordinate, toUserCoordinate, transform as transformProj } from 'ol/proj';
import CanvasLayerRenderer from 'ol/renderer/canvas/Layer';
import {
  toString as transformToString,
  makeScale,
  makeInverse,
  apply as applyTransform,
  create as createTransform,
  setFromArray as transformSetFromArray, Transform,
} from 'ol/transform';
import { containsExtent, intersects, getWidth, getIntersection, isEmpty, containsCoordinate } from 'ol/extent';
// import Projection from 'ol/proj/Projection';

import WindCore, { IOptions } from 'wind-core';

import { WindLayer } from './index';

const ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1
};

// export function getCenter(extent: number[]): [number, number] {
//   return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
// }

// export function wrapExtent(extent: Extent, projection: Projection) {
//   const projectionExtent = projection.getExtent();
//   const center = getCenter(extent);
//   if (
//     projection.canWrapX() &&
//     (center[0] < projectionExtent[0] || center[0] >= projectionExtent[2])
//   ) {
//     const worldWidth = getWidth(projectionExtent);
//     const worldsAway = Math.floor(
//       (center[0] - projectionExtent[0]) / worldWidth
//     );
//     const offset = worldsAway * worldWidth;
//     extent[0] -= offset;
//     extent[2] -= offset;
//   }
//   return extent;
// }

// export function wrapCoordinates(coordinate: Coordinate, projection: Projection) {
//   const projectionExtent = projection.getExtent();
//   if (
//     projection.canWrapX() &&
//     (coordinate[0] < projectionExtent[0] ||
//       coordinate[0] >= projectionExtent[2])
//   ) {
//     const worldWidth = getWidth(projectionExtent);
//     const worldsAway = Math.floor(
//       (coordinate[0] - projectionExtent[0]) / worldWidth
//     );
//     coordinate[0] -= worldsAway * worldWidth;
//   }
//   return coordinate;
// }

function transform2D(flatCoordinates: number[], offset: number, end: number, stride: number, transform: number[], opt_dest: any[]) {
  const dest = opt_dest ? opt_dest : [];
  let i = 0;
  for (let j = offset; j < end; j += stride) {
    const x = flatCoordinates[j];
    const y = flatCoordinates[j + 1];
    dest[i++] = transform[0] * x + transform[2] * y + transform[4];
    dest[i++] = transform[1] * x + transform[3] * y + transform[5];
  }
  if (opt_dest && dest.length != i) {
    dest.length = i;
  }
  return dest;
}

class Render {
  private executors: {
    [propName: string] : WindCore;
  };
  private renderedTransform_: Transform;
  constructor() {
    this.executors = {};

    this.renderedTransform_ = createTransform();
  }

  execute(
    context: CanvasRenderingContext2D,
    index: number,
    frameState: FrameState,
    transform: number[],
    renderedTransform: number[],
    opt: Partial<IOptions>,
    data: any,
  ) {
    if (this.executors[index]) {
      const wind = this.executors[index];
      wind.project = this.getPixelFromCoordinateInternal.bind(this, frameState, transform);
      wind.unproject = this.getCoordinateFromPixel.bind(this, frameState);
      wind.intersectsCoordinate = this.intersectsCoordinate.bind(this, frameState);

      wind.prerender();
      wind.render();
    } else {
      const wind = new WindCore(context, opt, data);

      this.executors[index] = wind;

      wind.project = this.getPixelFromCoordinateInternal.bind(this, frameState, transform);
      wind.unproject = this.getCoordinateFromPixel.bind(this, frameState);
      wind.intersectsCoordinate = this.intersectsCoordinate.bind(this, frameState);
      wind.postrender = () => {};
      wind.prerender();
    }
  }

  public setOptions(options: Partial<IOptions>) {
    Object.keys(this.executors).forEach((key: string) => {
      const wind = this.executors[key];
      if (wind) {
        wind.setOptions(options);
      }
    });
  }

  // FIXME: 需要针对所有坐标进行批量计算，现在是由于单个计算时改变了缓存的矩阵造成后面坐标无法转换
  private repeatWorld(coordinates: number[], pixelCoordinates: number[], transform: number[]) {
    let pixel;
    if (pixelCoordinates && equals(transform, this.renderedTransform_)) {
      pixel = pixelCoordinates;
    } else {
      if (!pixelCoordinates) {
        pixelCoordinates = [];
      }
      pixel = transform2D(coordinates, 0, coordinates.length, 2,
        transform, pixelCoordinates);
      transformSetFromArray(this.renderedTransform_, transform);
    }

    return pixel;
  }

  private getPixelFromCoordinateInternal(frameState: FrameState, transform: number[], coordinate: Coordinate): [number, number] | null {
    const viewState = frameState.viewState;
    const pixelRatio = frameState.pixelRatio;
    const point = transformProj(coordinate, 'EPSG:4326', viewState.projection);
    const viewCoordinate = fromUserCoordinate(point, viewState.projection);

    if (!frameState) {
      return null;
    } else {
      const pixelCoordinates = applyTransform(frameState.coordinateToPixelTransform, viewCoordinate.slice(0, 2));
      const pixel = this.repeatWorld(viewCoordinate.slice(0, 2), pixelCoordinates, transform);
      return [
        pixel[0] * pixelRatio,
        pixel[1] * pixelRatio
      ];
    }
  }

  private getCoordinateFromPixel(frameState: FrameState, pixel: Pixel): [number, number] | null {
    const viewState = frameState.viewState;
    // const pixelRatio = frameState.pixelRatio;
    // const point = transformProj(coordinate, 'EPSG:4326', viewState.projection);
    // const viewCoordinate = toUserCoordinate(point, viewState.projection);

    if (!frameState) {
      return null;
    } else {
      const viewCoordinate = applyTransform(frameState.pixelToCoordinateTransform, pixel.slice(0, 2));
      // const pixel = this.repeatWorld(viewCoordinate.slice(0, 2), pixelCoordinates, transform);
      const coordinate = toUserCoordinate(viewCoordinate, viewState.projection);
      const point = transformProj(coordinate, viewState.projection, 'EPSG:4326');
      return [
        point[0],
        point[1]
      ];
    }
  }

  private intersectsCoordinate(frameState: FrameState, coordinate: Coordinate): boolean {
    const viewState = frameState.viewState;
    const point = transformProj(coordinate, 'EPSG:4326', viewState.projection);
    const viewCoordinate = fromUserCoordinate(point, viewState.projection);
    return containsCoordinate(frameState.extent, viewCoordinate.slice(0, 2));
  }
}

// @ts-ignore
export default class WindLayerRender extends CanvasLayerRenderer {
  private pixelTransform: any;
  private inversePixelTransform: any;
  private context: CanvasRenderingContext2D;
  private containerReused: boolean;
  private container: HTMLDivElement | HTMLCanvasElement;
  public oRender: Render;

  constructor(layer: WindLayer) {
    // @ts-ignore
    super(layer);

    this.oRender = new Render();
  }

  useContainer(target: HTMLElement | null, transform: string, opacity: number) {
    if (opacity < 1) {
      target = null;
    }
    // @ts-ignore
    super.useContainer(null, transform, opacity);
  }

  prepareFrame(frameState: FrameState) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const viewState = frameState.viewState;

    const hints = frameState.viewHints;

    let renderedExtent = frameState.extent;
    if (layerState.extent !== undefined) {
      renderedExtent = getIntersection(renderedExtent, fromUserExtent(layerState.extent, viewState.projection));
    }

    if (!hints[ViewHint.ANIMATING] && !frameState.animate && !hints[ViewHint.INTERACTING] && !isEmpty(renderedExtent)) {
      return true;
    } else {
      const layer = this.getLayer() as unknown as WindLayer;
      return layer.get('forceRender');
    }

    // return !!this.wind;
  }

  renderFrame(frameState: FrameState, target: HTMLDivElement) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const pixelRatio = frameState.pixelRatio;
    const viewState = frameState.viewState;
    const projection = viewState.projection;
    const size = frameState.size;

    let width = Math.round(size[0] * pixelRatio);
    let height = Math.round(size[1] * pixelRatio);

    // set forward and inverse pixel transforms
    makeScale(this.pixelTransform, 1 / pixelRatio, 1 / pixelRatio);
    makeInverse(this.inversePixelTransform, this.pixelTransform);

    const canvasTransform = transformToString(this.pixelTransform);

    this.useContainer(target, canvasTransform, layerState.opacity);

    const context = this.context;
    const canvas = context.canvas;

    if (canvas.width != width || canvas.height != height) {
      canvas.width = width;
      canvas.height = height;
      if (canvas.style.transform !== canvasTransform) {
        canvas.style.transform = canvasTransform;
      }
    } else if (!this.containerReused) {
      context.clearRect(0, 0, width, height);
    }

    this.preRender(context, frameState);

    // clipped rendering if layer extent is set
    let clipped = false;
    if (layerState.extent) {
      const layerExtent = fromUserExtent(layerState.extent, viewState.projection);
      clipped = !containsExtent(layerExtent, frameState.extent) && intersects(layerExtent, frameState.extent);
      if (clipped) {
        this.clipUnrotated(context, frameState, layerExtent);
      }
    }

    const extent = frameState.extent;
    const center = viewState.center;
    const resolution = viewState.resolution;
    const rotation = viewState.rotation;
    const projectionExtent = projection.getExtent();

    const layer = this.getLayer() as unknown as WindLayer;
    const opt = layer.getWindOptions();
    const data = layer.getData();

    const transformOrigin = this.getRenderTransform(center, resolution, rotation, pixelRatio, width, height, 0);

    this.oRender.execute(this.context, 0, frameState, transformOrigin, transformOrigin, opt, data);

    if (layer.getWrapX() && projection.canWrapX() && !containsExtent(projectionExtent, extent)) {
      let startX = extent[0];
      const worldWidth = getWidth(projectionExtent);
      let world = 0;
      let offsetX;
      while (startX < projectionExtent[0]) {
        --world;
        offsetX = worldWidth * world;
        const transform = this.getRenderTransform(center, resolution, rotation, pixelRatio, width, height, offsetX);
        this.oRender.execute(this.context, world, frameState, transform, transformOrigin, opt, data);
        startX += worldWidth;
      }
      world = 0;
      startX = extent[2];
      while (startX > projectionExtent[2]) {
        ++world;
        offsetX = worldWidth * world;
        const transform = this.getRenderTransform(center, resolution, rotation, pixelRatio, width, height, offsetX);
        this.oRender.execute(this.context, world, frameState, transform, transformOrigin, opt, data);
        startX -= worldWidth;
      }
    }

    if (clipped) {
      context.restore();
    }

    this.postRender(context, frameState);

    const opacity = layerState.opacity;
    const container = this.container;
    if (container !== null && opacity !== parseFloat(<string>container.style.opacity)) {
      container.style.opacity = (opacity === 1 ? '' : opacity) as string;
    }

    return this.container;
  }
}
