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
} from 'ol/transform';
import {containsExtent, intersects, getIntersection, isEmpty, containsCoordinate} from 'ol/extent';
import type { Extent } from 'ol/extent';

import { WindCore, Field } from 'wind-core';
import type { IOptions } from 'wind-core';

import { WindLayer } from './index';

const ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1
};

// @ts-ignore
export default class WindLayerRender extends CanvasLayerRenderer {
  private pixelTransform: any;
  private inversePixelTransform: any;
  private context: CanvasRenderingContext2D;
  private containerReused: boolean;
  private container: HTMLDivElement | HTMLCanvasElement;

  public wind: WindCore;

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
      renderedExtent = getIntersection(renderedExtent as Extent, fromUserExtent(layerState.extent, viewState.projection));
    }

    if (!hints[ViewHint.ANIMATING] && !frameState.animate && !hints[ViewHint.INTERACTING] && !isEmpty(renderedExtent as Extent)) {
      return true;
    } else {
      // @ts-ignore
      const layer = this.getLayer() as unknown as WindLayer;
      return layer.get('forceRender');
    }

    // return !!this.wind;
  }

  renderFrame(frameState: FrameState, target: HTMLDivElement) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const pixelRatio = frameState.pixelRatio;
    const viewState = frameState.viewState;
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

    // @ts-ignore
    this.preRender(context, frameState);

    // clipped rendering if layer extent is set
    let clipped = false;
    if (layerState.extent) {
      const layerExtent = fromUserExtent(layerState.extent, viewState.projection);
      clipped = !containsExtent(layerExtent, frameState.extent as Extent) && intersects(layerExtent, frameState.extent as Extent);
      if (clipped) {
        // @ts-ignore
        this.clipUnrotated(context, frameState, layerExtent);
      }
    }

    const center = viewState.center;
    const resolution = viewState.resolution;
    const rotation = viewState.rotation;

    // @ts-ignore
    const layer = this.getLayer() as unknown as WindLayer;
    const opt = layer.getWindOptions();
    const data = layer.getData();

    // @ts-ignore
    const transformOrigin = this.getRenderTransform(center, resolution, rotation, pixelRatio, width, height, 0);

    this.execute(this.context, 0, frameState, transformOrigin, transformOrigin, opt, data);

    if (clipped) {
      context.restore();
    }

    // @ts-ignore
    this.postRender(context, frameState);

    const opacity = layerState.opacity;
    const container = this.container;
    if (container !== null && opacity !== parseFloat(<string>container.style.opacity)) {
      container.style.opacity = (opacity === 1 ? '' : opacity) as string;
    }

    return this.container;
  }

  public setOptions(options: Partial<IOptions>) {
    if (this.wind) {
      this.wind.setOptions(options);
      // wind.prerender();
    }
  }

  public setData(field: Field) {
    if (this.wind) {
      this.wind.updateData(field);
      // wind.prerender();
    }
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
    if (!this.wind) {
      this.wind = new WindCore(context, opt, data);

      this.wind.project = this.getPixelFromCoordinateInternal.bind(this, frameState, transform);
      this.wind.unproject = this.getCoordinateFromPixel.bind(this, frameState);
      this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this, frameState);
      this.wind.postrender = () => {};
    }
    this.wind.prerender();
  }

  private getPixelFromCoordinateInternal(frameState: FrameState, transform: number[], coordinate: Coordinate): [number, number] | null {
    const viewState = frameState.viewState;
    const pixelRatio = frameState.pixelRatio;
    const point = transformProj(coordinate, 'EPSG:4326', viewState.projection);
    const viewCoordinate = fromUserCoordinate(point, viewState.projection);

    if (!frameState) {
      return null;
    } else {
      const pixel = applyTransform(frameState.coordinateToPixelTransform, viewCoordinate.slice(0, 2));
      return [
        pixel[0] * pixelRatio,
        pixel[1] * pixelRatio
      ];
    }
  }

  private getCoordinateFromPixel(frameState: FrameState, pixel: Pixel): [number, number] | null {
    const viewState = frameState.viewState;
    if (!frameState) {
      return null;
    } else {
      const viewCoordinate = applyTransform(frameState.pixelToCoordinateTransform, pixel.slice(0, 2));
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
    return containsCoordinate(frameState.extent as Extent, viewCoordinate.slice(0, 2));
  }
}
