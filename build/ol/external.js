let exportsLibs = [];

if (process.env.NODE_ENV === 'demo') {
  exportsLibs = [];
} else {
  exportsLibs = [
    'ol',
    'ol/layer',
    'ol/source',
    'ol/proj'
  ];
}

module.exports = exportsLibs;
