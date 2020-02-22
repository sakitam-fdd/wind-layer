import { FrameState } from 'ol/PluggableMap';
import { Coordinate } from 'ol/coordinate';
import { fromUserExtent, fromUserCoordinate, transform } from 'ol/proj';
import CanvasLayerRenderer from 'ol/renderer/canvas/Layer';
import { compose as composeTransform, makeInverse, apply as applyTransform } from 'ol/transform';
import { containsExtent, intersects, getIntersection, isEmpty, containsCoordinate } from 'ol/extent';

import WindCore from 'wind-core';

import { WindLayer } from './index';

const ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1
};

// @ts-ignore
export default class WindLayerRender extends CanvasLayerRenderer {
  public wind: WindCore;
  private pixelTransform: any;
  private inversePixelTransform: any;
  private context: CanvasRenderingContext2D;
  private containerReused: boolean;
  private container: HTMLDivElement | HTMLCanvasElement;

  constructor(layer: WindLayer) {
    // @ts-ignore
    super(layer);
  }

  prepareFrame(frameState: FrameState) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const viewState = frameState.viewState;

    const hints = frameState.viewHints;

    let renderedExtent = frameState.extent;
    if (layerState.extent !== undefined) {
      renderedExtent = getIntersection(renderedExtent, fromUserExtent(layerState.extent, viewState.projection));
    }

    if (!hints[ViewHint.ANIMATING] && !hints[ViewHint.INTERACTING] && !isEmpty(renderedExtent)) {
      if (!this.wind && this.context) {
        const layer = this.getLayer() as unknown as WindLayer;
        const opt = layer.getWindOptions();
        const data = layer.getData();

        this.wind = new WindCore(this.context, opt, data);

        // @ts-ignore
        this.wind.project = this.getPixelFromCoordinateInternal.bind(this, frameState);
        // @ts-ignore
        this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this, frameState);
        this.wind.intersectsCoordinate = () => true;
        this.wind.postrender = () => {};

        this.wind.prerender();
      } else {
        return true;
      }
    } else {
      return true;
    }

    return !!this.wind;
  }

  renderFrame(frameState: FrameState, target: HTMLDivElement) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const pixelRatio = frameState.pixelRatio;
    const viewState = frameState.viewState;
    const size = frameState.size;

    let width = Math.round(size[0] * pixelRatio);
    let height = Math.round(size[1] * pixelRatio);
    const rotation = viewState.rotation;
    if (rotation) {
      const size = Math.round(Math.sqrt(width * width + height * height));
      width = size;
      height = size;
    }

    // set forward and inverse pixel transforms
    composeTransform(this.pixelTransform,
      frameState.size[0] / 2, frameState.size[1] / 2,
      1 / pixelRatio, 1 / pixelRatio,
      rotation,
      -width / 2, -height / 2
    );
    makeInverse(this.inversePixelTransform, this.pixelTransform);

    // @ts-ignore
    const canvasTransform = this.createTransformString(this.pixelTransform);

    // @ts-ignore
    this.useContainer(target, canvasTransform, layerState.opacity);

    const context = this.context;
    const canvas = context.canvas;

    if (canvas.width != width || canvas.height != height) {
      canvas.width = width;
      canvas.height = height;
    } else if (!this.containerReused) {
      context.clearRect(0, 0, width, height);
    }

    // clipped rendering if layer extent is set
    let clipped = false;
    if (layerState.extent) {
      const layerExtent = fromUserExtent(layerState.extent, viewState.projection);
      clipped = !containsExtent(layerExtent, frameState.extent) && intersects(layerExtent, frameState.extent);
      if (clipped) {
        // @ts-ignore
        this.clipUnrotated(context, frameState, layerExtent);
      }
    }

    // @ts-ignore
    this.preRender(context, frameState);

    // render
    this.wind && this.wind.render();

    // @ts-ignore
    this.postRender(context, frameState);

    if (clipped) {
      context.restore();
    }

    if (canvasTransform !== canvas.style.transform) {
      // TODO: 缩放后位置计算有问题
      canvas.style.transform = canvasTransform;
    }

    return this.container;
  }

  private getPixelFromCoordinateInternal(frameState: FrameState, coordinate: Coordinate) {
    const viewState = frameState.viewState;
    const pixelRatio = frameState.pixelRatio;
    const point = transform(coordinate, 'EPSG:4326', viewState.projection);
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

  private intersectsCoordinate(frameState: FrameState, coordinate: Coordinate) {
    const viewState = frameState.viewState;
    const point = transform(coordinate, 'EPSG:4326', viewState.projection);
    const viewCoordinate = fromUserCoordinate(point, viewState.projection);
    return containsCoordinate(frameState.extent, viewCoordinate.slice(0, 2));
  }
}
