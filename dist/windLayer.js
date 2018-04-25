/*!
 * author: FDD <smileFDD@gmail.com> 
 * wind-layer v0.0.5
 * build-time: 2018-4-25 21:16
 * LICENSE: MIT
 * (c) 2017-2018 https://sakitam-fdd.github.io/wind-layer
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('openlayers')) :
	typeof define === 'function' && define.amd ? define(['openlayers'], factory) :
	(global.WindLayer = factory(global.ol));
}(this, (function (ol) { 'use strict';

ol = ol && ol.hasOwnProperty('default') ? ol['default'] : ol;

if (typeof Object.assign !== 'function') {
  Object.defineProperty(Object, 'assign', {
    value: function assign(target, varArgs) {

      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      var to = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];
        if (nextSource != null) {
          for (var nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

var isMobile = function isMobile() {
  return (/android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i.test(navigator.userAgent)
  );
};

var createCanvas = function createCanvas(width, height, Canvas) {
  if (typeof document !== 'undefined') {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  } else {
    return new Canvas(width, height);
  }
};

var bind = function bind(fn, context) {
  var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
  return function () {
    return fn.apply(context, args || arguments);
  };
};

window.requestAnimFrame = function (fn, immediate, context, element) {
  var f = bind(fn, context);
  var request = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
  if (request) {
    return request.call(window, f, element);
  } else {
    if (immediate) {
      f();
    } else {
      return window.setTimeout(f, 16);
    }
  }
};

var getCancelAnimFrame = function getCancelAnimFrame() {
  var prefixs = ['webkit', 'moz', 'o', 'ms'];
  var func = window.cancelAnimationFrame;
  for (var i = 0, len = prefixs.length; i < len && !func; i++) {
    func = window[prefixs[i] + 'CancelAnimationFrame'] || window[prefixs[i] + 'CancelRequestAnimationFrame'];
  }
  return func;
};

window.cancelAnimFrame = function (id) {
  var cancel = getCancelAnimFrame();
  if (cancel) {
    cancel.call(window, id);
  } else {
    window.clearTimeout(id);
  }
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _options = {
  gridPixels: 4,
  gridMaxDivs: 200,
  gridReduceFactor: 2,
  fieldFactor: 0.8,
  fieldMaxIntensity: 50,
  maxParticleAge: 100,
  particleCountFactor: 0.05,
  lineWidth: 1.2,
  opacity: 1.0,
  colors: ['#fff', '#fff', '#fff', '#fff', '#fff'],
  searchSteps: 3,
  interpolateCount: 4,
  frameRate: 15
};

var NULL_WIND_VECTOR = [NaN, NaN, null];

var WindyLayer = function (_ol$layer$Image) {
  inherits(WindyLayer, _ol$layer$Image);

  function WindyLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, WindyLayer);

    var _this = possibleConstructorReturn(this, _ol$layer$Image.call(this, options));

    _this._options = Object.assign({}, _options, options);

    _this._canvas = null;

    _this.data = [];
    if (data) {
      _this.setData(data);
    }

    _this._grid = [];
    _this._dirty = true;

    _this._batches = [];

    _this._playing = false;

    _this._animationLoop = null;

    _this.isClear = false;
    _this.setSource(new ol.source.ImageCanvas({
      logo: options.logo,
      state: options.state,
      attributions: options.attributions,
      resolutions: options.resolutions,
      canvasFunction: _this.canvasFunction.bind(_this),
      projection: options.hasOwnProperty('projection') ? options.projection : 'EPSG:3857',
      ratio: options.hasOwnProperty('ratio') ? options.ratio : 1
    }));
    _this.on('precompose', _this.redraw, _this);
    return _this;
  }

  WindyLayer.prototype.getData = function getData() {
    return this.data;
  };

  WindyLayer.prototype.setData = function setData(data) {
    var _map = this.getMap();
    if (!_map) return this;
    var _ref = [data[0], data[1]],
        us = _ref[0],
        vs = _ref[1];
    var _ref2 = [us.header.nx, us.header.ny],
        cols = _ref2[0],
        rows = _ref2[1];

    var _projection = this.get('projection');
    for (var j = 0; j < rows; j++) {
      var lat = 90 - 180 * j / rows;
      if (Math.abs(lat) > 85.1) {
        continue;
      }
      for (var i = 0; i < cols; i++) {
        var lon = -180 + 360 * i / cols;
        var point = ol.proj.transform([lon, lat], _projection, 'EPSG:3857');
        var idx = cols * j + i;
        var u = us.data[idx];
        var v = vs.data[idx];
        this.addDataPoint(point[0], point[1], u, v);
      }
    }
    return this;
  };

  WindyLayer.prototype.addDataPoint = function addDataPoint(x, y, uid, value, feature) {
    uid = uid || 0;
    value = value || 0;
    var extent = [x, y, x, y];
    var data = {
      x: x,
      y: y,
      u: uid,
      v: value,
      bbox: extent
    };
    this.data.push(data);
  };

  WindyLayer.prototype.render = function render(canvas) {
    var extent = this._getExtent();
    if (this.isClear || !this.getData() || !extent) return this;
    if (!this.getData()) return this;
    if (canvas && !this._playing) {
      this.start();
    } else if (canvas && this._playing) {}
    return this;
  };

  WindyLayer.prototype.redraw = function redraw() {
    if (this.isClear) return;
    var _extent = this._options.extent || this._getExtent();
    this.setExtent(_extent);
  };

  WindyLayer.prototype.buildGrid = function buildGrid() {
    var map = this.getMap();
    if (!map || !this._dirty) {
      return;
    }
    var _size = map.getSize();
    var _extent = this._options.extent || this._getExtent();
    var dim = Math.max(_size[0], _size[1]);
    var gridDivs = Math.min(dim / this._options.gridPixels, this._options.gridMaxDivs);
    if (isMobile()) {
      gridDivs /= this._options.gridReduceFactor;
    }
    var gridSize = this._gridSize = Math.max(_extent[2] - _extent[0], _extent[3] - _extent[1]) / gridDivs;
    var count = this.data && this.data.length;
    var divCount = Math.sqrt(count) || 1;
    var expand = Math.max(_extent[2] - _extent[0], _extent[3] - _extent[1]) / divCount;

    this._gridColCount = Math.ceil((_extent[2] - _extent[0]) / gridSize);
    this._gridRowCount = Math.ceil((_extent[3] - _extent[1]) / gridSize);
    var grid = [];
    for (var j = 0; j < this._gridRowCount + 1; j++) {
      var y = _extent[1] + j * gridSize;
      if (y >= _extent[1] && y <= _extent[3]) {
        var row = [];
        for (var i = 0; i < this._gridColCount + 1; i++) {
          var x = _extent[0] + i * gridSize;
          row[i] = this._interpolate(x, y, [x - expand, y - expand, x + expand, y + expand]);
          var _count = 1;
          while (row[i][2] === null && _count <= this._options.searchSteps) {
            _count *= 2;
            var _expand = _count * expand;
            row[i] = this._interpolate(x, y, [x - _expand, y - _expand, x + _expand, y + _expand]);
          }
        }
        grid[j] = row;
      }
    }
    this._grid = grid;
    this._dirty = false;
  };

  WindyLayer.prototype.canvasFunction = function canvasFunction(extent, resolution, pixelRatio, size, projection) {
    if (!this._canvas) {
      this._canvas = createCanvas(size[0], size[1]);
    } else {
      this._canvas.width = size[0];
      this._canvas.height = size[1];
    }
    if (resolution <= this.get('maxResolution')) {
      this.render(this._canvas);
    } else {}
    return this._canvas;
  };

  WindyLayer.prototype.getContext = function getContext() {
    return this._canvas && this._canvas.getContext('2d');
  };

  WindyLayer.prototype._getExtent = function _getExtent() {
    if (!this.getMap()) return;
    var size = this._getMapSize();
    var _view = this.getMap().getView();
    return _view && _view.calculateExtent(size);
  };

  WindyLayer.prototype._getMapSize = function _getMapSize() {
    if (!this.getMap()) return;
    return this.getMap().getSize();
  };

  WindyLayer.prototype.appendTo = function appendTo(map) {
    if (map && map instanceof ol.Map) {
      this.set('originMap', map);
      map.addLayer(this);
    } else {
      throw new Error('not map object');
    }
  };

  WindyLayer.prototype.clearWind = function clearWind() {
    var _map = this.getMap();
    if (!_map) return;
    this.isClear = true;
    this._cloneLayer = this;
    _map.removeLayer(this);
    this.changed();
    this.getMap().renderSync();
  };

  WindyLayer.prototype.removeLayer = function removeLayer() {
    var _map = this.getMap();
    if (!_map) return;
    this.un('precompose', this.redraw, this);
    _map.removeLayer(this);
    delete this._canvas;
    delete this._cloneLayer;
  };

  WindyLayer.prototype.setMap = function setMap(map) {
    this.set('originMap', map);
  };

  WindyLayer.prototype.getMap = function getMap() {
    return this.get('originMap');
  };

  WindyLayer.prototype.start = function start() {
    var that = this;
    this.buildGrid();
    var then = Date.now();
    that._playing = true;
    (function frame() {
      that._animationLoop = window.requestAnimFrame(frame);
      var now = Date.now();
      var delta = now - then;
      if (delta > 1000 / that._options.frameRate) {
        then = now - delta % 1000 / that._options.frameRate;
        that._evolve();
        that._draw();
      }
    })();
    return this;
  };

  WindyLayer.prototype.stop = function stop() {
    this._playing = true;
    if (this._animationLoop) window.cancelAnimFrame(this._animationLoop);
    return this;
  };

  WindyLayer.prototype.clear = function clear(forbidRedraw) {
    this.particles = null;
    this._clearContext();
    this._dirty = true;
    return this;
  };

  WindyLayer.prototype.update = function update() {
    this._dirty = true;
    this._draw();
  };

  WindyLayer.prototype._clearContext = function _clearContext() {
    var context = this.getContext();
    context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  };

  WindyLayer.prototype._draw = function _draw() {
    var _this2 = this;

    var map = this.getMap();
    var context = this.getContext();
    if (this._dirty) {
      this._clearContext();
      if (this._playing) {
        setTimeout(function () {
          _this2.buildGrid();
          _this2._particles = null;
        }, 1000 / this._options.frameRate);
      }
    }
    if (this._playing) {
      if (!this._particles) {
        this._particles = [];
        var particleCount = this._gridColCount * this._gridRowCount * this._options.particleCountFactor;
        for (var i = 0; i < particleCount; i++) {
          this._particles.push(this._getParticle());
        }
      }
      this._evolve();
      if (!this._batches) {
        return;
      }

      context.save();
      context.globalAlpha = this.getOpacity() || 0.75;
      context.globalCompositeOperation = 'destination-out';
      context.fillStyle = '#000';
      context.fillRect(0, 0, this._canvas.width, this._canvas.height);
      context.restore();
      context.globalCompositeOperation = 'source-over';
      context.lineWidth = this._options.lineWidth;
      var extent = this._getExtent();
      var gridSize = this._gridSize;
      var particle = {};

      for (var _i = 0; _i < this._batches.length; _i++) {
        var batch = this._batches[_i];
        context.beginPath();
        context.strokeStyle = this._options.colors[_i];
        for (var j = 0; j < batch.length; j++) {
          particle = batch[j] || {};
          var x = extent[0] + gridSize * particle.x;
          var y = extent[1] + gridSize * particle.y;
          var xt = extent[0] + gridSize * particle.xt;
          var yt = extent[1] + gridSize * particle.yt;
          if (extent && (x < extent[0] || x > extent[2])) {
            continue;
          }
          var pixel = map.getPixelFromCoordinate([x, y]);
          context.moveTo(pixel[0], pixel[1]);
          pixel = map.getPixelFromCoordinate([xt, yt]);
          context.lineTo(pixel[0], pixel[1]);
          particle.x = particle.xt;
          particle.y = particle.yt;
        }
        context.stroke();
      }
    }
  };

  WindyLayer.prototype._getParticle = function _getParticle(age) {
    return {
      x: Math.round(Math.random() * this._gridColCount),
      y: Math.round(Math.random() * this._gridRowCount),
      age: age === undefined ? Math.floor(Math.random() * this._options.maxParticleAge) : age
    };
  };

  WindyLayer.prototype._getField = function _getField(x, y) {
    if (!this._grid) return NULL_WIND_VECTOR;
    var rows = this._grid[Math.round(y)];

    return rows && rows[Math.round(x)] || NULL_WIND_VECTOR;
  };

  WindyLayer.prototype._evolve = function _evolve() {
    var particles = this._particles;
    if (!particles) {
      return;
    }
    var batches = this._options.colors.map(function () {
      return [];
    });
    var fieldScale = this._options.fieldFactor / this._options.fieldMaxIntensity;
    var particle = void 0;
    for (var i = 0; i < particles.length; i++) {
      particle = particles[i];
      if (particle.age > this._options.maxParticleAge) {
        particle = this._getParticle(0);
      }
      var _ref3 = [particle.x, particle.y],
          x = _ref3[0],
          y = _ref3[1];

      var v = this._getField(x, y);
      if (!v[2]) {
        particle = this._getParticle(0);
      } else if (this._getField(x, y)[0] !== null) {
        particle.xt = x + v[0] * fieldScale;
        particle.yt = y + v[1] * fieldScale;
        batches[this._colorIndex(v[2])].push(particle);
      } else {
        particle.x = x + v[0] * fieldScale;
        particle.y = y + v[1] * fieldScale;
      }
      particle.age++;
    }
    this._batches = batches;
  };

  WindyLayer.prototype._interpolate = function _interpolate(x, y, searchExtent) {
    var searches = this.data;
    var Σux = 0,
        Σvx = 0,
        Σweight = 0;

    var dx, dy, dd, weight;
    var dataPoint, u, v;
    for (var i = 0, iLen = Math.min(this._options.interpolateCount, searches.length); i < iLen; i++) {
      dataPoint = searches[i];
      dx = dataPoint.x - x;
      dy = dataPoint.y - y;
      if (dx === 0 && dy === 0) {
        u = dataPoint.u;
        v = dataPoint.v;
        return [u, v, Math.sqrt(u * u + v * v)];
      }
      dd = dx * dx + dy * dy;
      weight = Math.sqrt(1 / dd);
      Σux += dataPoint.u * weight;
      Σvx += dataPoint.v * weight;
      Σweight += weight;
    }
    if (Σweight > 0) {
      u = Σux / Σweight;
      v = Σvx / Σweight;
      return [u, v, Math.sqrt(u * u + v * v)];
    }
    return NULL_WIND_VECTOR;
  };

  WindyLayer.prototype._colorIndex = function _colorIndex(m) {
    var fieldMaxIntensity = this._options.fieldMaxIntensity;
    return Math.floor(Math.min(m, fieldMaxIntensity) / fieldMaxIntensity * (this._options.colors.length - 1));
  };

  return WindyLayer;
}(ol.layer.Image);

return WindyLayer;

})));
//# sourceMappingURL=windLayer.js.map
