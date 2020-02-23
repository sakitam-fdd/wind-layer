import CanvasLayerRenderer from 'ol/renderer/canvas/Layer.js';
import { transformExtent, fromUserExtent } from 'ol/proj.js';
import { compose as composeTransform, makeInverse } from 'ol/transform.js';
import { containsExtent, getIntersection, intersects, isEmpty } from 'ol/extent.js';

import Windy from '../windy/windy';

const ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1
};

export default class WindLayerRender extends CanvasLayerRenderer {
  constructor (layer) {
    // @ts-ignore
    super(layer);
    this.wind = undefined;
  }

  prepareFrame (frameState) {
    const layerState = frameState.layerStatesArray[frameState.layerIndex];
    // const pixelRatio = frameState.pixelRatio;
    const viewState = frameState.viewState;
    // const viewResolution = viewState.resolution;

    const hints = frameState.viewHints;

    let renderedExtent = frameState.extent;
    if (layerState.extent !== undefined) {
      renderedExtent = getIntersection(renderedExtent, fromUserExtent(layerState.extent, viewState.projection));
    }

    if (!hints[ViewHint.ANIMATING] && !hints[ViewHint.INTERACTING] && !isEmpty(renderedExtent)) {
      // const projection = viewState.projection;
      // eslint-disable-next-line no-console
      // console.log(this, pixelRatio, projection, renderedExtent, viewResolution);
      // return !!this.context;
      if (!this.wind && this.context) {
        const layer = this.getLayer();
        const extent = this._getExtent(frameState);
        const {
          projection,
          minVelocity,
          maxVelocity,
          velocityScale,
          particleAge,
          lineWidth,
          particleMultiplier,
          colorScale,
          devicePixelRatio
        } = layer.options;

        const context = this.context;
        const canvas = context.canvas;

        this.wind = new Windy({
          canvas: canvas,
          data: layer.getData(),
          projection,
          minVelocity,
          maxVelocity,
          velocityScale,
          particleAge,
          lineWidth,
          particleMultiplier,
          colorScale,
          devicePixelRatio: devicePixelRatio
        });
        this.wind.start(extent[0], extent[1], extent[2], extent[3]);
      } else {
        return true;
      }
    } else {
      return false;
    }

    return !!this.wind;
  }

  renderFrame (frameState, target) {
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

    if (canvas.width !== width || canvas.height !== height) {
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

    this.preRender(context, frameState);

    const extent = this._getExtent(frameState);

    if (this.wind && extent) this.wind.start(extent[0], extent[1], extent[2], extent[3]);

    this.postRender(context, frameState);

    if (clipped) {
      context.restore();
    }

    if (canvasTransform !== canvas.style.transform) {
      canvas.style.transform = canvasTransform;
    }

    return this.container;
  }

  _getExtent (frameState) {
    const size = frameState.size;
    const extent = frameState.extent;
    const viewState = frameState.viewState;
    if (!extent || !viewState || !size) return false;
    const ex = transformExtent(extent, viewState.projection, 'EPSG:4326');
    return [
      [[0, 0], [size[0], size[1]]],
      size[0], size[1],
      [[ex[0], ex[1]], [ex[2], ex[3]]]
    ];
  }

  getLayer () {
    return super.getLayer();
  }
}
