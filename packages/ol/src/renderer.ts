import { FrameState } from 'ol/PluggableMap';
import { Coordinate } from 'ol/coordinate';
import { Pixel } from 'ol/pixel';
import {
  fromUserExtent,
  fromUserCoordinate,
  toUserCoordinate,
  transform as transformProj,
} from 'ol/proj';
import CanvasLayerRenderer from 'ol/renderer/canvas/Layer';
import {
  toString as transformToString,
  makeScale,
  makeInverse,
  apply as applyTransform,
  create as createTransform,
  type Transform,
} from 'ol/transform';
import {
  containsExtent,
  intersects,
  containsCoordinate,
  getIntersection,
  isEmpty,
} from 'ol/extent';
import type { Extent } from 'ol/extent';

import { WindCore, Field } from 'wind-core';
import type { IOptions } from 'wind-core';

import { WindLayer } from './index';

const ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1,
};

// @ts-ignore
export default class WindLayerRender extends CanvasLayerRenderer {
  private readonly context: CanvasRenderingContext2D;
  private readonly containerReused: boolean;
  protected container: WithNull<HTMLDivElement | HTMLCanvasElement>;
  protected inversePixelTransform: Transform;
  protected pixelTransform: Transform;
  protected renderedResolution: number;
  protected tempTransform: Transform;

  public wind: WindCore;

  constructor(layer) {
    super(layer);

    this.container = null;

    this.renderedResolution;
    this.tempTransform = createTransform();
    this.pixelTransform = createTransform();
    this.inversePixelTransform = createTransform();
  }

  useContainer(target: HTMLElement | null, transform: string, opacity: number) {
    // 此处强制新建 canvas
    super.useContainer(null, transform, opacity);
  }

  prepareFrame(frameState: FrameState) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const viewState = frameState.viewState;

    const hints = frameState.viewHints;

    let renderedExtent = frameState.extent;
    if (layerState.extent !== undefined) {
      renderedExtent = getIntersection(
        renderedExtent as Extent,
        fromUserExtent(layerState.extent, viewState.projection),
      );
    }

    if (
      !hints[ViewHint.ANIMATING] &&
      !frameState.animate &&
      !hints[ViewHint.INTERACTING] &&
      !isEmpty(renderedExtent as Extent)
    ) {
      if (this.wind?.isStop?.()) {
        this.wind.start();
      }
      return true;
    } else {
      // @ts-ignore
      const layer = this.getLayer() as unknown as WindLayer;
      return layer.get('forceRender');
    }
  }

  renderFrame(frameState: FrameState, target: HTMLDivElement) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const pixelRatio = frameState.pixelRatio;
    const viewState = frameState.viewState;
    const size = frameState.size;

    const width = Math.round(size[0] * pixelRatio);
    const height = Math.round(size[1] * pixelRatio);

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
    } else if (!this.containerReused) {
      context.globalCompositeOperation = 'source-over';
    }

    // @ts-ignore
    this.preRender(context, frameState);

    // clipped rendering if layer extent is set
    let clipped = false;
    let render = true;
    if (layerState.extent) {
      const layerExtent = fromUserExtent(layerState.extent, viewState.projection);
      render = intersects(layerExtent, frameState.extent as Extent);
      clipped = render && !containsExtent(layerExtent, frameState.extent as Extent);
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
    const transformOrigin = this.getRenderTransform(
      center,
      resolution,
      rotation,
      pixelRatio,
      width,
      height,
      0,
    );

    this.execute(this.context, frameState, transformOrigin, transformOrigin, opt, data);

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
    frameState: FrameState,
    transform: number[],
    renderedTransform: number[],
    opt: Partial<IOptions>,
    data: any,
  ) {
    if (!this.wind) {
      this.wind = new WindCore(context, opt, data);

      this.wind.project = this.getPixelFromCoordinateInternal.bind(this);
      this.wind.unproject = this.getCoordinateFromPixel.bind(this);
      this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this);
      this.wind.postrender = () => {
        //
      };
      this.wind.prerender();
    }
  }

  private getPixelFromCoordinateInternal(coordinate: Coordinate): [number, number] | null {
    // @ts-ignore
    const frameState = this.frameState;
    const viewState = frameState.viewState;
    const pixelRatio = frameState.pixelRatio;
    const point = transformProj(coordinate, 'EPSG:4326', viewState.projection);
    const viewCoordinate = fromUserCoordinate(point, viewState.projection);

    if (!frameState) {
      return null;
    } else {
      const pixel = applyTransform(
        frameState.coordinateToPixelTransform,
        viewCoordinate.slice(0, 2),
      );
      return [pixel[0] * pixelRatio, pixel[1] * pixelRatio];
    }
  }

  private getCoordinateFromPixel(pixel: Pixel): [number, number] | null {
    // @ts-ignore
    const frameState = this.frameState;
    const viewState = frameState.viewState;
    if (!frameState) {
      return null;
    } else {
      const viewCoordinate = applyTransform(
        frameState.pixelToCoordinateTransform,
        pixel.slice(0, 2),
      );
      const coordinate = toUserCoordinate(viewCoordinate, viewState.projection);
      const point = transformProj(coordinate, viewState.projection, 'EPSG:4326');
      return [point[0], point[1]];
    }
  }

  private intersectsCoordinate(coordinate: Coordinate): boolean {
    // @ts-ignore
    const frameState = this.frameState;
    const viewState = frameState.viewState;
    const point = transformProj(coordinate, 'EPSG:4326', viewState.projection);
    const viewCoordinate = fromUserCoordinate(point, viewState.projection);
    // const extent = getForViewAndSize(viewState.center, viewState.resolution, viewState.rotation, frameState.size.map((item) => item * frameState.pixelRatio));
    return containsCoordinate(frameState.extent as Extent, viewCoordinate.slice(0, 2));
  }
}
