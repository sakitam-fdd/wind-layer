import { Layer } from 'ol/layer';
import { fromUserExtent, fromUserCoordinate } from 'ol/proj';
import CanvasLayerRenderer from 'ol/renderer/canvas/Layer';
import { compose as composeTransform, makeInverse, apply as applyTransform } from 'ol/transform';
import { containsExtent, intersects, getIntersection, isEmpty, containsCoordinate } from 'ol/extent';

import WindCore, {
  Field,
  isArray,
  formatData,
  warnLog,
  assign,
  defaultOptions,
  IOptions,
} from 'wind-core';

import { WindLayer } from './index';

const ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1
};

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

  prepareFrame(frameState: {
    layerStatesArray: { [x: string]: any; };
    layerIndex: string | number;
    pixelRatio: any;
    viewState: any;
    viewHints: any;
    extent: any;
  }) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const pixelRatio = frameState.pixelRatio;
    const viewState = frameState.viewState;
    const viewResolution = viewState.resolution;

    const hints = frameState.viewHints;

    let renderedExtent = frameState.extent;
    if (layerState.extent !== undefined) {
      renderedExtent = getIntersection(renderedExtent, fromUserExtent(layerState.extent, viewState.projection));
    }

    if (!hints[ViewHint.ANIMATING] && !hints[ViewHint.INTERACTING] && !isEmpty(renderedExtent)) {
      let projection = viewState.projection;
      // console.log(this, projection, renderedExtent, viewResolution);
    }

    return true;
  }

  renderFrame(frameState: any, target: any) {
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

    if (!this.wind) {
      const layer = this.getLayer();
      const opt = layer.getWindOptions();
      const data = layer.getData();

      this.wind = new WindCore(this.context, opt, data);

      this.wind.project = this.getPixelFromCoordinateInternal.bind(this, frameState);
      this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this, frameState);
      this.wind.postrender = () => {};

      this.wind.prerender();
    }

    // render
    this.wind.render();
    // @ts-ignore
    this.postRender(context, frameState);

    if (clipped) {
      context.restore();
    }

    if (canvasTransform !== canvas.style.transform) {
      canvas.style.transform = canvasTransform;
    }

    return this.container;
  }

  private getPixelFromCoordinateInternal(frameState: {
    viewState: any;
    coordinateToPixelTransform: any;
  }, coordinate: [number, number]) {
    const viewState = frameState.viewState;
    const viewCoordinate = fromUserCoordinate(coordinate, viewState.projection);
    if (!frameState) {
      return null;
    } else {
      return applyTransform(frameState.coordinateToPixelTransform, viewCoordinate.slice(0, 2));
    }
  }

  private intersectsCoordinate(frameState: {
    extent: [number, number, number, number];
    viewState: any;
    coordinateToPixelTransform: any;
  }, coordinate: [number, number]): boolean {
    return containsCoordinate(frameState.extent, coordinate) as boolean;
  }

  public getLayer(): WindLayer {
    return super.getLayer();
  }

  forEachFeatureAtCoordinate<T>(
    coordinate: import("ol/coordinate").Coordinate,
    frameState: import("ol/PluggableMap").FrameState,
    hitTolerance: number,
    callback: (
      p0: import("ol/Feature").FeatureLike,
      p1: Layer<import("ol/source/Source").default>) => T,
      declutteredFeatures: import("ol/Feature").FeatureLike[]
  ): void | T {
    throw new Error("Method not implemented.");
  }

  handleFontsChanged(): void {
    throw new Error("Method not implemented.");
  }
}
