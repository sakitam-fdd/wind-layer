/*!
 * author: sakitam-fdd <smilefdd@gmail.com> 
 * wind-layer v0.1.0
 * build-time: 2019-5-25 22:8
 * LICENSE: MIT
 * (c) 2017-2019 https://sakitam-fdd.github.io/wind-layer
 */
/* eslint-disable */

/*  Global class for simulating the movement of particle through a 1km wind grid
 credit: All the credit for this work goes to: https://github.com/cambecc for creating the repo:
 https://github.com/cambecc/earth. The majority of this code is directly take nfrom there, since its awesome.
 This class takes a canvas element and an array of data (1km GFS from http://www.emc.ncep.noaa.gov/index.php?branch=GFS)
 and then uses a mercator (forward/reverse) projection to correctly map wind vectors in "map space".
 The "start" method takes the bounds of the map at its current extent and starts the whole gridding,
 interpolation and animation process.
 */

var Windy = function (params) {
  if ( params === void 0 ) params = {};

  this.params = params;
  var that = this;

  that.canvas = params.canvas;

  var defaulColorScale = [
    "rgb(36,104, 180)",
    "rgb(60,157, 194)",
    "rgb(128,205,193 )",
    "rgb(151,218,168 )",
    "rgb(198,231,181)",
    "rgb(238,247,217)",
    "rgb(255,238,159)",
    "rgb(252,217,125)",
    "rgb(255,182,100)",
    "rgb(252,150,75)",
    "rgb(250,112,52)",
    "rgb(245,64,32)",
    "rgb(237,45,28)",
    "rgb(220,24,32)",
    "rgb(180,0,35)"
  ];

  var buildParams = function(params) {
    if (!params.projection) { params.projection = 'EPSG:4326'; }
    that.MIN_VELOCITY_INTENSITY = params.minVelocity || 0;                      // velocity at which particle intensity is minimum (m/s)
    that.MAX_VELOCITY_INTENSITY = params.maxVelocity || 10;                     // velocity at which particle intensity is maximum (m/s)
    that.VELOCITY_SCALE = (params.velocityScale || 0.005) * (Math.pow(window.devicePixelRatio, 1 / 3) || 1); // scale for wind velocity (completely arbitrary--this value looks nice)
    that.MAX_PARTICLE_AGE = params.particleAge || 90;                         	 // max number of frames a particle is drawn before regeneration
    that.PARTICLE_LINE_WIDTH = params.lineWidth || 1;                           // line width of a drawn particle
    that.PARTICLE_MULTIPLIER = params.particleMultiplier || 1 / 300;            // particle count scalar (completely arbitrary--this values looks nice)
    that.PARTICLE_REDUCTION = (Math.pow(window.devicePixelRatio, 1 / 3) || 1.6);   // multiply particle count for mobiles by this amount
    that.FRAME_RATE = params.frameRate || 16;
    that.COLOR_SCALE = params.colorScale || defaulColorScale;
  };

  buildParams(params);

  window.FRAME_TIME = 1000 / that.FRAME_RATE;   // desired frames per second

  var NULL_WIND_VECTOR = [NaN, NaN, null];  // singleton for no wind in the form: [u, v, magnitude]

  var builder;
  var grid;
  var gridData = that.params.data;
  var date;
  var λ0, φ0, Δλ, Δφ, ni, nj;

  var setData = function (data) {
    gridData = data;
  };

  // interpolation for vectors like wind (u,v,m)
  var bilinearInterpolateVector = function (x, y, g00, g10, g01, g11) {
    var rx = (1 - x);
    var ry = (1 - y);
    var a = rx * ry, b = x * ry, c = rx * y, d = x * y;
    var u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
    var v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
    return [u, v, Math.sqrt(u * u + v * v)];
  };


  var createWindBuilder = function (uComp, vComp) {
    var uData = uComp.data, vData = vComp.data;
    return {
      header: uComp.header,
      //recipe: recipeFor("wind-" + uComp.header.surface1Value),
      data: function (i) {
        return [uData[i], vData[i]];
      },
      interpolate: bilinearInterpolateVector
    }
  };

  var createBuilder = function (data) {
    var uComp = null, vComp = null;

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

  var buildGrid = function (data, callback) {

    builder = createBuilder(data);
    var header = builder.header;

    λ0 = header.lo1;
    φ0 = Math.max(header.la2, header.la1);  // the grid's origin (e.g., 0.0E, 90.0N)

    Δλ = header.dx;
    Δφ = header.dy;    // distance between grid points (e.g., 2.5 deg lon, 2.5 deg lat)

    ni = header.nx;
    nj = header.ny;    // number of grid points W-E and N-S (e.g., 144 x 73)

    date = new Date(header.refTime);
    date.setHours(date.getHours() + header.forecastTime);

    // Scan mode 0 assumed. Longitude increases from λ0, and latitude decreases from φ0.
    // http://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_table3-4.shtml
    grid = [];
    var p = 0;
    var isContinuous = Math.floor(ni * Δλ) >= 360;

    for (var j = 0; j < nj; j++) {
      var row = [];
      for (var i = 0; i < ni; i++, p++) {
        row[i] = builder.data(p);
      }
      if (isContinuous) {
        // For wrapped grids, duplicate first column as last column to simplify interpolation logic
        row.push(row[0]);
      }
      grid[j] = row;
    }

    callback({
      date: date,
      interpolate: interpolate
    });
  };

  /**
   * Get interpolated grid value from Lon/Lat position
   * @param λ {Float} Longitude
   * @param φ {Float} Latitude
   * @returns {Object}
   */
  var interpolate = function (λ, φ) {

    if (!grid) { return null; }

    var i = floorMod(λ - λ0, 360) / Δλ;  // calculate longitude index in wrapped range [0, 360)
    var j = (φ0 - φ) / Δφ;                 // calculate latitude index in direction +90 to -90

    var fi = Math.floor(i), ci = fi + 1;
    var fj = Math.floor(j), cj = fj + 1;

    var row;
    if ((row = grid[fj])) {
      var g00 = row[fi];
      var g10 = row[ci];
      if (isValue(g00) && isValue(g10) && (row = grid[cj])) {
        var g01 = row[fi];
        var g11 = row[ci];
        if (isValue(g01) && isValue(g11)) {
          // All four points found, so interpolate the value.
          return builder.interpolate(i - fi, j - fj, g00, g10, g01, g11);
        }
      }
    }
    return null;
  };

  /**
   * @returns {Boolean} true if the specified value is not null and not undefined.
   */
  var isValue = function (x) {
    return x !== null && x !== undefined;
  };

  /**
   * @returns {Number} returns remainder of floored division, i.e., floor(a / n). Useful for consistent modulo
   *          of negative numbers. See http://en.wikipedia.org/wiki/Modulo_operation.
   */
  var floorMod = function (a, n) {
    return a - n * Math.floor(a / n);
  };

  /**
   * @returns {Boolean} true if agent is probably a mobile device. Don't really care if this is accurate.
   */
  var isMobile = function () {
    return (/android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i).test(navigator.userAgent);
  };

  /**
   * Calculate distortion of the wind vector caused by the shape of the projection at point (x, y). The wind
   * vector is modified in place and returned by this function.
   */
  var distort = function (projection, λ, φ, x, y, scale, wind, windy) {
    var u = wind[0] * scale;
    var v = wind[1] * scale;
    var d = distortion(projection, λ, φ, x, y, windy);

    // Scale distortion vectors by u and v, then add.
    wind[0] = d[0] * u + d[2] * v;
    wind[1] = d[1] * u + d[3] * v;
    return wind;
  };

  var distortion = function (projection, λ, φ, x, y, windy) {
    var τ = 2 * Math.PI;
    // var H = Math.pow(10, -5.2);
    var H = that.params.projection === 'EPSG:4326' ? 5 : Math.pow(10, -5.2);
    var hλ = λ < 0 ? H : -H;
    var hφ = φ < 0 ? H : -H;

    var pλ = project(φ, λ + hλ, windy);
    var pφ = project(φ + hφ, λ, windy);

    // Meridian scale factor (see Snyder, equation 4-3), where R = 1. This handles issue where length of 1º λ
    // changes depending on φ. Without this, there is a pinching effect at the poles.
    var k = Math.cos(φ / 360 * τ);
    return [
      (pλ[0] - x) / hλ / k,
      (pλ[1] - y) / hλ / k,
      (pφ[0] - x) / hφ,
      (pφ[1] - y) / hφ
    ];
  };

  var createField = function (columns, bounds, callback) {

    /**
     * @returns {Array} wind vector [u, v, magnitude] at the point (x, y), or [NaN, NaN, null] if wind
     *          is undefined at that point.
     */
    function field (x, y) {
      var column = columns[Math.round(x)];
      return column && column[Math.round(y)] || NULL_WIND_VECTOR;
    }

    // Frees the massive "columns" array for GC. Without this, the array is leaked (in Chrome) each time a new
    // field is interpolated because the field closure's context is leaked, for reasons that defy explanation.
    field.release = function () {
      columns = [];
    };

    field.randomize = function (o) {  // UNDONE: this method is terrible
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

  var buildBounds = function (bounds, width, height) {
    var upperLeft = bounds[0];
    var lowerRight = bounds[1];
    var x = Math.round(upperLeft[0]); //Math.max(Math.floor(upperLeft[0], 0), 0);
    var y = Math.max(Math.floor(upperLeft[1], 0), 0);
    var xMax = Math.min(Math.ceil(lowerRight[0], width), width - 1);
    var yMax = Math.min(Math.ceil(lowerRight[1], height), height - 1);
    return {x: x, y: y, xMax: width, yMax: yMax, width: width, height: height};
  };

  var deg2rad = function (deg) {
    return (deg / 180) * Math.PI;
  };

  var rad2deg = function (ang) {
    return ang / (Math.PI / 180.0);
  };

  var invert;

  if (that.params.projection === 'EPSG:4326') {
    invert = function (x, y, windy) {
      var mapLonDelta = windy.east - windy.west;
      var mapLatDelta = windy.south - windy.north;
      var lat = rad2deg(windy.north) + y / windy.height * rad2deg(mapLatDelta);
      var lon = rad2deg(windy.west) + x / windy.width * rad2deg(mapLonDelta);
      return [lon, lat];
    };
  } else {
    invert = function (x, y, windy) {
      var mapLonDelta = windy.east - windy.west;
      var worldMapRadius = windy.width / rad2deg(mapLonDelta) * 360 / (2 * Math.PI);
      var mapOffsetY = (worldMapRadius / 2 * Math.log((1 + Math.sin(windy.south)) / (1 - Math.sin(windy.south))));
      var equatorY = windy.height + mapOffsetY;
      var a = (equatorY - y) / worldMapRadius;
      var lat = 180 / Math.PI * (2 * Math.atan(Math.exp(a)) - Math.PI / 2);
      var lon = rad2deg(windy.west) + x / windy.width * rad2deg(mapLonDelta);
      return [lon, lat];
    };
  }

  var mercY = function (lat) {
    return Math.log(Math.tan(lat / 2 + Math.PI / 4));
  };


  var project = function (lat, lon, windy) { // both in radians, use deg2rad if neccessary
    var ymin = mercY(windy.south);
    var ymax = mercY(windy.north);
    var xFactor = windy.width / (windy.east - windy.west);
    var yFactor = windy.height / (ymax - ymin);

    var y = mercY(deg2rad(lat));
    var x = (deg2rad(lon) - windy.west) * xFactor;
    var y = (ymax - y) * yFactor; // y points south
    return [x, y];
  };

  var interpolateField = function (grid, bounds, extent, callback) {

    var projection = {};
    var mapArea = ((extent.south - extent.north) * (extent.west - extent.east));
    var velocityScale = that.VELOCITY_SCALE * Math.pow(mapArea, 0.4);

    var columns = [];
    var x = bounds.x;

    function interpolateColumn (x) {
      var column = [];
      for (var y = bounds.y; y <= bounds.yMax; y += 2) {
        var coord = invert(x, y, extent);
        if (coord) {
          var λ = coord[0], φ = coord[1];
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

    (function batchInterpolate () {
      var start = Date.now();
      while (x < bounds.width) {
        interpolateColumn(x);
        x += 2;
        if ((Date.now() - start) > 1000) { //MAX_TASK_TIME) {
          setTimeout(batchInterpolate, 25);
          return;
        }
      }
      createField(columns, bounds, callback);
    })();
  };

  var animationLoop;
  var animate = function (bounds, field) {

    function windIntensityColorScale (min, max) {

      that.COLOR_SCALE.indexFor = function (m) {  // map velocity speed to a style
        return Math.max(0, Math.min((that.COLOR_SCALE.length - 1),
          Math.round((m - min) / (max - min) * (that.COLOR_SCALE.length - 1))));

      };

      return that.COLOR_SCALE;
    }

    var colorStyles = windIntensityColorScale(that.MIN_VELOCITY_INTENSITY, that.MAX_VELOCITY_INTENSITY);
    var buckets = colorStyles.map(function () {
      return [];
    });

    var particleCount = Math.round(bounds.width * bounds.height * that.PARTICLE_MULTIPLIER);
    if (isMobile()) {
      particleCount *= that.PARTICLE_REDUCTION;
    }

    var fadeFillStyle = "rgba(0, 0, 0, 0.97)";

    var particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push(field.randomize({age: Math.floor(Math.random() * that.MAX_PARTICLE_AGE) + 0}));
    }

    function evolve () {
      buckets.forEach(function (bucket) {
        bucket.length = 0;
      });
      particles.forEach(function (particle) {
        if (particle.age > that.MAX_PARTICLE_AGE) {
          field.randomize(particle).age = 0;
        }
        var x = particle.x;
        var y = particle.y;
        var v = field(x, y);  // vector at current position
        var m = v[2];
        if (m === null) {
          particle.age = that.MAX_PARTICLE_AGE;  // particle has escaped the grid, never to return...
        }
        else {
          var xt = x + v[0];
          var yt = y + v[1];
          if (field(xt, yt)[2] !== null) {
            // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
            particle.xt = xt;
            particle.yt = yt;
            buckets[colorStyles.indexFor(m)].push(particle);
          }
          else {
            // Particle isn't visible, but it still moves through the field.
            particle.x = xt;
            particle.y = yt;
          }
        }
        particle.age += 1;
      });
    }

    var g = that.canvas.getContext("2d");
    g.lineWidth = that.PARTICLE_LINE_WIDTH;
    g.fillStyle = fadeFillStyle;
    g.globalAlpha = 0.6;

    function draw () {
      // Fade existing particle trails.
      var prev = "lighter";
      g.globalCompositeOperation = "destination-in";
      g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      g.globalCompositeOperation = prev;
      g.globalAlpha = 0.9;

      // Draw new particle trails.
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
    (function frame () {
      animationLoop = requestAnimationFrame(frame);
      var now = Date.now();
      var delta = now - then;
      if (delta > FRAME_TIME) {
        then = now - (delta % FRAME_TIME);
        evolve();
        draw();
        params.onDraw && params.onDraw();
      }
    })();
  };

  var updateData = function (data, bounds, width, height, extent) {
    delete that.params.data;
    that.params.data = data;
    if (extent)
      { start(bounds, width, height, extent); }
  };

  var start = function (bounds, width, height, extent) {
    var mapBounds = {
      south: deg2rad(extent[0][1]),
      north: deg2rad(extent[1][1]),
      east: deg2rad(extent[1][0]),
      west: deg2rad(extent[0][0]),
      width: width,
      height: height
    };

    stop();

    // build grid
    buildGrid(gridData, function (grid) {
      // interpolateField
      interpolateField(grid, buildBounds(bounds, width, height), mapBounds, function (bounds, field) {
        // animate the canvas with random points
        windy.field = field;
        animate(bounds, field);
      });

    });
  };

  var stop = function () {
    if (windy.field) { windy.field.release(); }
    if (animationLoop) { cancelAnimationFrame(animationLoop); }
  };

  var shift = function (dx, dy) {
    var canvas = that.canvas, w = canvas.width, h = canvas.height, ctx = canvas.getContext("2d");
    if (w > dx && h > dy) {
      var clamp = function (high, value) {
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

  var updateParams = function(params) {
    that.params = params;
    buildParams(that.params);
  };

  var getParams = function() {
    return that.params;
  };

  var windy = {
    params: that.params,
    start: start,
    stop: stop,
    update: updateData,
    shift: shift,
    createField: createField,
    interpolatePoint: interpolate,
    setData: setData,
    updateParams: updateParams,
    getParams: getParams,
    buildParams: buildParams,
  };

  return windy;
};

// polyfill
window.requestAnimationFrame = (function () {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / window.FRAME_RATE);
    };
})();

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function (id) {
    clearTimeout(id);
  };
}

/**
 * create canvas
 * @param width
 * @param height
 * @param Canvas
 * @returns {HTMLCanvasElement}
 */
var createCanvas = function (width, height, Canvas) {
  if (typeof document !== 'undefined') {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas
  } else {
    // create a new canvas instance in node.js
    // the canvas class needs to have a default constructor without any parameter
    return new Canvas(width, height);
  }
};

var getDirection = function (uMs, vMs, angleConvention) {
  // Default angle convention is CW
  if (angleConvention.endsWith('CCW')) {
    // vMs comes out upside-down..
    vMs = vMs > 0 ? vMs = -vMs : Math.abs(vMs);
  }
  var velocityAbs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
  var velocityDir = Math.atan2(uMs / velocityAbs, vMs / velocityAbs);
  var velocityDirToDegrees = velocityDir * 180 / Math.PI + 180;
  if (angleConvention === 'bearingCW' || angleConvention === 'meteoCCW') {
    velocityDirToDegrees += 180;
    if (velocityDirToDegrees >= 360) { velocityDirToDegrees -= 360; }
  }
  return velocityDirToDegrees;
};

var getSpeed = function (uMs, vMs, unit) {
  var velocityAbs = Math.sqrt(Math.pow(uMs, 2) + Math.pow(vMs, 2));
  // Default is m/s
  if (unit === 'k/h') {
    return meterSec2kilometerHour(velocityAbs);
  } else if (unit === 'kt') {
    return meterSec2Knots(velocityAbs);
  } else {
    return velocityAbs;
  }
};

var meterSec2Knots = function (meters) {
  return meters / 0.514
};

var meterSec2kilometerHour = function (meters) {
  return meters * 3.6
};

var getExtent = function (coords) {
  var extent = [
    Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY
  ];
  return coords.reduce(function (prev, coord) {
    return [
      Math.min(coord[0], prev[0]),
      Math.min(coord[1], prev[1]),
      Math.max(coord[0], prev[2]),
      Math.max(coord[1], prev[3])
    ];
  }, extent);
};

var global = typeof window === 'undefined' ? {} : window;
var ol = global.ol || {};

if (!ol.layer) { ol.layer = {}; }
if (!ol.layer.Image) { ol.layer.Image = /*@__PURE__*/(function () {
    function Image () {}

    return Image;
  }()); }

var OlWind = /*@__PURE__*/(function (superclass) {
  function OlWind (data, options) {
    if ( options === void 0 ) options = {};

    superclass.call(this, options);

    /**
     * 矢量图层
     * @type {null}
     */
    this._canvas = null;

    /**
     * windy 数据
     */
    this.data = data;

    /**
     * windy layer
     * @type {null}
     */
    this.$Windy = null;

    /**
     * is clear
     * @type {boolean}
     */
    this.isClear = false;

    /**
     * options
     * @type {{}}
     */
    this.options = options;
    this.setSource(new ol.source.ImageCanvas({
      logo: options.logo,
      state: options.state,
      attributions: options.attributions,
      resolutions: options.resolutions,
      canvasFunction: this.canvasFunction.bind(this),
      // projection: (options.hasOwnProperty('projection') ? options.projection : 'EPSG:3857'),
      ratio: (options.hasOwnProperty('ratio') ? options.ratio : 1)
    }));
    this.on('precompose', this.redraw, this);
  }

  if ( superclass ) OlWind.__proto__ = superclass;
  OlWind.prototype = Object.create( superclass && superclass.prototype );
  OlWind.prototype.constructor = OlWind;

  /**
   * get layer data
   * @returns {*}
   */
  OlWind.prototype.getData = function getData () {
    return this.data;
  };

  /**
   * set layer data
   * @param data
   * @returns {OlWind}
   */
  OlWind.prototype.setData = function setData (data) {
    var _map = this.getMap();
    if (!_map) { return this; }
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

  /**
   * render windy layer
   * @returns {OlWind}
   */
  OlWind.prototype.render = function render (canvas) {
    var extent = this._getExtent();
    if (this.isClear || !this.getData() || !extent) { return this; }
    if (canvas && !this.$Windy) {
      var ref = this.options;
      var minVelocity = ref.minVelocity;
      var maxVelocity = ref.maxVelocity;
      var velocityScale = ref.velocityScale;
      var particleAge = ref.particleAge;
      var lineWidth = ref.lineWidth;
      var particleMultiplier = ref.particleMultiplier;
      var colorScale = ref.colorScale;
      this.$Windy = new Windy({
        canvas: canvas,
        projection: this._getProjectionCode(),
        data: this.getData(),
        minVelocity: minVelocity,
        maxVelocity: maxVelocity,
        velocityScale: velocityScale,
        particleAge: particleAge,
        lineWidth: lineWidth,
        particleMultiplier: particleMultiplier,
        colorScale: colorScale
      });
      this.$Windy.start(extent[0], extent[1], extent[2], extent[3]);
    } else if (canvas && this.$Windy) {
      var extent$1 = this._getExtent();
      this.$Windy.start(extent$1[0], extent$1[1], extent$1[2], extent$1[3]);
    }
    return this
  };

  /**
   * re-draw
   */
  OlWind.prototype.redraw = function redraw () {
    if (this.isClear) { return; }
    var _extent = this.options.extent || this._getMapExtent();
    this.setExtent(_extent);
  };

  /**
   * canvas constructor
   * @param extent
   * @param resolution
   * @param pixelRatio
   * @param size
   * @param projection
   * @returns {*}
   */
  OlWind.prototype.canvasFunction = function canvasFunction (extent, resolution, pixelRatio, size, projection) {
    if (!this._canvas) {
      this._canvas = createCanvas(size[0], size[1]);
    } else {
      this._canvas.width = size[0];
      this._canvas.height = size[1];
    }
    if (resolution <= this.get('maxResolution')) {
      this.render(this._canvas);
    }
    return this._canvas;
  };

  /**
   * bounds, width, height, extent
   * @returns {*}
   * @private
   */
  OlWind.prototype._getExtent = function _getExtent () {
    var size = this._getMapSize();
    var _extent = this._getMapExtent();
    if (size && _extent) {
      var _projection = this._getProjectionCode();
      var extent = ol.proj.transformExtent(_extent, _projection, 'EPSG:4326');
      return [[[0, 0], [size[0], size[1]]], size[0], size[1], [[extent[0], extent[1]], [extent[2], extent[3]]]];
    } else {
      return false;
    }
  };

  /**
   * get map current extent
   * @returns {ol.View|*|Array<number>}
   * @private
   */
  OlWind.prototype._getMapExtent = function _getMapExtent () {
    if (!this.getMap()) { return; }
    var size = this._getMapSize();
    var _view = this.getMap().getView();
    return _view && _view.calculateExtent(size);
  };

  /**
   * get size
   * @returns {ol.Size|*}
   * @private
   */
  OlWind.prototype._getMapSize = function _getMapSize () {
    if (!this.getMap()) { return; }
    return this.getMap().getSize();
  };

  /**
   * append layer to map
   * @param map
   */
  OlWind.prototype.appendTo = function appendTo (map) {
    if (map && map instanceof ol.Map) {
      this.set('originMap', map);
      this.getSource().projection_ = this._getProjectionCode();
      map.addLayer(this);
    } else {
      throw new Error('not map object');
    }
  };

  /**
   * get mouse point data
   * @param coordinates
   * @returns {null|{speed: (*|number), direction}}
   */
  OlWind.prototype.getPointData = function getPointData (coordinates) {
    if (!this.$Windy) { return null; }
    var gridValue = this.$Windy.interpolatePoint(coordinates[0], coordinates[1]);
    if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {
      return {
        direction: getDirection(gridValue[0], gridValue[1], this.options.angleConvention || 'bearingCCW'),
        speed: getSpeed(gridValue[0], gridValue[1], this.options.speedUnit)
      }
    }
  };

  /**
   * clearWind method will retain the instance
   * @private
   */
  OlWind.prototype.clearWind = function clearWind () {
    var _map = this.getMap();
    if (!_map) { return; }
    if (this.$Windy) { this.$Windy.stop(); }
    this.isClear = true;
    this._cloneLayer = this;
    _map.removeLayer(this);
    this.changed();
    this.getMap().renderSync();
  };

  /**
   * remove layer this instance will be destroyed after remove
   */
  OlWind.prototype.removeLayer = function removeLayer () {
    var _map = this.getMap();
    if (!_map) { return; }
    if (this.$Windy) { this.$Windy.stop(); }
    this.un('precompose', this.redraw, this);
    _map.removeLayer(this);
    delete this._canvas;
    delete this.$Windy;
    delete this._cloneLayer;
  };

  /**
   * set map
   * @param map
   */
  OlWind.prototype.setMap = function setMap (map) {
    this.set('originMap', map);
    // ol.layer.Image.prototype.setMap.call(this, map)
  };

  /**
   * get map
   */
  OlWind.prototype.getMap = function getMap () {
    return this.get('originMap');
  };

  OlWind.prototype._getProjectionCode = function _getProjectionCode () {
    var code = '';
    var map = this.getMap();
    if (map) {
      code =
        map.getView() &&
        map
          .getView()
          .getProjection()
          .getCode();
    } else {
      code = 'EPSG:3857';
    }
    return code;
  };

  /**
   * update windy config
   * @param params
   * @returns {OlWind}
   */
  OlWind.prototype.updateParams = function updateParams (params) {
    this.options = Object.assign(this.options, params);
    if (this.$Windy) {
      var ref = this.options;
      var minVelocity = ref.minVelocity;
      var maxVelocity = ref.maxVelocity;
      var velocityScale = ref.velocityScale;
      var particleAge = ref.particleAge;
      var lineWidth = ref.lineWidth;
      var particleMultiplier = ref.particleMultiplier;
      var colorScale = ref.colorScale;
      if (this.$Windy) {
        this.$Windy.updateParams({
          minVelocity: minVelocity,
          maxVelocity: maxVelocity,
          velocityScale: velocityScale,
          particleAge: particleAge,
          lineWidth: lineWidth,
          particleMultiplier: particleMultiplier,
          colorScale: colorScale
        });
        if (this.getMap() && this._canvas && this.data) {
          this.render(this._canvas);
        }
      }
    }
    return this;
  };

  /**
   * get windy config
   * @returns {null|*|Windy.params|{velocityScale, minVelocity, maxVelocity, colorScale, particleAge, lineWidth, particleMultiplier}}
   */
  OlWind.prototype.getParams = function getParams () {
    return this.$Windy && this.$Windy.getParams();
  };

  return OlWind;
}(ol.layer.Image));

var global$1 = typeof window === 'undefined' ? {} : window;
var AMap = global$1.AMap || {};

var AMapWind = function AMapWind (data, options) {
  if ( options === void 0 ) options = {};

  this.options = options;

  /**
   * internal
   * @type {null}
   */
  this.canvas = null;

  /**
   * windy 数据
   */
  this.data = data;

  /**
   * canvas layer
   * @type {null}
   * @private
   */
  this.layer_ = null;

  /**
   * windy layer
   * @type {null}
   */
  this._windy = null;

  if (options.map) {
    this.appendTo(options.map);
  }

  /**
   * bind context
   * @type {{new(...args: any[][]): any} | ((...args: any[][]) => any) | ((...args: any[]) => any) | any | {new(...args: any[]): any}}
   */
  this.init = this.init.bind(this);
  this.handleResize = this.handleResize.bind(this);
  this.canvasFunction = this.canvasFunction.bind(this);
  this._addReFreshHandle = this._addReFreshHandle.bind(this);
};

/**
 * append layer to map
 * @param map
 */
AMapWind.prototype.appendTo = function appendTo (map) {
  if (map) {
    this.init(map);
  } else {
    throw new Error('not map object');
  }
};

/**
 * get layer data
 * @returns {*}
 */
AMapWind.prototype.getData = function getData () {
  return this.data;
};

/**
 * set data
 * @param data
 */
AMapWind.prototype.setData = function setData (data) {
  this.data = data;
  if (this.map && this.canvas && this.data) {
    this.render(this.canvas);
  }
};

/**
 * init windy layer
 * @param map
 * @param options
 */
AMapWind.prototype.init = function init (map, options) {
  if (map) {
    this.map = map;
    this.context = this.options.context || '2d';
    this.getCanvasLayer();
    this.map.on('resize', this.handleResize, this);
  } else {
    throw new Error('not map object')
  }
};

AMapWind.prototype.handleResize = function handleResize () {
  if (this.canvas) {
    this.canvasFunction();
  }
};

/**
 *render layer
 * @param canvas
 * @returns {*}
 */
AMapWind.prototype.render = function render (canvas) {
  if (!canvas) { return; }
  var extent = this._getExtent();
  if (!this.getData() || !extent) { return this; }
  if (canvas && !this._windy) {
    var ref = this.options;
      var minVelocity = ref.minVelocity;
      var maxVelocity = ref.maxVelocity;
      var velocityScale = ref.velocityScale;
      var particleAge = ref.particleAge;
      var lineWidth = ref.lineWidth;
      var particleMultiplier = ref.particleMultiplier;
      var colorScale = ref.colorScale;
    this._windy = new Windy({
      canvas: canvas,
      data: this.getData(),
      'onDraw': function () {
      },
      minVelocity: minVelocity,
      maxVelocity: maxVelocity,
      velocityScale: velocityScale,
      particleAge: particleAge,
      lineWidth: lineWidth,
      particleMultiplier: particleMultiplier,
      colorScale: colorScale
    });
    this._windy.start(extent[0], extent[1], extent[2], extent[3]);
  } else if (canvas && this._windy) {
    this._windy.start(extent[0], extent[1], extent[2], extent[3]);
  }
  // 2D视图时可以省略
  this._addReFreshHandle();
  return this;
};

/**
 * 3D模式下手动刷新
 * @private
 */
AMapWind.prototype._addReFreshHandle = function _addReFreshHandle () {
  if (!this.map) { return; }
  var type = this.map.getViewMode_();
  if (type.toLowerCase() === '3d') {
    this.layer_ && this.layer_.reFresh();
    AMap.Util.requestAnimFrame(this._addReFreshHandle);
  }
};

/**
 * get canvas layer
 */
AMapWind.prototype.getCanvasLayer = function getCanvasLayer () {
  if (!this.canvas && !this.layer_) {
    var canvas = this.canvasFunction();
    var bounds = this._getBounds();
    this.layer_ = new AMap.CanvasLayer({
      canvas: canvas,
      bounds: this.options.bounds || bounds,
      zooms: this.options.zooms || [0, 22],
      zIndex: this.options.zIndex || 12,
      opacity: this.options.opacity || 1
    });
    this.map.on('mapmove', this.canvasFunction, this);
    this.map.on('zoomchange', this.canvasFunction, this);
    this.layer_.setMap(this.map);
  }
};

/**
 * canvas constructor
 * @returns {*}
 */
AMapWind.prototype.canvasFunction = function canvasFunction () {
  var ref = [this.map.getSize().width, this.map.getSize().height];
    var width = ref[0];
    var height = ref[1];
  if (!this.canvas) {
    this.canvas = createCanvas(width, height, null);
  } else {
    this.canvas.width = width;
    this.canvas.height = height;
    var bounds = this._getBounds();
    if (this.layer_) {
      this.layer_.setBounds(this.options.bounds || bounds);
    }
  }
  this.render(this.canvas);
  return this.canvas;
};

/**
 * fixed viewMode
 * @private
 */
AMapWind.prototype._getBounds = function _getBounds () {
  var type = this.map.getViewMode_();
  var ref = [];
    var southWest = ref[0];
    var northEast = ref[1];
  var bounds = this.map.getBounds();
  if (type.toLowerCase() === '2d') {
    northEast = bounds.getNorthEast(); // xmax ymax
    southWest = bounds.getSouthWest(); // xmin ymin
  } else {
    var arrays = bounds.bounds.map(function (item) {
      return [item.getLng(), item.getLat()];
    });
    var extent = getExtent(arrays);
    southWest = new AMap.LngLat(extent[0], extent[1]);
    northEast = new AMap.LngLat(extent[2], extent[3]);
  }
  return new AMap.Bounds(southWest, northEast);
};

/**
 * bounds, width, height, extent
 * @returns {*}
 * @private
 */
AMapWind.prototype._getExtent = function _getExtent () {
  var ref = [this.map.getSize().width, this.map.getSize().height];
    var width = ref[0];
    var height = ref[1];
  var _ne = this._getBounds().getNorthEast();
  var _sw = this._getBounds().getSouthWest();
  return [
    [
      [0, 0], [width, height]
    ],
    width,
    height,
    [
      [_sw.lng, _sw.lat], [_ne.lng, _ne.lat] ]
  ]
};

/**
 * remove layer
 */
AMapWind.prototype.removeLayer = function removeLayer () {
  if (!this.map) { return; }
  this.layer_.setMap(null);
  this.map.off('resize', this.handleResize, this);
  this.map.off('mapmove', this.canvasFunction, this);
  this.map.off('zoomchange', this.canvasFunction, this);
  delete this.map;
  delete this.layer_;
  delete this.canvas;
};

/**
 * get canvas context
 * @returns {*}
 */
AMapWind.prototype.getContext = function getContext () {
  return this.canvas.getContext(this.context);
};

/**
 * get mouse point data
 * @param coordinates
 * @returns {{direction: number, speed: *}}
 */
AMapWind.prototype.getPointData = function getPointData (coordinates) {
  var gridValue = this._windy.interpolatePoint(coordinates[0], coordinates[1]);
  if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {
    return {
      direction: getDirection(gridValue[0], gridValue[1], this.options.angleConvention || 'bearingCCW'),
      speed: getSpeed(gridValue[0], gridValue[1], this.options.speedUnit)
    }
  }
};

/**
 * clear wind
 */
AMapWind.prototype.clearWind = function clearWind () {
  if (this._windy) { this._windy.stop(); }
};

/**
 * update windy config
 * @param params
 * @returns {AMapWind}
 */
AMapWind.prototype.updateParams = function updateParams (params) {
  this.options = Object.assign(this.options, params);
  if (this._windy) {
    var ref = this.options;
      var minVelocity = ref.minVelocity;
      var maxVelocity = ref.maxVelocity;
      var velocityScale = ref.velocityScale;
      var particleAge = ref.particleAge;
      var lineWidth = ref.lineWidth;
      var particleMultiplier = ref.particleMultiplier;
      var colorScale = ref.colorScale;
    if (this._windy) {
      // this._windy.stop();
      this._windy.updateParams({
        minVelocity: minVelocity,
        maxVelocity: maxVelocity,
        velocityScale: velocityScale,
        particleAge: particleAge,
        lineWidth: lineWidth,
        particleMultiplier: particleMultiplier,
        colorScale: colorScale
      });
      if (this.map && this.canvas && this.data) {
        this.render(this.canvas);
      }
    }
  }
  return this;
};

/**
 * get windy config
 * @returns {null|*|Windy.params|{velocityScale, minVelocity, maxVelocity, colorScale, particleAge, lineWidth, particleMultiplier}}
 */
AMapWind.prototype.getParams = function getParams () {
  return this._windy && this._windy.getParams();
};

var global$2 = typeof window === 'undefined' ? {} : window;

if (!global$2.BMap) { global$2.BMap = {}; }

if (!global$2.BMap.Overlay) { global$2.BMap.Overlay = /*@__PURE__*/(function () {
    function Overlay () {}

    return Overlay;
  }()); }

var BaiduWind = /*@__PURE__*/(function (superclass) {
  function BaiduWind (data, options) {
    if ( options === void 0 ) options = {};

    superclass.call(this, options);
    this.options = options;
    this.paneName = this.options.paneName || 'mapPane';
    this.context = this.options.context || '2d';
    this.zIndex = this.options.zIndex || 0;
    this.mixBlendMode = this.options.mixBlendMode || null;
    this.enableMassClear = this.options.enableMassClear;
    this._map = options.map;
    this._lastDrawTime = null;

    /**
     * 矢量图层
     * @type {null}
     */
    this.canvas = null;

    /**
     * windy 数据
     */
    this.data = data;

    /**
     * windy layer
     * @type {null}
     */
    this._windy = null;
    this.show();
  }

  if ( superclass ) BaiduWind.__proto__ = superclass;
  BaiduWind.prototype = Object.create( superclass && superclass.prototype );
  BaiduWind.prototype.constructor = BaiduWind;

  /**
   * get layer data
   * @returns {*}
   */
  BaiduWind.prototype.getData = function getData () {
    return this.data;
  };

  /**
   * set data
   * @param data
   */
  BaiduWind.prototype.setData = function setData (data) {
    this.data = data;
    if (this._map && this.data) {
      this._draw();
    }
  };

  /**
   * bounds, width, height, extent
   * @returns {*}
   * @private
   */
  BaiduWind.prototype._getExtent = function _getExtent () {
    var size = this._map.getSize();
    var _ne = this._map.getBounds().getNorthEast();
    var _sw = this._map.getBounds().getSouthWest();
    return [
      [
        [0, 0], [size.width, size.height]
      ],
      size.width,
      size.height,
      [
        // [_ne.lng, _ne.lat], [_sw.lng, _sw.lat]
        [_sw.lng, _sw.lat], [_ne.lng, _ne.lat] ]
    ]
  };

  /**
   * append layer to map
   * @param map
   */
  BaiduWind.prototype.appendTo = function appendTo (map) {
    if (map) {
      map.addOverlay(this);
    } else {
      throw new Error('not map object');
    }
  };

  BaiduWind.prototype.initialize = function initialize (map) {
    var this$1 = this;

    this._map = map;
    var canvas = this.canvas = document.createElement('canvas');
    canvas.style.cssText = "position:absolute; left:0; top:0; z-index: " + (this.zIndex) + " ;user-select:none;";
    canvas.style.mixBlendMode = this.mixBlendMode;
    this.adjustSize();
    map.getPanes()[this.paneName].appendChild(canvas);
    map.addEventListener('resize', function () {
      this$1.adjustSize();
      this$1._draw();
    });
    return this.canvas
  };

  BaiduWind.prototype.adjustSize = function adjustSize () {
    var size = this._map.getSize();
    var canvas = this.canvas;
    var devicePixelRatio = this.devicePixelRatio = global$2.devicePixelRatio || 1;
    canvas.width = size.width * devicePixelRatio;
    canvas.height = size.height * devicePixelRatio;
    if (this.context === '2d') {
      canvas.getContext(this.context).scale(devicePixelRatio, devicePixelRatio);
    }
    canvas.style.width = size.width + 'px';
    canvas.style.height = size.height + 'px';
  };

  BaiduWind.prototype.draw = function draw () {
    var self = this;
    clearTimeout(self.timeoutID);
    self.timeoutID = setTimeout(function () {
      self._draw();
    }, 15);
  };

  BaiduWind.prototype._draw = function _draw () {
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

  /**
   * render windy layer
   * @param canvas
   * @returns {BaiduWind}
   */
  BaiduWind.prototype.render = function render (canvas) {
    var extent = this._getExtent();
    if (!this.getData() || !extent) { return this; }
    if (canvas && !this._windy) {
      var ref = this.options;
      var minVelocity = ref.minVelocity;
      var maxVelocity = ref.maxVelocity;
      var velocityScale = ref.velocityScale;
      var particleAge = ref.particleAge;
      var lineWidth = ref.lineWidth;
      var particleMultiplier = ref.particleMultiplier;
      var colorScale = ref.colorScale;
      this._windy = new Windy({
        canvas: canvas,
        data: this.getData(),
        'onDraw': function () {
        },
        minVelocity: minVelocity,
        maxVelocity: maxVelocity,
        velocityScale: velocityScale,
        particleAge: particleAge,
        lineWidth: lineWidth,
        particleMultiplier: particleMultiplier,
        colorScale: colorScale
      });
      this._windy.start(extent[0], extent[1], extent[2], extent[3]);
    } else if (canvas && this._windy) {
      this._windy.start(extent[0], extent[1], extent[2], extent[3]);
    }
    return this;
  };

  BaiduWind.prototype.getContainer = function getContainer () {
    return this.canvas;
  };

  BaiduWind.prototype.setZIndex = function setZIndex (zIndex) {
    this.zIndex = zIndex;
    this.canvas.style.zIndex = this.zIndex;
  };

  BaiduWind.prototype.getZIndex = function getZIndex () {
    return this.zIndex;
  };

  /**
   * get mouse point data
   * @param coordinates
   * @returns {{direction: number, speed: *}}
   */
  BaiduWind.prototype.getPointData = function getPointData (coordinates) {
    var gridValue = this._windy.interpolatePoint(coordinates[0], coordinates[1]);
    if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {
      return {
        direction: getDirection(gridValue[0], gridValue[1], this.options.angleConvention || 'bearingCCW'),
        speed: getSpeed(gridValue[0], gridValue[1], this.options.speedUnit)
      }
    }
  };

  /**
   * clear wind
   */
  BaiduWind.prototype.clearWind = function clearWind () {
    if (this._windy) { this._windy.stop(); }
  };

  /**
   * update windy config
   * @param params
   * @returns {BaiduWind}
   */
  BaiduWind.prototype.updateParams = function updateParams (params) {
    this.options = Object.assign(this.options, params);
    if (this._windy) {
      var ref = this.options;
      var minVelocity = ref.minVelocity;
      var maxVelocity = ref.maxVelocity;
      var velocityScale = ref.velocityScale;
      var particleAge = ref.particleAge;
      var lineWidth = ref.lineWidth;
      var particleMultiplier = ref.particleMultiplier;
      var colorScale = ref.colorScale;
      if (this._windy) {
        // this._windy.stop();
        this._windy.updateParams({
          minVelocity: minVelocity,
          maxVelocity: maxVelocity,
          velocityScale: velocityScale,
          particleAge: particleAge,
          lineWidth: lineWidth,
          particleMultiplier: particleMultiplier,
          colorScale: colorScale
        });
        if (this._map && this.canvas && this.data) {
          this.render(this.canvas);
        }
      }
    }
    return this;
  };

  /**
   * get windy config
   * @returns {null|*|Windy.params|{velocityScale, minVelocity, maxVelocity, colorScale, particleAge, lineWidth, particleMultiplier}}
   */
  BaiduWind.prototype.getParams = function getParams () {
    return this._windy && this._windy.getParams();
  };

  return BaiduWind;
}(global$2.BMap.Overlay));

var index = {
  AMapWind: AMapWind,
  BMapWind: BaiduWind,
  OlWind: OlWind
};

export default index;
//# sourceMappingURL=windLayer.esm.js.map
