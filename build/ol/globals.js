
let exportsGlobals = {};

if (process.env.NODE_ENV === 'demo') {
  exportsGlobals = {};
} else {
  exportsGlobals = {
    'ol': 'ol',
    'ol/layer': 'ol.layer',
    'ol/source': 'ol.source',
    'ol/proj': 'ol.proj'
  };
}

module.exports = exportsGlobals;
