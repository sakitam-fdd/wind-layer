/*!
 * author: sakitam-fdd <smilefdd@gmail.com> 
 * wind-layer v0.1.2
 * build-time: 2020-2-23 16:31
 * LICENSE: MIT
 * (c) 2017-2020 https://sakitam-fdd.github.io/wind-layer
 */
import { Layer } from 'ol/layer';
import { Map } from 'ol';

/**
 * @module ol/util
 */
/**
 * @return {?} Any return.
 */
function abstract() {
    return /** @type {?} */ ((function () {
        throw new Error('Unimplemented abstract method.');
    })());
}
/**
 * Counter for getUid.
 * @type {number}
 * @private
 */
var uidCounter_ = 0;
/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. Unique IDs are generated
 * as a strictly increasing sequence. Adapted from goog.getUid.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {string} The unique ID for the object.
 * @api
 */
function getUid(obj) {
    return obj.ol_uid || (obj.ol_uid = String(++uidCounter_));
}
/**
 * OpenLayers version.
 * @type {string}
 */
var VERSION = '6.2.1';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Error object thrown when an assertion failed. This is an ECMA-262 Error,
 * extended with a `code` property.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error.
 */
var AssertionError = /** @class */ (function (_super) {
    __extends(AssertionError, _super);
    /**
     * @param {number} code Error code.
     */
    function AssertionError(code) {
        var _this = this;
        var path = 'v' + VERSION.split('-')[0];
        var message = 'Assertion failed. See https://openlayers.org/en/' + path +
            '/doc/errors/#' + code + ' for details.';
        _this = _super.call(this, message) || this;
        /**
         * Error code. The meaning of the code can be found on
         * https://openlayers.org/en/latest/doc/errors/ (replace `latest` with
         * the version found in the OpenLayers script's header comment if a version
         * other than the latest is used).
         * @type {number}
         * @api
         */
        _this.code = code;
        /**
         * @type {string}
         */
        _this.name = 'AssertionError';
        // Re-assign message, see https://github.com/Rich-Harris/buble/issues/40
        _this.message = message;
        return _this;
    }
    return AssertionError;
}(Error));

/**
 * @module ol/asserts
 */
/**
 * @param {*} assertion Assertion we expected to be truthy.
 * @param {number} errorCode Error code.
 */
function assert(assertion, errorCode) {
    if (!assertion) {
        throw new AssertionError(errorCode);
    }
}

/**
 * @module ol/extent/Corner
 */

/**
 * @module ol/extent/Relationship
 */

/**
 * @module ol/extent
 */
/**
 * @param {Array<number>} xs Xs.
 * @param {Array<number>} ys Ys.
 * @param {Extent=} opt_extent Destination extent.
 * @private
 * @return {Extent} Extent.
 */
function _boundingExtentXYs(xs, ys, opt_extent) {
    var minX = Math.min.apply(null, xs);
    var minY = Math.min.apply(null, ys);
    var maxX = Math.max.apply(null, xs);
    var maxY = Math.max.apply(null, ys);
    return createOrUpdate(minX, minY, maxX, maxY, opt_extent);
}
/**
 * Check if one extent contains another.
 *
 * An extent is deemed contained if it lies completely within the other extent,
 * including if they share one or more edges.
 *
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent 2.
 * @return {boolean} The second extent is contained by or on the edge of the
 *     first.
 * @api
 */
function containsExtent(extent1, extent2) {
    return extent1[0] <= extent2[0] && extent2[2] <= extent1[2] &&
        extent1[1] <= extent2[1] && extent2[3] <= extent1[3];
}
/**
 * Create an empty extent.
 * @return {Extent} Empty extent.
 * @api
 */
function createEmpty() {
    return [Infinity, Infinity, -Infinity, -Infinity];
}
/**
 * Create a new extent or update the provided extent.
 * @param {number} minX Minimum X.
 * @param {number} minY Minimum Y.
 * @param {number} maxX Maximum X.
 * @param {number} maxY Maximum Y.
 * @param {Extent=} opt_extent Destination extent.
 * @return {Extent} Extent.
 */
function createOrUpdate(minX, minY, maxX, maxY, opt_extent) {
    if (opt_extent) {
        opt_extent[0] = minX;
        opt_extent[1] = minY;
        opt_extent[2] = maxX;
        opt_extent[3] = maxY;
        return opt_extent;
    }
    else {
        return [minX, minY, maxX, maxY];
    }
}
/**
 * Create a new empty extent or make the provided one empty.
 * @param {Extent=} opt_extent Extent.
 * @return {Extent} Extent.
 */
function createOrUpdateEmpty(opt_extent) {
    return createOrUpdate(Infinity, Infinity, -Infinity, -Infinity, opt_extent);
}
/**
 * Get the bottom left coordinate of an extent.
 * @param {Extent} extent Extent.
 * @return {import("./coordinate.js").Coordinate} Bottom left coordinate.
 * @api
 */
function getBottomLeft(extent) {
    return [extent[0], extent[1]];
}
/**
 * Get the bottom right coordinate of an extent.
 * @param {Extent} extent Extent.
 * @return {import("./coordinate.js").Coordinate} Bottom right coordinate.
 * @api
 */
function getBottomRight(extent) {
    return [extent[2], extent[1]];
}
/**
 * Get the intersection of two extents.
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent 2.
 * @param {Extent=} opt_extent Optional extent to populate with intersection.
 * @return {Extent} Intersecting extent.
 * @api
 */
function getIntersection(extent1, extent2, opt_extent) {
    var intersection = opt_extent ? opt_extent : createEmpty();
    if (intersects(extent1, extent2)) {
        if (extent1[0] > extent2[0]) {
            intersection[0] = extent1[0];
        }
        else {
            intersection[0] = extent2[0];
        }
        if (extent1[1] > extent2[1]) {
            intersection[1] = extent1[1];
        }
        else {
            intersection[1] = extent2[1];
        }
        if (extent1[2] < extent2[2]) {
            intersection[2] = extent1[2];
        }
        else {
            intersection[2] = extent2[2];
        }
        if (extent1[3] < extent2[3]) {
            intersection[3] = extent1[3];
        }
        else {
            intersection[3] = extent2[3];
        }
    }
    else {
        createOrUpdateEmpty(intersection);
    }
    return intersection;
}
/**
 * Get the top left coordinate of an extent.
 * @param {Extent} extent Extent.
 * @return {import("./coordinate.js").Coordinate} Top left coordinate.
 * @api
 */
function getTopLeft(extent) {
    return [extent[0], extent[3]];
}
/**
 * Get the top right coordinate of an extent.
 * @param {Extent} extent Extent.
 * @return {import("./coordinate.js").Coordinate} Top right coordinate.
 * @api
 */
function getTopRight(extent) {
    return [extent[2], extent[3]];
}
/**
 * Determine if one extent intersects another.
 * @param {Extent} extent1 Extent 1.
 * @param {Extent} extent2 Extent.
 * @return {boolean} The two extents intersect.
 * @api
 */
function intersects(extent1, extent2) {
    return extent1[0] <= extent2[2] &&
        extent1[2] >= extent2[0] &&
        extent1[1] <= extent2[3] &&
        extent1[3] >= extent2[1];
}
/**
 * Determine if an extent is empty.
 * @param {Extent} extent Extent.
 * @return {boolean} Is empty.
 * @api
 */
function isEmpty(extent) {
    return extent[2] < extent[0] || extent[3] < extent[1];
}
/**
 * Apply a transform function to the extent.
 * @param {Extent} extent Extent.
 * @param {import("./proj.js").TransformFunction} transformFn Transform function.
 * Called with `[minX, minY, maxX, maxY]` extent coordinates.
 * @param {Extent=} opt_extent Destination extent.
 * @return {Extent} Extent.
 * @api
 */
function applyTransform(extent, transformFn, opt_extent) {
    var coordinates = [
        extent[0], extent[1],
        extent[0], extent[3],
        extent[2], extent[1],
        extent[2], extent[3]
    ];
    transformFn(coordinates, coordinates, 2);
    var xs = [coordinates[0], coordinates[2], coordinates[4], coordinates[6]];
    var ys = [coordinates[1], coordinates[3], coordinates[5], coordinates[7]];
    return _boundingExtentXYs(xs, ys, opt_extent);
}

/**
 * @module ol/dom
 */
/**
 * Create an html canvas element and returns its 2d context.
 * @param {number=} opt_width Canvas width.
 * @param {number=} opt_height Canvas height.
 * @param {Array<HTMLCanvasElement>=} opt_canvasPool Canvas pool to take existing canvas from.
 * @return {CanvasRenderingContext2D} The context.
 */
function createCanvasContext2D(opt_width, opt_height, opt_canvasPool) {
    var canvas = opt_canvasPool && opt_canvasPool.length ?
        opt_canvasPool.shift() : document.createElement('canvas');
    if (opt_width) {
        canvas.width = opt_width;
    }
    if (opt_height) {
        canvas.height = opt_height;
    }
    return canvas.getContext('2d');
}

/**
 * @module ol/events/Event
 */
/**
 * @classdesc
 * Stripped down implementation of the W3C DOM Level 2 Event interface.
 * See https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-interface.
 *
 * This implementation only provides `type` and `target` properties, and
 * `stopPropagation` and `preventDefault` methods. It is meant as base class
 * for higher level events defined in the library, and works with
 * {@link module:ol/events/Target~Target}.
 */
var BaseEvent = /** @class */ (function () {
    /**
     * @param {string} type Type.
     */
    function BaseEvent(type) {
        /**
         * @type {boolean}
         */
        this.propagationStopped;
        /**
         * The event type.
         * @type {string}
         * @api
         */
        this.type = type;
        /**
         * The event target.
         * @type {Object}
         * @api
         */
        this.target = null;
    }
    /**
     * Stop event propagation.
     * @api
     */
    BaseEvent.prototype.preventDefault = function () {
        this.propagationStopped = true;
    };
    /**
     * Stop event propagation.
     * @api
     */
    BaseEvent.prototype.stopPropagation = function () {
        this.propagationStopped = true;
    };
    return BaseEvent;
}());

/**
 * @module ol/render/Event
 */
var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var RenderEvent = /** @class */ (function (_super) {
    __extends$1(RenderEvent, _super);
    /**
     * @param {import("./EventType.js").default} type Type.
     * @param {import("../transform.js").Transform=} opt_inversePixelTransform Transform for
     *     CSS pixels to rendered pixels.
     * @param {import("../PluggableMap.js").FrameState=} opt_frameState Frame state.
     * @param {?CanvasRenderingContext2D=} opt_context Context.
     */
    function RenderEvent(type, opt_inversePixelTransform, opt_frameState, opt_context) {
        var _this = _super.call(this, type) || this;
        /**
         * Transform from CSS pixels (relative to the top-left corner of the map viewport)
         * to rendered pixels on this event's `context`.
         * @type {import("../transform.js").Transform|undefined}
         * @api
         */
        _this.inversePixelTransform = opt_inversePixelTransform;
        /**
         * An object representing the current render frame state.
         * @type {import("../PluggableMap.js").FrameState|undefined}
         * @api
         */
        _this.frameState = opt_frameState;
        /**
         * Canvas context. Not available when the event is dispatched by the map. Only available
         * when a Canvas renderer is used, null otherwise.
         * @type {CanvasRenderingContext2D|null|undefined}
         * @api
         */
        _this.context = opt_context;
        return _this;
    }
    return RenderEvent;
}(BaseEvent));

/**
 * @module ol/render/EventType
 */
/**
 * @enum {string}
 */
var RenderEventType = {
    /**
     * Triggered before a layer is rendered.
     * @event module:ol/render/Event~RenderEvent#prerender
     * @api
     */
    PRERENDER: 'prerender',
    /**
     * Triggered after a layer is rendered.
     * @event module:ol/render/Event~RenderEvent#postrender
     * @api
     */
    POSTRENDER: 'postrender',
    /**
     * Triggered before layers are rendered.
     * The event object will not have a `context` set.
     * @event module:ol/render/Event~RenderEvent#precompose
     * @api
     */
    PRECOMPOSE: 'precompose',
    /**
     * Triggered after all layers are rendered.
     * The event object will not have a `context` set.
     * @event module:ol/render/Event~RenderEvent#postcompose
     * @api
     */
    POSTCOMPOSE: 'postcompose',
    /**
     * Triggered when rendering is complete, i.e. all sources and tiles have
     * finished loading for the current viewport, and all tiles are faded in.
     * The event object will not have a `context` set.
     * @event module:ol/render/Event~RenderEvent#rendercomplete
     * @api
     */
    RENDERCOMPLETE: 'rendercomplete'
};

/**
 * @module ol/css
 */

/**
 * @module ol/obj
 */
/**
 * Polyfill for Object.assign().  Assigns enumerable and own properties from
 * one or more source objects to a target object.
 * See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign.
 *
 * @param {!Object} target The target object.
 * @param {...Object} var_sources The source object(s).
 * @return {!Object} The modified target object.
 */
var assign = (typeof Object.assign === 'function') ? Object.assign : function (target, var_sources) {
    var arguments$1 = arguments;

    if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    var output = Object(target);
    for (var i = 1, ii = arguments.length; i < ii; ++i) {
        var source = arguments$1[i];
        if (source !== undefined && source !== null) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    output[key] = source[key];
                }
            }
        }
    }
    return output;
};
/**
 * Removes all properties from an object.
 * @param {Object} object The object to clear.
 */
function clear(object) {
    for (var property in object) {
        delete object[property];
    }
}

/**
 * @module ol/ObjectEventType
 */
/**
 * @enum {string}
 */
var ObjectEventType = {
    /**
     * Triggered when a property is changed.
     * @event module:ol/Object.ObjectEvent#propertychange
     * @api
     */
    PROPERTYCHANGE: 'propertychange'
};

/**
 * @module ol/events
 */
/**
 * Key to use with {@link module:ol/Observable~Observable#unByKey}.
 * @typedef {Object} EventsKey
 * @property {ListenerFunction} listener
 * @property {import("./events/Target.js").EventTargetLike} target
 * @property {string} type
 * @api
 */
/**
 * Listener function. This function is called with an event object as argument.
 * When the function returns `false`, event propagation will stop.
 *
 * @typedef {function((Event|import("./events/Event.js").default)): (void|boolean)} ListenerFunction
 * @api
 */
/**
 * Registers an event listener on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * This function efficiently binds a `listener` to a `this` object, and returns
 * a key for use with {@link module:ol/events~unlistenByKey}.
 *
 * @param {import("./events/Target.js").EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ListenerFunction} listener Listener.
 * @param {Object=} opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 * @param {boolean=} opt_once If true, add the listener as one-off listener.
 * @return {EventsKey} Unique key for the listener.
 */
function listen(target, type, listener, opt_this, opt_once) {
    if (opt_this && opt_this !== target) {
        listener = listener.bind(opt_this);
    }
    if (opt_once) {
        var originalListener_1 = listener;
        listener = function () {
            target.removeEventListener(type, listener);
            originalListener_1.apply(this, arguments);
        };
    }
    var eventsKey = {
        target: target,
        type: type,
        listener: listener
    };
    target.addEventListener(type, listener);
    return eventsKey;
}
/**
 * Registers a one-off event listener on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * This function efficiently binds a `listener` as self-unregistering listener
 * to a `this` object, and returns a key for use with
 * {@link module:ol/events~unlistenByKey} in case the listener needs to be
 * unregistered before it is called.
 *
 * When {@link module:ol/events~listen} is called with the same arguments after this
 * function, the self-unregistering listener will be turned into a permanent
 * listener.
 *
 * @param {import("./events/Target.js").EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ListenerFunction} listener Listener.
 * @param {Object=} opt_this Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 * @return {EventsKey} Key for unlistenByKey.
 */
function listenOnce(target, type, listener, opt_this) {
    return listen(target, type, listener, opt_this, true);
}

/**
 * @module ol/Disposable
 */
/**
 * @classdesc
 * Objects that need to clean up after themselves.
 */
var Disposable = /** @class */ (function () {
    function Disposable() {
        /**
         * The object has already been disposed.
         * @type {boolean}
         * @private
         */
        this.disposed_ = false;
    }
    /**
     * Clean up.
     */
    Disposable.prototype.dispose = function () {
        if (!this.disposed_) {
            this.disposed_ = true;
            this.disposeInternal();
        }
    };
    /**
     * Extension point for disposable objects.
     * @protected
     */
    Disposable.prototype.disposeInternal = function () { };
    return Disposable;
}());

/**
 * @module ol/array
 */

/**
 * @module ol/functions
 */
/**
 * A reusable function, used e.g. as a default for callbacks.
 *
 * @return {void} Nothing.
 */
function VOID() { }

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @typedef {EventTarget|Target} EventTargetLike
 */
/**
 * @classdesc
 * A simplified implementation of the W3C DOM Level 2 EventTarget interface.
 * See https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget.
 *
 * There are two important simplifications compared to the specification:
 *
 * 1. The handling of `useCapture` in `addEventListener` and
 *    `removeEventListener`. There is no real capture model.
 * 2. The handling of `stopPropagation` and `preventDefault` on `dispatchEvent`.
 *    There is no event target hierarchy. When a listener calls
 *    `stopPropagation` or `preventDefault` on an event object, it means that no
 *    more listeners after this one will be called. Same as when the listener
 *    returns false.
 */
var Target = /** @class */ (function (_super) {
    __extends$2(Target, _super);
    /**
     * @param {*=} opt_target Default event target for dispatched events.
     */
    function Target(opt_target) {
        var _this = _super.call(this) || this;
        /**
         * @private
         * @type {*}
         */
        _this.eventTarget_ = opt_target;
        /**
         * @private
         * @type {!Object<string, number>}
         */
        _this.pendingRemovals_ = {};
        /**
         * @private
         * @type {!Object<string, number>}
         */
        _this.dispatching_ = {};
        /**
         * @private
         * @type {!Object<string, Array<import("../events.js").ListenerFunction>>}
         */
        _this.listeners_ = {};
        return _this;
    }
    /**
     * @param {string} type Type.
     * @param {import("../events.js").ListenerFunction} listener Listener.
     */
    Target.prototype.addEventListener = function (type, listener) {
        if (!type || !listener) {
            return;
        }
        var listeners = this.listeners_[type];
        if (!listeners) {
            listeners = [];
            this.listeners_[type] = listeners;
        }
        if (listeners.indexOf(listener) === -1) {
            listeners.push(listener);
        }
    };
    /**
     * Dispatches an event and calls all listeners listening for events
     * of this type. The event parameter can either be a string or an
     * Object with a `type` property.
     *
     * @param {{type: string,
     *     target: (EventTargetLike|undefined),
     *     propagationStopped: (boolean|undefined)}|
     *     import("./Event.js").default|string} event Event object.
     * @return {boolean|undefined} `false` if anyone called preventDefault on the
     *     event object or if any of the listeners returned false.
     * @api
     */
    Target.prototype.dispatchEvent = function (event) {
        var evt = typeof event === 'string' ? new BaseEvent(event) : event;
        var type = evt.type;
        if (!evt.target) {
            evt.target = this.eventTarget_ || this;
        }
        var listeners = this.listeners_[type];
        var propagate;
        if (listeners) {
            if (!(type in this.dispatching_)) {
                this.dispatching_[type] = 0;
                this.pendingRemovals_[type] = 0;
            }
            ++this.dispatching_[type];
            for (var i = 0, ii = listeners.length; i < ii; ++i) {
                if (listeners[i].call(this, evt) === false || evt.propagationStopped) {
                    propagate = false;
                    break;
                }
            }
            --this.dispatching_[type];
            if (this.dispatching_[type] === 0) {
                var pendingRemovals = this.pendingRemovals_[type];
                delete this.pendingRemovals_[type];
                while (pendingRemovals--) {
                    this.removeEventListener(type, VOID);
                }
                delete this.dispatching_[type];
            }
            return propagate;
        }
    };
    /**
     * @inheritDoc
     */
    Target.prototype.disposeInternal = function () {
        clear(this.listeners_);
    };
    /**
     * Get the listeners for a specified event type. Listeners are returned in the
     * order that they will be called in.
     *
     * @param {string} type Type.
     * @return {Array<import("../events.js").ListenerFunction>} Listeners.
     */
    Target.prototype.getListeners = function (type) {
        return this.listeners_[type];
    };
    /**
     * @param {string=} opt_type Type. If not provided,
     *     `true` will be returned if this event target has any listeners.
     * @return {boolean} Has listeners.
     */
    Target.prototype.hasListener = function (opt_type) {
        return opt_type ?
            opt_type in this.listeners_ :
            Object.keys(this.listeners_).length > 0;
    };
    /**
     * @param {string} type Type.
     * @param {import("../events.js").ListenerFunction} listener Listener.
     */
    Target.prototype.removeEventListener = function (type, listener) {
        var listeners = this.listeners_[type];
        if (listeners) {
            var index = listeners.indexOf(listener);
            if (index !== -1) {
                if (type in this.pendingRemovals_) {
                    // make listener a no-op, and remove later in #dispatchEvent()
                    listeners[index] = VOID;
                    ++this.pendingRemovals_[type];
                }
                else {
                    listeners.splice(index, 1);
                    if (listeners.length === 0) {
                        delete this.listeners_[type];
                    }
                }
            }
        }
    };
    return Target;
}(Disposable));

/**
 * @module ol/events/EventType
 */
/**
 * @enum {string}
 * @const
 */
var EventType = {
    /**
     * Generic change event. Triggered when the revision counter is increased.
     * @event module:ol/events/Event~BaseEvent#change
     * @api
     */
    CHANGE: 'change',
    /**
     * Generic error event. Triggered when an error occurs.
     * @event module:ol/events/Event~BaseEvent#error
     * @api
     */
    ERROR: 'error',
    BLUR: 'blur',
    CLEAR: 'clear',
    CONTEXTMENU: 'contextmenu',
    CLICK: 'click',
    DBLCLICK: 'dblclick',
    DRAGENTER: 'dragenter',
    DRAGOVER: 'dragover',
    DROP: 'drop',
    FOCUS: 'focus',
    KEYDOWN: 'keydown',
    KEYPRESS: 'keypress',
    LOAD: 'load',
    RESIZE: 'resize',
    TOUCHMOVE: 'touchmove',
    WHEEL: 'wheel'
};

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * An event target providing convenient methods for listener registration
 * and unregistration. A generic `change` event is always available through
 * {@link module:ol/Observable~Observable#changed}.
 *
 * @fires import("./events/Event.js").default
 * @api
 */
var Observable = /** @class */ (function (_super) {
    __extends$3(Observable, _super);
    function Observable() {
        var _this = _super.call(this) || this;
        /**
         * @private
         * @type {number}
         */
        _this.revision_ = 0;
        return _this;
    }
    /**
     * Increases the revision counter and dispatches a 'change' event.
     * @api
     */
    Observable.prototype.changed = function () {
        ++this.revision_;
        this.dispatchEvent(EventType.CHANGE);
    };
    /**
     * Get the version number for this object.  Each time the object is modified,
     * its version number will be incremented.
     * @return {number} Revision.
     * @api
     */
    Observable.prototype.getRevision = function () {
        return this.revision_;
    };
    /**
     * Listen for a certain type of event.
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function(?): ?} listener The listener function.
     * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Unique key for the listener. If
     *     called with an array of event types as the first argument, the return
     *     will be an array of keys.
     * @api
     */
    Observable.prototype.on = function (type, listener) {
        if (Array.isArray(type)) {
            var len = type.length;
            var keys = new Array(len);
            for (var i = 0; i < len; ++i) {
                keys[i] = listen(this, type[i], listener);
            }
            return keys;
        }
        else {
            return listen(this, /** @type {string} */ (type), listener);
        }
    };
    /**
     * Listen once for a certain type of event.
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function(?): ?} listener The listener function.
     * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Unique key for the listener. If
     *     called with an array of event types as the first argument, the return
     *     will be an array of keys.
     * @api
     */
    Observable.prototype.once = function (type, listener) {
        if (Array.isArray(type)) {
            var len = type.length;
            var keys = new Array(len);
            for (var i = 0; i < len; ++i) {
                keys[i] = listenOnce(this, type[i], listener);
            }
            return keys;
        }
        else {
            return listenOnce(this, /** @type {string} */ (type), listener);
        }
    };
    /**
     * Unlisten for a certain type of event.
     * @param {string|Array<string>} type The event type or array of event types.
     * @param {function(?): ?} listener The listener function.
     * @api
     */
    Observable.prototype.un = function (type, listener) {
        if (Array.isArray(type)) {
            for (var i = 0, ii = type.length; i < ii; ++i) {
                this.removeEventListener(type[i], listener);
            }
        }
        else {
            this.removeEventListener(type, listener);
        }
    };
    return Observable;
}(Target));

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @classdesc
 * Events emitted by {@link module:ol/Object~BaseObject} instances are instances of this type.
 */
var ObjectEvent = /** @class */ (function (_super) {
    __extends$4(ObjectEvent, _super);
    /**
     * @param {string} type The event type.
     * @param {string} key The property name.
     * @param {*} oldValue The old value for `key`.
     */
    function ObjectEvent(type, key, oldValue) {
        var _this = _super.call(this, type) || this;
        /**
         * The name of the property whose value is changing.
         * @type {string}
         * @api
         */
        _this.key = key;
        /**
         * The old value. To get the new value use `e.target.get(e.key)` where
         * `e` is the event object.
         * @type {*}
         * @api
         */
        _this.oldValue = oldValue;
        return _this;
    }
    return ObjectEvent;
}(BaseEvent));
/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Most non-trivial classes inherit from this.
 *
 * This extends {@link module:ol/Observable} with observable
 * properties, where each property is observable as well as the object as a
 * whole.
 *
 * Classes that inherit from this have pre-defined properties, to which you can
 * add your owns. The pre-defined properties are listed in this documentation as
 * 'Observable Properties', and have their own accessors; for example,
 * {@link module:ol/Map~Map} has a `target` property, accessed with
 * `getTarget()` and changed with `setTarget()`. Not all properties are however
 * settable. There are also general-purpose accessors `get()` and `set()`. For
 * example, `get('target')` is equivalent to `getTarget()`.
 *
 * The `set` accessors trigger a change event, and you can monitor this by
 * registering a listener. For example, {@link module:ol/View~View} has a
 * `center` property, so `view.on('change:center', function(evt) {...});` would
 * call the function whenever the value of the center property changes. Within
 * the function, `evt.target` would be the view, so `evt.target.getCenter()`
 * would return the new center.
 *
 * You can add your own observable properties with
 * `object.set('prop', 'value')`, and retrieve that with `object.get('prop')`.
 * You can listen for changes on that property value with
 * `object.on('change:prop', listener)`. You can get a list of all
 * properties with {@link module:ol/Object~BaseObject#getProperties}.
 *
 * Note that the observable properties are separate from standard JS properties.
 * You can, for example, give your map object a title with
 * `map.title='New title'` and with `map.set('title', 'Another title')`. The
 * first will be a `hasOwnProperty`; the second will appear in
 * `getProperties()`. Only the second is observable.
 *
 * Properties can be deleted by using the unset method. E.g.
 * object.unset('foo').
 *
 * @fires ObjectEvent
 * @api
 */
var BaseObject = /** @class */ (function (_super) {
    __extends$4(BaseObject, _super);
    /**
     * @param {Object<string, *>=} opt_values An object with key-value pairs.
     */
    function BaseObject(opt_values) {
        var _this = _super.call(this) || this;
        // Call {@link module:ol/util~getUid} to ensure that the order of objects' ids is
        // the same as the order in which they were created.  This also helps to
        // ensure that object properties are always added in the same order, which
        // helps many JavaScript engines generate faster code.
        getUid(_this);
        /**
         * @private
         * @type {!Object<string, *>}
         */
        _this.values_ = {};
        if (opt_values !== undefined) {
            _this.setProperties(opt_values);
        }
        return _this;
    }
    /**
     * Gets a value.
     * @param {string} key Key name.
     * @return {*} Value.
     * @api
     */
    BaseObject.prototype.get = function (key) {
        var value;
        if (this.values_.hasOwnProperty(key)) {
            value = this.values_[key];
        }
        return value;
    };
    /**
     * Get a list of object property names.
     * @return {Array<string>} List of property names.
     * @api
     */
    BaseObject.prototype.getKeys = function () {
        return Object.keys(this.values_);
    };
    /**
     * Get an object of all property names and values.
     * @return {Object<string, *>} Object.
     * @api
     */
    BaseObject.prototype.getProperties = function () {
        return assign({}, this.values_);
    };
    /**
     * @param {string} key Key name.
     * @param {*} oldValue Old value.
     */
    BaseObject.prototype.notify = function (key, oldValue) {
        var eventType;
        eventType = getChangeEventType(key);
        this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
        eventType = ObjectEventType.PROPERTYCHANGE;
        this.dispatchEvent(new ObjectEvent(eventType, key, oldValue));
    };
    /**
     * Sets a value.
     * @param {string} key Key name.
     * @param {*} value Value.
     * @param {boolean=} opt_silent Update without triggering an event.
     * @api
     */
    BaseObject.prototype.set = function (key, value, opt_silent) {
        if (opt_silent) {
            this.values_[key] = value;
        }
        else {
            var oldValue = this.values_[key];
            this.values_[key] = value;
            if (oldValue !== value) {
                this.notify(key, oldValue);
            }
        }
    };
    /**
     * Sets a collection of key-value pairs.  Note that this changes any existing
     * properties and adds new ones (it does not remove any existing properties).
     * @param {Object<string, *>} values Values.
     * @param {boolean=} opt_silent Update without triggering an event.
     * @api
     */
    BaseObject.prototype.setProperties = function (values, opt_silent) {
        for (var key in values) {
            this.set(key, values[key], opt_silent);
        }
    };
    /**
     * Unsets a property.
     * @param {string} key Key name.
     * @param {boolean=} opt_silent Unset without triggering an event.
     * @api
     */
    BaseObject.prototype.unset = function (key, opt_silent) {
        if (key in this.values_) {
            var oldValue = this.values_[key];
            delete this.values_[key];
            if (!opt_silent) {
                this.notify(key, oldValue);
            }
        }
    };
    return BaseObject;
}(Observable));
/**
 * @type {Object<string, string>}
 */
var changeEventTypeCache = {};
/**
 * @param {string} key Key name.
 * @return {string} Change name.
 */
function getChangeEventType(key) {
    return changeEventTypeCache.hasOwnProperty(key) ?
        changeEventTypeCache[key] :
        (changeEventTypeCache[key] = 'change:' + key);
}

/**
 * @module ol/render/canvas
 */
/**
 * @type {BaseObject}
 */
var checkedFonts = new BaseObject();
/**
 * The label cache for text rendering. To change the default cache size of 2048
 * entries, use {@link module:ol/structs/LRUCache#setSize}.
 * Deprecated - there is no label cache any more.
 * @type {?}
 * @api
 * @deprecated
 */
var labelCache = new Target();
labelCache.setSize = function () {
    console.warn('labelCache is deprecated.'); //eslint-disable-line
};
/**
 * @param {CanvasRenderingContext2D} context Context.
 * @param {number} rotation Rotation.
 * @param {number} offsetX X offset.
 * @param {number} offsetY Y offset.
 */
function rotateAtOffset(context, rotation, offsetX, offsetY) {
    if (rotation !== 0) {
        context.translate(offsetX, offsetY);
        context.rotate(rotation);
        context.translate(-offsetX, -offsetY);
    }
}

/**
 * @module ol/ImageState
 */
/**
 * @enum {number}
 */
var ImageState = {
    IDLE: 0,
    LOADING: 1,
    LOADED: 2,
    ERROR: 3,
    EMPTY: 4
};

/**
 * @module ol/source/State
 */
/**
 * @enum {string}
 * State of the source, one of 'undefined', 'loading', 'ready' or 'error'.
 */
var SourceState = {
    UNDEFINED: 'undefined',
    LOADING: 'loading',
    READY: 'ready',
    ERROR: 'error'
};

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @template {import("../layer/Layer.js").default} LayerType
 */
var LayerRenderer = /** @class */ (function (_super) {
    __extends$5(LayerRenderer, _super);
    /**
     * @param {LayerType} layer Layer.
     */
    function LayerRenderer(layer) {
        var _this = _super.call(this) || this;
        /** @private */
        _this.boundHandleImageChange_ = _this.handleImageChange_.bind(_this);
        /**
         * @private
         * @type {LayerType}
         */
        _this.layer_ = layer;
        return _this;
    }
    /**
     * Asynchronous layer level hit detection.
     * @param {import("../pixel.js").Pixel} pixel Pixel.
     * @return {Promise<Array<import("../Feature").default>>} Promise that resolves with
     * an array of features.
     */
    LayerRenderer.prototype.getFeatures = function (pixel) {
        return abstract();
    };
    /**
     * Determine whether render should be called.
     * @abstract
     * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
     * @return {boolean} Layer is ready to be rendered.
     */
    LayerRenderer.prototype.prepareFrame = function (frameState) {
        return abstract();
    };
    /**
     * Render the layer.
     * @abstract
     * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
     * @param {HTMLElement} target Target that may be used to render content to.
     * @return {HTMLElement} The rendered element.
     */
    LayerRenderer.prototype.renderFrame = function (frameState, target) {
        return abstract();
    };
    /**
     * @param {Object<number, Object<string, import("../Tile.js").default>>} tiles Lookup of loaded tiles by zoom level.
     * @param {number} zoom Zoom level.
     * @param {import("../Tile.js").default} tile Tile.
     */
    LayerRenderer.prototype.loadedTileCallback = function (tiles, zoom, tile) {
        if (!tiles[zoom]) {
            tiles[zoom] = {};
        }
        tiles[zoom][tile.tileCoord.toString()] = tile;
    };
    /**
     * Create a function that adds loaded tiles to the tile lookup.
     * @param {import("../source/Tile.js").default} source Tile source.
     * @param {import("../proj/Projection.js").default} projection Projection of the tiles.
     * @param {Object<number, Object<string, import("../Tile.js").default>>} tiles Lookup of loaded tiles by zoom level.
     * @return {function(number, import("../TileRange.js").default):boolean} A function that can be
     *     called with a zoom level and a tile range to add loaded tiles to the lookup.
     * @protected
     */
    LayerRenderer.prototype.createLoadedTileFinder = function (source, projection, tiles) {
        return (
        /**
         * @param {number} zoom Zoom level.
         * @param {import("../TileRange.js").default} tileRange Tile range.
         * @return {boolean} The tile range is fully loaded.
         * @this {LayerRenderer}
         */
        function (zoom, tileRange) {
            var callback = this.loadedTileCallback.bind(this, tiles, zoom);
            return source.forEachLoadedTile(projection, zoom, tileRange, callback);
        }).bind(this);
    };
    /**
     * @abstract
     * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
     * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @param {function(import("../Feature.js").FeatureLike, import("../layer/Layer.js").default): T} callback Feature callback.
     * @param {Array<import("../Feature.js").FeatureLike>} declutteredFeatures Decluttered features.
     * @return {T|void} Callback result.
     * @template T
     */
    LayerRenderer.prototype.forEachFeatureAtCoordinate = function (coordinate, frameState, hitTolerance, callback, declutteredFeatures) { };
    /**
     * @abstract
     * @param {import("../pixel.js").Pixel} pixel Pixel.
     * @param {import("../PluggableMap.js").FrameState} frameState FrameState.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @return {Uint8ClampedArray|Uint8Array} The result.  If there is no data at the pixel
     *    location, null will be returned.  If there is data, but pixel values cannot be
     *    returned, and empty array will be returned.
     */
    LayerRenderer.prototype.getDataAtPixel = function (pixel, frameState, hitTolerance) {
        return abstract();
    };
    /**
     * @return {LayerType} Layer.
     */
    LayerRenderer.prototype.getLayer = function () {
        return this.layer_;
    };
    /**
     * Perform action necessary to get the layer rendered after new fonts have loaded
     * @abstract
     */
    LayerRenderer.prototype.handleFontsChanged = function () { };
    /**
     * Handle changes in image state.
     * @param {import("../events/Event.js").default} event Image change event.
     * @private
     */
    LayerRenderer.prototype.handleImageChange_ = function (event) {
        var image = /** @type {import("../Image.js").default} */ (event.target);
        if (image.getState() === ImageState.LOADED) {
            this.renderIfReadyAndVisible();
        }
    };
    /**
     * Load the image if not already loaded, and register the image change
     * listener if needed.
     * @param {import("../ImageBase.js").default} image Image.
     * @return {boolean} `true` if the image is already loaded, `false` otherwise.
     * @protected
     */
    LayerRenderer.prototype.loadImage = function (image) {
        var imageState = image.getState();
        if (imageState != ImageState.LOADED && imageState != ImageState.ERROR) {
            image.addEventListener(EventType.CHANGE, this.boundHandleImageChange_);
        }
        if (imageState == ImageState.IDLE) {
            image.load();
            imageState = image.getState();
        }
        return imageState == ImageState.LOADED;
    };
    /**
     * @protected
     */
    LayerRenderer.prototype.renderIfReadyAndVisible = function () {
        var layer = this.getLayer();
        if (layer.getVisible() && layer.getSourceState() == SourceState.READY) {
            layer.changed();
        }
    };
    return LayerRenderer;
}(Observable));

/**
 * @module ol/transform
 */
/**
 * Create an identity transform.
 * @return {!Transform} Identity transform.
 */
function create() {
    return [1, 0, 0, 1, 0, 0];
}
/**
 * Transforms the given coordinate with the given transform returning the
 * resulting, transformed coordinate. The coordinate will be modified in-place.
 *
 * @param {Transform} transform The transformation.
 * @param {import("./coordinate.js").Coordinate|import("./pixel.js").Pixel} coordinate The coordinate to transform.
 * @return {import("./coordinate.js").Coordinate|import("./pixel.js").Pixel} return coordinate so that operations can be
 *     chained together.
 */
function apply(transform, coordinate) {
    var x = coordinate[0];
    var y = coordinate[1];
    coordinate[0] = transform[0] * x + transform[2] * y + transform[4];
    coordinate[1] = transform[1] * x + transform[3] * y + transform[5];
    return coordinate;
}
/**
 * Creates a composite transform given an initial translation, scale, rotation, and
 * final translation (in that order only, not commutative).
 * @param {!Transform} transform The transform (will be modified in place).
 * @param {number} dx1 Initial translation x.
 * @param {number} dy1 Initial translation y.
 * @param {number} sx Scale factor x.
 * @param {number} sy Scale factor y.
 * @param {number} angle Rotation (in counter-clockwise radians).
 * @param {number} dx2 Final translation x.
 * @param {number} dy2 Final translation y.
 * @return {!Transform} The composite transform.
 */
function compose(transform, dx1, dy1, sx, sy, angle, dx2, dy2) {
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);
    transform[0] = sx * cos;
    transform[1] = sy * sin;
    transform[2] = -sx * sin;
    transform[3] = sy * cos;
    transform[4] = dx2 * sx * cos - dy2 * sx * sin + dx1;
    transform[5] = dx2 * sy * sin + dy2 * sy * cos + dy1;
    return transform;
}
/**
 * Invert the given transform.
 * @param {!Transform} target Transform to be set as the inverse of
 *     the source transform.
 * @param {!Transform} source The source transform to invert.
 * @return {!Transform} The inverted (target) transform.
 */
function makeInverse(target, source) {
    var det = determinant(source);
    assert(det !== 0, 32); // Transformation matrix cannot be inverted
    var a = source[0];
    var b = source[1];
    var c = source[2];
    var d = source[3];
    var e = source[4];
    var f = source[5];
    target[0] = d / det;
    target[1] = -b / det;
    target[2] = -c / det;
    target[3] = a / det;
    target[4] = (c * f - d * e) / det;
    target[5] = -(a * f - b * e) / det;
    return target;
}
/**
 * Returns the determinant of the given matrix.
 * @param {!Transform} mat Matrix.
 * @return {number} Determinant.
 */
function determinant(mat) {
    return mat[0] * mat[3] - mat[1] * mat[2];
}
/**
 * A string version of the transform.  This can be used
 * for CSS transforms.
 * @param {!Transform} mat Matrix.
 * @return {string} The transform as a string.
 */
function toString(mat) {
    return 'matrix(' + mat.join(', ') + ')';
}

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @abstract
 * @template {import("../../layer/Layer.js").default} LayerType
 */
var CanvasLayerRenderer = /** @class */ (function (_super) {
    __extends$6(CanvasLayerRenderer, _super);
    /**
     * @param {LayerType} layer Layer.
     */
    function CanvasLayerRenderer(layer) {
        var _this = _super.call(this, layer) || this;
        /**
         * @protected
         * @type {HTMLElement}
         */
        _this.container = null;
        /**
         * @protected
         * @type {number}
         */
        _this.renderedResolution;
        /**
         * A temporary transform.  The values in this transform should only be used in a
         * function that sets the values.
         * @private
         * @type {import("../../transform.js").Transform}
         */
        _this.tempTransform_ = create();
        /**
         * The transform for rendered pixels to viewport CSS pixels.  This transform must
         * be set when rendering a frame and may be used by other functions after rendering.
         * @protected
         * @type {import("../../transform.js").Transform}
         */
        _this.pixelTransform = create();
        /**
         * The transform for viewport CSS pixels to rendered pixels.  This transform must
         * be set when rendering a frame and may be used by other functions after rendering.
         * @protected
         * @type {import("../../transform.js").Transform}
         */
        _this.inversePixelTransform = create();
        /**
         * @protected
         * @type {CanvasRenderingContext2D}
         */
        _this.context = null;
        /**
         * @type {boolean}
         */
        _this.containerReused = false;
        /**
         * @type {HTMLCanvasElement}
         * @private
         */
        _this.createTransformStringCanvas_ = createCanvasContext2D(1, 1).canvas;
        return _this;
    }
    /**
     * Get a rendering container from an existing target, if compatible.
     * @param {HTMLElement} target Potential render target.
     * @param {string} transform CSS Transform.
     * @param {number} opacity Opacity.
     */
    CanvasLayerRenderer.prototype.useContainer = function (target, transform, opacity) {
        var layerClassName = this.getLayer().getClassName();
        var container, context;
        if (target && target.style.opacity === '' && target.className === layerClassName) {
            var canvas = target.firstElementChild;
            if (canvas instanceof HTMLCanvasElement) {
                context = canvas.getContext('2d');
            }
        }
        if (context && context.canvas.style.transform === transform) {
            // Container of the previous layer renderer can be used.
            this.container = target;
            this.context = context;
            this.containerReused = true;
        }
        else if (this.containerReused) {
            // Previously reused container cannot be used any more.
            this.container = null;
            this.context = null;
            this.containerReused = false;
        }
        if (!this.container) {
            container = document.createElement('div');
            container.className = layerClassName;
            var style = container.style;
            style.position = 'absolute';
            style.width = '100%';
            style.height = '100%';
            context = createCanvasContext2D();
            var canvas = context.canvas;
            container.appendChild(canvas);
            style = canvas.style;
            style.position = 'absolute';
            style.left = '0';
            style.transformOrigin = 'top left';
            this.container = container;
            this.context = context;
        }
    };
    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @param {import("../../extent.js").Extent} extent Clip extent.
     * @protected
     */
    CanvasLayerRenderer.prototype.clip = function (context, frameState, extent) {
        var pixelRatio = frameState.pixelRatio;
        var halfWidth = (frameState.size[0] * pixelRatio) / 2;
        var halfHeight = (frameState.size[1] * pixelRatio) / 2;
        var rotation = frameState.viewState.rotation;
        var topLeft = getTopLeft(extent);
        var topRight = getTopRight(extent);
        var bottomRight = getBottomRight(extent);
        var bottomLeft = getBottomLeft(extent);
        apply(frameState.coordinateToPixelTransform, topLeft);
        apply(frameState.coordinateToPixelTransform, topRight);
        apply(frameState.coordinateToPixelTransform, bottomRight);
        apply(frameState.coordinateToPixelTransform, bottomLeft);
        context.save();
        rotateAtOffset(context, -rotation, halfWidth, halfHeight);
        context.beginPath();
        context.moveTo(topLeft[0] * pixelRatio, topLeft[1] * pixelRatio);
        context.lineTo(topRight[0] * pixelRatio, topRight[1] * pixelRatio);
        context.lineTo(bottomRight[0] * pixelRatio, bottomRight[1] * pixelRatio);
        context.lineTo(bottomLeft[0] * pixelRatio, bottomLeft[1] * pixelRatio);
        context.clip();
        rotateAtOffset(context, rotation, halfWidth, halfHeight);
    };
    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @param {import("../../extent.js").Extent} extent Clip extent.
     * @protected
     */
    CanvasLayerRenderer.prototype.clipUnrotated = function (context, frameState, extent) {
        var topLeft = getTopLeft(extent);
        var topRight = getTopRight(extent);
        var bottomRight = getBottomRight(extent);
        var bottomLeft = getBottomLeft(extent);
        apply(frameState.coordinateToPixelTransform, topLeft);
        apply(frameState.coordinateToPixelTransform, topRight);
        apply(frameState.coordinateToPixelTransform, bottomRight);
        apply(frameState.coordinateToPixelTransform, bottomLeft);
        var inverted = this.inversePixelTransform;
        apply(inverted, topLeft);
        apply(inverted, topRight);
        apply(inverted, bottomRight);
        apply(inverted, bottomLeft);
        context.save();
        context.beginPath();
        context.moveTo(Math.round(topLeft[0]), Math.round(topLeft[1]));
        context.lineTo(Math.round(topRight[0]), Math.round(topRight[1]));
        context.lineTo(Math.round(bottomRight[0]), Math.round(bottomRight[1]));
        context.lineTo(Math.round(bottomLeft[0]), Math.round(bottomLeft[1]));
        context.clip();
    };
    /**
     * @param {import("../../render/EventType.js").default} type Event type.
     * @param {CanvasRenderingContext2D} context Context.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @private
     */
    CanvasLayerRenderer.prototype.dispatchRenderEvent_ = function (type, context, frameState) {
        var layer = this.getLayer();
        if (layer.hasListener(type)) {
            var event_1 = new RenderEvent(type, this.inversePixelTransform, frameState, context);
            layer.dispatchEvent(event_1);
        }
    };
    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @protected
     */
    CanvasLayerRenderer.prototype.preRender = function (context, frameState) {
        this.dispatchRenderEvent_(RenderEventType.PRERENDER, context, frameState);
    };
    /**
     * @param {CanvasRenderingContext2D} context Context.
     * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
     * @protected
     */
    CanvasLayerRenderer.prototype.postRender = function (context, frameState) {
        this.dispatchRenderEvent_(RenderEventType.POSTRENDER, context, frameState);
    };
    /**
     * Creates a transform for rendering to an element that will be rotated after rendering.
     * @param {import("../../coordinate.js").Coordinate} center Center.
     * @param {number} resolution Resolution.
     * @param {number} rotation Rotation.
     * @param {number} pixelRatio Pixel ratio.
     * @param {number} width Width of the rendered element (in pixels).
     * @param {number} height Height of the rendered element (in pixels).
     * @param {number} offsetX Offset on the x-axis in view coordinates.
     * @protected
     * @return {!import("../../transform.js").Transform} Transform.
     */
    CanvasLayerRenderer.prototype.getRenderTransform = function (center, resolution, rotation, pixelRatio, width, height, offsetX) {
        var dx1 = width / 2;
        var dy1 = height / 2;
        var sx = pixelRatio / resolution;
        var sy = -sx;
        var dx2 = -center[0] + offsetX;
        var dy2 = -center[1];
        return compose(this.tempTransform_, dx1, dy1, sx, sy, -rotation, dx2, dy2);
    };
    /**
     * @param {import("../../pixel.js").Pixel} pixel Pixel.
     * @param {import("../../PluggableMap.js").FrameState} frameState FrameState.
     * @param {number} hitTolerance Hit tolerance in pixels.
     * @return {Uint8ClampedArray|Uint8Array} The result.  If there is no data at the pixel
     *    location, null will be returned.  If there is data, but pixel values cannot be
     *    returned, and empty array will be returned.
     */
    CanvasLayerRenderer.prototype.getDataAtPixel = function (pixel, frameState, hitTolerance) {
        var renderPixel = apply(this.inversePixelTransform, pixel.slice());
        var context = this.context;
        var data;
        try {
            data = context.getImageData(Math.round(renderPixel[0]), Math.round(renderPixel[1]), 1, 1).data;
        }
        catch (err) {
            if (err.name === 'SecurityError') {
                // tainted canvas, we assume there is data at the given pixel (although there might not be)
                return new Uint8Array();
            }
            return data;
        }
        if (data[3] === 0) {
            return null;
        }
        return data;
    };
    /**
     * @param {import("../../transform.js").Transform} transform Transform.
     * @return {string} CSS transform.
     */
    CanvasLayerRenderer.prototype.createTransformString = function (transform) {
        this.createTransformStringCanvas_.style.transform = toString(transform);
        return this.createTransformStringCanvas_.style.transform;
    };
    return CanvasLayerRenderer;
}(LayerRenderer));

/**
 * @module ol/math
 */
/**
 * Return the hyperbolic cosine of a given number. The method will use the
 * native `Math.cosh` function if it is available, otherwise the hyperbolic
 * cosine will be calculated via the reference implementation of the Mozilla
 * developer network.
 *
 * @param {number} x X.
 * @return {number} Hyperbolic cosine of x.
 */
var cosh = (function () {
    // Wrapped in a iife, to save the overhead of checking for the native
    // implementation on every invocation.
    var cosh;
    if ('cosh' in Math) {
        // The environment supports the native Math.cosh function, use it…
        cosh = Math.cosh;
    }
    else {
        // … else, use the reference implementation of MDN:
        cosh = function (x) {
            var y = /** @type {Math} */ (Math).exp(x);
            return (y + 1 / y) / 2;
        };
    }
    return cosh;
}());

/**
 * @module ol/geom/GeometryType
 */

/**
 * @module ol/sphere
 */

/**
 * @module ol/proj/Units
 */
/**
 * Projection units: `'degrees'`, `'ft'`, `'m'`, `'pixels'`, `'tile-pixels'` or
 * `'us-ft'`.
 * @enum {string}
 */
var Units = {
    DEGREES: 'degrees',
    FEET: 'ft',
    METERS: 'm',
    PIXELS: 'pixels',
    TILE_PIXELS: 'tile-pixels',
    USFEET: 'us-ft'
};
/**
 * Meters per unit lookup table.
 * @const
 * @type {Object<Units, number>}
 * @api
 */
var METERS_PER_UNIT = {};
// use the radius of the Normal sphere
METERS_PER_UNIT[Units.DEGREES] = 2 * Math.PI * 6370997 / 360;
METERS_PER_UNIT[Units.FEET] = 0.3048;
METERS_PER_UNIT[Units.METERS] = 1;
METERS_PER_UNIT[Units.USFEET] = 1200 / 3937;

/**
 * @module ol/proj/Projection
 */
/**
 * @typedef {Object} Options
 * @property {string} code The SRS identifier code, e.g. `EPSG:4326`.
 * @property {import("./Units.js").default|string} [units] Units. Required unless a
 * proj4 projection is defined for `code`.
 * @property {import("../extent.js").Extent} [extent] The validity extent for the SRS.
 * @property {string} [axisOrientation='enu'] The axis orientation as specified in Proj4.
 * @property {boolean} [global=false] Whether the projection is valid for the whole globe.
 * @property {number} [metersPerUnit] The meters per unit for the SRS.
 * If not provided, the `units` are used to get the meters per unit from the {@link module:ol/proj/Units~METERS_PER_UNIT}
 * lookup table.
 * @property {import("../extent.js").Extent} [worldExtent] The world extent for the SRS.
 * @property {function(number, import("../coordinate.js").Coordinate):number} [getPointResolution]
 * Function to determine resolution at a point. The function is called with a
 * `{number}` view resolution and an `{import("../coordinate.js").Coordinate}` as arguments, and returns
 * the `{number}` resolution in projection units at the passed coordinate. If this is `undefined`,
 * the default {@link module:ol/proj#getPointResolution} function will be used.
 */
/**
 * @classdesc
 * Projection definition class. One of these is created for each projection
 * supported in the application and stored in the {@link module:ol/proj} namespace.
 * You can use these in applications, but this is not required, as API params
 * and options use {@link module:ol/proj~ProjectionLike} which means the simple string
 * code will suffice.
 *
 * You can use {@link module:ol/proj~get} to retrieve the object for a particular
 * projection.
 *
 * The library includes definitions for `EPSG:4326` and `EPSG:3857`, together
 * with the following aliases:
 * * `EPSG:4326`: CRS:84, urn:ogc:def:crs:EPSG:6.6:4326,
 *     urn:ogc:def:crs:OGC:1.3:CRS84, urn:ogc:def:crs:OGC:2:84,
 *     http://www.opengis.net/gml/srs/epsg.xml#4326,
 *     urn:x-ogc:def:crs:EPSG:4326
 * * `EPSG:3857`: EPSG:102100, EPSG:102113, EPSG:900913,
 *     urn:ogc:def:crs:EPSG:6.18:3:3857,
 *     http://www.opengis.net/gml/srs/epsg.xml#3857
 *
 * If you use [proj4js](https://github.com/proj4js/proj4js), aliases can
 * be added using `proj4.defs()`. After all required projection definitions are
 * added, call the {@link module:ol/proj/proj4~register} function.
 *
 * @api
 */
var Projection = /** @class */ (function () {
    /**
     * @param {Options} options Projection options.
     */
    function Projection(options) {
        /**
         * @private
         * @type {string}
         */
        this.code_ = options.code;
        /**
         * Units of projected coordinates. When set to `TILE_PIXELS`, a
         * `this.extent_` and `this.worldExtent_` must be configured properly for each
         * tile.
         * @private
         * @type {import("./Units.js").default}
         */
        this.units_ = /** @type {import("./Units.js").default} */ (options.units);
        /**
         * Validity extent of the projection in projected coordinates. For projections
         * with `TILE_PIXELS` units, this is the extent of the tile in
         * tile pixel space.
         * @private
         * @type {import("../extent.js").Extent}
         */
        this.extent_ = options.extent !== undefined ? options.extent : null;
        /**
         * Extent of the world in EPSG:4326. For projections with
         * `TILE_PIXELS` units, this is the extent of the tile in
         * projected coordinate space.
         * @private
         * @type {import("../extent.js").Extent}
         */
        this.worldExtent_ = options.worldExtent !== undefined ?
            options.worldExtent : null;
        /**
         * @private
         * @type {string}
         */
        this.axisOrientation_ = options.axisOrientation !== undefined ?
            options.axisOrientation : 'enu';
        /**
         * @private
         * @type {boolean}
         */
        this.global_ = options.global !== undefined ? options.global : false;
        /**
         * @private
         * @type {boolean}
         */
        this.canWrapX_ = !!(this.global_ && this.extent_);
        /**
         * @private
         * @type {function(number, import("../coordinate.js").Coordinate):number|undefined}
         */
        this.getPointResolutionFunc_ = options.getPointResolution;
        /**
         * @private
         * @type {import("../tilegrid/TileGrid.js").default}
         */
        this.defaultTileGrid_ = null;
        /**
         * @private
         * @type {number|undefined}
         */
        this.metersPerUnit_ = options.metersPerUnit;
    }
    /**
     * @return {boolean} The projection is suitable for wrapping the x-axis
     */
    Projection.prototype.canWrapX = function () {
        return this.canWrapX_;
    };
    /**
     * Get the code for this projection, e.g. 'EPSG:4326'.
     * @return {string} Code.
     * @api
     */
    Projection.prototype.getCode = function () {
        return this.code_;
    };
    /**
     * Get the validity extent for this projection.
     * @return {import("../extent.js").Extent} Extent.
     * @api
     */
    Projection.prototype.getExtent = function () {
        return this.extent_;
    };
    /**
     * Get the units of this projection.
     * @return {import("./Units.js").default} Units.
     * @api
     */
    Projection.prototype.getUnits = function () {
        return this.units_;
    };
    /**
     * Get the amount of meters per unit of this projection.  If the projection is
     * not configured with `metersPerUnit` or a units identifier, the return is
     * `undefined`.
     * @return {number|undefined} Meters.
     * @api
     */
    Projection.prototype.getMetersPerUnit = function () {
        return this.metersPerUnit_ || METERS_PER_UNIT[this.units_];
    };
    /**
     * Get the world extent for this projection.
     * @return {import("../extent.js").Extent} Extent.
     * @api
     */
    Projection.prototype.getWorldExtent = function () {
        return this.worldExtent_;
    };
    /**
     * Get the axis orientation of this projection.
     * Example values are:
     * enu - the default easting, northing, elevation.
     * neu - northing, easting, up - useful for "lat/long" geographic coordinates,
     *     or south orientated transverse mercator.
     * wnu - westing, northing, up - some planetary coordinate systems have
     *     "west positive" coordinate systems
     * @return {string} Axis orientation.
     * @api
     */
    Projection.prototype.getAxisOrientation = function () {
        return this.axisOrientation_;
    };
    /**
     * Is this projection a global projection which spans the whole world?
     * @return {boolean} Whether the projection is global.
     * @api
     */
    Projection.prototype.isGlobal = function () {
        return this.global_;
    };
    /**
     * Set if the projection is a global projection which spans the whole world
     * @param {boolean} global Whether the projection is global.
     * @api
     */
    Projection.prototype.setGlobal = function (global) {
        this.global_ = global;
        this.canWrapX_ = !!(global && this.extent_);
    };
    /**
     * @return {import("../tilegrid/TileGrid.js").default} The default tile grid.
     */
    Projection.prototype.getDefaultTileGrid = function () {
        return this.defaultTileGrid_;
    };
    /**
     * @param {import("../tilegrid/TileGrid.js").default} tileGrid The default tile grid.
     */
    Projection.prototype.setDefaultTileGrid = function (tileGrid) {
        this.defaultTileGrid_ = tileGrid;
    };
    /**
     * Set the validity extent for this projection.
     * @param {import("../extent.js").Extent} extent Extent.
     * @api
     */
    Projection.prototype.setExtent = function (extent) {
        this.extent_ = extent;
        this.canWrapX_ = !!(this.global_ && extent);
    };
    /**
     * Set the world extent for this projection.
     * @param {import("../extent.js").Extent} worldExtent World extent
     *     [minlon, minlat, maxlon, maxlat].
     * @api
     */
    Projection.prototype.setWorldExtent = function (worldExtent) {
        this.worldExtent_ = worldExtent;
    };
    /**
     * Set the getPointResolution function (see {@link module:ol/proj~getPointResolution}
     * for this projection.
     * @param {function(number, import("../coordinate.js").Coordinate):number} func Function
     * @api
     */
    Projection.prototype.setGetPointResolution = function (func) {
        this.getPointResolutionFunc_ = func;
    };
    /**
     * Get the custom point resolution function for this projection (if set).
     * @return {function(number, import("../coordinate.js").Coordinate):number|undefined} The custom point
     * resolution function (if set).
     */
    Projection.prototype.getPointResolutionFunc = function () {
        return this.getPointResolutionFunc_;
    };
    return Projection;
}());

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Radius of WGS84 sphere
 *
 * @const
 * @type {number}
 */
var RADIUS = 6378137;
/**
 * @const
 * @type {number}
 */
var HALF_SIZE = Math.PI * RADIUS;
/**
 * @const
 * @type {import("../extent.js").Extent}
 */
var EXTENT = [
    -HALF_SIZE, -HALF_SIZE,
    HALF_SIZE, HALF_SIZE
];
/**
 * @const
 * @type {import("../extent.js").Extent}
 */
var WORLD_EXTENT = [-180, -85, 180, 85];
/**
 * @classdesc
 * Projection object for web/spherical Mercator (EPSG:3857).
 */
var EPSG3857Projection = /** @class */ (function (_super) {
    __extends$7(EPSG3857Projection, _super);
    /**
     * @param {string} code Code.
     */
    function EPSG3857Projection(code) {
        return _super.call(this, {
            code: code,
            units: Units.METERS,
            extent: EXTENT,
            global: true,
            worldExtent: WORLD_EXTENT,
            getPointResolution: function (resolution, point) {
                return resolution / cosh(point[1] / RADIUS);
            }
        }) || this;
    }
    return EPSG3857Projection;
}(Projection));
/**
 * Projections equal to EPSG:3857.
 *
 * @const
 * @type {Array<import("./Projection.js").default>}
 */
var PROJECTIONS = [
    new EPSG3857Projection('EPSG:3857'),
    new EPSG3857Projection('EPSG:102100'),
    new EPSG3857Projection('EPSG:102113'),
    new EPSG3857Projection('EPSG:900913'),
    new EPSG3857Projection('urn:ogc:def:crs:EPSG:6.18:3:3857'),
    new EPSG3857Projection('urn:ogc:def:crs:EPSG::3857'),
    new EPSG3857Projection('http://www.opengis.net/gml/srs/epsg.xml#3857')
];
/**
 * Transformation from EPSG:4326 to EPSG:3857.
 *
 * @param {Array<number>} input Input array of coordinate values.
 * @param {Array<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension (default is `2`).
 * @return {Array<number>} Output array of coordinate values.
 */
function fromEPSG4326(input, opt_output, opt_dimension) {
    var length = input.length;
    var dimension = opt_dimension > 1 ? opt_dimension : 2;
    var output = opt_output;
    if (output === undefined) {
        if (dimension > 2) {
            // preserve values beyond second dimension
            output = input.slice();
        }
        else {
            output = new Array(length);
        }
    }
    var halfSize = HALF_SIZE;
    for (var i = 0; i < length; i += dimension) {
        output[i] = halfSize * input[i] / 180;
        var y = RADIUS *
            Math.log(Math.tan(Math.PI * (+input[i + 1] + 90) / 360));
        if (y > halfSize) {
            y = halfSize;
        }
        else if (y < -halfSize) {
            y = -halfSize;
        }
        output[i + 1] = y;
    }
    return output;
}
/**
 * Transformation from EPSG:3857 to EPSG:4326.
 *
 * @param {Array<number>} input Input array of coordinate values.
 * @param {Array<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension (default is `2`).
 * @return {Array<number>} Output array of coordinate values.
 */
function toEPSG4326(input, opt_output, opt_dimension) {
    var length = input.length;
    var dimension = opt_dimension > 1 ? opt_dimension : 2;
    var output = opt_output;
    if (output === undefined) {
        if (dimension > 2) {
            // preserve values beyond second dimension
            output = input.slice();
        }
        else {
            output = new Array(length);
        }
    }
    for (var i = 0; i < length; i += dimension) {
        output[i] = 180 * input[i] / HALF_SIZE;
        output[i + 1] = 360 * Math.atan(Math.exp(input[i + 1] / RADIUS)) / Math.PI - 90;
    }
    return output;
}

var __extends$8 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) { if (b.hasOwnProperty(p)) { d[p] = b[p]; } } };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Semi-major radius of the WGS84 ellipsoid.
 *
 * @const
 * @type {number}
 */
var RADIUS$1 = 6378137;
/**
 * Extent of the EPSG:4326 projection which is the whole world.
 *
 * @const
 * @type {import("../extent.js").Extent}
 */
var EXTENT$1 = [-180, -90, 180, 90];
/**
 * @const
 * @type {number}
 */
var METERS_PER_UNIT$1 = Math.PI * RADIUS$1 / 180;
/**
 * @classdesc
 * Projection object for WGS84 geographic coordinates (EPSG:4326).
 *
 * Note that OpenLayers does not strictly comply with the EPSG definition.
 * The EPSG registry defines 4326 as a CRS for Latitude,Longitude (y,x).
 * OpenLayers treats EPSG:4326 as a pseudo-projection, with x,y coordinates.
 */
var EPSG4326Projection = /** @class */ (function (_super) {
    __extends$8(EPSG4326Projection, _super);
    /**
     * @param {string} code Code.
     * @param {string=} opt_axisOrientation Axis orientation.
     */
    function EPSG4326Projection(code, opt_axisOrientation) {
        return _super.call(this, {
            code: code,
            units: Units.DEGREES,
            extent: EXTENT$1,
            axisOrientation: opt_axisOrientation,
            global: true,
            metersPerUnit: METERS_PER_UNIT$1,
            worldExtent: EXTENT$1
        }) || this;
    }
    return EPSG4326Projection;
}(Projection));
/**
 * Projections equal to EPSG:4326.
 *
 * @const
 * @type {Array<import("./Projection.js").default>}
 */
var PROJECTIONS$1 = [
    new EPSG4326Projection('CRS:84'),
    new EPSG4326Projection('EPSG:4326', 'neu'),
    new EPSG4326Projection('urn:ogc:def:crs:EPSG::4326', 'neu'),
    new EPSG4326Projection('urn:ogc:def:crs:EPSG:6.6:4326', 'neu'),
    new EPSG4326Projection('urn:ogc:def:crs:OGC:1.3:CRS84'),
    new EPSG4326Projection('urn:ogc:def:crs:OGC:2:84'),
    new EPSG4326Projection('http://www.opengis.net/gml/srs/epsg.xml#4326', 'neu'),
    new EPSG4326Projection('urn:x-ogc:def:crs:EPSG:4326', 'neu')
];

/**
 * @module ol/proj/transforms
 */
/**
 * @private
 * @type {!Object<string, Object<string, import("../proj.js").TransformFunction>>}
 */
var transforms = {};
/**
 * Registers a conversion function to convert coordinates from the source
 * projection to the destination projection.
 *
 * @param {import("./Projection.js").default} source Source.
 * @param {import("./Projection.js").default} destination Destination.
 * @param {import("../proj.js").TransformFunction} transformFn Transform.
 */
function add(source, destination, transformFn) {
    var sourceCode = source.getCode();
    var destinationCode = destination.getCode();
    if (!(sourceCode in transforms)) {
        transforms[sourceCode] = {};
    }
    transforms[sourceCode][destinationCode] = transformFn;
}
/**
 * Get a transform given a source code and a destination code.
 * @param {string} sourceCode The code for the source projection.
 * @param {string} destinationCode The code for the destination projection.
 * @return {import("../proj.js").TransformFunction|undefined} The transform function (if found).
 */
function get(sourceCode, destinationCode) {
    var transform;
    if (sourceCode in transforms && destinationCode in transforms[sourceCode]) {
        transform = transforms[sourceCode][destinationCode];
    }
    return transform;
}

/**
 * @module ol/proj/projections
 */
/**
 * @type {Object<string, import("./Projection.js").default>}
 */
var cache = {};
/**
 * Get a cached projection by code.
 * @param {string} code The code for the projection.
 * @return {import("./Projection.js").default} The projection (if cached).
 */
function get$1(code) {
    return cache[code] || null;
}
/**
 * Add a projection to the cache.
 * @param {string} code The projection code.
 * @param {import("./Projection.js").default} projection The projection to cache.
 */
function add$1(code, projection) {
    cache[code] = projection;
}

/**
 * @module ol/proj
 */
/**
 * @param {Array<number>} input Input coordinate array.
 * @param {Array<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension.
 * @return {Array<number>} Output coordinate array (new array, same coordinate
 *     values).
 */
function cloneTransform(input, opt_output, opt_dimension) {
    var output;
    if (opt_output !== undefined) {
        for (var i = 0, ii = input.length; i < ii; ++i) {
            opt_output[i] = input[i];
        }
        output = opt_output;
    }
    else {
        output = input.slice();
    }
    return output;
}
/**
 * @param {Array<number>} input Input coordinate array.
 * @param {Array<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension.
 * @return {Array<number>} Input coordinate array (same array as input).
 */
function identityTransform(input, opt_output, opt_dimension) {
    if (opt_output !== undefined && input !== opt_output) {
        for (var i = 0, ii = input.length; i < ii; ++i) {
            opt_output[i] = input[i];
        }
        input = opt_output;
    }
    return input;
}
/**
 * Add a Projection object to the list of supported projections that can be
 * looked up by their code.
 *
 * @param {Projection} projection Projection instance.
 * @api
 */
function addProjection(projection) {
    add$1(projection.getCode(), projection);
    add(projection, projection, cloneTransform);
}
/**
 * @param {Array<Projection>} projections Projections.
 */
function addProjections(projections) {
    projections.forEach(addProjection);
}
/**
 * Fetches a Projection object for the code specified.
 *
 * @param {ProjectionLike} projectionLike Either a code string which is
 *     a combination of authority and identifier such as "EPSG:4326", or an
 *     existing projection object, or undefined.
 * @return {Projection} Projection object, or null if not in list.
 * @api
 */
function get$2(projectionLike) {
    return typeof projectionLike === 'string' ?
        get$1(/** @type {string} */ (projectionLike)) :
        ( /** @type {Projection} */(projectionLike) || null);
}
/**
 * Registers transformation functions that don't alter coordinates. Those allow
 * to transform between projections with equal meaning.
 *
 * @param {Array<Projection>} projections Projections.
 * @api
 */
function addEquivalentProjections(projections) {
    addProjections(projections);
    projections.forEach(function (source) {
        projections.forEach(function (destination) {
            if (source !== destination) {
                add(source, destination, cloneTransform);
            }
        });
    });
}
/**
 * Registers transformation functions to convert coordinates in any projection
 * in projection1 to any projection in projection2.
 *
 * @param {Array<Projection>} projections1 Projections with equal
 *     meaning.
 * @param {Array<Projection>} projections2 Projections with equal
 *     meaning.
 * @param {TransformFunction} forwardTransform Transformation from any
 *   projection in projection1 to any projection in projection2.
 * @param {TransformFunction} inverseTransform Transform from any projection
 *   in projection2 to any projection in projection1..
 */
function addEquivalentTransforms(projections1, projections2, forwardTransform, inverseTransform) {
    projections1.forEach(function (projection1) {
        projections2.forEach(function (projection2) {
            add(projection1, projection2, forwardTransform);
            add(projection2, projection1, inverseTransform);
        });
    });
}
/**
 * Searches in the list of transform functions for the function for converting
 * coordinates from the source projection to the destination projection.
 *
 * @param {Projection} sourceProjection Source Projection object.
 * @param {Projection} destinationProjection Destination Projection
 *     object.
 * @return {TransformFunction} Transform function.
 */
function getTransformFromProjections(sourceProjection, destinationProjection) {
    var sourceCode = sourceProjection.getCode();
    var destinationCode = destinationProjection.getCode();
    var transformFunc = get(sourceCode, destinationCode);
    if (!transformFunc) {
        transformFunc = identityTransform;
    }
    return transformFunc;
}
/**
 * Given the projection-like objects, searches for a transformation
 * function to convert a coordinates array from the source projection to the
 * destination projection.
 *
 * @param {ProjectionLike} source Source.
 * @param {ProjectionLike} destination Destination.
 * @return {TransformFunction} Transform function.
 * @api
 */
function getTransform(source, destination) {
    var sourceProjection = get$2(source);
    var destinationProjection = get$2(destination);
    return getTransformFromProjections(sourceProjection, destinationProjection);
}
/**
 * Transforms an extent from source projection to destination projection.  This
 * returns a new extent (and does not modify the original).
 *
 * @param {import("./extent.js").Extent} extent The extent to transform.
 * @param {ProjectionLike} source Source projection-like.
 * @param {ProjectionLike} destination Destination projection-like.
 * @return {import("./extent.js").Extent} The transformed extent.
 * @api
 */
function transformExtent(extent, source, destination) {
    var transformFunc = getTransform(source, destination);
    return applyTransform(extent, transformFunc);
}
/**
 * @type {?Projection}
 */
var userProjection = null;
/**
 * Return an extent transformed from the user projection.  If no user projection
 * is set, the original extent is returned.
 * @param {import("./extent.js").Extent} extent Input extent.
 * @param {ProjectionLike} destProjection The destination projection.
 * @returns {import("./extent.js").Extent} The input extent transformed.
 */
function fromUserExtent(extent, destProjection) {
    if (!userProjection) {
        return extent;
    }
    return transformExtent(extent, userProjection, destProjection);
}
/**
 * Add transforms to and from EPSG:4326 and EPSG:3857.  This function is called
 * by when this module is executed and should only need to be called again after
 * `clearAllProjections()` is called (e.g. in tests).
 */
function addCommon() {
    // Add transformations that don't alter coordinates to convert within set of
    // projections with equal meaning.
    addEquivalentProjections(PROJECTIONS);
    addEquivalentProjections(PROJECTIONS$1);
    // Add transformations to convert EPSG:4326 like coordinates to EPSG:3857 like
    // coordinates and back.
    addEquivalentTransforms(PROJECTIONS$1, PROJECTIONS, fromEPSG4326, toEPSG4326);
}
addCommon();

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
    that.DEVICEPIXELRATIO = params.devicePixelRatio || 1;
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
          } else {
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
      g.fillRect(bounds.x, bounds.y, that.canvas.width, that.canvas.height);
      g.globalCompositeOperation = prev;
      g.globalAlpha = 0.9;

      // Draw new particle trails.
      buckets.forEach(function (bucket, i) {
        if (bucket.length > 0) {
          g.beginPath();
          g.strokeStyle = colorStyles[i];
          bucket.forEach(function (particle) {
            g.moveTo(particle.x * that.DEVICEPIXELRATIO, particle.y * that.DEVICEPIXELRATIO);
            g.lineTo(particle.xt * that.DEVICEPIXELRATIO, particle.yt * that.DEVICEPIXELRATIO);
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

var ViewHint = {
  ANIMATING: 0,
  INTERACTING: 1
};

var WindLayerRender = /*@__PURE__*/(function (CanvasLayerRenderer) {
  function WindLayerRender (layer) {
    // @ts-ignore
    CanvasLayerRenderer.call(this, layer);
    this.wind = undefined;
  }

  if ( CanvasLayerRenderer ) WindLayerRender.__proto__ = CanvasLayerRenderer;
  WindLayerRender.prototype = Object.create( CanvasLayerRenderer && CanvasLayerRenderer.prototype );
  WindLayerRender.prototype.constructor = WindLayerRender;

  WindLayerRender.prototype.prepareFrame = function prepareFrame (frameState) {
    var layerState = frameState.layerStatesArray[frameState.layerIndex];
    // const pixelRatio = frameState.pixelRatio;
    var viewState = frameState.viewState;
    // const viewResolution = viewState.resolution;

    var hints = frameState.viewHints;

    var renderedExtent = frameState.extent;
    if (layerState.extent !== undefined) {
      renderedExtent = getIntersection(renderedExtent, fromUserExtent(layerState.extent, viewState.projection));
    }

    if (!hints[ViewHint.ANIMATING] && !hints[ViewHint.INTERACTING] && !isEmpty(renderedExtent)) {
      // const projection = viewState.projection;
      // eslint-disable-next-line no-console
      // console.log(this, pixelRatio, projection, renderedExtent, viewResolution);
      // return !!this.context;
      if (!this.wind && this.context) {
        var layer = this.getLayer();
        var extent = this._getExtent(frameState);
        var ref = layer.options;
        var projection = ref.projection;
        var minVelocity = ref.minVelocity;
        var maxVelocity = ref.maxVelocity;
        var velocityScale = ref.velocityScale;
        var particleAge = ref.particleAge;
        var lineWidth = ref.lineWidth;
        var particleMultiplier = ref.particleMultiplier;
        var colorScale = ref.colorScale;
        var devicePixelRatio = ref.devicePixelRatio;

        var context = this.context;
        var canvas = context.canvas;

        this.wind = new Windy({
          canvas: canvas,
          data: layer.getData(),
          projection: projection,
          minVelocity: minVelocity,
          maxVelocity: maxVelocity,
          velocityScale: velocityScale,
          particleAge: particleAge,
          lineWidth: lineWidth,
          particleMultiplier: particleMultiplier,
          colorScale: colorScale,
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
  };

  WindLayerRender.prototype.renderFrame = function renderFrame (frameState, target) {
    var layerState = frameState.layerStatesArray[frameState.layerIndex];
    var pixelRatio = frameState.pixelRatio;
    var viewState = frameState.viewState;
    var size = frameState.size;

    var width = Math.round(size[0] * pixelRatio);
    var height = Math.round(size[1] * pixelRatio);
    var rotation = viewState.rotation;
    if (rotation) {
      var size$1 = Math.round(Math.sqrt(width * width + height * height));
      width = size$1;
      height = size$1;
    }

    // set forward and inverse pixel transforms
    compose(this.pixelTransform,
      frameState.size[0] / 2, frameState.size[1] / 2,
      1 / pixelRatio, 1 / pixelRatio,
      rotation,
      -width / 2, -height / 2
    );
    makeInverse(this.inversePixelTransform, this.pixelTransform);

    // @ts-ignore
    var canvasTransform = this.createTransformString(this.pixelTransform);

    // @ts-ignore
    this.useContainer(target, canvasTransform, layerState.opacity);

    var context = this.context;
    var canvas = context.canvas;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    } else if (!this.containerReused) {
      context.clearRect(0, 0, width, height);
    }

    // clipped rendering if layer extent is set
    var clipped = false;
    if (layerState.extent) {
      var layerExtent = fromUserExtent(layerState.extent, viewState.projection);
      clipped = !containsExtent(layerExtent, frameState.extent) && intersects(layerExtent, frameState.extent);
      if (clipped) {
        // @ts-ignore
        this.clipUnrotated(context, frameState, layerExtent);
      }
    }

    this.preRender(context, frameState);

    var extent = this._getExtent(frameState);

    if (this.wind && extent) { this.wind.start(extent[0], extent[1], extent[2], extent[3]); }

    this.postRender(context, frameState);

    if (clipped) {
      context.restore();
    }

    if (canvasTransform !== canvas.style.transform) {
      canvas.style.transform = canvasTransform;
    }

    return this.container;
  };

  WindLayerRender.prototype._getExtent = function _getExtent (frameState) {
    var size = frameState.size;
    var extent = frameState.extent;
    var viewState = frameState.viewState;
    if (!extent || !viewState || !size) { return false; }
    var ex = transformExtent(extent, viewState.projection, 'EPSG:4326');
    return [
      [[0, 0], [size[0], size[1]]],
      size[0], size[1],
      [[ex[0], ex[1]], [ex[2], ex[3]]]
    ];
  };

  WindLayerRender.prototype.getLayer = function getLayer () {
    return CanvasLayerRenderer.prototype.getLayer.call(this);
  };

  return WindLayerRender;
}(CanvasLayerRenderer));

/**
 * create canvas
 * @param width
 * @param height
 * @param Canvas
 * @returns {HTMLCanvasElement}
 */

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

var OlWindy = /*@__PURE__*/(function (Layer) {
  function OlWindy (data, options) {
    if ( options === void 0 ) options = {};

    Layer.call(this, options);

    this.options = options;

    if (data) {
      this.setData(data);
    }
  }

  if ( Layer ) OlWindy.__proto__ = Layer;
  OlWindy.prototype = Object.create( Layer && Layer.prototype );
  OlWindy.prototype.constructor = OlWindy;

  // public getType(): LayerType {
  //   return 'CUSTOM' as LayerType;
  // };

  OlWindy.prototype.render = function render (frameState, target) {
    var layerRenderer = this.getRenderer();

    if (layerRenderer.prepareFrame(frameState)) {
      return layerRenderer.renderFrame(frameState, target);
    }
  };

  OlWindy.prototype.getRenderer = function getRenderer () {
    if (!this.renderer_) {
      this.renderer_ = this.createRenderer();
    }
    return this.renderer_;
  };

  /**
   * @return {boolean} The layer has a renderer.
   */
  OlWindy.prototype.hasRenderer = function hasRenderer () {
    return !!this.renderer_;
  };

  OlWindy.prototype.createRenderer = function createRenderer () {
    return new WindLayerRender(this);
  };

  OlWindy.prototype.getData = function getData () {
    return this.data;
  };

  OlWindy.prototype.setData = function setData (data) {
    if (data) {
      this.data = data;
    } else {
      // eslint-disable-next-line no-console
      console.error('Illegal data');
    }
    return this;
  };

  /**
   * append layer to map
   * @param map
   */
  OlWindy.prototype.appendTo = function appendTo (map) {
    if (map && map instanceof Map) {
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
  OlWindy.prototype.getPointData = function getPointData (coordinates) {
    var layerRenderer = this.getRenderer();
    if (!layerRenderer || !layerRenderer.wind) { return null; }
    var gridValue = layerRenderer.wind.interpolatePoint(coordinates[0], coordinates[1]);
    if (gridValue && !isNaN(gridValue[0]) && !isNaN(gridValue[1]) && gridValue[2]) {
      return {
        direction: getDirection(gridValue[0], gridValue[1], this.options.angleConvention || 'bearingCCW'),
        speed: getSpeed(gridValue[0], gridValue[1], this.options.speedUnit)
      }
    }
  };

  /**
   * clearWind method will retain the instance
   * @returns {null}
   */
  OlWindy.prototype.clearWind = function clearWind () {
    var layerRenderer = this.getRenderer();
    if (!layerRenderer || !layerRenderer.wind) { return null; }
    layerRenderer.wind.stop();
    this.changed();
  };

  /**
   * remove layer this instance will be destroyed after remove
   */
  OlWindy.prototype.removeLayer = function removeLayer () {
    var layerRenderer = this.getRenderer();
    if (!layerRenderer || !layerRenderer.wind) { return null; }
    layerRenderer.wind.stop();
    console.warn('You should use `map.removeLayer()` to remove this layer!');
  };

  /**
   * update windy config
   * @param params
   * @returns {OlWindy}
   */
  OlWindy.prototype.updateParams = function updateParams (params) {
    if ( params === void 0 ) params = {};

    var layerRenderer = this.getRenderer();
    this.options = Object.assign(this.options, params);
    if (this.layerRenderer && layerRenderer.wind) {
      var ref = this.options;
      var minVelocity = ref.minVelocity;
      var maxVelocity = ref.maxVelocity;
      var velocityScale = ref.velocityScale;
      var particleAge = ref.particleAge;
      var lineWidth = ref.lineWidth;
      var particleMultiplier = ref.particleMultiplier;
      var colorScale = ref.colorScale;
      this.$Windy.updateParams({
        minVelocity: minVelocity,
        maxVelocity: maxVelocity,
        velocityScale: velocityScale,
        particleAge: particleAge,
        lineWidth: lineWidth,
        particleMultiplier: particleMultiplier,
        colorScale: colorScale,
        devicePixelRatio: this.options.devicePixelRatio
      });
    }
    return this;
  };

  /**
   * get windy config
   * @returns {*}
   */
  OlWindy.prototype.getParams = function getParams () {
    var layerRenderer = this.getRenderer();
    if (layerRenderer && layerRenderer.wind) {
      return layerRenderer.wind.getParams();
    }
  };

  return OlWindy;
}(Layer));

export default OlWindy;
//# sourceMappingURL=Ol6Windy.esm.js.map
