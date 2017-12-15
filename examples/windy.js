/*  Global class for simulating the movement of particle through a 1km wind grid

 credit: All the credit for this work goes to: https://github.com/cambecc for creating the repo:
 https://github.com/cambecc/earth. The majority of this code is directly take nfrom there, since its awesome.

 This class takes a canvas element and an array of data (1km GFS from http://www.emc.ncep.noaa.gov/index.php?branch=GFS)
 and then uses a mercator (forward/reverse) projection to correctly map wind vectors in "map space".

 The "start" method takes the bounds of the map at its current extent and starts the whole gridding,
 interpolation and animation process.
 */

var Windy = function (params) {

	const VELOCITY_SCALE = 0.005 * (Math.pow(window.devicePixelRatio,1/3) || 1); // scale for wind velocity (completely arbitrary--this value looks nice)
	const MIN_TEMPERATURE_K = 261.15;                                            // step size of particle intensity color scale
	const MAX_TEMPERATURE_K = 317.15;                                            // wind velocity at which particle intensity is maximum (m/s)
	const MAX_PARTICLE_AGE = 90;                                                 // max number of frames a particle is drawn before regeneration
	const PARTICLE_LINE_WIDTH = 1;                                               // line width of a drawn particle
	const PARTICLE_MULTIPLIER = 1 / 200;                                         // particle count scalar (completely arbitrary--this values looks nice)
	const PARTICLE_REDUCTION = (Math.pow(window.devicePixelRatio,1/3) || 1.6);   // multiply particle count for mobiles by this amount
	const FRAME_RATE = 15, FRAME_TIME = 1000 / FRAME_RATE;                       // desired frames per second

	var NULL_WIND_VECTOR = [NaN, NaN, null];                                     // singleton for no wind in the form: [u, v, magnitude]

	var builder;
	var grid;
	var date;
	var λ0, φ0, Δλ, Δφ, ni, nj;

	// interpolation for vectors like wind (u,v,m)
	var bilinearInterpolateVector = function (x, y, g00, g10, g01, g11) {
		var rx = (1 - x);
		var ry = (1 - y);
		var a = rx * ry, b = x * ry, c = rx * y, d = x * y;
		var u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
		var v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;
		var tmp = g00[2] * a + g10[2] * b + g01[2] * c + g11[2] * d;
		return [u, v, tmp];
	};

	var createWindBuilder = function (uComp, vComp, temp) {
		var uData = uComp.data, vData = vComp.data;
		return {
			header: uComp.header,
			//recipe: recipeFor("wind-" + uComp.header.surface1Value),
			data: function (i) {
				return [uData[i], vData[i], temp.data[i]];
			},
			interpolate: bilinearInterpolateVector
		}
	};

	var createBuilder = function (data) {
		var uComp = null, vComp = null, temp = null, scalar = null;

		data.forEach(function (record) {
			switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
				case "2,2": uComp = record; break;
				case "2,3": vComp = record; break;
				case "0,0": temp = record; break;
				default:
					scalar = record;
			}
		});

		return createWindBuilder(uComp, vComp, temp);
	};

	var buildGrid = function (data, callback) {

		builder = createBuilder(data);
		var header = builder.header;

		λ0 = header.lo1;
		φ0 = header.la1;  // the grid's origin (e.g., 0.0E, 90.0N)

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
	var interpolate = function(λ, φ) {

		if(!grid) return null;

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
	 * @returns {Number} the value x clamped to the range [low, high].
	 */
	var clamp = function (x, range) {
		return Math.max(range[0], Math.min(x, range[1]));
	};

	/**
	 * @returns {Boolean} true if agent is probably a mobile device. Don't really care if this is accurate.
	 */
	var isMobile = function () {
		return (/android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i).test(navigator.userAgent);
	}

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
		var H = Math.pow(10, -5.2);
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
		function field(x, y) {
			if(!columns) return [NaN, NaN, null];
			var column = columns[Math.round(x)];
			return column && column[Math.round(y)] || NULL_WIND_VECTOR;
		}

		// Frees the massive "columns" array for GC. Without this, the array is leaked (in Chrome) each time a new
		// field is interpolated because the field closure's context is leaked, for reasons that defy explanation.
		field.release = function () {
			//delete columns;
			columns = [];
		};

		field.randomize = function (o) {  // UNDONE: this method is terrible
			var x, y;
			var safetyNet = 0;
			do {
				x = Math.round(Math.floor(Math.random() * bounds.width) + bounds.x);
				y = Math.round(Math.floor(Math.random() * bounds.height) + bounds.y)
			} while (field(x, y)[2] === null && safetyNet++ < 30);
			o.x = x;
			o.y = y;
			return o;
		};

		//field.overlay = mask.imageData;
		//return field;
		callback(bounds, field);
	};

	var buildBounds = function (bounds, width, height) {
		var upperLeft = bounds[0];
		var lowerRight = bounds[1];
		var x = Math.round(upperLeft[0]); //Math.max(Math.floor(upperLeft[0], 0), 0);
		var y = Math.max(Math.floor(upperLeft[1], 0), 0);
		var xMax = Math.min(Math.ceil(lowerRight[0], width), width - 1);
		var yMax = Math.min(Math.ceil(lowerRight[1], height), height - 1);
		return { x: x, y: y, xMax: width, yMax: yMax, width: width, height: height };
	};

	var deg2rad = function (deg) {
		return (deg / 180) * Math.PI;
	};

	var rad2deg = function (ang) {
		return ang / (Math.PI / 180.0);
	};

	var invert = function (x, y, windy) {
		var mapLonDelta = windy.east - windy.west;
		var worldMapRadius = windy.width / rad2deg(mapLonDelta) * 360 / (2 * Math.PI);
		var mapOffsetY = (worldMapRadius / 2 * Math.log((1 + Math.sin(windy.south)) / (1 - Math.sin(windy.south))));
		var equatorY = windy.height + mapOffsetY;
		var a = (equatorY - y) / worldMapRadius;

		var lat = 180 / Math.PI * (2 * Math.atan(Math.exp(a)) - Math.PI / 2);
		var lon = rad2deg(windy.west) + x / windy.width * rad2deg(mapLonDelta);
		return [lon, lat];
	};

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
		var velocityScale = VELOCITY_SCALE * Math.pow(mapArea, 0.3);

		var columns = [];
		var x = bounds.x;

		function interpolateColumn(x) {
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

		//(function batchInterpolate() {
		//    var start = Date.now();
		//    while (x < bounds.width) {
		//        interpolateColumn(x);
		//        x += 2;
		//        if ((Date.now() - start) > 1000) { //MAX_TASK_TIME) {
		//            setTimeout(batchInterpolate, 25);
		//            return;
		//        }
		//    }
		//    createField(columns, bounds, callback);
		//})();

		for (; x < bounds.width; x+= 2) {
			interpolateColumn(x);
		}
		createField(columns, bounds, callback);
	};

	var particles, animationLoop;
	var animate = function (bounds, field, extent) {

		function asColorStyle(r, g, b, a) {
			return "rgba(" + 243 + ", " + 243 + ", " + 238 + ", " + a + ")";
		}

		function hexToR(h) { return parseInt((cutHex(h)).substring(0, 2), 16) }
		function hexToG(h) { return parseInt((cutHex(h)).substring(2, 4), 16) }
		function hexToB(h) { return parseInt((cutHex(h)).substring(4, 6), 16) }
		function cutHex(h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h }

		function windTemperatureColorScale(minTemp, maxTemp) {

			var result = [
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
			]
			result.indexFor = function (m) {  // map wind speed to a style
				return Math.max(0, Math.min((result.length - 1),
					Math.round((m - minTemp) / (maxTemp - minTemp) * (result.length - 1))));

			};
			return result;
		}

		var colorStyles = windTemperatureColorScale(MIN_TEMPERATURE_K, MAX_TEMPERATURE_K);
		var buckets = colorStyles.map(function () { return []; });
		var mapArea = ((extent.south - extent.north) * (extent.west - extent.east));
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
			buckets.forEach(function (bucket) { bucket.length = 0; });
			particles.forEach(function (particle) {
				if (particle.age > MAX_PARTICLE_AGE) {
					field.randomize(particle).age = ~~(Math.random() * MAX_PARTICLE_AGE / 2);
				}
				var x = particle.x;
				var y = particle.y;
				var v = field(x, y);  // vector at current position
				var m = v[2];
				if (m === null) {
					particle.age = MAX_PARTICLE_AGE;  // particle has escaped the grid, never to return...
				}
				else {
					var xt = x + v[0];
					var yt = y + v[1];
					if (field(xt, yt)[0] !== null) {
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

		var g = params.canvas.getContext("2d");
		g.lineWidth = PARTICLE_LINE_WIDTH;

		function draw() {
			// Fade existing particle trails.
			g.save();
			g.globalAlpha = .16;
			g.globalCompositeOperation = 'destination-out';
			g.fillStyle = '#000';
			g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
			g.restore();

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
		(function frame() {
			animationLoop = requestAnimationFrame(frame);
			var now = Date.now()
			var delta = now - then;
			if (delta > FRAME_TIME) {
				then = now - (delta % FRAME_TIME);
				evolve();
				draw();
			}
		})();
	};

	var updateData = function (data, bounds, width, height, extent) {
		delete params.data;
		params.data = data;
		if (extent)
			start(bounds, width, height, extent);
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
		buildGrid(params.data, function (grid) {
			// interpolateField
			interpolateField(grid, buildBounds(bounds, width, height), mapBounds, function (bounds, field) {
				// animate the canvas with random points
				windy.field = field;
				animate(bounds, field, mapBounds);
			});

		});
	};

	var stop = function () {
		if (windy.field) windy.field.release();
		if (animationLoop) cancelAnimationFrame(animationLoop);
	};

	var shift = function (dx, dy) {
		var canvas = params.canvas, w = canvas.width, h = canvas.height, ctx = canvas.getContext("2d");
		if (w > dx && h > dy) {
			var clamp = function (high, value) { return Math.max(0, Math.min(high, value)); };
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

// shim layer with setTimeout fallback
window.requestAnimationFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			return window.setTimeout(callback, 1000 / FRAME_RATE);
		};
})();

if(!window.cancelAnimationFrame) {
	window.cancelAnimationFrame = function (id) {
		clearTimeout(id);
	};
}