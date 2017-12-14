/*!
 * wind-layer v0.0.0
 * LICENSE : MIT
 * (c) 2017-2017 https://sakitam-fdd.github.io/wind-layer
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('openlayers')) :
	typeof define === 'function' && define.amd ? define(['openlayers'], factory) :
	(global.WindLayer = factory(global.ol));
}(this, (function (ol) { 'use strict';

ol = ol && ol.hasOwnProperty('default') ? ol['default'] : ol;

var Windy = function Windy(params) {
  var VELOCITY_SCALE = 0.005 * (Math.pow(window.devicePixelRatio, 1 / 3) || 1);
  var MIN_TEMPERATURE_K = 261.15;
  var MAX_TEMPERATURE_K = 317.15;
  var MAX_PARTICLE_AGE = 90;
  var PARTICLE_LINE_WIDTH = 1;
  var PARTICLE_MULTIPLIER = 1 / 200;
  var PARTICLE_REDUCTION = Math.pow(window.devicePixelRatio, 1 / 3) || 1.6;
  var FRAME_RATE = 15,
      FRAME_TIME = 1000 / FRAME_RATE;

  var NULL_WIND_VECTOR = [NaN, NaN, null];

  var builder;
  var grid;
  var date;
  var λ0, φ0, Δλ, Δφ, ni, nj;

  var bilinearInterpolateVector = function bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
    var rx = 1 - x;
    var ry = 1 - y;
    var a = rx * ry,
        b = x * ry,
        c = rx * y,
        d = x * y;
    var u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    var v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
    var tmp = g00[2] * a + g10[2] * b + g01[2] * c + g11[2] * d;
    return [u, v, tmp];
  };

  var createWindBuilder = function createWindBuilder(uComp, vComp, temp) {
    var uData = uComp.data,
        vData = vComp.data;
    return {
      header: uComp.header,

      data: function data(i) {
        return [uData[i], vData[i], temp.data[i]];
      },
      interpolate: bilinearInterpolateVector
    };
  };

  var createBuilder = function createBuilder(data) {
    var uComp = null,
        vComp = null,
        temp = null;

    data.forEach(function (record) {
      switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
        case "2,2":
          uComp = record;break;
        case "2,3":
          vComp = record;break;
        case "0,0":
          temp = record;break;
        default:
          
      }
    });

    return createWindBuilder(uComp, vComp, temp);
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
    var H = Math.pow(10, -5.2);
    var hλ = λ < 0 ? H : -H;
    var hφ = φ < 0 ? H : -H;

    var pλ = project(φ, λ + hλ, windy);
    var pφ = project(φ + hφ, λ, windy);

    var k = Math.cos(φ / 360 * τ);
    return [(pλ[0] - x) / hλ / k, (pλ[1] - y) / hλ / k, (pφ[0] - x) / hφ, (pφ[1] - y) / hφ];
  };

  var createField = function createField(columns, bounds, callback) {
    function field(x, y) {
      if (!columns) return [NaN, NaN, null];
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
    var yMax = Math.min(Math.ceil(lowerRight[1], height), height - 1);
    return { x: x, y: y, xMax: width, yMax: yMax, width: width, height: height };
  };

  var deg2rad = function deg2rad(deg) {
    return deg / 180 * Math.PI;
  };

  var rad2deg = function rad2deg(ang) {
    return ang / (Math.PI / 180.0);
  };

  var invert = function invert(x, y, windy) {
    var mapLonDelta = windy.east - windy.west;
    var worldMapRadius = windy.width / rad2deg(mapLonDelta) * 360 / (2 * Math.PI);
    var mapOffsetY = worldMapRadius / 2 * Math.log((1 + Math.sin(windy.south)) / (1 - Math.sin(windy.south)));
    var equatorY = windy.height + mapOffsetY;
    var a = (equatorY - y) / worldMapRadius;

    var lat = 180 / Math.PI * (2 * Math.atan(Math.exp(a)) - Math.PI / 2);
    var lon = rad2deg(windy.west) + x / windy.width * rad2deg(mapLonDelta);
    return [lon, lat];
  };

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
    var velocityScale = VELOCITY_SCALE * Math.pow(mapArea, 0.3);

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

    for (; x < bounds.width; x += 2) {
      interpolateColumn(x);
    }
    createField(columns, bounds, callback);
  };

  var particles, animationLoop;
  var animate = function animate(bounds, field, extent) {

    function windTemperatureColorScale(minTemp, maxTemp) {

      var result = ["rgb(36,104, 180)", "rgb(60,157, 194)", "rgb(128,205,193 )", "rgb(151,218,168 )", "rgb(198,231,181)", "rgb(238,247,217)", "rgb(255,238,159)", "rgb(252,217,125)", "rgb(255,182,100)", "rgb(252,150,75)", "rgb(250,112,52)", "rgb(245,64,32)", "rgb(237,45,28)", "rgb(220,24,32)", "rgb(180,0,35)"];
      result.indexFor = function (m) {
        return Math.max(0, Math.min(result.length - 1, Math.round((m - minTemp) / (maxTemp - minTemp) * (result.length - 1))));
      };
      return result;
    }

    var colorStyles = windTemperatureColorScale(MIN_TEMPERATURE_K, MAX_TEMPERATURE_K);
    var buckets = colorStyles.map(function () {
      return [];
    });
    var mapArea = (extent.south - extent.north) * (extent.west - extent.east);
    var particleCount = Math.round(bounds.width * bounds.height * PARTICLE_MULTIPLIER * Math.pow(mapArea, 0.24));
    if (isMobile()) {
      particleCount /= PARTICLE_REDUCTION;
    }

    particles = particles || [];
    if (particles.length > particleCount) particles = particles.slice(0, particleCount);
    for (var i = particles.length; i < particleCount; i++) {
      particles.push(field.randomize({ age: ~~(Math.random() * MAX_PARTICLE_AGE) + 0 }));
    }

    function evolve() {
      buckets.forEach(function (bucket) {
        bucket.length = 0;
      });
      particles.forEach(function (particle) {
        if (particle.age > MAX_PARTICLE_AGE) {
          field.randomize(particle).age = ~~(Math.random() * MAX_PARTICLE_AGE / 2);
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
          if (field(xt, yt)[0] !== null) {
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

    function draw() {
      g.save();
      g.globalAlpha = .16;
      g.globalCompositeOperation = 'destination-out';
      g.fillStyle = '#000';
      g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      g.restore();

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

    buildGrid(params.data, function (grid) {
      interpolateField(grid, buildBounds(bounds, width, height), mapBounds, function (bounds, field) {
        windy.field = field;
        animate(bounds, field, mapBounds);
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
    interpolatePoint: interpolate
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

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var getTarget = function getTarget(selector) {
  var dom = function () {
    var found = void 0;
    return document && /^#([\w-]+)$/.test(selector) ? (found = document.getElementById(RegExp.$1)) ? [found] : [] : Array.prototype.slice.call(/^\.([\w-]+)$/.test(selector) ? document.getElementsByClassName(RegExp.$1) : /^[\w-]+$/.test(selector) ? document.getElementsByTagName(selector) : document.querySelectorAll(selector));
  }();
  return dom;
};

var WindyLayer = function () {
  function WindyLayer(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, WindyLayer);

    this.$options = options;

    this.$canvas = null;

    this.$data = data;
  }

  WindyLayer.prototype.getData = function getData() {
    return this.$data;
  };

  WindyLayer.prototype.setData = function setData(data) {
    this.$data = data;
    this.render();
    return this;
  };

  WindyLayer.prototype.initLayer = function initLayer() {
    if (!this.$container) {
      this._createLayerContainer(this.$Map, this.$options);
      this._resizeContainer();
    }
  };

  WindyLayer.prototype.render = function render() {
    if (!this.$canvas) {
      this.initLayer();
      this.$Windy = new Windy({
        canvas: this.$canvas,
        data: this.getData(),
        onDraw: function onDraw() {}
      });
      this.$Windy.start.apply(this.$Windy, this.getExtent());
    } else {
      this.$Windy.start.apply(this.$Windy, this.getExtent());
    }
    return this;
  };

  WindyLayer.prototype.appendTo = function appendTo(map) {
    if (map && map instanceof ol.Map) {
      this.$Map = map;
      this.$Map.once('postrender', this.render, this);
      this.$Map.renderSync();
      this._unRegisterEvents();
      this._registerEvents();
    } else {
      throw new Error('not map object');
    }
  };

  WindyLayer.prototype.getExtent = function getExtent() {
    var size = this.$Map.getSize();
    var extent = this.$Map.getView().calculateExtent(size);
    return [[[0, 0], [size[0], size[1]]], size[0], size[1], [[extent[0], extent[1]], [extent[2], extent[3]]]];
  };

  WindyLayer.prototype.onResize = function onResize() {
    this._resizeContainer();
    this.render();
  };

  WindyLayer.prototype.onZoomEnd = function onZoomEnd() {
    
  };

  WindyLayer.prototype.onDragRotateEnd = function onDragRotateEnd() {
    
  };

  WindyLayer.prototype.onMoveStart = function onMoveStart() {
    
  };

  WindyLayer.prototype.onMoveEnd = function onMoveEnd() {
    
  };

  WindyLayer.prototype.onCenterChange = function onCenterChange() {};

  WindyLayer.prototype._registerEvents = function _registerEvents() {
    var Map = this.$Map;
    var view = Map.getView();
    Map.on('change:size', this.onResize, this);
    view.on('change:resolution', this.onZoomEnd, this);
    view.on('change:center', this.onCenterChange, this);
    view.on('change:rotation', this.onDragRotateEnd, this);
    Map.on('movestart', this.onMoveStart, this);
    Map.on('moveend', this.onMoveEnd, this);
  };

  WindyLayer.prototype._unRegisterEvents = function _unRegisterEvents() {
    var Map = this.$Map;
    var view = Map.getView();
    Map.un('change:size', this.onResize, this);
    view.un('change:resolution', this.onZoomEnd, this);
    view.un('change:center', this.onCenterChange, this);
    view.un('change:rotation', this.onDragRotateEnd, this);
    Map.un('movestart', this.onMoveStart, this);
    Map.un('moveend', this.onMoveEnd, this);
  };

  WindyLayer.prototype._clearWind = function _clearWind() {
    if (this.$Windy) this.$Windy.stop();
  };

  WindyLayer.prototype._createLayerContainer = function _createLayerContainer(map, options) {
    var container = this.$canvas = this.$container = document.createElement('canvas');
    container.style.position = 'absolute';
    container.style.top = 0;
    container.style.left = 0;
    container.style.right = 0;
    container.style.bottom = 0;
    var _target = getTarget(options['target']);
    if (_target && _target[0] && _target[0] instanceof Element) {
      _target[0].appendChild(container);
    } else {
      var _target2 = getTarget('.ol-overlaycontainer');
      if (_target2 && _target2[0] && _target2[0] instanceof Element) {
        _target2[0].appendChild(container);
      } else {
        map.getViewport().appendChild(container);
      }
    }
  };

  WindyLayer.prototype._resizeContainer = function _resizeContainer() {
    var size = this.$Map.getSize();
    this.$container.style.height = size[1] + 'px';
    this.$container.style.width = size[0] + 'px';
  };

  return WindyLayer;
}();

return WindyLayer;

})));
//# sourceMappingURL=windLayer.js.map
