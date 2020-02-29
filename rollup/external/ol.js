export const external = [
  'ol',
  'ol/size',
  'ol/layer',
  'ol/PluggableMap',
  'ol/coordinate',
  'ol/proj',
  'ol/transform',
  'ol/extent',
  'ol/renderer/canvas/Layer',
  'ol/source/ImageCanvas',
];

export const globals = {
  'ol': 'ol',
  'ol/size': 'ol.size',
  'ol/layer': 'ol.layer',
  'ol/proj': 'ol.proj',
  'ol/source/ImageCanvas': 'ol.source.ImageCanvas',
  'ol/PluggableMap': 'ol.PluggableMap',
  'ol/coordinate': 'ol.coordinate',
  'ol/transform': 'ol.transform',
  'ol/extent': 'ol.extent',
  'ol/renderer/canvas/Layer': 'ol.renderer.canvas.ImageLayer', // CanvasLayer is not export
};
