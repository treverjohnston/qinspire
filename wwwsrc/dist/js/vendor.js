webpackJsonp([3],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(14);
var isBuffer = __webpack_require__(44);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object' && !isArray(obj)) {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(13)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, setImmediate) {/*!
 * Vue.js v2.5.2
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */
/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "production" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "production" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (false) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */


var uid$1 = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid$1++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.functionalOptions = undefined;
  this.functionalScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode, deep) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  if (deep && vnode.children) {
    cloned.children = cloneVNodes(vnode.children);
  }
  return cloned
}

function cloneVNodes (vnodes, deep) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep);
  }
  return res
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (false) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "production" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "production" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (false) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      "production" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn.call(this, parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    "production" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (false) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "production" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (false) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (false) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (false) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (false) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (false) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (false) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (false) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      "Invalid prop: type check failed for prop \"" + name + "\"." +
      " Expected " + (expectedTypes.map(capitalize).join(', ')) +
      ", got " + (toRawType(value)) + ".",
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (false) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if (inBrowser && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both micro and macro tasks.
// In < 2.4 we used micro tasks everywhere, but there are some scenarios where
// micro tasks have too high a priority and fires in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using macro tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use micro task by default, but expose a way to force macro task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) Task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine MicroTask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a Task instead of a MicroTask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (false) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

var mark;
var measure;

if (false) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "production" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (false) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "production" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                 false
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (false) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      data && data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots
}

function isWhitespace (node) {
  return node.isComment || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (false) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (false) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (false) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = (parentVnode.data && parentVnode.data.attrs) || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (false) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (false) {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (false) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  false
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "production" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (false) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive(props, key, value, function () {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "production" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (false) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      "production" !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (false) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (false) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  if (false) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (false) {
      if (methods[key] == null) {
        warn(
          "Method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  keyOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(keyOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (false) {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    observerState.shouldConvert = false;
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (false) {
        defineReactive(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive(vm, key, result[key]);
      }
    });
    observerState.shouldConvert = true;
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
        ? Reflect.ownKeys(inject).filter(function (key) {
          /* istanbul ignore next */
          return Object.getOwnPropertyDescriptor(inject, key).enumerable
        })
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (false) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if (false) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && "production" !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias,
  eventKeyName
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (keyCodes) {
    if (Array.isArray(keyCodes)) {
      return keyCodes.indexOf(eventKeyCode) === -1
    } else {
      return keyCodes !== eventKeyCode
    }
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      "production" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  // static trees can be rendered once and cached on the contructor options
  // so every instance shares the same cached trees
  var renderFns = this.$options.staticRenderFns;
  var cached = renderFns.cached || (renderFns.cached = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = renderFns[index].call(this._renderProxy, null, this);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      "production" !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm = Object.create(parent);
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode) {
        vnode.functionalScopeId = options._scopeId;
        vnode.functionalContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    vnode.functionalContext = contextVm;
    vnode.functionalOptions = options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }

  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (false) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "production" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (false
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    );
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force);
      }
    }
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (false) {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // if the parent didn't update, the slot nodes will be the ones from
      // last render. They need to be cloned to ensure "freshness" for this render.
      for (var key in vm.$slots) {
        var slot = vm.$slots[key];
        if (slot._rendered) {
          vm.$slots[key] = cloneVNodes(slot, true /* deep */);
        }
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (false) {
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, "renderError");
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (false) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (false) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (false) {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (false) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if (false
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (false) {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (false) {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && cached$$1 !== current) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }

      var ref = this;
      var cache = ref.cache;
      var keys = ref.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (false) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

Vue$3.version = '2.5.2';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "production" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (false) {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(
            config.ignoredElements.length &&
            config.ignoredElements.some(function (ignore) {
              return isRegExp(ignore)
                ? ignore.test(tag)
                : ignore === tag
            })
          ) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (false) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.functionalScopeId)) {
      nodeOps.setAttribute(vnode.elm, i, '');
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setAttribute(vnode.elm, i, '');
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.functionalContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
        } else {
          vnodeToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if (false) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.elm = elm;
      vnode.isAsyncPlaceholder = true;
      return true
    }
    if (false) {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (false
              ) {
                bailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (false
              ) {
                bailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (false) {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE9 || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

/*  */















// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.

/*  */

/**
 * Cross-platform code generation for component v-model
 */


/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers) && modifiers.number) {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (false) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (false) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "production" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$options._renderChildren;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (false) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (false
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (false) {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
Vue$3.nextTick(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if (false) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if (false
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

/* harmony default export */ __webpack_exports__["a"] = (Vue$3);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(7), __webpack_require__(3).setImmediate))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(25);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(0);
var normalizeHeaderName = __webpack_require__(46);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(15);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(15);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const quotes = __webpack_require__(24);

exports.all = quotes;
exports.random = () => quotes[Math.floor(Math.random() * quotes.length)];


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 9 */,
/* 10 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 11 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(37);
var IE8_DOM_DEFINE = __webpack_require__(38);
var toPrimitive = __webpack_require__(40);
var dP = Object.defineProperty;

exports.f = __webpack_require__(1) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var settle = __webpack_require__(47);
var buildURL = __webpack_require__(49);
var parseHeaders = __webpack_require__(50);
var isURLSameOrigin = __webpack_require__(51);
var createError = __webpack_require__(16);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(52);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("production" !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(53);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(48);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export QAjaxBar */
/* unused harmony export QAlert */
/* unused harmony export QAutocomplete */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return QBtn; });
/* unused harmony export QCard */
/* unused harmony export QCardTitle */
/* unused harmony export QCardMain */
/* unused harmony export QCardActions */
/* unused harmony export QCardMedia */
/* unused harmony export QCardSeparator */
/* unused harmony export QCarousel */
/* unused harmony export QChatMessage */
/* unused harmony export QCheckbox */
/* unused harmony export QChip */
/* unused harmony export QChipsInput */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return QCollapsible; });
/* unused harmony export QContextMenu */
/* unused harmony export QDataTable */
/* unused harmony export QDatetime */
/* unused harmony export QDatetimeRange */
/* unused harmony export QInlineDatetime */
/* unused harmony export QFab */
/* unused harmony export QFabAction */
/* unused harmony export QField */
/* unused harmony export QFieldReset */
/* unused harmony export QGallery */
/* unused harmony export QGalleryCarousel */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return QIcon; });
/* unused harmony export QInfiniteScroll */
/* unused harmony export QInnerLoading */
/* unused harmony export QInput */
/* unused harmony export QInputFrame */
/* unused harmony export QKnob */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return QLayout; });
/* unused harmony export QFixedPosition */
/* unused harmony export QSideLink */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return QItem; });
/* unused harmony export QItemSeparator */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return QItemMain; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return QItemSide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return QItemTile; });
/* unused harmony export QItemWrapper */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "j", function() { return QList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "k", function() { return QListHeader; });
/* unused harmony export QModal */
/* unused harmony export QModalLayout */
/* unused harmony export QResizeObservable */
/* unused harmony export QScrollObservable */
/* unused harmony export QWindowResizeObservable */
/* unused harmony export QOptionGroup */
/* unused harmony export QPagination */
/* unused harmony export QParallax */
/* unused harmony export QPopover */
/* unused harmony export QProgress */
/* unused harmony export QPullToRefresh */
/* unused harmony export QRadio */
/* unused harmony export QRange */
/* unused harmony export QRating */
/* unused harmony export QScrollArea */
/* unused harmony export QSearch */
/* unused harmony export QSelect */
/* unused harmony export QDialogSelect */
/* unused harmony export QSlideTransition */
/* unused harmony export QSlider */
/* unused harmony export QSpinner */
/* unused harmony export QSpinnerAudio */
/* unused harmony export QSpinnerBall */
/* unused harmony export QSpinnerBars */
/* unused harmony export QSpinnerCircles */
/* unused harmony export QSpinnerComment */
/* unused harmony export QSpinnerCube */
/* unused harmony export QSpinnerDots */
/* unused harmony export QSpinnerFacebook */
/* unused harmony export QSpinnerGears */
/* unused harmony export QSpinnerGrid */
/* unused harmony export QSpinnerHearts */
/* unused harmony export QSpinnerHourglass */
/* unused harmony export QSpinnerInfinity */
/* unused harmony export QSpinnerIos */
/* unused harmony export QSpinnerMat */
/* unused harmony export QSpinnerOval */
/* unused harmony export QSpinnerPie */
/* unused harmony export QSpinnerPuff */
/* unused harmony export QSpinnerRadio */
/* unused harmony export QSpinnerRings */
/* unused harmony export QSpinnerTail */
/* unused harmony export QStep */
/* unused harmony export QStepper */
/* unused harmony export QStepperNavigation */
/* unused harmony export QRouteTab */
/* unused harmony export QTab */
/* unused harmony export QTabPane */
/* unused harmony export QTabs */
/* unused harmony export QToggle */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "l", function() { return QToolbar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "m", function() { return QToolbarTitle; });
/* unused harmony export QTooltip */
/* unused harmony export QTransition */
/* unused harmony export QTree */
/* unused harmony export QUploader */
/* unused harmony export QVideo */
/* unused harmony export BackToTop */
/* unused harmony export GoBack */
/* unused harmony export Move */
/* unused harmony export Ripple */
/* unused harmony export ScrollFire */
/* unused harmony export Scroll */
/* unused harmony export TouchHold */
/* unused harmony export TouchPan */
/* unused harmony export TouchSwipe */
/* unused harmony export AddressbarColor */
/* unused harmony export Alert */
/* unused harmony export AppFullscreen */
/* unused harmony export AppVisibility */
/* unused harmony export Cookies */
/* unused harmony export Events */
/* unused harmony export Platform */
/* unused harmony export LocalStorage */
/* unused harmony export SessionStorage */
/* unused harmony export ActionSheet */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Dialog; });
/* unused harmony export Loading */
/* unused harmony export Toast */
/* unused harmony export animate */
/* unused harmony export clone */
/* unused harmony export colors */
/* unused harmony export date */
/* unused harmony export debounce */
/* unused harmony export frameDebounce */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "o", function() { return dom; });
/* unused harmony export easing */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "p", function() { return event; });
/* unused harmony export extend */
/* unused harmony export filter */
/* unused harmony export format */
/* unused harmony export noop */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "q", function() { return openUrl; });
/* unused harmony export scroll */
/* unused harmony export throttle */
/* unused harmony export uid */
/*!
 * Quasar Framework v0.14.6
 * (c) 2016-present Razvan Stoenescu
 * Released under the MIT License.
 */
/* eslint-disable no-useless-escape */
/* eslint-disable no-mixed-operators */

function getUserAgent () {
  return (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
}

function getMatch (userAgent, platformMatch) {
  var match = /(edge)\/([\w.]+)/.exec(userAgent) ||
    /(opr)[\/]([\w.]+)/.exec(userAgent) ||
    /(vivaldi)[\/]([\w.]+)/.exec(userAgent) ||
    /(chrome)[\/]([\w.]+)/.exec(userAgent) ||
    /(iemobile)[\/]([\w.]+)/.exec(userAgent) ||
    /(version)(applewebkit)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
    /(webkit)[\/]([\w.]+).*(version)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
    /(webkit)[\/]([\w.]+)/.exec(userAgent) ||
    /(opera)(?:.*version|)[\/]([\w.]+)/.exec(userAgent) ||
    /(msie) ([\w.]+)/.exec(userAgent) ||
    userAgent.indexOf('trident') >= 0 && /(rv)(?::| )([\w.]+)/.exec(userAgent) ||
    userAgent.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(userAgent) ||
    [];

  return {
    browser: match[5] || match[3] || match[1] || '',
    version: match[2] || match[4] || '0',
    versionNumber: match[4] || match[2] || '0',
    platform: platformMatch[0] || ''
  }
}

function getPlatformMatch (userAgent) {
  return /(ipad)/.exec(userAgent) ||
    /(ipod)/.exec(userAgent) ||
    /(windows phone)/.exec(userAgent) ||
    /(iphone)/.exec(userAgent) ||
    /(kindle)/.exec(userAgent) ||
    /(silk)/.exec(userAgent) ||
    /(android)/.exec(userAgent) ||
    /(win)/.exec(userAgent) ||
    /(mac)/.exec(userAgent) ||
    /(linux)/.exec(userAgent) ||
    /(cros)/.exec(userAgent) ||
    /(playbook)/.exec(userAgent) ||
    /(bb)/.exec(userAgent) ||
    /(blackberry)/.exec(userAgent) ||
    []
}

function getPlatform () {
  var
    userAgent = getUserAgent(),
    platformMatch = getPlatformMatch(userAgent),
    matched = getMatch(userAgent, platformMatch),
    browser = {};

  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
    browser.versionNumber = parseInt(matched.versionNumber, 10);
  }

  if (matched.platform) {
    browser[matched.platform] = true;
  }

  // These are all considered mobile platforms, meaning they run a mobile browser
  if (browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
    browser.ipod || browser.kindle || browser.playbook || browser.silk || browser['windows phone']) {
    browser.mobile = true;
  }

  // Set iOS if on iPod, iPad or iPhone
  if (browser.ipod || browser.ipad || browser.iphone) {
    browser.ios = true;
  }

  if (browser['windows phone']) {
    browser.winphone = true;
    delete browser['windows phone'];
  }

  // These are all considered desktop platforms, meaning they run a desktop browser
  if (browser.cros || browser.mac || browser.linux || browser.win) {
    browser.desktop = true;
  }

  // Chrome, Opera 15+, Vivaldi and Safari are webkit based browsers
  if (browser.chrome || browser.opr || browser.safari || browser.vivaldi) {
    browser.webkit = true;
  }

  // IE11 has a new token so we will assign it msie to avoid breaking changes
  if (browser.rv || browser.iemobile) {
    matched.browser = 'ie';
    browser.ie = true;
  }

  // Edge is officially known as Microsoft Edge, so rewrite the key to match
  if (browser.edge) {
    matched.browser = 'edge';
    browser.edge = true;
  }

  // Blackberry browsers are marked as Safari on BlackBerry
  if (browser.safari && browser.blackberry || browser.bb) {
    matched.browser = 'blackberry';
    browser.blackberry = true;
  }

  // Playbook browsers are marked as Safari on Playbook
  if (browser.safari && browser.playbook) {
    matched.browser = 'playbook';
    browser.playbook = true;
  }

  // Opera 15+ are identified as opr
  if (browser.opr) {
    matched.browser = 'opera';
    browser.opera = true;
  }

  // Stock Android browsers are marked as Safari on Android.
  if (browser.safari && browser.android) {
    matched.browser = 'android';
    browser.android = true;
  }

  // Kindle browsers are marked as Safari on Kindle
  if (browser.safari && browser.kindle) {
    matched.browser = 'kindle';
    browser.kindle = true;
  }

  // Kindle Silk browsers are marked as Safari on Kindle
  if (browser.safari && browser.silk) {
    matched.browser = 'silk';
    browser.silk = true;
  }

  if (browser.vivaldi) {
    matched.browser = 'vivaldi';
    browser.vivaldi = true;
  }

  // Assign the name and platform variable
  browser.name = matched.browser;
  browser.platform = matched.platform;

  if (window && window.process && window.process.versions && window.process.versions.electron) {
    browser.electron = true;
  }
  else if (document.location.href.indexOf('chrome-extension://') === 0) {
    browser.chromeExt = true;
  }
  else if (window._cordovaNative || document.location.href.indexOf('http') !== 0) {
    browser.cordova = true;
  }

  return browser
}

var Platform = {
  is: getPlatform(),
  has: {
    touch: (function () { return !!('ontouchstart' in document.documentElement) || window.navigator.msMaxTouchPoints > 0; })()
  },
  within: {
    iframe: window.self !== window.top
  }
};

Platform.has.popstate = !Platform.within.iframe && !Platform.is.electron;

var bus;

function installEvents (_Vue) {
  bus = new _Vue();
  return bus
}

var Events = {
  $on: function $on () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];
 bus && bus.$on.apply(bus, args); },
  $once: function $once () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];
 bus && bus.$once.apply(bus, args); },
  $emit: function $emit () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];
 bus && bus.$emit.apply(bus, args); },
  $off: function $off () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];
 bus && bus.$off.apply(bus, args); }
};

function offset (el) {
  if (el === window) {
    return {top: 0, left: 0}
  }
  var ref = el.getBoundingClientRect();
  var top = ref.top;
  var left = ref.left;

  return {top: top, left: left}
}

function style (el, property) {
  return window.getComputedStyle(el).getPropertyValue(property)
}

function height (el) {
  if (el === window) {
    return viewport().height
  }
  return parseFloat(style(el, 'height'))
}

function width (el) {
  if (el === window) {
    return viewport().width
  }
  return parseFloat(style(el, 'width'))
}

function css (element, css) {
  var style = element.style;

  Object.keys(css).forEach(function (prop) {
    style[prop] = css[prop];
  });
}

function viewport () {
  var
    e = window,
    a = 'inner';

  if (!('innerWidth' in window)) {
    a = 'client';
    e = document.documentElement || document.body;
  }

  return {
    width: e[a + 'Width'],
    height: e[a + 'Height']
  }
}

function ready (fn) {
  if (typeof fn !== 'function') {
    return
  }

  if (document.readyState === 'complete') {
    return fn()
  }

  document.addEventListener('DOMContentLoaded', fn, false);
}

var prefix = ['-webkit-', '-moz-', '-ms-', '-o-'];
function cssTransform (val) {
  var o = {transform: val};
  prefix.forEach(function (p) {
    o[p + 'transform'] = val;
  });
  return o
}


var dom = Object.freeze({
	offset: offset,
	style: style,
	height: height,
	width: width,
	css: css,
	viewport: viewport,
	ready: ready,
	cssTransform: cssTransform
});

function set (theme) {
  var currentTheme = current;
  current = theme;

  ready(function () {
    if (currentTheme) {
      document.body.classList.remove(current);
    }
    document.body.classList.add(theme);
  });
}

var current;

if (true) {
  set("mat");
}


var theme = Object.freeze({
	set: set,
	get current () { return current; }
});

var version = "0.14.6";

var Vue;

function setVue (_Vue) {
  Vue = _Vue;
}

var install = function (_Vue, opts) {
  if ( opts === void 0 ) opts = {};

  if (this.installed) {
    return
  }
  this.installed = true;

  setVue(_Vue);

  if (opts.directives) {
    Object.keys(opts.directives).forEach(function (key) {
      var d = opts.directives[key];
      if (d.name !== undefined && !d.name.startsWith('q-')) {
        _Vue.directive(d.name, d);
      }
    });
  }
  if (opts.components) {
    Object.keys(opts.components).forEach(function (key) {
      var c = opts.components[key];
      if (c.name !== undefined && c.name.startsWith('q-')) {
        _Vue.component(c.name, c);
      }
    });
  }

  var events = installEvents(_Vue);

  _Vue.prototype.$q = {
    version: version,
    platform: Platform,
    theme: current,
    events: events
  };
};

var start = function (cb) {
  if ( cb === void 0 ) cb = function () {};

  /*
    if on Cordova, but not on an iframe,
    like on Quasar Play app
   */
  if (!Platform.is.cordova || Platform.within.iframe) {
    cb();
    return
  }

  var tag = document.createElement('script');

  document.addEventListener('deviceready', function () {
    Vue.prototype.$cordova = cordova;
    cb();
  }, false);

  tag.type = 'text/javascript';
  document.body.appendChild(tag);
  tag.src = 'cordova.js';
};

var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];

function humanStorageSize (bytes) {
  var u = 0;

  while (Math.abs(bytes) >= 1024 && u < units.length - 1) {
    bytes /= 1024;
    ++u;
  }

  return ((bytes.toFixed(1)) + " " + (units[u]))
}

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function between (v, min, max) {
  if (max <= min) {
    return min
  }
  return Math.min(max, Math.max(min, v))
}

function normalizeToInterval (v, min, max) {
  if (max <= min) {
    return min
  }

  var size = (max - min + 1);

  var index = v % size;
  if (index < min) {
    index = size + index;
  }

  return index
}

function pad (v, length, char) {
  if ( length === void 0 ) length = 2;
  if ( char === void 0 ) char = '0';

  var val = '' + v;
  return val.length >= length
    ? val
    : new Array(length - val.length + 1).join(char) + val
}


var format = Object.freeze({
	humanStorageSize: humanStorageSize,
	capitalize: capitalize,
	between: between,
	normalizeToInterval: normalizeToInterval,
	pad: pad
});

var xhr = XMLHttpRequest;
var send = xhr.prototype.send;

function translate (ref) {
  var p = ref.p;
  var pos = ref.pos;
  var active = ref.active;
  var horiz = ref.horiz;
  var reverse = ref.reverse;

  var x = 1, y = 1;

  if (horiz) {
    if (reverse) { x = -1; }
    if (pos === 'bottom') { y = -1; }
    return cssTransform(("translate3d(" + (x * (p - 100)) + "%, " + (active ? 0 : y * -200) + "%, 0)"))
  }

  if (reverse) { y = -1; }
  if (pos === 'right') { x = -1; }
  return cssTransform(("translate3d(" + (active ? 0 : x * -200) + "%, " + (y * (p - 100)) + "%, 0)"))
}

function inc (p, amount) {
  if (typeof amount !== 'number') {
    if (p < 25) {
      amount = Math.random() * (5 - 3 + 1) + 3;
    }
    else if (p < 65) {
      amount = Math.random() * 3;
    }
    else if (p < 85) {
      amount = Math.random() * 2;
    }
    else if (p < 99) {
      amount = 0.5;
    }
    else {
      amount = 0;
    }
  }
  return between(p + amount, 0, 100)
}

function highjackAjax (startHandler, endHandler) {
  xhr.prototype.send = function () {
    var this$1 = this;
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    startHandler();

    this.addEventListener('abort', endHandler, false);
    this.addEventListener('readystatechange', function () {
      if (this$1.readyState === 4) {
        endHandler();
      }
    }, false);

    send.apply(this, args);
  };
}

function restoreAjax () {
  xhr.prototype.send = send;
}

var QAjaxBar = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-loading-bar shadow-1",class:[_vm.position, _vm.animate ? '' : 'no-transition'],style:(_vm.containerStyle)},[_c('div',{staticClass:"q-loading-bar-inner",class:("bg-" + (_vm.color))})])},staticRenderFns: [],
  name: 'q-ajax-bar',
  props: {
    position: {
      type: String,
      default: 'top',
      validator: function validator (val) {
        return ['top', 'right', 'bottom', 'left'].includes(val)
      }
    },
    size: {
      type: String,
      default: '4px'
    },
    color: {
      type: String,
      default: 'red'
    },
    speed: {
      type: Number,
      default: 250
    },
    delay: {
      type: Number,
      default: 1000
    },
    reverse: Boolean
  },
  data: function data () {
    return {
      animate: false,
      active: false,
      progress: 0,
      calls: 0
    }
  },
  computed: {
    containerStyle: function containerStyle () {
      var o = translate({
        p: this.progress,
        pos: this.position,
        active: this.active,
        horiz: this.horizontal,
        reverse: this.reverse
      });
      o[this.sizeProp] = this.size;
      return o
    },
    horizontal: function horizontal () {
      return this.position === 'top' || this.position === 'bottom'
    },
    sizeProp: function sizeProp () {
      return this.horizontal ? 'height' : 'width'
    }
  },
  methods: {
    start: function start () {
      var this$1 = this;

      this.calls++;
      if (!this.active) {
        this.progress = 0;
        this.active = true;
        this.animate = false;
        this.$emit('start');
        this.timer = setTimeout(function () {
          this$1.animate = true;
          this$1.move();
        }, this.delay);
      }
      else if (this.closing) {
        this.closing = false;
        clearTimeout(this.timer);
        this.progress = 0;
        this.move();
      }
    },
    increment: function increment (amount) {
      if (this.active) {
        this.progress = inc(this.progress, amount);
      }
    },
    stop: function stop () {
      var this$1 = this;

      this.calls = Math.max(0, this.calls - 1);
      if (this.calls > 0) {
        return
      }

      clearTimeout(this.timer);

      if (!this.animate) {
        this.active = false;
        return
      }
      this.closing = true;
      this.progress = 100;
      this.$emit('stop');
      this.timer = setTimeout(function () {
        this$1.closing = false;
        this$1.active = false;
      }, 1050);
    },
    move: function move () {
      var this$1 = this;

      this.timer = setTimeout(function () {
        this$1.increment();
        this$1.move();
      }, this.speed);
    }
  },
  mounted: function mounted () {
    highjackAjax(this.start, this.stop);
  },
  beforeDestroy: function beforeDestroy () {
    clearTimeout(this.timer);
    restoreAjax();
  }
};

var typeIcon = {
  positive: 'check_circle',
  negative: 'warning',
  info: 'info',
  warning: 'priority_high'
};

var QIcon = {
  name: 'q-icon',
  functional: true,
  props: {
    name: String,
    mat: String,
    ios: String,
    color: String,
    size: String
  },
  render: function render (h, ctx) {
    var name, text;
    var
      prop = ctx.props,
      data = ctx.data,
      theme = ctx.parent.$q.theme,
      cls = ctx.data.staticClass,
      icon = prop.mat && theme === 'mat'
        ? prop.mat
        : (prop.ios && theme === 'ios' ? prop.ios : ctx.props.name);

    if (!icon) {
      name = '';
    }
    else if (icon.startsWith('fa-')) {
      name = "fa " + icon;
    }
    else if (icon.startsWith('bt-')) {
      name = "bt " + icon;
    }
    else if (icon.startsWith('ion-') || icon.startsWith('icon-')) {
      name = "" + icon;
    }
    else {
      name = 'material-icons';
      text = icon.replace(/ /g, '_');
    }

    data.staticClass = (cls ? cls + ' ' : '') + "q-icon" + (name.length ? (" " + name) : '') + (prop.color ? (" text-" + (prop.color)) : '');

    if (!data.hasOwnProperty('attrs')) {
      data.attrs = {};
    }
    data.attrs['aria-hidden'] = 'true';

    if (prop.size) {
      var style = "font-size: " + (prop.size) + ";";
      data.style = data.style
        ? [data.style, style]
        : style;
    }

    return h('i', data, text ? [text, ctx.children] : [' ', ctx.children])
  }
};

/*
 * Also import the necessary CSS into the app.
 *
 * Example:
 * import 'quasar-extras/animate/bounceInLeft.css'
 */

var QTransition = {
  name: 'q-transition',
  functional: true,
  props: {
    name: String,
    enter: String,
    leave: String,
    group: Boolean
  },
  render: function render (h, ctx) {
    var
      prop = ctx.props,
      data = ctx.data;

    if (prop.name) {
      data.props = {
        name: prop.name
      };
    }
    else if (prop.enter && prop.leave) {
      data.props = {
        enterActiveClass: ("animated " + (prop.enter)),
        leaveActiveClass: ("animated " + (prop.leave))
      };
    }
    else {
      return ctx.children
    }

    return h(("transition" + (ctx.props.group ? '-group' : '')), data, ctx.children)
  }
};

var QAlert = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-alert-container",class:_vm.containerClass},[_c('q-transition',{attrs:{"name":_vm.name,"enter":_vm.enter,"leave":_vm.leave,"duration":_vm.duration,"appear":_vm.appear},on:{"after-leave":function($event){_vm.$emit('dismiss-end');}}},[(_vm.active)?_c('div',{staticClass:"q-alert row no-wrap",class:_vm.classes},[_c('div',{staticClass:"q-alert-icon row col-auto flex-center"},[_c('q-icon',{attrs:{"name":_vm.alertIcon}})],1),_vm._v(" "),_c('div',{staticClass:"q-alert-content col self-center"},[_vm._t("default"),_vm._v(" "),(_vm.actions && _vm.actions.length)?_c('div',{staticClass:"q-alert-actions row items-center"},_vm._l((_vm.actions),function(btn){return _c('span',{key:btn.label,staticClass:"uppercase",domProps:{"innerHTML":_vm._s(btn.label)},on:{"click":function($event){_vm.dismiss(btn.handler);}}})})):_vm._e()],2),_vm._v(" "),(_vm.dismissible)?_c('div',{staticClass:"q-alert-close self-top col-auto"},[_c('q-icon',{staticClass:"cursor-pointer",attrs:{"name":"close"},on:{"click":_vm.dismiss}})],1):_vm._e()]):_vm._e()])],1)},staticRenderFns: [],
  name: 'q-alert',
  components: {
    QIcon: QIcon,
    QTransition: QTransition
  },
  props: {
    value: Boolean,
    duration: Number,
    name: String,
    enter: String,
    leave: String,
    appear: Boolean,
    color: {
      type: String,
      default: 'negative'
    },
    inline: Boolean,
    icon: String,
    dismissible: Boolean,
    actions: Array,
    position: {
      type: String,
      validator: function (v) { return [
        'top', 'top-right', 'right', 'bottom-right',
        'bottom', 'bottom-left', 'left', 'top-left',
        'top-center', 'bottom-center'
      ].includes(v); }
    }
  },
  data: function data () {
    return {
      active: true
    }
  },
  watch: {
    value: function value (v) {
      if (v !== this.active) {
        this.active = v;
        if (!v) {
          this.$emit('dismiss');
        }
      }
    }
  },
  computed: {
    alertIcon: function alertIcon () {
      return this.icon || typeIcon[this.color] || typeIcon.warning
    },
    containerClass: function containerClass () {
      var cls = [];
      var pos = this.position;

      if (pos) {
        if (pos.indexOf('center') > -1) {
          cls.push('row justify-center');
          pos = pos.split('-')[0];
        }
        cls.push(("fixed-" + pos + (pos === 'left' || pos === 'right' ? ' row items-center' : '') + " z-alert"));
      }
      if (this.inline) {
        cls.push('inline-block');
      }
      return cls
    },
    classes: function classes () {
      return ("shadow-2 bg-" + (this.color))
    }
  },
  methods: {
    dismiss: function dismiss (fn) {
      this.active = false;
      this.$emit('input', false);
      this.$emit('dismiss');
      if (typeof fn === 'function') {
        fn();
      }
    }
  }
};

var filter = function (terms, ref) {
  var field = ref.field;
  var list = ref.list;

  var token = terms.toLowerCase();
  return list.filter(function (item) { return ('' + item[field]).toLowerCase().startsWith(token); })
};

function s4 () {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

var uid = function () {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
};

var marginal = {
  type: Array,
  validator: function (v) { return v.every(function (i) { return 'icon' in i; }); }
};

var align = {
  left: 'start',
  center: 'center',
  right: 'end'
};

var FrameMixin = {
  components: {
    QIcon: QIcon
  },
  props: {
    prefix: String,
    suffix: String,
    stackLabel: String,
    floatLabel: String,
    error: Boolean,
    disable: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    dark: Boolean,
    before: marginal,
    after: marginal,
    inverted: Boolean,
    align: {
      type: String,
      default: 'left',
      validator: function (v) { return ['left', 'center', 'right'].includes(v); }
    }
  },
  computed: {
    labelIsAbove: function labelIsAbove () {
      return this.focused || this.length || this.additionalLength || this.stackLabel
    },
    alignClass: function alignClass () {
      return ("justify-" + (align[this.align]))
    }
  }
};

var InputMixin = {
  props: {
    autofocus: Boolean,
    name: String,
    maxLength: [Number, String],
    maxHeight: Number,
    placeholder: String,
    loading: Boolean
  },
  computed: {
    inputPlaceholder: function inputPlaceholder () {
      if ((!this.floatLabel && !this.stackLabel) || this.labelIsAbove) {
        return this.placeholder
      }
    }
  },
  methods: {
    focus: function focus () {
      if (!this.disable) {
        this.$refs.input.focus();
      }
    },
    blur: function blur () {
      this.$refs.input.blur();
    },
    select: function select () {
      this.$refs.input.select();
    },

    __onFocus: function __onFocus (e) {
      this.focused = true;
      this.$emit('focus', e);
    },
    __onBlur: function __onBlur (e) {
      this.focused = false;
      this.$emit('blur', e);
    },
    __onKeydown: function __onKeydown (e) {
      this.$emit('keydown', e);
    },
    __onKeyup: function __onKeyup (e) {
      this.$emit('keyup', e);
    },
    __onClick: function __onClick (e) {
      this.focus();
      this.$emit('click', e);
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      var input = this$1.$refs.input;
      if (this$1.autofocus && input) {
        input.focus();
      }
    });
  }
};

var inputTypes = [
  'text', 'textarea', 'email',
  'tel', 'file', 'number',
  'password', 'url'
];

function debounce (fn, wait, immediate) {
  if ( wait === void 0 ) wait = 250;

  var timeout;
  return function () {
    var this$1 = this;
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var later = function () {
      timeout = null;
      if (!immediate) {
        fn.apply(this$1, args);
      }
    };

    clearTimeout(timeout);
    if (immediate && !timeout) {
      fn.apply(this, args);
    }
    timeout = setTimeout(later, wait);
  }
}

function frameDebounce (fn) {
  var wait = false;

  return function () {
    var this$1 = this;
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (wait) { return }

    wait = true;
    window.requestAnimationFrame(function () {
      fn.apply(this$1, args);
      wait = false;
    });
  }
}

function getEvent (e) {
  return e || window.event
}

function rightClick (e) {
  e = getEvent(e);

  if (e.which) {
    return e.which === 3
  }
  if (e.button) {
    return e.button === 2
  }

  return false
}

function getEventKey (e) {
  e = getEvent(e);
  return e.which || e.keyCode
}

function position (e) {
  var posx, posy;
  e = getEvent(e);

  if (e.touches && e.touches[0]) {
    e = e.touches[0];
  }
  else if (e.changedTouches && e.changedTouches[0]) {
    e = e.changedTouches[0];
  }

  if (e.clientX || e.clientY) {
    posx = e.clientX;
    posy = e.clientY;
  }
  else if (e.pageX || e.pageY) {
    posx = e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft;
    posy = e.pageY - document.body.scrollTop - document.documentElement.scrollTop;
  }

  return {
    top: posy,
    left: posx
  }
}

function targetElement (e) {
  var target;
  e = getEvent(e);

  if (e.target) {
    target = e.target;
  }
  else if (e.srcElement) {
    target = e.srcElement;
  }

  // defeat Safari bug
  if (target.nodeType === 3) {
    target = target.parentNode;
  }

  return target
}

// Reasonable defaults
var PIXEL_STEP = 10;
var LINE_HEIGHT = 40;
var PAGE_HEIGHT = 800;

function getMouseWheelDistance (e) {
  var
    sX = 0, sY = 0, // spinX, spinY
    pX = 0, pY = 0; // pixelX, pixelY

  // Legacy
  if ('detail' in e) { sY = e.detail; }
  if ('wheelDelta' in e) { sY = -e.wheelDelta / 120; }
  if ('wheelDeltaY' in e) { sY = -e.wheelDeltaY / 120; }
  if ('wheelDeltaX' in e) { sX = -e.wheelDeltaX / 120; }

  // side scrolling on FF with DOMMouseScroll
  if ('axis' in e && e.axis === e.HORIZONTAL_AXIS) {
    sX = sY;
    sY = 0;
  }

  pX = sX * PIXEL_STEP;
  pY = sY * PIXEL_STEP;

  if ('deltaY' in e) { pY = e.deltaY; }
  if ('deltaX' in e) { pX = e.deltaX; }

  if ((pX || pY) && e.deltaMode) {
    if (e.deltaMode === 1) { // delta in LINE units
      pX *= LINE_HEIGHT;
      pY *= LINE_HEIGHT;
    }
    else { // delta in PAGE units
      pX *= PAGE_HEIGHT;
      pY *= PAGE_HEIGHT;
    }
  }

  // Fall-back if spin cannot be determined
  if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
  if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

  /*
   * spinX  -- normalized spin speed (use for zoom) - x plane
   * spinY  -- " - y plane
   * pixelX -- normalized distance (to pixels) - x plane
   * pixelY -- " - y plane
   */
  return {
    spinX: sX,
    spinY: sY,
    pixelX: pX,
    pixelY: pY
  }
}


var event = Object.freeze({
	rightClick: rightClick,
	getEventKey: getEventKey,
	position: position,
	targetElement: targetElement,
	getMouseWheelDistance: getMouseWheelDistance
});

function showRipple (evt, el, stopPropagation) {
  if (stopPropagation) {
    evt.stopPropagation();
  }

  var
    container = document.createElement('span'),
    animNode = document.createElement('span');

  container.appendChild(animNode);
  container.className = 'q-ripple-container';

  var size = el.clientWidth > el.clientHeight ? el.clientWidth : el.clientHeight;
  size = (size * 2) + "px";
  animNode.className = 'q-ripple-animation';
  css(animNode, { width: size, height: size });

  el.appendChild(container);

  var
    offset$$1 = el.getBoundingClientRect(),
    pos = position(evt),
    x = pos.left - offset$$1.left,
    y = pos.top - offset$$1.top;

  animNode.classList.add('q-ripple-animation-enter', 'q-ripple-animation-visible');
  css(animNode, cssTransform(("translate(-50%, -50%) translate(" + x + "px, " + y + "px) scale(.001)")));

  setTimeout(function () {
    animNode.classList.remove('q-ripple-animation-enter');
    css(animNode, cssTransform(("translate(-50%, -50%) translate(" + x + "px, " + y + "px)")));
    setTimeout(function () {
      animNode.classList.remove('q-ripple-animation-visible');
      setTimeout(function () {
        animNode.parentNode.remove();
      }, 300);
    }, 400);
  }, 25);
}

function shouldAbort (ref) {
  var mat = ref.mat;
  var ios = ref.ios;

  return (
    (mat && current !== 'mat') ||
    (ios && current !== 'ios')
  )
}

var Ripple = {
  name: 'ripple',
  inserted: function inserted (el, ref) {
    var value = ref.value;
    var modifiers = ref.modifiers;

    if (shouldAbort(modifiers)) {
      return
    }

    var ctx = {
      enabled: value !== false,
      click: function click (evt) {
        if (ctx.enabled) {
          showRipple(evt, el, modifiers.stop);
        }
      }
    };

    el.__qripple = ctx;
    el.addEventListener('click', ctx.click, false);
  },
  update: function update (el, ref) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    if (el.__qripple && value !== oldValue) {
      el.__qripple.enabled = value !== false;
    }
  },
  unbind: function unbind (el, ref) {
    var modifiers = ref.modifiers;

    if (shouldAbort(modifiers)) {
      return
    }

    var ctx = el.__qripple;
    el.removeEventListener('click', ctx.click, false);
    delete el.__qripple;
  }
};

var QInputFrame = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"ripple",rawName:"v-ripple.mat",value:(_vm.inverted),expression:"inverted",modifiers:{"mat":true}}],staticClass:"q-if row no-wrap items-center relative-position",class:_vm.classes,attrs:{"tabindex":_vm.focusable && !_vm.disable ? 0 : null},on:{"click":_vm.__onClick}},[(_vm.before)?_vm._l((_vm.before),function(item){return _c('q-icon',{key:item.icon,staticClass:"q-if-control q-if-control-before",class:{hidden: _vm.__additionalHidden(item, _vm.hasError, _vm.length)},attrs:{"name":item.icon},on:{"click":function($event){(item.handler || _vm.__defaultHandler)($event);}}})}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"q-if-inner col row no-wrap items-center relative-position"},[(_vm.label)?_c('div',{staticClass:"q-if-label ellipsis full-width absolute self-start",class:{'q-if-label-above': _vm.labelIsAbove},domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),(_vm.prefix)?_c('span',{staticClass:"q-if-addon q-if-addon-left",class:_vm.addonClass,domProps:{"innerHTML":_vm._s(_vm.prefix)}}):_vm._e(),_vm._v(" "),_vm._t("default"),_vm._v(" "),(_vm.suffix)?_c('span',{staticClass:"q-if-addon q-if-addon-right",class:_vm.addonClass,domProps:{"innerHTML":_vm._s(_vm.suffix)}}):_vm._e()],2),_vm._v(" "),_vm._t("after"),_vm._v(" "),(_vm.after)?_vm._l((_vm.after),function(item){return _c('q-icon',{key:item.icon,staticClass:"q-if-control",class:{hidden: _vm.__additionalHidden(item, _vm.hasError, _vm.length)},attrs:{"name":item.icon},on:{"click":function($event){(item.handler || _vm.__defaultHandler)($event);}}})}):_vm._e()],2)},staticRenderFns: [],
  name: 'q-input-frame',
  mixins: [FrameMixin],
  directives: {
    Ripple: Ripple
  },
  props: {
    topAddons: Boolean,
    focused: Boolean,
    length: Number,
    focusable: Boolean,
    additionalLength: Boolean
  },
  data: function data () {
    return {
      field: {}
    }
  },
  inject: {
    __field: { default: null }
  },
  computed: {
    label: function label () {
      return this.stackLabel || this.floatLabel
    },
    addonClass: function addonClass () {
      return {
        'q-if-addon-visible': this.labelIsAbove,
        'self-start': this.topAddons
      }
    },
    classes: function classes () {
      var cls = [{
        'q-if-has-label': this.label,
        'q-if-focused': this.focused,
        'q-if-error': this.hasError,
        'q-if-disabled': this.disable,
        'q-if-focusable': this.focusable && !this.disable,
        'q-if-inverted': this.inverted,
        'q-if-dark': this.dark || this.inverted
      }];

      var color = this.hasError ? 'negative' : this.color;
      if (this.inverted) {
        cls.push(("bg-" + color));
        cls.push("text-white");
      }
      else {
        cls.push(("text-" + color));
      }
      return cls
    },
    hasError: function hasError () {
      return !!(this.field.error || this.error)
    }
  },
  methods: {
    __onClick: function __onClick (e) {
      this.$emit('click', e);
    },
    __additionalHidden: function __additionalHidden (item, hasError, length) {
      if (item.condition !== void 0) {
        return item.condition === false
      }
      return (
        (item.content !== void 0 && !item.content === (length > 0)) ||
        (item.error !== void 0 && !item.error === hasError)
      )
    },
    __defaultHandler: function __defaultHandler () {}
  },
  created: function created () {
    if (this.__field) {
      this.field = this.__field;
      this.field.__registerInput(this);
    }
  },
  beforeDestroy: function beforeDestroy () {
    if (this.__field) {
      this.field.__unregisterInput();
    }
  }
};

function getSize (el) {
  return {
    width: el.offsetWidth,
    height: el.offsetHeight
  }
}

var QResizeObservable = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"absolute-full overflow-hidden invisible",staticStyle:{"z-index":"-1"}},[_c('div',{ref:"expand",staticClass:"absolute-full overflow-hidden invisible",on:{"scroll":_vm.onResize}},[_c('div',{ref:"expandChild",staticClass:"absolute-top-left transition-0",staticStyle:{"width":"100000px","height":"100000px"}})]),_vm._v(" "),_c('div',{ref:"shrink",staticClass:"absolute-full overflow-hidden invisible",on:{"scroll":_vm.onResize}},[_c('div',{staticClass:"absolute-top-left transition-0",staticStyle:{"width":"200%","height":"200%"}})])])},staticRenderFns: [],
  name: 'q-resize-observable',
  methods: {
    onResize: function onResize () {
      var size = getSize(this.$el.parentNode);

      if (size.width === this.size.width && size.height === this.size.height) {
        return
      }

      if (!this.timer) {
        this.timer = window.requestAnimationFrame(this.emit);
      }

      this.size = size;
    },
    emit: function emit () {
      this.timer = null;
      this.reset();
      this.$emit('resize', this.size);
    },
    reset: function reset () {
      var ref = this.$refs;
      if (ref.expand) {
        ref.expand.scrollLeft = 100000;
        ref.expand.scrollTop = 100000;
      }
      if (ref.shrink) {
        ref.shrink.scrollLeft = 100000;
        ref.shrink.scrollTop = 100000;
      }
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.size = {};
      this$1.onResize();
    });
  },
  beforeDestroy: function beforeDestroy () {
    window.cancelAnimationFrame(this.timer);
    this.$emit('resize', {width: 0, height: 0});
  }
};

function getScrollTarget (el) {
  return el.closest('.scroll') || window
}

function getScrollHeight (el) {
  return (el === window ? document.body : el).scrollHeight
}

function getScrollPosition (scrollTarget) {
  if (scrollTarget === window) {
    return window.pageYOffset || window.scrollY || document.body.scrollTop || 0
  }
  return scrollTarget.scrollTop
}

function animScrollTo (el, to, duration) {
  if (duration <= 0) {
    return
  }

  var pos = getScrollPosition(el);

  window.requestAnimationFrame(function () {
    setScroll(el, pos + (to - pos) / duration * 16);
    if (el.scrollTop !== to) {
      animScrollTo(el, to, duration - 16);
    }
  });
}

function setScroll (scrollTarget, offset$$1) {
  if (scrollTarget === window) {
    document.documentElement.scrollTop = offset$$1;
    document.body.scrollTop = offset$$1;
    return
  }
  scrollTarget.scrollTop = offset$$1;
}

function setScrollPosition (scrollTarget, offset$$1, duration) {
  if (duration) {
    animScrollTo(scrollTarget, offset$$1, duration);
    return
  }
  setScroll(scrollTarget, offset$$1);
}

var size;
function getScrollbarWidth () {
  if (size !== undefined) {
    return size
  }

  var
    inner = document.createElement('p'),
    outer = document.createElement('div');

  css(inner, {
    width: '100%',
    height: '200px'
  });
  css(outer, {
    position: 'absolute',
    top: '0px',
    left: '0px',
    visibility: 'hidden',
    width: '200px',
    height: '150px',
    overflow: 'hidden'
  });

  outer.appendChild(inner);

  document.body.appendChild(outer);

  var w1 = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var w2 = inner.offsetWidth;

  if (w1 === w2) {
    w2 = outer.clientWidth;
  }

  document.body.removeChild(outer);
  size = w1 - w2;

  return size
}


var scroll = Object.freeze({
	getScrollTarget: getScrollTarget,
	getScrollHeight: getScrollHeight,
	getScrollPosition: getScrollPosition,
	setScrollPosition: setScrollPosition,
	getScrollbarWidth: getScrollbarWidth
});

var QScrollObservable = {
  name: 'q-scroll-observable',
  render: function render () {},
  data: function data () {
    return {
      pos: 0,
      dir: 'down',
      dirChanged: false,
      dirChangePos: 0
    }
  },
  methods: {
    getPosition: function getPosition () {
      return {
        position: this.pos,
        direction: this.dir,
        directionChanged: this.dirChanged,
        inflexionPosition: this.dirChangePos
      }
    },
    trigger: function trigger () {
      if (!this.timer) {
        this.timer = window.requestAnimationFrame(this.emit);
      }
    },
    emit: function emit () {
      var
        pos = Math.max(0, getScrollPosition(this.target)),
        delta = pos - this.pos,
        dir = delta < 0 ? 'up' : 'down';

      this.dirChanged = this.dir !== dir;
      if (this.dirChanged) {
        this.dir = dir;
        this.dirChangePos = this.pos;
      }

      this.timer = null;
      this.pos = pos;
      this.$emit('scroll', this.getPosition());
    }
  },
  mounted: function mounted () {
    this.target = getScrollTarget(this.$el.parentNode);
    this.target.addEventListener('scroll', this.trigger);
    this.trigger();
  },
  beforeDestroy: function beforeDestroy () {
    this.target.removeEventListener('scroll', this.trigger);
  }
};

var QWindowResizeObservable = {
  name: 'q-window-resize-observable',
  render: function render () {},
  methods: {
    trigger: function trigger () {
      if (!this.timer) {
        this.timer = window.requestAnimationFrame(this.emit);
      }
    },
    emit: function emit () {
      this.timer = null;
      this.$emit('resize', viewport());
    }
  },
  mounted: function mounted () {
    this.emit();
    window.addEventListener('resize', this.trigger);
  },
  beforeDestroy: function beforeDestroy () {
    window.removeEventListener('resize', this.trigger);
  }
};

var mixin = {
  props: {
    color: String,
    size: {
      type: [Number, String],
      default: '1rem'
    }
  },
  computed: {
    classes: function classes () {
      if (this.color) {
        return ("text-" + (this.color))
      }
    }
  }
};

var QSpinnerIos = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"stroke":"currentColor","fill":"currentColor","viewBox":"0 0 64 64"}},[_c('g',{attrs:{"stroke-width":"4","stroke-linecap":"round"}},[_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(180)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":"1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(210)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":"0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(240)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".1;0;1;.85;.7;.65;.55;.45;.35;.25;.15;.1","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(270)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".15;.1;0;1;.85;.7;.65;.55;.45;.35;.25;.15","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(300)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".25;.15;.1;0;1;.85;.7;.65;.55;.45;.35;.25","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(330)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".35;.25;.15;.1;0;1;.85;.7;.65;.55;.45;.35","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(0)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".45;.35;.25;.15;.1;0;1;.85;.7;.65;.55;.45","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(30)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".55;.45;.35;.25;.15;.1;0;1;.85;.7;.65;.55","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(60)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".65;.55;.45;.35;.25;.15;.1;0;1;.85;.7;.65","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(90)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".7;.65;.55;.45;.35;.25;.15;.1;0;1;.85;.7","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(120)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":".85;.7;.65;.55;.45;.35;.25;.15;.1;0;1;.85","repeatCount":"indefinite"}})]),_c('line',{attrs:{"y1":"17","y2":"29","transform":"translate(32,32) rotate(150)"}},[_c('animate',{attrs:{"attributeName":"stroke-opacity","dur":"750ms","values":"1;.85;.7;.65;.55;.45;.35;.25;.15;.1;0;1","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  name: 'q-spinner-ios',
  mixins: [mixin]
};

var QSpinnerMat = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner q-spinner-mat",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"25 25 50 50"}},[_c('circle',{staticClass:"path",attrs:{"cx":"50","cy":"50","r":"20","fill":"none","stroke":"currentColor","stroke-width":"3","stroke-miterlimit":"10"}})])},staticRenderFns: [],
  name: 'q-spinner-mat',
  mixins: [mixin]
};

var QSpinner = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-spinner-' + _vm.name,{tag:"component",attrs:{"size":_vm.size,"color":_vm.color}})},staticRenderFns: [],
  name: 'q-spinner',
  mixins: [mixin],
  computed: {
    name: function name () {
      return current
    }
  },
  components: {
    QSpinnerIos: QSpinnerIos,
    QSpinnerMat: QSpinnerMat
  }
};

var audio = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 55 80","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"matrix(1 0 0 -1 0 80)"}},[_c('rect',{attrs:{"width":"10","height":"20","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"4.3s","values":"20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"15","width":"10","height":"80","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"2s","values":"80;55;33;5;75;23;73;33;12;14;60;80","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"30","width":"10","height":"50","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"1.4s","values":"50;34;78;23;56;23;34;76;80;54;21;50","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"45","width":"10","height":"30","rx":"3"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"2s","values":"30;45;13;80;56;72;45;76;34;23;67;30","calcMode":"linear","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  name: 'q-spinner-audio',
  mixins: [mixin]
};

var ball = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"stroke":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 57 57","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"translate(1 1)","stroke-width":"2","fill":"none","fill-rule":"evenodd"}},[_c('circle',{attrs:{"cx":"5","cy":"50","r":"5"}},[_c('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","values":"50;5;50;50","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"cx","begin":"0s","dur":"2.2s","values":"5;27;49;5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"27","cy":"5","r":"5"}},[_c('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","from":"5","to":"5","values":"5;50;50;5","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"cx","begin":"0s","dur":"2.2s","from":"27","to":"27","values":"27;49;5;27","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"49","cy":"50","r":"5"}},[_c('animate',{attrs:{"attributeName":"cy","begin":"0s","dur":"2.2s","values":"50;50;5;50","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"cx","from":"49","to":"49","begin":"0s","dur":"2.2s","values":"49;5;27;49","calcMode":"linear","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  name: 'q-spinner-ball',
  mixins: [mixin]
};

var bars = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 135 140","xmlns":"http://www.w3.org/2000/svg"}},[_c('rect',{attrs:{"y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.5s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.5s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"30","y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.25s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.25s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"60","width":"15","height":"140","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"90","y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.25s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.25s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})]),_c('rect',{attrs:{"x":"120","y":"10","width":"15","height":"120","rx":"6"}},[_c('animate',{attrs:{"attributeName":"height","begin":"0.5s","dur":"1s","values":"120;110;100;90;80;70;60;50;40;140;120","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"y","begin":"0.5s","dur":"1s","values":"10;15;20;25;30;35;40;45;50;0;10","calcMode":"linear","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  name: 'q-spinner-bars',
  mixins: [mixin]
};

var circles = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 135 135","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"d":"M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 67 67","to":"-360 67 67","dur":"2.5s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 67 67","to":"360 67 67","dur":"8s","repeatCount":"indefinite"}})],1)])},staticRenderFns: [],
  name: 'q-spinner-circles',
  mixins: [mixin]
};

var comment = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid"}},[_c('rect',{attrs:{"x":"0","y":"0","width":"100","height":"100","fill":"none"}}),_c('path',{attrs:{"d":"M78,19H22c-6.6,0-12,5.4-12,12v31c0,6.6,5.4,12,12,12h37.2c0.4,3,1.8,5.6,3.7,7.6c2.4,2.5,5.1,4.1,9.1,4 c-1.4-2.1-2-7.2-2-10.3c0-0.4,0-0.8,0-1.3h8c6.6,0,12-5.4,12-12V31C90,24.4,84.6,19,78,19z","fill":"currentColor"}}),_c('circle',{attrs:{"cx":"30","cy":"47","r":"5","fill":"#fff"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","values":"0;1;1","keyTimes":"0;0.2;1","dur":"1s","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"50","cy":"47","r":"5","fill":"#fff"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","values":"0;0;1;1","keyTimes":"0;0.2;0.4;1","dur":"1s","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"70","cy":"47","r":"5","fill":"#fff"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","values":"0;0;1;1","keyTimes":"0;0.4;0.6;1","dur":"1s","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  name: 'q-spinner-comment',
  mixins: [mixin]
};

var cube = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid"}},[_c('rect',{attrs:{"x":"0","y":"0","width":"100","height":"100","fill":"none"}}),_c('g',{attrs:{"transform":"translate(25 25)"}},[_c('rect',{attrs:{"x":"-20","y":"-20","width":"40","height":"40","fill":"currentColor","opacity":"0.9"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"1.5","to":"1","repeatCount":"indefinite","begin":"0s","dur":"1s","calcMode":"spline","keySplines":"0.2 0.8 0.2 0.8","keyTimes":"0;1"}})],1)]),_c('g',{attrs:{"transform":"translate(75 25)"}},[_c('rect',{attrs:{"x":"-20","y":"-20","width":"40","height":"40","fill":"currentColor","opacity":"0.8"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"1.5","to":"1","repeatCount":"indefinite","begin":"0.1s","dur":"1s","calcMode":"spline","keySplines":"0.2 0.8 0.2 0.8","keyTimes":"0;1"}})],1)]),_c('g',{attrs:{"transform":"translate(25 75)"}},[_c('rect',{staticClass:"cube",attrs:{"x":"-20","y":"-20","width":"40","height":"40","fill":"currentColor","opacity":"0.7"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"1.5","to":"1","repeatCount":"indefinite","begin":"0.3s","dur":"1s","calcMode":"spline","keySplines":"0.2 0.8 0.2 0.8","keyTimes":"0;1"}})],1)]),_c('g',{attrs:{"transform":"translate(75 75)"}},[_c('rect',{staticClass:"cube",attrs:{"x":"-20","y":"-20","width":"40","height":"40","fill":"currentColor","opacity":"0.6"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"1.5","to":"1","repeatCount":"indefinite","begin":"0.2s","dur":"1s","calcMode":"spline","keySplines":"0.2 0.8 0.2 0.8","keyTimes":"0;1"}})],1)])])},staticRenderFns: [],
  name: 'q-spinner-cube',
  mixins: [mixin]
};

var dots = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 120 30","xmlns":"http://www.w3.org/2000/svg"}},[_c('circle',{attrs:{"cx":"15","cy":"15","r":"15"}},[_c('animate',{attrs:{"attributeName":"r","from":"15","to":"15","begin":"0s","dur":"0.8s","values":"15;9;15","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"fill-opacity","from":"1","to":"1","begin":"0s","dur":"0.8s","values":"1;.5;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"60","cy":"15","r":"9","fill-opacity":".3"}},[_c('animate',{attrs:{"attributeName":"r","from":"9","to":"9","begin":"0s","dur":"0.8s","values":"9;15;9","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"fill-opacity","from":".5","to":".5","begin":"0s","dur":"0.8s","values":".5;1;.5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"105","cy":"15","r":"15"}},[_c('animate',{attrs:{"attributeName":"r","from":"15","to":"15","begin":"0s","dur":"0.8s","values":"15;9;15","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"fill-opacity","from":"1","to":"1","begin":"0s","dur":"0.8s","values":"1;.5;1","calcMode":"linear","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  name: 'q-spinner-dots',
  mixins: [mixin]
};

var facebook = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","xmlns":"http://www.w3.org/2000/svg","preserveAspectRatio":"xMidYMid"}},[_c('g',{attrs:{"transform":"translate(20 50)"}},[_c('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":"currentColor","opacity":"0.6"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})],1)]),_c('g',{attrs:{"transform":"translate(50 50)"}},[_c('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":"currentColor","opacity":"0.8"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0.1s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})],1)]),_c('g',{attrs:{"transform":"translate(80 50)"}},[_c('rect',{attrs:{"x":"-10","y":"-30","width":"20","height":"60","fill":"currentColor","opacity":"0.9"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"scale","from":"2","to":"1","begin":"0.2s","repeatCount":"indefinite","dur":"1s","calcMode":"spline","keySplines":"0.1 0.9 0.4 1","keyTimes":"0;1","values":"2;1"}})],1)])])},staticRenderFns: [],
  name: 'q-spinner-facebook',
  mixins: [mixin]
};

var gears = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"translate(-20,-20)"}},[_c('path',{attrs:{"d":"M79.9,52.6C80,51.8,80,50.9,80,50s0-1.8-0.1-2.6l-5.1-0.4c-0.3-2.4-0.9-4.6-1.8-6.7l4.2-2.9c-0.7-1.6-1.6-3.1-2.6-4.5 L70,35c-1.4-1.9-3.1-3.5-4.9-4.9l2.2-4.6c-1.4-1-2.9-1.9-4.5-2.6L59.8,27c-2.1-0.9-4.4-1.5-6.7-1.8l-0.4-5.1C51.8,20,50.9,20,50,20 s-1.8,0-2.6,0.1l-0.4,5.1c-2.4,0.3-4.6,0.9-6.7,1.8l-2.9-4.1c-1.6,0.7-3.1,1.6-4.5,2.6l2.1,4.6c-1.9,1.4-3.5,3.1-5,4.9l-4.5-2.1 c-1,1.4-1.9,2.9-2.6,4.5l4.1,2.9c-0.9,2.1-1.5,4.4-1.8,6.8l-5,0.4C20,48.2,20,49.1,20,50s0,1.8,0.1,2.6l5,0.4 c0.3,2.4,0.9,4.7,1.8,6.8l-4.1,2.9c0.7,1.6,1.6,3.1,2.6,4.5l4.5-2.1c1.4,1.9,3.1,3.5,5,4.9l-2.1,4.6c1.4,1,2.9,1.9,4.5,2.6l2.9-4.1 c2.1,0.9,4.4,1.5,6.7,1.8l0.4,5.1C48.2,80,49.1,80,50,80s1.8,0,2.6-0.1l0.4-5.1c2.3-0.3,4.6-0.9,6.7-1.8l2.9,4.2 c1.6-0.7,3.1-1.6,4.5-2.6L65,69.9c1.9-1.4,3.5-3,4.9-4.9l4.6,2.2c1-1.4,1.9-2.9,2.6-4.5L73,59.8c0.9-2.1,1.5-4.4,1.8-6.7L79.9,52.6 z M50,65c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15s15,6.7,15,15C65,58.3,58.3,65,50,65z","fill":"currentColor"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"90 50 50","to":"0 50 50","dur":"1s","repeatCount":"indefinite"}})],1)]),_c('g',{attrs:{"transform":"translate(20,20) rotate(15 50 50)"}},[_c('path',{attrs:{"d":"M79.9,52.6C80,51.8,80,50.9,80,50s0-1.8-0.1-2.6l-5.1-0.4c-0.3-2.4-0.9-4.6-1.8-6.7l4.2-2.9c-0.7-1.6-1.6-3.1-2.6-4.5 L70,35c-1.4-1.9-3.1-3.5-4.9-4.9l2.2-4.6c-1.4-1-2.9-1.9-4.5-2.6L59.8,27c-2.1-0.9-4.4-1.5-6.7-1.8l-0.4-5.1C51.8,20,50.9,20,50,20 s-1.8,0-2.6,0.1l-0.4,5.1c-2.4,0.3-4.6,0.9-6.7,1.8l-2.9-4.1c-1.6,0.7-3.1,1.6-4.5,2.6l2.1,4.6c-1.9,1.4-3.5,3.1-5,4.9l-4.5-2.1 c-1,1.4-1.9,2.9-2.6,4.5l4.1,2.9c-0.9,2.1-1.5,4.4-1.8,6.8l-5,0.4C20,48.2,20,49.1,20,50s0,1.8,0.1,2.6l5,0.4 c0.3,2.4,0.9,4.7,1.8,6.8l-4.1,2.9c0.7,1.6,1.6,3.1,2.6,4.5l4.5-2.1c1.4,1.9,3.1,3.5,5,4.9l-2.1,4.6c1.4,1,2.9,1.9,4.5,2.6l2.9-4.1 c2.1,0.9,4.4,1.5,6.7,1.8l0.4,5.1C48.2,80,49.1,80,50,80s1.8,0,2.6-0.1l0.4-5.1c2.3-0.3,4.6-0.9,6.7-1.8l2.9,4.2 c1.6-0.7,3.1-1.6,4.5-2.6L65,69.9c1.9-1.4,3.5-3,4.9-4.9l4.6,2.2c1-1.4,1.9-2.9,2.6-4.5L73,59.8c0.9-2.1,1.5-4.4,1.8-6.7L79.9,52.6 z M50,65c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15s15,6.7,15,15C65,58.3,58.3,65,50,65z","fill":"currentColor"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"90 50 50","dur":"1s","repeatCount":"indefinite"}})],1)])])},staticRenderFns: [],
  name: 'q-spinner-gears',
  mixins: [mixin]
};

var grid = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 105 105","xmlns":"http://www.w3.org/2000/svg"}},[_c('circle',{attrs:{"cx":"12.5","cy":"12.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"0s","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"12.5","cy":"52.5","r":"12.5","fill-opacity":".5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"100ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"52.5","cy":"12.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"300ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"52.5","cy":"52.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"600ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"92.5","cy":"12.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"800ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"92.5","cy":"52.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"400ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"12.5","cy":"92.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"700ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"52.5","cy":"92.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"500ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"92.5","cy":"92.5","r":"12.5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"200ms","dur":"1s","values":"1;.2;1","calcMode":"linear","repeatCount":"indefinite"}})])])},staticRenderFns: [],
  name: 'q-spinner-grid',
  mixins: [mixin]
};

var hearts = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"fill":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 140 64","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"d":"M30.262 57.02L7.195 40.723c-5.84-3.976-7.56-12.06-3.842-18.063 3.715-6 11.467-7.65 17.306-3.68l4.52 3.76 2.6-5.274c3.716-6.002 11.47-7.65 17.304-3.68 5.84 3.97 7.56 12.054 3.842 18.062L34.49 56.118c-.897 1.512-2.793 1.915-4.228.9z","fill-opacity":".5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"0s","dur":"1.4s","values":"0.5;1;0.5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('path',{attrs:{"d":"M105.512 56.12l-14.44-24.272c-3.716-6.008-1.996-14.093 3.843-18.062 5.835-3.97 13.588-2.322 17.306 3.68l2.6 5.274 4.52-3.76c5.84-3.97 13.593-2.32 17.308 3.68 3.718 6.003 1.998 14.088-3.842 18.064L109.74 57.02c-1.434 1.014-3.33.61-4.228-.9z","fill-opacity":".5"}},[_c('animate',{attrs:{"attributeName":"fill-opacity","begin":"0.7s","dur":"1.4s","values":"0.5;1;0.5","calcMode":"linear","repeatCount":"indefinite"}})]),_c('path',{attrs:{"d":"M67.408 57.834l-23.01-24.98c-5.864-6.15-5.864-16.108 0-22.248 5.86-6.14 15.37-6.14 21.234 0L70 16.168l4.368-5.562c5.863-6.14 15.375-6.14 21.235 0 5.863 6.14 5.863 16.098 0 22.247l-23.007 24.98c-1.43 1.556-3.757 1.556-5.188 0z"}})])},staticRenderFns: [],
  name: 'q-spinner-hearts',
  mixins: [mixin]
};

var hourglass = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',[_c('path',{staticClass:"glass",attrs:{"fill":"none","stroke":"currentColor","stroke-width":"5","stroke-miterlimit":"10","d":"M58.4,51.7c-0.9-0.9-1.4-2-1.4-2.3s0.5-0.4,1.4-1.4 C70.8,43.8,79.8,30.5,80,15.5H70H30H20c0.2,15,9.2,28.1,21.6,32.3c0.9,0.9,1.4,1.2,1.4,1.5s-0.5,1.6-1.4,2.5 C29.2,56.1,20.2,69.5,20,85.5h10h40h10C79.8,69.5,70.8,55.9,58.4,51.7z"}}),_c('clipPath',{attrs:{"id":"uil-hourglass-clip1"}},[_c('rect',{staticClass:"clip",attrs:{"x":"15","y":"20","width":"70","height":"25"}},[_c('animate',{attrs:{"attributeName":"height","from":"25","to":"0","dur":"1s","repeatCount":"indefinite","vlaues":"25;0;0","keyTimes":"0;0.5;1"}}),_c('animate',{attrs:{"attributeName":"y","from":"20","to":"45","dur":"1s","repeatCount":"indefinite","vlaues":"20;45;45","keyTimes":"0;0.5;1"}})])]),_c('clipPath',{attrs:{"id":"uil-hourglass-clip2"}},[_c('rect',{staticClass:"clip",attrs:{"x":"15","y":"55","width":"70","height":"25"}},[_c('animate',{attrs:{"attributeName":"height","from":"0","to":"25","dur":"1s","repeatCount":"indefinite","vlaues":"0;25;25","keyTimes":"0;0.5;1"}}),_c('animate',{attrs:{"attributeName":"y","from":"80","to":"55","dur":"1s","repeatCount":"indefinite","vlaues":"80;55;55","keyTimes":"0;0.5;1"}})])]),_c('path',{staticClass:"sand",attrs:{"d":"M29,23c3.1,11.4,11.3,19.5,21,19.5S67.9,34.4,71,23H29z","clip-path":"url(#uil-hourglass-clip1)","fill":"currentColor"}}),_c('path',{staticClass:"sand",attrs:{"d":"M71.6,78c-3-11.6-11.5-20-21.5-20s-18.5,8.4-21.5,20H71.6z","clip-path":"url(#uil-hourglass-clip2)","fill":"currentColor"}}),_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"180 50 50","repeatCount":"indefinite","dur":"1s","values":"0 50 50;0 50 50;180 50 50","keyTimes":"0;0.7;1"}})],1)])},staticRenderFns: [],
  name: 'q-spinner-hourglass',
  mixins: [mixin]
};

var infinity = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid"}},[_c('path',{attrs:{"d":"M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z","fill":"none","stroke":"currentColor","stroke-width":"8","stroke-dasharray":"10.691205342610678 10.691205342610678","stroke-dashoffset":"0"}},[_c('animate',{attrs:{"attributeName":"stroke-dashoffset","from":"0","to":"21.382410685221355","begin":"0","dur":"2s","repeatCount":"indefinite","fill":"freeze"}})])])},staticRenderFns: [],
  name: 'q-spinner-infinity',
  mixins: [mixin]
};

var oval = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"stroke":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 38 38","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"translate(1 1)","stroke-width":"2","fill":"none","fill-rule":"evenodd"}},[_c('circle',{attrs:{"stroke-opacity":".5","cx":"18","cy":"18","r":"18"}}),_c('path',{attrs:{"d":"M36 18c0-9.94-8.06-18-18-18"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"1s","repeatCount":"indefinite"}})],1)])])},staticRenderFns: [],
  name: 'q-spinner-oval',
  mixins: [mixin]
};

var pie = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"d":"M0 50A50 50 0 0 1 50 0L50 50L0 50","fill":"currentColor","opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"0.8s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M50 0A50 50 0 0 1 100 50L50 50L50 0","fill":"currentColor","opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"1.6s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M100 50A50 50 0 0 1 50 100L50 50L100 50","fill":"currentColor","opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"2.4s","repeatCount":"indefinite"}})],1),_c('path',{attrs:{"d":"M50 100A50 50 0 0 1 0 50L50 50L50 100","fill":"currentColor","opacity":"0.5"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 50 50","to":"360 50 50","dur":"3.2s","repeatCount":"indefinite"}})],1)])},staticRenderFns: [],
  name: 'q-spinner-pie',
  mixins: [mixin]
};

var puff = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"stroke":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 44 44","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"fill":"none","fill-rule":"evenodd","stroke-width":"2"}},[_c('circle',{attrs:{"cx":"22","cy":"22","r":"1"}},[_c('animate',{attrs:{"attributeName":"r","begin":"0s","dur":"1.8s","values":"1; 20","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.165, 0.84, 0.44, 1","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"0s","dur":"1.8s","values":"1; 0","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.3, 0.61, 0.355, 1","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"22","cy":"22","r":"1"}},[_c('animate',{attrs:{"attributeName":"r","begin":"-0.9s","dur":"1.8s","values":"1; 20","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.165, 0.84, 0.44, 1","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"-0.9s","dur":"1.8s","values":"1; 0","calcMode":"spline","keyTimes":"0; 1","keySplines":"0.3, 0.61, 0.355, 1","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  name: 'q-spinner-puff',
  mixins: [mixin]
};

var radio = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 100 100","preserveAspectRatio":"xMidYMid","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"transform":"scale(0.55)"}},[_c('circle',{attrs:{"cx":"30","cy":"150","r":"30","fill":"currentColor"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})]),_c('path',{attrs:{"d":"M90,150h30c0-49.7-40.3-90-90-90v30C63.1,90,90,116.9,90,150z","fill":"currentColor"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0.1","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})]),_c('path',{attrs:{"d":"M150,150h30C180,67.2,112.8,0,30,0v30C96.3,30,150,83.7,150,150z","fill":"currentColor"}},[_c('animate',{attrs:{"attributeName":"opacity","from":"0","to":"1","dur":"1s","begin":"0.2","repeatCount":"indefinite","keyTimes":"0;0.5;1","values":"0;1;1"}})])])])},staticRenderFns: [],
  name: 'q-spinner-radio',
  mixins: [mixin]
};

var rings = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"stroke":"currentColor","width":_vm.size,"height":_vm.size,"viewBox":"0 0 45 45","xmlns":"http://www.w3.org/2000/svg"}},[_c('g',{attrs:{"fill":"none","fill-rule":"evenodd","transform":"translate(1 1)","stroke-width":"2"}},[_c('circle',{attrs:{"cx":"22","cy":"22","r":"6"}},[_c('animate',{attrs:{"attributeName":"r","begin":"1.5s","dur":"3s","values":"6;22","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"1.5s","dur":"3s","values":"1;0","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-width","begin":"1.5s","dur":"3s","values":"2;0","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"22","cy":"22","r":"6"}},[_c('animate',{attrs:{"attributeName":"r","begin":"3s","dur":"3s","values":"6;22","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-opacity","begin":"3s","dur":"3s","values":"1;0","calcMode":"linear","repeatCount":"indefinite"}}),_c('animate',{attrs:{"attributeName":"stroke-width","begin":"3s","dur":"3s","values":"2;0","calcMode":"linear","repeatCount":"indefinite"}})]),_c('circle',{attrs:{"cx":"22","cy":"22","r":"8"}},[_c('animate',{attrs:{"attributeName":"r","begin":"0s","dur":"1.5s","values":"6;1;2;3;4;5;6","calcMode":"linear","repeatCount":"indefinite"}})])])])},staticRenderFns: [],
  name: 'q-spinner-rings',
  mixins: [mixin]
};

var tail = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('svg',{staticClass:"q-spinner",class:_vm.classes,attrs:{"width":_vm.size,"height":_vm.size,"viewBox":"0 0 38 38","xmlns":"http://www.w3.org/2000/svg"}},[_c('defs',[_c('linearGradient',{attrs:{"x1":"8.042%","y1":"0%","x2":"65.682%","y2":"23.865%","id":"a"}},[_c('stop',{attrs:{"stop-color":"currentColor","stop-opacity":"0","offset":"0%"}}),_c('stop',{attrs:{"stop-color":"currentColor","stop-opacity":".631","offset":"63.146%"}}),_c('stop',{attrs:{"stop-color":"currentColor","offset":"100%"}})],1)],1),_c('g',{attrs:{"transform":"translate(1 1)","fill":"none","fill-rule":"evenodd"}},[_c('path',{attrs:{"d":"M36 18c0-9.94-8.06-18-18-18","stroke":"url(#a)","stroke-width":"2"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"0.9s","repeatCount":"indefinite"}})],1),_c('circle',{attrs:{"fill":"currentColor","cx":"36","cy":"18","r":"1"}},[_c('animateTransform',{attrs:{"attributeName":"transform","type":"rotate","from":"0 18 18","to":"360 18 18","dur":"0.9s","repeatCount":"indefinite"}})],1)])])},staticRenderFns: [],
  name: 'q-spinner-tail',
  mixins: [mixin]
};

var QInput = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input-frame',{staticClass:"q-input",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"disable":_vm.disable,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.color,"focused":_vm.focused,"length":_vm.length,"top-addons":_vm.isTextarea},on:{"click":_vm.__onClick}},[_vm._t("before"),_vm._v(" "),(_vm.isTextarea)?[_c('div',{staticClass:"col row relative-position"},[_c('q-resize-observable',{on:{"resize":function($event){_vm.__updateArea();}}}),_vm._v(" "),_c('textarea',{ref:"shadow",staticClass:"col q-input-target q-input-shadow absolute-top",attrs:{"rows":_vm.minRows},domProps:{"value":_vm.value}}),_vm._v(" "),_c('textarea',{ref:"input",staticClass:"col q-input-target q-input-area",attrs:{"name":_vm.name,"placeholder":_vm.inputPlaceholder,"disabled":_vm.disable,"readonly":_vm.readonly,"maxlength":_vm.maxLength,"rows":_vm.minRows},domProps:{"value":_vm.value},on:{"input":_vm.__set,"focus":_vm.__onFocus,"blur":_vm.__onBlur,"keydown":_vm.__onKeydown,"keyup":_vm.__onKeyup}})],1)]:_c('input',{ref:"input",staticClass:"col q-input-target",class:[("text-" + (_vm.align))],attrs:{"name":_vm.name,"placeholder":_vm.inputPlaceholder,"pattern":_vm.pattern,"disabled":_vm.disable,"readonly":_vm.readonly,"maxlength":_vm.maxLength,"min":_vm.min,"max":_vm.max,"step":_vm.inputStep,"type":_vm.inputType},domProps:{"value":_vm.value},on:{"input":_vm.__set,"focus":_vm.__onFocus,"blur":_vm.__onBlur,"keydown":_vm.__onKeydown,"keyup":_vm.__onKeyup}}),_vm._v(" "),(_vm.isPassword && !_vm.noPassToggle && _vm.length)?_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":_vm.showPass ? 'visibility' : 'visibility_off'},on:{"click":_vm.togglePass},slot:"after"}):_vm._e(),_vm._v(" "),(_vm.clearable && _vm.length)?_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"cancel"},on:{"click":_vm.clear},slot:"after"}):_vm._e(),_vm._v(" "),(_vm.isLoading)?_c('q-spinner',{staticClass:"q-if-control",attrs:{"slot":"after","size":"24px"},slot:"after"}):_vm._e(),_vm._v(" "),_vm._t("after"),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-input',
  mixins: [FrameMixin, InputMixin],
  components: {
    QInputFrame: QInputFrame,
    QSpinner: QSpinner,
    QResizeObservable: QResizeObservable
  },
  props: {
    value: { required: true },
    type: {
      type: String,
      default: 'text',
      validator: function (t) { return inputTypes.includes(t); }
    },
    minRows: Number,
    clearable: Boolean,
    noPassToggle: Boolean,
    readonly: Boolean,

    min: Number,
    max: Number,
    step: {
      type: Number,
      default: 1
    },
    maxDecimals: Number
  },
  data: function data () {
    var this$1 = this;

    return {
      focused: false,
      showPass: false,
      shadow: {
        val: this.value,
        set: this.__set,
        loading: false,
        hasFocus: function () {
          return document.activeElement === this$1.$refs.input
        },
        register: function () {
          this$1.watcher = this$1.$watch('value', function (val) {
            this$1.shadow.val = val;
          });
        },
        unregister: function () {
          this$1.watcher();
        },
        getEl: function () {
          return this$1.$refs.input
        }
      }
    }
  },
  provide: function provide () {
    return {
      __input: this.shadow
    }
  },
  computed: {
    isNumber: function isNumber () {
      return this.type === 'number'
    },
    isPassword: function isPassword () {
      return this.type === 'password'
    },
    isTextarea: function isTextarea () {
      return this.type === 'textarea'
    },
    isLoading: function isLoading () {
      return this.loading || this.shadow.loading
    },
    pattern: function pattern () {
      if (this.isNumber) {
        return '[0-9]*'
      }
    },
    inputStep: function inputStep () {
      if (this.isNumber) {
        return this.step
      }
    },
    inputType: function inputType () {
      return this.isPassword
        ? (this.showPass ? 'text' : 'password')
        : this.type
    },
    length: function length () {
      return this.value || (this.isNumber && this.value !== null)
        ? ('' + this.value).length
        : 0
    },
    editable: function editable () {
      return !this.disable && !this.readonly
    }
  },
  methods: {
    togglePass: function togglePass () {
      this.showPass = !this.showPass;
    },
    clear: function clear () {
      if (this.editable) {
        this.$emit('input', '');
        this.$emit('change', '');
      }
    },

    __set: function __set (e) {
      var val = e.target ? e.target.value : e;
      if (val !== this.value) {
        if (this.isNumber) {
          if (val === '') {
            val = null;
          }
          else {
            val = Number.isInteger(this.maxDecimals)
              ? parseFloat(val).toFixed(this.maxDecimals)
              : parseFloat(val);
          }
        }
        this.$emit('input', val);
        this.$emit('change', val);
      }
    },
    __updateArea: function __updateArea () {
      var shadow = this.$refs.shadow;
      if (shadow) {
        var h = shadow.scrollHeight;
        var max = this.maxHeight || h;
        this.$refs.input.style.minHeight = (between(h, 19, max)) + "px";
      }
    }
  },
  mounted: function mounted () {
    this.__updateArea = frameDebounce(this.__updateArea);
    if (this.isTextarea) {
      this.__updateArea();
      this.watcher = this.$watch('value', this.__updateArea);
    }
  },
  beforeDestroy: function beforeDestroy () {
    if (this.watcher !== void 0) {
      this.watcher();
    }
  }
};

var toString = Object.prototype.toString;
var hasOwn = Object.prototype.hasOwnProperty;
var class2type = {};

'Boolean Number String Function Array Date RegExp Object'.split(' ').forEach(function (name) {
  class2type['[object ' + name + ']'] = name.toLowerCase();
});

function type (obj) {
  return obj === null ? String(obj) : class2type[toString.call(obj)] || 'object'
}

function isPlainObject (obj) {
  if (!obj || type(obj) !== 'object') {
    return false
  }

  if (obj.constructor &&
    !hasOwn.call(obj, 'constructor') &&
    !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
    return false
  }

  var key;
  for (key in obj) {}

  return key === undefined || hasOwn.call(obj, key)
}

function extend () {
  var arguments$1 = arguments;

  var
    options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }

  if (Object(target) !== target && type(target) !== 'function') {
    target = {};
  }

  if (length === i) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    if ((options = arguments$1[i]) !== null) {
      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target === copy) {
          continue
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = type(copy) === 'array'))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && type(src) === 'array' ? src : [];
          }
          else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        }
        else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target
}

function getAnchorPosition (el, offset) {
  var ref = el.getBoundingClientRect();
  var top = ref.top;
  var left = ref.left;
  var right = ref.right;
  var bottom = ref.bottom;
  var a = {
      top: top,
      left: left,
      width: el.offsetWidth,
      height: el.offsetHeight
    };

  if (offset) {
    a.top -= offset[1];
    a.left -= offset[0];
    if (bottom) {
      bottom += offset[1];
    }
    if (right) {
      right += offset[0];
    }
    a.width += offset[0];
    a.height += offset[1];
  }

  a.right = right || a.left + a.width;
  a.bottom = bottom || a.top + a.height;
  a.middle = a.left + ((a.right - a.left) / 2);
  a.center = a.top + ((a.bottom - a.top) / 2);

  return a
}

function getTargetPosition (el) {
  return {
    top: 0,
    center: el.offsetHeight / 2,
    bottom: el.offsetHeight,
    left: 0,
    middle: el.offsetWidth / 2,
    right: el.offsetWidth
  }
}

function getOverlapMode (anchor, target, median) {
  if ([anchor, target].indexOf(median) >= 0) { return 'auto' }
  if (anchor === target) { return 'inclusive' }
  return 'exclusive'
}

function getPositions (anchor, target) {
  var
    a = extend({}, anchor),
    t = extend({}, target);

  var positions = {
    x: ['left', 'right'].filter(function (p) { return p !== t.horizontal; }),
    y: ['top', 'bottom'].filter(function (p) { return p !== t.vertical; })
  };

  var overlap = {
    x: getOverlapMode(a.horizontal, t.horizontal, 'middle'),
    y: getOverlapMode(a.vertical, t.vertical, 'center')
  };

  positions.x.splice(overlap.x === 'auto' ? 0 : 1, 0, 'middle');
  positions.y.splice(overlap.y === 'auto' ? 0 : 1, 0, 'center');

  if (overlap.y !== 'auto') {
    a.vertical = a.vertical === 'top' ? 'bottom' : 'top';
    if (overlap.y === 'inclusive') {
      t.vertical = t.vertical;
    }
  }

  if (overlap.x !== 'auto') {
    a.horizontal = a.horizontal === 'left' ? 'right' : 'left';
    if (overlap.y === 'inclusive') {
      t.horizontal = t.horizontal;
    }
  }

  return {
    positions: positions,
    anchorPos: a
  }
}

function applyAutoPositionIfNeeded (anchor, target, selfOrigin, anchorOrigin, targetPosition) {
  var ref = getPositions(anchorOrigin, selfOrigin);
  var positions = ref.positions;
  var anchorPos = ref.anchorPos;

  if (targetPosition.top < 0 || targetPosition.top + target.bottom > window.innerHeight) {
    var newTop = anchor[anchorPos.vertical] - target[positions.y[0]];
    if (newTop + target.bottom <= window.innerHeight) {
      targetPosition.top = newTop;
    }
    else {
      newTop = anchor[anchorPos.vertical] - target[positions.y[1]];
      if (newTop + target.bottom <= window.innerHeight) {
        targetPosition.top = newTop;
      }
    }
  }
  if (targetPosition.left < 0 || targetPosition.left + target.right > window.innerWidth) {
    var newLeft = anchor[anchorPos.horizontal] - target[positions.x[0]];
    if (newLeft + target.right <= window.innerWidth) {
      targetPosition.left = newLeft;
    }
    else {
      newLeft = anchor[anchorPos.horizontal] - target[positions.x[1]];
      if (newLeft + target.right <= window.innerWidth) {
        targetPosition.left = newLeft;
      }
    }
  }
  return targetPosition
}

function parseHorizTransformOrigin (pos) {
  return pos === 'middle' ? 'center' : pos
}

function getTransformProperties (ref) {
  var selfOrigin = ref.selfOrigin;

  var
    vert = selfOrigin.vertical,
    horiz = parseHorizTransformOrigin(selfOrigin.horizontal);

  return {
    'transform-origin': vert + ' ' + horiz + ' 0px'
  }
}

function setPosition (ref) {
  var el = ref.el;
  var anchorEl = ref.anchorEl;
  var anchorOrigin = ref.anchorOrigin;
  var selfOrigin = ref.selfOrigin;
  var maxHeight = ref.maxHeight;
  var event = ref.event;
  var anchorClick = ref.anchorClick;
  var touchPosition = ref.touchPosition;
  var offset = ref.offset;

  var anchor;
  el.style.maxHeight = maxHeight || '65vh';

  if (event && (!anchorClick || touchPosition)) {
    var ref$1 = position(event);
    var top = ref$1.top;
    var left = ref$1.left;
    anchor = {top: top, left: left, width: 1, height: 1, right: left + 1, center: top, middle: left, bottom: top + 1};
  }
  else {
    anchor = getAnchorPosition(anchorEl, offset);
  }

  var target = getTargetPosition(el);
  var targetPosition = {
    top: anchor[anchorOrigin.vertical] - target[selfOrigin.vertical],
    left: anchor[anchorOrigin.horizontal] - target[selfOrigin.horizontal]
  };

  targetPosition = applyAutoPositionIfNeeded(anchor, target, selfOrigin, anchorOrigin, targetPosition);

  el.style.top = Math.max(0, targetPosition.top) + 'px';
  el.style.left = Math.max(0, targetPosition.left) + 'px';
}

function positionValidator (pos) {
  var parts = pos.split(' ');
  if (parts.length !== 2) {
    return false
  }
  if (!['top', 'center', 'bottom'].includes(parts[0])) {
    console.error('Anchor/Self position must start with one of top/center/bottom');
    return false
  }
  if (!['left', 'middle', 'right'].includes(parts[1])) {
    console.error('Anchor/Self position must end with one of left/middle/right');
    return false
  }
  return true
}

function offsetValidator (val) {
  if (!val) { return true }
  if (val.length !== 2) { return false }
  if (typeof val[0] !== 'number' || typeof val[1] !== 'number') {
    return false
  }
  return true
}

function parsePosition (pos) {
  var parts = pos.split(' ');
  return {vertical: parts[0], horizontal: parts[1]}
}

var handlers = [];

if (Platform.is.desktop) {
  window.addEventListener('keyup', function (evt) {
    if (handlers.length === 0) {
      return
    }

    if (evt.which === 27 || evt.keyCode === 27) {
      handlers[handlers.length - 1]();
    }
  });
}

var EscapeKey = {
  register: function register (handler) {
    if (Platform.is.desktop) {
      handlers.push(handler);
    }
  },
  pop: function pop () {
    if (Platform.is.desktop) {
      handlers.pop();
    }
  }
};

var ModelToggleMixin = {
  props: {
    value: Boolean
  },
  watch: {
    value: function value (v) {
      if (v) {
        this.open();
      }
      else {
        this.close();
      }
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      setTimeout(function () {
        if (this$1.value) {
          this$1.open();
        }
      }, 100);
    });
  },
  methods: {
    __updateModel: function __updateModel (val) {
      if (this.value !== val) {
        this.$emit('input', val);
      }
    }
  }
};

var QPopover = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-popover animate-scale",style:(_vm.transformCSS),on:{"click":function($event){$event.stopPropagation();}}},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-popover',
  mixins: [ModelToggleMixin],
  props: {
    anchor: {
      type: String,
      default: 'bottom left',
      validator: positionValidator
    },
    self: {
      type: String,
      default: 'top left',
      validator: positionValidator
    },
    fit: Boolean,
    maxHeight: String,
    touchPosition: Boolean,
    anchorClick: {
      /*
        for handling anchor outside of Popover
        example: context menu component
      */
      type: Boolean,
      default: true
    },
    offset: {
      type: Array,
      validator: offsetValidator
    },
    disable: Boolean
  },
  data: function data () {
    return {
      opened: false,
      progress: false
    }
  },
  computed: {
    transformCSS: function transformCSS () {
      return getTransformProperties({selfOrigin: this.selfOrigin})
    },
    anchorOrigin: function anchorOrigin () {
      return parsePosition(this.anchor)
    },
    selfOrigin: function selfOrigin () {
      return parsePosition(this.self)
    }
  },
  created: function created () {
    var this$1 = this;

    this.__updatePosition = frameDebounce(function () { this$1.reposition(); });
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.anchorEl = this$1.$el.parentNode;
      this$1.anchorEl.removeChild(this$1.$el);
      if (this$1.anchorEl.classList.contains('q-btn-inner')) {
        this$1.anchorEl = this$1.anchorEl.parentNode;
      }
      if (this$1.anchorClick) {
        this$1.anchorEl.classList.add('cursor-pointer');
        this$1.anchorEl.addEventListener('click', this$1.toggle);
      }
    });
  },
  beforeDestroy: function beforeDestroy () {
    if (this.anchorClick && this.anchorEl) {
      this.anchorEl.removeEventListener('click', this.toggle);
    }
    this.close();
  },
  methods: {
    toggle: function toggle (event) {
      if (this.opened) {
        this.close();
      }
      else {
        this.open(event);
      }
    },
    open: function open (evt) {
      var this$1 = this;

      if (this.disable) {
        return
      }
      if (this.opened) {
        this.__updatePosition();
        return
      }
      if (evt) {
        evt.stopPropagation();
        evt.preventDefault();
      }

      this.opened = true;
      document.body.click(); // close other Popovers
      document.body.appendChild(this.$el);
      EscapeKey.register(function () { this$1.close(); });
      this.scrollTarget = getScrollTarget(this.anchorEl);
      this.scrollTarget.addEventListener('scroll', this.__updatePosition);
      window.addEventListener('resize', this.__updatePosition);
      this.reposition(evt);
      this.timer = setTimeout(function () {
        this$1.timer = null;
        document.body.addEventListener('click', this$1.close, true);
        document.body.addEventListener('touchstart', this$1.close, true);
        this$1.__updateModel(true);
        this$1.$emit('open');
      }, 1);
    },
    close: function close (fn) {
      var this$1 = this;

      if (!this.opened || this.progress || (fn && fn.target && this.$el.contains(fn.target))) {
        return
      }

      clearTimeout(this.timer);
      document.body.removeEventListener('click', this.close, true);
      document.body.removeEventListener('touchstart', this.close, true);
      this.scrollTarget.removeEventListener('scroll', this.__updatePosition);
      window.removeEventListener('resize', this.__updatePosition);
      EscapeKey.pop();
      this.progress = true;

      /*
        Using setTimeout to allow
        v-models to take effect
      */
      setTimeout(function () {
        this$1.opened = false;
        this$1.progress = false;
        document.body.removeChild(this$1.$el);
        this$1.__updateModel(false);
        this$1.$emit('close');
        if (typeof fn === 'function') {
          fn();
        }
      }, 1);
    },
    reposition: function reposition (event) {
      var this$1 = this;

      this.$nextTick(function () {
        if (this$1.fit) {
          this$1.$el.style.minWidth = width(this$1.anchorEl) + 'px';
        }
        var ref = this$1.anchorEl.getBoundingClientRect();
        var top = ref.top;
        var ref$1 = viewport();
        var height$$1 = ref$1.height;
        if (top < 0 || top > height$$1) {
          return this$1.close()
        }
        setPosition({
          event: event,
          el: this$1.$el,
          offset: this$1.offset,
          anchorEl: this$1.anchorEl,
          anchorOrigin: this$1.anchorOrigin,
          selfOrigin: this$1.selfOrigin,
          maxHeight: this$1.maxHeight,
          anchorClick: this$1.anchorClick,
          touchPosition: this$1.touchPosition
        });
      });
    }
  }
};

function textStyle (n) {
  return n === void 0 || n < 2
    ? {}
    : {overflow: 'hidden', display: '-webkit-box', '-webkit-box-orient': 'vertical', '-webkit-line-clamp': n}
}

var list = ['icon', 'label', 'sublabel', 'image', 'avatar', 'letter', 'stamp'];

function getType (prop) {
  var len = list.length;
  for (var i = 0; i < len; i++) {
    if (prop[list[i]]) {
      return list[i]
    }
  }
  return ''
}

function itemClasses (prop) {
  return {
    'q-item': true,
    'q-item-division': true,
    'relative-position': true,
    'q-item-dark': prop.dark,
    'q-item-dense': prop.dense,
    'q-item-sparse': prop.sparse,
    'q-item-separator': prop.separator,
    'q-item-inset-separator': prop.insetSeparator,
    'q-item-multiline': prop.multiline,
    'q-item-highlight': prop.highlight,
    'q-item-link': prop.to || prop.link
  }
}

var ItemMixin = {
  props: {
    dark: Boolean,
    dense: Boolean,
    sparse: Boolean,
    separator: Boolean,
    insetSeparator: Boolean,
    multiline: Boolean,
    highlight: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  }
};

var routerLinkEventName = 'qrouterlinkclick';

var evt;

try {
  evt = new Event(routerLinkEventName);
}
catch (e) {
  // IE doesn't support `new Event()`, so...`
  evt = document.createEvent('Event');
  evt.initEvent(routerLinkEventName, true, false);
}

var RouterLinkMixin = {
  props: {
    to: [String, Object],
    exact: Boolean,
    append: Boolean,
    replace: Boolean
  },
  data: function data () {
    return {
      routerLinkEventName: routerLinkEventName
    }
  }
};

var QItem = {
  name: 'q-item',
  functional: true,
  mixins: [ItemMixin, {props: RouterLinkMixin.props}],
  props: {
    active: Boolean,
    link: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props,
      cls = itemClasses(prop);

    if (prop.to !== void 0 || prop.link) {
      data.props = prop;
    }
    else {
      cls.active = prop.active;
    }

    data.class = data.class ? [data.class, cls] : cls;

    return h(prop.to ? 'router-link' : prop.tag, data, ctx.children)
  }
};

var QItemSeparator = {
  name: 'q-item-separator',
  functional: true,
  props: {
    inset: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass;

    data.staticClass = "q-item-separator-component" + (ctx.props.inset ? ' q-item-separator-inset-component' : '') + (cls ? (" " + cls) : '');

    return h('div', data, ctx.children)
  }
};

function text (h, name, val, n) {
  n = parseInt(n, 10);
  return h('div', {
    staticClass: ("q-item-" + name + (n === 1 ? ' ellipsis' : '')),
    style: textStyle(n),
    domProps: { innerHTML: val }
  })
}

var QItemMain = {
  name: 'q-item-main',
  functional: true,
  props: {
    label: String,
    labelLines: [String, Number],
    sublabel: String,
    sublabelLines: [String, Number],
    inset: Boolean,
    tag: {
      type: String,
      default: 'div'
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      classes = data.staticClass,
      prop = ctx.props,
      child = [];

    if (prop.label) {
      child.push(text(h, 'label', prop.label, prop.labelLines));
    }
    if (prop.sublabel) {
      child.push(text(h, 'sublabel', prop.sublabel, prop.sublabelLines));
    }

    child.push(ctx.children);
    data.staticClass = "q-item-main q-item-section" + (prop.inset ? ' q-item-main-inset' : '') + (classes ? (" " + classes) : '');

    return h(prop.tag, data, child)
  }
};

var QItemSide = {
  name: 'q-item-side',
  functional: true,
  props: {
    right: Boolean,

    icon: String,
    inverted: Boolean,

    avatar: String,
    letter: {
      type: String,
      validator: function (v) { return v.length === 1; }
    },
    image: String,
    stamp: String,

    color: String,
    tag: {
      type: String,
      default: 'div'
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props,
      cls = data.staticClass;

    data.staticClass = "q-item-side q-item-side-" + (prop.right ? 'right' : 'left') + " q-item-section" + (prop.color ? (" text-" + (prop.color)) : '') + (cls ? (" " + cls) : '');

    if (prop.image) {
      if (!data.hasOwnProperty('attrs')) {
        data.attrs = {};
      }
      data.attrs.src = prop.image;
      data.staticClass += ' q-item-image';
      return h('img', data)
    }

    var child = [];

    if (prop.stamp) {
      child.push(h('div', {
        staticClass: 'q-item-stamp',
        domProps: {
          innerHTML: prop.stamp
        }
      }));
    }
    if (prop.icon) {
      child.push(h(QIcon, {
        props: { name: prop.icon },
        staticClass: 'q-item-icon',
        class: { 'q-item-icon-inverted': prop.inverted }
      }));
    }
    if (prop.avatar) {
      child.push(h('img', {
        attrs: { src: prop.avatar },
        staticClass: 'q-item-avatar'
      }));
    }
    if (prop.letter) {
      child.push(h(
        'div',
        { staticClass: 'q-item-letter' },
        prop.letter
      ));
    }

    child.push(ctx.children);
    return h(prop.tag, data, child)
  }
};

var QItemTile = {
  name: 'q-item-tile',
  functional: true,
  props: {
    icon: String,
    inverted: Boolean,

    image: Boolean,
    avatar: Boolean,
    letter: Boolean,
    stamp: Boolean,

    label: Boolean,
    sublabel: Boolean,
    lines: [Number, String],

    color: String,
    tag: {
      type: String,
      default: 'div'
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props,
      cls = data.staticClass,
      type = getType(prop),
      icon = prop.icon || prop.invertedIcon;

    data.staticClass = "q-item-" + type + (prop.color ? (" text-" + (prop.color)) : '') + (cls ? (" " + cls) : '');

    if (icon) {
      data.props = { name: icon };
      if (prop.inverted) {
        data.staticClass += ' q-item-icon-inverted';
      }
      return h(QIcon, data, ctx.children)
    }
    if ((prop.label || prop.sublabel) && prop.lines) {
      if (prop.lines === '1' || prop.lines === 1) {
        data.staticClass += ' ellipsis';
      }
      data.style = [data.style, textStyle(prop.lines)];
    }

    return h(prop.tag, data, ctx.children)
  }
};

function push (child, h, name, slot, replace, conf) {
  var defaultProps = { props: { right: conf.right } };

  if (slot && replace) {
    child.push(h(name, defaultProps, slot));
    return
  }
  var props, v = false;
  if (!slot) {
    for (var p in conf) {
      if (conf.hasOwnProperty(p)) {
        v = conf[p];
        if (v !== void 0 && v !== true) {
          props = true;
          break
        }
      }
    }
  }
  if (props || slot) {
    child.push(h(name, props ? {props: conf} : defaultProps, slot));
  }
}

var QItemWrapper = {
  name: 'q-item-wrapper',
  functional: true,
  props: {
    cfg: {
      type: Object,
      default: function () { return ({}); }
    },
    slotReplace: Boolean
  },
  render: function render (h, ctx) {
    var
      cfg = ctx.props.cfg,
      replace = ctx.props.slotReplace,
      slot = ctx.slots(),
      child = [];

    push(child, h, QItemSide, slot.left, replace, {
      icon: cfg.icon,
      color: cfg.leftColor,
      avatar: cfg.avatar,
      letter: cfg.letter,
      image: cfg.image
    });

    push(child, h, QItemMain, slot.main, replace, {
      label: cfg.label,
      sublabel: cfg.sublabel,
      labelLines: cfg.labelLines,
      sublabelLines: cfg.sublabelLines,
      inset: cfg.inset
    });

    push(child, h, QItemSide, slot.right, replace, {
      right: true,
      icon: cfg.rightIcon,
      color: cfg.rightColor,
      avatar: cfg.rightAvatar,
      letter: cfg.rightLetter,
      image: cfg.rightImage,
      stamp: cfg.stamp
    });

    if (slot.default) {
      child.push(slot.default);
    }

    ctx.data.props = cfg;
    return h(QItem, ctx.data, child)
  }
};

var QList = {
  name: 'q-list',
  functional: true,
  props: {
    noBorder: Boolean,
    dark: Boolean,
    dense: Boolean,
    sparse: Boolean,
    striped: Boolean,
    stripedOdd: Boolean,
    separator: Boolean,
    insetSeparator: Boolean,
    multiline: Boolean,
    highlight: Boolean,
    link: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props;

    data.class = {
      'q-list': true,
      'no-border': prop.noBorder,
      'q-list-dark': prop.dark,
      'q-list-dense': prop.dense,
      'q-list-sparse': prop.sparse,
      'q-list-striped': prop.striped,
      'q-list-striped-odd': prop.stripedOdd,
      'q-list-separator': prop.separator,
      'q-list-inset-separator': prop.insetSeparator,
      'q-list-multiline': prop.multiline,
      'q-list-highlight': prop.highlight,
      'q-list-link': prop.link
    };

    return h(
      'div',
      data,
      ctx.children
    )
  }
};

var QListHeader = {
  name: 'q-list-header',
  functional: true,
  props: {
    inset: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass,
      prop = ctx.props;

    data.staticClass = "q-list-header " + (prop.inset ? ' q-list-header-inset' : '') + (cls ? (" " + cls) : '');

    return h('div', data, ctx.children)
  }
};

function prevent (e) {
  e.preventDefault();
  e.stopPropagation();
}

var QAutocomplete = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-popover',{ref:"popover",attrs:{"fit":"","offset":[0, 10],"anchor-click":false},on:{"close":function($event){_vm.$emit('close');},"open":function($event){_vm.$emit('open');}}},[_c('div',{staticClass:"list no-border",class:{separator: _vm.separator},style:(_vm.computedWidth)},_vm._l((_vm.computedResults),function(result,index){return _c('q-item-wrapper',{key:result.id || JSON.stringify(result),class:{active: _vm.selectedIndex === index},attrs:{"cfg":result,"link":""},on:{"click":function($event){_vm.setValue(result);}}})}))])},staticRenderFns: [],
  name: 'q-autocomplete',
  components: {
    QInput: QInput,
    QPopover: QPopover,
    QItemWrapper: QItemWrapper
  },
  props: {
    minCharacters: {
      type: Number,
      default: 1
    },
    maxResults: {
      type: Number,
      default: 6
    },
    debounce: {
      type: Number,
      default: 500
    },
    filter: {
      type: Function,
      default: filter
    },
    staticData: Object,
    separator: Boolean
  },
  inject: ['__input', '__inputParent'],
  data: function data () {
    return {
      searchId: '',
      results: [],
      selectedIndex: -1,
      width: 0,
      enterKey: false,
      timer: null
    }
  },
  watch: {
    '__input.val': function _input_val () {
      if (this.enterKey) {
        this.enterKey = false;
      }
      else {
        this.__delayTrigger();
      }
    }
  },
  computed: {
    computedResults: function computedResults () {
      if (this.maxResults && this.results.length > 0) {
        return this.results.slice(0, this.maxResults)
      }
    },
    computedWidth: function computedWidth () {
      return {minWidth: this.width}
    },
    searching: function searching () {
      return this.searchId.length > 0
    }
  },
  methods: {
    trigger: function trigger () {
      var this$1 = this;

      if (!this.__input.hasFocus()) {
        return
      }
      var terms = this.__input.val;
      this.width = width(this.inputEl) + 'px';
      var searchId = uid();
      this.searchId = searchId;

      if (terms.length < this.minCharacters) {
        this.searchId = '';
        this.__clearSearch();
        this.close();
        return
      }

      if (this.staticData) {
        this.searchId = '';
        this.results = this.filter(terms, this.staticData);
        if (this.$q.platform.is.desktop) {
          this.selectedIndex = 0;
        }
        this.$refs.popover.open();
        return
      }

      this.close();
      this.__input.loading = true;
      this.$emit('search', terms, function (results) {
        if (!results || this$1.searchId !== searchId) {
          return
        }

        this$1.__clearSearch();

        if (this$1.results === results) {
          return
        }

        if (Array.isArray(results) && results.length > 0) {
          this$1.results = results;
          if (this$1.$refs && this$1.$refs.popover) {
            if (this$1.$q.platform.is.desktop) {
              this$1.selectedIndex = 0;
            }
            this$1.$refs.popover.open();
          }
          return
        }

        this$1.close();
      });
    },
    close: function close () {
      this.$refs.popover.close();
      this.results = [];
      this.selectedIndex = -1;
    },
    __clearSearch: function __clearSearch () {
      clearTimeout(this.timer);
      this.__input.loading = false;
      this.searchId = '';
    },
    setValue: function setValue (result) {
      var suffix = this.__inputParent ? 'Parent' : '';
      this[("__input" + suffix)].set(this.staticData ? result[this.staticData.field] : result.value);

      this.$emit('selected', result);
      this.__clearSearch();
      this.close();
    },
    move: function move (offset$$1) {
      this.selectedIndex = normalizeToInterval(
        this.selectedIndex + offset$$1,
        0,
        this.computedResults.length - 1
      );
    },
    setCurrentSelection: function setCurrentSelection () {
      this.enterKey = true;
      if (this.selectedIndex >= 0) {
        this.setValue(this.results[this.selectedIndex]);
      }
    },
    __delayTrigger: function __delayTrigger () {
      this.__clearSearch();
      if (!this.__input.hasFocus()) {
        return
      }
      if (this.staticData) {
        this.trigger();
        return
      }
      this.timer = setTimeout(this.trigger, this.debounce);
    },
    __handleKeypress: function __handleKeypress (e) {
      switch (e.keyCode || e.which) {
        case 38: // up
          this.__moveCursor(-1, e);
          break
        case 40: // down
          this.__moveCursor(1, e);
          break
        case 13: // enter
          this.setCurrentSelection();
          prevent(e);
          break
        case 27: // escape
          this.__clearSearch();
          break
      }
    },
    __moveCursor: function __moveCursor (offset$$1, e) {
      prevent(e);

      if (!this.$refs.popover.opened) {
        this.trigger();
      }
      else {
        this.move(offset$$1);
      }
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    if (this.__input === void 0) {
      console.error('Autocomplete needs to be inserted into an input form component.');
      return
    }
    this.__input.register();
    if (this.__inputParent) {
      this.__inputParent.setChildDebounce(true);
    }
    this.$nextTick(function () {
      this$1.inputEl = this$1.__input.getEl();
      this$1.inputEl.addEventListener('keyup', this$1.__handleKeypress);
    });
  },
  beforeDestroy: function beforeDestroy () {
    this.__clearSearch();
    this.__input.unregister();
    if (this.__inputParent) {
      this.__inputParent.setChildDebounce(false);
    }
    if (this.inputEl) {
      this.inputEl.removeEventListener('keydown', this.__handleKeypress);
      this.close();
    }
  }
};

var QBtn = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('button',{directives:[{name:"ripple",rawName:"v-ripple.mat",value:(!_vm.isDisabled),expression:"!isDisabled",modifiers:{"mat":true}}],staticClass:"q-btn row inline flex-center q-focusable q-hoverable relative-position",class:_vm.classes,on:{"click":_vm.click}},[_c('div',{staticClass:"desktop-only q-focus-helper"}),_vm._v(" "),(_vm.loading && _vm.hasPercentage)?_c('div',{staticClass:"q-btn-progress absolute-full",class:{'q-btn-dark-progress': _vm.darkPercentage},style:({width: _vm.width})}):_vm._e(),_vm._v(" "),_c('span',{staticClass:"q-btn-inner row col flex-center"},[(_vm.loading)?_vm._t("loading",[_c('q-spinner')]):[(_vm.icon)?_c('q-icon',{class:{'on-left': !_vm.round},attrs:{"name":_vm.icon}}):_vm._e(),_vm._v(" "),_vm._t("default"),_vm._v(" "),(!_vm.round && _vm.iconRight)?_c('q-icon',{staticClass:"on-right",attrs:{"name":_vm.iconRight}}):_vm._e()]],2)])},staticRenderFns: [],
  name: 'q-btn',
  components: {
    QSpinner: QSpinner,
    QIcon: QIcon
  },
  directives: {
    Ripple: Ripple
  },
  props: {
    value: Boolean,
    disable: Boolean,
    noCaps: {
      type: Boolean,
      default: false
    },
    icon: String,
    iconRight: String,
    round: Boolean,
    outline: Boolean,
    flat: Boolean,
    rounded: Boolean,
    push: Boolean,
    small: Boolean,
    big: Boolean,
    color: String,
    glossy: Boolean,

    loader: Boolean,
    percentage: Number,
    darkPercentage: Boolean
  },
  data: function data () {
    return {
      loading: this.value || false
    }
  },
  watch: {
    value: function value (val) {
      if (this.loading !== val) {
        this.loading = val;
      }
    }
  },
  computed: {
    size: function size () {
      return ("q-btn-" + (this.small ? 'small' : (this.big ? 'big' : 'standard')))
    },
    shape: function shape () {
      return ("q-btn-" + (this.round ? 'round' : 'rectangle'))
    },
    hasPercentage: function hasPercentage () {
      return this.percentage !== void 0
    },
    width: function width () {
      return ((between(this.percentage, 0, 100)) + "%")
    },
    isDisabled: function isDisabled () {
      return this.disable || this.loading
    },
    classes: function classes () {
      var cls = [this.shape, this.size];

      if (this.flat) {
        cls.push('q-btn-flat');
      }
      else if (this.outline) {
        cls.push('q-btn-outline');
      }
      else if (this.push) {
        cls.push('q-btn-push');
      }

      this.isDisabled && cls.push('disabled');
      this.noCaps && cls.push('q-btn-no-uppercase');
      this.rounded && cls.push('q-btn-rounded');
      this.glossy && cls.push('glossy');

      if (this.color) {
        if (this.flat || this.outline) {
          cls.push(("text-" + (this.color)));
        }
        else {
          cls.push(("bg-" + (this.color)));
          cls.push("text-white");
        }
      }

      return cls
    }
  },
  methods: {
    click: function click (e) {
      var this$1 = this;

      this.$el.blur();

      if (this.isDisabled) {
        return
      }
      if (this.loader !== false || this.$slots.loading) {
        this.loading = true;
        this.$emit('input', true);
      }
      this.$emit('click', e, function () {
        this$1.loading = false;
        this$1.$emit('input', false);
      });
    }
  }
};

var QCard = {
  name: 'q-card',
  functional: true,
  props: {
    square: Boolean,
    flat: Boolean,
    inline: Boolean,
    color: String
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      classes = data.staticClass,
      prop = ctx.props;

    var cls = ['q-card'];
    if (prop.square) {
      cls.push('no-border-radius');
    }
    if (prop.flat) {
      cls.push('no-shadow');
    }
    if (prop.inline) {
      cls.push('inline-block');
    }
    if (prop.color) {
      cls.push(("bg-" + (prop.color) + " text-white q-card-dark"));
    }

    data.staticClass = "" + (cls.join(' ')) + (classes ? (" " + classes) : '');

    return h(
      'div',
      data,
      ctx.children
    )
  }
};

var QCardTitle = {
  name: 'q-card-title',
  functional: true,
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = ctx.data.staticClass,
      slots = ctx.slots();

    data.staticClass = "q-card-primary q-card-container row no-wrap" + (cls ? (" " + cls) : '');
    return h(
      'div',
      data,
      [
        h('div', {staticClass: 'col column'}, [
          h('div', {staticClass: 'q-card-title'}, slots.default),
          h('div', {staticClass: 'q-card-subtitle'}, slots.subtitle)
        ]),
        h('div', {staticClass: 'col-auto self-center q-card-title-extra'}, slots.right)
      ]
    )
  }
};

var QCardMain = {
  name: 'q-card-main',
  functional: true,
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass;

    data.staticClass = "q-card-main q-card-container" + (cls ? (" " + cls) : '');

    return h('div', data, ctx.children)
  }
};

var QCardActions = {
  name: 'q-card-actions',
  functional: true,
  props: {
    vertical: Boolean,
    align: {
      type: String,
      default: 'start',
      validator: function (v) { return ['start', 'center', 'end', 'around'].includes(v); }
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      classes = data.staticClass,
      prop = ctx.props;

    data.staticClass = "q-card-actions " +
      "q-card-actions-" + (prop.vertical ? 'vert column justify-start' : 'horiz row') + " " +
      (prop.vertical ? 'items' : 'justify') + "-" + (prop.align) +
      "" + (classes ? (" " + classes) : '');

    return h('div', data, ctx.children)
  }
};

var QCardMedia = {
  name: 'q-card-media',
  functional: true,
  props: {
    overlayPosition: {
      type: String,
      default: 'bottom',
      validator: function (v) { return ['top', 'bottom', 'full'].includes(v); }
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass,
      slots = ctx.slots();
    var child = [slots.default];

    data.staticClass = "q-card-media relative-position" + (cls ? (" " + cls) : '');

    if (slots.overlay) {
      child.push(h(
        'div',
        {
          staticClass: ("q-card-media-overlay absolute-" + (ctx.props.overlayPosition))
        },
        slots.overlay
      ));
    }

    return h('div', data, child)
  }
};

var QCardSeparator = {
  name: 'q-card-separator',
  functional: true,
  props: {
    inset: Boolean
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass;

    data.staticClass = "q-card-separator" + (ctx.props.inset ? ' inset' : '') + (cls ? (" " + cls) : '');

    return h('div', data, ctx.children)
  }
};

function getDirection (mod) {
  if (Object.keys(mod).length === 0) {
    return {
      horizontal: true,
      vertical: true
    }
  }

  var dir = {};['horizontal', 'vertical'].forEach(function (direction) {
    if (mod[direction]) {
      dir[direction] = true;
    }
  });

  return dir
}

function updateClasses (el, dir, scroll) {
  el.classList.add('q-touch');

  if (!scroll) {
    if (dir.horizontal && !dir.vertical) {
      el.classList.add('q-touch-y');
      el.classList.remove('q-touch-x');
    }
    else if (!dir.horizontal && dir.vertical) {
      el.classList.add('q-touch-x');
      el.classList.remove('q-touch-y');
    }
  }
}

function processChanges (evt, ctx, isFinal) {
  var
    direction,
    pos = position(evt),
    distX = pos.left - ctx.event.x,
    distY = pos.top - ctx.event.y,
    absDistX = Math.abs(distX),
    absDistY = Math.abs(distY);

  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    direction = distX < 0 ? 'left' : 'right';
  }
  else if (!ctx.direction.horizontal && ctx.direction.vertical) {
    direction = distY < 0 ? 'up' : 'down';
  }
  else if (absDistX >= absDistY) {
    direction = distX < 0 ? 'left' : 'right';
  }
  else {
    direction = distY < 0 ? 'up' : 'down';
  }

  return {
    evt: evt,
    position: pos,
    direction: direction,
    isFirst: ctx.event.isFirst,
    isFinal: Boolean(isFinal),
    duration: new Date().getTime() - ctx.event.time,
    distance: {
      x: absDistX,
      y: absDistY
    },
    delta: {
      x: pos.left - ctx.event.lastX,
      y: pos.top - ctx.event.lastY
    }
  }
}

function shouldTrigger (ctx, changes) {
  if (ctx.direction.horizontal && ctx.direction.vertical) {
    return true
  }
  if (ctx.direction.horizontal && !ctx.direction.vertical) {
    return Math.abs(changes.delta.x) > 0
  }
  if (!ctx.direction.horizontal && ctx.direction.vertical) {
    return Math.abs(changes.delta.y) > 0
  }
}

var TouchPan = {
  name: 'touch-pan',
  bind: function bind (el, binding) {
    var mouse = !binding.modifiers.nomouse;

    var ctx = {
      handler: binding.value,
      scroll: binding.modifiers.scroll,
      direction: getDirection(binding.modifiers),

      mouseStart: function mouseStart (evt) {
        if (mouse) {
          document.addEventListener('mousemove', ctx.mouseMove);
          document.addEventListener('mouseup', ctx.mouseEnd);
        }
        ctx.start(evt);
      },
      start: function start (evt) {
        var pos = position(evt);
        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
          detected: false,
          prevent: ctx.direction.horizontal && ctx.direction.vertical,
          isFirst: true,
          lastX: pos.left,
          lastY: pos.top
        };
      },
      mouseMove: function mouseMove (evt) {
        ctx.event.prevent = true;
        ctx.move(evt);
      },
      move: function move (evt) {
        if (ctx.event.prevent) {
          if (!ctx.scroll) {
            evt.preventDefault();
          }
          var changes = processChanges(evt, ctx, false);
          if (shouldTrigger(ctx, changes)) {
            ctx.handler(changes);
            ctx.event.lastX = changes.position.left;
            ctx.event.lastY = changes.position.top;
            ctx.event.isFirst = false;
          }
          return
        }
        if (ctx.event.detected) {
          return
        }

        ctx.event.detected = true;
        var
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          distY = pos.top - ctx.event.y;

        if (ctx.direction.horizontal && !ctx.direction.vertical) {
          if (Math.abs(distX) > Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
        else if (Math.abs(distX) < Math.abs(distY)) {
          ctx.event.prevent = true;
        }
      },
      mouseEnd: function mouseEnd (evt) {
        if (mouse) {
          document.removeEventListener('mousemove', ctx.mouseMove);
          document.removeEventListener('mouseup', ctx.mouseEnd);
        }
        ctx.end(evt);
      },
      end: function end (evt) {
        if (!ctx.event.prevent || ctx.event.isFirst) {
          return
        }

        ctx.handler(processChanges(evt, ctx, true));
      }
    };

    el.__qtouchpan = ctx;
    updateClasses(el, ctx.direction, ctx.scroll);
    if (mouse) {
      el.addEventListener('mousedown', ctx.mouseStart);
    }
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('touchmove', ctx.move);
    el.addEventListener('touchend', ctx.end);
  },
  update: function update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qtouchpan.handler = binding.value;
    }
  },
  unbind: function unbind (el, binding) {
    var ctx = el.__qtouchpan;
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('mousedown', ctx.mouseStart);
    el.removeEventListener('touchmove', ctx.move);
    el.removeEventListener('touchend', ctx.end);
    delete el.__qtouchpan;
  }
};

function isDate (v) {
  return Object.prototype.toString.call(v) === '[object Date]'
}



function isNumber (v) {
  return typeof v === 'number' && isFinite(v)
}

var linear = function (t) { return t; };

var easeInQuad = function (t) { return t * t; };
var easeOutQuad = function (t) { return t * (2 - t); };
var easeInOutQuad = function (t) { return t < 0.5
  ? 2 * t * t
  : -1 + (4 - 2 * t) * t; };

var easeInCubic = function (t) { return Math.pow( t, 3 ); };
var easeOutCubic = function (t) { return 1 + Math.pow( (t - 1), 3 ); };
var easeInOutCubic = function (t) { return t < 0.5
  ? 4 * Math.pow( t, 3 )
  : 1 + (t - 1) * Math.pow( (2 * t - 2), 2 ); };

var easeInQuart = function (t) { return Math.pow( t, 4 ); };
var easeOutQuart = function (t) { return 1 - Math.pow( (t - 1), 4 ); };
var easeInOutQuart = function (t) { return t < 0.5
  ? 8 * Math.pow( t, 4 )
  : 1 - 8 * Math.pow( (t - 1), 4 ); };

var easeInQuint = function (t) { return Math.pow( t, 5 ); };
var easeOutQuint = function (t) { return 1 + Math.pow( (t - 1), 5 ); };
var easeInOutQuint = function (t) { return t < 0.5
  ? 16 * Math.pow( t, 5 )
  : 1 + 16 * Math.pow( (t - 1), 5 ); };

var easeInCirc = function (t) { return -1 * Math.sqrt(1 - Math.pow( t, 2 )) + 1; };
var easeOutCirc = function (t) { return Math.sqrt(-1 * (t - 2) * t); };
var easeInOutCirc = function (t) { return t < 0.5
  ? 0.5 * (1 - Math.sqrt(1 - 4 * t * t))
  : 0.5 * (1 + Math.sqrt(-3 + 8 * t - 4 * t * t)); };

var overshoot = function (t) { return -1 * (Math.pow( Math.E, (-6.3 * t) )) * (Math.cos(5 * t)) + 1; };

/* -- Material Design curves -- */

/**
 * Faster ease in, slower ease out
 */
var standard = function (t) { return t < 0.4031
  ? 12 * Math.pow( t, 4 )
  : 1 / 1290 * (11 * Math.sqrt(-40000 * t * t + 80000 * t - 23359) - 129); };

var decelerate = easeOutCubic;
var accelerate = easeInCubic;
var sharp = easeInOutQuad;


var easing = Object.freeze({
	linear: linear,
	easeInQuad: easeInQuad,
	easeOutQuad: easeOutQuad,
	easeInOutQuad: easeInOutQuad,
	easeInCubic: easeInCubic,
	easeOutCubic: easeOutCubic,
	easeInOutCubic: easeInOutCubic,
	easeInQuart: easeInQuart,
	easeOutQuart: easeOutQuart,
	easeInOutQuart: easeInOutQuart,
	easeInQuint: easeInQuint,
	easeOutQuint: easeOutQuint,
	easeInOutQuint: easeInOutQuint,
	easeInCirc: easeInCirc,
	easeOutCirc: easeOutCirc,
	easeInOutCirc: easeInOutCirc,
	overshoot: overshoot,
	standard: standard,
	decelerate: decelerate,
	accelerate: accelerate,
	sharp: sharp
});

var ids = {};

function start$1 (ref) {
  var name = ref.name;
  var duration = ref.duration; if ( duration === void 0 ) duration = 300;
  var to = ref.to;
  var from = ref.from;
  var apply = ref.apply;
  var done = ref.done;
  var cancel = ref.cancel;
  var easing = ref.easing;

  var id = name;
  var start = performance.now();

  if (id) {
    stop(id);
  }
  else {
    id = uid();
  }

  var delta = easing || linear;
  var handler = function () {
    var progress = (performance.now() - start) / duration;
    if (progress > 1) {
      progress = 1;
    }

    var newPos = from + (to - from) * delta(progress);
    apply(newPos, progress);

    if (progress === 1) {
      delete ids[id];
      done && done(newPos);
      return
    }

    anim.last = {
      pos: newPos,
      progress: progress
    };
    anim.timer = window.requestAnimationFrame(handler);
  };

  var anim = ids[id] = {
    cancel: cancel,
    timer: window.requestAnimationFrame(handler)
  };

  return id
}

function stop (id) {
  if (!id) {
    return
  }
  var anim = ids[id];
  if (anim && anim.timer) {
    cancelAnimationFrame(anim.timer);
    anim.cancel && anim.cancel(anim.last);
    delete ids[id];
  }
}


var animate = Object.freeze({
	start: start$1,
	stop: stop
});

var CarouselMixin = {
  props: {
    arrows: Boolean,
    dots: Boolean,
    fullscreen: Boolean,
    infinite: Boolean,
    actions: Boolean,
    animation: {
      type: [Number, Boolean],
      default: true
    },
    easing: Function,
    swipeEasing: Function,
    noSwipe: Boolean,
    handleArrowKeys: Boolean,
    autoplay: [Number, Boolean]
  }
};

var QCarousel = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-carousel",class:{fullscreen: _vm.inFullscreen}},[_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__pan),expression:"__pan",modifiers:{"horizontal":true}}],staticClass:"q-carousel-inner"},[_c('div',{ref:"track",staticClass:"q-carousel-track",class:{'with-arrows': _vm.arrows, 'with-toolbar': _vm.toolbar, 'infinite-left': _vm.infiniteLeft, 'infinite-right': _vm.infiniteRight},style:(_vm.trackPosition)},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.infiniteRight),expression:"infiniteRight"}]}),_vm._v(" "),_vm._t("slide"),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.infiniteLeft),expression:"infiniteLeft"}]})],2),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.arrows && _vm.canGoToPrevious),expression:"arrows && canGoToPrevious"}],staticClass:"q-carousel-left-button row flex-center"},[_c('q-icon',{attrs:{"name":"keyboard_arrow_left"},on:{"click":_vm.previous}})],1),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.arrows && _vm.canGoToNext),expression:"arrows && canGoToNext"}],staticClass:"q-carousel-right-button row flex-center",on:{"click":_vm.next}},[_c('q-icon',{attrs:{"name":"keyboard_arrow_right"}})],1),_vm._v(" "),(_vm.toolbar)?_c('div',{staticClass:"q-carousel-toolbar row items-center justify-end"},[_c('div',{staticClass:"q-carousel-dots col row flex-center"},_vm._l((_vm.slidesNumber),function(n){return (_vm.dots)?_c('q-icon',{key:n,attrs:{"name":(n - 1) !== _vm.slide ? 'panorama_fish_eye' : 'lens'},on:{"click":function($event){_vm.goToSlide(n - 1);}}}):_vm._e()})),_vm._v(" "),_c('div',{staticClass:"row items-center"},[_vm._t("action"),_vm._v(" "),(_vm.fullscreen)?_c('q-icon',{attrs:{"name":_vm.inFullscreen ? 'fullscreen_exit' : 'fullscreen'},on:{"click":_vm.toggleFullscreen}}):_vm._e()],2)]):_vm._e(),_vm._v(" "),_vm._t("default")],2)])},staticRenderFns: [],
  name: 'q-carousel',
  components: {
    QIcon: QIcon
  },
  directives: {
    TouchPan: TouchPan
  },
  mixins: [CarouselMixin],
  data: function data () {
    return {
      position: 0,
      slide: 0,
      positionSlide: 0,
      slidesNumber: 0,
      inFullscreen: false,
      animUid: false
    }
  },
  watch: {
    autoplay: function autoplay () {
      this.__planAutoPlay();
    },
    infinite: function infinite () {
      this.__planAutoPlay();
    },
    handleArrowKeys: function handleArrowKeys (v) {
      this.__setArrowKeys(v);
    }
  },
  computed: {
    toolbar: function toolbar () {
      return this.dots || this.fullscreen || this.actions
    },
    trackPosition: function trackPosition () {
      return cssTransform(("translateX(" + (this.position) + "%)"))
    },
    infiniteRight: function infiniteRight () {
      return this.infinite && this.slidesNumber > 1 && this.positionSlide >= this.slidesNumber
    },
    infiniteLeft: function infiniteLeft () {
      return this.infinite && this.slidesNumber > 1 && this.positionSlide < 0
    },
    canGoToPrevious: function canGoToPrevious () {
      return this.infinite ? this.slidesNumber > 1 : this.slide > 0
    },
    canGoToNext: function canGoToNext () {
      return this.infinite ? this.slidesNumber > 1 : this.slide < this.slidesNumber - 1
    }
  },
  methods: {
    __pan: function __pan (event) {
      var this$1 = this;

      if (this.noSwipe || (this.infinite && this.animationInProgress)) {
        return
      }
      if (!this.hasOwnProperty('initialPosition')) {
        this.initialPosition = this.position;
        this.__cleanup();
      }

      var delta = (event.direction === 'left' ? -1 : 1) * event.distance.x;

      if (
        (this.infinite && this.slidesNumber < 2) ||
        (
          !this.infinite &&
          (
            (this.slide === 0 && delta > 0) ||
            (this.slide === this.slidesNumber - 1 && delta < 0)
          )
        )
      ) {
        delta = delta / 10;
      }

      this.position = this.initialPosition + delta / this.$refs.track.offsetWidth * 100;
      this.positionSlide = (event.direction === 'left' ? this.slide + 1 : this.slide - 1);

      if (event.isFinal) {
        this.goToSlide(
          event.distance.x < 100
            ? this.slide
            : this.positionSlide,
          function () {
            delete this$1.initialPosition;
          },
          true
        );
      }
    },
    __getSlidesNumber: function __getSlidesNumber () {
      return this.$slots.slide ? this.$slots.slide.length : 0
    },
    previous: function previous (done) {
      if (this.canGoToPrevious) {
        this.goToSlide(this.slide - 1, done);
      }
    },
    next: function next (done) {
      if (this.canGoToNext) {
        this.goToSlide(this.slide + 1, done);
      }
    },
    goToSlide: function goToSlide (slide, done, fromSwipe) {
      var this$1 = this;
      if ( fromSwipe === void 0 ) fromSwipe = false;

      var direction = '';
      this.__cleanup();

      var finish = function () {
        this$1.$emit('slide', this$1.slide, direction);
        this$1.__planAutoPlay();
        if (typeof done === 'function') {
          done();
        }
      };

      if (this.slidesNumber < 2) {
        this.slide = 0;
        this.positionSlide = 0;
      }
      else {
        if (!this.hasOwnProperty('initialPosition')) {
          this.position = -this.slide * 100;
        }
        direction = slide > this.slide ? 'next' : 'previous';
        if (this.infinite) {
          this.slide = normalizeToInterval(slide, 0, this.slidesNumber - 1);
          this.positionSlide = normalizeToInterval(slide, -1, this.slidesNumber);
        }
        else {
          this.slide = between(slide, 0, this.slidesNumber - 1);
          this.positionSlide = this.slide;
        }
      }

      var pos = -this.positionSlide * 100;

      if (!this.animation) {
        this.position = pos;
        finish();
        return
      }

      this.animationInProgress = true;

      this.animUid = start$1({
        from: this.position,
        to: pos,
        duration: isNumber(this.animation) ? this.animation : 300,
        easing: fromSwipe
          ? this.swipeEasing || decelerate
          : this.easing || standard,
        apply: function (pos) {
          this$1.position = pos;
        },
        done: function () {
          if (this$1.infinite) {
            this$1.position = -this$1.slide * 100;
            this$1.positionSlide = this$1.slide;
          }
          this$1.animationInProgress = false;
          finish();
        }
      });
    },
    toggleFullscreen: function toggleFullscreen () {
      if (this.inFullscreen) {
        if (!Platform.has.popstate) {
          this.__setFullscreen(false);
        }
        else {
          window.history.go(-1);
        }
        return
      }

      this.__setFullscreen(true);
      if (Platform.has.popstate) {
        window.history.pushState({}, '');
        window.addEventListener('popstate', this.__popState);
      }
    },
    __setFullscreen: function __setFullscreen (state) {
      if (this.inFullscreen === state) {
        return
      }

      if (state) {
        this.container.replaceChild(this.fillerNode, this.$el);
        document.body.appendChild(this.$el);
        this.inFullscreen = true;
        return
      }

      this.inFullscreen = false;
      this.container.replaceChild(this.$el, this.fillerNode);
    },
    __popState: function __popState () {
      if (this.inFullscreen) {
        this.__setFullscreen(false);
      }
      window.removeEventListener('popstate', this.__popState);
    },
    stopAnimation: function stopAnimation () {
      stop(this.animUid);
      this.animationInProgress = false;
    },
    __cleanup: function __cleanup () {
      this.stopAnimation();
      clearTimeout(this.timer);
    },
    __planAutoPlay: function __planAutoPlay () {
      var this$1 = this;

      this.$nextTick(function () {
        if (this$1.autoplay) {
          clearTimeout(this$1.timer);
          this$1.timer = setTimeout(
            this$1.next,
            isNumber(this$1.autoplay) ? this$1.autoplay : 5000
          );
        }
      });
    },
    __handleArrowKey: function __handleArrowKey (e) {
      var key = getEventKey(e);

      if (key === 37) { // left arrow key
        this.previous();
      }
      else if (key === 39) { // right arrow key
        this.next();
      }
    },
    __setArrowKeys: function __setArrowKeys (/* boolean */ state) {
      var op = (state === true ? 'add' : 'remove') + "EventListener";
      document[op]('keydown', this.__handleArrowKey);
    }
  },
  beforeUpdate: function beforeUpdate () {
    var slides = this.__getSlidesNumber();
    if (slides !== this.slidesNumber) {
      this.slidesNumber = slides;
      this.goToSlide(this.slide);
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.fillerNode = document.createElement('span');
      this$1.container = this$1.$el.parentNode;
      this$1.slidesNumber = this$1.__getSlidesNumber();
      this$1.__planAutoPlay();
      if (this$1.handleArrowKeys) {
        this$1.__setArrowKeys(true);
      }
    });
  },
  beforeDestroy: function beforeDestroy () {
    this.__cleanup();
    if (this.handleArrowKeys) {
      this.__setArrowKeys(false);
    }
  }
};

var QChatMessage = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-message",class:{ 'q-message-sent': _vm.sent, 'q-message-received': !_vm.sent }},[(_vm.label)?_c('p',{staticClass:"q-message-label text-center",domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),(_vm.avatar)?_c('div',{staticClass:"q-message-container row items-end no-wrap"},[_vm._t("avatar",[_c('img',{staticClass:"q-message-avatar",attrs:{"src":_vm.avatar}})]),_vm._v(" "),_c('div',{class:_vm.sizeClass},[(_vm.name)?_c('div',{staticClass:"q-message-name",domProps:{"innerHTML":_vm._s(_vm.name)}}):_vm._e(),_vm._v(" "),_vm._l((_vm.text),function(msg){return _c('div',{key:msg,staticClass:"q-message-text",class:_vm.messageClass},[_c('span',{staticClass:"q-message-text-content",class:_vm.textClass},[_c('div',{domProps:{"innerHTML":_vm._s(msg)}}),_vm._v(" "),(_vm.stamp)?_c('div',{staticClass:"q-message-stamp",domProps:{"innerHTML":_vm._s(_vm.stamp)}}):_vm._e()])])}),_vm._v(" "),(!_vm.text || !_vm.text.length)?_c('div',{staticClass:"q-message-text",class:_vm.messageClass},[_c('span',{staticClass:"q-message-text-content",class:_vm.textClass},[_vm._t("default"),_vm._v(" "),(_vm.stamp)?_c('div',{staticClass:"q-message-stamp",domProps:{"innerHTML":_vm._s(_vm.stamp)}}):_vm._e()],2)]):_vm._e()],2)],2):_vm._e()])},staticRenderFns: [],
  name: 'q-chat-message',
  props: {
    sent: Boolean,
    label: String,

    bgColor: String,
    textColor: String,

    name: String,
    avatar: String,
    text: Array,
    stamp: String,
    size: String
  },
  computed: {
    textClass: function textClass () {
      if (this.textColor) {
        return ("text-" + (this.textColor))
      }
    },
    messageClass: function messageClass () {
      if (this.bgColor) {
        return ("text-" + (this.bgColor))
      }
    },
    sizeClass: function sizeClass () {
      if (this.size) {
        return ("col-" + (this.size))
      }
    }
  }
};

var Mixin = {
  props: {
    value: {
      type: [Boolean, Array],
      required: true
    },
    val: {}
  },
  computed: {
    model: {
      get: function get () {
        return this.value
      },
      set: function set (val) {
        if (this.value !== val) {
          this.$emit('input', val);
        }
      }
    },
    isArray: function isArray () {
      return Array.isArray(this.value)
    },
    index: function index () {
      if (this.isArray) {
        return this.model.indexOf(this.val)
      }
    },
    isActive: function isActive () {
      return this.isArray
        ? this.model.indexOf(this.val) > -1
        : this.model
    }
  },
  methods: {
    toggle: function toggle (withBlur) {
      if (withBlur !== false) {
        this.$el.blur();
      }

      if (this.disable) {
        return
      }
      if (this.isArray) {
        if (this.index !== -1) {
          this.unselect();
        }
        else {
          this.select();
        }
        return
      }
      this.model = !this.model;
      this.__onChange();
    },
    select: function select () {
      if (this.disable) {
        return
      }
      if (this.isArray) {
        if (this.index === -1) {
          this.model.push(this.val);
          this.__onChange();
        }
        return
      }
      this.model = true;
      this.__onChange();
    },
    unselect: function unselect () {
      if (this.disable) {
        return
      }
      if (this.isArray) {
        if (this.index > -1) {
          this.model.splice(this.index, 1);
          this.__onChange();
        }
        return
      }
      this.model = false;
      this.__onChange();
    },
    __change: function __change (e) {
      if (this.$q.platform.is.ios) {
        this.toggle();
      }
      else {
        this.__onChange();
      }
    },
    __onChange: function __onChange () {
      var this$1 = this;

      var ref = this.$refs.ripple;
      if (ref) {
        ref.classList.add('active');
        setTimeout(function () {
          ref.classList.remove('active');
        }, 10);
      }
      this.$nextTick(function () {
        this$1.$emit('change', this$1.model);
      });
    }
  }
};

var OptionMixin = {
  props: {
    label: String,
    leftLabel: Boolean,
    color: String,
    disable: Boolean
  },
  computed: {
    classes: function classes () {
      if (this.isActive) {
        var cls = [];
        cls.push('active');
        if (this.color) {
          cls.push(("text-" + (this.color)));
        }
        return cls
      }
    }
  }
};

var QCheckbox = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-checkbox q-option cursor-pointer no-outline q-focusable row inline no-wrap items-center",class:{disabled: _vm.disable, reverse: _vm.leftLabel},attrs:{"tabindex":"0"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.toggle($event);},"focus":function($event){_vm.$emit('focus');},"blur":function($event){_vm.$emit('blur');},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.toggle(false);}}},[_c('div',{staticClass:"q-option-inner relative-position",class:_vm.classes},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],attrs:{"type":"checkbox","disabled":_vm.disable},domProps:{"value":_vm.val,"checked":Array.isArray(_vm.model)?_vm._i(_vm.model,_vm.val)>-1:(_vm.model)},on:{"click":function($event){$event.stopPropagation();},"change":[function($event){var $$a=_vm.model,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=_vm.val,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.model=$$a.concat([$$v]));}else{$$i>-1&&(_vm.model=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.model=$$c;}},_vm.__change]}}),_vm._v(" "),_c('div',{staticClass:"q-focus-helper"}),_vm._v(" "),_c('q-icon',{staticClass:"q-checkbox-unchecked cursor-pointer",style:(_vm.uncheckedStyle),attrs:{"name":_vm.uncheckedIcon}}),_vm._v(" "),_c('q-icon',{staticClass:"q-checkbox-checked cursor-pointer absolute-full",style:(_vm.checkedStyle),attrs:{"name":_vm.checkedIcon}}),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{ref:"ripple",staticClass:"q-radial-ripple"}):_vm._e()],1),_vm._v(" "),(_vm.label)?_c('span',{staticClass:"q-option-label",domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-checkbox',
  mixins: [Mixin, OptionMixin],
  components: {
    QIcon: QIcon
  },
  props: {
    checkedIcon: {
      type: String,
      default: current === 'ios' ? 'check_circle' : 'check_box'
    },
    uncheckedIcon: {
      type: String,
      default: current === 'ios' ? 'radio_button_unchecked' : 'check_box_outline_blank'
    }
  },
  computed: {
    checkedStyle: function checkedStyle () {
      return this.isActive
        ? {transition: 'opacity 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 800ms cubic-bezier(0.23, 1, 0.32, 1) 0ms', opacity: 1, transform: 'scale(1)'}
        : {transition: 'opacity 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, transform 0ms cubic-bezier(0.23, 1, 0.32, 1) 450ms', opacity: 0, transform: 'scale(0)'}
    },
    uncheckedStyle: function uncheckedStyle () {
      return this.isActive
        ? {transition: 'opacity 650ms cubic-bezier(0.23, 1, 0.32, 1) 150ms', opacity: 0}
        : {transition: 'opacity 1000ms cubic-bezier(0.23, 1, 0.32, 1) 200ms', opacity: 1}
    }
  }
};

var QChip = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-chip row no-wrap inline items-center",class:( obj = { tag: _vm.tag, square: _vm.square, floating: _vm.floating, pointing: _vm.pointing, small: _vm.small || _vm.floating, 'text-white': _vm.color }, obj[("pointing-" + (_vm.pointing))] = _vm.pointing, obj[("bg-" + (_vm.color))] = _vm.color, obj ),on:{"click":_vm.__onClick}},[(_vm.icon || _vm.avatar)?_c('div',{staticClass:"q-chip-side chip-left row flex-center",class:{'chip-detail': _vm.detail}},[(_vm.icon)?_c('q-icon',{attrs:{"name":_vm.icon}}):(_vm.avatar)?_c('img',{attrs:{"src":_vm.avatar}}):_vm._e()],1):_vm._e(),_vm._v(" "),_c('div',{staticClass:"q-chip-main"},[_vm._t("default")],2),_vm._v(" "),(_vm.iconRight)?_c('q-icon',{staticClass:"on-right",attrs:{"name":_vm.iconRight}}):_vm._e(),_vm._v(" "),(_vm.closable)?_c('div',{staticClass:"q-chip-side chip-right row flex-center"},[(_vm.closable)?_c('q-icon',{staticClass:"cursor-pointer",attrs:{"name":"cancel"},on:{"click":function($event){$event.stopPropagation();_vm.$emit('close');}}}):_vm._e()],1):_vm._e()],1)
var obj;},staticRenderFns: [],
  name: 'q-chip',
  components: {
    QIcon: QIcon
  },
  props: {
    small: Boolean,
    tag: Boolean,
    square: Boolean,
    floating: Boolean,
    pointing: {
      type: String,
      validator: function (v) { return ['up', 'right', 'down', 'left'].includes(v); }
    },
    color: String,
    icon: String,
    iconRight: String,
    avatar: String,
    closable: Boolean,
    detail: Boolean
  },
  methods: {
    __onClick: function __onClick (e) {
      this.$emit('click', e);
    }
  }
};

var QChipsInput = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input-frame',{staticClass:"q-chips-input",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"disable":_vm.disable,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.inverted ? _vm.frameColor || _vm.color : _vm.color,"focused":_vm.focused,"length":_vm.length,"additional-length":_vm.input.length > 0},on:{"click":_vm.__onClick}},[_c('div',{staticClass:"col row items-center group q-input-chips"},[_vm._l((_vm.value),function(label,index){return _c('q-chip',{key:label,attrs:{"small":"","closable":!_vm.disable,"color":_vm.color},on:{"close":function($event){_vm.remove(index);}}},[_vm._v(" "+_vm._s(label)+" ")])}),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.input),expression:"input"}],ref:"input",staticClass:"col q-input-target",class:[("text-" + (_vm.align))],attrs:{"name":_vm.name,"placeholder":_vm.inputPlaceholder,"disabled":_vm.disable,"max-length":_vm.maxLength},domProps:{"value":(_vm.input)},on:{"focus":_vm.__onFocus,"blur":_vm.__onInputBlur,"keydown":_vm.__handleKey,"keyup":_vm.__onKeyup,"input":function($event){if($event.target.composing){ return; }_vm.input=$event.target.value;}}})],2),_vm._v(" "),(!_vm.disable)?_c('q-icon',{staticClass:"q-if-control self-end",class:{invisible: !_vm.input.length},attrs:{"slot":"after","name":"send"},on:{"click":function($event){_vm.add();}},slot:"after"}):_vm._e()],1)},staticRenderFns: [],
  name: 'q-chips-input',
  mixins: [FrameMixin, InputMixin],
  components: {
    QInputFrame: QInputFrame,
    QChip: QChip
  },
  props: {
    value: {
      type: Array,
      required: true
    },
    frameColor: String
  },
  data: function data () {
    return {
      input: '',
      focused: false
    }
  },
  computed: {
    length: function length () {
      return this.value
        ? this.value.length
        : 0
    }
  },
  methods: {
    add: function add (value) {
      if ( value === void 0 ) value = this.input;

      if (!this.disable && value) {
        this.value.push(value);
        this.$emit('change', this.value);
        this.input = '';
      }
    },
    remove: function remove (index) {
      if (!this.disable && index >= 0 && index < this.length) {
        this.value.splice(index, 1);
        this.$emit('change', this.value);
      }
    },
    __onInputBlur: function __onInputBlur (e) {
      this.__onBlur(e);
    },
    __handleKey: function __handleKey (e) {
      // ENTER key
      if (e.which === 13 || e.keyCode === 13) {
        this.add();
      }
      // Backspace key
      else if (e.which === 8 || e.keyCode === 8) {
        if (!this.input.length && this.length) {
          this.remove(this.length - 1);
        }
      }
      else {
        this.__onKeydown(e);
      }
    },
    __onClick: function __onClick () {
      this.focus();
    }
  }
};

function getHeight (el, style$$1) {
  var initial = {
    visibility: el.style.visibility,
    maxHeight: el.style.maxHeight
  };

  css(el, {
    visibility: 'hidden',
    maxHeight: ''
  });
  var height$$1 = style$$1.height;
  css(el, initial);

  return parseFloat(height$$1)
}

function parseSize (padding) {
  return padding.split(' ').map(function (t) {
    var unit = t.match(/[a-zA-Z]+/) || '';
    if (unit) {
      unit = unit[0];
    }
    return [parseFloat(t), unit]
  })
}

function toggleSlide (el, showing, done) {
  var store = el.__qslidetoggle || {};
  function anim () {
    store.uid = start$1({
      to: showing ? 100 : 0,
      from: store.pos !== null ? store.pos : showing ? 0 : 100,
      apply: function apply (pos) {
        store.pos = pos;
        css(el, {
          maxHeight: ((store.height * pos / 100) + "px"),
          padding: store.padding ? store.padding.map(function (t) { return (t[0] * pos / 100) + t[1]; }).join(' ') : '',
          margin: store.margin ? store.margin.map(function (t) { return (t[0] * pos / 100) + t[1]; }).join(' ') : ''
        });
      },
      done: function done$1 () {
        store.uid = null;
        store.pos = null;
        done();
        css(el, store.css);
      }
    });
    el.__qslidetoggle = store;
  }

  if (store.uid) {
    stop(store.uid);
    return anim()
  }

  store.css = {
    overflowY: el.style.overflowY,
    maxHeight: el.style.maxHeight,
    padding: el.style.padding,
    margin: el.style.margin
  };
  var style$$1 = window.getComputedStyle(el);
  if (style$$1.padding && style$$1.padding !== '0px') {
    store.padding = parseSize(style$$1.padding);
  }
  if (style$$1.margin && style$$1.margin !== '0px') {
    store.margin = parseSize(style$$1.margin);
  }
  store.height = getHeight(el, style$$1);
  store.pos = null;
  el.style.overflowY = 'hidden';
  anim();
}

var slideAnimation = {
  enter: function enter (el, done) {
    toggleSlide(el, true, done);
  },
  leave: function leave (el, done) {
    toggleSlide(el, false, done);
  }
};

var QSlideTransition = {
  name: 'q-slide-transition',
  functional: true,
  props: {
    appear: Boolean
  },
  render: function render (h, ctx) {
    var data = {
      props: {
        mode: 'out-in',
        css: false,
        appear: ctx.props.appear
      },
      on: slideAnimation
    };
    return h('transition', data, ctx.children)
  }
};

var eventName = 'q:collapsible:close';

var QCollapsible = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-collapsible q-item-division relative-position",class:[ ("q-collapsible-" + (_vm.active ? 'opened' : 'closed')), { 'q-item-separator': _vm.separator, 'q-item-inset-separator': _vm.insetSeparator } ]},[_c('q-item-wrapper',{directives:[{name:"ripple",rawName:"v-ripple.mat",value:(!_vm.iconToggle && !_vm.disable),expression:"!iconToggle && !disable",modifiers:{"mat":true}}],class:{disabled: _vm.disable},attrs:{"cfg":_vm.cfg},on:{"click":_vm.__toggleItem}},[_c('div',{directives:[{name:"ripple",rawName:"v-ripple.mat.stop",value:(_vm.iconToggle),expression:"iconToggle",modifiers:{"mat":true,"stop":true}}],staticClass:"cursor-pointer relative-position inline-block",attrs:{"slot":"right"},on:{"click":function($event){$event.stopPropagation();_vm.toggle($event);}},slot:"right"},[_c('q-item-tile',{staticClass:"transition-generic",class:{'rotate-180': _vm.active, invisible: _vm.disable},attrs:{"icon":"keyboard_arrow_down"}})],1)]),_vm._v(" "),_c('q-slide-transition',[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.active),expression:"active"}]},[_c('div',{staticClass:"q-collapsible-sub-item relative-position",class:{indent: _vm.indent}},[_vm._t("default")],2)])])],1)},staticRenderFns: [],
  name: 'q-collapsible',
  components: {
    QItemWrapper: QItemWrapper,
    QItemTile: QItemTile,
    QSlideTransition: QSlideTransition
  },
  directives: {
    Ripple: Ripple
  },
  props: {
    opened: Boolean,
    disable: Boolean,
    indent: Boolean,
    group: String,
    iconToggle: Boolean,

    dense: Boolean,
    sparse: Boolean,
    multiline: Boolean,
    separator: Boolean,
    insetSeparator: Boolean,

    icon: String,
    image: String,
    avatar: String,
    letter: String,
    label: String,
    sublabel: String,
    labelLines: [String, Number],
    sublabelLines: [String, Number]
  },
  data: function data () {
    return {
      active: this.opened
    }
  },
  watch: {
    opened: function opened (value) {
      this.active = value;
    },
    active: function active (val) {
      if (val && this.group) {
        Events.$emit(eventName, this);
      }

      this.$emit(val ? 'open' : 'close');
    }
  },
  computed: {
    cfg: function cfg () {
      return {
        link: !this.iconToggle,

        dark: this.dark,
        dense: this.dense,
        sparse: this.sparse,
        multiline: this.multiline,

        icon: this.icon,
        image: this.image,
        avatar: this.avatar,
        letter: this.letter,

        label: this.label,
        sublabel: this.sublabel,
        labelLines: this.labelLines,
        sublabelLines: this.sublabelLines
      }
    }
  },
  methods: {
    toggle: function toggle () {
      if (!this.disable) {
        this.active = !this.active;
      }
    },
    open: function open () {
      this.active = true;
    },
    close: function close () {
      this.active = false;
    },
    __toggleItem: function __toggleItem () {
      if (!this.iconToggle) {
        this.toggle();
      }
    },
    __eventHandler: function __eventHandler (comp) {
      if (this.group && this !== comp && comp.group === this.group) {
        this.close();
      }
    }
  },
  created: function created () {
    Events.$on(eventName, this.__eventHandler);
  },
  beforeDestroy: function beforeDestroy () {
    Events.$off(eventName, this.__eventHandler);
  }
};

var ContextMenuDesktop = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-popover',{ref:"popover",attrs:{"anchor-click":false},on:{"open":function($event){_vm.$emit('open');},"close":function($event){_vm.$emit('close');}}},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-context-menu',
  components: {
    QPopover: QPopover
  },
  props: {
    disable: Boolean
  },
  methods: {
    close: function close () {
      this.$refs.popover.close();
    },
    __open: function __open (evt) {
      var this$1 = this;

      if (this.disable) {
        return
      }
      this.close();
      evt.preventDefault();
      evt.stopPropagation();
      /*
        Opening with a timeout for
        Firefox workaround
       */
      setTimeout(function () {
        this$1.$refs.popover.open(evt);
      }, 100);
    }
  },
  mounted: function mounted () {
    this.target = this.$refs.popover.$el.parentNode;
    this.target.addEventListener('contextmenu', this.__open);
  },
  beforeDestroy: function beforeDestroy () {
    this.target.removeEventListener('contexmenu', this.__open);
  }
};

var positions = {
  top: 'items-start justify-center with-backdrop',
  bottom: 'items-end justify-center with-backdrop',
  right: 'items-center justify-end with-backdrop',
  left: 'items-center justify-start with-backdrop'
};
var positionCSS = {
  mat: {
    maxHeight: '80vh',
    height: 'auto'
  },
  ios: {
    maxHeight: '80vh',
    height: 'auto',
    boxShadow: 'none'
  }
};

function additionalCSS (theme, position) {
  var css = {};

  if (['left', 'right'].includes(position)) {
    css.maxWidth = '90vw';
  }
  if (theme === 'ios') {
    if (['left', 'top'].includes(position)) {
      css.borderTopLeftRadius = 0;
    }
    if (['right', 'top'].includes(position)) {
      css.borderTopRightRadius = 0;
    }
    if (['left', 'bottom'].includes(position)) {
      css.borderBottomLeftRadius = 0;
    }
    if (['right', 'bottom'].includes(position)) {
      css.borderBottomRightRadius = 0;
    }
  }

  return css
}

var duration = 200;
var openedModalNumber = 0;

var QModal = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-transition',{attrs:{"name":_vm.modalTransition,"enter":_vm.enterClass,"leave":_vm.leaveClass}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.active),expression:"active"}],staticClass:"modal fullscreen row",class:_vm.modalClasses,on:{"mousedown":function($event){_vm.__dismiss();},"touchstart":function($event){_vm.__dismiss();}}},[_c('div',{ref:"content",staticClass:"modal-content scroll",class:_vm.contentClasses,style:(_vm.modalCss),on:{"mousedown":function($event){$event.stopPropagation();},"touchstart":function($event){$event.stopPropagation();}}},[_vm._t("default")],2)])])},staticRenderFns: [],
  name: 'q-modal',
  mixins: [ModelToggleMixin],
  components: {
    QTransition: QTransition
  },
  props: {
    position: {
      type: String,
      default: '',
      validator: function validator (val) {
        return val === '' || ['top', 'bottom', 'left', 'right'].includes(val)
      }
    },
    transition: String,
    enterClass: String,
    leaveClass: String,
    positionClasses: {
      type: String,
      default: 'flex-center'
    },
    contentClasses: [Object, Array, String],
    contentCss: [Object, Array, String],
    noBackdropDismiss: {
      type: Boolean,
      default: false
    },
    noEscDismiss: {
      type: Boolean,
      default: false
    },
    minimized: Boolean,
    maximized: Boolean
  },
  data: function data () {
    return {
      active: false,
      toggleInProgress: false
    }
  },
  computed: {
    modalClasses: function modalClasses () {
      var cls = this.position
        ? positions[this.position]
        : this.positionClasses;
      if (this.maximized) {
        return ['maximized', cls]
      }
      else if (this.minimized) {
        return ['minimized', cls]
      }
      return cls
    },
    modalTransition: function modalTransition () {
      if (this.position) {
        return ("q-modal-" + (this.position))
      }
      if (this.enterClass === void 0 && this.leaveClass === void 0) {
        return this.transition || 'q-modal'
      }
    },
    modalCss: function modalCss () {
      if (this.position) {
        var css = Array.isArray(this.contentCss)
          ? this.contentCss
          : [this.contentCss];

        css.unshift(extend(
          {},
          positionCSS[this.$q.theme],
          additionalCSS(this.$q.theme, this.position)
        ));

        return css
      }

      return this.contentCss
    }
  },
  methods: {
    open: function open (onShow) {
      var this$1 = this;

      if (this.active || this.toggleInProgress) {
        return
      }

      this.toggleInProgress = true;
      var body = document.body;

      body.appendChild(this.$el);
      body.classList.add('with-modal');
      this.bodyPadding = window.getComputedStyle(body).paddingRight;
      body.style.paddingRight = (getScrollbarWidth()) + "px";
      EscapeKey.register(function () {
        if (this$1.noEscDismiss) {
          return
        }
        this$1.close(function () {
          this$1.$emit('escape-key');
        });
      });

      this.__popstate = function () {
        if (
          Platform.has.popstate &&
          window.history.state &&
          window.history.state.modalId &&
          window.history.state.modalId >= this$1.__modalId
        ) {
          return
        }
        openedModalNumber--;
        EscapeKey.pop();
        this$1.active = false;

        if (Platform.has.popstate) {
          window.removeEventListener('popstate', this$1.__popstate);
        }

        setTimeout(function () {
          if (!openedModalNumber) {
            body.classList.remove('with-modal');
            body.style.paddingRight = this$1.bodyPadding;
          }
          if (typeof this$1.__onClose === 'function') {
            this$1.__onClose();
          }
          this$1.toggleInProgress = false;
          this$1.__updateModel(false);
          this$1.$emit('close');
        }, duration);
      };

      setTimeout(function () {
        var content = this$1.$refs.content;
        content.scrollTop = 0
        ;['modal-scroll', 'layout-view'].forEach(function (c) {
          [].slice.call(content.getElementsByClassName(c)).forEach(function (el) {
            el.scrollTop = 0;
          });
        });
      }, 10);

      this.active = true;
      this.__modalId = ++openedModalNumber;
      if (Platform.has.popstate) {
        window.history.pushState({modalId: this.__modalId}, '');
        window.addEventListener('popstate', this.__popstate);
      }

      setTimeout(function () {
        if (typeof onShow === 'function') {
          onShow();
        }
        this$1.toggleInProgress = false;
        this$1.__updateModel(true);
        this$1.$emit('open');
      }, duration);
    },
    close: function close (onClose) {
      if (!this.active || this.toggleInProgress) {
        return
      }

      this.toggleInProgress = true;
      this.__onClose = onClose;

      if (!Platform.has.popstate) {
        this.__popstate();
      }
      else {
        window.history.go(-1);
      }
    },
    toggle: function toggle (done) {
      if (this.active) {
        this.close(done);
      }
      else {
        this.open(done);
      }
    },
    __dismiss: function __dismiss (onClick) {
      if (this.noBackdropDismiss) {
        return
      }
      this.close(onClick);
    }
  },
  beforeDestroy: function beforeDestroy () {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};

var QModalLayout = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-modal-layout column absolute-full"},[(_vm.$slots.header || (_vm.$q.theme === 'ios' && _vm.$slots.navigation))?_c('div',{staticClass:"layout-header",class:_vm.headerClass,style:(_vm.headerStyle)},[_vm._t("header"),_vm._v(" "),(_vm.$q.theme !== 'ios')?_vm._t("navigation"):_vm._e()],2):_vm._e(),_vm._v(" "),_c('div',{staticClass:"q-modal-layout-content col scroll",class:_vm.contentClass,style:(_vm.contentStyle)},[_vm._t("default")],2),_vm._v(" "),(_vm.$slots.footer || (_vm.$q.theme === 'ios' && _vm.$slots.navigation))?_c('div',{staticClass:"layout-footer",class:_vm.footerClass,style:(_vm.footerStyle)},[_vm._t("footer"),_vm._v(" "),(_vm.$q.theme === 'ios')?_vm._t("navigation"):_vm._e()],2):_vm._e()])},staticRenderFns: [],
  name: 'q-modal-layout',
  props: {
    headerStyle: [String, Object, Array],
    headerClass: [String, Object, Array],

    contentStyle: [String, Object, Array],
    contentClass: [String, Object, Array],

    footerStyle: [String, Object, Array],
    footerClass: [String, Object, Array]
  }
};

var ContextMenuMobile = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-modal',{ref:"dialog",attrs:{"minimized":""},on:{"open":function($event){_vm.$emit('open');},"close":function($event){_vm.$emit('close');}}},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-context-menu',
  components: {
    QModal: QModal
  },
  props: {
    disable: Boolean
  },
  methods: {
    open: function open () {
      this.handler();
    },
    close: function close () {
      this.target.classList.remove('non-selectable');
      this.$refs.dialog.close();
    },
    toggle: function toggle () {
      if (this.$refs.dialog.active) {
        this.close();
      }
      else {
        this.open();
      }
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.target = this$1.$el.parentNode;

      this$1.handler = function () {
        if (!this$1.disable) {
          this$1.$refs.dialog.open();
        }
      };

      this$1.touchStartHandler = function (event) {
        this$1.target.classList.add('non-selectable');
        this$1.touchTimer = setTimeout(function () {
          event.preventDefault();
          event.stopPropagation();
          this$1.cleanup();
          setTimeout(function () {
            this$1.handler();
          }, 10);
        }, 600);
      };
      this$1.cleanup = function () {
        this$1.target.classList.remove('non-selectable');
        clearTimeout(this$1.touchTimer);
        this$1.touchTimer = null;
      };
      this$1.target.addEventListener('touchstart', this$1.touchStartHandler);
      this$1.target.addEventListener('touchcancel', this$1.cleanup);
      this$1.target.addEventListener('touchmove', this$1.cleanup);
      this$1.target.addEventListener('touchend', this$1.cleanup);
    });
  },
  beforeDestroy: function beforeDestroy () {
    this.target.removeEventListener('touchstart', this.touchStartHandler);
    this.target.removeEventListener('touchcancel', this.cleanup);
    this.target.removeEventListener('touchmove', this.cleanup);
    this.target.removeEventListener('touchend', this.cleanup);
  }
};

var QContextMenu = {
  name: 'q-context-menu',
  functional: true,
  render: function render (h, ctx) {
    return h(
      Platform.is.mobile ? ContextMenuMobile : ContextMenuDesktop,
      ctx.data,
      ctx.children
    )
  }
};

var clone = function (data) {
  return JSON.parse(JSON.stringify(data))
};

var ColumnSelection = {
  data: function data () {
    return {
      columnSelection: this.columns.map(function (col) { return col.field; })
    }
  },
  watch: {
    'config.columnPicker': function config_columnPicker (value) {
      if (!value) {
        this.columnSelection = this.columns.map(function (col) { return col.field; });
      }
    }
  },
  computed: {
    cols: function cols () {
      var this$1 = this;

      return this.columns.filter(function (col) { return this$1.columnSelection.includes(col.field); })
    },
    columnSelectionOptions: function columnSelectionOptions () {
      return this.columns.map(function (col) {
        return {
          label: col.label,
          value: col.field
        }
      })
    }
  }
};

var QSearch = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input',{ref:"input",staticClass:"q-search",attrs:{"type":_vm.type,"autofocus":_vm.autofocus,"placeholder":_vm.placeholder,"disable":_vm.disable,"error":_vm.error,"align":_vm.align,"float-label":_vm.floatLabel,"stack-label":_vm.stackLabel,"prefix":_vm.prefix,"suffix":_vm.suffix,"inverted":_vm.inverted,"dark":_vm.dark,"max-length":_vm.maxLength,"color":_vm.color,"before":_vm.controlBefore,"after":_vm.controlAfter},on:{"focus":_vm.__onFocus,"blur":_vm.__onBlur,"keyup":_vm.__onKeyup,"keydown":_vm.__onKeydown,"click":_vm.__onClick},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v;},expression:"model"}},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-search',
  mixins: [FrameMixin, InputMixin],
  components: {
    QIcon: QIcon,
    QInput: QInput
  },
  directives: {
    Ripple: Ripple
  },
  props: {
    value: { required: true },
    type: String,
    debounce: {
      type: Number,
      default: 300
    },
    icon: {
      type: String,
      default: 'search'
    },
    placeholder: {
      type: String,
      default: 'Search'
    }
  },
  data: function data () {
    return {
      model: this.value,
      focused: false,
      childDebounce: false,
      timer: null,
      isEmpty: !this.value && this.value !== 0
    }
  },
  provide: function provide () {
    var this$1 = this;

    return {
      __inputParent: {
        set: function (val) {
          if (this$1.value !== val) {
            this$1.$emit('input', val);
            this$1.$emit('change', val);
          }
        },
        setChildDebounce: function (v) {
          this$1.childDebounce = v;
        }
      }
    }
  },
  watch: {
    value: function value (v) {
      this.model = v;
    },
    model: function model (val) {
      var this$1 = this;

      clearTimeout(this.timer);
      if (this.value === val) {
        return
      }
      if (!val && val !== 0) {
        this.$emit('input', '');
        this.$emit('change', '');
        return
      }
      this.timer = setTimeout(function () {
        this$1.$emit('input', val);
        this$1.$emit('change', val);
      }, this.debounceValue);
    }
  },
  computed: {
    debounceValue: function debounceValue () {
      return this.childDebounce
        ? 0
        : this.debounce
    },
    controlBefore: function controlBefore () {
      return this.before || [{icon: this.icon, handler: this.focus}]
    },
    controlAfter: function controlAfter () {
      return this.after || [{
        icon: this.inverted ? 'clear' : 'cancel',
        content: true,
        handler: this.clearAndFocus
      }]
    }
  },
  methods: {
    clear: function clear () {
      if (!this.disable) {
        this.model = '';
      }
    },
    clearAndFocus: function clearAndFocus () {
      this.clear();
      this.focus();
    }
  },
  beforeDestroy: function beforeDestroy () {
    clearTimeout(this.timer);
  }
};

var QField = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-field row no-wrap items-start",class:{ 'q-field-floating': _vm.childHasLabel, 'q-field-no-label': !this.label && !this.$slots.label, 'q-field-with-error': _vm.hasError, 'q-field-dark': _vm.isDark }},[(_vm.icon)?_c('q-icon',{staticClass:"q-field-icon q-field-margin",attrs:{"name":_vm.icon}}):(_vm.insetIcon)?_c('div',{staticClass:"q-field-icon"}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"row col"},[(_vm.hasLabel)?_c('div',{staticClass:"q-field-label col-xs-12 q-field-margin",class:("col-sm-" + (_vm.labelWidth))},[_c('div',{staticClass:"q-field-label-inner row items-center"},[(_vm.label)?_c('span',{domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),_vm._t("label")],2)]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"q-field-content col-xs-12 col-sm"},[_vm._t("default"),_vm._v(" "),(_vm.hasBottom)?_c('div',{staticClass:"q-field-bottom row no-wrap",class:{'q-field-no-input': _vm.hasNoInput}},[(_vm.hasError && _vm.errorLabel)?_c('div',{staticClass:"q-field-error col",domProps:{"innerHTML":_vm._s(_vm.errorLabel)}}):(_vm.helper)?_c('div',{staticClass:"q-field-helper col",domProps:{"innerHTML":_vm._s(_vm.helper)}}):_c('div',{staticClass:"col"}),_vm._v(" "),(_vm.counter)?_c('div',{staticClass:"q-field-counter col-auto"},[_vm._v(_vm._s(_vm.counter))]):_vm._e()]):_vm._e()],2)])],1)},staticRenderFns: [],
  name: 'q-field',
  components: {
    QIcon: QIcon
  },
  props: {
    labelWidth: {
      type: Number,
      default: 5,
      validator: function validator (val) {
        return val >= 1 && val < 12
      }
    },
    inset: {
      type: String,
      validator: function validator (val) {
        return ['icon', 'label', 'full'].includes(val)
      }
    },
    label: String,
    count: {
      type: [Number, Boolean],
      default: false
    },
    error: Boolean,
    errorLabel: String,
    helper: String,
    icon: String,
    dark: Boolean
  },
  data: function data () {
    return {
      input: {}
    }
  },
  computed: {
    hasError: function hasError () {
      return this.input.error || this.error
    },
    hasBottom: function hasBottom () {
      return (this.hasError && this.errorLabel) || this.helper || this.count
    },
    hasLabel: function hasLabel () {
      return this.label || this.$slots.label || ['label', 'full'].includes(this.inset)
    },
    childHasLabel: function childHasLabel () {
      return this.input.floatLabel || this.input.stackLabel
    },
    isDark: function isDark () {
      return this.input.dark || this.dark
    },
    insetIcon: function insetIcon () {
      return ['icon', 'full'].includes(this.inset)
    },
    hasNoInput: function hasNoInput () {
      return !this.input.$options || this.input.__needsBottom
    },
    counter: function counter () {
      if (this.count) {
        var length = this.input.length || '0';
        return Number.isInteger(this.count)
          ? (length + " / " + (this.count))
          : length
      }
    }
  },
  provide: function provide () {
    return {
      __field: this
    }
  },
  methods: {
    __registerInput: function __registerInput (vm, needsBottom) {
      vm.__needsBottom = needsBottom;
      this.input = vm;
    },
    __unregisterInput: function __unregisterInput () {
      this.input = {};
    }
  }
};

var QFieldReset = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-field-reset',
  data: function data () {
    return {}
  },
  provide: function provide () {
    return {
      __field: undefined
    }
  }
};

var QRadio = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-radio q-option cursor-pointer no-outline q-focusable row inline no-wrap items-center",class:{disabled: _vm.disable, reverse: _vm.leftLabel},attrs:{"tabindex":"0"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.select($event);},"focus":function($event){_vm.$emit('focus');},"blur":function($event){_vm.$emit('blur');},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.select(false);}}},[_c('div',{staticClass:"q-option-inner relative-position",class:_vm.classes},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],attrs:{"type":"radio","disabled":_vm.disable},domProps:{"value":_vm.val,"checked":_vm._q(_vm.model,_vm.val)},on:{"click":function($event){$event.stopPropagation();},"change":[function($event){_vm.model=_vm.val;},_vm.__change]}}),_vm._v(" "),_c('div',{staticClass:"q-focus-helper"}),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('q-icon',{staticClass:"q-radio-unchecked absolute-full cursor-pointer",attrs:{"name":_vm.uncheckedIcon}}):_vm._e(),_vm._v(" "),_c('q-icon',{staticClass:"q-radio-checked cursor-pointer absolute-full",attrs:{"name":_vm.checkedIcon}}),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{ref:"ripple",staticClass:"q-radial-ripple"}):_vm._e()],1),_vm._v(" "),(_vm.label)?_c('span',{staticClass:"q-option-label",domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-radio',
  mixins: [OptionMixin],
  components: {
    QIcon: QIcon
  },
  props: {
    value: {
      required: true
    },
    val: {
      required: true
    },
    checkedIcon: {
      type: String,
      default: current === 'ios' ? 'check' : 'radio_button_checked'
    },
    uncheckedIcon: {
      type: String,
      default: 'radio_button_unchecked'
    }
  },
  computed: {
    model: {
      get: function get () {
        return this.value
      },
      set: function set$$1 (val) {
        if (val !== this.value) {
          this.$emit('input', val);
        }
      }
    },
    isActive: function isActive () {
      return this.model === this.val
    }
  },
  methods: {
    select: function select (withBlur) {
      if (withBlur !== false) {
        this.$el.blur();
      }

      if (!this.disable && this.model !== this.val) {
        this.model = this.val;
        this.__onChange(this.val);
      }
    },
    __change: function __change (e) {
      this.__onChange(this.value);
    },
    __onChange: function __onChange (val) {
      var ref = this.$refs.ripple;
      if (val && ref) {
        ref.classList.add('active');
        setTimeout(function () {
          ref.classList.remove('active');
        }, 10);
      }
      this.$emit('change', val);
    }
  }
};

function getDirection$1 (mod) {
  if (Object.keys(mod).length === 0) {
    return {
      left: true, right: true, up: true, down: true, horizontal: true, vertical: true
    }
  }

  var dir = {};['left', 'right', 'up', 'down', 'horizontal', 'vertical'].forEach(function (direction) {
    if (mod[direction]) {
      dir[direction] = true;
    }
  });
  if (dir.horizontal) {
    dir.left = dir.right = true;
  }
  if (dir.vertical) {
    dir.up = dir.down = true;
  }
  if (dir.left || dir.right) {
    dir.horizontal = true;
  }
  if (dir.up || dir.down) {
    dir.vertical = true;
  }

  return dir
}

function updateClasses$1 (el, dir) {
  el.classList.add('q-touch');

  if (dir.horizontal && !dir.vertical) {
    el.classList.add('q-touch-y');
    el.classList.remove('q-touch-x');
  }
  else if (!dir.horizontal && dir.vertical) {
    el.classList.add('q-touch-x');
    el.classList.remove('q-touch-y');
  }
}

var TouchSwipe = {
  name: 'touch-swipe',
  bind: function bind (el, binding) {
    var mouse = !binding.modifiers.nomouse;

    var ctx = {
      handler: binding.value,
      direction: getDirection$1(binding.modifiers),

      start: function start (evt) {
        var pos = position(evt);
        ctx.event = {
          x: pos.left,
          y: pos.top,
          time: new Date().getTime(),
          detected: false,
          prevent: ctx.direction.horizontal && ctx.direction.vertical
        };
        if (mouse) {
          document.addEventListener('mousemove', ctx.move);
          document.addEventListener('mouseup', ctx.end);
        }
      },
      move: function move (evt) {
        var
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          distY = pos.top - ctx.event.y;

        if (ctx.event.prevent) {
          evt.preventDefault();
          return
        }
        if (ctx.event.detected) {
          return
        }

        ctx.event.detected = true;
        if (ctx.direction.horizontal && !ctx.direction.vertical) {
          if (Math.abs(distX) > Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
        else {
          if (Math.abs(distX) < Math.abs(distY)) {
            evt.preventDefault();
            ctx.event.prevent = true;
          }
        }
      },
      end: function end (evt) {
        if (mouse) {
          document.removeEventListener('mousemove', ctx.move);
          document.removeEventListener('mouseup', ctx.end);
        }

        var
          direction,
          pos = position(evt),
          distX = pos.left - ctx.event.x,
          distY = pos.top - ctx.event.y;

        if (distX !== 0 || distY !== 0) {
          if (Math.abs(distX) >= Math.abs(distY)) {
            direction = distX < 0 ? 'left' : 'right';
          }
          else {
            direction = distY < 0 ? 'up' : 'down';
          }

          if (ctx.direction[direction]) {
            ctx.handler({
              evt: evt,
              direction: direction,
              duration: new Date().getTime() - ctx.event.time,
              distance: {
                x: Math.abs(distX),
                y: Math.abs(distY)
              }
            });
          }
        }
      }
    };

    el.__qtouchswipe = ctx;
    updateClasses$1(el, ctx.direction);
    if (mouse) {
      el.addEventListener('mousedown', ctx.start);
    }
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('touchmove', ctx.move);
    el.addEventListener('touchend', ctx.end);
  },
  update: function update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qtouchswipe.handler = binding.value;
    }
  },
  unbind: function unbind (el, binding) {
    var ctx = el.__qtouchswipe;
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('mousedown', ctx.start);
    el.removeEventListener('touchmove', ctx.move);
    el.removeEventListener('touchend', ctx.end);
    delete el.__qtouchswipe;
  }
};

var QToggle = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"touch-swipe",rawName:"v-touch-swipe.horizontal",value:(_vm.__swipe),expression:"__swipe",modifiers:{"horizontal":true}}],staticClass:"q-toggle q-option cursor-pointer no-outline q-focusable row inline no-wrap items-center",class:{disabled: _vm.disable, reverse: _vm.leftLabel},attrs:{"tabindex":"0"},on:{"click":function($event){$event.stopPropagation();$event.preventDefault();_vm.toggle($event);},"focus":function($event){_vm.$emit('focus');},"blur":function($event){_vm.$emit('blur');},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"space",32,$event.key)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }$event.preventDefault();_vm.toggle(false);}}},[_c('div',{staticClass:"q-option-inner relative-position",class:_vm.classes},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.model),expression:"model"}],attrs:{"type":"checkbox","disabled":_vm.disable},domProps:{"value":_vm.val,"checked":Array.isArray(_vm.model)?_vm._i(_vm.model,_vm.val)>-1:(_vm.model)},on:{"click":function($event){$event.stopPropagation();},"change":[function($event){var $$a=_vm.model,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=_vm.val,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(_vm.model=$$a.concat([$$v]));}else{$$i>-1&&(_vm.model=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.model=$$c;}},_vm.__change]}}),_vm._v(" "),_c('div',{staticClass:"q-focus-helper"}),_vm._v(" "),_c('div',{staticClass:"q-toggle-base"}),_vm._v(" "),_c('div',{staticClass:"q-toggle-handle shadow-1 row flex-center"},[(_vm.currentIcon)?_c('q-icon',{staticClass:"q-toggle-icon",attrs:{"name":_vm.currentIcon}}):_vm._e(),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{ref:"ripple",staticClass:"q-radial-ripple"}):_vm._e()],1)]),_vm._v(" "),(_vm.label)?_c('span',{staticClass:"q-option-label",domProps:{"innerHTML":_vm._s(_vm.label)}}):_vm._e(),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-toggle',
  components: {
    QIcon: QIcon
  },
  directives: {
    TouchSwipe: TouchSwipe
  },
  mixins: [Mixin, OptionMixin],
  props: {
    icon: String,
    checkedIcon: String,
    uncheckedIcon: String
  },
  computed: {
    currentIcon: function currentIcon () {
      return (this.isActive ? this.checkedIcon : this.uncheckedIcon) || this.icon
    }
  },
  methods: {
    __swipe: function __swipe (evt) {
      if (evt.direction === 'left') {
        this.unselect();
      }
      else if (evt.direction === 'right') {
        this.select();
      }
    }
  }
};

var SelectMixin = {
  components: {
    QIcon: QIcon,
    QInputFrame: QInputFrame,
    QChip: QChip
  },
  mixins: [FrameMixin],
  props: {
    value: {
      required: true
    },
    multiple: Boolean,
    toggle: Boolean,
    chips: Boolean,
    options: {
      type: Array,
      required: true,
      validator: function (v) { return v.every(function (o) { return 'label' in o && 'value' in o; }); }
    },
    frameColor: String,
    displayValue: String
  },
  data: function data () {
    return {
      terms: '',
      focused: false
    }
  },
  computed: {
    actualValue: function actualValue () {
      var this$1 = this;

      if (this.displayValue) {
        return this.displayValue
      }
      if (!this.multiple) {
        var opt$1 = this.options.find(function (opt) { return opt.value === this$1.value; });
        return opt$1 ? opt$1.label : ''
      }

      var opt = this.selectedOptions.map(function (opt) { return opt.label; });
      return opt.length ? opt.join(', ') : ''
    },
    selectedOptions: function selectedOptions () {
      var this$1 = this;

      if (this.multiple) {
        return this.options.filter(function (opt) { return this$1.value.includes(opt.value); })
      }
    },
    hasChips: function hasChips () {
      return this.multiple && this.chips
    },
    length: function length () {
      return this.multiple
        ? this.value.length
        : ([null, undefined, ''].includes(this.value) ? 0 : 1)
    },
    additionalLength: function additionalLength () {
      return this.displayValue && this.displayValue.length > 0
    }
  },
  methods: {
    __toggle: function __toggle (value) {
      var
        model = this.value,
        index = model.indexOf(value);

      if (index > -1) {
        model.splice(index, 1);
      }
      else {
        model.push(value);
      }

      this.$emit('change', model);
    }
  }
};

function defaultFilterFn (terms, obj) {
  return obj.label.toLowerCase().indexOf(terms) > -1
}

var QSelect = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input-frame',{ref:"input",staticClass:"q-select",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"disable":_vm.disable,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.frameColor || _vm.color,"focused":_vm.focused,"focusable":"","length":_vm.length,"additional-length":_vm.additionalLength},nativeOn:{"click":function($event){_vm.open($event);},"focus":function($event){_vm.__onFocus($event);},"blur":function($event){_vm.__onBlur($event);}}},[(_vm.hasChips)?_c('div',{staticClass:"col row items-center group q-input-chips",class:_vm.alignClass},_vm._l((_vm.selectedOptions),function(ref){
var label = ref.label;
var value = ref.value;
return _c('q-chip',{key:label,attrs:{"small":"","closable":!_vm.disable,"color":_vm.color},on:{"close":function($event){_vm.__toggle(value);}},nativeOn:{"click":function($event){$event.stopPropagation();}}},[_vm._v(" "+_vm._s(label)+" ")])})):_c('div',{staticClass:"col row items-center q-input-target",class:_vm.alignClass,domProps:{"innerHTML":_vm._s(_vm.actualValue)}}),_vm._v(" "),_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"arrow_drop_down"},slot:"after"}),_vm._v(" "),_c('q-popover',{ref:"popover",staticClass:"column no-wrap",attrs:{"fit":"","disable":_vm.disable,"offset":[0, 10],"anchor-click":false},on:{"open":_vm.__onFocus,"close":_vm.__onClose}},[_c('q-field-reset',[(_vm.filter)?_c('q-search',{ref:"filter",staticClass:"no-margin",staticStyle:{"min-height":"50px","padding":"10px"},attrs:{"placeholder":_vm.filterPlaceholder,"debounce":100,"color":_vm.color,"icon":"filter_list"},on:{"input":_vm.reposition},model:{value:(_vm.terms),callback:function ($$v) {_vm.terms=$$v;},expression:"terms"}}):_vm._e()],1),_vm._v(" "),_c('q-list',{staticClass:"no-border scroll",attrs:{"link":"","separator":_vm.separator}},[(_vm.multiple)?_vm._l((_vm.visibleOptions),function(opt){return _c('q-item-wrapper',{key:JSON.stringify(opt),attrs:{"cfg":opt,"slot-replace":""},on:{"!click":function($event){_vm.__toggle(opt.value);}}},[(_vm.toggle)?_c('q-toggle',{attrs:{"slot":"right","color":_vm.color,"value":_vm.optModel[opt.index]},slot:"right"}):_c('q-checkbox',{attrs:{"slot":"left","color":_vm.color,"value":_vm.optModel[opt.index]},slot:"left"})],1)}):_vm._l((_vm.visibleOptions),function(opt){return _c('q-item-wrapper',{key:JSON.stringify(opt),attrs:{"cfg":opt,"slot-replace":"","active":_vm.value === opt.value},on:{"!click":function($event){_vm.__select(opt.value);}}},[(_vm.radio)?_c('q-radio',{attrs:{"slot":"left","color":_vm.color,"value":_vm.value,"val":opt.value},slot:"left"}):_vm._e()],1)})],2)],1)],1)},staticRenderFns: [],
  name: 'q-select',
  mixins: [SelectMixin],
  components: {
    QFieldReset: QFieldReset,
    QSearch: QSearch,
    QPopover: QPopover,
    QList: QList,
    QItemWrapper: QItemWrapper,
    QCheckbox: QCheckbox,
    QRadio: QRadio,
    QToggle: QToggle
  },
  props: {
    filter: [Function, Boolean],
    filterPlaceholder: {
      type: String,
      default: 'Filter'
    },
    autofocusFilter: Boolean,
    radio: Boolean,
    placeholder: String,
    separator: Boolean
  },
  computed: {
    optModel: function optModel () {
      var this$1 = this;

      if (this.multiple) {
        return this.options.map(function (opt) { return this$1.value.includes(opt.value); })
      }
    },
    visibleOptions: function visibleOptions () {
      var this$1 = this;

      var opts = clone(this.options).map(function (opt, index) {
        opt.index = index;
        opt.value = this$1.options[index].value;
        return opt
      });
      if (this.filter && this.terms.length) {
        var lowerTerms = this.terms.toLowerCase();
        opts = opts.filter(function (opt) { return this$1.filterFn(lowerTerms, opt); });
      }
      return opts
    },
    filterFn: function filterFn () {
      return typeof this.filter === 'boolean'
        ? defaultFilterFn
        : this.filter
    },
    activeItemSelector: function activeItemSelector () {
      return this.multiple
        ? (".q-item-side > " + (this.toggle ? '.q-toggle' : '.q-checkbox') + " > .active")
        : ".q-item.active"
    }
  },
  methods: {
    open: function open (event) {
      if (!this.disable) {
        this.$refs.popover.open();
      }
    },
    close: function close () {
      this.$refs.popover.close();
    },
    reposition: function reposition () {
      var popover = this.$refs.popover;
      if (popover.opened) {
        popover.reposition();
      }
    },

    __onFocus: function __onFocus () {
      this.focused = true;
      if (this.filter && this.autofocusFilter) {
        this.$refs.filter.focus();
      }
      this.$emit('focus');
      var selected = this.$refs.popover.$el.querySelector(this.activeItemSelector);
      if (selected) {
        selected.scrollIntoView();
      }
    },
    __onBlur: function __onBlur (e) {
      var this$1 = this;

      this.__onClose();
      setTimeout(function () {
        var el = document.activeElement;
        if (el !== document.body && !this$1.$refs.popover.$el.contains(el)) {
          this$1.close();
        }
      }, 1);
    },
    __onClose: function __onClose () {
      this.focused = false;
      this.$emit('blur');
      this.terms = '';
    },
    __select: function __select (val) {
      if (this.value !== val) {
        this.$emit('input', val);
        this.$emit('change', val);
      }
      this.close();
    }
  }
};

var Modal = function (component) {
  return {
    create: function create (props) {
      var node = document.createElement('div');
      document.body.appendChild(node);

      var vm = new Vue({
        el: node,
        data: function data () {
          return {props: props}
        },
        render: function (h) { return h(component, {props: props}); }
      });

      return {
        vm: vm,
        close: function close (fn) {
          vm.quasarClose(fn);
        }
      }
    }
  }
};

var QOptionGroup = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-option-group group",class:{'q-option-group-inline-opts': _vm.inline}},_vm._l((_vm.options),function(opt,index){return _c('div',[_c(_vm.component,{tag:"component",attrs:{"val":opt.value,"disable":_vm.disable,"label":opt.label,"left-label":_vm.leftLabel,"color":opt.color || _vm.color,"checked-icon":opt.checkedIcon,"unchecked-icon":opt.uncheckedIcon},on:{"focus":_vm.__onFocus,"blur":_vm.__onBlur,"change":_vm.__onChange},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v;},expression:"model"}})],1)}))},staticRenderFns: [],
  name: 'q-option-group',
  components: {
    QRadio: QRadio,
    QCheckbox: QCheckbox,
    QToggle: QToggle
  },
  props: {
    value: {
      required: true
    },
    type: {
      default: 'radio',
      validator: function validator (val) {
        return ['radio', 'checkbox', 'toggle'].includes(val)
      }
    },
    color: String,
    options: {
      type: Array,
      validator: function validator (opts) {
        return opts.every(function (opt) { return 'value' in opt && 'label' in opt; })
      }
    },
    leftLabel: Boolean,
    inline: Boolean,
    disable: Boolean
  },
  inject: {
    __field: { default: null }
  },
  computed: {
    component: function component () {
      return ("q-" + (this.type))
    },
    model: {
      get: function get () {
        return this.value
      },
      set: function set (value) {
        this.$emit('input', value);
      }
    },
    length: function length () {
      return this.value
        ? (this.type === 'radio' ? 1 : this.value.length)
        : 0
    }
  },
  methods: {
    __onChange: function __onChange () {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.$emit('change', this$1.model);
      });
    },
    __onFocus: function __onFocus () {
      this.$emit('focus');
    },
    __onBlur: function __onBlur () {
      this.$emit('blur');
    }
  },
  created: function created () {
    var isArray = Array.isArray(this.value);
    if (this.type === 'radio') {
      if (isArray) {
        console.error('q-option-group: model should not be array');
      }
    }
    else if (!isArray) {
      console.error('q-option-group: model should be array in your case');
    }
    if (this.__field) {
      this.field = this.__field;
      this.field.__registerInput(this, true);
    }
  },
  beforeDestroy: function beforeDestroy () {
    if (this.__field) {
      this.field.__unregisterInput();
    }
  }
};

function getPercentage (event, dragging) {
  return between((position(event).left - dragging.left) / dragging.width, 0, 1)
}

function notDivides (res, decimals) {
  var number = decimals
    ? parseFloat(res.toFixed(decimals))
    : res;

  return number !== parseInt(number, 10)
}

function getModel (percentage, min, max, step, decimals) {
  var
    model = min + percentage * (max - min),
    modulo = (model - min) % step;

  model += (Math.abs(modulo) >= step / 2 ? (modulo < 0 ? -1 : 1) * step : 0) - modulo;

  if (decimals) {
    model = parseFloat(model.toFixed(decimals));
  }

  return between(model, min, max)
}

var mixin$1 = {
  components: {
    QChip: QChip
  },
  props: {
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 5
    },
    step: {
      type: Number,
      default: 1
    },
    decimals: {
      type: Number,
      default: 0
    },
    snap: Boolean,
    markers: Boolean,
    label: Boolean,
    labelAlways: Boolean,
    square: Boolean,
    color: String,
    fillHandleAlways: Boolean,
    error: Boolean,
    disable: Boolean
  },
  computed: {
    classes: function classes () {
      var cls = {
        disabled: this.disable,
        'label-always': this.labelAlways,
        'has-error': this.error
      };

      if (!this.error && this.color) {
        cls[("text-" + (this.color))] = true;
      }

      return cls
    },
    labelColor: function labelColor () {
      return this.error
        ? 'negative'
        : this.color || 'primary'
    }
  },
  methods: {
    __pan: function __pan (event) {
      if (this.disable) {
        return
      }
      if (event.isFinal) {
        this.__end(event.evt);
      }
      else if (event.isFirst) {
        this.__setActive(event.evt);
      }
      else if (this.dragging) {
        this.__update(event.evt);
      }
    },
    __click: function __click (event) {
      if (this.disable) {
        return
      }
      this.__setActive(event);
      this.__end(event);
    }
  },
  created: function created () {
    this.__validateProps();
  }
};

var QSlider = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__pan),expression:"__pan",modifiers:{"horizontal":true}}],staticClass:"q-slider non-selectable",class:_vm.classes,on:{"click":_vm.__click}},[_c('div',{ref:"handle",staticClass:"q-slider-handle-container"},[_c('div',{staticClass:"q-slider-track"}),_vm._v(" "),_vm._l((((_vm.max - _vm.min) / _vm.step + 1)),function(n){return (_vm.markers)?_c('div',{staticClass:"q-slider-mark",style:({left: (n - 1) * 100 * _vm.step / (_vm.max - _vm.min) + '%'})}):_vm._e()}),_vm._v(" "),_c('div',{staticClass:"q-slider-track active-track",class:{'no-transition': _vm.dragging, 'handle-at-minimum': _vm.value === _vm.min},style:({width: _vm.percentage})}),_vm._v(" "),_c('div',{staticClass:"q-slider-handle",class:{dragging: _vm.dragging, 'handle-at-minimum': !_vm.fillHandleAlways && _vm.value === _vm.min},style:({left: _vm.percentage, borderRadius: _vm.square ? '0' : '50%'})},[(_vm.label || _vm.labelAlways)?_c('q-chip',{staticClass:"q-slider-label no-pointer-events",class:{'label-always': _vm.labelAlways},attrs:{"pointing":"down","square":"","color":_vm.labelColor}},[_vm._v(" "+_vm._s(_vm.displayValue)+" ")]):_vm._e(),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{staticClass:"q-slider-ring"}):_vm._e()],1)],2)])},staticRenderFns: [],
  name: 'q-slider',
  directives: {
    TouchPan: TouchPan
  },
  mixins: [mixin$1],
  props: {
    value: {
      type: Number,
      required: true
    },
    labelValue: String
  },
  data: function data () {
    return {
      dragging: false,
      currentPercentage: (this.value - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentage: function percentage () {
      if (this.snap) {
        return (this.value - this.min) / (this.max - this.min) * 100 + '%'
      }
      return 100 * this.currentPercentage + '%'
    },
    displayValue: function displayValue () {
      return this.labelValue !== void 0
        ? this.labelValue
        : this.value
    }
  },
  watch: {
    value: function value (value$1) {
      if (this.dragging) {
        return
      }
      this.currentPercentage = (value$1 - this.min) / (this.max - this.min);
    },
    min: function min (value) {
      if (this.value < value) {
        this.value = value;
        return
      }
      this.$nextTick(this.__validateProps);
    },
    max: function max (value) {
      if (this.value > value) {
        this.value = value;
        return
      }
      this.$nextTick(this.__validateProps);
    },
    step: function step () {
      this.$nextTick(this.__validateProps);
    }
  },
  methods: {
    __setActive: function __setActive (event) {
      var container = this.$refs.handle;

      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: container.offsetWidth
      };
      this.__update(event);
    },
    __update: function __update (event) {
      var
        percentage = getPercentage(event, this.dragging),
        model = getModel(percentage, this.min, this.max, this.step, this.decimals);

      this.currentPercentage = percentage;
      if (model !== this.value) {
        this.$emit('input', model);
        this.$emit('change', model);
      }
    },
    __end: function __end () {
      this.dragging = false;
      this.currentPercentage = (this.value - this.min) / (this.max - this.min);
    },
    __validateProps: function __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max);
      }
      else if (notDivides((this.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of max - min', this.min, this.max, this.step, this.decimals);
      }
    }
  }
};

var dragType = {
  MIN: 0,
  RANGE: 1,
  MAX: 2
};

var QRange = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__pan),expression:"__pan",modifiers:{"horizontal":true}}],staticClass:"q-slider non-selectable",class:_vm.classes,on:{"click":_vm.__click}},[_c('div',{ref:"handle",staticClass:"q-slider-handle-container"},[_c('div',{staticClass:"q-slider-track"}),_vm._v(" "),_vm._l((((_vm.max - _vm.min) / _vm.step + 1)),function(n){return (_vm.markers)?_c('div',{staticClass:"q-slider-mark",style:({left: (n - 1) * 100 * _vm.step / (_vm.max - _vm.min) + '%'})}):_vm._e()}),_vm._v(" "),_c('div',{staticClass:"q-slider-track active-track",class:{dragging: _vm.dragging, 'track-draggable': _vm.dragRange || _vm.dragOnlyRange},style:({left: ((_vm.percentageMin * 100) + "%"), width: _vm.activeTrackWidth})}),_vm._v(" "),_c('div',{ref:"handleMin",staticClass:"q-slider-handle q-slider-handle-min",class:{dragging: _vm.dragging, 'handle-at-minimum': !_vm.fillHandleAlways && _vm.value.min === _vm.min},style:({left: ((_vm.percentageMin * 100) + "%"), borderRadius: _vm.square ? '0' : '50%'})},[(_vm.label || _vm.labelAlways)?_c('q-chip',{staticClass:"q-slider-label no-pointer-events",class:{'label-always': _vm.labelAlways},attrs:{"pointing":"down","square":"","color":_vm.leftTooltipColor}},[_vm._v(" "+_vm._s(_vm.leftDisplayValue)+" ")]):_vm._e(),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{staticClass:"q-slider-ring"}):_vm._e()],1),_vm._v(" "),_c('div',{staticClass:"q-slider-handle q-slider-handle-max",class:{dragging: _vm.dragging, 'handle-at-maximum': _vm.value.max === _vm.max},style:({left: ((_vm.percentageMax * 100) + "%"), borderRadius: _vm.square ? '0' : '50%'})},[(_vm.label || _vm.labelAlways)?_c('q-chip',{staticClass:"q-slider-label no-pointer-events",class:{'label-always': _vm.labelAlways},attrs:{"pointing":"down","square":"","color":_vm.rightTooltipColor}},[_vm._v(" "+_vm._s(_vm.rightDisplayValue)+" ")]):_vm._e(),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{staticClass:"q-slider-ring"}):_vm._e()],1)],2)])},staticRenderFns: [],
  name: 'q-range',
  directives: {
    TouchPan: TouchPan
  },
  mixins: [mixin$1],
  props: {
    value: {
      type: Object,
      required: true,
      validator: function validator (value) {
        return typeof value.min !== 'undefined' && typeof value.max !== 'undefined'
      }
    },
    dragRange: Boolean,
    dragOnlyRange: Boolean,
    leftLabelColor: String,
    leftLabelValue: String,
    rightLabelColor: String,
    rightLabelValue: String
  },
  data: function data () {
    return {
      dragging: false,
      currentMinPercentage: (this.value.min - this.min) / (this.max - this.min),
      currentMaxPercentage: (this.value.max - this.min) / (this.max - this.min)
    }
  },
  computed: {
    percentageMin: function percentageMin () {
      return this.snap ? (this.value.min - this.min) / (this.max - this.min) : this.currentMinPercentage
    },
    percentageMax: function percentageMax () {
      return this.snap ? (this.value.max - this.min) / (this.max - this.min) : this.currentMaxPercentage
    },
    activeTrackWidth: function activeTrackWidth () {
      return 100 * (this.percentageMax - this.percentageMin) + '%'
    },
    leftDisplayValue: function leftDisplayValue () {
      return this.leftLabelValue !== void 0
        ? this.leftLabelValue
        : this.value.min
    },
    rightDisplayValue: function rightDisplayValue () {
      return this.rightLabelValue !== void 0
        ? this.rightLabelValue
        : this.value.max
    },
    leftTooltipColor: function leftTooltipColor () {
      return this.leftLabelColor || this.labelColor
    },
    rightTooltipColor: function rightTooltipColor () {
      return this.rightLabelColor || this.labelColor
    }
  },
  watch: {
    'value.min': function value_min (value) {
      if (this.dragging) {
        return
      }
      if (value > this.value.max) {
        value = this.value.max;
      }
      this.currentMinPercentage = (value - this.min) / (this.max - this.min);
    },
    'value.max': function value_max (value) {
      if (this.dragging) {
        return
      }
      if (value < this.value.min) {
        value = this.value.min;
      }
      this.currentMaxPercentage = (value - this.min) / (this.max - this.min);
    },
    min: function min (value) {
      if (this.value.min < value) {
        this.__update({min: value});
      }
      if (this.value.max < value) {
        this.__update({max: value});
      }
      this.$nextTick(this.__validateProps);
    },
    max: function max (value) {
      if (this.value.min > value) {
        this.__update({min: value});
      }
      if (this.value.max > value) {
        this.__update({max: value});
      }
      this.$nextTick(this.__validateProps);
    },
    step: function step () {
      this.$nextTick(this.__validateProps);
    }
  },
  methods: {
    __setActive: function __setActive (event) {
      var
        container = this.$refs.handle,
        width = container.offsetWidth,
        sensitivity = (this.dragOnlyRange ? -1 : 1) * this.$refs.handleMin.offsetWidth / (2 * width);

      this.dragging = {
        left: container.getBoundingClientRect().left,
        width: width,
        valueMin: this.value.min,
        valueMax: this.value.max,
        percentageMin: this.currentMinPercentage,
        percentageMax: this.currentMaxPercentage
      };

      var
        percentage = getPercentage(event, this.dragging),
        type;

      if (percentage < this.currentMinPercentage + sensitivity) {
        type = dragType.MIN;
      }
      else if (percentage < this.currentMaxPercentage - sensitivity) {
        if (this.dragRange || this.dragOnlyRange) {
          type = dragType.RANGE;
          extend(this.dragging, {
            offsetPercentage: percentage,
            offsetModel: getModel(percentage, this.min, this.max, this.step, this.decimals),
            rangeValue: this.dragging.valueMax - this.dragging.valueMin,
            rangePercentage: this.currentMaxPercentage - this.currentMinPercentage
          });
        }
        else {
          type = this.currentMaxPercentage - percentage < percentage - this.currentMinPercentage
            ? dragType.MAX
            : dragType.MIN;
        }
      }
      else {
        type = dragType.MAX;
      }

      if (this.dragOnlyRange && type !== dragType.RANGE) {
        this.dragging = false;
        return
      }

      this.dragging.type = type;
      this.__update(event);
    },
    __update: function __update (event) {
      var
        percentage = getPercentage(event, this.dragging),
        model = getModel(percentage, this.min, this.max, this.step, this.decimals),
        pos;

      switch (this.dragging.type) {
        case dragType.MIN:
          if (percentage <= this.dragging.percentageMax) {
            pos = {
              minP: percentage,
              maxP: this.dragging.percentageMax,
              min: model,
              max: this.dragging.valueMax
            };
          }
          else {
            pos = {
              minP: this.dragging.percentageMax,
              maxP: percentage,
              min: this.dragging.valueMax,
              max: model
            };
          }
          break

        case dragType.MAX:
          if (percentage >= this.dragging.percentageMin) {
            pos = {
              minP: this.dragging.percentageMin,
              maxP: percentage,
              min: this.dragging.valueMin,
              max: model
            };
          }
          else {
            pos = {
              minP: percentage,
              maxP: this.dragging.percentageMin,
              min: model,
              max: this.dragging.valueMin
            };
          }
          break

        case dragType.RANGE:
          var
            percentageDelta = percentage - this.dragging.offsetPercentage,
            minP = between(this.dragging.percentageMin + percentageDelta, 0, 1 - this.dragging.rangePercentage),
            modelDelta = model - this.dragging.offsetModel,
            min = between(this.dragging.valueMin + modelDelta, this.min, this.max - this.dragging.rangeValue);

          pos = {
            minP: minP,
            maxP: minP + this.dragging.rangePercentage,
            min: min,
            max: min + this.dragging.rangeValue
          };
          break
      }

      this.currentMinPercentage = pos.minP;
      this.currentMaxPercentage = pos.maxP;
      this.__updateInput(pos);
    },
    __end: function __end () {
      this.dragging = false;
      this.currentMinPercentage = (this.value.min - this.min) / (this.max - this.min);
      this.currentMaxPercentage = (this.value.max - this.min) / (this.max - this.min);
    },
    __updateInput: function __updateInput (ref) {
      var min = ref.min; if ( min === void 0 ) min = this.value.min;
      var max = ref.max; if ( max === void 0 ) max = this.value.max;

      var val = {min: min, max: max};
      if (this.value.min !== min || this.value.max !== max) {
        this.$emit('input', val);
        this.$emit('change', val);
      }
    },
    __validateProps: function __validateProps () {
      if (this.min >= this.max) {
        console.error('Range error: min >= max', this.$el, this.min, this.max);
      }
      else if (notDivides((this.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of max - min', this.min, this.max, this.step);
      }
      else if (notDivides((this.value.min - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of initial value.min - min', this.value.min, this.min, this.step);
      }
      else if (notDivides((this.value.max - this.min) / this.step, this.decimals)) {
        console.error('Range error: step must be a divisor of initial value.max - min', this.value.max, this.max, this.step);
      }
    }
  }
};

var QRating = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-rating row inline items-center no-wrap",class:( obj = { disabled: _vm.disable, editable: _vm.editable }, obj[("text-" + (_vm.color))] = _vm.color, obj ),style:(_vm.size ? ("font-size: " + (_vm.size)) : '')},_vm._l((_vm.max),function(index){return _c('q-icon',{key:index,class:{ active: (!_vm.mouseModel && _vm.model >= index) || (_vm.mouseModel && _vm.mouseModel >= index), exselected: _vm.mouseModel && _vm.model >= index && _vm.mouseModel < index, hovered: _vm.mouseModel === index },attrs:{"name":_vm.icon},on:{"click":function($event){_vm.set(index);},"mouseover":function($event){_vm.__setHoverValue(index);},"mouseout":function($event){_vm.mouseModel = 0;}}})}))
var obj;},staticRenderFns: [],
  name: 'q-rating',
  components: {
    QIcon: QIcon
  },
  props: {
    value: {
      type: Number,
      default: 0,
      required: true
    },
    max: {
      type: Number,
      default: 5
    },
    icon: {
      type: String,
      default: 'grade'
    },
    color: String,
    size: String,
    readonly: Boolean,
    disable: Boolean
  },
  data: function data () {
    return {
      mouseModel: 0
    }
  },
  computed: {
    model: {
      get: function get () {
        return this.value
      },
      set: function set (val) {
        if (this.value !== val) {
          this.$emit('input', val);
          this.$emit('change', val);
        }
      }
    },
    editable: function editable () {
      return !this.readonly && !this.disable
    }
  },
  methods: {
    set: function set (value) {
      if (this.editable) {
        this.model = between(parseInt(value, 10), 1, this.max);
        this.mouseModel = 0;
      }
    },
    __setHoverValue: function __setHoverValue (value) {
      if (this.editable) {
        this.mouseModel = value;
      }
    }
  }
};

function width$1 (val) {
  return {width: (val + "%")}
}

var QProgress = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-progress",class:_vm.color ? ("text-" + (_vm.color)) : ''},[(_vm.buffer && !_vm.indeterminate)?_c('div',{staticClass:"q-progress-buffer",style:(_vm.bufferStyle)},[_vm._v(" ")]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"q-progress-track",style:(_vm.trackStyle)},[_vm._v(" ")]),_vm._v(" "),_c('div',{staticClass:"q-progress-model",class:{ animate: _vm.animate, stripe: _vm.stripe, indeterminate: _vm.indeterminate },style:(_vm.modelStyle)},[_vm._v(" ")])])},staticRenderFns: [],
  name: 'q-progress',
  props: {
    percentage: {
      type: Number,
      default: 0
    },
    color: String,
    stripe: Boolean,
    animate: Boolean,
    indeterminate: Boolean,
    buffer: Number
  },
  computed: {
    model: function model () {
      return between(this.percentage, 0, 100)
    },
    bufferModel: function bufferModel () {
      return between(this.buffer || 0, 0, 100 - this.model)
    },
    modelStyle: function modelStyle () {
      return width$1(this.model)
    },
    bufferStyle: function bufferStyle () {
      return width$1(this.bufferModel)
    },
    trackStyle: function trackStyle () {
      return width$1(this.buffer ? 100 - this.buffer : 100)
    }
  }
};

var Dialog$1 = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-modal',{ref:"dialog",attrs:{"minimized":"","no-backdrop-dismiss":_vm.noBackdropDismiss,"no-esc-dismiss":_vm.noEscDismiss,"position":_vm.position},on:{"close":function($event){_vm.__dismiss();}}},[(_vm.title)?_c('div',{staticClass:"modal-header",domProps:{"innerHTML":_vm._s(_vm.title)}}):_vm._e(),_vm._v(" "),(_vm.message)?_c('div',{staticClass:"modal-body modal-scroll",domProps:{"innerHTML":_vm._s(_vm.message)}}):_vm._e(),_vm._v(" "),(_vm.form)?_c('div',{staticClass:"modal-body modal-scroll"},[_vm._l((_vm.form),function(el){return [(el.type === 'heading')?_c('h6',{domProps:{"innerHTML":_vm._s(el.label)}}):_vm._e(),_vm._v(" "),(_vm.__isInputType(el.type))?_c('q-input',{staticStyle:{"margin-bottom":"10px"},attrs:{"type":el.type,"color":el.color,"placeholder":el.placeholder,"float-label":el.label,"no-pass-toggle":el.noPassToggle},model:{value:(el.model),callback:function ($$v) {_vm.$set(el, "model", $$v);},expression:"el.model"}}):(el.type === 'chips')?_c('q-chips-input',{attrs:{"color":el.color,"float-label":el.label},model:{value:(el.model),callback:function ($$v) {_vm.$set(el, "model", $$v);},expression:"el.model"}}):(['radio', 'checkbox', 'toggle'].includes(el.type))?_c('q-option-group',{attrs:{"type":el.type,"color":el.color,"options":el.items,"inline":el.inline},model:{value:(el.model),callback:function ($$v) {_vm.$set(el, "model", $$v);},expression:"el.model"}}):_vm._e(),_vm._v(" "),(el.type === 'slider' || el.type === 'range')?_c('div',{staticStyle:{"margin-top":"15px","margin-bottom":"10px"}},[_c('label',{domProps:{"innerHTML":_vm._s(el.label + ' (' + (el.type === 'range' ? el.model.min + ' to ' + el.model.max : el.model) + ')')}}),_vm._v(" "),_c('q-' + el.type,{tag:"component",staticClass:"with-padding",attrs:{"min":el.min,"max":el.max,"step":el.step,"label":el.withLabel,"label-always":el.labelAlways,"markers":el.markers,"snap":el.snap,"square":el.square,"color":el.color},model:{value:(el.model),callback:function ($$v) {_vm.$set(el, "model", $$v);},expression:"el.model"}})],1):_vm._e(),_vm._v(" "),(el.type === 'rating')?_c('div',{staticStyle:{"margin-bottom":"10px"}},[_c('label',{staticClass:"block",domProps:{"innerHTML":_vm._s(el.label)}}),_vm._v(" "),_c('q-rating',{style:({fontSize: el.size || '2rem'}),attrs:{"max":el.max,"icon":el.icon,"color":el.color},model:{value:(el.model),callback:function ($$v) {_vm.$set(el, "model", $$v);},expression:"el.model"}})],1):_vm._e()]})],2):_vm._e(),_vm._v(" "),(_vm.progress)?_c('div',{staticClass:"modal-body"},[_c('q-progress',{attrs:{"percentage":_vm.progress.model,"color":"progress.color || primary","animate":"","stripe":"","indeterminate":_vm.progress.indeterminate}}),_vm._v(" "),(!_vm.progress.indeterminate)?_c('span',[_vm._v(" "+_vm._s(_vm.progress.model)+" % ")]):_vm._e()],1):_vm._e(),_vm._v(" "),(_vm.buttons)?_c('div',{staticClass:"modal-buttons",class:{row: !_vm.stackButtons, column: _vm.stackButtons}},_vm._l((_vm.buttons),function(button,index){return _c('q-btn',{key:index,class:button.classes,style:(button.style),attrs:{"color":button.color,"flat":button.flat || !button.raised && !button.push && !button.outline && !button.rounded,"push":button.push,"rounded":button.rounded,"outline":button.outline},on:{"click":function($event){_vm.trigger(button.handler, button.preventClose);}}},[_c('span',{domProps:{"innerHTML":_vm._s(typeof button === 'string' ? button : button.label)}})])})):_vm._e(),_vm._v(" "),(!_vm.buttons && !_vm.noButtons)?_c('div',{staticClass:"modal-buttons row"},[_c('q-btn',{attrs:{"flat":""},on:{"click":function($event){_vm.close();}}},[_vm._v("OK")])],1):_vm._e()])},staticRenderFns: [],
  name: 'q-dialog',
  components: {
    QModal: QModal,
    QInput: QInput,
    QChipsInput: QChipsInput,
    QOptionGroup: QOptionGroup,
    QSlider: QSlider,
    QRange: QRange,
    QRating: QRating,
    QProgress: QProgress,
    QBtn: QBtn
  },
  props: {
    title: String,
    message: String,
    form: Object,
    stackButtons: Boolean,
    buttons: Array,
    noButtons: Boolean,
    progress: Object,
    onDismiss: Function,
    noBackdropDismiss: Boolean,
    noEscDismiss: Boolean,
    position: String
  },
  computed: {
    opened: function opened () {
      if (this.$refs.dialog) {
        return this.$refs.dialog.active
      }
    }
  },
  methods: {
    trigger: function trigger (handler, preventClose) {
      var this$1 = this;

      var handlerFn = typeof handler === 'function';
      if (!handlerFn) {
        this.close();
        return
      }

      if (preventClose) {
        handler(this.getFormData(), this.close);
      }
      else {
        this.close(function () { handler(this$1.getFormData()); });
      }
    },
    getFormData: function getFormData () {
      var this$1 = this;

      if (!this.form) {
        return
      }

      var data = {};

      Object.keys(this.form).forEach(function (name) {
        var el = this$1.form[name];
        if (el.type !== 'heading') {
          data[name] = el.model;
        }
      });

      return data
    },
    close: function close (fn) {
      if (!this.opened) {
        return
      }
      this.$refs.dialog.close(function () {
        if (typeof fn === 'function') {
          fn();
        }
      });
    },
    __isInputType: function __isInputType (type) {
      return inputTypes.includes(type)
    },
    __dismiss: function __dismiss () {
      this.$root.$destroy();
      if (typeof this.onDismiss === 'function') {
        this.onDismiss();
      }
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$refs.dialog.open(function () {
      if (!this$1.$q.platform.is.desktop) {
        return
      }

      var node = this$1.$refs.dialog.$el.getElementsByTagName(this$1.form ? 'INPUT' : 'BUTTON');
      if (!node.length) {
        return
      }

      if (this$1.form) {
        node[0].focus();
      }
      else {
        node[node.length - 1].focus();
      }
    });
    this.$root.quasarClose = this.close;
  }
};

var Dialog = Modal(Dialog$1);

var QDialogSelect = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input-frame',{ref:"input",staticClass:"q-select",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"disable":_vm.disable,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.frameColor || _vm.color,"focused":_vm.focused,"focusable":"","length":_vm.length,"additional-length":_vm.additionalLength},nativeOn:{"click":function($event){_vm.pick($event);},"focus":function($event){_vm.__onFocus($event);},"blur":function($event){_vm.__onBlur($event);}}},[(_vm.hasChips)?_c('div',{staticClass:"col row items-center group q-input-chips",class:_vm.alignClass},_vm._l((_vm.selectedOptions),function(ref){
var label = ref.label;
var value = ref.value;
return _c('q-chip',{key:label,attrs:{"small":"","closable":!_vm.disable,"color":_vm.color},on:{"close":function($event){_vm.__toggle(value);}},nativeOn:{"click":function($event){$event.stopPropagation();}}},[_vm._v(" "+_vm._s(label)+" ")])})):_c('div',{staticClass:"col row items-center q-input-target",class:_vm.alignClass,domProps:{"innerHTML":_vm._s(_vm.actualValue)}}),_vm._v(" "),_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"arrow_drop_down"},slot:"after"})],1)},staticRenderFns: [],
  name: 'q-dialog-select',
  mixins: [SelectMixin],
  props: {
    okLabel: {
      type: String,
      default: 'OK'
    },
    cancelLabel: {
      type: String,
      default: 'Cancel'
    },
    title: {
      type: String,
      default: 'Select'
    },
    message: String
  },
  data: function data () {
    return {
      focused: false
    }
  },
  computed: {
    type: function type () {
      return this.multiple
        ? (this.toggle ? 'toggle' : 'checkbox')
        : 'radio'
    }
  },
  methods: {
    pick: function pick () {
      var this$1 = this;

      if (this.disable) {
        return
      }

      this.dialog = Dialog.create({
        title: this.title,
        message: this.message,
        onDismiss: function () {
          this$1.dialog = null;
        },
        form: {
          select: {
            type: this.type,
            model: clone(this.value),
            color: this.color,
            items: this.options
          }
        },
        buttons: [
          {
            label: this.cancelLabel,
            color: this.color
          },
          {
            label: this.okLabel,
            color: this.color,
            handler: function (data) {
              if (JSON.stringify(this$1.value) !== JSON.stringify(data.select)) {
                this$1.$emit('input', data.select);
                this$1.$emit('change', data.select);
              }
            }
          }
        ]
      });
    },
    close: function close () {
      if (this.dialog) {
        this.dialog.close();
      }
    },

    __onFocus: function __onFocus () {
      this.focused = true;
      this.$emit('focus');
    },
    __onBlur: function __onBlur (e) {
      this.focused = false;
      this.$emit('blur');
    }
  }
};

var TableFilter = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-data-table-toolbar upper-toolbar row col items-center"},[_c('q-search',{staticClass:"col",attrs:{"placeholder":_vm.labels.search},model:{value:(_vm.filtering.terms),callback:function ($$v) {_vm.$set(_vm.filtering, "terms", $$v);},expression:"filtering.terms"}}),_vm._v(" "),_c('q-select',{staticClass:"no-margin text-right",attrs:{"options":_vm.filterFields,"simple":""},model:{value:(_vm.filtering.field),callback:function ($$v) {_vm.$set(_vm.filtering, "field", $$v);},expression:"filtering.field"}})],1)},staticRenderFns: [],
  name: 'q-table-filter',
  components: {
    QSearch: QSearch,
    QSelect: QSelect
  },
  props: ['filtering', 'columns', 'labels'],
  computed: {
    filterFields: function filterFields () {
      var cols = this.columns.map(function (col) {
        return {
          label: col.label,
          value: col.field
        }
      });

      return [{label: this.labels.allCols, value: ''}].concat(cols)
    }
  }
};

var Filter = {
  data: function data () {
    return {
      filtering: {
        field: '',
        terms: ''
      }
    }
  },
  watch: {
    'filtering.terms': function filtering_terms () {
      this.resetBody();
    }
  },
  computed: {
    filteringCols: function filteringCols () {
      return this.cols.filter(function (col) { return col.filter; })
    }
  },
  methods: {
    filter: function filter (rows) {
      var this$1 = this;

      var
        field = this.filtering.field,
        terms = this.filtering.terms.toLowerCase();

      if (field) {
        return rows.filter(function (row) { return (row[field] + '').toLowerCase().indexOf(terms) > -1; })
      }

      return rows.filter(function (row) {
        return this$1.filteringCols.some(function (col) { return (row[col.field] + '').toLowerCase().indexOf(terms) > -1; })
      })
    }
  },
  components: {
    TableFilter: TableFilter
  }
};

var labels = {
  columns: 'Columns',
  allCols: 'All Columns',
  rows: 'Rows',
  selected: {
    singular: 'item selected.',
    plural: 'items selected.'
  },
  clear: 'Clear',
  search: 'Search',
  all: 'All'
};

var I18n = {
  computed: {
    labels: function labels$1 () {
      if (this.config && this.config.labels) {
        return extend({}, labels, this.config.labels)
      }
      return labels
    },
    message: function message () {
      if (this.rows.length) {
        return false
      }

      if (this.filtering.terms) {
        return (this.config.messages && this.config.messages.noDataAfterFiltering) || '<i class="material-icons">warning</i> No results. Please refine your search terms.'
      }

      return (this.config.messages && this.config.messages.noData) || '<i class="material-icons">warning</i> No data available to show.'
    }
  }
};

var QPagination = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-pagination",class:{disabled: _vm.disable}},[_c('q-btn',{attrs:{"disable":_vm.value === _vm.min,"color":_vm.color,"flat":"","small":""},on:{"click":function($event){_vm.set(_vm.min);}}},[_c('q-icon',{attrs:{"name":"first_page"}})],1),_vm._v(" "),_c('q-btn',{attrs:{"disable":_vm.value === _vm.min,"color":_vm.color,"flat":"","small":""},on:{"click":function($event){_vm.setByOffset(-1);}}},[_c('q-icon',{attrs:{"name":"keyboard_arrow_left"}})],1),_vm._v(" "),_c('q-input',{ref:"input",staticClass:"inline",style:({width: ((_vm.inputPlaceholder.length) + "rem")}),attrs:{"type":"number","min":_vm.min,"max":_vm.max,"color":_vm.color,"placeholder":_vm.inputPlaceholder,"disable":_vm.disable},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.__update($event);},"blur":_vm.__update},model:{value:(_vm.newPage),callback:function ($$v) {_vm.newPage=$$v;},expression:"newPage"}}),_vm._v(" "),_c('q-btn',{attrs:{"disable":_vm.value === _vm.max,"color":_vm.color,"flat":"","small":""},on:{"click":function($event){_vm.setByOffset(1);}}},[_c('q-icon',{attrs:{"name":"keyboard_arrow_right"}})],1),_vm._v(" "),_c('q-btn',{attrs:{"disable":_vm.value === _vm.max,"color":_vm.color,"flat":"","small":""},on:{"click":function($event){_vm.set(_vm.max);}}},[_c('q-icon',{attrs:{"name":"last_page"}})],1)],1)},staticRenderFns: [],
  name: 'q-pagination',
  components: {
    QBtn: QBtn,
    QInput: QInput,
    QIcon: QIcon
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      default: 'primary'
    },
    disable: Boolean
  },
  data: function data () {
    return {
      newPage: ''
    }
  },
  methods: {
    set: function set (value) {
      if (!this.disable) {
        this.model = value;
      }
    },
    setByOffset: function setByOffset (offset) {
      if (!this.disable) {
        this.model = this.value + offset;
      }
    },
    __normalize: function __normalize (value) {
      return between(parseInt(value, 10), 1, this.max)
    },
    __update: function __update () {
      var parsed = parseInt(this.newPage, 10);
      if (parsed) {
        this.model = parsed;
      }

      this.newPage = '';
    }
  },
  computed: {
    model: {
      get: function get () {
        return this.value
      },
      set: function set (value) {
        if (!value) {
          return
        }
        if (value < this.min || value > this.max) {
          return
        }
        if (this.value !== value) {
          this.$emit('input', value);
          this.$emit('change', value);
        }
      }
    },
    inputPlaceholder: function inputPlaceholder () {
      return this.value + ' / ' + this.max
    }
  }
};

var TablePagination = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-data-table-toolbar bottom-toolbar row reverse-wrap items-center justify-end"},[_c('div',[_c('span',{staticClass:"q-data-table-row-label"},[_vm._v(_vm._s(_vm.labels.rows))]),_vm._v(" "),_c('q-select',{staticClass:"inline no-margin",attrs:{"options":_vm.pagination.options,"align":"right","simple":""},on:{"input":_vm.resetPage},model:{value:(_vm.pagination.rowsPerPage),callback:function ($$v) {_vm.$set(_vm.pagination, "rowsPerPage", $$v);},expression:"pagination.rowsPerPage"}})],1),_vm._v(" "),(_vm.entries > 0)?_c('div',[_vm._v(" "+_vm._s(_vm.start)+" - "+_vm._s(_vm.end)+" / "+_vm._s(_vm.entries)+" ")]):_vm._e(),_vm._v(" "),(_vm.pagination.rowsPerPage > 0)?_c('q-pagination',{attrs:{"max":_vm.max},model:{value:(_vm.pagination.page),callback:function ($$v) {_vm.$set(_vm.pagination, "page", $$v);},expression:"pagination.page"}}):_vm._e()],1)},staticRenderFns: [],
  name: 'q-table-pagination',
  components: {
    QSelect: QSelect,
    QPagination: QPagination
  },
  props: ['pagination', 'entries', 'labels'],
  watch: {
    entries: function entries () {
      this.resetPage();
    }
  },
  computed: {
    start: function start () {
      return (this.pagination.page - 1) * this.pagination.rowsPerPage + 1
    },
    end: function end () {
      if (this.pagination.page === this.max || this.pagination.rowsPerPage === 0) {
        return this.entries
      }
      return this.pagination.page * this.pagination.rowsPerPage
    },
    max: function max () {
      return Math.max(1, Math.ceil(this.entries / this.pagination.rowsPerPage))
    }
  },
  methods: {
    resetPage: function resetPage () {
      this.pagination.page = 1;
    }
  }
};

var defaultOptions = [
  { label: 'All', value: 0 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
];

function parseOptions (opts) {
  return [{ label: 'All', value: 0 }].concat(
    opts.map(function (opt) {
      return {
        label: '' + opt,
        value: Number(opt)
      }
    })
  )
}

var Pagination = {
  data: function data () {
    return {
      _pagination: {
        page: 1,
        entries: 0,
        rowsPerPage: null
      }
    }
  },
  computed: {
    pagination: function pagination () {
      var self = this,
        cfg = this.config.pagination,
        options = defaultOptions;

      if (cfg) {
        if (cfg.options) {
          options = parseOptions(cfg.options);
        }
      }

      options[0].label = this.labels.all;

      return {
        get page () { return self.$data._pagination.page },
        set page (page) { self.$data._pagination.page = page; },
        get entries () { return self.$data._pagination.entries },
        set entries (entries) { self.$data._pagination.entries = entries; },
        get rowsPerPage () {
          var rowsPerPage = self.$data._pagination.rowsPerPage;
          if (rowsPerPage == null) {
            if (cfg && typeof cfg.rowsPerPage !== 'undefined') {
              rowsPerPage = cfg.rowsPerPage;
            }
            else {
              rowsPerPage = 0;
            }
          }
          return rowsPerPage
        },
        set rowsPerPage (rowsPerPage) { self.$data._pagination.rowsPerPage = rowsPerPage; },
        options: options
      }
    }
  },
  watch: {
    'pagination.page': function pagination_page () {
      this.$refs.body.scrollTop = 0;
    }
  },
  methods: {
    paginate: function paginate (rows) {
      var
        page = this.pagination.page,
        number = this.pagination.rowsPerPage;

      if (number <= 0) {
        return rows
      }
      return rows.slice((page - 1) * number, page * number)
    }
  },
  components: {
    TablePagination: TablePagination
  }
};

var Responsive = {
  data: function data () {
    return {
      responsive: false
    }
  },
  methods: {
    handleResponsive: function handleResponsive () {
      if (typeof this.config.responsive !== 'undefined') {
        if (!this.config.responsive) {
          this.responsive = false;
          return
        }
      }
      this.responsive = viewport().width <= 600;
    }
  },
  watch: {
    'config.responsive': function config_responsive () {
      this.$nextTick(this.handleResponsive);
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.handleResponsive();
      window.addEventListener('resize', this$1.handleResponsive);
    });
  },
  beforeDestroy: function beforeDestroy () {
    window.removeEventListener('resize', this.handleResponsive);
  }
};

function getRowSelection (rows, selection, multiple) {
  if (!selection) {
    return []
  }
  return multiple ? rows.map(function () { return false; }) : [-1]
}

var RowSelection = {
  data: function data () {
    return {
      rowSelection: []
    }
  },
  created: function created () {
    this.rowSelection = getRowSelection(this.rows, this.config.selection, this.multipleSelection);
  },
  watch: {
    'config.selection': function config_selection (value) {
      this.rowSelection = getRowSelection(this.rows, value, value === 'multiple');
    },
    rows: function rows (r) {
      this.rowSelection = getRowSelection(r, this.config.selection, this.multipleSelection);
    },
    rowSelection: function rowSelection () {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.$emit('selection', this$1.rowsSelected, this$1.selectedRows);

        if (this$1.rowsSelected) {
          this$1.toolbar = 'selection';
          return
        }
        if (this$1.toolbar === 'selection') {
          this$1.toolbar = '';
        }
      });
    }
  },
  computed: {
    multipleSelection: function multipleSelection () {
      return this.config.selection && this.config.selection === 'multiple'
    },
    rowsSelected: function rowsSelected () {
      if (this.multipleSelection) {
        return this.rowSelection.filter(function (r) { return r; }).length
      }
      return this.rowSelection.length && this.rowSelection[0] !== -1 ? 1 : 0
    },
    selectedRows: function selectedRows () {
      var this$1 = this;

      if (this.multipleSelection) {
        return this.rowSelection
          .map(function (selected, index) { return [selected, this$1.rows[index].__index]; })
          .filter(function (row) { return row[0]; })
          .map(function (row) {
            return { index: row[1], data: this$1.data[row[1]] }
          })
      }

      if (!this.rowSelection.length || this.rowSelection[0] === -1) {
        return []
      }
      var
        index = this.rows[this.rowSelection[0]].__index,
        row = this.data[index];

      return [{index: index, data: row}]
    }
  },
  methods: {
    clearSelection: function clearSelection () {
      if (!this.multipleSelection) {
        this.rowSelection = [-1];
        return
      }
      this.rowSelection = this.rows.map(function () { return false; });
    },
    emitRowClick: function emitRowClick (row) {
      this.$emit('rowclick', row);
    }
  }
};

var Scroll = {
  data: function data () {
    return {
      scroll: {
        horiz: 0,
        vert: 0
      }
    }
  },
  methods: {
    scrollHandler: function scrollHandler (e) {
      var this$1 = this;

      var
        left = e.currentTarget.scrollLeft,
        top = e.currentTarget.scrollTop;

      window.requestAnimationFrame(function () {
        if (this$1.$refs.head) {
          this$1.$refs.head.scrollLeft = left;
        }
        this$1.updateStickyScroll(top);
      });
    },
    mouseWheel: function mouseWheel (e) {
      if (!this.scroll.vert) {
        return
      }

      var body = this.$refs.body;
      body.scrollTop += getMouseWheelDistance(e).pixelY;
      if (body.scrollTop > 0 && body.scrollTop + body.clientHeight < body.scrollHeight) {
        e.preventDefault();
      }
    },
    resize: function resize () {
      var this$1 = this;

      this.$nextTick(function () {
        window.requestAnimationFrame(function () {
          if (this$1.responsive) {
            return
          }
          var
            body = this$1.$refs.body,
            size = getScrollbarWidth();

          this$1.scroll.horiz = size && body.clientWidth < body.scrollWidth ? size + 'px' : 0;
          this$1.scroll.vert = size && body.scrollHeight > body.clientHeight ? size + 'px' : 0;
        });
      });
    },
    updateStickyScroll: function updateStickyScroll (top) {
      if (this.$refs.stickyLeft) {
        this.$refs.stickyLeft.scrollTop = top;
      }
      if (this.$refs.stickyRight) {
        this.$refs.stickyRight.scrollTop = top;
      }
    }
  },
  watch: {
    $data: {
      deep: true,
      handler: function handler () {
        this.resize();
      }
    },
    bodyStyle: {
      deep: true,
      handler: function handler () {
        var this$1 = this;

        this.$nextTick(function () {
          this$1.resize();
        });
      }
    },
    rowStyle: {
      deep: true,
      handler: function handler () {
        var this$1 = this;

        this.$nextTick(function () {
          this$1.resize();
        });
      }
    },
    rightStickyColumns: function rightStickyColumns () {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.updateStickyScroll(this$1.$refs.body.scrollTop);
      });
    },
    leftStickyColumns: function leftStickyColumns () {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.updateStickyScroll(this$1.$refs.body.scrollTop);
      });
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.resize();
      window.addEventListener('resize', this$1.resize);
    });
  },
  beforeDestroy: function beforeDestroy () {
    window.removeEventListener('resize', this.resize);
  }
};

var sortMethod = {
  string: function (a, b) { return a.localeCompare(b); },
  number: function (a, b) { return a - b; },
  date: function (a, b) { return (new Date(a)) - (new Date(b)); },
  boolean: function (a, b) {
    if (a && !b) { return -1 }
    if (!a && b) { return 1 }
    return 0
  }
};

function nextDirection (dir) {
  if (dir === 0) { return 1 }
  if (dir === 1) { return -1 }
  return 0
}

function getSortFn (sort, type) {
  if (typeof sort === 'function') {
    return sort
  }
  return sortMethod[type] || sortMethod.number
}

var Sort = {
  data: function data () {
    return {
      sorting: {
        field: '',
        dir: 0,
        fn: false
      }
    }
  },
  watch: {
    'sorting.dir': function sorting_dir () {
      this.resetBody();
    }
  },
  methods: {
    setSortField: function setSortField (col) {
      if (this.sorting.field === col.field) {
        this.sorting.dir = nextDirection(this.sorting.dir);
        if (this.sorting.dir === 0) {
          this.sorting.field = '';
        }
        return
      }

      this.sorting.field = col.field;
      this.sorting.dir = 1;
      this.sorting.fn = getSortFn(col.sort, col.type);
    },
    sort: function sort (rows) {
      var sortFn = this.sorting.fn || (function (a, b) { return a - b; });
      var
        field = this.sorting.field,
        dir = this.sorting.dir;

      rows.sort(function (a, b) { return dir * sortFn(a[field], b[field]); });
    }
  }
};

var SortIcon = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-icon',{staticClass:"cursor-pointer",attrs:{"name":_vm.icon}})},staticRenderFns: [],
  name: 'q-sort-icon',
  components: {
    QIcon: QIcon
  },
  props: {
    field: String,
    sorting: Object
  },
  computed: {
    icon: function icon () {
      if (this.sorting.field !== this.field) {
        return 'import_export'
      }
      return this.sorting.dir === 1 ? 'arrow_downward' : 'arrow_upward'
    }
  }
};

var QTooltip = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{staticClass:"q-tooltip animate-scale",style:(_vm.transformCSS)},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-tooltip',
  mixins: [ModelToggleMixin],
  props: {
    anchor: {
      type: String,
      default: 'top middle',
      validator: positionValidator
    },
    self: {
      type: String,
      default: 'bottom middle',
      validator: positionValidator
    },
    offset: {
      type: Array,
      validator: offsetValidator
    },
    delay: {
      type: Number,
      default: 0
    },
    maxHeight: String,
    disable: Boolean
  },
  data: function data () {
    return {
      opened: false
    }
  },
  computed: {
    anchorOrigin: function anchorOrigin () {
      return parsePosition(this.anchor)
    },
    selfOrigin: function selfOrigin () {
      return parsePosition(this.self)
    },
    transformCSS: function transformCSS () {
      return getTransformProperties({
        selfOrigin: this.selfOrigin
      })
    }
  },
  methods: {
    toggle: function toggle () {
      if (this.opened) {
        this.close();
      }
      else {
        this.open();
      }
    },
    open: function open () {
      if (this.disable || this.opened) {
        return
      }
      clearTimeout(this.timer);
      this.opened = true;
      document.body.appendChild(this.$el);
      this.scrollTarget = getScrollTarget(this.anchorEl);
      this.scrollTarget.addEventListener('scroll', this.close);
      window.addEventListener('resize', this.__debouncedUpdatePosition);
      if (Platform.is.mobile) {
        document.body.addEventListener('click', this.close, true);
      }
      this.__updateModel(true);
      this.$emit('open');
      this.__updatePosition();
    },
    close: function close () {
      clearTimeout(this.timer);
      if (this.opened) {
        this.opened = false;
        this.scrollTarget.removeEventListener('scroll', this.close);
        window.removeEventListener('resize', this.__debouncedUpdatePosition);
        document.body.removeChild(this.$el);
        if (Platform.is.mobile) {
          document.body.removeEventListener('click', this.close, true);
        }
        this.__updateModel(false);
        this.$emit('close');
      }
    },
    __updatePosition: function __updatePosition () {
      setPosition({
        el: this.$el,
        offset: this.offset,
        anchorEl: this.anchorEl,
        anchorOrigin: this.anchorOrigin,
        selfOrigin: this.selfOrigin,
        maxHeight: this.maxHeight
      });
    },
    __delayOpen: function __delayOpen () {
      clearTimeout(this.timer);
      this.timer = setTimeout(this.open, this.delay);
    }
  },
  created: function created () {
    var this$1 = this;

    this.__debouncedUpdatePosition = debounce(function () {
      this$1.__updatePosition();
    }, 70);
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      /*
        The following is intentional.
        Fixes a bug in Chrome regarding offsetHeight by requiring browser
        to calculate this before removing from DOM and using it for first time.
      */
      this$1.$el.offsetHeight; // eslint-disable-line

      this$1.anchorEl = this$1.$el.parentNode;
      this$1.anchorEl.removeChild(this$1.$el);
      if (this$1.anchorEl.classList.contains('q-btn-inner')) {
        this$1.anchorEl = this$1.anchorEl.parentNode;
      }
      if (Platform.is.mobile) {
        this$1.anchorEl.addEventListener('click', this$1.open);
      }
      else {
        this$1.anchorEl.addEventListener('mouseenter', this$1.__delayOpen);
        this$1.anchorEl.addEventListener('focus', this$1.__delayOpen);
        this$1.anchorEl.addEventListener('mouseleave', this$1.close);
        this$1.anchorEl.addEventListener('blur', this$1.close);
      }
    });
  },
  beforeDestroy: function beforeDestroy () {
    if (Platform.is.mobile) {
      this.anchorEl.removeEventListener('click', this.open);
    }
    else {
      this.anchorEl.removeEventListener('mouseenter', this.__delayOpen);
      this.anchorEl.removeEventListener('focus', this.__delayOpen);
      this.anchorEl.removeEventListener('mouseleave', this.close);
      this.anchorEl.removeEventListener('blur', this.close);
    }
    this.close();
  }
};

var TableSticky = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('table',{staticClass:"q-table horizontal-separator"},[_c('colgroup',[(_vm.selection)?_c('col',{staticStyle:{"width":"45px"}}):_vm._e(),_vm._v(" "),_vm._l((_vm.cols),function(col){return _c('col',{style:({width: col.width})})})],2),_vm._v(" "),(!_vm.noHeader)?_c('thead',[_c('tr',[(_vm.selection)?_c('th',[_vm._v(" ")]):_vm._e(),_vm._v(" "),_vm._l((_vm.cols),function(col,index){return _c('th',{class:{invisible: _vm.hidden(index), sortable: col.sort},on:{"click":function($event){_vm.sort(col);}}},[(!_vm.hidden(index))?[(col.sort)?_c('sort-icon',{attrs:{"field":col.field,"sorting":_vm.sorting}}):_vm._e(),_vm._v(" "),_c('span',{domProps:{"innerHTML":_vm._s(col.label)}}),_vm._v(" "),(col.label)?_c('q-tooltip',{domProps:{"innerHTML":_vm._s(col.label)}}):_vm._e()]:_vm._e()],2)})],2)]):_vm._e(),_vm._v(" "),(!_vm.head)?_c('tbody',[_vm._t("default")],2):_vm._e()])},staticRenderFns: [],
  name: 'q-table-sticky',
  components: {
    SortIcon: SortIcon,
    QTooltip: QTooltip
  },
  props: {
    stickyCols: Number,
    cols: Array,
    head: Boolean,
    noHeader: Boolean,
    right: Boolean,
    sorting: Object,
    scroll: Object,
    selection: [String, Boolean]
  },
  data: function data () {
    return {
      selected: false
    }
  },
  methods: {
    hidden: function hidden (index) {
      if (this.right) {
        return this.cols.length - this.stickyCols > index
      }
      return index >= this.stickyCols
    },
    sort: function sort (col) {
      if (col.sort) {
        this.$emit('sort', col);
      }
    }
  }
};

var StickyColumns = {
  computed: {
    leftStickyColumns: function leftStickyColumns () {
      var this$1 = this;

      var
        number = this.config.leftStickyColumns || 0,
        cols = number;

      for (var i = 0; i < cols; i++) {
        if (!this$1.columnSelection.includes(this$1.columns[i].field)) {
          number--;
        }
      }
      return number
    },
    rightStickyColumns: function rightStickyColumns () {
      var this$1 = this;

      var
        number = this.config.rightStickyColumns || 0,
        cols = number,
        length = this.columns.length;

      for (var i = 1; i <= cols; i++) {
        if (!this$1.columnSelection.includes(this$1.columns[length - i].field)) {
          number--;
        }
      }
      return number
    },
    regularCols: function regularCols () {
      return this.cols.slice(this.leftStickyColumns, this.cols.length - this.rightStickyColumns)
    },
    leftCols: function leftCols () {
      var this$1 = this;

      return Array.apply(null, Array(this.leftStickyColumns)).map(function (col, n) { return this$1.cols[n]; })
    },
    rightCols: function rightCols () {
      var this$1 = this;

      return Array.apply(null, Array(this.rightStickyColumns)).map(function (col, n) { return this$1.cols[this$1.cols.length - this$1.rightStickyColumns + n]; })
    }
  },
  components: {
    TableSticky: TableSticky
  }
};

var TableContent = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('table',{staticClass:"q-table horizontal-separator",style:(_vm.tableStyle)},[_c('colgroup',[(_vm.selection)?_c('col',{staticStyle:{"width":"45px"}}):_vm._e(),_vm._v(" "),_vm._l((_vm.cols),function(col){return _c('col',{style:({width: col.width})})}),_vm._v(" "),(_vm.head && _vm.scroll.horiz)?_c('col',{style:({width: _vm.scroll.horiz})}):_vm._e()],2),_vm._v(" "),(_vm.head)?_c('thead',[_c('tr',[(_vm.selection)?_c('th',[_vm._v(" ")]):_vm._e(),_vm._v(" "),_vm._l((_vm.cols),function(col){return _c('th',{class:{sortable: col.sort},on:{"click":function($event){_vm.sort(col);}}},[(col.sort)?_c('sort-icon',{attrs:{"field":col.field,"sorting":_vm.sorting}}):_vm._e(),_vm._v(" "),_c('span',{domProps:{"innerHTML":_vm._s(col.label)}}),_vm._v(" "),(col.label)?_c('q-tooltip',{domProps:{"innerHTML":_vm._s(col.label)}}):_vm._e()],1)}),_vm._v(" "),(_vm.head && _vm.scroll.horiz)?_c('th'):_vm._e()],2)]):_c('tbody',[_vm._t("default")],2)])},staticRenderFns: [],
  name: 'q-table-content',
  components: {
    SortIcon: SortIcon,
    QTooltip: QTooltip
  },
  props: {
    cols: Array,
    head: Boolean,
    sorting: Object,
    scroll: Object,
    selection: [String, Boolean]
  },
  computed: {
    tableStyle: function tableStyle () {
      return {
        width: this.head && this.vert ? ("calc(100% - " + (this.scroll.vert) + ")") : '100%'
      }
    }
  },
  methods: {
    sort: function sort (col) {
      if (col.sort) {
        this.$emit('sort', col);
      }
    }
  }
};

var QDataTable = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-data-table"},[(_vm.hasToolbar && _vm.toolbar === '')?[_c('div',{staticClass:"q-data-table-toolbar upper-toolbar row reverse-wrap items-center justify-end"},[(_vm.config.title)?_c('div',{staticClass:"q-data-table-title ellipsis col",domProps:{"innerHTML":_vm._s(_vm.config.title)}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"row items-center"},[(_vm.config.refresh && !_vm.refreshing)?_c('q-btn',{attrs:{"flat":"","color":"primary"},on:{"click":_vm.refresh}},[_c('q-icon',{attrs:{"name":"refresh"}})],1):_vm._e(),_vm._v(" "),(_vm.refreshing)?_c('q-btn',{staticClass:"disabled"},[_c('q-icon',{staticClass:"animate-spin-reverse",attrs:{"name":"cached"}})],1):_vm._e(),_vm._v(" "),(_vm.config.columnPicker)?_c('q-select',{staticStyle:{"margin":"0 0 0 10px"},attrs:{"multiple":"multiple","toggle":"","options":_vm.columnSelectionOptions,"display-value":_vm.labels.columns,"simple":""},model:{value:(_vm.columnSelection),callback:function ($$v) {_vm.columnSelection=$$v;},expression:"columnSelection"}}):_vm._e()],1)])]:_vm._e(),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.toolbar === 'selection'),expression:"toolbar === 'selection'"}],staticClass:"q-data-table-toolbar upper-toolbar row reverse-wrap items-center justify-end q-data-table-selection"},[_c('div',{staticClass:"col"},[_vm._v(" "+_vm._s(_vm.rowsSelected)+" "),(_vm.rowsSelected === 1)?_c('span',[_vm._v(_vm._s(_vm.labels.selected.singular))]):_c('span',[_vm._v(_vm._s(_vm.labels.selected.plural))]),_vm._v(" "),_c('q-btn',{attrs:{"flat":"","small":"","color":"primary"},on:{"click":_vm.clearSelection}},[_vm._v(_vm._s(_vm.labels.clear))])],1),_vm._v(" "),_c('div',[_vm._t("selection",null,{rows:_vm.selectedRows})],2)]),_vm._v(" "),(_vm.filteringCols.length)?_c('table-filter',{attrs:{"filtering":_vm.filtering,"columns":_vm.filteringCols,"labels":_vm.labels}}):_vm._e(),_vm._v(" "),(_vm.responsive)?[(_vm.message)?_c('div',{staticClass:"q-data-table-message row flex-center",domProps:{"innerHTML":_vm._s(_vm.message)}}):_c('div',{staticStyle:{"overflow":"auto"},style:(_vm.bodyStyle)},[_c('table',{ref:"body",staticClass:"q-table horizontal-separator responsive"},[_c('tbody',_vm._l((_vm.rows),function(row,index){return _c('tr',{on:{"click":function($event){_vm.emitRowClick(row);}}},[(_vm.config.selection)?_c('td',[(_vm.config.selection === 'multiple')?_c('q-checkbox',{model:{value:(_vm.rowSelection[index]),callback:function ($$v) {_vm.$set(_vm.rowSelection, index, $$v);},expression:"rowSelection[index]"}}):_c('q-radio',{attrs:{"val":index},model:{value:(_vm.rowSelection[0]),callback:function ($$v) {_vm.$set(_vm.rowSelection, 0, $$v);},expression:"rowSelection[0]"}})],1):_vm._e(),_vm._v(" "),_vm._l((_vm.cols),function(col){return _c('td',{class:_vm.formatClass(col, row[col.field]),style:(_vm.formatStyle(col, row[col.field])),attrs:{"data-th":col.label}},[_vm._t('col-'+col.field,[_c('span',{domProps:{"innerHTML":_vm._s(_vm.format(row, col))}})],{row:row,col:col,data:row[col.field]})],2)})],2)}))])])]:_c('div',{staticClass:"q-data-table-container",on:{"wheel":_vm.mouseWheel,"mousewheel":_vm.mouseWheel,"DOMMouseScroll":_vm.mouseWheel}},[(_vm.hasHeader)?_c('div',{ref:"head",staticClass:"q-data-table-head",style:({marginRight: _vm.scroll.vert})},[_c('table-content',{attrs:{"head":"","cols":_vm.cols,"sorting":_vm.sorting,"scroll":_vm.scroll,"selection":_vm.config.selection},on:{"sort":_vm.setSortField}})],1):_vm._e(),_vm._v(" "),_c('div',{ref:"body",staticClass:"q-data-table-body",style:(_vm.bodyStyle),on:{"scroll":_vm.scrollHandler}},[(_vm.message)?_c('div',{staticClass:"q-data-table-message row flex-center",domProps:{"innerHTML":_vm._s(_vm.message)}}):_c('table-content',{attrs:{"cols":_vm.cols,"selection":_vm.config.selection}},_vm._l((_vm.rows),function(row){return _c('tr',{style:(_vm.rowStyle),on:{"click":function($event){_vm.emitRowClick(row);}}},[(_vm.config.selection)?_c('td'):_vm._e(),_vm._v(" "),(_vm.leftStickyColumns)?_c('td',{attrs:{"colspan":_vm.leftStickyColumns}}):_vm._e(),_vm._v(" "),_vm._l((_vm.regularCols),function(col){return _c('td',{class:_vm.formatClass(col, row[col.field]),style:(_vm.formatStyle(col, row[col.field]))},[_vm._t('col-'+col.field,[_c('span',{domProps:{"innerHTML":_vm._s(_vm.format(row, col))}})],{row:row,col:col,data:row[col.field]})],2)}),_vm._v(" "),(_vm.rightStickyColumns)?_c('td',{attrs:{"colspan":_vm.rightStickyColumns}}):_vm._e()],2)}))],1),_vm._v(" "),(!_vm.message && (_vm.leftStickyColumns || _vm.config.selection))?[_c('div',{ref:"stickyLeft",staticClass:"q-data-table-sticky-left",style:({bottom: _vm.scroll.horiz})},[_c('table-sticky',{attrs:{"no-header":!_vm.hasHeader,"sticky-cols":_vm.leftStickyColumns,"cols":_vm.cols,"sorting":_vm.sorting,"selection":_vm.config.selection}},_vm._l((_vm.rows),function(row,index){return _c('tr',{style:(_vm.rowStyle),on:{"click":function($event){_vm.emitRowClick(row);}}},[(_vm.config.selection)?_c('td',[(_vm.config.selection === 'multiple')?_c('q-checkbox',{model:{value:(_vm.rowSelection[index]),callback:function ($$v) {_vm.$set(_vm.rowSelection, index, $$v);},expression:"rowSelection[index]"}}):_c('q-radio',{attrs:{"val":index},model:{value:(_vm.rowSelection[0]),callback:function ($$v) {_vm.$set(_vm.rowSelection, 0, $$v);},expression:"rowSelection[0]"}})],1):_vm._e(),_vm._v(" "),_vm._l((_vm.leftCols),function(col){return _c('td',{class:_vm.formatClass(col, row[col.field]),style:(_vm.formatStyle(col, row[col.field]))},[_vm._t('col-'+col.field,[_c('span',{domProps:{"innerHTML":_vm._s(_vm.format(row, col))}})],{row:row,col:col,data:row[col.field]})],2)})],2)}))],1),_vm._v(" "),(_vm.hasHeader)?_c('div',{staticClass:"q-data-table-sticky-left",style:({bottom: _vm.scroll.horiz})},[_c('table-sticky',{attrs:{"head":"","sticky-cols":_vm.leftStickyColumns,"scroll":_vm.scroll,"cols":_vm.cols,"sorting":_vm.sorting,"selection":_vm.config.selection},on:{"sort":_vm.setSortField}})],1):_vm._e()]:_vm._e(),_vm._v(" "),(!_vm.message && _vm.rightStickyColumns)?[_c('div',{ref:"stickyRight",staticClass:"q-data-table-sticky-right",style:({right: _vm.scroll.vert, bottom: _vm.scroll.horiz})},[_c('table-sticky',{attrs:{"no-header":!_vm.hasHeader,"right":"","sticky-cols":_vm.rightStickyColumns,"cols":_vm.cols,"sorting":_vm.sorting,"selection":_vm.config.selection}},_vm._l((_vm.rows),function(row){return _c('tr',{style:(_vm.rowStyle),on:{"click":function($event){_vm.emitRowClick(row);}}},[(_vm.config.selection)?_c('td',{staticClass:"invisible"}):_vm._e(),_vm._v(" "),_c('td',{staticClass:"invisible",attrs:{"colspan":_vm.cols.length - _vm.rightStickyColumns}}),_vm._v(" "),_vm._l((_vm.rightCols),function(col){return _c('td',{class:_vm.formatClass(col, row[col.field]),style:(_vm.formatStyle(col, row[col.field]))},[_vm._t('col-'+col.field,[_c('span',{domProps:{"innerHTML":_vm._s(_vm.format(row, col))}})],{row:row,col:col,data:row[col.field]})],2)})],2)}))],1),_vm._v(" "),(_vm.hasHeader)?_c('div',{staticClass:"q-data-table-sticky-right",style:({right: _vm.scroll.vert})},[_c('table-sticky',{attrs:{"right":"","head":"","sticky-cols":_vm.rightStickyColumns,"scroll":_vm.scroll,"cols":_vm.cols,"sorting":_vm.sorting,"selection":_vm.config.selection},on:{"sort":_vm.setSortField}})],1):_vm._e()]:_vm._e()],2),_vm._v(" "),(_vm.config.pagination)?_c('table-pagination',{attrs:{"pagination":_vm.pagination,"entries":_vm.pagination.entries,"labels":_vm.labels}}):_vm._e()],2)},staticRenderFns: [],
  name: 'q-data-table',
  components: {
    QSelect: QSelect,
    QBtn: QBtn,
    QIcon: QIcon,
    QCheckbox: QCheckbox,
    QRadio: QRadio,
    TableContent: TableContent
  },
  mixins: [ColumnSelection, Filter, I18n, Pagination, Responsive, RowSelection, Scroll, Sort, StickyColumns],
  props: {
    data: {
      type: Array,
      default: function default$1 () { return [] }
    },
    columns: {
      type: Array,
      required: true
    },
    config: {
      type: Object,
      default: function default$2 () { return {} }
    }
  },
  data: function data () {
    return {
      selected: false,
      toolbar: '',
      refreshing: false
    }
  },
  computed: {
    rows: function rows () {
      var length = this.data.length;

      if (!length) {
        return []
      }

      var rows = clone(this.data);

      rows.forEach(function (row, i) {
        row.__index = i;
      });

      if (this.filtering.terms) {
        rows = this.filter(rows);
      }

      if (this.sorting.field) {
        this.sort(rows);
      }

      this.pagination.entries = rows.length;
      if (this.pagination.rowsPerPage > 0) {
        rows = this.paginate(rows);
      }

      return rows
    },
    rowStyle: function rowStyle () {
      if (this.config.rowHeight) {
        return {height: this.config.rowHeight}
      }
    },
    bodyStyle: function bodyStyle () {
      return this.config.bodyStyle || {}
    },
    hasToolbar: function hasToolbar () {
      return this.config.title || this.config.columnPicker || this.config.refresh
    },
    hasHeader: function hasHeader () {
      return !this.config.noHeader
    }
  },
  methods: {
    resetBody: function resetBody () {
      var body = this.$refs.body;

      if (body) {
        body.scrollTop = 0;
      }
      this.pagination.page = 1;
    },
    format: function format (row, col) {
      return col.format ? col.format(row[col.field], row) : row[col.field]
    },
    refresh: function refresh (state) {
      var this$1 = this;

      if (state === false) {
        this.refreshing = false;
      }
      else if (state === true || !this.refreshing) {
        this.refreshing = true;
        this.$emit('refresh', function () {
          this$1.refreshing = false;
        });
      }
    },
    formatStyle: function formatStyle (col, value) {
      return typeof col.style === 'function' ? col.style(value) : col.style
    },
    formatClass: function formatClass (col, value) {
      return typeof col.classes === 'function' ? col.classes(value) : col.classes
    }
  }
};

/* eslint no-fallthrough: 0 */

var MILLISECONDS_IN_DAY = 86400000;
var MILLISECONDS_IN_HOUR = 3600000;
var MILLISECONDS_IN_MINUTE = 60000;
var token = /d{1,4}|M{1,4}|m{1,2}|w{1,2}|D{1,4}|YY(?:YY)?|H{1,2}|h{1,2}|s{1,2}|S{1,3}|Z{1,2}|a{1,2}|[AQExX]/g;

var dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

var monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatTimezone (offset, delimeter) {
  if ( delimeter === void 0 ) delimeter = '';

  var
    sign = offset > 0 ? '-' : '+',
    absOffset = Math.abs(offset),
    hours = Math.floor(absOffset / 60),
    minutes = absOffset % 60;

  return sign + pad(hours) + delimeter + pad(minutes)
}

function setMonth (date, newMonth /* 1-based */) {
  var
    test = new Date(date.getFullYear(), newMonth, 0, 0, 0, 0, 0),
    days = test.getDate();

  date.setMonth(newMonth - 1, Math.min(days, date.getDate()));
}

function getChange (date, mod, add) {
  var
    t = new Date(date),
    sign = (add ? 1 : -1);

  Object.keys(mod).forEach(function (key) {
    if (key === 'month') {
      setMonth(t, t.getMonth() + 1 + sign * mod.month);
      return
    }

    var op = key === 'year'
      ? 'FullYear'
      : capitalize(key === 'days' ? 'date' : key);
    t[("set" + op)](t[("get" + op)]() + sign * mod[key]);
  });
  return t
}

function isValid (date) {
  var t = Date.parse(date);
  return isNaN(t) === false
}

function buildDate (mod, utc) {
  return adjustDate(new Date(), mod, utc)
}

function getDayOfWeek (date) {
  var dow = new Date(date).getDay();
  return dow === 0 ? 7 : dow
}

function getWeekOfYear (date) {
  // Remove time components of date
  var thursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Change date to Thursday same week
  thursday.setDate(thursday.getDate() - ((thursday.getDay() + 6) % 7) + 3);

  // Take January 4th as it is always in week 1 (see ISO 8601)
  var firstThursday = new Date(thursday.getFullYear(), 0, 4);

  // Change date to Thursday same week
  firstThursday.setDate(firstThursday.getDate() - ((firstThursday.getDay() + 6) % 7) + 3);

  // Check if daylight-saving-time-switch occurred and correct for it
  var ds = thursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
  thursday.setHours(thursday.getHours() - ds);

  // Number of weeks between target Thursday and first Thursday
  var weekDiff = (thursday - firstThursday) / (MILLISECONDS_IN_DAY * 7);
  return 1 + Math.floor(weekDiff)
}

function isBetweenDates (date, from, to) {
  var
    d1 = new Date(from).getTime(),
    d2 = new Date(to).getTime(),
    cur = new Date(date).getTime();

  return cur > d1 && cur < d2
}

function addToDate (date, mod) {
  return getChange(date, mod, true)
}
function subtractFromDate (date, mod) {
  return getChange(date, mod, false)
}

function adjustDate (date, mod, utc) {
  var
    t = new Date(date),
    prefix = "set" + (utc ? 'UTC' : '');

  Object.keys(mod).forEach(function (key) {
    if (key === 'month') {
      setMonth(t, mod.month);
      return
    }

    var op = key === 'year'
      ? 'FullYear'
      : key.charAt(0).toUpperCase() + key.slice(1);
    t[("" + prefix + op)](mod[key]);
  });
  return t
}

function startOfDate (date, unit) {
  var t = new Date(date);
  switch (unit) {
    case 'year':
      t.setMonth(0);
    case 'month':
      t.setDate(1);
    case 'day':
      t.setHours(0);
    case 'hour':
      t.setMinutes(0);
    case 'minute':
      t.setSeconds(0);
    case 'second':
      t.setMilliseconds(0);
  }
  return t
}

function endOfDate (date, unit) {
  var t = new Date(date);
  switch (unit) {
    case 'year':
      t.setMonth(11);
    case 'month':
      t.setDate(daysInMonth(date));
    case 'day':
      t.setHours(23);
    case 'hour':
      t.setMinutes(59);
    case 'minute':
      t.setSeconds(59);
    case 'second':
      t.setMilliseconds(59);
  }
  return t
}

function getMaxDate (date) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var t = new Date(date);
  args.forEach(function (d) {
    t = Math.max(t, new Date(d));
  });
  return t
}
function getMinDate (date) {
  var args = [], len = arguments.length - 1;
  while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

  var t = new Date(date);
  args.forEach(function (d) {
    t = Math.min(t, new Date(d));
  });
  return t
}

function getDiff (t, sub, interval) {
  return (
    (t.getTime() - t.getTimezoneOffset() * MILLISECONDS_IN_MINUTE) -
    (sub.getTime() - sub.getTimezoneOffset() * MILLISECONDS_IN_MINUTE)
  ) / interval
}

function getDateDiff (date, subtract, unit) {
  if ( unit === void 0 ) unit = 'days';

  var
    t = new Date(date),
    sub = new Date(subtract);

  switch (unit) {
    case 'years':
      return (t.getFullYear() - sub.getFullYear())

    case 'months':
      return (t.getFullYear() - sub.getFullYear()) * 12 + t.getMonth() - sub.getMonth()

    case 'days':
      return getDiff(startOfDate(t, 'day'), startOfDate(sub, 'day'), MILLISECONDS_IN_DAY)

    case 'hours':
      return getDiff(startOfDate(t, 'hour'), startOfDate(sub, 'hour'), MILLISECONDS_IN_HOUR)

    case 'minutes':
      return getDiff(startOfDate(t, 'minute'), startOfDate(sub, 'minute'), MILLISECONDS_IN_MINUTE)

    case 'seconds':
      return getDiff(startOfDate(t, 'second'), startOfDate(sub, 'second'), 1000)
  }
}

function getDayOfYear (date) {
  return getDateDiff(date, startOfDate(date, 'year'), 'days') + 1
}

function convertDateToFormat (date, example) {
  if (!date) {
    return
  }

  if (isDate(example)) {
    return date
  }
  if (typeof example === 'number') {
    return date.getTime()
  }

  return formatDate(date)
}

function getDateBetween (date, min, max) {
  var t = new Date(date);

  if (min) {
    var low = new Date(min);
    if (t < low) {
      return low
    }
  }

  if (max) {
    var high = new Date(max);
    if (t > high) {
      return high
    }
  }

  return t
}

function isSameDate (date, date2, unit) {
  var
    t = new Date(date),
    d = new Date(date2);

  if (unit === void 0) {
    return t.getTime() === d.getTime()
  }

  switch (unit) {
    case 'second':
      if (t.getUTCSeconds() !== d.getUTCSeconds()) {
        return false
      }
    case 'minute': // intentional fall-through
      if (t.getUTCMinutes() !== d.getUTCMinutes()) {
        return false
      }
    case 'hour': // intentional fall-through
      if (t.getUTCHours() !== d.getUTCHours()) {
        return false
      }
    case 'day': // intentional fall-through
      if (t.getUTCDate() !== d.getUTCDate()) {
        return false
      }
    case 'month': // intentional fall-through
      if (t.getUTCMonth() !== d.getUTCMonth()) {
        return false
      }
    case 'year': // intentional fall-through
      if (t.getUTCFullYear() !== d.getUTCFullYear()) {
        return false
      }
      break
    default:
      throw new Error(("date isSameDate unknown unit " + unit))
  }

  return true
}

function daysInMonth (date) {
  return (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate()
}

var formatter = {
  // Year: 00, 01, ..., 99
  YY: function YY (date) {
    return pad(date.getFullYear(), 4).substr(2)
  },

  // Year: 1900, 1901, ..., 2099
  YYYY: function YYYY (date) {
    return pad(date.getFullYear(), 4)
  },

  // Month: 1, 2, ..., 12
  M: function M (date) {
    return date.getMonth() + 1
  },

  // Month: 01, 02, ..., 12
  MM: function MM (date) {
    return pad(date.getMonth() + 1)
  },

  // Month Short Name: Jan, Feb, ...
  MMM: function MMM (date) {
    return this.MMMM(date).slice(0, 3)
  },

  // Month Name: January, February, ...
  MMMM: function MMMM (date, opts) {
    if ( opts === void 0 ) opts = {};

    return (opts.monthNames || monthNames)[date.getMonth()]
  },

  // Quarter: 1, 2, 3, 4
  Q: function Q (date) {
    return Math.ceil((date.getMonth() + 1) / 3)
  },

  // Day of month: 1, 2, ..., 31
  D: function D (date) {
    return date.getDate()
  },

  // Day of month: 01, 02, ..., 31
  DD: function DD (date) {
    return pad(date.getDate())
  },

  // Day of year: 1, 2, ..., 366
  DDD: function DDD (date) {
    return getDayOfYear(date)
  },

  // Day of year: 001, 002, ..., 366
  DDDD: function DDDD (date) {
    return pad(getDayOfYear(date), 3)
  },

  // Day of week: 0, 1, ..., 6
  d: function d (date) {
    return date.getDay()
  },

  // Day of week: Su, Mo, ...
  dd: function dd (date) {
    return this.dddd(date).slice(0, 2)
  },

  // Day of week: Sun, Mon, ...
  ddd: function ddd (date) {
    return this.dddd(date).slice(0, 3)
  },

  // Day of week: Sunday, Monday, ...
  dddd: function dddd (date, opts) {
    if ( opts === void 0 ) opts = {};

    return (opts.dayNames || dayNames)[date.getDay()]
  },

  // Day of ISO week: 1, 2, ..., 7
  E: function E (date) {
    return date.getDay() || 7
  },

  // Week of Year: 1 2 ... 52 53
  w: function w (date) {
    return getWeekOfYear(date)
  },

  // Week of Year: 01 02 ... 52 53
  ww: function ww (date) {
    return pad(getWeekOfYear(date))
  },

  // Hour: 0, 1, ... 23
  H: function H (date) {
    return date.getHours()
  },

  // Hour: 00, 01, ..., 23
  HH: function HH (date) {
    return pad(date.getHours())
  },

  // Hour: 1, 2, ..., 12
  h: function h (date) {
    var hours = date.getHours();
    if (hours === 0) {
      return 12
    }
    if (hours > 12) {
      return hours % 12
    }
    return hours
  },

  // Hour: 01, 02, ..., 12
  hh: function hh (date) {
    return pad(this.h(date))
  },

  // Minute: 0, 1, ..., 59
  m: function m (date) {
    return date.getMinutes()
  },

  // Minute: 00, 01, ..., 59
  mm: function mm (date) {
    return pad(date.getMinutes())
  },

  // Second: 0, 1, ..., 59
  s: function s (date) {
    return date.getSeconds()
  },

  // Second: 00, 01, ..., 59
  ss: function ss (date) {
    return pad(date.getSeconds())
  },

  // 1/10 of second: 0, 1, ..., 9
  S: function S (date) {
    return Math.floor(date.getMilliseconds() / 100)
  },

  // 1/100 of second: 00, 01, ..., 99
  SS: function SS (date) {
    return pad(Math.floor(date.getMilliseconds() / 10))
  },

  // Millisecond: 000, 001, ..., 999
  SSS: function SSS (date) {
    return pad(date.getMilliseconds(), 3)
  },

  // Meridiem: AM, PM
  A: function A (date) {
    return this.H(date) < 12 ? 'AM' : 'PM'
  },

  // Meridiem: am, pm
  a: function a (date) {
    return this.H(date) < 12 ? 'am' : 'pm'
  },

  // Meridiem: a.m., p.m
  aa: function aa (date) {
    return this.H(date) < 12 ? 'a.m.' : 'p.m.'
  },

  // Timezone: -01:00, +00:00, ... +12:00
  Z: function Z (date) {
    return formatTimezone(date.getTimezoneOffset(), ':')
  },

  // Timezone: -0100, +0000, ... +1200
  ZZ: function ZZ (date) {
    return formatTimezone(date.getTimezoneOffset())
  },

  // Seconds timestamp: 512969520
  X: function X (date) {
    return Math.floor(date.getTime() / 1000)
  },

  // Milliseconds timestamp: 512969520900
  x: function x (date) {
    return date.getTime()
  }
};

function formatDate (val, mask, opts) {
  if ( mask === void 0 ) mask = 'YYYY-MM-DDTHH:mm:ss.SSSZ';

  if (!val) {
    return
  }

  var date = new Date(val);

  return mask.replace(token, function (match) {
    if (match in formatter) {
      return formatter[match](date, opts)
    }
    return match
  })
}


var date = Object.freeze({
	dayNames: dayNames,
	monthNames: monthNames,
	isValid: isValid,
	buildDate: buildDate,
	getDayOfWeek: getDayOfWeek,
	getWeekOfYear: getWeekOfYear,
	isBetweenDates: isBetweenDates,
	addToDate: addToDate,
	subtractFromDate: subtractFromDate,
	adjustDate: adjustDate,
	startOfDate: startOfDate,
	endOfDate: endOfDate,
	getMaxDate: getMaxDate,
	getMinDate: getMinDate,
	getDateDiff: getDateDiff,
	getDayOfYear: getDayOfYear,
	convertDateToFormat: convertDateToFormat,
	getDateBetween: getDateBetween,
	isSameDate: isSameDate,
	daysInMonth: daysInMonth,
	formatter: formatter,
	formatDate: formatDate
});

var modelValidator = function (v) {
  var type = typeof v;
  return (
    v === null || v === undefined ||
    type === 'number' || type === 'string' ||
    isDate(v)
  )
};

var inline = {
  value: {
    validator: modelValidator,
    required: true
  },
  type: {
    type: String,
    default: 'date',
    validator: function validator (value) {
      return ['date', 'time', 'datetime'].includes(value)
    }
  },
  color: {
    type: String,
    default: 'primary'
  },
  min: {
    validator: modelValidator,
    default: null
  },
  max: {
    validator: modelValidator,
    default: null
  },
  monthNames: {
    type: Array,
    default: function () { return monthNames; }
  },
  dayNames: {
    type: Array,
    default: function () { return dayNames; }
  },
  mondayFirst: Boolean,
  saturdayFirst: Boolean,
  format24h: Boolean
};

var input = {
  format: String,
  noClear: Boolean,
  placeholder: String,
  clearLabel: {
    type: String,
    default: 'Clear'
  },
  okLabel: {
    type: String,
    default: 'Set'
  },
  cancelLabel: {
    type: String,
    default: 'Cancel'
  }
};

var DateMixin = {
  props: inline,
  computed: {
    model: {
      get: function get () {
        var date = this.value
          ? new Date(this.value)
          : (this.defaultSelection ? new Date(this.defaultSelection) : startOfDate(new Date(), 'day'));

        return getDateBetween(
          date,
          this.pmin,
          this.pmax
        )
      },
      set: function set (val) {
        var date = getDateBetween(val, this.pmin, this.pmax);
        if (!isSameDate(this.value, date)) {
          var val$1 = convertDateToFormat(date, this.value);
          this.$emit('input', val$1);
          this.$emit('change', val$1);
        }
      }
    },
    pmin: function pmin () {
      return this.min ? new Date(this.min) : null
    },
    pmax: function pmax () {
      return this.max ? new Date(this.max) : null
    },
    typeHasDate: function typeHasDate () {
      return this.type === 'date' || this.type === 'datetime'
    },
    typeHasTime: function typeHasTime () {
      return this.type === 'time' || this.type === 'datetime'
    },

    year: function year () {
      return this.model.getFullYear()
    },
    month: function month () {
      return this.model.getMonth() + 1
    },
    day: function day () {
      return this.model.getDate()
    },
    minute: function minute () {
      return this.model.getMinutes()
    },

    yearInterval: function yearInterval () {
      var
        min = this.pmin !== null ? this.pmin.getFullYear() : 1950,
        max = this.pmax !== null ? this.pmax.getFullYear() : 2050;
      return Math.max(1, max - min + 1)
    },
    yearMin: function yearMin () {
      return this.pmin !== null ? this.pmin.getFullYear() - 1 : 1949
    },
    monthInterval: function monthInterval () {
      var
        min = this.pmin !== null && this.pmin.getFullYear() === this.model.getFullYear() ? this.pmin.getMonth() : 0,
        max = this.pmax !== null && this.pmax.getFullYear() === this.model.getFullYear() ? this.pmax.getMonth() : 11;
      return Math.max(1, max - min + 1)
    },
    monthMin: function monthMin () {
      return this.pmin !== null && this.pmin.getFullYear() === this.model.getFullYear()
        ? this.pmin.getMonth()
        : 0
    },

    daysInMonth: function daysInMonth$$1 () {
      return (new Date(this.model.getFullYear(), this.model.getMonth() + 1, 0)).getDate()
    },

    editable: function editable () {
      return !this.disable && !this.readonly
    }
  },

  methods: {
    clear: function clear () {
      if (this.value !== '') {
        this.$emit('input', '');
        this.$emit('change', '');
      }
    },

    toggleAmPm: function toggleAmPm () {
      if (!this.editable) {
        return
      }
      var
        hour = this.model.getHours(),
        offset = this.am ? 12 : -12;

      this.model = new Date(this.model.setHours(hour + offset));
    },

    __parseTypeValue: function __parseTypeValue (type, value) {
      if (type === 'month') {
        return between(value, 1, 12)
      }
      if (type === 'date') {
        return between(value, 1, this.daysInMonth)
      }
      if (type === 'year') {
        var
          min = this.pmin ? this.pmin.getFullYear() : 1950,
          max = this.pmax ? this.pmax.getFullYear() : 2050;
        return between(value, min, max)
      }
      if (type === 'hour') {
        return between(value, 0, 23)
      }
      if (type === 'minute') {
        return between(value, 0, 59)
      }
    }
  }
};

var InlineDatetimeIOS = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-datetime",class:['type-' + _vm.type, _vm.disable ? 'disabled' : '', _vm.readonly ? 'readonly' : '']},[_vm._t("default"),_vm._v(" "),_c('div',{staticClass:"q-datetime-content non-selectable"},[_c('div',{staticClass:"q-datetime-inner full-height flex justify-center",on:{"touchstart":function($event){$event.stopPropagation();$event.preventDefault();}}},[(_vm.typeHasDate)?[_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical",value:(_vm.__dragMonth),expression:"__dragMonth",modifiers:{"vertical":true}}],staticClass:"q-datetime-col q-datetime-col-month"},[_c('div',{ref:"month",staticClass:"q-datetime-col-wrapper",style:(_vm.__monthStyle)},_vm._l((_vm.monthInterval),function(index){return _c('div',{staticClass:"q-datetime-item"},[_vm._v(" "+_vm._s(_vm.monthNames[index + _vm.monthMin - 1])+" ")])}))]),_vm._v(" "),_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical",value:(_vm.__dragDate),expression:"__dragDate",modifiers:{"vertical":true}}],staticClass:"q-datetime-col q-datetime-col-day"},[_c('div',{ref:"date",staticClass:"q-datetime-col-wrapper",style:(_vm.__dayStyle)},_vm._l((_vm.daysInterval),function(index){return _c('div',{staticClass:"q-datetime-item"},[_vm._v(" "+_vm._s(index + _vm.dayMin - 1)+" ")])}))]),_vm._v(" "),_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical",value:(_vm.__dragYear),expression:"__dragYear",modifiers:{"vertical":true}}],staticClass:"q-datetime-col q-datetime-col-year"},[_c('div',{ref:"year",staticClass:"q-datetime-col-wrapper",style:(_vm.__yearStyle)},_vm._l((_vm.yearInterval),function(n){return _c('div',{staticClass:"q-datetime-item"},[_vm._v(" "+_vm._s(n + _vm.yearMin)+" ")])}))])]:_vm._e(),_vm._v(" "),(_vm.typeHasTime)?[_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical",value:(_vm.__dragHour),expression:"__dragHour",modifiers:{"vertical":true}}],staticClass:"q-datetime-col q-datetime-col-hour"},[_c('div',{ref:"hour",staticClass:"q-datetime-col-wrapper",style:(_vm.__hourStyle)},_vm._l((_vm.hourInterval),function(n){return _c('div',{staticClass:"q-datetime-item"},[_vm._v(" "+_vm._s(n + _vm.hourMin - 1)+" ")])}))]),_vm._v(" "),_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical",value:(_vm.__dragMinute),expression:"__dragMinute",modifiers:{"vertical":true}}],staticClass:"q-datetime-col q-datetime-col-minute"},[_c('div',{ref:"minute",staticClass:"q-datetime-col-wrapper",style:(_vm.__minuteStyle)},_vm._l((_vm.minuteInterval),function(n){return _c('div',{staticClass:"q-datetime-item"},[_vm._v(" "+_vm._s(_vm.__pad(n + _vm.minuteMin - 1))+" ")])}))])]:_vm._e()],2),_vm._v(" "),_c('div',{staticClass:"q-datetime-mask"}),_vm._v(" "),_c('div',{staticClass:"q-datetime-highlight"})])],2)},staticRenderFns: [],
  name: 'q-inline-datetime',
  mixins: [DateMixin],
  directives: {
    TouchPan: TouchPan
  },
  props: {
    defaultSelection: [String, Number, Date],
    disable: Boolean,
    readonly: Boolean
  },
  data: function data () {
    return {
      monthDragOffset: 0,
      dateDragOffset: 0,
      yearDragOffset: 0,
      hourDragOffset: 0,
      minuteDragOffset: 0,
      dragging: false
    }
  },
  watch: {
    model: function model () {
      this.$nextTick(this.__updateAllPositions);
    }
  },
  computed: {
    dayMin: function dayMin () {
      return this.pmin !== null && isSameDate(this.pmin, this.model, 'month')
        ? this.pmin.getDate()
        : 1
    },
    dayMax: function dayMax () {
      return this.pmax !== null && isSameDate(this.pmax, this.model, 'month')
        ? this.pmax.getDate()
        : this.daysInMonth
    },
    daysInterval: function daysInterval () {
      return this.dayMax - this.dayMin + 1
    },

    hour: function hour () {
      return this.model.getHours()
    },
    hourMin: function hourMin () {
      return this.pmin && isSameDate(this.pmin, this.model, 'day') ? this.pmin.getHours() : 0
    },
    hourInterval: function hourInterval () {
      return (this.pmax && isSameDate(this.pmax, this.model, 'day') ? this.pmax.getHours() : 23) - this.hourMin + 1
    },

    minuteMin: function minuteMin () {
      return this.pmin && isSameDate(this.pmin, this.model, 'hour') ? this.pmin.getMinutes() : 0
    },
    minuteInterval: function minuteInterval () {
      return (this.pmax && isSameDate(this.pmax, this.model, 'hour') ? this.pmax.getMinutes() : 59) - this.minuteMin + 1
    },

    __monthStyle: function __monthStyle () {
      return this.__colStyle(82 - (this.month - 1 + this.monthDragOffset) * 36)
    },
    __dayStyle: function __dayStyle () {
      return this.__colStyle(82 - (this.day + this.dateDragOffset) * 36)
    },
    __yearStyle: function __yearStyle () {
      return this.__colStyle(82 - (this.year + this.yearDragOffset) * 36)
    },
    __hourStyle: function __hourStyle () {
      return this.__colStyle(82 - (this.hour + this.hourDragOffset) * 36)
    },
    __minuteStyle: function __minuteStyle () {
      return this.__colStyle(82 - (this.minute + this.minuteDragOffset) * 36)
    }
  },
  methods: {
    __dragMonth: function __dragMonth (e) {
      this.__drag(e, 'month');
    },
    __dragDate: function __dragDate (e) {
      this.__drag(e, 'date');
    },
    __dragYear: function __dragYear (e) {
      this.__drag(e, 'year');
    },
    __dragHour: function __dragHour (e) {
      this.__drag(e, 'hour');
    },
    __dragMinute: function __dragMinute (e) {
      this.__drag(e, 'minute');
    },
    __drag: function __drag (e, type) {
      var method = e.isFirst
        ? '__dragStart' : (e.isFinal ? '__dragStop' : '__dragMove');

      this[method](e.evt, type);
    },

    /* date */
    setYear: function setYear (value) {
      if (this.editable) {
        this.model = new Date(this.model.setFullYear(this.__parseTypeValue('year', value)));
      }
    },
    setMonth: function setMonth (value) {
      if (this.editable) {
        this.model = adjustDate(this.model, {month: value});
      }
    },
    setDay: function setDay (value) {
      if (this.editable) {
        this.model = new Date(this.model.setDate(this.__parseTypeValue('date', value)));
      }
    },

    /* time */
    setHour: function setHour (value) {
      if (this.editable) {
        this.model = new Date(this.model.setHours(this.__parseTypeValue('hour', value)));
      }
    },
    setMinute: function setMinute (value) {
      if (this.editable) {
        this.model = new Date(this.model.setMinutes(this.__parseTypeValue('minute', value)));
      }
    },

    /* helpers */
    __pad: function __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __updateAllPositions: function __updateAllPositions () {
      var this$1 = this;

      this.$nextTick(function () {
        if (this$1.typeHasDate) {
          this$1.__updatePositions('month', this$1.model.getMonth());
          this$1.__updatePositions('date', this$1.model.getDate());
          this$1.__updatePositions('year', this$1.model.getFullYear());
        }
        if (this$1.typeHasTime) {
          this$1.__updatePositions('hour', this$1.model.getHours());
          this$1.__updatePositions('minute', this$1.model.getMinutes());
        }
      });
    },
    __updatePositions: function __updatePositions (type, value) {
      var this$1 = this;

      var root = this.$refs[type];
      if (!root) {
        return
      }

      var delta = -value;
      if (type === 'year') {
        delta += this.yearMin + 1;
      }
      else if (type === 'date') {
        delta += this.dayMin;
      }
      else {
        delta += this[type + 'Min'];
      }

      [].slice.call(root.children).forEach(function (item) {
        css(item, this$1.__itemStyle(value * 36, between(delta * -18, -180, 180)));
        delta++;
      });
    },
    __colStyle: function __colStyle (value) {
      return {
        '-webkit-transform': 'translate3d(0,' + value + 'px,0)',
        '-ms-transform': 'translate3d(0,' + value + 'px,0)',
        'transform': 'translate3d(0,' + value + 'px,0)'
      }
    },
    __itemStyle: function __itemStyle (translation, rotation) {
      return {
        '-webkit-transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)',
        '-ms-transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)',
        'transform': 'translate3d(0, ' + translation + 'px, 0) rotateX(' + rotation + 'deg)'
      }
    },

    /* common */
    __dragStart: function __dragStart (ev, type) {
      if (!this.editable) {
        return
      }

      ev.stopPropagation();
      ev.preventDefault();

      this[type + 'DragOffset'] = 0;
      this.dragging = type;
      this.__actualType = type === 'date' ? 'day' : type;
      this.__typeOffset = type === 'month' ? -1 : 0;
      this.__dragPosition = position(ev).top;
    },
    __dragMove: function __dragMove (ev, type) {
      if (this.dragging !== type || !this.editable) {
        return
      }

      ev.stopPropagation();
      ev.preventDefault();

      var offset$$1 = (this.__dragPosition - position(ev).top) / 36;
      this[type + 'DragOffset'] = offset$$1;
      this.__updatePositions(type, this[this.__actualType] + offset$$1 + this.__typeOffset);
    },
    __dragStop: function __dragStop (ev, type) {
      var this$1 = this;

      if (this.dragging !== type || !this.editable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.dragging = false;

      var
        offset$$1 = Math.round(this[type + 'DragOffset']),
        newValue = this.__parseTypeValue(type, this[this.__actualType] + offset$$1);

      if (newValue !== this[this.__actualType]) {
        this[("set" + (capitalize(this.__actualType)))](newValue);
      }
      else {
        this.__updatePositions(type, this[this.__actualType] + this.__typeOffset);
      }
      this.$nextTick(function () {
        this$1[type + 'DragOffset'] = 0;
      });
    }
  },
  mounted: function mounted () {
    this.$nextTick(this.__updateAllPositions);
  }
};

function convertToAmPm (hour) {
  return hour === 0 ? 12 : (hour >= 13 ? hour - 12 : hour)
}

var InlineDatetimeMat = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-datetime inline row",class:_vm.classes},[_c('div',{staticClass:"q-datetime-header column col-xs-12 col-md-4 justify-center"},[(_vm.typeHasDate)?_c('div',[_c('div',{staticClass:"q-datetime-weekdaystring col-12"},[_vm._v(_vm._s(_vm.weekDayString))]),_vm._v(" "),_c('div',{staticClass:"q-datetime-datestring row flex-center"},[_c('span',{staticClass:"q-datetime-link small col-auto col-md-12",class:{active: _vm.view === 'month'},on:{"click":function($event){_vm.view = 'month';}}},[_vm._v(" "+_vm._s(_vm.monthString)+" ")]),_vm._v(" "),_c('span',{staticClass:"q-datetime-link col-auto col-md-12",class:{active: _vm.view === 'day'},on:{"click":function($event){_vm.view = 'day';}}},[_vm._v(" "+_vm._s(_vm.day)+" ")]),_vm._v(" "),_c('span',{staticClass:"q-datetime-link small col-auto col-md-12",class:{active: _vm.view === 'year'},on:{"click":function($event){_vm.view = 'year';}}},[_vm._v(" "+_vm._s(_vm.year)+" ")])])]):_vm._e(),_vm._v(" "),(_vm.typeHasTime)?_c('div',{staticClass:"q-datetime-time row flex-center"},[_c('div',{staticClass:"q-datetime-clockstring col-auto col-md-12"},[_c('span',{staticClass:"q-datetime-link col-auto col-md-12",class:{active: _vm.view === 'hour'},on:{"click":function($event){_vm.view = 'hour';}}},[_vm._v(" "+_vm._s(_vm.__pad(_vm.hour, '  '))+" ")]),_vm._v(" "),_c('span',{staticStyle:{"opacity":"0.6"}},[_vm._v(":")]),_vm._v(" "),_c('span',{staticClass:"q-datetime-link col-auto col-md-12",class:{active: _vm.view === 'minute'},on:{"click":function($event){_vm.view = 'minute';}}},[_vm._v(" "+_vm._s(_vm.__pad(_vm.minute))+" ")])]),_vm._v(" "),(!_vm.format24h)?_c('div',{staticClass:"q-datetime-ampm column col-auto col-md-12 justify-around"},[_c('div',{staticClass:"q-datetime-link",class:{active: _vm.am},on:{"click":function($event){_vm.toggleAmPm();}}},[_vm._v("AM")]),_vm._v(" "),_c('div',{staticClass:"q-datetime-link",class:{active: !_vm.am},on:{"click":function($event){_vm.toggleAmPm();}}},[_vm._v("PM")])]):_vm._e()]):_vm._e()]),_vm._v(" "),_c('div',{staticClass:"q-datetime-content col-xs-12 col-md-8 column"},[_c('div',{ref:"selector",staticClass:"q-datetime-selector auto row flex-center"},[(_vm.view === 'year')?_c('div',{staticClass:"q-datetime-view-year full-width full-height"},_vm._l((_vm.yearInterval),function(n){return _c('q-btn',{key:n,staticClass:"q-datetime-btn full-width",class:{active: n + _vm.yearMin === _vm.year},attrs:{"flat":""},on:{"click":function($event){_vm.setYear(n + _vm.yearMin);}}},[_vm._v(" "+_vm._s(n + _vm.yearMin)+" ")])})):_vm._e(),_vm._v(" "),(_vm.view === 'month')?_c('div',{staticClass:"q-datetime-view-month full-width full-height"},_vm._l((_vm.monthInterval),function(index){return _c('q-btn',{key:index,staticClass:"q-datetime-btn full-width",class:{active: _vm.month === index + _vm.monthMin},attrs:{"flat":""},on:{"click":function($event){_vm.setMonth(index + _vm.monthMin, true);}}},[_vm._v(" "+_vm._s(_vm.monthNames[index + _vm.monthMin - 1])+" ")])})):_vm._e(),_vm._v(" "),(_vm.view === 'day')?_c('div',{staticClass:"q-datetime-view-day"},[_c('div',{staticClass:"row items-center content-center"},[_c('q-btn',{attrs:{"round":"","small":"","flat":"","color":_vm.color,"disabled":_vm.beforeMinDays},on:{"click":function($event){_vm.setMonth(_vm.month - 1);}}},[_c('q-icon',{attrs:{"name":"keyboard_arrow_left"}})],1),_vm._v(" "),_c('div',{staticClass:"col q-datetime-dark"},[_vm._v(" "+_vm._s(_vm.monthStamp)+" ")]),_vm._v(" "),_c('q-btn',{attrs:{"round":"","small":"","flat":"","color":_vm.color,"disabled":_vm.afterMaxDays},on:{"click":function($event){_vm.setMonth(_vm.month + 1);}}},[_c('q-icon',{attrs:{"name":"keyboard_arrow_right"}})],1)],1),_vm._v(" "),_c('div',{staticClass:"q-datetime-weekdays row items-center justify-start"},_vm._l((_vm.headerDayNames),function(day){return _c('div',[_vm._v(_vm._s(day))])})),_vm._v(" "),_c('div',{staticClass:"q-datetime-days row wrap items-center justify-start content-center"},[_vm._l((_vm.fillerDays),function(fillerDay){return _c('div',{staticClass:"q-datetime-fillerday"})}),_vm._v(" "),_vm._l((_vm.beforeMinDays),function(fillerDay){return (_vm.min)?_c('div',{staticClass:"row items-center content-center justify-center disabled"},[_vm._v(" "+_vm._s(fillerDay)+" ")]):_vm._e()}),_vm._v(" "),_vm._l((_vm.daysInterval),function(monthDay){return _c('div',{staticClass:"row items-center content-center justify-center cursor-pointer",class:{ 'q-datetime-day-active': monthDay === _vm.day, 'q-datetime-day-today': monthDay === _vm.today },on:{"click":function($event){_vm.setDay(monthDay);}}},[_c('span',[_vm._v(_vm._s(monthDay))])])}),_vm._v(" "),_vm._l((_vm.afterMaxDays),function(fillerDay){return (_vm.max)?_c('div',{staticClass:"row items-center content-center justify-center disabled"},[_vm._v(" "+_vm._s(fillerDay + _vm.maxDay)+" ")]):_vm._e()})],2)]):_vm._e(),_vm._v(" "),(_vm.view === 'hour' || _vm.view === 'minute')?_c('div',{ref:"clock",staticClass:"column items-center content-center justify-center"},[(_vm.view === 'hour')?_c('div',{staticClass:"q-datetime-clock cursor-pointer",on:{"mousedown":_vm.__dragStart,"mousemove":_vm.__dragMove,"mouseup":_vm.__dragStop,"touchstart":_vm.__dragStart,"touchmove":_vm.__dragMove,"touchend":_vm.__dragStop}},[_c('div',{staticClass:"q-datetime-clock-circle full-width full-height"},[_c('div',{staticClass:"q-datetime-clock-center"}),_vm._v(" "),_c('div',{staticClass:"q-datetime-clock-pointer",style:(_vm.clockPointerStyle)},[_c('span')]),_vm._v(" "),(_vm.format24h)?_c('div',_vm._l((24),function(n){return _c('div',{staticClass:"q-datetime-clock-position fmt24",class:[("q-datetime-clock-pos-" + (n-1)), (n - 1) === _vm.hour ? 'active' : '']},[_c('span',[_vm._v(_vm._s(n - 1))])])})):_c('div',_vm._l((12),function(n){return _c('div',{staticClass:"q-datetime-clock-position",class:['q-datetime-clock-pos-' + n, n === _vm.hour ? 'active' : '']},[_c('span',[_vm._v(_vm._s(n))])])}))])]):_vm._e(),_vm._v(" "),(_vm.view === 'minute')?_c('div',{staticClass:"q-datetime-clock cursor-pointer",on:{"mousedown":_vm.__dragStart,"mousemove":_vm.__dragMove,"mouseup":_vm.__dragStop,"touchstart":_vm.__dragStart,"touchmove":_vm.__dragMove,"touchend":_vm.__dragStop}},[_c('div',{staticClass:"q-datetime-clock-circle full-width full-height"},[_c('div',{staticClass:"q-datetime-clock-center"}),_vm._v(" "),_c('div',{staticClass:"q-datetime-clock-pointer",style:(_vm.clockPointerStyle)},[_c('span')]),_vm._v(" "),_vm._l((12),function(n){return _c('div',{staticClass:"q-datetime-clock-position",class:['q-datetime-clock-pos-' + (n - 1), (n - 1) * 5 === _vm.minute ? 'active' : '']},[_c('span',[_vm._v(_vm._s((n - 1) * 5))])])})],2)]):_vm._e()]):_vm._e()]),_vm._v(" "),_vm._t("default")],2)])},staticRenderFns: [],
  name: 'q-inline-datetime',
  mixins: [DateMixin],
  props: {
    defaultSelection: [String, Number, Date],
    disable: Boolean,
    readonly: Boolean
  },
  components: {
    QIcon: QIcon,
    QBtn: QBtn
  },
  directives: {
    Ripple: Ripple
  },
  data: function data () {
    var view;

    switch (this.type) {
      case 'time':
        view = 'hour';
        break
      case 'date':
      default:
        view = 'day';
        break
    }

    return {
      view: view,
      dragging: false,
      centerClockPos: 0
    }
  },
  watch: {
    value: function value (val) {
      if (!val) {
        this.view = ['date', 'datetime'].includes(this.type) ? 'day' : 'hour';
      }
    },
    view: function view (value) {
      if (value !== 'year' && value !== 'month') {
        return
      }

      var
        view = this.$refs.selector,
        rows = value === 'year' ? this.year - this.yearMin : this.month - this.monthMin;

      this.$nextTick(function () {
        view.scrollTop = rows * height(view.children[0].children[0]) - height(view) / 2.5;
      });
    }
  },
  computed: {
    classes: function classes () {
      var cls = [];
      if (this.disable) {
        cls.push('disabled');
      }
      if (this.readonly) {
        cls.push('readonly');
      }
      if (this.color) {
        cls.push(("text-" + (this.color)));
      }
      return cls
    },
    firstDayOfWeek: function firstDayOfWeek () {
      return this.mondayFirst
        ? 1
        : (this.saturdayFirst ? 6 : 0)
    },
    headerDayNames: function headerDayNames () {
      var
        days = this.dayNames.map(function (day) { return day.slice(0, 3); }),
        first = this.firstDayOfWeek;

      return first > 0
        ? days.slice(first, 7).concat(days.slice(0, first))
        : days
    },

    monthString: function monthString () {
      return ("" + (this.monthNames[this.month - 1].slice(0, 3)))
    },
    monthStamp: function monthStamp () {
      return ((this.monthNames[this.month - 1]) + " " + (this.year))
    },
    weekDayString: function weekDayString () {
      return this.dayNames[this.model.getDay()]
    },

    fillerDays: function fillerDays () {
      var days = (new Date(this.model.getFullYear(), this.model.getMonth(), 1).getDay() - this.firstDayOfWeek);
      if (days < 0) {
        days += 7;
      }
      return days
    },
    beforeMinDays: function beforeMinDays () {
      if (this.pmin === null || !isSameDate(this.pmin, this.model, 'month')) {
        return false
      }
      return this.pmin.getDate() - 1
    },
    afterMaxDays: function afterMaxDays () {
      if (this.pmax === null || !isSameDate(this.pmax, this.model, 'month')) {
        return false
      }
      return this.daysInMonth - this.maxDay
    },
    maxDay: function maxDay () {
      return this.pmax !== null ? this.pmax.getDate() : this.daysInMonth
    },
    daysInterval: function daysInterval () {
      var after = this.pmax === null || this.afterMaxDays === false ? 0 : this.afterMaxDays;
      if (this.beforeMinDays || after) {
        var min = this.beforeMinDays ? this.beforeMinDays + 1 : 1;
        return Array.apply(null, {length: this.daysInMonth - min - after + 1}).map(function (day, index) {
          return index + min
        })
      }
      return this.daysInMonth
    },

    hour: function hour () {
      var h = this.model.getHours();
      return this.format24h
        ? h
        : convertToAmPm(h)
    },
    minute: function minute () {
      return this.model.getMinutes()
    },
    am: function am () {
      return this.model.getHours() <= 11
    },
    clockPointerStyle: function clockPointerStyle () {
      var
        divider = this.view === 'minute' ? 60 : (this.format24h ? 24 : 12),
        degrees = Math.round((this.view === 'minute' ? this.minute : this.hour) * (360 / divider)) - 180;

      return cssTransform(("rotate(" + degrees + "deg)"))
    },
    today: function today () {
      var today = new Date();
      return isSameDate(today, this.model, 'month')
        ? today.getDate()
        : -1
    }
  },
  methods: {
    /* date */
    setYear: function setYear (value) {
      if (this.editable) {
        this.view = 'day';
        this.model = new Date(this.model.setFullYear(this.__parseTypeValue('year', value)));
      }
    },
    setMonth: function setMonth (value) {
      if (this.editable) {
        this.view = 'day';
        this.model = adjustDate(this.model, {month: value});
      }
    },
    setDay: function setDay (value) {
      if (this.editable) {
        this.model = new Date(this.model.setDate(this.__parseTypeValue('date', value)));
      }
    },

    setHour: function setHour (value) {
      if (!this.editable) {
        return
      }

      value = this.__parseTypeValue('hour', value);

      if (!this.format24h && value < 12 && !this.am) {
        value += 12;
      }

      this.model = new Date(this.model.setHours(value));
    },
    setMinute: function setMinute (value) {
      if (!this.editable) {
        return
      }

      this.model = new Date(this.model.setMinutes(this.__parseTypeValue('minute', value)));
    },

    /* helpers */
    __pad: function __pad (unit, filler) {
      return (unit < 10 ? filler || '0' : '') + unit
    },
    __dragStart: function __dragStart (ev) {
      ev.stopPropagation();
      ev.preventDefault();

      var
        clock = this.$refs.clock,
        clockOffset = offset(clock);

      this.centerClockPos = {
        top: clockOffset.top + height(clock) / 2,
        left: clockOffset.left + width(clock) / 2
      };

      this.dragging = true;
      this.__updateClock(ev);
    },
    __dragMove: function __dragMove (ev) {
      if (!this.dragging) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.__updateClock(ev);
    },
    __dragStop: function __dragStop (ev) {
      ev.stopPropagation();
      ev.preventDefault();
      this.dragging = false;
      this.view = 'minute';
    },
    __updateClock: function __updateClock (ev) {
      var
        pos = position(ev),
        height$$1 = Math.abs(pos.top - this.centerClockPos.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(pos.top - this.centerClockPos.top), 2) +
          Math.pow(Math.abs(pos.left - this.centerClockPos.left), 2)
        ),
        angle = Math.asin(height$$1 / distance) * (180 / Math.PI);

      if (pos.top < this.centerClockPos.top) {
        angle = this.centerClockPos.left < pos.left ? 90 - angle : 270 + angle;
      }
      else {
        angle = this.centerClockPos.left < pos.left ? angle + 90 : 270 - angle;
      }

      if (this.view === 'hour') {
        this.setHour(Math.round(angle / (this.format24h ? 15 : 30)));
      }
      else {
        this.setMinute(Math.round(angle / 6));
      }
    }
  }
};

var QInlineDatetime = {
  name: 'q-inline-datetime',
  functional: true,
  render: function render (h, ctx) {
    return h(
      current === 'ios' ? InlineDatetimeIOS : InlineDatetimeMat,
      ctx.data,
      ctx.children
    )
  }
};

var contentCSS = {
  ios: {
    maxHeight: '80vh',
    height: 'auto',
    boxShadow: 'none',
    backgroundColor: '#e4e4e4'
  },
  mat: {
    maxWidth: '95vw',
    maxHeight: '98vh'
  }
};

var QDatetime = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-input-frame',{staticClass:"q-datetime-input",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"disable":_vm.disable,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.color,"focused":_vm.focused,"focusable":"","length":_vm.actualValue.length},nativeOn:{"click":function($event){_vm.open($event);},"focus":function($event){_vm.__onFocus($event);},"blur":function($event){_vm.__onBlur($event);}}},[_c('div',{staticClass:"col row items-center q-input-target",class:_vm.alignClass,domProps:{"innerHTML":_vm._s(_vm.actualValue)}}),_vm._v(" "),(_vm.usingPopover)?_c('q-popover',{ref:"popup",attrs:{"offset":[0, 10],"disable":_vm.disable,"anchor-click":false,"max-height":"100vh"},on:{"open":_vm.__onFocus,"close":_vm.__onClose}},[_c('q-inline-datetime',{ref:"target",staticClass:"no-border",attrs:{"default-selection":_vm.defaultSelection,"type":_vm.type,"min":_vm.min,"max":_vm.max,"format24h":_vm.format24h,"monday-first":_vm.mondayFirst,"saturday-first":_vm.saturdayFirst,"month-names":_vm.monthNames,"day-names":_vm.dayNames,"color":_vm.color},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v;},expression:"model"}},[_c('div',{staticClass:"row q-datetime-controls modal-buttons-top"},[(!_vm.noClear && _vm.model)?_c('q-btn',{attrs:{"color":_vm.color,"flat":""},on:{"click":function($event){_vm.clear();}}},[_c('span',{domProps:{"innerHTML":_vm._s(_vm.clearLabel)}})]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"col"}),_vm._v(" "),_c('q-btn',{attrs:{"color":_vm.color,"flat":""},on:{"click":function($event){_vm.close();}}},[_c('span',{domProps:{"innerHTML":_vm._s(_vm.cancelLabel)}})]),_vm._v(" "),_c('q-btn',{attrs:{"color":_vm.color,"flat":""},on:{"click":function($event){_vm.close(_vm.__update);}}},[_c('span',{domProps:{"innerHTML":_vm._s(_vm.okLabel)}})])],1)])],1):_c('q-modal',{ref:"popup",staticClass:"with-backdrop",class:_vm.classNames,attrs:{"transition":_vm.transition,"position-classes":_vm.position,"content-css":_vm.css},on:{"open":_vm.__onFocus,"close":_vm.__onClose}},[_c('q-inline-datetime',{ref:"target",staticClass:"no-border",class:{'full-width': _vm.$q.theme === 'ios'},attrs:{"default-selection":_vm.defaultSelection,"type":_vm.type,"min":_vm.min,"max":_vm.max,"format24h":_vm.format24h,"monday-first":_vm.mondayFirst,"saturday-first":_vm.saturdayFirst,"month-names":_vm.monthNames,"day-names":_vm.dayNames,"color":_vm.color},model:{value:(_vm.model),callback:function ($$v) {_vm.model=$$v;},expression:"model"}},[_c('div',{staticClass:"modal-buttons modal-buttons-top row full-width"},[(!_vm.noClear && _vm.model)?_c('q-btn',{attrs:{"color":_vm.color,"flat":""},on:{"click":function($event){_vm.clear();}}},[_c('span',{domProps:{"innerHTML":_vm._s(_vm.clearLabel)}})]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"col"}),_vm._v(" "),_c('q-btn',{attrs:{"color":_vm.color,"flat":""},on:{"click":function($event){_vm.close();}}},[_c('span',{domProps:{"innerHTML":_vm._s(_vm.cancelLabel)}})]),_vm._v(" "),_c('q-btn',{attrs:{"color":_vm.color,"flat":""},on:{"click":function($event){_vm.close(_vm.__update);}}},[_c('span',{domProps:{"innerHTML":_vm._s(_vm.okLabel)}})])],1)])],1),_vm._v(" "),_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"arrow_drop_down"},slot:"after"})],1)},staticRenderFns: [],
  name: 'q-datetime',
  mixins: [FrameMixin],
  components: {
    QInputFrame: QInputFrame,
    QPopover: QPopover,
    QModal: QModal,
    QInlineDatetime: QInlineDatetime,
    QBtn: QBtn
  },
  props: extend(
    {
      defaultSelection: [String, Number, Date],
      displayValue: String
    },
    input,
    inline
  ),
  data: function data () {
    var data = this.usingPopover ? {} : {
      css: contentCSS[current],
      position: current === 'ios' ? 'items-end justify-center' : 'flex-center',
      transition: current === 'ios' ? 'q-modal-bottom' : 'q-modal',
      classNames: current === 'ios' ? '' : 'minimized'
    };
    data.model = this.value;
    data.focused = false;
    return data
  },
  computed: {
    usingPopover: function usingPopover () {
      return this.$q.platform.is.desktop && !this.$q.platform.within.iframe
    },
    actualValue: function actualValue () {
      if (this.displayValue) {
        return this.displayValue
      }
      if (!this.value) {
        return this.placeholder || ''
      }

      var format;

      if (this.format) {
        format = this.format;
      }
      else if (this.type === 'date') {
        format = 'YYYY-MM-DD';
      }
      else if (this.type === 'time') {
        format = 'HH:mm';
      }
      else {
        format = 'YYYY-MM-DD HH:mm:ss';
      }

      return formatDate(this.value, format, {
        dayNames: this.dayNames,
        monthNames: this.monthNames
      })
    }
  },
  methods: {
    open: function open () {
      if (!this.disable) {
        this.__setModel();
        this.$refs.popup.open();
      }
    },
    close: function close (fn) {
      this.focused = false;
      this.$refs.popup.close(fn);
    },
    clear: function clear () {
      this.$refs.popup.close();
      if (this.value !== '') {
        this.$emit('input', '');
        this.$emit('change', '');
      }
    },

    __onFocus: function __onFocus () {
      this.focused = true;
      this.$emit('focus');
    },
    __onBlur: function __onBlur (e) {
      var this$1 = this;

      this.__onClose();
      setTimeout(function () {
        var el = document.activeElement;
        if (el !== document.body && !this$1.$refs.popup.$el.contains(el)) {
          this$1.close();
        }
      }, 1);
    },
    __onClose: function __onClose () {
      this.focused = false;
      this.$emit('blur');
    },
    __setModel: function __setModel () {
      this.model = this.value;
    },
    __update: function __update () {
      var val = this.model || this.$refs.target.model;
      if (!isSameDate(this.value, val)) {
        this.$emit('input', val);
        this.$emit('change', val);
      }
    }
  }
};

var QDatetimeRange = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-datetime-range no-wrap",class:_vm.classes},[_c('q-datetime',{staticClass:"col q-datetime-range-left",class:_vm.className,style:(_vm.css),attrs:{"default-selection":_vm.defaultFrom,"type":_vm.type,"min":_vm.min,"max":_vm.value.to || _vm.max,"format":_vm.format,"no-clear":_vm.noClear,"clear-label":_vm.clearLabel,"ok-label":_vm.okLabel,"cancel-label":_vm.cancelLabel,"float-label":_vm.floatLabel,"stack-label":_vm.stackLabel,"placeholder":_vm.placeholder,"disable":_vm.disable,"error":_vm.error,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.color,"align":_vm.align,"format24h":_vm.format24h,"monday-first":_vm.mondayFirst,"saturday-first":_vm.saturdayFirst,"month-names":_vm.monthNames,"day-names":_vm.dayNames},on:{"change":_vm.__onChange},model:{value:(_vm.value.from),callback:function ($$v) {_vm.$set(_vm.value, "from", $$v);},expression:"value.from"}}),_vm._v(" "),_c('q-datetime',{staticClass:"col q-datetime-range-right",class:_vm.className,style:(_vm.css),attrs:{"default-selection":_vm.defaultTo,"type":_vm.type,"min":_vm.value.from || _vm.min,"max":_vm.max,"format":_vm.format,"no-clear":_vm.noClear,"clear-label":_vm.clearLabel,"ok-label":_vm.okLabel,"cancel-label":_vm.cancelLabel,"float-label":_vm.floatLabel,"stack-label":_vm.stackLabel,"placeholder":_vm.placeholder,"disable":_vm.disable,"error":_vm.error,"inverted":_vm.inverted,"dark":_vm.dark,"before":_vm.before,"after":_vm.after,"color":_vm.color,"align":_vm.align,"format24h":_vm.format24h,"monday-first":_vm.mondayFirst,"saturday-first":_vm.saturdayFirst,"month-names":_vm.monthNames,"day-names":_vm.dayNames},on:{"change":_vm.__onChange},model:{value:(_vm.value.to),callback:function ($$v) {_vm.$set(_vm.value, "to", $$v);},expression:"value.to"}})],1)},staticRenderFns: [],
  name: 'q-datetime-range',
  mixins: [FrameMixin],
  components: {
    QDatetime: QDatetime
  },
  props: extend(
    input,
    inline,
    {
      value: {
        type: Object,
        validator: function (val) { return 'from' in val && 'to' in val; },
        required: true
      },
      className: [String, Object],
      css: [String, Object],
      defaultFrom: [String, Number, Date],
      defaultTo: [String, Number, Date],
      vertical: Boolean
    }
  ),
  computed: {
    classes: function classes () {
      return this.vertical ? 'column' : 'row'
    }
  },
  methods: {
    __onChange: function __onChange () {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.$emit('change', this$1.value);
      });
    }
  }
};

var FabMixin = {
  props: {
    outline: Boolean,
    push: Boolean,
    flat: Boolean,
    color: String,
    glossy: Boolean
  }
};

var QFab = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-fab z-fab row inline justify-center",class:{'q-fab-opened': _vm.opened}},[_c('q-btn',{class:{glossy: _vm.glossy},attrs:{"round":"","outline":_vm.outline,"push":_vm.push,"flat":_vm.flat,"color":_vm.color},on:{"click":_vm.toggle}},[_vm._t("tooltip"),_vm._v(" "),_c('q-icon',{staticClass:"q-fab-icon absolute-full row flex-center full-width full-height",attrs:{"name":_vm.icon}}),_vm._v(" "),_c('q-icon',{staticClass:"q-fab-active-icon absolute-full row flex-center full-width full-height",attrs:{"name":_vm.activeIcon}})],2),_vm._v(" "),_c('div',{staticClass:"q-fab-actions flex no-wrap inline items-center",class:("q-fab-" + (_vm.direction))},[_vm._t("default")],2)],1)},staticRenderFns: [],
  name: 'q-fab',
  mixins: [FabMixin, ModelToggleMixin],
  components: {
    QBtn: QBtn,
    QIcon: QIcon
  },
  props: {
    icon: {
      type: String,
      default: 'add'
    },
    activeIcon: {
      type: String,
      default: 'close'
    },
    direction: {
      type: String,
      default: 'right'
    }
  },
  provide: function provide () {
    return {
      __qFabClose: this.close
    }
  },
  data: function data () {
    return {
      opened: false
    }
  },
  methods: {
    open: function open () {
      this.opened = true;
      this.__updateModel(true);
      this.$emit('open');
    },
    close: function close (fn) {
      this.opened = false;
      this.__updateModel(false);
      this.$emit('close');

      if (typeof fn === 'function') {
        fn();
      }
    },
    toggle: function toggle () {
      if (this.opened) {
        this.close();
      }
      else {
        this.open();
      }
    }
  }
};

var QFabAction = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-btn',{attrs:{"round":"","small":"","outline":_vm.outline,"push":_vm.push,"flat":_vm.flat,"color":_vm.color,"glossy":_vm.glossy},on:{"click":_vm.click}},[_c('q-icon',{attrs:{"name":_vm.icon}}),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-fab-action',
  mixins: [FabMixin],
  components: {
    QBtn: QBtn,
    QIcon: QIcon
  },
  inject: ['__qFabClose'],
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  methods: {
    click: function click (e) {
      var this$1 = this;

      this.__qFabClose(function () {
        this$1.$emit('click', e);
      });
    }
  }
};

var QGallery = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-gallery"},_vm._l((_vm.src),function(img,index){return _c('div',{key:index,style:({width: _vm.width})},[_c('img',{attrs:{"src":img}})])}))},staticRenderFns: [],
  name: 'q-gallery',
  props: {
    src: {
      type: Array,
      required: true
    },
    width: {
      type: String,
      default: '150px'
    }
  }
};

var QGalleryCarousel = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-carousel',{ref:"slider",staticClass:"text-white bg-black q-gallery-carousel",attrs:{"dots":_vm.dots,"arrows":_vm.arrows,"fullscreen":_vm.fullscreen,"infinite":_vm.infinite,"actions":"","animation":_vm.animation,"autoplay":_vm.autoplay,"handle-arrow-keys":_vm.handleArrowKeys,"easing":_vm.easing,"swipe-easing":_vm.swipeEasing,"no-swipe":_vm.noSwipe},on:{"slide":_vm.__updateCurrentSlide}},[_vm._l((_vm.src),function(img){return _c('div',{key:img,staticClass:"no-padding row flex-center",attrs:{"slot":"slide"},slot:"slide"},[_c('div',{staticClass:"full-width"},[_c('img',{attrs:{"src":img}})])])}),_vm._v(" "),_c('div',{staticClass:"q-gallery-carousel-overlay",class:{active: _vm.quickView},on:{"click":function($event){_vm.toggleQuickView();}}}),_vm._v(" "),_c('q-icon',{attrs:{"slot":"action","name":"view_carousel"},on:{"click":function($event){_vm.toggleQuickView();}},slot:"action"}),_vm._v(" "),_c('div',{staticClass:"q-gallery-carousel-quickview",class:{active: _vm.quickView, row: _vm.horizontalQuickView, horizontal: _vm.horizontalQuickView},on:{"!touchstart":function($event){$event.stopPropagation();},"!touchmove":function($event){$event.stopPropagation();},"!touchend":function($event){$event.stopPropagation();},"!mousedown":function($event){$event.stopPropagation();},"!mousemove":function($event){$event.stopPropagation();},"!mouseend":function($event){$event.stopPropagation();}}},_vm._l((_vm.src),function(img,index){return _c('div',{key:img},[_c('img',{class:{active: _vm.currentSlide === index},attrs:{"src":img},on:{"click":function($event){_vm.__selectImage(index);}}})])}))],2)},staticRenderFns: [],
  name: 'q-gallery-carousel',
  components: {
    QCarousel: QCarousel,
    QIcon: QIcon
  },
  mixins: [CarouselMixin],
  props: {
    src: {
      type: Array,
      required: true
    },
    arrows: {
      type: Boolean,
      default: true
    },
    actions: {
      type: Boolean,
      default: true
    },
    horizontalQuickView: Boolean
  },
  data: function data () {
    return {
      quickView: false,
      currentSlide: 0
    }
  },
  methods: {
    toggleQuickView: function toggleQuickView () {
      this.quickView = !this.quickView;
    },
    goToSlide: function goToSlide (index, noAnimation) {
      this.$refs.slider.goToSlide(index, noAnimation);
    },
    __selectImage: function __selectImage (index) {
      this.goToSlide(index, true);
      this.toggleQuickView();
    },
    __updateCurrentSlide: function __updateCurrentSlide (value) {
      this.currentSlide = value;
      this.$emit('slide', value);
    }
  }
};

var QInfiniteScroll = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-infinite-scroll"},[_c('div',{ref:"content",staticClass:"q-infinite-scroll-content"},[_vm._t("default")],2),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.fetching),expression:"fetching"}],staticClass:"q-infinite-scroll-message"},[_vm._t("message")],2)])},staticRenderFns: [],
  name: 'q-infinite-scroll',
  props: {
    handler: {
      type: Function,
      required: true
    },
    inline: Boolean,
    offset: {
      type: Number,
      default: 0
    }
  },
  data: function data () {
    return {
      index: 0,
      fetching: false,
      working: true
    }
  },
  methods: {
    poll: function poll () {
      if (this.fetching || !this.working) {
        return
      }

      var
        containerHeight = height(this.scrollContainer),
        containerBottom = offset(this.scrollContainer).top + containerHeight,
        triggerPosition = offset(this.element).top + height(this.element) - (this.offset || containerHeight);

      if (triggerPosition < containerBottom) {
        this.loadMore();
      }
    },
    loadMore: function loadMore () {
      var this$1 = this;

      if (this.fetching || !this.working) {
        return
      }

      this.index++;
      this.fetching = true;
      this.handler(this.index, function (stopLoading) {
        this$1.fetching = false;
        if (stopLoading) {
          this$1.stop();
          return
        }
        if (this$1.element.closest('body')) {
          this$1.poll();
        }
      });
    },
    reset: function reset () {
      this.index = 0;
    },
    resume: function resume () {
      this.working = true;
      this.scrollContainer.addEventListener('scroll', this.poll);
      this.poll();
    },
    stop: function stop () {
      this.working = false;
      this.scrollContainer.removeEventListener('scroll', this.poll);
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.poll = debounce(this$1.poll, 50);
      this$1.element = this$1.$refs.content;

      this$1.scrollContainer = this$1.inline ? this$1.$el : getScrollTarget(this$1.$el);
      if (this$1.working) {
        this$1.scrollContainer.addEventListener('scroll', this$1.poll);
      }

      this$1.poll();
    });
  },
  beforeDestroy: function beforeDestroy () {
    this.scrollContainer.removeEventListener('scroll', this.poll);
  }
};

var QInnerLoading = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.visible)?_c('div',{staticClass:"q-inner-loading animate-fade absolute-full column flex-center",class:{dark: _vm.dark}},[_vm._t("default",[_c('q-spinner',{attrs:{"size":_vm.size,"color":_vm.color}})])],2):_vm._e()},staticRenderFns: [],
  name: 'q-inner-loading',
  components: {
    QSpinner: QSpinner
  },
  props: {
    dark: Boolean,
    visible: Boolean,
    size: {
      type: [String, Number],
      default: 42
    },
    color: String
  }
};

var QKnob = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-knob non-selectable",class:_vm.classes,style:({width: _vm.size, height: _vm.size})},[_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan",value:(_vm.__pan),expression:"__pan"}],on:{"click":_vm.__onInput}},[_c('svg',{attrs:{"viewBox":"0 0 100 100"}},[_c('path',{class:("text-" + (_vm.trackColor)),attrs:{"d":"M 50,50 m 0,-47\n           a 47,47 0 1 1 0,94\n           a 47,47 0 1 1 0,-94","stroke":"currentColor","stroke-width":_vm.lineWidth,"fill-opacity":"0"}}),_vm._v(" "),_c('path',{style:(_vm.svgStyle),attrs:{"stroke-linecap":"round","fill-opacity":"0","d":"M 50,50 m 0,-47\n           a 47,47 0 1 1 0,94\n           a 47,47 0 1 1 0,-94","stroke":"currentColor","stroke-width":_vm.lineWidth}})]),_vm._v(" "),_c('div',{staticClass:"q-knob-label row flex-center content-center"},[(!_vm.$slots.default)?_c('span',[_vm._v(_vm._s(_vm.value))]):_vm._t("default")],2)])])},staticRenderFns: [],
  name: 'q-knob',
  directives: {
    TouchPan: TouchPan
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    color: String,
    trackColor: {
      type: String,
      default: 'grey-3'
    },
    lineWidth: {
      type: String,
      default: '6px'
    },
    size: {
      type: String,
      default: '100px'
    },
    step: {
      type: Number,
      default: 1
    },
    disable: Boolean,
    readonly: Boolean
  },
  computed: {
    classes: function classes () {
      var cls = [];
      if (this.disable) {
        cls.push('disabled');
      }
      if (!this.readonly) {
        cls.push('cursor-pointer');
      }
      if (this.color) {
        cls.push(("text-" + (this.color)));
      }
      return cls
    },
    svgStyle: function svgStyle () {
      return {
        'stroke-dasharray': '295.31px, 295.31px',
        'stroke-dashoffset': (295.31 * (1.0 - (this.value - this.min) / (this.max - this.min))) + 'px',
        'transition': this.dragging ? '' : 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
      }
    },
    editable: function editable () {
      return !this.disable && !this.readonly
    }
  },
  data: function data () {
    return {
      dragging: false
    }
  },
  watch: {
    value: function value (value$1) {
      if (value$1 < this.min) {
        this.$emit('input', this.min);
      }
      else if (value$1 > this.max) {
        this.$emit('input', this.max);
      }
    }
  },
  methods: {
    __pan: function __pan (event) {
      if (!this.editable) {
        return
      }
      if (event.isFinal) {
        this.__dragStop(event.evt);
      }
      else if (event.isFirst) {
        this.__dragStart(event.evt);
      }
      else {
        this.__dragMove(event.evt);
      }
    },
    __dragStart: function __dragStart (ev) {
      if (!this.editable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();

      this.centerPosition = this.__getCenter();

      this.dragging = true;
      this.__onInput(ev);
    },
    __dragMove: function __dragMove (ev) {
      if (!this.dragging || !this.editable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.__onInput(ev, this.centerPosition);
    },
    __dragStop: function __dragStop (ev) {
      if (!this.editable) {
        return
      }
      ev.stopPropagation();
      ev.preventDefault();
      this.dragging = false;
    },
    __onInput: function __onInput (ev, center) {
      if ( center === void 0 ) center = this.__getCenter();

      if (!this.editable) {
        return
      }
      var
        pos = position(ev),
        height$$1 = Math.abs(pos.top - center.top),
        distance = Math.sqrt(
          Math.pow(Math.abs(pos.top - center.top), 2) +
          Math.pow(Math.abs(pos.left - center.left), 2)
        ),
        angle = Math.asin(height$$1 / distance) * (180 / Math.PI);

      if (pos.top < center.top) {
        angle = center.left < pos.left ? 90 - angle : 270 + angle;
      }
      else {
        angle = center.left < pos.left ? angle + 90 : 270 - angle;
      }

      var
        model = this.min + (angle / 360) * (this.max - this.min),
        modulo = model % this.step;

      var val = between(
        model - modulo + (Math.abs(modulo) >= this.step / 2 ? (modulo < 0 ? -1 : 1) * this.step : 0),
        this.min,
        this.max
      );

      if (this.value !== val) {
        this.$emit('input', val);
        this.$emit('change', val);
      }
    },
    __getCenter: function __getCenter () {
      var knobOffset = offset(this.$el);
      return {
        top: knobOffset.top + height(this.$el) / 2,
        left: knobOffset.left + width(this.$el) / 2
      }
    }
  }
};

var SideMixin = {
  methods: {
    toggleLeft: function toggleLeft (fn) {
      this.__toggle('left', fn);
    },
    toggleRight: function toggleRight (fn) {
      this.__toggle('right', fn);
    },
    showLeft: function showLeft (fn) {
      this.__show('left', fn);
    },
    showRight: function showRight (fn) {
      this.__show('right', fn);
    },
    hideLeft: function hideLeft (fn) {
      this.__hide('left', fn);
    },
    hideRight: function hideRight (fn) {
      this.__hide('right', fn);
    },
    hideCurrentSide: function hideCurrentSide (fn) {
      if (this.leftState.openedSmall) {
        this.hideLeft(fn);
      }
      else if (this.rightState.openedSmall) {
        this.hideRight(fn);
      }
      else if (typeof fn === 'function') {
        fn();
      }
    },

    __toggle: function __toggle (side) {
      var state = this[side + 'State'];
      if (state.openedSmall || (this[side + 'OverBreakpoint'] && state.openedBig)) {
        this.__hide(side);
      }
      else {
        this.__show(side);
      }
    },
    __popState: function __popState () {
      if (this.$q.platform.has.popstate && window.history.state && window.history.state.__quasar_layout_overlay) {
        window.removeEventListener('popstate', this.__popState);
        this.__hideSmall(this.popStateCallback);
        this.popStateCallback = null;
      }
    },
    __hideSmall: function __hideSmall (fn) {
      this.rightState.openedSmall = false;
      this.leftState.openedSmall = false;
      this.backdrop.percentage = 0;
      if (typeof fn === 'function') {
        setTimeout(fn, 310);
      }
    },
    __hide: function __hide (side, fn) {
      if (typeof side !== 'string') {
        if (this.backdrop.touchEvent) {
          this.backdrop.touchEvent = false;
          return
        }
        side = this.leftState.openedSmall ? 'left' : 'right';
      }

      var state = this[side + 'State'];

      if (!state.openedSmall) {
        state.openedBig = false;
        return
      }

      document.body.classList.remove('with-layout-side-opened');
      if (this.$q.platform.has.popstate) {
        this.popStateCallback = fn;
        if (window.history.state && !window.history.state.__quasar_layout_overlay) {
          window.history.go(-1);
        }
      }
      else {
        this.__hideSmall(fn);
      }
    },
    __show: function __show (side, fn) {
      var state = this[side + 'State'];
      if (this[side + 'OverBreakpoint']) {
        state.openedBig = true;
        if (typeof fn === 'function') {
          fn();
        }
        return
      }

      if (!this.$slots[side]) {
        return
      }

      if (this.$q.platform.has.popstate) {
        if (!window.history.state) {
          window.history.replaceState({__quasar_layout_overlay: true}, '');
        }
        else {
          window.history.state.__quasar_layout_overlay = true;
        }
        var hist = window.history.state || {};
        hist.__quasar_layout_overlay = true;
        window.history.replaceState(hist, '');
        window.history.pushState({}, '');
        window.addEventListener('popstate', this.__popState);
      }

      document.body.classList.add('with-layout-side-opened');
      state.openedSmall = true;
      this.backdrop.percentage = 1;
      if (typeof fn === 'function') {
        fn();
      }
    },
    __openLeftByTouch: function __openLeftByTouch (evt) {
      this.__openByTouch(evt, 'left');
    },
    __openRightByTouch: function __openRightByTouch (evt) {
      this.__openByTouch(evt, 'right', true);
    },
    __openByTouch: function __openByTouch (evt, side, right) {
      var
        width = this[side].w,
        position = between(evt.distance.x, 0, width),
        state = this[side + 'State'],
        withBackdrop = !this[side + 'OverBreakpoint'];

      if (evt.isFinal) {
        var opened = position >= Math.min(75, width);
        this.backdrop.inTransit = false;
        state.inTransit = false;
        if (opened) {
          this.__show(side);
        }
        else {
          this.backdrop.percentage = 0;
        }
        return
      }

      state.position = right
        ? Math.max(width - position, 0)
        : Math.min(0, position - width);

      if (withBackdrop) {
        this.backdrop.percentage = between(position / width, 0, 1);
      }

      if (evt.isFirst) {
        if (withBackdrop) {
          document.body.classList.add('with-layout-side-opened');
          this.backdrop.inTransit = side;
        }
        state.inTransit = true;
      }
    },
    __closeLeftByTouch: function __closeLeftByTouch (evt) {
      this.__closeByTouch(evt, 'left');
    },
    __closeRightByTouch: function __closeRightByTouch (evt) {
      this.__closeByTouch(evt, 'right', true);
    },
    __closeByTouch: function __closeByTouch (evt, side, right) {
      if (side === void 0) {
        right = this.rightState.openedSmall;
        side = right ? 'right' : 'left';
      }
      var
        width = this[side].w,
        state = this[side + 'State'];

      if (this[side + 'OnLayout']) {
        return
      }

      var position = evt.direction === side
        ? between(evt.distance.x, 0, width)
        : 0;

      if (evt.isFinal) {
        var opened = Math.abs(position) < Math.min(75, width);
        this.backdrop.inTransit = false;
        state.inTransit = false;
        if (!opened) {
          this.__hide(side);
        }
        else {
          this.backdrop.percentage = 1;
        }
        return
      }

      state.position = (right ? 1 : -1) * position;
      this.backdrop.percentage = between(1 + (right ? -1 : 1) * position / width, 0, 1);

      if (evt.isFirst) {
        this.backdrop.inTransit = true;
        state.inTransit = true;
        this.backdrop.touchEvent = true;
      }
    }
  }
};

function updateSize (obj, size) {
  if (obj.w !== size.width) {
    obj.w = size.width;
  }
  if (obj.h !== size.height) {
    obj.h = size.height;
  }
}

function updateObject (obj, data) {
  Object.keys(data).forEach(function (key) {
    if (obj[key] !== data[key]) {
      obj[key] = data[key];
    }
  });
}

var QLayout = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"layout"},[(!_vm.$q.platform.is.ios && _vm.$slots.left && !_vm.leftState.openedSmall && !_vm.leftOnLayout)?_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__openLeftByTouch),expression:"__openLeftByTouch",modifiers:{"horizontal":true}}],staticClass:"layout-side-opener fixed-left"}):_vm._e(),_vm._v(" "),(!_vm.$q.platform.is.ios && _vm.$slots.right && !_vm.rightState.openedSmall && !_vm.rightOnLayout)?_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__openRightByTouch),expression:"__openRightByTouch",modifiers:{"horizontal":true}}],staticClass:"layout-side-opener fixed-right"}):_vm._e(),_vm._v(" "),(_vm.$slots.left || _vm.$slots.right)?_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__closeByTouch),expression:"__closeByTouch",modifiers:{"horizontal":true}}],ref:"backdrop",staticClass:"fullscreen layout-backdrop",class:{ 'transition-generic': !_vm.backdrop.inTransit, 'no-pointer-events': _vm.hideBackdrop, },style:({
      opacity: _vm.backdrop.percentage,
      hidden: _vm.hideBackdrop
    }),on:{"click":_vm.__hide}}):_vm._e(),_vm._v(" "),(_vm.$slots.left)?_c('aside',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__closeLeftByTouch),expression:"__closeLeftByTouch",modifiers:{"horizontal":true}}],staticClass:"layout-aside layout-aside-left scroll",class:_vm.computedLeftClass,style:(_vm.computedLeftStyle)},[_vm._t("left"),_vm._v(" "),_c('q-resize-observable',{on:{"resize":_vm.onLeftAsideResize}})],2):_vm._e(),_vm._v(" "),(_vm.$slots.right)?_c('aside',{directives:[{name:"touch-pan",rawName:"v-touch-pan.horizontal",value:(_vm.__closeRightByTouch),expression:"__closeRightByTouch",modifiers:{"horizontal":true}}],staticClass:"layout-aside layout-aside-right scroll",class:_vm.computedRightClass,style:(_vm.computedRightStyle)},[_vm._t("right"),_vm._v(" "),_c('q-resize-observable',{on:{"resize":_vm.onRightAsideResize}})],2):_vm._e(),_vm._v(" "),(_vm.$slots.header || (_vm.$q.theme !== 'ios' && _vm.$slots.navigation))?_c('header',{ref:"header",staticClass:"layout-header transition-generic",class:_vm.computedHeaderClass,style:(_vm.computedHeaderStyle)},[_vm._t("header"),_vm._v(" "),(_vm.$q.theme !== 'ios')?_vm._t("navigation"):_vm._e(),_vm._v(" "),_c('q-resize-observable',{on:{"resize":_vm.onHeaderResize}})],2):_vm._e(),_vm._v(" "),_c('div',{ref:"main",staticClass:"layout-page-container transition-generic",style:(_vm.computedPageStyle)},[_c('main',{staticClass:"layout-page",class:_vm.pageClass,style:(_vm.mainStyle)},[_vm._t("default")],2)]),_vm._v(" "),(_vm.$slots.footer || (_vm.$q.theme === 'ios' && _vm.$slots.navigation))?_c('footer',{ref:"footer",staticClass:"layout-footer transition-generic",class:_vm.computedFooterClass,style:(_vm.computedFooterStyle)},[_vm._t("footer"),_vm._v(" "),(_vm.$q.theme === 'ios')?_vm._t("navigation"):_vm._e(),_vm._v(" "),_c('q-resize-observable',{on:{"resize":_vm.onFooterResize}})],2):_vm._e(),_vm._v(" "),_c('q-scroll-observable',{on:{"scroll":_vm.onPageScroll}}),_vm._v(" "),_c('q-resize-observable',{on:{"resize":_vm.onLayoutResize}}),_vm._v(" "),_c('q-window-resize-observable',{on:{"resize":_vm.onWindowResize}})],1)},staticRenderFns: [],
  name: 'q-layout',
  components: {
    QResizeObservable: QResizeObservable,
    QWindowResizeObservable: QWindowResizeObservable,
    QScrollObservable: QScrollObservable
  },
  directives: {
    TouchPan: TouchPan
  },
  mixins: [SideMixin],
  model: {
    prop: 'sides'
  },
  props: {
    sides: {
      type: Object,
      validator: function (v) { return 'left' in v && 'right' in v; },
      default: function default$1 () {
        return {
          left: true,
          right: true
        }
      }
    },
    view: {
      type: String,
      default: 'hhh lpr fff',
      validator: function (v) { return /^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(v.toLowerCase()); }
    },
    reveal: Boolean,

    leftBreakpoint: {
      type: Number,
      default: 992
    },
    leftStyle: Object,
    leftClass: Object,

    rightBreakpoint: {
      type: Number,
      default: 992
    },
    rightStyle: Object,
    rightClass: Object,

    headerStyle: Object,
    headerClass: Object,

    footerStyle: Object,
    footerClass: Object,

    pageStyle: Object,
    pageClass: Object
  },
  data: function data () {
    return {
      headerOnScreen: true,

      header: {h: 0, w: 0},
      left: {h: 0, w: 0},
      right: {h: 0, w: 0},
      footer: {h: 0, w: 0},
      layout: {h: 0, w: 0},

      scroll: {
        position: 0,
        direction: '',
        directionChanged: false,
        inflexionPosition: 0,
        scrollHeight: 0
      },

      backdrop: {
        inTransit: false,
        touchEvent: false,
        percentage: 0
      },

      leftState: {
        position: 0,
        inTransit: false,
        openedSmall: false,
        openedBig: this.sides.left
      },
      rightState: {
        position: 0,
        inTransit: false,
        openedSmall: false,
        openedBig: this.sides.right
      }
    }
  },
  provide: function provide () {
    return {
      layout: this
    }
  },
  watch: {
    sides: {
      deep: true,
      handler: function handler (val) {
        if (val.left !== this.leftState.openedBig) {
          this.leftState.openedBig = val.left;
        }
        if (val.right !== this.rightState.openedBig) {
          this.rightState.openedBig = val.right;
        }
      }
    },
    'leftState.openedBig': function leftState_openedBig (v) {
      this.$emit('input', {
        left: v,
        right: this.rightState.openedBig
      });
    },
    'rightState.openedBig': function rightState_openedBig (v) {
      this.$emit('input', {
        left: this.leftState.openedBig,
        right: v
      });
    },
    leftOverBreakpoint: function leftOverBreakpoint (v) {
      this.$emit('left-breakpoint', v);
    },
    rightOverBreakpoint: function rightOverBreakpoint (v) {
      this.$emit('right-breakpoint', v);
    }
  },
  computed: {
    leftOverBreakpoint: function leftOverBreakpoint () {
      return !this.leftState.openedSmall && this.leftBreakpoint !== 0 && this.layout.w >= this.leftBreakpoint
    },
    leftOnLayout: function leftOnLayout () {
      return this.leftOverBreakpoint && this.leftState.openedBig
    },
    rightOverBreakpoint: function rightOverBreakpoint () {
      return !this.rightState.openedSmall && this.rightBreakPoint !== 0 && this.layout.w >= this.rightBreakpoint
    },
    rightOnLayout: function rightOnLayout () {
      return this.rightOverBreakpoint && this.rightState.openedBig
    },
    hideBackdrop: function hideBackdrop () {
      return !this.backdrop.inTransit && !this.leftState.openedSmall && !this.rightState.openedSmall
    },
    fixed: function fixed () {
      return {
        header: this.reveal || this.view.indexOf('H') > -1,
        footer: this.view.indexOf('F') > -1,
        left: this.view.indexOf('L') > -1,
        right: this.view.indexOf('R') > -1
      }
    },
    rows: function rows () {
      var rows = this.view.toLowerCase().split(' ');
      return {
        top: rows[0].split(''),
        middle: rows[1].split(''),
        bottom: rows[2].split('')
      }
    },
    computedPageStyle: function computedPageStyle () {
      var
        view = this.rows,
        css$$1 = {};

      if (!view.top.includes('p') && this.fixed.header) {
        css$$1.paddingTop = this.header.h + 'px';
      }
      if (!view.bottom.includes('p') && this.fixed.footer) {
        css$$1.paddingBottom = this.footer.h + 'px';
      }
      if (view.middle[0] !== 'p' && this.leftOnLayout) {
        css$$1.paddingLeft = this.left.w + 'px';
      }
      if (view.middle[2] !== 'p' && this.rightOnLayout) {
        css$$1.paddingRight = this.right.w + 'px';
      }

      return css$$1
    },
    mainStyle: function mainStyle () {
      var css$$1 = {
        minHeight: ("calc(100vh - " + (this.header.h + this.footer.h) + "px)")
      };

      return this.pageStyle
        ? extend({}, this.pageStyle, css$$1)
        : css$$1
    },
    showHeader: function showHeader () {
      return this.headerOnScreen || !this.reveal
    },
    computedHeaderStyle: function computedHeaderStyle () {
      var
        view = this.rows,
        css$$1 = this.showHeader
          ? {}
          : cssTransform(("translateY(" + (-this.header.h) + "px)"));

      if (view.top[0] === 'l' && this.leftOnLayout) {
        css$$1.marginLeft = this.left.w + 'px';
      }
      if (view.top[2] === 'r' && this.rightOnLayout) {
        css$$1.marginRight = this.right.w + 'px';
      }

      return this.headerStyle
        ? extend({}, this.headerStyle, css$$1)
        : css$$1
    },
    computedFooterStyle: function computedFooterStyle () {
      var
        view = this.rows,
        css$$1 = {};

      if (view.bottom[0] === 'l' && this.leftOnLayout) {
        css$$1.marginLeft = this.left.w + 'px';
      }
      if (view.bottom[2] === 'r' && this.rightOnLayout) {
        css$$1.marginRight = this.right.w + 'px';
      }

      return this.footerStyle
        ? extend({}, this.footerStyle, css$$1)
        : css$$1
    },
    computedLeftClass: function computedLeftClass () {
      var classes = {
        'on-layout': this.leftOnLayout,
        'fixed': this.fixed.left || !this.leftOnLayout,
        'on-top': !this.leftOverBreakpoint || this.leftState.inTransit,
        'transition-generic': !this.leftState.inTransit,
        'top-padding': this.fixed.left || this.rows.top[0] === 'l'
      };

      return this.leftClass
        ? extend({}, this.leftClass, classes)
        : classes
    },
    computedRightClass: function computedRightClass () {
      var classes = {
        'on-layout': this.rightOnLayout,
        'fixed': this.fixed.right || !this.rightOnLayout,
        'on-top': !this.rightOverBreakpoint || this.rightState.inTransit,
        'transition-generic': !this.rightState.inTransit,
        'top-padding': this.fixed.right || this.rows.top[2] === 'r'
      };

      return this.rightClass
        ? extend({}, this.rightClass, classes)
        : classes
    },
    computedHeaderClass: function computedHeaderClass () {
      var classes = {'fixed-top': this.fixed.header};
      return this.headerClass
        ? extend({}, this.headerClass, classes)
        : classes
    },
    computedFooterClass: function computedFooterClass () {
      var classes = {'fixed-bottom': this.fixed.footer};
      return this.footerClass
        ? extend({}, this.footerClass, classes)
        : classes
    },
    offsetTop: function offsetTop () {
      return !this.fixed.header
        ? this.header.h - this.scroll.position
        : 0
    },
    offsetBottom: function offsetBottom () {
      if (!this.fixed.footer) {
        var translate = this.scroll.scrollHeight - this.layout.h - this.scroll.position - this.footer.h;
        if (translate < 0) {
          return translate
        }
      }
    },
    computedLeftStyle: function computedLeftStyle () {
      if (!this.leftOnLayout) {
        var style$$1 = this.leftState.inTransit
          ? cssTransform(("translateX(" + (this.leftState.position) + "px)"))
          : cssTransform(("translateX(" + (this.leftState.openedSmall ? 0 : '-100%') + ")"));

        return this.leftStyle
          ? extend({}, this.leftStyle, style$$1)
          : style$$1
      }

      var
        view = this.rows,
        css$$1 = {};

      if (view.top[0] !== 'l') {
        if (this.fixed.left && this.offsetTop) {
          css$$1.top = Math.max(0, this.offsetTop) + 'px';
        }
        else if (this.showHeader) {
          css$$1.top = this.header.h + 'px';
        }
      }
      if (view.bottom[0] !== 'l') {
        if (this.fixed.footer || !this.fixed.left) {
          css$$1.bottom = this.footer.h + 'px';
        }
        else if (this.offsetBottom) {
          css$$1.bottom = -this.offsetBottom + 'px';
        }
      }

      return this.leftStyle
        ? extend({}, this.leftStyle, css$$1)
        : css$$1
    },
    computedRightStyle: function computedRightStyle () {
      if (!this.rightOnLayout) {
        var style$$1 = this.rightState.inTransit
          ? cssTransform(("translateX(" + (this.rightState.position) + "px)"))
          : cssTransform(("translateX(" + (this.rightState.openedSmall ? 0 : '100%') + ")"));

        return this.rightStyle
          ? extend({}, this.rightStyle, style$$1)
          : style$$1
      }

      var
        view = this.rows,
        css$$1 = {};

      if (view.top[2] !== 'r') {
        if (this.fixed.right && this.offsetTop) {
          css$$1.top = Math.max(0, this.offsetTop) + 'px';
        }
        else if (this.showHeader) {
          css$$1.top = this.header.h + 'px';
        }
      }
      if (view.bottom[2] !== 'r') {
        if (this.fixed.footer || !this.fixed.right) {
          css$$1.bottom = this.footer.h + 'px';
        }
        else if (this.offsetBottom) {
          css$$1.bottom = -this.offsetBottom + 'px';
        }
      }

      return this.rightStyle
        ? extend({}, this.rightStyle, css$$1)
        : css$$1
    }
  },
  methods: {
    onHeaderResize: function onHeaderResize (size) {
      updateSize(this.header, size);
    },
    onFooterResize: function onFooterResize (size) {
      updateSize(this.footer, size);
    },
    onLeftAsideResize: function onLeftAsideResize (size) {
      updateSize(this.left, size);
    },
    onRightAsideResize: function onRightAsideResize (size) {
      updateSize(this.right, size);
    },
    onLayoutResize: function onLayoutResize () {
      updateObject(this.scroll, {scrollHeight: getScrollHeight(this.$el)});
    },
    onWindowResize: function onWindowResize (size) {
      updateSize(this.layout, size);
      this.$emit('resize', size);
    },
    onPageScroll: function onPageScroll (data) {
      updateObject(this.scroll, data);

      if (this.reveal) {
        var visible = !(
          data.position > this.header.h &&
          data.direction === 'down' && data.position - data.inflexionPosition >= 100
        );

        if (this.headerOnScreen !== visible) {
          this.headerOnScreen = visible;
        }
      }

      this.$emit('scroll', data);
    }
  }
};

var sides = ['top', 'right', 'bottom', 'left'];

var QFixedPosition = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"z-fixed",class:[("fixed-" + (_vm.corner))],style:(_vm.style)},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-fixed-position',
  props: {
    corner: {
      type: String,
      default: 'bottom-right',
      validator: function (v) { return ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(v); }
    },
    offset: {
      type: Array,
      validator: function (v) { return v.length === 2; }
    }
  },
  inject: ['layout'],
  computed: {
    animated: function animated () {
      return this.pos.top && this.layout.reveal
    },
    pos: function pos () {
      return {
        top: this.corner.indexOf('top') > -1,
        right: this.corner.indexOf('right') > -1,
        bottom: this.corner.indexOf('bottom') > -1,
        left: this.corner.indexOf('left') > -1
      }
    },
    style: function style$$1 () {
      var this$1 = this;

      var
        css$$1 = {},
        layout = this.layout,
        page = layout.computedPageStyle;

      if (this.offset) {
        css$$1.margin = (this.offset[1]) + "px " + (this.offset[0]) + "px";
      }
      if (this.animated && !layout.showHeader) {
        extend(css$$1, cssTransform(("translateY(" + (-layout.header.h) + "px)")));
      }
      else if (this.pos.top && layout.offsetTop) {
        if (layout.offsetTop > 0) {
          extend(css$$1, cssTransform(("translateY(" + (layout.offsetTop) + "px)")));
        }
      }
      else if (this.pos.bottom && layout.offsetBottom) {
        extend(css$$1, cssTransform(("translateY(" + (layout.offsetBottom) + "px)")));
      }

      sides.forEach(function (side) {
        var prop = "padding" + (side.charAt(0).toUpperCase() + side.slice(1));
        if (this$1.pos[side] && page[prop]) {
          css$$1[side] = css$$1[side] ? ("calc(" + (page[prop]) + " + " + (css$$1[side]) + ")") : page[prop];
        }
      });

      return css$$1
    }
  }
};

var QSideLink = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('router-link',{directives:[{name:"ripple",rawName:"v-ripple.mat",modifiers:{"mat":true}}],class:_vm.classes,attrs:{"tag":_vm.tag,"to":_vm.to,"exact":_vm.exact,"append":_vm.append,"replace":_vm.replace,"event":_vm.routerLinkEventName},nativeOn:{"click":function($event){_vm.trigger($event);}}},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-side-link',
  directives: {
    Ripple: Ripple
  },
  mixins: [RouterLinkMixin, ItemMixin],
  props: {
    item: Boolean
  },
  inject: ['layout'],
  computed: {
    classes: function classes () {
      this.link = true;
      return this.item ? itemClasses(this) : 'relative-position'
    }
  },
  methods: {
    trigger: function trigger () {
      var this$1 = this;

      this.layout.hideCurrentSide(function () {
        this$1.$el.dispatchEvent(evt);
      });
    }
  }
};

var QParallax = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-parallax",style:({height: _vm.height + 'px'})},[_c('div',{staticClass:"q-parallax-image absolute-full"},[_c('img',{ref:"img",class:{ready: _vm.imageHasBeenLoaded},attrs:{"src":_vm.src},on:{"load":function($event){_vm.__processImage();}}})]),_vm._v(" "),_c('div',{staticClass:"q-parallax-text absolute-full column flex-center"},[(!_vm.imageHasBeenLoaded)?_vm._t("loading"):_vm._t("default")],2)])},staticRenderFns: [],
  name: 'q-parallax',
  props: {
    src: {
      type: String,
      required: true
    },
    height: {
      type: Number,
      default: 500
    },
    speed: {
      type: Number,
      default: 1,
      validator: function validator (value) {
        return value >= 0 && value <= 1
      }
    }
  },
  data: function data () {
    return {
      imageHasBeenLoaded: false,
      scrolling: false
    }
  },
  watch: {
    src: function src () {
      this.imageHasBeenLoaded = false;
    },
    height: function height$$1 () {
      this.__updatePos();
    }
  },
  methods: {
    __processImage: function __processImage () {
      this.imageHasBeenLoaded = true;
      this.__onResize();
    },
    __onResize: function __onResize () {
      if (!this.imageHasBeenLoaded || !this.scrollTarget) {
        return
      }

      if (this.scrollTarget === window) {
        this.viewportHeight = viewport().height;
      }
      this.imageHeight = height(this.image);
      this.__updatePos();
    },
    __updatePos: function __updatePos () {
      if (!this.imageHasBeenLoaded) {
        return
      }

      var containerTop, containerHeight, containerBottom, top, bottom;

      if (this.scrollTarget === window) {
        containerTop = 0;
        containerHeight = this.viewportHeight;
        containerBottom = containerHeight;
      }
      else {
        containerTop = offset(this.scrollTarget).top;
        containerHeight = height(this.scrollTarget);
        containerBottom = containerTop + containerHeight;
      }
      top = offset(this.container).top;
      bottom = top + this.height;

      if (bottom > containerTop && top < containerBottom) {
        var percentScrolled = (containerBottom - top) / (this.height + containerHeight);
        this.__setPos(Math.round((this.imageHeight - this.height) * percentScrolled * this.speed));
      }
    },
    __setPos: function __setPos (offset$$1) {
      css(this.$refs.img, cssTransform(("translate3D(-50%," + offset$$1 + "px, 0)")));
    }
  },
  created: function created () {
    this.__setPos = frameDebounce(this.__setPos);
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.container = this$1.$el;
      this$1.image = this$1.$refs.img;

      this$1.scrollTarget = getScrollTarget(this$1.$el);
      this$1.resizeHandler = debounce(this$1.__onResize, 50);

      window.addEventListener('resize', this$1.resizeHandler);
      this$1.scrollTarget.addEventListener('scroll', this$1.__updatePos);
      this$1.__onResize();
    });
  },
  beforeDestroy: function beforeDestroy () {
    window.removeEventListener('resize', this.resizeHandler);
    this.scrollTarget.removeEventListener('scroll', this.__updatePos);
  }
};

var QPullToRefresh = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"pull-to-refresh"},[_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical.scroll",value:(_vm.__pull),expression:"__pull",modifiers:{"vertical":true,"scroll":true}}],staticClass:"pull-to-refresh-container",style:(_vm.style)},[_c('div',{staticClass:"pull-to-refresh-message row flex-center"},[_c('q-icon',{directives:[{name:"show",rawName:"v-show",value:(_vm.state !== 'refreshing'),expression:"state !== 'refreshing'"}],class:{'rotate-180': _vm.state === 'pulled'},attrs:{"name":"arrow_downward"}}),_vm._v(" "),_c('q-icon',{directives:[{name:"show",rawName:"v-show",value:(_vm.state === 'refreshing'),expression:"state === 'refreshing'"}],staticClass:"animate-spin",attrs:{"name":_vm.refreshIcon}}),_vm._v("    "),_c('span',{domProps:{"innerHTML":_vm._s(_vm.message)}})],1),_vm._v(" "),_vm._t("default")],2)])},staticRenderFns: [],
  name: 'q-pull-to-refresh',
  components: {
    QIcon: QIcon
  },
  directives: {
    TouchPan: TouchPan
  },
  props: {
    handler: {
      type: Function,
      required: true
    },
    distance: {
      type: Number,
      default: 35
    },
    pullMessage: {
      type: String,
      default: 'Pull down to refresh'
    },
    releaseMessage: {
      type: String,
      default: 'Release to refresh'
    },
    refreshMessage: {
      type: String,
      default: 'Refreshing...'
    },
    refreshIcon: {
      type: String,
      default: 'refresh'
    },
    inline: Boolean,
    disable: Boolean
  },
  data: function data () {
    var height$$1 = 65;

    return {
      state: 'pull',
      pullPosition: -height$$1,
      height: height$$1,
      animating: false,
      pulling: false,
      scrolling: false
    }
  },
  computed: {
    message: function message () {
      switch (this.state) {
        case 'pulled':
          return this.releaseMessage
        case 'refreshing':
          return this.refreshMessage
        case 'pull':
        default:
          return this.pullMessage
      }
    },
    style: function style$$1 () {
      return cssTransform(("translateY(" + (this.pullPosition) + "px)"))
    }
  },
  methods: {
    __pull: function __pull (event) {
      if (this.disable) {
        return
      }

      if (event.isFinal) {
        this.scrolling = false;
        this.pulling = false;
        if (this.scrolling) {
          return
        }
        if (this.state === 'pulled') {
          this.state = 'refreshing';
          this.__animateTo(0);
          this.trigger();
        }
        else if (this.state === 'pull') {
          this.__animateTo(-this.height);
        }
        return
      }
      if (this.animating || this.scrolling || this.state === 'refreshing') {
        return true
      }

      var top = getScrollPosition(this.scrollContainer);
      if (top !== 0 || (top === 0 && event.direction !== 'down')) {
        this.scrolling = true;
        if (this.pulling) {
          this.pulling = false;
          this.state = 'pull';
          this.__animateTo(-this.height);
        }
        return true
      }

      event.evt.preventDefault();
      this.pulling = true;
      this.pullPosition = -this.height + Math.max(0, Math.pow(event.distance.y, 0.85));
      this.state = this.pullPosition > this.distance ? 'pulled' : 'pull';
    },
    __animateTo: function __animateTo (target, done, previousCall) {
      var this$1 = this;

      if (!previousCall && this.animationId) {
        cancelAnimationFrame(this.animating);
      }

      this.pullPosition -= (this.pullPosition - target) / 7;

      if (this.pullPosition - target > 1) {
        this.animating = window.requestAnimationFrame(function () {
          this$1.__animateTo(target, done, true);
        });
      }
      else {
        this.animating = window.requestAnimationFrame(function () {
          this$1.pullPosition = target;
          this$1.animating = false;
          done && done();
        });
      }
    },
    trigger: function trigger () {
      var this$1 = this;

      this.handler(function () {
        this$1.__animateTo(-this$1.height, function () {
          this$1.state = 'pull';
        });
      });
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.scrollContainer = this$1.inline ? this$1.$el.parentNode : getScrollTarget(this$1.$el);
    });
  }
};

var QScrollArea = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.$q.platform.is.desktop)?_c('div',{staticClass:"q-scrollarea relative-position",on:{"mouseenter":function($event){_vm.hover = true;},"mouseleave":function($event){_vm.hover = false;}}},[_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical.nomouse",value:(_vm.__panContainer),expression:"__panContainer",modifiers:{"vertical":true,"nomouse":true}}],ref:"target",staticClass:"scroll relative-position overflow-hidden full-height full-width",on:{"wheel":_vm.__mouseWheel,"mousewheel":_vm.__mouseWheel,"DOMMouseScroll":_vm.__mouseWheel}},[_c('div',{staticClass:"absolute full-width",style:(_vm.mainStyle)},[_vm._t("default"),_vm._v(" "),_c('q-resize-observable',{staticClass:"resize-obs",on:{"resize":_vm.__updateScrollHeight}})],2),_vm._v(" "),_c('q-scroll-observable',{staticClass:"scroll-obs",on:{"scroll":_vm.__updateScroll}})],1),_vm._v(" "),_c('q-resize-observable',{staticClass:"main-resize-obs",on:{"resize":_vm.__updateContainer}}),_vm._v(" "),_c('div',{directives:[{name:"touch-pan",rawName:"v-touch-pan.vertical",value:(_vm.__panThumb),expression:"__panThumb",modifiers:{"vertical":true}}],staticClass:"q-scrollarea-thumb absolute-right",class:{'invisible-thumb': _vm.thumbHidden},style:(_vm.style)})],1):_c('div',{staticClass:"q-scroll-area scroll relative-position",style:(_vm.contentStyle)},[_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-scroll-area',
  components: {
    QResizeObservable: QResizeObservable,
    QScrollObservable: QScrollObservable
  },
  directives: {
    TouchPan: TouchPan
  },
  props: {
    thumbStyle: {
      type: Object,
      default: function () { return ({}); }
    },
    contentStyle: {
      type: Object,
      default: function () { return ({}); }
    },
    contentActiveStyle: {
      type: Object,
      default: function () { return ({}); }
    },
    delay: {
      type: Number,
      default: 1000
    }
  },
  data: function data () {
    return {
      active: false,
      hover: false,
      containerHeight: 0,
      scrollPosition: 0,
      scrollHeight: 0
    }
  },
  computed: {
    thumbHidden: function thumbHidden () {
      return this.scrollHeight <= this.containerHeight || (!this.active && !this.hover)
    },
    thumbHeight: function thumbHeight () {
      return Math.round(between(this.containerHeight * this.containerHeight / this.scrollHeight, 50, this.containerHeight))
    },
    style: function style () {
      var top = this.scrollPercentage * (this.containerHeight - this.thumbHeight);
      return extend({}, this.thumbStyle, {
        top: (top + "px"),
        height: ((this.thumbHeight) + "px")
      })
    },
    mainStyle: function mainStyle () {
      return this.thumbHidden ? this.contentStyle : this.contentActiveStyle
    },
    scrollPercentage: function scrollPercentage () {
      var p = between(this.scrollPosition / (this.scrollHeight - this.containerHeight), 0, 1);
      return Math.round(p * 10000) / 10000
    }
  },
  methods: {
    setScrollPosition: function setScrollPosition$1 (offset, duration) {
      setScrollPosition(this.$refs.target, offset, duration);
    },
    __updateContainer: function __updateContainer (size) {
      if (this.containerHeight !== size.height) {
        this.containerHeight = size.height;
        this.__setActive(true, true);
      }
    },
    __updateScroll: function __updateScroll (scroll) {
      if (this.scrollPosition !== scroll.position) {
        this.scrollPosition = scroll.position;
        this.__setActive(true, true);
      }
    },
    __updateScrollHeight: function __updateScrollHeight (ref) {
      var height = ref.height;

      if (this.scrollHeight !== height) {
        this.scrollHeight = height;
        this.__setActive(true, true);
      }
    },
    __panThumb: function __panThumb (e) {
      e.evt.preventDefault();

      if (e.isFirst) {
        this.refPos = this.scrollPosition;
        this.__setActive(true, true);
        document.body.classList.add('non-selectable');
        if (document.selection) {
          document.selection.empty();
        }
        else if (window.getSelection) {
          window.getSelection().removeAllRanges();
        }
      }
      if (e.isFinal) {
        this.__setActive(false);
        document.body.classList.remove('non-selectable');
      }

      var multiplier = (this.scrollHeight - this.containerHeight) / (this.containerHeight - this.thumbHeight);
      this.$refs.target.scrollTop = this.refPos + (e.direction === 'down' ? 1 : -1) * e.distance.y * multiplier;
    },
    __panContainer: function __panContainer (e) {
      if (e.isFirst) {
        this.refPos = this.scrollPosition;
        this.__setActive(true, true);
      }
      if (e.isFinal) {
        this.__setActive(false);
      }

      var pos = this.refPos + (e.direction === 'down' ? -1 : 1) * e.distance.y;
      this.$refs.target.scrollTop = pos;

      if (pos > 0 && pos + this.containerHeight < this.scrollHeight) {
        e.evt.preventDefault();
      }
    },
    __mouseWheel: function __mouseWheel (e) {
      var el = this.$refs.target;
      el.scrollTop += getMouseWheelDistance(e).pixelY;
      if (el.scrollTop > 0 && el.scrollTop + this.containerHeight < this.scrollHeight) {
        e.preventDefault();
      }
    },
    __setActive: function __setActive (active, timer) {
      clearTimeout(this.timer);
      if (active === this.active) {
        if (active && this.timer) {
          this.__startTimer();
        }
        return
      }

      if (active) {
        this.active = true;
        if (timer) {
          this.__startTimer();
        }
      }
      else {
        this.active = false;
      }
    },
    __startTimer: function __startTimer () {
      var this$1 = this;

      this.timer = setTimeout(function () {
        this$1.active = false;
        this$1.timer = null;
      }, this.delay);
    }
  }
};

var StepTab = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{directives:[{name:"ripple",rawName:"v-ripple.mat",value:(_vm.vm.done),expression:"vm.done",modifiers:{"mat":true}}],staticClass:"q-stepper-tab col-grow flex no-wrap relative-position",class:{ 'step-error': _vm.vm.error, 'step-active': _vm.vm.active, 'step-done': _vm.vm.done, 'step-waiting': _vm.vm.waiting, 'step-disabled': _vm.vm.disable, 'step-colored': _vm.vm.active || _vm.vm.done, 'items-center': !_vm.vm.__stepper.vertical, 'items-start': _vm.vm.__stepper.vertical, 'q-stepper-first': _vm.vm.first, 'q-stepper-last': _vm.vm.last },on:{"click":_vm.__select}},[_c('div',{staticClass:"q-stepper-dot row flex-center q-stepper-line relative-position"},[_c('span',{staticClass:"row flex-center"},[(_vm.vm.stepIcon)?_c('q-icon',{attrs:{"name":_vm.vm.stepIcon}}):_c('span',[_vm._v(_vm._s(_vm.vm.innerOrder + 1))])],1)]),_vm._v(" "),(_vm.vm.title)?_c('div',{staticClass:"q-stepper-label q-stepper-line relative-position"},[_c('div',{staticClass:"q-stepper-title",domProps:{"innerHTML":_vm._s(_vm.vm.title)}}),_vm._v(" "),_c('div',{staticClass:"q-stepper-subtitle",domProps:{"innerHTML":_vm._s(_vm.vm.subtitle)}})]):_vm._e()])},staticRenderFns: [],
  name: 'q-step-header',
  components: {
    QIcon: QIcon
  },
  directives: {
    Ripple: Ripple
  },
  props: ['vm'],
  methods: {
    __select: function __select () {
      this.vm.select();
    }
  }
};

var QStep = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-stepper-step",style:(_vm.style)},[(_vm.__stepper.vertical)?_c('step-tab',{attrs:{"vm":this}}):_vm._e(),_vm._v(" "),_c('q-slide-transition',[(_vm.active)?_c('div',{staticClass:"q-stepper-step-content"},[_c('div',{staticClass:"q-stepper-step-inner"},[_vm._t("default")],2)]):_vm._e()])],1)},staticRenderFns: [],
  name: 'q-step',
  components: {
    QSlideTransition: QSlideTransition,
    StepTab: StepTab
  },
  props: {
    name: {
      type: [Number, String],
      default: function default$1 () {
        return uid()
      }
    },
    default: Boolean,
    title: {
      type: String,
      required: true
    },
    subtitle: String,
    icon: String,
    order: [Number, String],
    error: Boolean,
    activeIcon: String,
    errorIcon: String,
    doneIcon: String,
    disable: Boolean
  },
  inject: ['__stepper'],
  watch: {
    order: function order () {
      this.__stepper.__sortSteps();
    }
  },
  data: function data () {
    return {
      innerOrder: 0,
      first: false,
      last: false
    }
  },
  computed: {
    stepIcon: function stepIcon () {
      var data = this.__stepper;

      if (this.active) {
        return this.activeIcon || data.activeIcon
      }
      if (this.error) {
        return this.errorIcon || data.errorIcon
      }
      if (this.done && !this.disable) {
        return this.doneIcon || data.doneIcon
      }

      return this.icon
    },
    actualOrder: function actualOrder () {
      return parseInt(this.order || this.innerOrder, 10)
    },
    active: function active () {
      return this.__stepper.step === this.name
    },
    done: function done () {
      return !this.disable && this.__stepper.currentOrder > this.innerOrder
    },
    waiting: function waiting () {
      return !this.disable && this.__stepper.currentOrder < this.innerOrder
    },
    style: function style () {
      var ord = this.actualOrder;
      return {
        '-webkit-box-ordinal-group': ord,
        '-ms-flex-order': ord,
        order: ord
      }
    }
  },
  methods: {
    select: function select () {
      if (this.done) {
        this.__stepper.goToStep(this.name);
      }
    }
  },
  mounted: function mounted () {
    this.__stepper.__registerStep(this);
    if (this.default) {
      this.select();
    }
  },
  beforeDestroy: function beforeDestroy () {
    this.__stepper.__unregisterStep(this);
  }
};

var QStepper = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-stepper column overflow-hidden relative-position",class:_vm.classes},[(!_vm.vertical)?_c('div',{staticClass:"q-stepper-header row items-stretch justify-between shadow-1",class:{'alternative-labels': _vm.alternativeLabels}},_vm._l((_vm.steps),function(step,index){return _c('step-tab',{key:step.name,attrs:{"vm":step}})})):_vm._e(),_vm._v(" "),_vm._t("default")],2)},staticRenderFns: [],
  name: 'q-stepper',
  components: {
    StepTab: StepTab
  },
  props: {
    value: [Number, String],
    color: String,
    vertical: Boolean,
    alternativeLabels: Boolean,
    contractable: Boolean,
    doneIcon: {
      type: [String, Boolean],
      default: 'check'
    },
    activeIcon: {
      type: [String, Boolean],
      default: 'edit'
    },
    errorIcon: {
      type: [String, Boolean],
      default: 'warning'
    }
  },
  data: function data () {
    return {
      step: this.value || null,
      steps: []
    }
  },
  provide: function provide () {
    return {
      __stepper: this
    }
  },
  watch: {
    value: function value (v) {
      this.goToStep(v);
    }
  },
  computed: {
    classes: function classes () {
      var cls = [
        ("q-stepper-" + (this.vertical ? 'vertical' : 'horizontal'))
      ];
      if (this.color) {
        cls.push(("text-" + (this.color)));
      }
      if (this.contractable) {
        cls.push("q-stepper-contractable");
      }
      return cls
    },
    hasSteps: function hasSteps () {
      return this.steps.length > 0
    },
    currentStep: function currentStep () {
      var this$1 = this;

      if (this.hasSteps) {
        return this.steps.find(function (step) { return step.name === this$1.step; })
      }
    },
    currentOrder: function currentOrder () {
      if (this.currentStep) {
        return this.currentStep.innerOrder
      }
    },
    length: function length () {
      return this.steps.length
    }
  },
  methods: {
    goToStep: function goToStep (step) {
      if (this.step === step || step === void 0) {
        return
      }

      this.step = step;

      if (this.value !== step) {
        this.$emit('input', step);
        this.$emit('step', step);
      }
    },
    next: function next () {
      this.__go(1);
    },
    previous: function previous () {
      this.__go(-1);
    },
    reset: function reset () {
      if (this.hasSteps) {
        this.goToStep(this.steps[0].name);
      }
    },

    __go: function __go (offset) {
      var
        name,
        index = this.currentOrder;

      if (index === void 0) {
        if (!this.hasSteps) {
          return
        }
        name = this.steps[0].name;
      }
      else {
        do {
          index += offset;
        } while (index >= 0 && index < this.length - 1 && this.steps[index].disable)
        if (index < 0 || index > this.length - 1 || this.steps[index].disable) {
          return
        }
        name = this.steps[index].name;
      }

      this.goToStep(name);
    },
    __sortSteps: function __sortSteps () {
      var this$1 = this;

      this.steps.sort(function (a, b) {
        return a.actualOrder - b.actualOrder
      });
      var last = this.steps.length - 1;
      this.steps.forEach(function (step, index) {
        step.innerOrder = index;
        step.first = index === 0;
        step.last = index === last;
      });
      this.$nextTick(function () {
        if (!this$1.steps.some(function (step) { return step.active; })) {
          this$1.goToStep(this$1.steps[0].name);
        }
      });
    },
    __registerStep: function __registerStep (vm) {
      this.steps.push(vm);
      this.__sortSteps();
      return this
    },
    __unregisterStep: function __unregisterStep (vm) {
      this.steps = this.steps.filter(function (step) { return step !== vm; });
    }
  },
  created: function created () {
    this.__sortSteps = frameDebounce(this.__sortSteps);
  }
};

var QStepperNavigation = {
  name: 'q-stepper-navigation',
  functional: true,
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass,
      slots = ctx.slots();
    var child = [h('div', {staticClass: 'col'}), slots.default];

    data.staticClass = "q-stepper-nav order-last row no-wrap items-center" + (cls ? (" " + cls) : '');

    if (slots.left) {
      child.unshift(slots.left);
    }

    return h('div', data, child)
  }
};

var TabMixin = {
  directives: {
    Ripple: Ripple
  },
  props: {
    label: String,
    icon: String,
    disable: Boolean,
    hidden: Boolean,
    hide: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: function default$1 () {
        return uid()
      }
    },
    alert: Boolean,
    count: [Number, String],
    color: String
  },
  inject: ['data', 'selectTab'],
  computed: {
    active: function active () {
      var sel = this.data.tabName === this.name;
      if (sel) {
        this.$emit('select', this.name);
      }
      return sel
    },
    classes: function classes () {
      var cls = {
        active: this.active,
        hidden: this.hidden,
        disabled: this.disable,
        'icon-and-label': this.icon && this.label,
        'hide-icon': this.hide === 'icon',
        'hide-label': this.hide === 'label'
      };

      var color = this.data.inverted
        ? this.color || this.data.color
        : this.color;

      if (color) {
        cls[("text-" + color)] = this.$q.theme === 'ios' ? this.active : true;
      }

      return cls
    },
    barStyle: function barStyle () {
      if (!this.active || !this.data.highlight) {
        return 'display: none;'
      }
    }
  },
  methods: {
    __getTabContent: function __getTabContent (h) {
      var child = [];

      this.icon && child.push(h(QIcon, {
        staticClass: 'q-tab-icon',
        props: {
          name: this.icon
        }
      }));

      this.label && child.push(h('span', {
        staticClass: 'q-tab-label',
        domProps: {
          innerHTML: this.label
        }
      }));

      if (this.count) {
        child.push(h(QChip, {
          props: {
            floating: true
          }
        }, [ this.count ]));
      }
      else if (this.alert) {
        child.push(h('div', {
          staticClass: 'q-dot'
        }));
      }

      child.push(this.$slots.default);
      if (this.$q.theme !== 'ios') {
        child.push(h('div', {
          staticClass: 'q-tabs-bar',
          style: this.barStyle
        }));
      }

      return child
    }
  }
};

var QRouteTab = {
  name: 'q-route-tab',
  mixins: [TabMixin, RouterLinkMixin],
  watch: {
    $route: function $route () {
      this.checkIfSelected();
    }
  },
  methods: {
    select: function select () {
      this.$emit('click', this.name);
      if (!this.disable) {
        this.$el.dispatchEvent(evt);
        this.selectTab(this.name);
      }
    },
    checkIfSelected: function checkIfSelected () {
      var this$1 = this;

      this.$nextTick(function () {
        if (this$1.$el.classList.contains('router-link-active') || this$1.$el.classList.contains('router-link-exact-active')) {
          this$1.selectTab(this$1.name);
        }
      });
    }
  },
  created: function created () {
    this.checkIfSelected();
  },
  render: function render (h) {
    return h('router-link', {
      props: {
        tag: 'div',
        to: this.to,
        replace: this.replace,
        append: this.append,
        event: routerLinkEventName
      },
      nativeOn: {
        click: this.select
      },
      staticClass: 'q-tab column flex-center relative-position',
      'class': this.classes,
      directives: [{
        name: 'ripple',
        modifiers: {
          mat: true
        }
      }]
    }, this.__getTabContent(h))
  }
};

var QTab = {
  name: 'q-tab',
  mixins: [TabMixin],
  props: {
    default: Boolean
  },
  methods: {
    select: function select () {
      this.$emit('click', this.name);
      if (!this.disable) {
        this.selectTab(this.name);
      }
    }
  },
  mounted: function mounted () {
    if (this.default && !this.disable) {
      this.select();
    }
  },
  render: function render (h) {
    return h('div', {
      staticClass: 'q-tab column flex-center relative-position',
      'class': this.classes,
      on: {
        click: this.select
      },
      directives: [{
        name: 'ripple',
        modifiers: {
          mat: true
        }
      }]
    }, this.__getTabContent(h))
  }
};

var QTabPane = {
  name: 'q-tab-pane',
  props: {
    name: {
      type: String,
      required: true
    },
    keepAlive: Boolean
  },
  inject: ['data'],
  data: function data () {
    return {
      shown: false
    }
  },
  computed: {
    active: function active () {
      return this.data.tabName === this.name
    }
  },
  render: function render (h) {
    var node = h('div', {staticClass: 'q-tab-pane', 'class': {hidden: !this.active}}, [this.$slots.default]);
    if (this.keepAlive) {
      if (!this.shown && !this.active) {
        return
      }
      this.shown = true;
      return node
    }
    else {
      this.shown = this.active;
      if (this.active) {
        return node
      }
    }
  }
};

var scrollNavigationSpeed = 5;
var debounceDelay = 50; // in ms

var QTabs = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-tabs flex no-wrap",class:[ ("q-tabs-position-" + (_vm.position)), ("q-tabs-" + (_vm.inverted ? 'inverted' : 'normal')), _vm.noPaneBorder ? 'q-tabs-no-pane-border' : '', _vm.twoLines ? 'q-tabs-two-lines' : '' ]},[_c('div',{ref:"tabs",staticClass:"q-tabs-head row",class:( obj = { glossy: _vm.glossy }, obj[("q-tabs-align-" + (_vm.align))] = true, obj[("bg-" + (_vm.color))] = !_vm.inverted && _vm.color, obj )},[_c('div',{ref:"scroller",staticClass:"q-tabs-scroller row no-wrap"},[_vm._t("title"),_vm._v(" "),(_vm.$q.theme !== 'ios')?_c('div',{staticClass:"relative-position self-stretch q-tabs-global-bar-container",class:[_vm.inverted && _vm.color ? ("text-" + (_vm.color)) : '', _vm.data.highlight ? 'highlight' : '']},[_c('div',{ref:"posbar",staticClass:"q-tabs-bar q-tabs-global-bar",on:{"transitionend":_vm.__updatePosbarTransition}})]):_vm._e()],2),_vm._v(" "),_c('div',{ref:"leftScroll",staticClass:"row flex-center q-tabs-left-scroll",on:{"mousedown":function($event){_vm.__animScrollTo(0);},"touchstart":function($event){_vm.__animScrollTo(0);},"mouseup":_vm.__stopAnimScroll,"touchend":_vm.__stopAnimScroll}},[_c('q-icon',{attrs:{"name":"chevron_left"}})],1),_vm._v(" "),_c('div',{ref:"rightScroll",staticClass:"row flex-center q-tabs-right-scroll",on:{"mousedown":function($event){_vm.__animScrollTo(9999);},"touchstart":function($event){_vm.__animScrollTo(9999);},"mouseup":_vm.__stopAnimScroll,"touchend":_vm.__stopAnimScroll}},[_c('q-icon',{attrs:{"name":"chevron_right"}})],1)]),_vm._v(" "),_c('div',{staticClass:"q-tabs-panes"},[_vm._t("default")],2)])
var obj;},staticRenderFns: [],
  name: 'q-tabs',
  components: {
    QIcon: QIcon
  },
  props: {
    value: String,
    align: {
      type: String,
      default: current === 'ios' ? 'center' : 'left',
      validator: function (v) { return ['left', 'center', 'right', 'justify'].includes(v); }
    },
    position: {
      type: String,
      default: 'top',
      validator: function (v) { return ['top', 'bottom'].includes(v); }
    },
    color: String,
    inverted: Boolean,
    twoLines: Boolean,
    noPaneBorder: Boolean,
    glossy: Boolean
  },
  data: function data () {
    return {
      currentEl: null,
      posbar: {
        width: 0,
        left: 0
      },
      data: {
        highlight: true,
        tabName: this.value || '',
        color: this.color,
        inverted: this.inverted
      }
    }
  },
  watch: {
    value: function value (name) {
      this.selectTab(name);
    },
    color: function color (v) {
      this.data.color = v;
    },
    inverted: function inverted (v) {
      this.data.inverted = v;
    }
  },
  provide: function provide () {
    return {
      data: this.data,
      selectTab: this.selectTab
    }
  },
  methods: {
    selectTab: function selectTab (name) {
      if (this.data.tabName === name) {
        return
      }

      this.data.tabName = name;
      this.$emit('select', name);

      if (this.value !== name) {
        this.$emit('input', name);
      }

      var el = this.__getTabElByName(name);

      if (el) {
        this.__scrollToTab(el);
      }

      if (this.$q.theme !== 'ios') {
        this.currentEl = el;
        this.__repositionBar();
      }
    },
    __repositionBar: function __repositionBar () {
      var this$1 = this;

      clearTimeout(this.timer);

      var needsUpdate = false;
      var
        ref = this.$refs.posbar,
        el = this.currentEl;

      if (this.data.highlight !== false) {
        this.data.highlight = false;
        needsUpdate = true;
      }

      if (!el) {
        this.finalPosbar = {width: 0, left: 0};
        this.__setPositionBar(0, 0);
        return
      }

      var offsetReference = ref.parentNode.offsetLeft;

      if (needsUpdate && this.oldEl) {
        this.__setPositionBar(
          this.oldEl.getBoundingClientRect().width,
          this.oldEl.offsetLeft - offsetReference
        );
      }

      this.timer = setTimeout(function () {
        var
          width$$1 = el.getBoundingClientRect().width,
          left = el.offsetLeft - offsetReference;

        ref.classList.remove('contract');
        this$1.oldEl = el;
        this$1.finalPosbar = {width: width$$1, left: left};
        this$1.__setPositionBar(
          this$1.posbar.left < left
            ? left + width$$1 - this$1.posbar.left
            : this$1.posbar.left + this$1.posbar.width - left,
          this$1.posbar.left < left
            ? this$1.posbar.left
            : left
        );
      }, 20);
    },
    __setPositionBar: function __setPositionBar (width$$1, left) {
      if ( width$$1 === void 0 ) width$$1 = 0;
      if ( left === void 0 ) left = 0;

      if (this.posbar.width === width$$1 && this.posbar.left === left) {
        this.__updatePosbarTransition();
        return
      }
      this.posbar = {width: width$$1, left: left};
      css(this.$refs.posbar, cssTransform(("translateX(" + left + "px) scaleX(" + width$$1 + ")")));
    },
    __updatePosbarTransition: function __updatePosbarTransition () {
      if (
        this.finalPosbar.width === this.posbar.width &&
        this.finalPosbar.left === this.posbar.left
      ) {
        this.posbar = {};
        if (this.data.highlight !== true) {
          this.data.highlight = true;
        }
        return
      }

      this.$refs.posbar.classList.add('contract');
      this.__setPositionBar(this.finalPosbar.width, this.finalPosbar.left);
    },
    __redraw: function __redraw () {
      if (!this.$q.platform.is.desktop) {
        return
      }
      if (width(this.$refs.scroller) === 0 && this.$refs.scroller.scrollWidth === 0) {
        return
      }
      if (width(this.$refs.scroller) + 5 < this.$refs.scroller.scrollWidth) {
        this.$refs.tabs.classList.add('scrollable');
        this.scrollable = true;
        this.__updateScrollIndicator();
      }
      else {
        this.$refs.tabs.classList.remove('scrollable');
        this.scrollable = false;
      }
    },
    __updateScrollIndicator: function __updateScrollIndicator () {
      if (!this.$q.platform.is.desktop || !this.scrollable) {
        return
      }
      var action = this.$refs.scroller.scrollLeft + width(this.$refs.scroller) + 5 >= this.$refs.scroller.scrollWidth ? 'add' : 'remove';
      this.$refs.leftScroll.classList[this.$refs.scroller.scrollLeft <= 0 ? 'add' : 'remove']('disabled');
      this.$refs.rightScroll.classList[action]('disabled');
    },
    __getTabElByName: function __getTabElByName (value) {
      var tab = this.$children.find(function (child) { return child.name === value && child.$el && child.$el.nodeType === 1; });
      if (tab) {
        return tab.$el
      }
    },
    __findTabAndScroll: function __findTabAndScroll (name, noAnimation) {
      var this$1 = this;

      setTimeout(function () {
        this$1.__scrollToTab(this$1.__getTabElByName(name), noAnimation);
      }, debounceDelay * 4);
    },
    __scrollToTab: function __scrollToTab (tab, noAnimation) {
      if (!tab || !this.scrollable) {
        return
      }

      var
        contentRect = this.$refs.scroller.getBoundingClientRect(),
        rect = tab.getBoundingClientRect(),
        tabWidth = rect.width,
        offset$$1 = rect.left - contentRect.left;

      if (offset$$1 < 0) {
        if (noAnimation) {
          this.$refs.scroller.scrollLeft += offset$$1;
        }
        else {
          this.__animScrollTo(this.$refs.scroller.scrollLeft + offset$$1);
        }
        return
      }

      offset$$1 += tabWidth - this.$refs.scroller.offsetWidth;
      if (offset$$1 > 0) {
        if (noAnimation) {
          this.$refs.scroller.scrollLeft += offset$$1;
        }
        else {
          this.__animScrollTo(this.$refs.scroller.scrollLeft + offset$$1);
        }
      }
    },
    __animScrollTo: function __animScrollTo (value) {
      var this$1 = this;

      this.__stopAnimScroll();
      this.__scrollTowards(value);

      this.scrollTimer = setInterval(function () {
        if (this$1.__scrollTowards(value)) {
          this$1.__stopAnimScroll();
        }
      }, 5);
    },
    __stopAnimScroll: function __stopAnimScroll () {
      clearInterval(this.scrollTimer);
    },
    __scrollTowards: function __scrollTowards (value) {
      var
        scrollPosition = this.$refs.scroller.scrollLeft,
        direction = value < scrollPosition ? -1 : 1,
        done = false;

      scrollPosition += direction * scrollNavigationSpeed;
      if (scrollPosition < 0) {
        done = true;
        scrollPosition = 0;
      }
      else if (
        (direction === -1 && scrollPosition <= value) ||
        (direction === 1 && scrollPosition >= value)
      ) {
        done = true;
        scrollPosition = value;
      }

      this.$refs.scroller.scrollLeft = scrollPosition;
      return done
    }
  },
  created: function created () {
    this.scrollTimer = null;
    this.scrollable = !this.$q.platform.is.desktop;

    // debounce some costly methods;
    // debouncing here because debounce needs to be per instance
    this.__redraw = debounce(this.__redraw, debounceDelay);
    this.__updateScrollIndicator = debounce(this.__updateScrollIndicator, debounceDelay);
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.$refs.scroller.addEventListener('scroll', this$1.__updateScrollIndicator);
      window.addEventListener('resize', this$1.__redraw);

      if (this$1.data.tabName !== '' && this$1.value) {
        this$1.selectTab(this$1.value);
      }

      // let browser drawing stabilize then
      setTimeout(function () {
        this$1.__redraw();
        this$1.__findTabAndScroll(this$1.data.tabName, true);
      }, debounceDelay);
    });
  },
  beforeDestroy: function beforeDestroy () {
    clearTimeout(this.timer);
    this.__stopAnimScroll();
    this.$refs.scroller.removeEventListener('scroll', this.__updateScrollIndicator);
    window.removeEventListener('resize', this.__redraw);
  }
};

var QToolbar = {
  name: 'q-toolbar',
  functional: true,
  props: {
    color: String,
    inverted: Boolean,
    glossy: Boolean
  },
  render: function render (h, ctx) {
    var
      cls = ctx.data.staticClass,
      prop = ctx.props;

    var classes = "q-toolbar-" + (prop.inverted ? 'inverted' : 'normal');
    if (prop.color) {
      classes += " " + (prop.inverted ? 'text' : 'bg') + "-" + (prop.color);
    }
    if (prop.glossy) {
      classes += " glossy";
    }

    ctx.data.staticClass = "q-toolbar row no-wrap items-center relative-position " + classes + (cls ? (" " + cls) : '');

    return h(
      'div',
      ctx.data,
      ctx.children
    )
  }
};

var QToolbarTitle = {
  name: 'q-toolbar-title',
  functional: true,
  render: function render (h, ctx) {
    var
      data = ctx.data,
      cls = data.staticClass,
      slots = ctx.slots(),
      children = [slots.default];

    if (slots.subtitle) {
      children.push(h('div', { staticClass: 'q-toolbar-subtitle' }, slots.subtitle));
    }
    data.staticClass = "q-toolbar-title" + (cls ? (" " + cls) : '');

    return h('div', data, children)
  }
};

var QTreeItem = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('li',{staticClass:"q-tree-item"},[_c('div',{staticClass:"row inline items-center",class:{'q-tree-link': _vm.model.handler || _vm.isExpandable}},[_c('div',{directives:[{name:"ripple",rawName:"v-ripple.mat",modifiers:{"mat":true}}],staticClass:"q-tree-label relative-position row items-center",on:{"click":_vm.tap}},[(_vm.model.icon)?_c('q-icon',{staticClass:"on-left",attrs:{"name":_vm.model.icon}}):_vm._e(),_vm._v(" "),_c('span',{domProps:{"innerHTML":_vm._s(_vm.model.title)}})],1),_vm._v(" "),(_vm.isExpandable)?_c('span',{staticClass:"on-right",domProps:{"innerHTML":_vm._s(_vm.model.expanded ? _vm.contractHtml : _vm.expandHtml)},on:{"click":_vm.toggle}}):_vm._e()]),_vm._v(" "),_c('q-slide-transition',[_c('ul',{directives:[{name:"show",rawName:"v-show",value:(_vm.isExpandable && _vm.model.expanded),expression:"isExpandable && model.expanded"}]},_vm._l((_vm.model.children),function(item){return _c('q-tree-item',{key:item.id || item.title,attrs:{"model":item,"contract-html":_vm.contractHtml,"expand-html":_vm.expandHtml}})}))])],1)},staticRenderFns: [],
  name: 'q-tree-item',
  components: {
    QIcon: QIcon,
    QSlideTransition: QSlideTransition
  },
  directives: {
    Ripple: Ripple
  },
  props: ['model', 'contractHtml', 'expandHtml'],
  methods: {
    tap: function tap () {
      if (typeof this.model.handler === 'function') {
        this.model.handler(this.model);
      }
      this.toggle();
    },
    toggle: function toggle () {
      if (this.isExpandable) {
        this.model.expanded = !this.model.expanded;
      }
    }
  },
  computed: {
    isExpandable: function isExpandable () {
      return this.model.children && this.model.children.length
    }
  }
};

var QTree = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-tree"},[_c('ul',_vm._l((_vm.model),function(item){return _c('q-tree-item',{key:item.id || item.title,attrs:{"model":item,"contract-html":_vm.contractHtml,"expand-html":_vm.expandHtml}})}))])},staticRenderFns: [],
  name: 'q-tree',
  components: {
    QTreeItem: QTreeItem
  },
  props: {
    model: {
      type: Array,
      required: true
    },
    contractHtml: {
      type: String,
      required: true,
      default: '<i class="material-icons">remove_circle</i>'
    },
    expandHtml: {
      type: String,
      required: true,
      default: '<i class="material-icons">add_circle</i>'
    }
  }
};

function initFile (file) {
  file.__doneUploading = false;
  file.__failed = false;
  file.__uploaded = 0;
  file.__progress = 0;
}

var QUploader = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-uploader"},[_c('q-input-frame',{ref:"input",staticClass:"no-margin",attrs:{"prefix":_vm.prefix,"suffix":_vm.suffix,"stack-label":_vm.stackLabel,"float-label":_vm.floatLabel,"error":_vm.error,"disable":_vm.disable,"inverted":"","before":_vm.before,"after":_vm.after,"color":_vm.color,"align":_vm.align,"length":_vm.length,"additional-length":""}},[_c('div',{staticClass:"col row items-center q-input-target",domProps:{"innerHTML":_vm._s(_vm.label)}}),_vm._v(" "),(_vm.uploading)?_c('q-spinner',{staticClass:"q-if-control",attrs:{"slot":"after","size":"24px"},slot:"after"}):_vm._e(),_vm._v(" "),(_vm.uploading)?_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"clear"},on:{"click":_vm.abort},slot:"after"}):_vm._e(),_vm._v(" "),(!_vm.uploading)?_c('q-icon',{staticClass:"q-uploader-pick-button q-if-control relative-position overflow-hidden",attrs:{"slot":"after","name":"add","disabled":_vm.addDisabled},on:{"click":_vm.__pick},slot:"after"},[_c('input',_vm._b({ref:"file",staticClass:"q-uploader-input absolute-full cursor-pointer",attrs:{"type":"file","accept":_vm.extensions},on:{"change":_vm.__add}},'input',{multiple: _vm.multiple},true))]):_vm._e(),_vm._v(" "),(!_vm.hideUploadButton && !_vm.uploading)?_c('q-icon',{staticClass:"q-if-control",attrs:{"slot":"after","name":"cloud_upload","disabled":_vm.length === 0},on:{"click":_vm.upload},slot:"after"}):_vm._e()],1),_vm._v(" "),_c('div',{staticClass:"q-uploader-files scroll"},_vm._l((_vm.files),function(file){return _c('q-item',{key:file.name,staticClass:"q-uploader-file"},[(!_vm.hideUploadProgress)?_c('q-progress',{staticClass:"q-uploader-progress-bg absolute-full",attrs:{"color":file.__failed ? 'negative' : 'grey',"percentage":file.__progress}}):_vm._e(),_vm._v(" "),(!_vm.hideUploadProgress)?_c('div',{staticClass:"q-uploader-progress-text absolute"},[_vm._v(" "+_vm._s(file.__progress)+"% ")]):_vm._e(),_vm._v(" "),(file.__img)?_c('q-item-side',{attrs:{"image":file.__img.src}}):_c('q-item-side',{attrs:{"icon":"insert_drive_file","color":_vm.color}}),_vm._v(" "),_c('q-item-main',{attrs:{"label":file.name,"sublabel":file.__size}}),_vm._v(" "),_c('q-item-side',{attrs:{"right":""}},[_c('q-item-tile',{staticClass:"cursor-pointer",attrs:{"icon":file.__doneUploading ? 'done' : 'clear',"color":_vm.color},on:{"click":function($event){_vm.__remove(file);}}})],1)],1)}))],1)},staticRenderFns: [],
  name: 'q-uploader',
  mixins: [FrameMixin],
  components: {
    QInputFrame: QInputFrame,
    QSpinner: QSpinner,
    QIcon: QIcon,
    QProgress: QProgress,
    QItem: QItem,
    QItemSide: QItemSide,
    QItemMain: QItemMain,
    QItemTile: QItemTile
  },
  props: {
    name: {
      type: String,
      default: 'file'
    },
    headers: Object,
    url: {
      type: String,
      required: true
    },
    urlFactory: {
      type: Function,
      required: false
    },
    additionalFields: {
      type: Array,
      default: function () { return []; }
    },
    method: {
      type: String,
      default: 'POST'
    },
    extensions: String,
    multiple: Boolean,
    hideUploadButton: Boolean,
    hideUploadProgress: Boolean,
    noThumbnails: Boolean,

    color: {
      type: String,
      default: 'primary'
    }
  },
  data: function data () {
    return {
      queue: [],
      files: [],
      uploading: false,
      uploadedSize: 0,
      totalSize: 0,
      xhrs: [],
      focused: false
    }
  },
  computed: {
    length: function length () {
      return this.queue.length
    },
    label: function label () {
      var total = humanStorageSize(this.totalSize);
      return this.uploading
        ? (((this.progress).toFixed(2)) + "% (" + (humanStorageSize(this.uploadedSize)) + " / " + total + ")")
        : ((this.length) + " (" + total + ")")
    },
    progress: function progress () {
      return this.totalSize ? Math.min(99.99, this.uploadedSize / this.totalSize * 100) : 0
    },
    addDisabled: function addDisabled () {
      return !this.multiple && this.length >= 1
    }
  },
  methods: {
    __add: function __add (e) {
      var this$1 = this;

      if (this.addDisabled) {
        return
      }

      var files = Array.prototype.slice.call(e.target.files);
      this.$refs.file.value = '';

      files = files.filter(function (file) { return !this$1.queue.some(function (f) { return file.name === f.name; }); })
        .map(function (file) {
          initFile(file);
          file.__size = humanStorageSize(file.size);

          if (this$1.noThumbnails || !file.type.startsWith('image')) {
            this$1.queue.push(file);
          }
          else {
            var reader = new FileReader();
            reader.onload = function (e) {
              var img = new Image();
              img.src = e.target.result;
              file.__img = img;
              this$1.queue.push(file);
              this$1.__computeTotalSize();
            };
            reader.readAsDataURL(file);
          }

          return file
        });

      this.files = this.files.concat(files);
      this.$emit('add', files);
      this.__computeTotalSize();
    },
    __computeTotalSize: function __computeTotalSize () {
      this.totalSize = this.length
        ? this.queue.map(function (f) { return f.size; }).reduce(function (total, size) { return total + size; })
        : 0;
    },
    __remove: function __remove (file) {
      var
        name = file.name,
        done = file.__doneUploading;

      if (this.uploading && !done) {
        this.$emit('remove:abort', file, file.xhr);
        file.xhr.abort();
        this.uploadedSize -= file.__uploaded;
      }
      else {
        this.$emit(("remove:" + (done ? 'done' : 'cancel')), file, file.xhr);
      }

      if (!done) {
        this.queue = this.queue.filter(function (obj) { return obj.name !== name; });
      }

      file.__removed = true;
      this.files = this.files.filter(function (obj) { return obj.name !== name; });
      this.__computeTotalSize();
    },
    __removeUploaded: function __removeUploaded () {
      this.files = this.files.filter(function (f) { return !f.__doneUploading; });
      this.__computeTotalSize();
    },
    __pick: function __pick () {
      if (!this.addDisabled && this.$q.platform.is.mozilla) {
        this.$refs.file.click();
      }
    },
    __getUploadPromise: function __getUploadPromise (file) {
      var this$1 = this;

      var
        form = new FormData(),
        xhr = new XMLHttpRequest();

      try {
        this.additionalFields.forEach(function (field) {
          form.append(field.name, field.value);
        });
        form.append('Content-Type', file.type || 'application/octet-stream');
        form.append(this.name, file);
      }
      catch (e) {
        return
      }

      initFile(file);
      file.xhr = xhr;
      return new Promise(function (resolve, reject) {
        xhr.upload.addEventListener('progress', function (e) {
          if (file.__removed) { return }
          e.percent = e.total ? e.loaded / e.total : 0;
          var uploaded = e.percent * file.size;
          this$1.uploadedSize += uploaded - file.__uploaded;
          file.__uploaded = uploaded;
          file.__progress = Math.min(99, parseInt(e.percent * 100, 10));
        }, false);

        xhr.onreadystatechange = function () {
          if (xhr.readyState < 4) {
            return
          }
          if (xhr.status && xhr.status < 400) {
            file.__doneUploading = true;
            file.__progress = 100;
            this$1.$emit('uploaded', file, xhr);
            resolve(file);
          }
          else {
            file.__failed = true;
            this$1.$emit('fail', file, xhr);
            reject(xhr);
          }
        };

        xhr.onerror = function () {
          file.__failed = true;
          this$1.$emit('fail', file, xhr);
          reject(xhr);
        };

        var resolver = this$1.urlFactory
          ? this$1.urlFactory(file)
          : Promise.resolve(this$1.url);

        resolver.then(function (url) {
          xhr.open(this$1.method, url, true);
          if (this$1.headers) {
            Object.keys(this$1.headers).forEach(function (key) {
              xhr.setRequestHeader(key, this$1.headers[key]);
            });
          }

          this$1.xhrs.push(xhr);
          xhr.send(form);
        });
      })
    },
    upload: function upload () {
      var this$1 = this;

      var length = this.length;
      if (length === 0) {
        return
      }

      var filesDone = 0;
      this.uploadedSize = 0;
      this.uploading = true;
      this.xhrs = [];
      this.$emit('start');

      var solved = function () {
        filesDone++;
        if (filesDone === length) {
          this$1.uploading = false;
          this$1.xhrs = [];
          this$1.queue = this$1.queue.filter(function (f) { return !f.__doneUploading; });
          this$1.__computeTotalSize();
          this$1.$emit('finish');
        }
      };

      this.queue.map(function (file) { return this$1.__getUploadPromise(file); })
        .forEach(function (promise) {
          promise.then(solved).catch(solved);
        });
    },
    abort: function abort () {
      this.xhrs.forEach(function (xhr) { xhr.abort(); });
    },
    reset: function reset () {
      this.abort();
      this.files = [];
      this.queue = [];
      this.__computeTotalSize();
      this.$emit('reset');
    }
  }
};

var QVideo = {
  name: 'q-video',
  functional: true,
  props: {
    src: {
      type: String,
      required: true
    }
  },
  render: function render (h, ctx) {
    var
      data = ctx.data,
      prop = ctx.props,
      cls = data.staticClass,
      iframeData = {
        attrs: {
          src: prop.src,
          frameborder: '0',
          allowfullscreen: true
        }
      };

    data.staticClass = "q-video" + (cls ? (" " + cls) : '');

    return h('div', data, [ h('iframe', iframeData) ])
  }
};

function updateBinding (el, ref) {
  var value = ref.value;
  var ctx = el.__qbacktotop;

  if (!value) {
    ctx.update();
    return
  }

  if (typeof value === 'number') {
    ctx.offset = value;
    ctx.update();
    return
  }

  if (value && Object(value) !== value) {
    console.error('v-back-to-top requires an object {offset, duration} as parameter', el);
    return
  }

  if (value.offset) {
    if (typeof value.offset !== 'number') {
      console.error('v-back-to-top requires a number as offset', el);
      return
    }
    ctx.offset = value.offset;
  }
  if (value.duration) {
    if (typeof value.duration !== 'number') {
      console.error('v-back-to-top requires a number as duration', el);
      return
    }
    ctx.duration = value.duration;
  }

  ctx.update();
}

var backToTop = {
  name: 'back-to-top',
  bind: function bind (el) {
    var ctx = {
      offset: 200,
      duration: 300,
      update: debounce(function () {
        var trigger = getScrollPosition(ctx.scrollTarget) > ctx.offset;
        if (ctx.visible !== trigger) {
          ctx.visible = trigger;
          el.classList[trigger ? 'remove' : 'add']('hidden');
        }
      }, 25),
      goToTop: function goToTop () {
        setScrollPosition(ctx.scrollTarget, 0, ctx.animate ? ctx.duration : 0);
      }
    };
    el.classList.add('hidden');
    el.__qbacktotop = ctx;
  },
  inserted: function inserted (el, binding) {
    var ctx = el.__qbacktotop;
    ctx.scrollTarget = getScrollTarget(el);
    ctx.animate = binding.modifiers.animate;
    updateBinding(el, binding);
    ctx.scrollTarget.addEventListener('scroll', ctx.update);
    window.addEventListener('resize', ctx.update);
    el.addEventListener('click', ctx.goToTop);
  },
  update: function update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding(el, binding);
    }
  },
  unbind: function unbind (el) {
    var ctx = el.__qbacktotop;
    ctx.scrollTarget.removeEventListener('scroll', ctx.update);
    window.removeEventListener('resize', ctx.update);
    el.removeEventListener('click', ctx.goToTop);
    delete el.__qbacktotop;
  }
};

var goBack = {
  name: 'go-back',
  bind: function bind (el, ref, vnode) {
    var value = ref.value;
    var modifiers = ref.modifiers;

    var ctx = { value: value, position: window.history.length - 1, single: modifiers.single };

    if (Platform.is.cordova) {
      ctx.goBack = function () {
        vnode.context.$router.go(ctx.single ? -1 : ctx.position - window.history.length);
      };
    }
    else {
      ctx.goBack = function () {
        vnode.context.$router.replace(ctx.value);
      };
    }

    el.__qgoback = ctx;
    el.addEventListener('click', ctx.goBack);
  },
  update: function update (el, binding) {
    if (binding.oldValue !== binding.value) {
      el.__qgoback.value = binding.value;
    }
  },
  unbind: function unbind (el) {
    el.removeEventListener('click', el.__qgoback.goBack);
    delete el.__qgoback;
  }
};

function updateBinding$1 (el, selector) {
  var
    ctx = el.__qmove,
    parent = el.parentNode;

  if (!ctx.target) {
    ctx.target = document.querySelector(selector);
  }
  if (ctx.target) {
    if (parent !== ctx.target) {
      ctx.target.appendChild(el);
    }
  }
  else if (parent) {
    parent.removeChild(el);
  }
}

var move = {
  name: 'move',
  bind: function bind (el, ref) {
    el.__qmove = {};
  },
  update: function update (el, ref) {
    var oldValue = ref.oldValue;
    var value = ref.value;

    if (oldValue !== value) {
      el.__qmove.target = document.querySelector(value);
      updateBinding$1(el, value);
    }
  },
  inserted: function inserted (el, ref) {
    var value = ref.value;

    updateBinding$1(el, value);
  },
  unbind: function unbind (el) {
    var parent = el.parentNode;
    if (parent) {
      parent.removeChild(el);
    }
    delete el.__qmove;
  }
};

function updateBinding$2 (el, binding) {
  var ctx = el.__qscrollfire;

  if (typeof binding.value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    console.error('v-scroll-fire requires a function as parameter', el);
    return
  }

  ctx.handler = binding.value;
  if (typeof binding.oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll);
    ctx.scroll();
  }
}

var scrollFire = {
  name: 'scroll-fire',
  bind: function bind (el, binding) {
    var ctx = {
      scroll: debounce(function () {
        var containerBottom, elementBottom, fire;

        if (ctx.scrollTarget === window) {
          elementBottom = el.getBoundingClientRect().bottom;
          fire = elementBottom < viewport().height;
        }
        else {
          containerBottom = offset(ctx.scrollTarget).top + height(ctx.scrollTarget);
          elementBottom = offset(el).top + height(el);
          fire = elementBottom < containerBottom;
        }

        if (fire) {
          ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
          ctx.handler(el);
        }
      }, 25)
    };

    el.__qscrollfire = ctx;
  },
  inserted: function inserted (el, binding) {
    var ctx = el.__qscrollfire;
    ctx.scrollTarget = getScrollTarget(el);
    updateBinding$2(el, binding);
  },
  update: function update (el, binding) {
    if (binding.value !== binding.oldValue) {
      updateBinding$2(el, binding);
    }
  },
  unbind: function unbind (el) {
    var ctx = el.__qscrollfire;
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    delete el.__qscrollfire;
  }
};

function updateBinding$3 (el, binding) {
  var ctx = el.__qscroll;

  if (typeof binding.value !== 'function') {
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    console.error('v-scroll requires a function as parameter', el);
    return
  }

  ctx.handler = binding.value;
  if (typeof binding.oldValue !== 'function') {
    ctx.scrollTarget.addEventListener('scroll', ctx.scroll);
  }
}

var scroll$1 = {
  name: 'scroll',
  bind: function bind (el, binding) {
    var ctx = {
      scroll: function scroll () {
        ctx.handler(getScrollPosition(ctx.scrollTarget));
      }
    };
    el.__qscroll = ctx;
  },
  inserted: function inserted (el, binding) {
    var ctx = el.__qscroll;
    ctx.scrollTarget = getScrollTarget(el);
    updateBinding$3(el, binding);
  },
  update: function update (el, binding) {
    if (binding.oldValue !== binding.value) {
      updateBinding$3(el, binding);
    }
  },
  unbind: function unbind (el) {
    var ctx = el.__qscroll;
    ctx.scrollTarget.removeEventListener('scroll', ctx.scroll);
    delete el.__qscroll;
  }
};

function updateBinding$4 (el, binding) {
  var ctx = el.__qtouchhold;

  ctx.duration = parseInt(binding.arg, 10) || 800;

  if (binding.oldValue !== binding.value) {
    ctx.handler = binding.value;
  }
}

var touchHold = {
  name: 'touch-hold',
  bind: function bind (el, binding) {
    var mouse = !binding.modifiers.nomouse;

    var ctx = {
      start: function start (evt) {
        var startTime = new Date().getTime();
        ctx.timer = setTimeout(function () {
          if (mouse) {
            document.removeEventListener('mousemove', ctx.mouseAbort);
            document.removeEventListener('mouseup', ctx.mouseAbort);
          }

          ctx.handler({
            evt: evt,
            position: position(evt),
            duration: new Date().getTime() - startTime
          });
        }, ctx.duration);
      },
      mouseStart: function mouseStart (evt) {
        if (mouse) {
          document.addEventListener('mousemove', ctx.mouseAbort);
          document.addEventListener('mouseup', ctx.mouseAbort);
        }
        ctx.start(evt);
      },
      abort: function abort (evt) {
        clearTimeout(ctx.timer);
        ctx.timer = null;
      },
      mouseAbort: function mouseAbort (evt) {
        if (mouse) {
          document.removeEventListener('mousemove', ctx.mouseAbort);
          document.removeEventListener('mouseup', ctx.mouseAbort);
        }
        ctx.abort(evt);
      }
    };

    el.__qtouchhold = ctx;
    updateBinding$4(el, binding);
    el.addEventListener('touchstart', ctx.start);
    el.addEventListener('touchend', ctx.abort);
    if (mouse) {
      el.addEventListener('touchmove', ctx.abort);
      el.addEventListener('mousedown', ctx.mouseStart);
    }
  },
  update: function update (el, binding) {
    updateBinding$4(el, binding);
  },
  unbind: function unbind (el, binding) {
    var ctx = el.__qtouchhold;
    el.removeEventListener('touchstart', ctx.start);
    el.removeEventListener('touchend', ctx.abort);
    el.removeEventListener('touchmove', ctx.abort);
    el.removeEventListener('mousedown', ctx.mouseStart);
    document.removeEventListener('mousemove', ctx.mouseAbort);
    document.removeEventListener('mouseup', ctx.mouseAbort);
    delete el.__qtouchhold;
  }
};

function addClass (className) {
  document.body.classList.add(className);
}

ready(function () {
  addClass(Platform.is.desktop ? 'desktop' : 'mobile');
  addClass(Platform.has.touch ? 'touch' : 'no-touch');

  if (Platform.is.ios) {
    addClass('platform-ios');
  }
  else if (Platform.is.android) {
    addClass('platform-android');
  }

  if (Platform.within.iframe) {
    addClass('within-iframe');
  }

  if (Platform.is.cordova) {
    addClass('cordova');
  }

  if (Platform.is.electron) {
    addClass('electron');
  }
});

/* eslint-disable no-extend-native, one-var, no-self-compare */

if (!Array.prototype.includes) {
  Array.prototype.includes = function (searchEl, startFrom) {
    'use strict';

    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false
    }
    var n = parseInt(startFrom, 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    }
    else {
      k = len + n;
      if (k < 0) { k = 0; }
    }
    var curEl;
    while (k < len) {
      curEl = O[k];
      if (searchEl === curEl ||
         (searchEl !== searchEl && curEl !== curEl)) { // NaN !== NaN
        return true
      }
      k++;
    }
    return false
  };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (str, position) {
    position = position || 0;
    return this.substr(position, str.length) === str
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (str, position) {
    var subjectString = this.toString();

    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= str.length;

    var lastIndex = subjectString.indexOf(str, position);

    return lastIndex !== -1 && lastIndex === position
  };
}

if (typeof Element.prototype.matches !== 'function') {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function matches (selector) {
    var
      element = this,
      elements = (element.document || element.ownerDocument).querySelectorAll(selector),
      index = 0;

    while (elements[index] && elements[index] !== element) {
      ++index;
    }

    return Boolean(elements[index])
  };
}

if (typeof Element.prototype.closest !== 'function') {
  Element.prototype.closest = function closest (selector) {
    var el = this;
    while (el && el.nodeType === 1) {
      if (el.matches(selector)) {
        return el
      }
      el = el.parentNode;
    }
    return null
  };
}

if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function value (predicate) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined')
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function')
      }

      var value;
      var
        list = Object(this),
        length = list.length >>> 0,
        thisArg = arguments[1];

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value
        }
      }
      return undefined
    }
  });
}

/*
 * Capture errors
 */
window.onerror = function (message, source, lineno, colno, error) {
  Events.$emit('app:error', {
    message: message,
    source: source,
    lineno: lineno,
    colno: colno,
    error: error
  });
};

/*
 * Credits go to sindresorhus
 */

function rgbToHex (red, green, blue) {
  if (typeof red === 'string') {
    var res = red.match(/\b\d{1,3}\b/g).map(Number);
    red = res[0];
    green = res[1];
    blue = res[2];
  }

  if (
    typeof red !== 'number' ||
    typeof green !== 'number' ||
    typeof blue !== 'number' ||
    red > 255 ||
    green > 255 ||
    blue > 255
  ) {
    throw new TypeError('Expected three numbers below 256')
  }

  return ((blue | green << 8 | red << 16) | 1 << 24).toString(16).slice(1)
}

function hexToRgb (hex) {
  if (typeof hex !== 'string') {
    throw new TypeError('Expected a string')
  }

  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  var num = parseInt(hex, 16);

  return [num >> 16, num >> 8 & 255, num & 255]
}


var colors = Object.freeze({
	rgbToHex: rgbToHex,
	hexToRgb: hexToRgb
});

function getPrimaryHex () {
  var tempDiv = document.createElement('div');
  tempDiv.style.height = '10px';
  tempDiv.style.position = 'absolute';
  tempDiv.style.top = '-100000px';
  tempDiv.className = 'bg-primary';
  document.body.appendChild(tempDiv);
  var primaryColor = window.getComputedStyle(tempDiv).getPropertyValue('background-color');
  document.body.removeChild(tempDiv);

  var rgb = primaryColor.match(/\d+/g);
  return ("#" + (rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]))))
}

function setColor (hexColor) {
  // http://stackoverflow.com/a/33193739
  var metaTag = document.createElement('meta');

  if (Platform.is.winphone) {
    metaTag.setAttribute('name', 'msapplication-navbutton-color');
  }
  else if (Platform.is.safari) {
    metaTag.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
  }
  // Chrome, Firefox OS, Opera, Vivaldi
  else {
    metaTag.setAttribute('name', 'theme-color');
  }

  metaTag.setAttribute('content', hexColor);
  document.getElementsByTagName('head')[0].appendChild(metaTag);
}

var addressbarColor = {
  set: function set (hexColor) {
    if (!Platform.is.mobile || Platform.is.cordova) {
      return
    }
    if (!Platform.is.winphone && !Platform.is.safari && !Platform.is.webkit && !Platform.is.vivaldi) {
      return
    }

    ready(function () {
      setColor(hexColor || getPrimaryHex());
    });
  }
};

function create (opts) {
  var node = document.createElement('div');
  document.body.appendChild(node);

  var state = extend(
    {position: 'top-right'},
    opts,
    {
      value: true,
      appear: true,
      dismissible: !opts.actions || !opts.actions.length
    }
  );

  var vm = new Vue({
    functional: true,
    render: function render (h, ctx) {
      var on = {};
      on[opts.leave === void 0 ? 'dismiss' : 'dismiss-end'] = function () {
        vm.$destroy();
        vm.$el.parentNode.removeChild(vm.$el);
        if (opts.onDismiss) {
          opts.onDismiss();
        }
      };

      return h(
        QAlert, {
          style: {
            padding: '18px'
          },
          on: on,
          props: state
        },
        [
          h('span', {
            domProps: {
              innerHTML: opts.html
            }
          })
        ]
      )
    }
  });

  vm.$mount(node);

  return {
    dismiss: function dismiss () {
      state.value = false;
      vm.$forceUpdate();
    }
  }
}

var Alert = {
  create: create
};

function isActive () {
  return document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
}

function request (target) {
  target = target || document.documentElement;

  if (isActive()) {
    return
  }

  if (target.requestFullscreen) {
    target.requestFullscreen();
  }
  else if (target.msRequestFullscreen) {
    target.msRequestFullscreen();
  }
  else if (target.mozRequestFullScreen) {
    target.mozRequestFullScreen();
  }
  else if (target.webkitRequestFullscreen) {
    target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT); // eslint-disable-line no-undef
  }
}

function exit () {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  }
  else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

function toggle (target) {
  if (isActive()) {
    exit();
  }
  else {
    request(target);
  }
}

var appFullscreen = {
  isActive: isActive,
  request: request,
  exit: exit,
  toggle: toggle
};

var hidden = 'hidden';
var appVisibility = 'visible';

function onchange (evt) {
  var
    v = 'visible',
    h = 'hidden',
    state,
    evtMap = {
      focus: v,
      focusin: v,
      pageshow: v,
      blur: h,
      focusout: h,
      pagehide: h
    };

  evt = evt || window.event;

  if (evt.type in evtMap) {
    state = evtMap[evt.type];
  }
  else {
    state = this[hidden] ? h : v;
  }

  appVisibility = state;
  Events.$emit('app:visibility', state);
}

ready(function () {
  // Standards:
  if (hidden in document) {
    document.addEventListener('visibilitychange', onchange);
  }
  else if ((hidden = 'mozHidden') in document) {
    document.addEventListener('mozvisibilitychange', onchange);
  }
  else if ((hidden = 'webkitHidden') in document) {
    document.addEventListener('webkitvisibilitychange', onchange);
  }
  else if ((hidden = 'msHidden') in document) {
    document.addEventListener('msvisibilitychange', onchange);
  }
  // IE 9 and lower:
  else if ('onfocusin' in document) {
    document.onfocusin = document.onfocusout = onchange;
  }
  // All others:
  else {
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if (document[hidden] !== undefined) {
    onchange({type: document[hidden] ? 'blur' : 'focus'});
  }
});

var appVisibility$1 = {
  isVisible: function () { return appVisibility === 'visible'; }
};

function encode (string) {
  return encodeURIComponent(string)
}

function decode (string) {
  return decodeURIComponent(string)
}

function stringifyCookieValue (value) {
  return encode(value === Object(value) ? JSON.stringify(value) : '' + value)
}

function read (string) {
  if (string === '') {
    return string
  }

  if (string.indexOf('"') === 0) {
    // This is a quoted cookie as according to RFC2068, unescape...
    string = string.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  }

  // Replace server-side written pluses with spaces.
  // If we can't decode the cookie, ignore it, it's unusable.
  // If we can't parse the cookie, ignore it, it's unusable.
  string = decode(string.replace(/\+/g, ' '));

  try {
    string = JSON.parse(string);
  }
  catch (e) {}

  return string
}

function set$1 (key, val, opts) {
  if ( opts === void 0 ) opts = {};

  var time = opts.expires;

  if (typeof opts.expires === 'number') {
    time = new Date();
    time.setMilliseconds(time.getMilliseconds() + opts.expires * 864e+5);
  }

  document.cookie = [
    encode(key), '=', stringifyCookieValue(val),
    time ? '; expires=' + time.toUTCString() : '', // use expires attribute, max-age is not supported by IE
    opts.path ? '; path=' + opts.path : '',
    opts.domain ? '; domain=' + opts.domain : '',
    opts.secure ? '; secure' : ''
  ].join('');
}

function get (key) {
  var
    result = key ? undefined : {},
    cookies = document.cookie ? document.cookie.split('; ') : [],
    i = 0,
    l = cookies.length,
    parts,
    name,
    cookie;

  for (; i < l; i++) {
    parts = cookies[i].split('=');
    name = decode(parts.shift());
    cookie = parts.join('=');

    if (!key) {
      result[name] = cookie;
    }
    else if (key === name) {
      result = read(cookie);
      break
    }
  }

  return result
}

function remove (key, options) {
  set$1(key, '', extend(true, {}, options, {
    expires: -1
  }));
}

function has (key) {
  return get(key) !== undefined
}

var cookies = {
  get: get,
  set: set$1,
  has: has,
  remove: remove,
  all: function () { return get(); }
};

function encode$1 (value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return '__q_date|' + value.toUTCString()
  }
  if (Object.prototype.toString.call(value) === '[object RegExp]') {
    return '__q_expr|' + value.source
  }
  if (typeof value === 'number') {
    return '__q_numb|' + value
  }
  if (typeof value === 'boolean') {
    return '__q_bool|' + (value ? '1' : '0')
  }
  if (typeof value === 'string') {
    return '__q_strn|' + value
  }
  if (typeof value === 'function') {
    return '__q_strn|' + value.toString()
  }
  if (value === Object(value)) {
    return '__q_objt|' + JSON.stringify(value)
  }

  // hmm, we don't know what to do with it,
  // so just return it as is
  return value
}

function decode$1 (value) {
  var type, length, source;

  length = value.length;
  if (length < 10) {
    // then it wasn't encoded by us
    return value
  }

  type = value.substr(0, 8);
  source = value.substring(9);

  switch (type) {
    case '__q_date':
      return new Date(source)

    case '__q_expr':
      return new RegExp(source)

    case '__q_numb':
      return Number(source)

    case '__q_bool':
      return Boolean(source === '1')

    case '__q_strn':
      return '' + source

    case '__q_objt':
      return JSON.parse(source)

    default:
      // hmm, we reached here, we don't know the type,
      // then it means it wasn't encoded by us, so just
      // return whatever value it is
      return value
  }
}

function generateFunctions (fn) {
  return {
    local: fn('local'),
    session: fn('session')
  }
}

var hasStorageItem = generateFunctions(
    function (type) { return function (key) { return window[type + 'Storage'].getItem(key) !== null; }; }
  );
var getStorageLength = generateFunctions(
    function (type) { return function () { return window[type + 'Storage'].length; }; }
  );
var getStorageItem = generateFunctions(function (type) {
    var
      hasFn = hasStorageItem[type],
      storage = window[type + 'Storage'];

    return function (key) {
      if (hasFn(key)) {
        return decode$1(storage.getItem(key))
      }
      return null
    }
  });
var getStorageAtIndex = generateFunctions(function (type) {
    var
      lengthFn = getStorageLength[type],
      getItemFn = getStorageItem[type],
      storage = window[type + 'Storage'];

    return function (index) {
      if (index < lengthFn()) {
        return getItemFn(storage.key(index))
      }
    }
  });
var getAllStorageItems = generateFunctions(function (type) {
    var
      lengthFn = getStorageLength[type],
      storage = window[type + 'Storage'],
      getItemFn = getStorageItem[type];

    return function () {
      var
        result = {},
        key,
        length = lengthFn();

      for (var i = 0; i < length; i++) {
        key = storage.key(i);
        result[key] = getItemFn(key);
      }

      return result
    }
  });
var setStorageItem = generateFunctions(function (type) {
    var storage = window[type + 'Storage'];
    return function (key, value) { storage.setItem(key, encode$1(value)); }
  });
var removeStorageItem = generateFunctions(function (type) {
    var storage = window[type + 'Storage'];
    return function (key) { storage.removeItem(key); }
  });
var clearStorage = generateFunctions(function (type) {
    var storage = window[type + 'Storage'];
    return function () { storage.clear(); }
  });
var storageIsEmpty = generateFunctions(function (type) {
    var getLengthFn = getStorageLength[type];
    return function () { return getLengthFn() === 0; }
  });

var LocalStorage = {
  has: hasStorageItem.local,
  get: {
    length: getStorageLength.local,
    item: getStorageItem.local,
    index: getStorageAtIndex.local,
    all: getAllStorageItems.local
  },
  set: setStorageItem.local,
  remove: removeStorageItem.local,
  clear: clearStorage.local,
  isEmpty: storageIsEmpty.local
};

var SessionStorage = { // eslint-disable-line one-var
  has: hasStorageItem.session,
  get: {
    length: getStorageLength.session,
    item: getStorageItem.session,
    index: getStorageAtIndex.session,
    all: getAllStorageItems.session
  },
  set: setStorageItem.session,
  remove: removeStorageItem.session,
  clear: clearStorage.session,
  isEmpty: storageIsEmpty.session
};

var ActionSheets = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('q-modal',{ref:"dialog",attrs:{"position":"bottom","content-css":_vm.contentCss},on:{"close":function($event){_vm.__dismiss();}}},[(_vm.$q.theme === 'ios')?_c('div',[_c('div',{staticClass:"q-action-sheet"},[(_vm.title)?_c('div',{staticClass:"modal-header",domProps:{"innerHTML":_vm._s(_vm.title)}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"modal-scroll"},[(_vm.gallery)?_c('div',{staticClass:"q-action-sheet-gallery row wrap flex-center"},_vm._l((_vm.actions),function(button,index){return _c('div',{directives:[{name:"ripple",rawName:"v-ripple.mat",modifiers:{"mat":true}}],key:index,staticClass:"cursor-pointer relative-position column inline flex-center",class:button.classes,attrs:{"tabindex":"0"},on:{"click":function($event){_vm.close(button.handler);},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.close(button.handler);}}},[(button.icon)?_c('q-icon',{attrs:{"name":button.icon}}):_vm._e(),_vm._v(" "),(button.avatar)?_c('img',{staticClass:"avatar",attrs:{"src":button.avatar}}):_vm._e(),_vm._v(" "),_c('span',[_vm._v(_vm._s(button.label))])],1)})):_c('q-list',{staticClass:"no-border",attrs:{"link":""}},_vm._l((_vm.actions),function(button,index){return _c('q-item',{directives:[{name:"ripple",rawName:"v-ripple.mat",modifiers:{"mat":true}}],key:index,attrs:{"tabindex":"0"},on:{"click":function($event){_vm.close(button.handler);},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.close(button.handler);}}},[_c('q-item-side',{attrs:{"icon":button.icon,"avatar":button.avatar}}),_vm._v(" "),_c('q-item-main',{attrs:{"inset":"","label":button.label}})],1)}))],1)]),_vm._v(" "),(_vm.dismiss)?_c('div',{staticClass:"q-action-sheet"},[_c('q-item',{directives:[{name:"ripple",rawName:"v-ripple.mat",modifiers:{"mat":true}}],attrs:{"link":"","tabindex":"0"},on:{"click":function($event){_vm.close();},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.close();}}},[_c('q-item-main',[_c('q-item-tile',{staticClass:"text-center",attrs:{"label":""}},[_vm._v(" "+_vm._s(_vm.dismiss.label)+" ")])],1)],1)],1):_vm._e()]):_c('div',[(_vm.title)?_c('div',{staticClass:"modal-header",domProps:{"innerHTML":_vm._s(_vm.title)}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"modal-scroll"},[(_vm.gallery)?_c('div',{staticClass:"q-action-sheet-gallery row wrap flex-center"},_vm._l((_vm.actions),function(button,index){return _c('div',{directives:[{name:"ripple",rawName:"v-ripple.mat",modifiers:{"mat":true}}],key:index,staticClass:"cursor-pointer relative-position column inline flex-center",class:button.classes,attrs:{"tabindex":"0"},on:{"click":function($event){_vm.close(button.handler);},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.close(button.handler);}}},[(button.icon)?_c('q-icon',{attrs:{"name":button.icon}}):_vm._e(),_vm._v(" "),(button.avatar)?_c('img',{staticClass:"avatar",attrs:{"src":button.avatar}}):_vm._e(),_vm._v(" "),_c('span',[_vm._v(_vm._s(button.label))])],1)})):_c('q-list',{staticClass:"no-border",attrs:{"link":""}},_vm._l((_vm.actions),function(button,index){return _c('q-item',{directives:[{name:"ripple",rawName:"v-ripple.mat",modifiers:{"mat":true}}],key:index,class:button.classes,attrs:{"tabindex":"0"},on:{"click":function($event){_vm.close(button.handler);},"keydown":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"enter",13,$event.key)){ return null; }_vm.close(button.handler);}}},[_c('q-item-side',{attrs:{"icon":button.icon,"avatar":button.avatar}}),_vm._v(" "),_c('q-item-main',{attrs:{"inset":"","label":button.label}})],1)}))],1)])])},staticRenderFns: [],
  name: 'q-action-sheet',
  components: {
    QModal: QModal,
    QIcon: QIcon,
    QList: QList,
    QItem: QItem,
    QItemSide: QItemSide,
    QItemMain: QItemMain,
    QItemTile: QItemTile
  },
  directives: {
    Ripple: Ripple
  },
  props: {
    title: String,
    gallery: Boolean,
    actions: {
      type: Array,
      required: true
    },
    dismiss: Object
  },
  computed: {
    contentCss: function contentCss () {
      if (this.$q.theme === 'ios') {
        return {backgroundColor: 'transparent'}
      }
    }
  },
  methods: {
    close: function close (fn) {
      if (!this.$refs.dialog.active) {
        return
      }
      var hasFn = typeof fn === 'function';

      if (hasFn) {
        this.__runCancelHandler = false;
      }
      this.$refs.dialog.close(function () {
        if (hasFn) {
          fn();
        }
      });
    },
    __dismiss: function __dismiss () {
      this.$root.$destroy();
      if (this.__runCancelHandler && this.dismiss && typeof this.dismiss.handler === 'function') {
        this.dismiss.handler();
      }
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.__runCancelHandler = true;
    this.$nextTick(function () {
      this$1.$refs.dialog.open();
      this$1.$root.quasarClose = this$1.close;
    });
  }
};

var index = Modal(ActionSheets);

var vm;
var appIsInProgress = false;
var timeout;
var props = {};

var staticClass = 'q-loading animate-fade fullscreen column flex-center z-max';

function isActive$1 () {
  return appIsInProgress
}

function show (ref) {
  if ( ref === void 0 ) ref = {};
  var delay = ref.delay; if ( delay === void 0 ) delay = 500;
  var message = ref.message; if ( message === void 0 ) message = false;
  var spinnerSize = ref.spinnerSize; if ( spinnerSize === void 0 ) spinnerSize = 80;
  var spinnerColor = ref.spinnerColor; if ( spinnerColor === void 0 ) spinnerColor = 'white';
  var messageColor = ref.messageColor; if ( messageColor === void 0 ) messageColor = 'white';
  var spinner = ref.spinner; if ( spinner === void 0 ) spinner = QSpinner;

  props.spinner = spinner;
  props.message = message;
  props.spinnerSize = spinnerSize;
  props.spinnerColor = spinnerColor;
  props.messageColor = messageColor;

  if (appIsInProgress) {
    vm && vm.$forceUpdate();
    return
  }

  timeout = setTimeout(function () {
    timeout = null;

    var node = document.createElement('div');
    document.body.appendChild(node);
    document.body.classList.add('with-loading');

    vm = new Vue({
      name: 'q-loading',
      el: node,
      functional: true,
      render: function render (h) {
        var child = [
          h(props.spinner, {props: {
            color: props.spinnerColor,
            size: props.spinnerSize
          }})
        ];

        if (message) {
          child.push(h('div', {
            staticClass: ("text-" + (props.messageColor)),
            domProps: {
              innerHTML: props.message
            }
          }));
        }

        return h('div', {staticClass: staticClass}, child)
      }
    });
  }, delay);

  appIsInProgress = true;
  Events.$emit('app:loading', true);
}

function hide () {
  if (!appIsInProgress) {
    return
  }

  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  else {
    vm.$destroy();
    document.body.classList.remove('with-loading');
    document.body.removeChild(vm.$el);
    vm = null;
  }

  appIsInProgress = false;
  Events.$emit('app:loading', false);
}

var index$1 = {
  isActive: isActive$1,
  show: show,
  hide: hide
};

var transitionDuration = 300;
var displayDuration = 2500; // in ms

function parseOptions$1 (opts, defaults) {
  if (!opts) {
    throw new Error('Missing toast options.')
  }

  var options = extend(
    true,
    {},
    defaults,
    typeof opts === 'string' ? {html: opts} : opts
  );

  if (!options.html) {
    throw new Error('Missing toast content/HTML.')
  }

  return options
}

var Toast = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"q-toast-container",class:{active: _vm.active}},[(_vm.stack[0])?_c('div',{staticClass:"q-toast row no-wrap items-center non-selectable",class:_vm.classes,style:({color: _vm.stack[0].color, background: _vm.stack[0].bgColor})},[(_vm.stack[0].icon)?_c('q-icon',{attrs:{"name":_vm.stack[0].icon}}):_vm._e(),_vm._v(" "),(_vm.stack[0].image)?_c('img',{attrs:{"src":_vm.stack[0].image}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"q-toast-message col",domProps:{"innerHTML":_vm._s(_vm.stack[0].html)}}),_vm._v(" "),(_vm.stack[0].button && _vm.stack[0].button.label)?_c('a',{style:({color: _vm.stack[0].button.color}),on:{"click":function($event){_vm.dismiss(_vm.stack[0].button.handler);}}},[_vm._v(" "+_vm._s(_vm.stack[0].button.label)+" ")]):_vm._e(),_vm._v(" "),_c('a',{style:({color: _vm.stack[0].button.color}),on:{"click":function($event){_vm.dismiss();}}},[_c('q-icon',{attrs:{"name":"close"}})],1)],1):_vm._e()])},staticRenderFns: [],
  name: 'q-toast',
  components: {
    QIcon: QIcon
  },
  data: function data () {
    return {
      active: false,
      inTransition: false,
      stack: [],
      timer: null,
      defaults: {
        color: 'white',
        bgColor: '#323232',
        button: {
          color: 'inherit'
        }
      }
    }
  },
  computed: {
    classes: function classes () {
      if (!this.stack.length || !this.stack[0].classes) {
        return {}
      }

      return this.stack[0].classes.split(' ')
    }
  },
  methods: {
    create: function create (options) {
      var this$1 = this;

      this.stack.push(parseOptions$1(options, this.defaults));

      if (this.active || this.inTransition) {
        return
      }

      this.activeTimer = setTimeout(function () {
        this$1.active = true;
      }, 10);
      this.inTransition = true;

      this.__show();
    },
    __show: function __show () {
      var this$1 = this;

      Events.$emit('app:toast', this.stack[0].html);

      this.timer = setTimeout(function () {
        if (this$1.stack.length > 0) {
          this$1.dismiss();
        }
        else {
          this$1.inTransition = false;
        }
      }, transitionDuration + (this.stack[0].timeout || displayDuration));
    },
    dismiss: function dismiss (done) {
      var this$1 = this;

      clearTimeout(this.timer);
      clearTimeout(this.activeTimer);
      this.active = false;
      this.timer = null;

      setTimeout(function () {
        if (typeof this$1.stack[0].onDismiss === 'function') {
          this$1.stack[0].onDismiss();
        }

        this$1.stack.shift();
        done && done();

        if (this$1.stack.length > 0) {
          this$1.active = true;
          this$1.__show();
          return
        }

        this$1.inTransition = false;
      }, transitionDuration + 50);
    },
    setDefaults: function setDefaults (opts) {
      extend(true, this.defaults, opts);
    }
  }
};

var toast;
var defaults;
var toastStack = [];
var installed = false;
var types = [
    {
      name: 'positive',
      defaults: {icon: typeIcon.positive, classes: 'bg-positive'}
    },
    {
      name: 'negative',
      defaults: {icon: typeIcon.negative, classes: 'bg-negative'}
    },
    {
      name: 'info',
      defaults: {icon: typeIcon.info, classes: 'bg-info'}
    },
    {
      name: 'warning',
      defaults: {icon: typeIcon.warning, classes: 'bg-warning'}
    }
  ];

function create$1 (opts, defaults) {
  if (!opts) {
    throw new Error('Missing toast options.')
  }

  if (defaults) {
    opts = extend(
      true,
      typeof opts === 'string' ? {html: opts} : opts,
      defaults
    );
  }

  if (!toast) {
    toastStack.push(opts);
    if (!installed) {
      install$1();
    }
    return
  }

  toast.create(opts);
}

types.forEach(function (type) {
  create$1[type.name] = function (opts) { return create$1(opts, type.defaults); };
});

function install$1 () {
  installed = true;
  ready(function () {
    var node = document.createElement('div');
    document.body.appendChild(node);
    toast = new Vue(Toast).$mount(node);
    if (defaults) {
      toast.setDefaults(defaults);
    }
    if (toastStack.length) {
      setTimeout(function () {
        toastStack.forEach(function (opts) {
          toast.create(opts);
        });
      }, 100);
    }
  });
}

var index$2 = {
  create: create$1,
  setDefaults: function setDefaults (opts) {
    if (toast) {
      toast.setDefaults(opts);
    }
    else {
      defaults = opts;
    }
  }
};

var openUrl = function (url, reject) {
  if (Platform.is.cordova && navigator && navigator.app) {
    return navigator.app.loadUrl(url, {
      openExternal: true
    })
  }

  var win = window.open(url, '_blank');

  if (win) {
    win.focus();
    return win
  }
  else {
    reject();
  }
};

var throttle = function (fn, limit) {
  if ( limit === void 0 ) limit = 250;

  var wait = false;

  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (wait) {
      return
    }

    wait = true;
    fn.apply(this, args);
    setTimeout(function () {
      wait = false;
    }, limit);
  }
};

function noop () {}

var index_esm = {
  version: version,
  install: install,
  start: start,
  theme: theme
};


/* harmony default export */ __webpack_exports__["n"] = (index_esm);


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 21 */,
/* 22 */,
/* 23 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 24 */,
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7), __webpack_require__(8)))

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
  * vue-router v3.0.1
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (false) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (false) {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

function extend (to, from) {
  for (var key in from) {
    to[key] = from[key];
  }
  return to
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    "production" !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (false) {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (false) {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (false) {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (false) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (false) {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (false) {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (false) {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (false) {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (false) {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (false) {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  window.history.replaceState({ key: getStateKey() }, '');
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (false) {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        if (false) {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          "production" !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (expectScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (false) {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  "production" !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '3.0.1';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);


/***/ }),
/* 27 */,
/* 28 */,
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(30);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(31), __esModule: true };

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(32);
var $Object = __webpack_require__(11).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(33);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(1), 'Object', { defineProperty: __webpack_require__(12).f });


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(10);
var core = __webpack_require__(11);
var ctx = __webpack_require__(34);
var hide = __webpack_require__(36);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(35);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(12);
var createDesc = __webpack_require__(41);
module.exports = __webpack_require__(1) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(1) && !__webpack_require__(13)(function () {
  return Object.defineProperty(__webpack_require__(39)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(4);
var document = __webpack_require__(10).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(4);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(43);

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var bind = __webpack_require__(14);
var Axios = __webpack_require__(45);
var defaults = __webpack_require__(5);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(18);
axios.CancelToken = __webpack_require__(59);
axios.isCancel = __webpack_require__(17);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(60);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 44 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(5);
var utils = __webpack_require__(0);
var InterceptorManager = __webpack_require__(54);
var dispatchRequest = __webpack_require__(55);
var isAbsoluteURL = __webpack_require__(57);
var combineURLs = __webpack_require__(58);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, this.defaults, { method: 'get' }, config);
  config.method = config.method.toLowerCase();

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(16);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      }

      if (!utils.isArray(val)) {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });

  return parsed;
};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var transformData = __webpack_require__(56);
var isCancel = __webpack_require__(17);
var defaults = __webpack_require__(5);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(18);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Store */
/* unused harmony export install */
/* unused harmony export mapState */
/* unused harmony export mapMutations */
/* unused harmony export mapGetters */
/* unused harmony export mapActions */
/* unused harmony export createNamespacedHelpers */
/**
 * vuex v3.0.0
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (false) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (false) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (false) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (false) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (false) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (false) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    false
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (false) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (false) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (false) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (false) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (false) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (false) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (false) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (false) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (false) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (false) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (false) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (false) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.0',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["a"] = (index_esm);


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {!function(t,e){ true?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.swal=e():t.swal=e()}(this,function(){return function(t){function e(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=8)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o="swal-button";e.CLASS_NAMES={MODAL:"swal-modal",OVERLAY:"swal-overlay",SHOW_MODAL:"swal-overlay--show-modal",MODAL_TITLE:"swal-title",MODAL_TEXT:"swal-text",ICON:"swal-icon",ICON_CUSTOM:"swal-icon--custom",CONTENT:"swal-content",FOOTER:"swal-footer",BUTTON_CONTAINER:"swal-button-container",BUTTON:o,CONFIRM_BUTTON:o+"--confirm",CANCEL_BUTTON:o+"--cancel",DANGER_BUTTON:o+"--danger",BUTTON_LOADING:o+"--loading",BUTTON_LOADER:o+"__loader"},e.default=e.CLASS_NAMES},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getNode=function(t){var e="."+t;return document.querySelector(e)},e.stringToNode=function(t){var e=document.createElement("div");return e.innerHTML=t.trim(),e.firstChild},e.insertAfter=function(t,e){var n=e.nextSibling;e.parentNode.insertBefore(t,n)},e.removeNode=function(t){t.parentElement.removeChild(t)},e.throwErr=function(t){throw t=t.replace(/ +(?= )/g,""),"SweetAlert: "+(t=t.trim())},e.isPlainObject=function(t){if("[object Object]"!==Object.prototype.toString.call(t))return!1;var e=Object.getPrototypeOf(t);return null===e||e===Object.prototype},e.ordinalSuffixOf=function(t){var e=t%10,n=t%100;return 1===e&&11!==n?t+"st":2===e&&12!==n?t+"nd":3===e&&13!==n?t+"rd":t+"th"}},function(t,e,n){"use strict";function o(t){for(var n in t)e.hasOwnProperty(n)||(e[n]=t[n])}Object.defineProperty(e,"__esModule",{value:!0}),o(n(25));var r=n(26);e.overlayMarkup=r.default,o(n(27)),o(n(28)),o(n(29));var i=n(0),a=i.default.MODAL_TITLE,s=i.default.MODAL_TEXT,c=i.default.ICON,l=i.default.FOOTER;e.iconMarkup='\n  <div class="'+c+'"></div>',e.titleMarkup='\n  <div class="'+a+'"></div>\n',e.textMarkup='\n  <div class="'+s+'"></div>',e.footerMarkup='\n  <div class="'+l+'"></div>\n'},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1);e.CONFIRM_KEY="confirm",e.CANCEL_KEY="cancel";var r={visible:!0,text:null,value:null,className:"",closeModal:!0},i=Object.assign({},r,{visible:!1,text:"Cancel",value:null}),a=Object.assign({},r,{text:"OK",value:!0});e.defaultButtonList={cancel:i,confirm:a};var s=function(t){switch(t){case e.CONFIRM_KEY:return a;case e.CANCEL_KEY:return i;default:var n=t.charAt(0).toUpperCase()+t.slice(1);return Object.assign({},r,{text:n,value:t})}},c=function(t,e){var n=s(t);return!0===e?Object.assign({},n,{visible:!0}):"string"==typeof e?Object.assign({},n,{visible:!0,text:e}):o.isPlainObject(e)?Object.assign({visible:!0},n,e):Object.assign({},n,{visible:!1})},l=function(t){for(var e={},n=0,o=Object.keys(t);n<o.length;n++){var r=o[n],a=t[r],s=c(r,a);e[r]=s}return e.cancel||(e.cancel=i),e},u=function(t){var n={};switch(t.length){case 1:n[e.CANCEL_KEY]=Object.assign({},i,{visible:!1});break;case 2:n[e.CANCEL_KEY]=c(e.CANCEL_KEY,t[0]),n[e.CONFIRM_KEY]=c(e.CONFIRM_KEY,t[1]);break;default:o.throwErr("Invalid number of 'buttons' in array ("+t.length+").\n      If you want more than 2 buttons, you need to use an object!")}return n};e.getButtonListOpts=function(t){var n=e.defaultButtonList;return"string"==typeof t?n[e.CONFIRM_KEY]=c(e.CONFIRM_KEY,t):Array.isArray(t)?n=u(t):o.isPlainObject(t)?n=l(t):!0===t?n=u([!0,!0]):!1===t?n=u([!1,!1]):void 0===t&&(n=e.defaultButtonList),n}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(2),i=n(0),a=i.default.MODAL,s=i.default.OVERLAY,c=n(30),l=n(31),u=n(32),f=n(33);e.injectElIntoModal=function(t){var e=o.getNode(a),n=o.stringToNode(t);return e.appendChild(n),n};var d=function(t){t.className=a,t.textContent=""},p=function(t,e){d(t);var n=e.className;n&&t.classList.add(n)};e.initModalContent=function(t){var e=o.getNode(a);p(e,t),c.default(t.icon),l.initTitle(t.title),l.initText(t.text),f.default(t.content),u.default(t.buttons,t.dangerMode)};var m=function(){var t=o.getNode(s),e=o.stringToNode(r.modalMarkup);t.appendChild(e)};e.default=m},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),r={isOpen:!1,promise:null,actions:{},timer:null},i=Object.assign({},r);e.resetState=function(){i=Object.assign({},r)},e.setActionValue=function(t){if("string"==typeof t)return a(o.CONFIRM_KEY,t);for(var e in t)a(e,t[e])};var a=function(t,e){i.actions[t]||(i.actions[t]={}),Object.assign(i.actions[t],{value:e})};e.setActionOptionsFor=function(t,e){var n=(void 0===e?{}:e).closeModal,o=void 0===n||n;Object.assign(i.actions[t],{closeModal:o})},e.default=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(3),i=n(0),a=i.default.OVERLAY,s=i.default.SHOW_MODAL,c=i.default.BUTTON,l=i.default.BUTTON_LOADING,u=n(5);e.openModal=function(){o.getNode(a).classList.add(s),u.default.isOpen=!0};var f=function(){o.getNode(a).classList.remove(s),u.default.isOpen=!1};e.onAction=function(t){void 0===t&&(t=r.CANCEL_KEY);var e=u.default.actions[t],n=e.value;if(!1===e.closeModal){var i=c+"--"+t;o.getNode(i).classList.add(l)}else f();u.default.promise.resolve(n)},e.getState=function(){var t=Object.assign({},u.default);return delete t.promise,delete t.timer,t},e.stopLoading=function(){for(var t=document.querySelectorAll("."+c),e=0;e<t.length;e++){t[e].classList.remove(l)}}},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){(function(e){t.exports=e.sweetAlert=n(9)}).call(e,n(7))},function(t,e,n){(function(e){t.exports=e.swal=n(10)}).call(e,n(7))},function(t,e,n){"undefined"!=typeof window&&n(11),n(16);var o=n(23).default;t.exports=o},function(t,e,n){var o=n(12);"string"==typeof o&&(o=[[t.i,o,""]]);var r={insertAt:"top"};r.transform=void 0;n(14)(o,r);o.locals&&(t.exports=o.locals)},function(t,e,n){e=t.exports=n(13)(void 0),e.push([t.i,'.swal-icon--error{border-color:#f27474;-webkit-animation:animateErrorIcon .5s;animation:animateErrorIcon .5s}.swal-icon--error__x-mark{position:relative;display:block;-webkit-animation:animateXMark .5s;animation:animateXMark .5s}.swal-icon--error__line{position:absolute;height:5px;width:47px;background-color:#f27474;display:block;top:37px;border-radius:2px}.swal-icon--error__line--left{-webkit-transform:rotate(45deg);transform:rotate(45deg);left:17px}.swal-icon--error__line--right{-webkit-transform:rotate(-45deg);transform:rotate(-45deg);right:16px}@-webkit-keyframes animateErrorIcon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}@keyframes animateErrorIcon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}@-webkit-keyframes animateXMark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}@keyframes animateXMark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}.swal-icon--warning{border-color:#f8bb86;-webkit-animation:pulseWarning .75s infinite alternate;animation:pulseWarning .75s infinite alternate}.swal-icon--warning__body{width:5px;height:47px;top:10px;border-radius:2px;margin-left:-2px}.swal-icon--warning__body,.swal-icon--warning__dot{position:absolute;left:50%;background-color:#f8bb86}.swal-icon--warning__dot{width:7px;height:7px;border-radius:50%;margin-left:-4px;bottom:-11px}@-webkit-keyframes pulseWarning{0%{border-color:#f8d486}to{border-color:#f8bb86}}@keyframes pulseWarning{0%{border-color:#f8d486}to{border-color:#f8bb86}}.swal-icon--success{border-color:#a5dc86}.swal-icon--success:after,.swal-icon--success:before{content:"";border-radius:50%;position:absolute;width:60px;height:120px;background:#fff;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal-icon--success:before{border-radius:120px 0 0 120px;top:-7px;left:-33px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:60px 60px;transform-origin:60px 60px}.swal-icon--success:after{border-radius:0 120px 120px 0;top:-11px;left:30px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:0 60px;transform-origin:0 60px;-webkit-animation:rotatePlaceholder 4.25s ease-in;animation:rotatePlaceholder 4.25s ease-in}.swal-icon--success__ring{width:80px;height:80px;border:4px solid hsla(98,55%,69%,.2);border-radius:50%;box-sizing:content-box;position:absolute;left:-4px;top:-4px;z-index:2}.swal-icon--success__hide-corners{width:5px;height:90px;background-color:#fff;position:absolute;left:28px;top:8px;z-index:1;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal-icon--success__line{height:5px;background-color:#a5dc86;display:block;border-radius:2px;position:absolute;z-index:2}.swal-icon--success__line--tip{width:25px;left:14px;top:46px;-webkit-transform:rotate(45deg);transform:rotate(45deg);-webkit-animation:animateSuccessTip .75s;animation:animateSuccessTip .75s}.swal-icon--success__line--long{width:47px;right:8px;top:38px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-animation:animateSuccessLong .75s;animation:animateSuccessLong .75s}@-webkit-keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@-webkit-keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@-webkit-keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}@keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}.swal-icon--info{border-color:#c9dae1}.swal-icon--info:before{width:5px;height:29px;bottom:17px;border-radius:2px;margin-left:-2px}.swal-icon--info:after,.swal-icon--info:before{content:"";position:absolute;left:50%;background-color:#c9dae1}.swal-icon--info:after{width:7px;height:7px;border-radius:50%;margin-left:-3px;top:19px}.swal-icon{width:80px;height:80px;border-width:4px;border-style:solid;border-radius:50%;padding:0;position:relative;box-sizing:content-box;margin:20px auto}.swal-icon:first-child{margin-top:32px}.swal-icon--custom{width:auto;height:auto;max-width:100%;border:none;border-radius:0}.swal-icon img{max-width:100%;max-height:100%}.swal-title{color:rgba(0,0,0,.65);font-weight:600;text-transform:none;position:relative;display:block;padding:13px 16px;font-size:27px;line-height:normal;text-align:center;margin-bottom:0}.swal-title:first-child{margin-top:26px}.swal-title:not(:first-child){padding-bottom:0}.swal-title:not(:last-child){margin-bottom:13px}.swal-text{font-size:16px;position:relative;float:none;line-height:normal;vertical-align:top;text-align:left;display:inline-block;margin:0;padding:0 10px;font-weight:400;color:rgba(0,0,0,.64);max-width:calc(100% - 20px);overflow-wrap:break-word;box-sizing:border-box}.swal-text:first-child{margin-top:45px}.swal-text:last-child{margin-bottom:45px}.swal-footer{text-align:right;padding-top:13px;margin-top:13px;padding:13px 16px;border-radius:inherit;border-top-left-radius:0;border-top-right-radius:0}.swal-button-container{margin:5px;display:inline-block;position:relative}.swal-button{background-color:#7cd1f9;color:#fff;border:none;box-shadow:none;border-radius:5px;font-weight:600;font-size:14px;padding:10px 24px;margin:0;cursor:pointer}.swal-button[not:disabled]:hover{background-color:#78cbf2}.swal-button:active{background-color:#70bce0}.swal-button:focus{outline:none;box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(43,114,165,.29)}.swal-button[disabled]{opacity:.5;cursor:default}.swal-button::-moz-focus-inner{border:0}.swal-button--cancel{color:#555;background-color:#efefef}.swal-button--cancel[not:disabled]:hover{background-color:#e8e8e8}.swal-button--cancel:active{background-color:#d7d7d7}.swal-button--cancel:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(116,136,150,.29)}.swal-button--danger{background-color:#e64942}.swal-button--danger[not:disabled]:hover{background-color:#df4740}.swal-button--danger:active{background-color:#cf423b}.swal-button--danger:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(165,43,43,.29)}.swal-content{padding:0 20px;margin-top:20px;font-size:medium}.swal-content:last-child{margin-bottom:20px}.swal-content__input,.swal-content__textarea{-webkit-appearance:none;background-color:#fff;border:none;font-size:14px;display:block;box-sizing:border-box;width:100%;border:1px solid rgba(0,0,0,.14);padding:10px 13px;border-radius:2px;transition:border-color .2s}.swal-content__input:focus,.swal-content__textarea:focus{outline:none;border-color:#6db8ff}.swal-content__textarea{resize:vertical}.swal-button--loading{color:transparent}.swal-button--loading~.swal-button__loader{opacity:1}.swal-button__loader{position:absolute;height:auto;width:43px;z-index:2;left:50%;top:50%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%);text-align:center;pointer-events:none;opacity:0}.swal-button__loader div{display:inline-block;float:none;vertical-align:baseline;width:9px;height:9px;padding:0;border:none;margin:2px;opacity:.4;border-radius:7px;background-color:hsla(0,0%,100%,.9);transition:background .2s;-webkit-animation:swal-loading-anim 1s infinite;animation:swal-loading-anim 1s infinite}.swal-button__loader div:nth-child(3n+2){-webkit-animation-delay:.15s;animation-delay:.15s}.swal-button__loader div:nth-child(3n+3){-webkit-animation-delay:.3s;animation-delay:.3s}@-webkit-keyframes swal-loading-anim{0%{opacity:.4}20%{opacity:.4}50%{opacity:1}to{opacity:.4}}@keyframes swal-loading-anim{0%{opacity:.4}20%{opacity:.4}50%{opacity:1}to{opacity:.4}}.swal-overlay{position:fixed;top:0;bottom:0;left:0;right:0;text-align:center;font-size:0;overflow-y:scroll;background-color:rgba(0,0,0,.4);z-index:10000;pointer-events:none;opacity:0;transition:opacity .3s}.swal-overlay:before{content:" ";display:inline-block;vertical-align:middle;height:100%}.swal-overlay--show-modal{opacity:1;pointer-events:auto}.swal-overlay--show-modal .swal-modal{opacity:1;pointer-events:auto;box-sizing:border-box;-webkit-animation:showSweetAlert .3s;animation:showSweetAlert .3s;will-change:transform}.swal-modal{width:478px;opacity:0;pointer-events:none;background-color:#fff;text-align:center;border-radius:5px;position:static;margin:20px auto;display:inline-block;vertical-align:middle;-webkit-transform:scale(1);transform:scale(1);-webkit-transform-origin:50% 50%;transform-origin:50% 50%;z-index:10001;transition:opacity .2s,-webkit-transform .3s;transition:transform .3s,opacity .2s;transition:transform .3s,opacity .2s,-webkit-transform .3s}@media (max-width:500px){.swal-modal{width:calc(100% - 20px)}}@-webkit-keyframes showSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1)}1%{-webkit-transform:scale(.5);transform:scale(.5)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}@keyframes showSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1)}1%{-webkit-transform:scale(.5);transform:scale(.5)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}',""])},function(t,e){function n(t,e){var n=t[1]||"",r=t[3];if(!r)return n;if(e&&"function"==typeof btoa){var i=o(r);return[n].concat(r.sources.map(function(t){return"/*# sourceURL="+r.sourceRoot+t+" */"})).concat([i]).join("\n")}return[n].join("\n")}function o(t){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t))))+" */"}t.exports=function(t){var e=[];return e.toString=function(){return this.map(function(e){var o=n(e,t);return e[2]?"@media "+e[2]+"{"+o+"}":o}).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var o={},r=0;r<this.length;r++){var i=this[r][0];"number"==typeof i&&(o[i]=!0)}for(r=0;r<t.length;r++){var a=t[r];"number"==typeof a[0]&&o[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a))}},e}},function(t,e,n){function o(t,e){for(var n=0;n<t.length;n++){var o=t[n],r=m[o.id];if(r){r.refs++;for(var i=0;i<r.parts.length;i++)r.parts[i](o.parts[i]);for(;i<o.parts.length;i++)r.parts.push(u(o.parts[i],e))}else{for(var a=[],i=0;i<o.parts.length;i++)a.push(u(o.parts[i],e));m[o.id]={id:o.id,refs:1,parts:a}}}}function r(t,e){for(var n=[],o={},r=0;r<t.length;r++){var i=t[r],a=e.base?i[0]+e.base:i[0],s=i[1],c=i[2],l=i[3],u={css:s,media:c,sourceMap:l};o[a]?o[a].parts.push(u):n.push(o[a]={id:a,parts:[u]})}return n}function i(t,e){var n=v(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var o=w[w.length-1];if("top"===t.insertAt)o?o.nextSibling?n.insertBefore(e,o.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),w.push(e);else{if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(e)}}function a(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=w.indexOf(t);e>=0&&w.splice(e,1)}function s(t){var e=document.createElement("style");return t.attrs.type="text/css",l(e,t.attrs),i(t,e),e}function c(t){var e=document.createElement("link");return t.attrs.type="text/css",t.attrs.rel="stylesheet",l(e,t.attrs),i(t,e),e}function l(t,e){Object.keys(e).forEach(function(n){t.setAttribute(n,e[n])})}function u(t,e){var n,o,r,i;if(e.transform&&t.css){if(!(i=e.transform(t.css)))return function(){};t.css=i}if(e.singleton){var l=h++;n=g||(g=s(e)),o=f.bind(null,n,l,!1),r=f.bind(null,n,l,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=c(e),o=p.bind(null,n,e),r=function(){a(n),n.href&&URL.revokeObjectURL(n.href)}):(n=s(e),o=d.bind(null,n),r=function(){a(n)});return o(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;o(t=e)}else r()}}function f(t,e,n,o){var r=n?"":o.css;if(t.styleSheet)t.styleSheet.cssText=x(e,r);else{var i=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function d(t,e){var n=e.css,o=e.media;if(o&&t.setAttribute("media",o),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}function p(t,e,n){var o=n.css,r=n.sourceMap,i=void 0===e.convertToAbsoluteUrls&&r;(e.convertToAbsoluteUrls||i)&&(o=y(o)),r&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var a=new Blob([o],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}var m={},b=function(t){var e;return function(){return void 0===e&&(e=t.apply(this,arguments)),e}}(function(){return window&&document&&document.all&&!window.atob}),v=function(t){var e={};return function(n){return void 0===e[n]&&(e[n]=t.call(this,n)),e[n]}}(function(t){return document.querySelector(t)}),g=null,h=0,w=[],y=n(15);t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");e=e||{},e.attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||(e.singleton=b()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=r(t,e);return o(n,e),function(t){for(var i=[],a=0;a<n.length;a++){var s=n[a],c=m[s.id];c.refs--,i.push(c)}if(t){o(r(t,e),e)}for(var a=0;a<i.length;a++){var c=i[a];if(0===c.refs){for(var l=0;l<c.parts.length;l++)c.parts[l]();delete m[c.id]}}}};var x=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}()},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,o=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(t,e){var r=e.trim().replace(/^"(.*)"$/,function(t,e){return e}).replace(/^'(.*)'$/,function(t,e){return e});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(r))return t;var i;return i=0===r.indexOf("//")?r:0===r.indexOf("/")?n+r:o+r.replace(/^\.\//,""),"url("+JSON.stringify(i)+")"})}},function(t,e,n){var o=n(17);"undefined"==typeof window||window.Promise||(window.Promise=o),n(21),String.prototype.includes||(String.prototype.includes=function(t,e){"use strict";return"number"!=typeof e&&(e=0),!(e+t.length>this.length)&&-1!==this.indexOf(t,e)}),Array.prototype.includes||Object.defineProperty(Array.prototype,"includes",{value:function(t,e){if(null==this)throw new TypeError('"this" is null or not defined');var n=Object(this),o=n.length>>>0;if(0===o)return!1;for(var r=0|e,i=Math.max(r>=0?r:o-Math.abs(r),0);i<o;){if(function(t,e){return t===e||"number"==typeof t&&"number"==typeof e&&isNaN(t)&&isNaN(e)}(n[i],t))return!0;i++}return!1}}),"undefined"!=typeof window&&function(t){t.forEach(function(t){t.hasOwnProperty("remove")||Object.defineProperty(t,"remove",{configurable:!0,enumerable:!0,writable:!0,value:function(){this.parentNode.removeChild(this)}})})}([Element.prototype,CharacterData.prototype,DocumentType.prototype])},function(t,e,n){(function(e){!function(n){function o(){}function r(t,e){return function(){t.apply(e,arguments)}}function i(t){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof t)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],f(t,this)}function a(t,e){for(;3===t._state;)t=t._value;if(0===t._state)return void t._deferreds.push(e);t._handled=!0,i._immediateFn(function(){var n=1===t._state?e.onFulfilled:e.onRejected;if(null===n)return void(1===t._state?s:c)(e.promise,t._value);var o;try{o=n(t._value)}catch(t){return void c(e.promise,t)}s(e.promise,o)})}function s(t,e){try{if(e===t)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var n=e.then;if(e instanceof i)return t._state=3,t._value=e,void l(t);if("function"==typeof n)return void f(r(n,e),t)}t._state=1,t._value=e,l(t)}catch(e){c(t,e)}}function c(t,e){t._state=2,t._value=e,l(t)}function l(t){2===t._state&&0===t._deferreds.length&&i._immediateFn(function(){t._handled||i._unhandledRejectionFn(t._value)});for(var e=0,n=t._deferreds.length;e<n;e++)a(t,t._deferreds[e]);t._deferreds=null}function u(t,e,n){this.onFulfilled="function"==typeof t?t:null,this.onRejected="function"==typeof e?e:null,this.promise=n}function f(t,e){var n=!1;try{t(function(t){n||(n=!0,s(e,t))},function(t){n||(n=!0,c(e,t))})}catch(t){if(n)return;n=!0,c(e,t)}}var d=setTimeout;i.prototype.catch=function(t){return this.then(null,t)},i.prototype.then=function(t,e){var n=new this.constructor(o);return a(this,new u(t,e,n)),n},i.all=function(t){var e=Array.prototype.slice.call(t);return new i(function(t,n){function o(i,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var s=a.then;if("function"==typeof s)return void s.call(a,function(t){o(i,t)},n)}e[i]=a,0==--r&&t(e)}catch(t){n(t)}}if(0===e.length)return t([]);for(var r=e.length,i=0;i<e.length;i++)o(i,e[i])})},i.resolve=function(t){return t&&"object"==typeof t&&t.constructor===i?t:new i(function(e){e(t)})},i.reject=function(t){return new i(function(e,n){n(t)})},i.race=function(t){return new i(function(e,n){for(var o=0,r=t.length;o<r;o++)t[o].then(e,n)})},i._immediateFn="function"==typeof e&&function(t){e(t)}||function(t){d(t,0)},i._unhandledRejectionFn=function(t){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",t)},i._setImmediateFn=function(t){i._immediateFn=t},i._setUnhandledRejectionFn=function(t){i._unhandledRejectionFn=t},void 0!==t&&t.exports?t.exports=i:n.Promise||(n.Promise=i)}(this)}).call(e,n(18).setImmediate)},function(t,e,n){function o(t,e){this._id=t,this._clearFn=e}var r=Function.prototype.apply;e.setTimeout=function(){return new o(r.call(setTimeout,window,arguments),clearTimeout)},e.setInterval=function(){return new o(r.call(setInterval,window,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close()},o.prototype.unref=o.prototype.ref=function(){},o.prototype.close=function(){this._clearFn.call(window,this._id)},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout()},e))},n(19),e.setImmediate=setImmediate,e.clearImmediate=clearImmediate},function(t,e,n){(function(t,e){!function(t,n){"use strict";function o(t){"function"!=typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),n=0;n<e.length;n++)e[n]=arguments[n+1];var o={callback:t,args:e};return l[c]=o,s(c),c++}function r(t){delete l[t]}function i(t){var e=t.callback,o=t.args;switch(o.length){case 0:e();break;case 1:e(o[0]);break;case 2:e(o[0],o[1]);break;case 3:e(o[0],o[1],o[2]);break;default:e.apply(n,o)}}function a(t){if(u)setTimeout(a,0,t);else{var e=l[t];if(e){u=!0;try{i(e)}finally{r(t),u=!1}}}}if(!t.setImmediate){var s,c=1,l={},u=!1,f=t.document,d=Object.getPrototypeOf&&Object.getPrototypeOf(t);d=d&&d.setTimeout?d:t,"[object process]"==={}.toString.call(t.process)?function(){s=function(t){e.nextTick(function(){a(t)})}}():function(){if(t.postMessage&&!t.importScripts){var e=!0,n=t.onmessage;return t.onmessage=function(){e=!1},t.postMessage("","*"),t.onmessage=n,e}}()?function(){var e="setImmediate$"+Math.random()+"$",n=function(n){n.source===t&&"string"==typeof n.data&&0===n.data.indexOf(e)&&a(+n.data.slice(e.length))};t.addEventListener?t.addEventListener("message",n,!1):t.attachEvent("onmessage",n),s=function(n){t.postMessage(e+n,"*")}}():t.MessageChannel?function(){var t=new MessageChannel;t.port1.onmessage=function(t){a(t.data)},s=function(e){t.port2.postMessage(e)}}():f&&"onreadystatechange"in f.createElement("script")?function(){var t=f.documentElement;s=function(e){var n=f.createElement("script");n.onreadystatechange=function(){a(e),n.onreadystatechange=null,t.removeChild(n),n=null},t.appendChild(n)}}():function(){s=function(t){setTimeout(a,0,t)}}(),d.setImmediate=o,d.clearImmediate=r}}("undefined"==typeof self?void 0===t?this:t:self)}).call(e,n(7),n(20))},function(t,e){function n(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function r(t){if(u===setTimeout)return setTimeout(t,0);if((u===n||!u)&&setTimeout)return u=setTimeout,setTimeout(t,0);try{return u(t,0)}catch(e){try{return u.call(null,t,0)}catch(e){return u.call(this,t,0)}}}function i(t){if(f===clearTimeout)return clearTimeout(t);if((f===o||!f)&&clearTimeout)return f=clearTimeout,clearTimeout(t);try{return f(t)}catch(e){try{return f.call(null,t)}catch(e){return f.call(this,t)}}}function a(){b&&p&&(b=!1,p.length?m=p.concat(m):v=-1,m.length&&s())}function s(){if(!b){var t=r(a);b=!0;for(var e=m.length;e;){for(p=m,m=[];++v<e;)p&&p[v].run();v=-1,e=m.length}p=null,b=!1,i(t)}}function c(t,e){this.fun=t,this.array=e}function l(){}var u,f,d=t.exports={};!function(){try{u="function"==typeof setTimeout?setTimeout:n}catch(t){u=n}try{f="function"==typeof clearTimeout?clearTimeout:o}catch(t){f=o}}();var p,m=[],b=!1,v=-1;d.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];m.push(new c(t,e)),1!==m.length||b||r(s)},c.prototype.run=function(){this.fun.apply(null,this.array)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=l,d.addListener=l,d.once=l,d.off=l,d.removeListener=l,d.removeAllListeners=l,d.emit=l,d.prependListener=l,d.prependOnceListener=l,d.listeners=function(t){return[]},d.binding=function(t){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(t){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}},function(t,e,n){"use strict";n(22).polyfill()},function(t,e,n){"use strict";function o(t,e){if(void 0===t||null===t)throw new TypeError("Cannot convert first argument to object");for(var n=Object(t),o=1;o<arguments.length;o++){var r=arguments[o];if(void 0!==r&&null!==r)for(var i=Object.keys(Object(r)),a=0,s=i.length;a<s;a++){var c=i[a],l=Object.getOwnPropertyDescriptor(r,c);void 0!==l&&l.enumerable&&(n[c]=r[c])}}return n}function r(){Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:o})}t.exports={assign:o,polyfill:r}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(24),r=n(6),i=n(5),a=n(36),s=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];if("undefined"!=typeof window){var n=a.getOpts.apply(void 0,t);return new Promise(function(t,e){i.default.promise={resolve:t,reject:e},o.default(n),setTimeout(function(){r.openModal()})})}};s.close=r.onAction,s.getState=r.getState,s.setActionValue=i.setActionValue,s.stopLoading=r.stopLoading,s.setDefaults=a.setDefaults,e.default=s},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(0),i=r.default.MODAL,a=n(4),s=n(34),c=n(35),l=n(1);e.init=function(t){o.getNode(i)||(document.body||l.throwErr("You can only use SweetAlert AFTER the DOM has loaded!"),s.default(),a.default()),a.initModalContent(t),c.default(t)},e.default=e.init},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.MODAL;e.modalMarkup='\n  <div class="'+r+'"></div>',e.default=e.modalMarkup},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.OVERLAY,i='<div \n    class="'+r+'"\n    tabIndex="-1">\n  </div>';e.default=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.ICON;e.errorIconMarkup=function(){var t=r+"--error",e=t+"__line";return'\n    <div class="'+t+'__x-mark">\n      <span class="'+e+" "+e+'--left"></span>\n      <span class="'+e+" "+e+'--right"></span>\n    </div>\n  '},e.warningIconMarkup=function(){var t=r+"--warning";return'\n    <span class="'+t+'__body">\n      <span class="'+t+'__dot"></span>\n    </span>\n  '},e.successIconMarkup=function(){var t=r+"--success";return'\n    <span class="'+t+"__line "+t+'__line--long"></span>\n    <span class="'+t+"__line "+t+'__line--tip"></span>\n\n    <div class="'+t+'__ring"></div>\n    <div class="'+t+'__hide-corners"></div>\n  '}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.CONTENT;e.contentMarkup='\n  <div class="'+r+'">\n\n  </div>\n'},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(0),r=o.default.BUTTON_CONTAINER,i=o.default.BUTTON,a=o.default.BUTTON_LOADER;e.buttonMarkup='\n  <div class="'+r+'">\n\n    <button\n      class="'+i+'"\n    ></button>\n\n    <div class="'+a+'">\n      <div></div>\n      <div></div>\n      <div></div>\n    </div>\n\n  </div>\n'},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(4),r=n(2),i=n(0),a=i.default.ICON,s=i.default.ICON_CUSTOM,c=["error","warning","success","info"],l={error:r.errorIconMarkup(),warning:r.warningIconMarkup(),success:r.successIconMarkup()},u=function(t,e){var n=a+"--"+t;e.classList.add(n);var o=l[t];o&&(e.innerHTML=o)},f=function(t,e){e.classList.add(s);var n=document.createElement("img");n.src=t,e.appendChild(n)},d=function(t){if(t){var e=o.injectElIntoModal(r.iconMarkup);c.includes(t)?u(t,e):f(t,e)}};e.default=d},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(2),r=n(4),i=function(t){navigator.userAgent.includes("AppleWebKit")&&(t.style.display="none",t.offsetHeight,t.style.display="")};e.initTitle=function(t){if(t){var e=r.injectElIntoModal(o.titleMarkup);e.textContent=t,i(e)}},e.initText=function(t){if(t){var e=r.injectElIntoModal(o.textMarkup);e.textContent=t,i(e)}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(4),i=n(0),a=i.default.BUTTON,s=i.default.DANGER_BUTTON,c=n(3),l=n(2),u=n(6),f=n(5),d=function(t,e,n){var r=e.text,i=e.value,d=e.className,p=e.closeModal,m=o.stringToNode(l.buttonMarkup),b=m.querySelector("."+a),v=a+"--"+t;b.classList.add(v),d&&b.classList.add(d),n&&t===c.CONFIRM_KEY&&b.classList.add(s),b.textContent=r;var g={};return g[t]=i,f.setActionValue(g),f.setActionOptionsFor(t,{closeModal:p}),b.addEventListener("click",function(){return u.onAction(t)}),m},p=function(t,e){var n=r.injectElIntoModal(l.footerMarkup);for(var o in t){var i=t[o],a=d(o,i,e);i.visible&&n.appendChild(a)}0===n.children.length&&n.remove()};e.default=p},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(3),r=n(4),i=n(2),a=n(5),s=n(6),c=n(0),l=c.default.CONTENT,u=function(t){t.addEventListener("input",function(t){var e=t.target,n=e.value;a.setActionValue(n)}),t.addEventListener("keyup",function(t){if("Enter"===t.key)return s.onAction(o.CONFIRM_KEY)}),setTimeout(function(){t.focus(),a.setActionValue("")},0)},f=function(t,e,n){var o=document.createElement(e),r=l+"__"+e;o.classList.add(r);for(var i in n){var a=n[i];o[i]=a}"input"===e&&u(o),t.appendChild(o)},d=function(t){if(t){var e=r.injectElIntoModal(i.contentMarkup),n=t.element,o=t.attributes;"string"==typeof n?f(e,n,o):e.appendChild(n)}};e.default=d},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(2),i=function(){var t=o.stringToNode(r.overlayMarkup);document.body.appendChild(t)};e.default=i},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(5),r=n(6),i=n(1),a=n(3),s=n(0),c=s.default.MODAL,l=s.default.BUTTON,u=s.default.OVERLAY,f=function(t){t.preventDefault(),v()},d=function(t){t.preventDefault(),g()},p=function(t){if(o.default.isOpen)switch(t.key){case"Escape":return r.onAction(a.CANCEL_KEY)}},m=function(t){if(o.default.isOpen)switch(t.key){case"Tab":return f(t)}},b=function(t){if(o.default.isOpen)return"Tab"===t.key&&t.shiftKey?d(t):void 0},v=function(){var t=i.getNode(l);t&&(t.tabIndex=0,t.focus())},g=function(){var t=i.getNode(c),e=t.querySelectorAll("."+l),n=e.length-1,o=e[n];o&&o.focus()},h=function(t){t[t.length-1].addEventListener("keydown",m)},w=function(t){t[0].addEventListener("keydown",b)},y=function(){var t=i.getNode(c),e=t.querySelectorAll("."+l);e.length&&(h(e),w(e))},x=function(t){if(i.getNode(u)===t.target)return r.onAction(a.CANCEL_KEY)},_=function(t){var e=i.getNode(u);e.removeEventListener("click",x),t&&e.addEventListener("click",x)},k=function(t){o.default.timer&&clearTimeout(o.default.timer),t&&(o.default.timer=window.setTimeout(function(){return r.onAction(a.CANCEL_KEY)},t))},O=function(t){t.closeOnEsc?document.addEventListener("keyup",p):document.removeEventListener("keyup",p),t.dangerMode?v():g(),y(),_(t.closeOnClickOutside),k(t.timer)};e.default=O},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r=n(3),i=n(37),a=n(38),s={title:null,text:null,icon:null,buttons:r.defaultButtonList,content:null,className:null,closeOnClickOutside:!0,closeOnEsc:!0,dangerMode:!1,timer:null},c=Object.assign({},s);e.setDefaults=function(t){c=Object.assign({},s,t)};var l=function(t){var e=t&&t.button,n=t&&t.buttons;return void 0!==e&&void 0!==n&&o.throwErr("Cannot set both 'button' and 'buttons' options!"),void 0!==e?{confirm:e}:n},u=function(t){return o.ordinalSuffixOf(t+1)},f=function(t,e){o.throwErr(u(e)+" argument ('"+t+"') is invalid")},d=function(t,e){var n=t+1,r=e[n];o.isPlainObject(r)||void 0===r||o.throwErr("Expected "+u(n)+" argument ('"+r+"') to be a plain object")},p=function(t,e){var n=t+1,r=e[n];void 0!==r&&o.throwErr("Unexpected "+u(n)+" argument ("+r+")")},m=function(t,e,n,r){var i=typeof e,a="string"===i,s=e instanceof Element;if(a){if(0===n)return{text:e};if(1===n)return{text:e,title:r[0]};if(2===n)return d(n,r),{icon:e};f(e,n)}else{if(s&&0===n)return d(n,r),{content:e};if(o.isPlainObject(e))return p(n,r),e;f(e,n)}};e.getOpts=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n={};t.forEach(function(e,o){var r=m(0,e,o,t);Object.assign(n,r)});var o=l(n);n.buttons=r.getButtonListOpts(o),delete n.button,n.content=i.getContentOpts(n.content);var u=Object.assign({},s,c,n);return Object.keys(u).forEach(function(t){a.DEPRECATED_OPTS[t]&&a.logDeprecation(t)}),u}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),r={element:"input",attributes:{placeholder:""}};e.getContentOpts=function(t){var e={};return o.isPlainObject(t)?Object.assign(e,t):t instanceof Element?{element:t}:"input"===t?r:null}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.logDeprecation=function(t){var n=e.DEPRECATED_OPTS[t],o=n.onlyRename,r=n.replacement,i=n.subOption,a=n.link,s=o?"renamed":"deprecated",c='SweetAlert warning: "'+t+'" option has been '+s+".";if(r){c+=" Please use"+(i?' "'+i+'" in ':" ")+'"'+r+'" instead.'}var l="https://sweetalert.js.org";c+=a?" More details: "+l+a:" More details: "+l+"/guides/#upgrading-from-1x",console.warn(c)},e.DEPRECATED_OPTS={type:{replacement:"icon",link:"/docs/#icon"},imageUrl:{replacement:"icon",link:"/docs/#icon"},customClass:{replacement:"className",onlyRename:!0,link:"/docs/#classname"},imageSize:{},showCancelButton:{replacement:"buttons",link:"/docs/#buttons"},showConfirmButton:{replacement:"button",link:"/docs/#button"},confirmButtonText:{replacement:"button",link:"/docs/#button"},confirmButtonColor:{},cancelButtonText:{replacement:"buttons",link:"/docs/#buttons"},closeOnConfirm:{replacement:"button",subOption:"closeModal",link:"/docs/#button"},closeOnCancel:{replacement:"buttons",subOption:"closeModal",link:"/docs/#buttons"},showLoaderOnConfirm:{replacement:"buttons"},animation:{},inputType:{replacement:"content",link:"/docs/#content"},inputValue:{replacement:"content",link:"/docs/#content"},inputPlaceholder:{replacement:"content",link:"/docs/#content"},html:{replacement:"content",link:"/docs/#content"},allowEscapeKey:{replacement:"closeOnEsc",onlyRename:!0,link:"/docs/#closeonesc"},allowClickOutside:{replacement:"closeOnClickOutside",onlyRename:!0,link:"/docs/#closeonclickoutside"}}}])});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3).setImmediate, __webpack_require__(3).clearImmediate))

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(64)


/***/ }),
/* 64 */,
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(66)


/***/ }),
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(23)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ })
]);