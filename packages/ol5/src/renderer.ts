import { FrameState } from 'ol/PluggableMap';
import { Coordinate } from 'ol/coordinate';
import { State } from 'ol/layer/Layer';
import MapRenderer from 'ol/renderer/Map';
import { transform } from 'ol/proj';
// for CanvasLayerRender is not export, instead of CanvasImageLayerRenderer;
import CanvasImageLayerRenderer from 'ol/renderer/canvas/ImageLayer';
import {
  containsExtent, intersects, getIntersection, isEmpty, containsCoordinate,
} from 'ol/extent';

import WindCore, { createCanvas } from 'wind-core';

const ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1
};

function applyTransform(transform: number[], coordinate: number[]) {
  const x = coordinate[0];
  const y = coordinate[1];
  coordinate[0] = transform[0] * x + transform[2] * y + transform[4];
  coordinate[1] = transform[1] * x + transform[3] * y + transform[5];
  return coordinate;
}

// @ts-ignore
export default class WindLayerRender extends CanvasImageLayerRenderer {
  public wind: WindCore;
  private innterCanvas: HTMLCanvasElement;
  private innterCtx: CanvasRenderingContext2D | null;

  static create(mapRenderer: MapRenderer, layer: any): WindLayerRender {
    return new WindLayerRender(layer);
  }

  static handles(layer: any) {
    return layer.getType() === 'WIND';
  }

  constructor(layer: any) {
    // @ts-ignore
    super(layer);
  }

  prepareFrame(frameState: FrameState, layerState: State) {
    const layer = this.getLayer() as any;
    const hints = frameState.viewHints;

    let renderedExtent = frameState.extent;
    if (layerState.extent !== undefined) {
      renderedExtent = getIntersection(renderedExtent, layerState.extent);
    }

    if (!this.wind) { // 默认第一次先进入渲染创建风场实例
      return true;
    }

    if (layer.get('forceRender')) { // 强制渲染
      return true;
    }

    if (hints[ViewHint.ANIMATING] || hints[ViewHint.INTERACTING]) {
      return false;
    }

    if (!hints[ViewHint.ANIMATING] && !hints[ViewHint.INTERACTING] && !isEmpty(renderedExtent)) {
      return true;
    } else {
      return !!this.wind;
    }
  }

  composeFrame(frameState: FrameState, layerState: State, context: CanvasRenderingContext2D) {
    this.preCompose(context, frameState);

    const layer = this.getLayer() as any;

    const pixelRatio = frameState.pixelRatio;
    const size = frameState.size;

    let width = Math.round(size[0] * pixelRatio);
    let height = Math.round(size[1] * pixelRatio);

    const extent = layerState!.extent;
    const clipped = extent !== undefined &&
      !containsExtent(extent, frameState.extent) &&
      intersects(extent, frameState.extent);
    if (clipped && extent !== undefined) {
      this.clip(context, frameState, extent);
    }

    // for performance reasons, context.save / context.restore is not used
    // to save and restore the transformation matrix and the opacity.
    // see http://jsperf.com/context-save-restore-versus-variable
    const alpha = context.globalAlpha;
    context.globalAlpha = layerState.opacity;

    if (!this.innterCanvas || !this.innterCtx) {
      this.innterCanvas = createCanvas(size[0], size[1], pixelRatio);
      this.innterCtx = this.innterCanvas.getContext('2d');
    } else if (this.innterCanvas.width != width || this.innterCanvas.height != height) {
      this.innterCanvas.width = width;
      this.innterCanvas.height = height;
    }

    const opt = layer.getWindOptions();

    if (!this.wind && this.innterCtx) {
      const data = layer.getData();

      this.wind = new WindCore(this.innterCtx, opt, data);

      // @ts-ignore
      this.wind.project = this.getPixelFromCoordinateInternal.bind(this, frameState);
      // @ts-ignore
      this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this, frameState);
      this.wind.postrender = () => {
        context.drawImage(this.innterCanvas, 0, 0, +this.innterCanvas.width, +this.innterCanvas.height);

        this.changed();
      };

      this.wind.prerender();
    }

    if (this.wind) {
      if ('generateParticleOption' in opt) {
        const flag = typeof opt.generateParticleOption === 'function' ? opt.generateParticleOption() : opt.generateParticleOption;
        flag && this.wind.prerender();
      }

      this.wind.render();

      // this.wind.render = () => {
      //   if (this.innterCanvas.width != width || this.innterCanvas.height != height) {
      //     this.innterCanvas.width = width;
      //     this.innterCanvas.height = height;
      //   }
      //
      //
      //   render.apply(this.wind);
      // };

      // render.apply(this.wind);
    }

    context.globalAlpha = alpha;

    if (clipped) {
      context.restore();
    }


    this.postCompose(context, frameState, layerState);
  }

  private getPixelFromCoordinateInternal(frameState: FrameState, coordinate: Coordinate) {
    const viewState = frameState.viewState;
    const pixelRatio = frameState.pixelRatio;
    const viewCoordinate = transform(coordinate, 'EPSG:4326', viewState.projection);
    if (!frameState) {
      return null;
    } else {
      const pixel = applyTransform(frameState.coordinateToPixelTransform, viewCoordinate.slice(0, 2));
      // FIXME: should do layer resolution
      // this.renderedResolution = frameState.viewState.resolution;
      // scaleCoordinate(pixel, frameState.viewState.resolution / this.renderedResolution);
      return [
        pixel[0] * pixelRatio,
        pixel[1] * pixelRatio
      ];
    }
  }

  private intersectsCoordinate(frameState: FrameState, coordinate: Coordinate) {
    const viewState = frameState.viewState;
    const viewCoordinate = transform(coordinate, 'EPSG:4326', viewState.projection);
    return containsCoordinate(frameState.extent, viewCoordinate.slice(0, 2));
  }
}
