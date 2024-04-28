import type { FrameState } from 'ol/PluggableMap';
import type { Coordinate } from 'ol/coordinate';
import type { Pixel } from 'ol/pixel';
import { fromUserExtent, fromUserCoordinate, toUserCoordinate, transform as transformProj } from 'ol/proj';
import CanvasLayerRenderer from 'ol/renderer/canvas/Layer';
import {
  toString as toTransformString,
  compose,
  makeInverse,
  apply as applyTransform,
  create as createTransform,
  type Transform,
} from 'ol/transform';
import { containsExtent, intersects, containsCoordinate, getIntersection, isEmpty } from 'ol/extent';
import type { Extent } from 'ol/extent';

import { WindCore } from 'wind-core';
import type { IOptions, Field } from 'wind-core';

import type { WindLayer } from './index';

const ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1,
};

export default class WindLayerRender extends CanvasLayerRenderer<any> {
  protected container: HTMLElement;
  protected inversePixelTransform: Transform;
  protected pixelTransform: Transform;

  public wind: WindCore;

  constructor(layer) {
    super(layer);

    this.pixelTransform = createTransform();
    this.inversePixelTransform = createTransform();
  }

  // useContainer(target: HTMLElement, transform: string, backgroundColor: number) 这里在 v6.3.0 后有 break change
  useContainer(target: HTMLElement, transform: string, backgroundColor?: string) {
    // 此处强制新建 canvas
    super.useContainer(null as any, transform, backgroundColor);
  }

  getBackground(frameState: FrameState) {
    // @ts-ignore 6.3.0 之前无此函数
    if (super.getBackground) {
      return super.getBackground(frameState)
    }

    return ''
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
      const layer = this.getLayer() as unknown as WindLayer;
      return layer.get('forceRender');
    }
  }

  prepareContainer(frameState: FrameState, target: HTMLElement) {
    const size = frameState.size;
    const rotation = frameState.viewState.rotation;
    const pixelRatio = frameState.pixelRatio;
    const width = Math.round(size[0] * pixelRatio);
    const height = Math.round(size[1] * pixelRatio);
    // set forward and inverse pixel transforms
    compose(
      this.pixelTransform,
      frameState.size[0] / 2,
      frameState.size[1] / 2,
      1 / pixelRatio,
      1 / pixelRatio,
      rotation,
      -width / 2,
      -height / 2,
    );
    makeInverse(this.inversePixelTransform, this.pixelTransform);

    const canvasTransform = toTransformString(this.pixelTransform);
    this.useContainer(target, canvasTransform, this.getBackground(frameState));

    if (!this.containerReused) {
      const canvas = this.context.canvas;
      if (canvas.width != width || canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
      } else {
        // this.getRenderContext(frameState).globalCompositeOperation = 'source-over';
      }
      if (canvasTransform !== canvas.style.transform) {
        canvas.style.transform = canvasTransform;
      }
    }
  }

  getRenderContext(frameState: FrameState) {
    return this.context;
  }

  renderFrame(frameState: FrameState, target: HTMLElement) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    const viewState = frameState.viewState;

    this.prepareContainer(frameState, target);

    const context = this.getRenderContext(frameState);

    context.imageSmoothingEnabled = false;
    this.preRender(context, frameState);

    // clipped rendering if layer extent is set
    let clipped = false;
    let render = true;
    if (layerState.extent) {
      const layerExtent = fromUserExtent(layerState.extent, viewState.projection);
      render = intersects(layerExtent, frameState.extent as Extent);
      clipped = render && !containsExtent(layerExtent, frameState.extent as Extent);
      if (clipped) {
        this.clipUnrotated(context, frameState, layerExtent);
      }
    }

    const layer = this.getLayer();
    const opt = layer.getWindOptions();
    const data = layer.getData();

    this.execute(this.context, frameState, opt, data);

    this.postRender(this.context, frameState);

    if (clipped) {
      context.restore();
    }

    context.imageSmoothingEnabled = true;

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
    }
  }

  execute(
    context: CanvasRenderingContext2D,
    frameState: FrameState,
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
    const frameState = this.frameState;
    if (!frameState) {
      return null;
    } else {
      const viewState = frameState.viewState;
      const pixelRatio = frameState.pixelRatio;
      const point = transformProj(coordinate, 'EPSG:4326', viewState.projection);
      const viewCoordinate = fromUserCoordinate(point, viewState.projection);
      const pixel = applyTransform(frameState.coordinateToPixelTransform, viewCoordinate.slice(0, 2));
      return [pixel[0] * pixelRatio, pixel[1] * pixelRatio];
    }
  }

  private getCoordinateFromPixel(pixel: Pixel): [number, number] | null {
    const frameState = this.frameState;
    if (!frameState) {
      return null;
    } else {
      const viewState = frameState.viewState;
      const viewCoordinate = applyTransform(frameState.pixelToCoordinateTransform, pixel.slice(0, 2));
      const coordinate = toUserCoordinate(viewCoordinate, viewState.projection);
      const point = transformProj(coordinate, viewState.projection, 'EPSG:4326');
      return [point[0], point[1]];
    }
  }

  private intersectsCoordinate(coordinate: Coordinate): boolean {
    const frameState = this.frameState;
    if (frameState) {
      const viewState = frameState.viewState;
      const point = transformProj(coordinate, 'EPSG:4326', viewState.projection);
      const viewCoordinate = fromUserCoordinate(point, viewState.projection);
      // const extent = getForViewAndSize(viewState.center, viewState.resolution, viewState.rotation, frameState.size.map((item) => item * frameState.pixelRatio));
      return containsCoordinate(frameState.extent as Extent, viewCoordinate.slice(0, 2));
    }

    return true;
  }
}
