/*!
 * author: FDD <smileFDD@gmail.com> 
 * wind-layer v0.0.5
 * build-time: 2018-4-24 22:20
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

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var quickselect = createCommonjsModule(function (module, exports) {
(function (global, factory) {
	module.exports = factory();
}(commonjsGlobal, (function () {
function quickselect(arr, k, left, right, compare) {
    quickselectStep(arr, k, left || 0, right || (arr.length - 1), compare || defaultCompare);
}

function quickselectStep(arr, k, left, right, compare) {

    while (right > left) {
        if (right - left > 600) {
            var n = right - left + 1;
            var m = k - left + 1;
            var z = Math.log(n);
            var s = 0.5 * Math.exp(2 * z / 3);
            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
            quickselectStep(arr, k, newLeft, newRight, compare);
        }

        var t = arr[k];
        var i = left;
        var j = right;

        swap(arr, left, k);
        if (compare(arr[right], t) > 0) swap(arr, left, right);

        while (i < j) {
            swap(arr, i, j);
            i++;
            j--;
            while (compare(arr[i], t) < 0) i++;
            while (compare(arr[j], t) > 0) j--;
        }

        if (compare(arr[left], t) === 0) swap(arr, left, j);
        else {
            j++;
            swap(arr, j, right);
        }

        if (j <= k) left = j + 1;
        if (k <= j) right = j - 1;
    }
}

function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

function defaultCompare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

return quickselect;

})));
});

var rbush_1 = rbush;
var default_1 = rbush;



function rbush(maxEntries, format) {
    if (!(this instanceof rbush)) return new rbush(maxEntries, format);

    // max entries in a node is 9 by default; min node fill is 40% for best performance
    this._maxEntries = Math.max(4, maxEntries || 9);
    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));

    if (format) {
        this._initFormat(format);
    }

    this.clear();
}

rbush.prototype = {

    all: function () {
        return this._all(this.data, []);
    },

    search: function (bbox) {

        var node = this.data,
            result = [],
            toBBox = this.toBBox;

        if (!intersects(bbox, node)) return result;

        var nodesToSearch = [],
            i, len, child, childBBox;

        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {

                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;

                if (intersects(bbox, childBBox)) {
                    if (node.leaf) result.push(child);
                    else if (contains(bbox, childBBox)) this._all(child, result);
                    else nodesToSearch.push(child);
                }
            }
            node = nodesToSearch.pop();
        }

        return result;
    },

    collides: function (bbox) {

        var node = this.data,
            toBBox = this.toBBox;

        if (!intersects(bbox, node)) return false;

        var nodesToSearch = [],
            i, len, child, childBBox;

        while (node) {
            for (i = 0, len = node.children.length; i < len; i++) {

                child = node.children[i];
                childBBox = node.leaf ? toBBox(child) : child;

                if (intersects(bbox, childBBox)) {
                    if (node.leaf || contains(bbox, childBBox)) return true;
                    nodesToSearch.push(child);
                }
            }
            node = nodesToSearch.pop();
        }

        return false;
    },

    load: function (data) {
        if (!(data && data.length)) return this;

        if (data.length < this._minEntries) {
            for (var i = 0, len = data.length; i < len; i++) {
                this.insert(data[i]);
            }
            return this;
        }

        // recursively build the tree with the given data from scratch using OMT algorithm
        var node = this._build(data.slice(), 0, data.length - 1, 0);

        if (!this.data.children.length) {
            // save as is if tree is empty
            this.data = node;

        } else if (this.data.height === node.height) {
            // split root if trees have the same height
            this._splitRoot(this.data, node);

        } else {
            if (this.data.height < node.height) {
                // swap trees if inserted one is bigger
                var tmpNode = this.data;
                this.data = node;
                node = tmpNode;
            }

            // insert the small tree into the large tree at appropriate level
            this._insert(node, this.data.height - node.height - 1, true);
        }

        return this;
    },

    insert: function (item) {
        if (item) this._insert(item, this.data.height - 1);
        return this;
    },

    clear: function () {
        this.data = createNode([]);
        return this;
    },

    remove: function (item, equalsFn) {
        if (!item) return this;

        var node = this.data,
            bbox = this.toBBox(item),
            path = [],
            indexes = [],
            i, parent, index, goingUp;

        // depth-first iterative tree traversal
        while (node || path.length) {

            if (!node) { // go up
                node = path.pop();
                parent = path[path.length - 1];
                i = indexes.pop();
                goingUp = true;
            }

            if (node.leaf) { // check current node
                index = findItem(item, node.children, equalsFn);

                if (index !== -1) {
                    // item found, remove the item and condense tree upwards
                    node.children.splice(index, 1);
                    path.push(node);
                    this._condense(path);
                    return this;
                }
            }

            if (!goingUp && !node.leaf && contains(node, bbox)) { // go down
                path.push(node);
                indexes.push(i);
                i = 0;
                parent = node;
                node = node.children[0];

            } else if (parent) { // go right
                i++;
                node = parent.children[i];
                goingUp = false;

            } else node = null; // nothing found
        }

        return this;
    },

    toBBox: function (item) { return item; },

    compareMinX: compareNodeMinX,
    compareMinY: compareNodeMinY,

    toJSON: function () { return this.data; },

    fromJSON: function (data) {
        this.data = data;
        return this;
    },

    _all: function (node, result) {
        var nodesToSearch = [];
        while (node) {
            if (node.leaf) result.push.apply(result, node.children);
            else nodesToSearch.push.apply(nodesToSearch, node.children);

            node = nodesToSearch.pop();
        }
        return result;
    },

    _build: function (items, left, right, height) {

        var N = right - left + 1,
            M = this._maxEntries,
            node;

        if (N <= M) {
            // reached leaf level; return leaf
            node = createNode(items.slice(left, right + 1));
            calcBBox(node, this.toBBox);
            return node;
        }

        if (!height) {
            // target height of the bulk-loaded tree
            height = Math.ceil(Math.log(N) / Math.log(M));

            // target number of root entries to maximize storage utilization
            M = Math.ceil(N / Math.pow(M, height - 1));
        }

        node = createNode([]);
        node.leaf = false;
        node.height = height;

        // split the items into M mostly square tiles

        var N2 = Math.ceil(N / M),
            N1 = N2 * Math.ceil(Math.sqrt(M)),
            i, j, right2, right3;

        multiSelect(items, left, right, N1, this.compareMinX);

        for (i = left; i <= right; i += N1) {

            right2 = Math.min(i + N1 - 1, right);

            multiSelect(items, i, right2, N2, this.compareMinY);

            for (j = i; j <= right2; j += N2) {

                right3 = Math.min(j + N2 - 1, right2);

                // pack each entry recursively
                node.children.push(this._build(items, j, right3, height - 1));
            }
        }

        calcBBox(node, this.toBBox);

        return node;
    },

    _chooseSubtree: function (bbox, node, level, path) {

        var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;

        while (true) {
            path.push(node);

            if (node.leaf || path.length - 1 === level) break;

            minArea = minEnlargement = Infinity;

            for (i = 0, len = node.children.length; i < len; i++) {
                child = node.children[i];
                area = bboxArea(child);
                enlargement = enlargedArea(bbox, child) - area;

                // choose entry with the least area enlargement
                if (enlargement < minEnlargement) {
                    minEnlargement = enlargement;
                    minArea = area < minArea ? area : minArea;
                    targetNode = child;

                } else if (enlargement === minEnlargement) {
                    // otherwise choose one with the smallest area
                    if (area < minArea) {
                        minArea = area;
                        targetNode = child;
                    }
                }
            }

            node = targetNode || node.children[0];
        }

        return node;
    },

    _insert: function (item, level, isNode) {

        var toBBox = this.toBBox,
            bbox = isNode ? item : toBBox(item),
            insertPath = [];

        // find the best node for accommodating the item, saving all nodes along the path too
        var node = this._chooseSubtree(bbox, this.data, level, insertPath);

        // put the item into the node
        node.children.push(item);
        extend(node, bbox);

        // split on node overflow; propagate upwards if necessary
        while (level >= 0) {
            if (insertPath[level].children.length > this._maxEntries) {
                this._split(insertPath, level);
                level--;
            } else break;
        }

        // adjust bboxes along the insertion path
        this._adjustParentBBoxes(bbox, insertPath, level);
    },

    // split overflowed node into two
    _split: function (insertPath, level) {

        var node = insertPath[level],
            M = node.children.length,
            m = this._minEntries;

        this._chooseSplitAxis(node, m, M);

        var splitIndex = this._chooseSplitIndex(node, m, M);

        var newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
        newNode.height = node.height;
        newNode.leaf = node.leaf;

        calcBBox(node, this.toBBox);
        calcBBox(newNode, this.toBBox);

        if (level) insertPath[level - 1].children.push(newNode);
        else this._splitRoot(node, newNode);
    },

    _splitRoot: function (node, newNode) {
        // split root node
        this.data = createNode([node, newNode]);
        this.data.height = node.height + 1;
        this.data.leaf = false;
        calcBBox(this.data, this.toBBox);
    },

    _chooseSplitIndex: function (node, m, M) {

        var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

        minOverlap = minArea = Infinity;

        for (i = m; i <= M - m; i++) {
            bbox1 = distBBox(node, 0, i, this.toBBox);
            bbox2 = distBBox(node, i, M, this.toBBox);

            overlap = intersectionArea(bbox1, bbox2);
            area = bboxArea(bbox1) + bboxArea(bbox2);

            // choose distribution with minimum overlap
            if (overlap < minOverlap) {
                minOverlap = overlap;
                index = i;

                minArea = area < minArea ? area : minArea;

            } else if (overlap === minOverlap) {
                // otherwise choose distribution with minimum area
                if (area < minArea) {
                    minArea = area;
                    index = i;
                }
            }
        }

        return index;
    },

    // sorts node children by the best axis for split
    _chooseSplitAxis: function (node, m, M) {

        var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX,
            compareMinY = node.leaf ? this.compareMinY : compareNodeMinY,
            xMargin = this._allDistMargin(node, m, M, compareMinX),
            yMargin = this._allDistMargin(node, m, M, compareMinY);

        // if total distributions margin value is minimal for x, sort by minX,
        // otherwise it's already sorted by minY
        if (xMargin < yMargin) node.children.sort(compareMinX);
    },

    // total margin of all possible split distributions where each node is at least m full
    _allDistMargin: function (node, m, M, compare) {

        node.children.sort(compare);

        var toBBox = this.toBBox,
            leftBBox = distBBox(node, 0, m, toBBox),
            rightBBox = distBBox(node, M - m, M, toBBox),
            margin = bboxMargin(leftBBox) + bboxMargin(rightBBox),
            i, child;

        for (i = m; i < M - m; i++) {
            child = node.children[i];
            extend(leftBBox, node.leaf ? toBBox(child) : child);
            margin += bboxMargin(leftBBox);
        }

        for (i = M - m - 1; i >= m; i--) {
            child = node.children[i];
            extend(rightBBox, node.leaf ? toBBox(child) : child);
            margin += bboxMargin(rightBBox);
        }

        return margin;
    },

    _adjustParentBBoxes: function (bbox, path, level) {
        // adjust bboxes along the given tree path
        for (var i = level; i >= 0; i--) {
            extend(path[i], bbox);
        }
    },

    _condense: function (path) {
        // go through the path, removing empty nodes and updating bboxes
        for (var i = path.length - 1, siblings; i >= 0; i--) {
            if (path[i].children.length === 0) {
                if (i > 0) {
                    siblings = path[i - 1].children;
                    siblings.splice(siblings.indexOf(path[i]), 1);

                } else this.clear();

            } else calcBBox(path[i], this.toBBox);
        }
    },

    _initFormat: function (format) {
        // data format (minX, minY, maxX, maxY accessors)

        // uses eval-type function compilation instead of just accepting a toBBox function
        // because the algorithms are very sensitive to sorting functions performance,
        // so they should be dead simple and without inner calls

        var compareArr = ['return a', ' - b', ';'];

        this.compareMinX = new Function('a', 'b', compareArr.join(format[0]));
        this.compareMinY = new Function('a', 'b', compareArr.join(format[1]));

        this.toBBox = new Function('a',
            'return {minX: a' + format[0] +
            ', minY: a' + format[1] +
            ', maxX: a' + format[2] +
            ', maxY: a' + format[3] + '};');
    }
};

function findItem(item, items, equalsFn) {
    if (!equalsFn) return items.indexOf(item);

    for (var i = 0; i < items.length; i++) {
        if (equalsFn(item, items[i])) return i;
    }
    return -1;
}

// calculate node's bbox from bboxes of its children
function calcBBox(node, toBBox) {
    distBBox(node, 0, node.children.length, toBBox, node);
}

// min bounding rectangle of node children from k to p-1
function distBBox(node, k, p, toBBox, destNode) {
    if (!destNode) destNode = createNode(null);
    destNode.minX = Infinity;
    destNode.minY = Infinity;
    destNode.maxX = -Infinity;
    destNode.maxY = -Infinity;

    for (var i = k, child; i < p; i++) {
        child = node.children[i];
        extend(destNode, node.leaf ? toBBox(child) : child);
    }

    return destNode;
}

function extend(a, b) {
    a.minX = Math.min(a.minX, b.minX);
    a.minY = Math.min(a.minY, b.minY);
    a.maxX = Math.max(a.maxX, b.maxX);
    a.maxY = Math.max(a.maxY, b.maxY);
    return a;
}

function compareNodeMinX(a, b) { return a.minX - b.minX; }
function compareNodeMinY(a, b) { return a.minY - b.minY; }

function bboxArea(a)   { return (a.maxX - a.minX) * (a.maxY - a.minY); }
function bboxMargin(a) { return (a.maxX - a.minX) + (a.maxY - a.minY); }

function enlargedArea(a, b) {
    return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
           (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
}

function intersectionArea(a, b) {
    var minX = Math.max(a.minX, b.minX),
        minY = Math.max(a.minY, b.minY),
        maxX = Math.min(a.maxX, b.maxX),
        maxY = Math.min(a.maxY, b.maxY);

    return Math.max(0, maxX - minX) *
           Math.max(0, maxY - minY);
}

function contains(a, b) {
    return a.minX <= b.minX &&
           a.minY <= b.minY &&
           b.maxX <= a.maxX &&
           b.maxY <= a.maxY;
}

function intersects(a, b) {
    return b.minX <= a.maxX &&
           b.minY <= a.maxY &&
           b.maxX >= a.minX &&
           b.maxY >= a.minY;
}

function createNode(children) {
    return {
        children: children,
        height: 1,
        leaf: true,
        minX: Infinity,
        minY: Infinity,
        maxX: -Infinity,
        maxY: -Infinity
    };
}

// sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
// combines selection algorithm with binary divide & conquer approach

function multiSelect(arr, left, right, n, compare) {
    var stack = [left, right],
        mid;

    while (stack.length) {
        right = stack.pop();
        left = stack.pop();

        if (right - left <= n) continue;

        mid = left + Math.ceil((right - left) / n / 2) * n;
        quickselect(arr, mid, left, right, compare);

        stack.push(left, mid, mid, right);
    }
}
rbush_1.default = default_1;

var rngBrowser = createCommonjsModule(function (module) {
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && msCrypto.getRandomValues.bind(msCrypto));
if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}
});

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

var bytesToUuid_1 = bytesToUuid;

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rngBrowser();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid_1(b);
}

var v1_1 = v1;

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rngBrowser)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid_1(rnds);
}

var v4_1 = v4;

var uuid = v4_1;
uuid.v1 = v1_1;
uuid.v4 = v4_1;

var uuid_1 = uuid;

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

    _this.data = data;

    _this._tree = rbush_1();

    _this._columns = [];
    _this._dirty = true;

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
    this.data = data;
    var _ref = [this.data[0], this.data[1]],
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
        var point = ol.proj.transform([lon, lat], _projection, 'EPSG:4326');
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
      bbox: extent,
      id: uuid_1()
    };
    this._tree.insert(extent, data);
    return data.id;
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

    var searches = this._tree.search(_extent);
    var count = searches && searches.length;
    var divCount = Math.sqrt(count) || 1;
    var expand = Math.max(_extent[2] - _extent[0], _extent[3] - _extent[1]) / divCount;
    var tryExpand, tryCount;

    this._gridColCount = Math.ceil((_extent[2] - _extent[0]) / gridSize);
    this._gridRowCount = Math.ceil((_extent[3] - _extent[1]) / gridSize);
    var grid = [];
    for (var j = 0, jLen = this._gridRowCount + 1; j < jLen; j++) {
      var y = _extent[1] + j * gridSize;
      if (y >= _extent[1] && y <= _extent[3]) {
        var row = [];
        for (var i = 0, iLen = this._gridColCount + 1; i < iLen; i++) {
          var x = _extent[0] + i * gridSize;
          row[i] = this._interpolate(x, y, [x - expand, y - expand, x + expand, y + expand]);
          tryCount = 1;
          while (row[i][2] === null && tryCount <= this._options.searchSteps) {
            tryCount *= 2;
            tryExpand = tryCount * expand;
            row[i] = this._interpolate(x, y, [x - tryExpand, y - tryExpand, x + tryExpand, y + tryExpand]);
          }
        }
        grid[j] = row;
      }
    }
    this._columns = grid;
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
    this._tree.clear();
    this.particles = null;
    this._clearContext();
    this._dirty = true;
    return this;
  };

  WindyLayer.prototype.calcField = function calcField(pixel) {
    var map = this.getMap();
    var extent = this._getExtent();
    var all = this._tree.all();
    var count = all && all.length;
    var divCount = Math.sqrt(count) || 1;
    var expand = Math.max(extent[2] - extent[0], extent[3] - extent[1]) / divCount;
    var coordinate = map.getCoordinateFromPixel(pixel);
    if (count > 0) {
      var i = 1;
      var searched = void 0,
          searchedExtent = void 0;
      do {
        searchedExtent = [coordinate[0] - i * expand, coordinate[1] - i * expand, coordinate[0] + i * expand, coordinate[1] + i * expand];
        searched = this._tree.search(searchedExtent);
        i *= 2;
      } while (!searched || searched.length === 0);
      return this._interpolate(coordinate[0], coordinate[1], searchedExtent);
    } else {
      return NULL_WIND_VECTOR;
    }
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
      this._particles = this._getParticles(this._gridColCount * this._gridRowCount * this._options.particleCountFactor);
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

      for (var i = 0; i < this._batches.length; i++) {
        var batch = this._batches[i];
        context.beginPath();
        context.strokeStyle = this._options.colors[i];
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

  WindyLayer.prototype._randomize = function _randomize(age) {
    return {
      x: Math.round(Math.random() * this._gridColCount),
      y: Math.round(Math.random() * this._gridRowCount),
      age: age === undefined ? Math.floor(Math.random() * this._options.maxParticleAge) : age
    };
  };

  WindyLayer.prototype._getParticles = function _getParticles(particleCount) {
    var particles = this._particles || [];
    if (particles.length > particleCount) particles = particles.slice(0, particleCount);
    for (var i = particles.length; i < particleCount; i++) {
      particles.push(this._randomize(~~(Math.random() * this._options.maxParticleAge) + 0));
    }
    this._particles = particles;
    return particles;
  };

  WindyLayer.prototype._getField = function _getField(x, y) {
    if (!this._columns) return NULL_WIND_VECTOR;
    var column = this._columns[Math.round(x)];

    return column && column[Math.round(y)] || NULL_WIND_VECTOR;
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
        particle = particles[i] = this._randomize(0);
      }
      var _ref3 = [particle.x, particle.y],
          x = _ref3[0],
          y = _ref3[1];

      var v = this._getField(x, y);
      if (!v[2]) {
        particle = particles[i] = this._randomize(0);
      } else {
        particle.xt = x + v[0] * fieldScale;
        particle.yt = y + v[1] * fieldScale;
        batches[this._colorIndex(v[2])].push(particle);
      }
      particle.age++;
    }
    this._batches = batches;
  };

  WindyLayer.prototype._interpolate = function _interpolate(x, y, searchExtent) {
    var searches = this._tree.search(searchExtent);
    if (!searches) {
      return NULL_WIND_VECTOR;
    }
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
