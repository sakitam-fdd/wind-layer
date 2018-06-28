/*!
 * author: FDD <smileFDD@gmail.com> 
 * wind-layer v0.0.5
 * build-time: 2018-6-27 22:3
 * LICENSE: MIT
 * (c) 2017-2018 https://sakitam-fdd.github.io/wind-layer
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.windLayer = factory());
}(this, (function () { 'use strict';

var Windy = function Windy(params) {
  if (!params.projection) params.projection = 'EPSG:4326';
  var MIN_VELOCITY_INTENSITY = params.minVelocity || 0;
  var MAX_VELOCITY_INTENSITY = params.maxVelocity || 10;
  var VELOCITY_SCALE = (params.velocityScale || 0.005) * (Math.pow(window.devicePixelRatio, 1 / 3) || 1);
  var MAX_PARTICLE_AGE = params.particleAge || 90;
  var PARTICLE_LINE_WIDTH = params.lineWidth || 1;
  var PARTICLE_MULTIPLIER = params.particleMultiplier || 1 / 300;
  var PARTICLE_REDUCTION = Math.pow(window.devicePixelRatio, 1 / 3) || 1.6;
  var FRAME_RATE = params.frameRate || 15,
      FRAME_TIME = 1000 / FRAME_RATE;

  var defaulColorScale = ["rgb(36,104, 180)", "rgb(60,157, 194)", "rgb(128,205,193 )", "rgb(151,218,168 )", "rgb(198,231,181)", "rgb(238,247,217)", "rgb(255,238,159)", "rgb(252,217,125)", "rgb(255,182,100)", "rgb(252,150,75)", "rgb(250,112,52)", "rgb(245,64,32)", "rgb(237,45,28)", "rgb(220,24,32)", "rgb(180,0,35)"];

  var colorScale = params.colorScale || defaulColorScale;

  var NULL_WIND_VECTOR = [NaN, NaN, null];

  var builder;
  var grid;
  var gridData = params.data;
  var date;
  var λ0, φ0, Δλ, Δφ, ni, nj;

  var setData = function setData(data) {
    gridData = data;
  };

  var bilinearInterpolateVector = function bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
    var rx = 1 - x;
    var ry = 1 - y;
    var a = rx * ry,
        b = x * ry,
        c = rx * y,
        d = x * y;
    var u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    var v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
    return [u, v, Math.sqrt(u * u + v * v)];
  };

  var createWindBuilder = function createWindBuilder(uComp, vComp) {
    var uData = uComp.data,
        vData = vComp.data;
    return {
      header: uComp.header,

      data: function data(i) {
        return [uData[i], vData[i]];
      },
      interpolate: bilinearInterpolateVector
    };
  };

  var createBuilder = function createBuilder(data) {
    var uComp = null,
        vComp = null;

    data.forEach(function (record) {
      switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
        case "1,2":
        case "2,2":
          uComp = record;
          break;
        case "1,3":
        case "2,3":
          vComp = record;
          break;
        default:

      }
    });

    return createWindBuilder(uComp, vComp);
  };

  var buildGrid = function buildGrid(data, callback) {

    builder = createBuilder(data);
    var header = builder.header;

    λ0 = header.lo1;
    φ0 = header.la1;

    Δλ = header.dx;
    Δφ = header.dy;

    ni = header.nx;
    nj = header.ny;

    date = new Date(header.refTime);
    date.setHours(date.getHours() + header.forecastTime);

    grid = [];
    var p = 0;
    var isContinuous = Math.floor(ni * Δλ) >= 360;

    for (var j = 0; j < nj; j++) {
      var row = [];
      for (var i = 0; i < ni; i++, p++) {
        row[i] = builder.data(p);
      }
      if (isContinuous) {
        row.push(row[0]);
      }
      grid[j] = row;
    }

    callback({
      date: date,
      interpolate: interpolate
    });
  };

  var interpolate = function interpolate(λ, φ) {

    if (!grid) return null;

    var i = floorMod(λ - λ0, 360) / Δλ;
    var j = (φ0 - φ) / Δφ;

    var fi = Math.floor(i),
        ci = fi + 1;
    var fj = Math.floor(j),
        cj = fj + 1;

    var row;
    if (row = grid[fj]) {
      var g00 = row[fi];
      var g10 = row[ci];
      if (isValue(g00) && isValue(g10) && (row = grid[cj])) {
        var g01 = row[fi];
        var g11 = row[ci];
        if (isValue(g01) && isValue(g11)) {
          return builder.interpolate(i - fi, j - fj, g00, g10, g01, g11);
        }
      }
    }
    return null;
  };

  var isValue = function isValue(x) {
    return x !== null && x !== undefined;
  };

  var floorMod = function floorMod(a, n) {
    return a - n * Math.floor(a / n);
  };

  var isMobile = function isMobile() {
    return (/android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i.test(navigator.userAgent)
    );
  };

  var distort = function distort(projection, λ, φ, x, y, scale, wind, windy) {
    var u = wind[0] * scale;
    var v = wind[1] * scale;
    var d = distortion(projection, λ, φ, x, y, windy);

    wind[0] = d[0] * u + d[2] * v;
    wind[1] = d[1] * u + d[3] * v;
    return wind;
  };

  var distortion = function distortion(projection, λ, φ, x, y, windy) {
    var τ = 2 * Math.PI;

    var H = params.projection === 'EPSG:4326' ? 5 : Math.pow(10, -5.2);
    var hλ = λ < 0 ? H : -H;
    var hφ = φ < 0 ? H : -H;

    var pλ = project(φ, λ + hλ, windy);
    var pφ = project(φ + hφ, λ, windy);

    var k = Math.cos(φ / 360 * τ);
    return [(pλ[0] - x) / hλ / k, (pλ[1] - y) / hλ / k, (pφ[0] - x) / hφ, (pφ[1] - y) / hφ];
  };

  var createField = function createField(columns, bounds, callback) {
    function field(x, y) {
      var column = columns[Math.round(x)];
      return column && column[Math.round(y)] || NULL_WIND_VECTOR;
    }

    field.release = function () {
      columns = [];
    };

    field.randomize = function (o) {
      var x, y;
      var safetyNet = 0;
      do {
        x = Math.round(Math.floor(Math.random() * bounds.width) + bounds.x);
        y = Math.round(Math.floor(Math.random() * bounds.height) + bounds.y);
      } while (field(x, y)[2] === null && safetyNet++ < 30);
      o.x = x;
      o.y = y;
      return o;
    };

    callback(bounds, field);
  };

  var buildBounds = function buildBounds(bounds, width, height) {
    var upperLeft = bounds[0];
    var lowerRight = bounds[1];
    var x = Math.round(upperLeft[0]);
    var y = Math.max(Math.floor(upperLeft[1], 0), 0);
    var xMax = Math.min(Math.ceil(lowerRight[0], width), width - 1);
    var yMax = Math.min(Math.ceil(lowerRight[1], height), height - 1);
    return { x: x, y: y, xMax: width, yMax: yMax, width: width, height: height };
  };

  var deg2rad = function deg2rad(deg) {
    return deg / 180 * Math.PI;
  };

  var rad2deg = function rad2deg(ang) {
    return ang / (Math.PI / 180.0);
  };

  var invert;

  if (params.projection === 'EPSG:4326') {
    invert = function invert(x, y, windy) {
      var mapLonDelta = windy.east - windy.west;
      var mapLatDelta = windy.south - windy.north;
      var lat = rad2deg(windy.north) + y / windy.height * rad2deg(mapLatDelta);
      var lon = rad2deg(windy.west) + x / windy.width * rad2deg(mapLonDelta);
      return [lon, lat];
    };
  } else {
    invert = function invert(x, y, windy) {
      var mapLonDelta = windy.east - windy.west;
      var worldMapRadius = windy.width / rad2deg(mapLonDelta) * 360 / (2 * Math.PI);
      var mapOffsetY = worldMapRadius / 2 * Math.log((1 + Math.sin(windy.south)) / (1 - Math.sin(windy.south)));
      var equatorY = windy.height + mapOffsetY;
      var a = (equatorY - y) / worldMapRadius;
      var lat = 180 / Math.PI * (2 * Math.atan(Math.exp(a)) - Math.PI / 2);
      var lon = rad2deg(windy.west) + x / windy.width * rad2deg(mapLonDelta);
      return [lon, lat];
    };
  }

  var mercY = function mercY(lat) {
    return Math.log(Math.tan(lat / 2 + Math.PI / 4));
  };

  var project = function project(lat, lon, windy) {
    var ymin = mercY(windy.south);
    var ymax = mercY(windy.north);
    var xFactor = windy.width / (windy.east - windy.west);
    var yFactor = windy.height / (ymax - ymin);

    var y = mercY(deg2rad(lat));
    var x = (deg2rad(lon) - windy.west) * xFactor;
    var y = (ymax - y) * yFactor;
    return [x, y];
  };

  var interpolateField = function interpolateField(grid, bounds, extent, callback) {

    var projection = {};
    var mapArea = (extent.south - extent.north) * (extent.west - extent.east);
    var velocityScale = VELOCITY_SCALE * Math.pow(mapArea, 0.4);

    var columns = [];
    var x = bounds.x;

    function interpolateColumn(x) {
      var column = [];
      for (var y = bounds.y; y <= bounds.yMax; y += 2) {
        var coord = invert(x, y, extent);
        if (coord) {
          var λ = coord[0],
              φ = coord[1];
          if (isFinite(λ)) {
            var wind = grid.interpolate(λ, φ);
            if (wind) {
              wind = distort(projection, λ, φ, x, y, velocityScale, wind, extent);
              column[y + 1] = column[y] = wind;
            }
          }
        }
      }
      columns[x + 1] = columns[x] = column;
    }

    (function batchInterpolate() {
      var start = Date.now();
      while (x < bounds.width) {
        interpolateColumn(x);
        x += 2;
        if (Date.now() - start > 1000) {
          setTimeout(batchInterpolate, 25);
          return;
        }
      }
      createField(columns, bounds, callback);
    })();
  };

  var animationLoop;
  var animate = function animate(bounds, field) {

    function windIntensityColorScale(min, max) {

      colorScale.indexFor = function (m) {
        return Math.max(0, Math.min(colorScale.length - 1, Math.round((m - min) / (max - min) * (colorScale.length - 1))));
      };

      return colorScale;
    }

    var colorStyles = windIntensityColorScale(MIN_VELOCITY_INTENSITY, MAX_VELOCITY_INTENSITY);
    var buckets = colorStyles.map(function () {
      return [];
    });

    var particleCount = Math.round(bounds.width * bounds.height * PARTICLE_MULTIPLIER);
    if (isMobile()) {
      particleCount *= PARTICLE_REDUCTION;
    }

    var fadeFillStyle = "rgba(0, 0, 0, 0.97)";

    var particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push(field.randomize({ age: Math.floor(Math.random() * MAX_PARTICLE_AGE) + 0 }));
    }

    function evolve() {
      buckets.forEach(function (bucket) {
        bucket.length = 0;
      });
      particles.forEach(function (particle) {
        if (particle.age > MAX_PARTICLE_AGE) {
          field.randomize(particle).age = 0;
        }
        var x = particle.x;
        var y = particle.y;
        var v = field(x, y);
        var m = v[2];
        if (m === null) {
          particle.age = MAX_PARTICLE_AGE;
        } else {
          var xt = x + v[0];
          var yt = y + v[1];
          if (field(xt, yt)[2] !== null) {
            particle.xt = xt;
            particle.yt = yt;
            buckets[colorStyles.indexFor(m)].push(particle);
          } else {
            particle.x = xt;
            particle.y = yt;
          }
        }
        particle.age += 1;
      });
    }

    var g = params.canvas.getContext("2d");
    g.lineWidth = PARTICLE_LINE_WIDTH;
    g.fillStyle = fadeFillStyle;
    g.globalAlpha = 0.6;

    function draw() {
      var prev = "lighter";
      g.globalCompositeOperation = "destination-in";
      g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      g.globalCompositeOperation = prev;
      g.globalAlpha = 0.9;

      buckets.forEach(function (bucket, i) {
        if (bucket.length > 0) {
          g.beginPath();
          g.strokeStyle = colorStyles[i];
          bucket.forEach(function (particle) {
            g.moveTo(particle.x, particle.y);
            g.lineTo(particle.xt, particle.yt);
            particle.x = particle.xt;
            particle.y = particle.yt;
          });
          g.stroke();
        }
      });
    }

    var then = Date.now();
    (function frame() {
      animationLoop = requestAnimationFrame(frame);
      var now = Date.now();
      var delta = now - then;
      if (delta > FRAME_TIME) {
        then = now - delta % FRAME_TIME;
        evolve();
        draw();
      }
    })();
  };

  var updateData = function updateData(data, bounds, width, height, extent) {
    delete params.data;
    params.data = data;
    if (extent) start(bounds, width, height, extent);
  };

  var start = function start(bounds, width, height, extent) {
    var mapBounds = {
      south: deg2rad(extent[0][1]),
      north: deg2rad(extent[1][1]),
      east: deg2rad(extent[1][0]),
      west: deg2rad(extent[0][0]),
      width: width,
      height: height
    };

    stop();

    buildGrid(gridData, function (grid) {
      interpolateField(grid, buildBounds(bounds, width, height), mapBounds, function (bounds, field) {
        windy.field = field;
        animate(bounds, field);
      });
    });
  };

  var stop = function stop() {
    if (windy.field) windy.field.release();
    if (animationLoop) cancelAnimationFrame(animationLoop);
  };

  var shift = function shift(dx, dy) {
    var canvas = params.canvas,
        w = canvas.width,
        h = canvas.height,
        ctx = canvas.getContext("2d");
    if (w > dx && h > dy) {
      var clamp = function clamp(high, value) {
        return Math.max(0, Math.min(high, value));
      };
      var imageData = ctx.getImageData(clamp(w, -dx), clamp(h, -dy), clamp(w, w - dx), clamp(h, h - dy));
      ctx.clearRect(0, 0, w, h);
      ctx.putImageData(imageData, clamp(w, dx), clamp(h, dy));
      for (var i = 0, pLength = particles.length; i < pLength; i++) {
        particles[i].x += dx;
        particles[i].y += dy;
      }
    }
  };

  var windy = {
    params: params,
    start: start,
    stop: stop,
    update: updateData,
    shift: shift,
    createField: createField,
    interpolatePoint: interpolate,
    setData: setData
  };

  return windy;
};

window.requestAnimationFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    return window.setTimeout(callback, 1000 / FRAME_RATE);
  };
}();

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
}

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

var global$1 = typeof window === 'undefined' ? {} : window;
var ol = global$1.ol || {};

if (!ol.layer) ol.layer = {};
if (!ol.layer.Image) ol.layer.Image = function () {
  function _class() {
    classCallCheck(this, _class);
  }

  return _class;
}();

var OlWind = function (_ol$layer$Image) {
  inherits(OlWind, _ol$layer$Image);

  function OlWind(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, OlWind);

    var _this = possibleConstructorReturn(this, _ol$layer$Image.call(this, options));

    _this._canvas = null;

    _this.data = data;

    _this.$Windy = null;

    _this.isClear = false;

    _this.options = options;
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

  OlWind.prototype.getData = function getData() {
    return this.data;
  };

  OlWind.prototype.setData = function setData(data) {
    var _map = this.getMap();
    if (!_map) return this;
    this.data = data;
    this.isClear = false;
    if (!this.$Windy && this._canvas) {
      this.render(this._canvas);
      _map.renderSync();
    } else if (this.$Windy && this._canvas) {
      if (this._cloneLayer) {
        _map.addLayer(this._cloneLayer);
        delete this._cloneLayer;
      }
      var extent = this._getExtent();
      this.$Windy.update(this.getData(), extent[0], extent[1], extent[2], extent[3]);
    } else {
      console.warn('please create new instance');
    }
    return this;
  };

  OlWind.prototype.render = function render(canvas) {
    var extent = this._getExtent();
    if (this.isClear || !this.getData() || !extent) return this;
    if (canvas && !this.$Windy) {
      this.$Windy = new Windy({
        canvas: canvas,
        projection: this.get('projection'),
        data: this.getData()
      });
      this.$Windy.start(extent[0], extent[1], extent[2], extent[3]);
    } else if (canvas && this.$Windy) {
      var _extent2 = this._getExtent();
      this.$Windy.start(_extent2[0], _extent2[1], _extent2[2], _extent2[3]);
    }
    return this;
  };

  OlWind.prototype.redraw = function redraw() {
    if (this.isClear) return;
    var _extent = this.options.extent || this._getMapExtent();
    this.setExtent(_extent);
  };

  OlWind.prototype.canvasFunction = function canvasFunction(extent, resolution, pixelRatio, size, projection) {
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

  OlWind.prototype._getExtent = function _getExtent() {
    var size = this._getMapSize();
    var _extent = this._getMapExtent();
    if (size && _extent) {
      var _projection = this.get('projection');
      var extent = ol.proj.transformExtent(_extent, _projection, 'EPSG:4326');
      return [[[0, 0], [size[0], size[1]]], size[0], size[1], [[extent[0], extent[1]], [extent[2], extent[3]]]];
    } else {
      return false;
    }
  };

  OlWind.prototype._getMapExtent = function _getMapExtent() {
    if (!this.getMap()) return;
    var size = this._getMapSize();
    var _view = this.getMap().getView();
    return _view && _view.calculateExtent(size);
  };

  OlWind.prototype._getMapSize = function _getMapSize() {
    if (!this.getMap()) return;
    return this.getMap().getSize();
  };

  OlWind.prototype.appendTo = function appendTo(map) {
    if (map && map instanceof ol.Map) {
      this.set('originMap', map);
      map.addLayer(this);
    } else {
      throw new Error('not map object');
    }
  };

  OlWind.prototype.clearWind = function clearWind() {
    var _map = this.getMap();
    if (!_map) return;
    if (this.$Windy) this.$Windy.stop();
    this.isClear = true;
    this._cloneLayer = this;
    _map.removeLayer(this);
    this.changed();
    this.getMap().renderSync();
  };

  OlWind.prototype.removeLayer = function removeLayer() {
    var _map = this.getMap();
    if (!_map) return;
    if (this.$Windy) this.$Windy.stop();
    this.un('precompose', this.redraw, this);
    _map.removeLayer(this);
    delete this._canvas;
    delete this.$Windy;
    delete this._cloneLayer;
  };

  OlWind.prototype.setMap = function setMap(map) {
    this.set('originMap', map);
  };

  OlWind.prototype.getMap = function getMap() {
    return this.get('originMap');
  };

  return OlWind;
}(ol.layer.Image);

var global$2 = typeof window === 'undefined' ? {} : window;
var AMap = global$2.AMap || {};

var AMapWind = function () {
  function AMapWind(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, AMapWind);

    this.options = options;

    this.canvas = null;

    this.data = data;

    this.layer_ = null;

    this._windy = null;

    if (options.map) {
      this.appendTo(options.map);
    }
  }

  AMapWind.prototype.appendTo = function appendTo(map) {
    var _this = this;

    if (map) {
      map.on('complete', function () {
        _this.init(map);
      }, this);
    } else {
      throw new Error('not map object');
    }
  };

  AMapWind.prototype.getData = function getData() {
    return this.data;
  };

  AMapWind.prototype.init = function init(map, options) {
    if (map) {
      this.map = map;
      this.context = this.options.context || '2d';
      this.getCanvasLayer();
    } else {
      throw new Error('not map object');
    }
  };

  AMapWind.prototype.render = function render(canvas) {
    if (!canvas) return;
    var extent = this._getExtent();
    if (!this.getData() || !extent) return this;
    if (canvas && !this._windy) {
      this._windy = new Windy({
        canvas: canvas,
        data: this.getData(),
        'onDraw': function onDraw() {}
      });
      this._windy.start(extent[0], extent[1], extent[2], extent[3]);
    } else if (canvas && this._windy) {
      this._windy.start(extent[0], extent[1], extent[2], extent[3]);
    }
    return this;
  };

  AMapWind.prototype.getCanvasLayer = function getCanvasLayer() {
    if (!this.canvas && !this.layer_) {
      var canvas = this.canvasFunction();
      var bounds = this.map.getBounds();
      this.layer_ = new AMap.CanvasLayer({
        canvas: canvas,
        bounds: this.options.bounds || bounds,
        zooms: this.options.zooms || [0, 22]
      });
      this.map.on('mapmove', this.canvasFunction, this);
      this.map.on('zoomchange', this.canvasFunction, this);
      this.layer_.setMap(this.map);
    }
  };

  AMapWind.prototype.canvasFunction = function canvasFunction() {
    var _ref = [this.map.getSize().width, this.map.getSize().height],
        width = _ref[0],
        height = _ref[1];

    if (!this.canvas) {
      this.canvas = createCanvas(width, height, null);
    } else {
      this.canvas.width = width;
      this.canvas.height = height;
      var bounds = this.map.getBounds();
      if (this.layer_) {
        this.layer_.setBounds(this.options.bounds || bounds);
      }
    }
    this.render(this.canvas);
    return this.canvas;
  };

  AMapWind.prototype._getExtent = function _getExtent() {
    var _ref2 = [this.map.getSize().width, this.map.getSize().height],
        width = _ref2[0],
        height = _ref2[1];

    var _ne = this.map.getBounds().getNorthEast();
    var _sw = this.map.getBounds().getSouthWest();
    return [[[0, 0], [width, height]], width, height, [[_ne.lng, _ne.lat], [_sw.lng, _sw.lat]]];
  };

  AMapWind.prototype.removeLayer = function removeLayer() {
    if (!this.map) return;
    this.map.removeLayer(this.layer_);
    delete this.map;
    delete this.layer_;
    delete this.canvas;
  };

  AMapWind.prototype.getContext = function getContext() {
    return this.canvas.getContext(this.context);
  };

  return AMapWind;
}();

var global$3 = typeof window === 'undefined' ? {} : window;

if (!global$3.BMap) global$3.BMap = {};

if (!global$3.BMap.Overlay) global$3.BMap.Overlay = function Overlay() {
  classCallCheck(this, Overlay);
};

var BaiduWind = function (_global$BMap$Overlay) {
  inherits(BaiduWind, _global$BMap$Overlay);

  function BaiduWind(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, BaiduWind);

    var _this = possibleConstructorReturn(this, _global$BMap$Overlay.call(this, options));

    _this.options = options;
    _this.paneName = _this.options.paneName || 'mapPane';
    _this.context = _this.options.context || '2d';
    _this.zIndex = _this.options.zIndex || 0;
    _this.mixBlendMode = _this.options.mixBlendMode || null;
    _this.enableMassClear = _this.options.enableMassClear;
    _this._map = options.map;
    _this._lastDrawTime = null;

    _this.canvas = null;

    _this.data = data;

    _this._windy = null;
    _this.show();
    return _this;
  }

  BaiduWind.prototype.getData = function getData() {
    return this.data;
  };

  BaiduWind.prototype._getExtent = function _getExtent() {
    var size = this._map.getSize();
    var _ne = this._map.getBounds().getNorthEast();
    var _sw = this._map.getBounds().getSouthWest();
    return [[[0, 0], [size.width, size.height]], size.width, size.height, [[_ne.lng, _ne.lat], [_sw.lng, _sw.lat]]];
  };

  BaiduWind.prototype.appendTo = function appendTo(map) {
    if (map) {
      map.addOverlay(this);
    } else {
      throw new Error('not map object');
    }
  };

  BaiduWind.prototype.initialize = function initialize(map) {
    var _this2 = this;

    this._map = map;
    var canvas = this.canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute; left:0; top:0; z-index: ' + this.zIndex + ' ;user-select:none;';
    canvas.style.mixBlendMode = this.mixBlendMode;
    this.adjustSize();
    map.getPanes()[this.paneName].appendChild(canvas);
    map.addEventListener('resize', function () {
      _this2.adjustSize();
      _this2._draw();
    });
    return this.canvas;
  };

  BaiduWind.prototype.adjustSize = function adjustSize() {
    var size = this._map.getSize();
    var canvas = this.canvas;
    var devicePixelRatio = this.devicePixelRatio = global$3.devicePixelRatio || 1;
    canvas.width = size.width * devicePixelRatio;
    canvas.height = size.height * devicePixelRatio;
    if (this.context === '2d') {
      canvas.getContext(this.context).scale(devicePixelRatio, devicePixelRatio);
    }
    canvas.style.width = size.width + 'px';
    canvas.style.height = size.height + 'px';
  };

  BaiduWind.prototype.draw = function draw() {
    var self = this;
    clearTimeout(self.timeoutID);
    self.timeoutID = setTimeout(function () {
      self._draw();
    }, 15);
  };

  BaiduWind.prototype._draw = function _draw() {
    var map = this._map;
    var size = map.getSize();
    var center = map.getCenter();
    if (center) {
      var pixel = map.pointToOverlayPixel(center);
      this.canvas.style.left = pixel.x - size.width / 2 + 'px';
      this.canvas.style.top = pixel.y - size.height / 2 + 'px';
      this.dispatchEvent('draw');
      this.options.update && this.options.update.call(this);
      this.render(this.canvas);
    }
  };

  BaiduWind.prototype.render = function render(canvas) {
    var extent = this._getExtent();
    if (!this.getData() || !extent) return this;
    if (canvas && !this._windy) {
      this._windy = new Windy({
        canvas: canvas,
        data: this.getData(),
        'onDraw': function onDraw() {}
      });
      this._windy.start(extent[0], extent[1], extent[2], extent[3]);
    } else if (canvas && this._windy) {
      this._windy.start(extent[0], extent[1], extent[2], extent[3]);
    }
    return this;
  };

  BaiduWind.prototype.getContainer = function getContainer() {
    return this.canvas;
  };

  BaiduWind.prototype.setZIndex = function setZIndex(zIndex) {
    this.zIndex = zIndex;
    this.canvas.style.zIndex = this.zIndex;
  };

  BaiduWind.prototype.getZIndex = function getZIndex() {
    return this.zIndex;
  };

  return BaiduWind;
}(global$3.BMap.Overlay);

var index = {
  AMapWind: AMapWind,
  BMapWind: BaiduWind,
  OlWind: OlWind
};

return index;

})));
//# sourceMappingURL=windLayer.js.map
