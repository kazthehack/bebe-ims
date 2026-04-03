/* eslint-disable */
// redux-foundry v0.6.1
// https://github.com/firstfoundry/redux-foundry
// THIS IS A GENERATED FILE, DO NOT MODIFY.
// TODO: eventually find nice way to install from private git repo in docker container.
// http://tinyurl.com/yd6pbq4m
import { RSAA, isRSAA, apiMiddleware } from 'redux-api-middleware';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];

  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }

  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");

  return typeof key === "symbol" ? key : String(key);
}

var isArray = Array.isArray;
var ACTION_PATH = '@@redux-foundry';
var emptyAction = function emptyAction() {
  return {
    type: "".concat(ACTION_PATH, "/empty")
  };
};
var identity = function identity(val) {
  return val;
};
var isNil = function isNil(val) {
  return val == null;
};
var isUndefined = function isUndefined(val) {
  return val === undefined;
};
var isStringOrNull = function isStringOrNull(str) {
  return str == null || typeof str === 'string';
};
var isObject = function isObject(val) {
  return val != null && _typeof(val) === 'object';
};
var isNonArrayObject = function isNonArrayObject(val) {
  return !isArray(val) && isObject(val);
};
var isObjectOrNull = function isObjectOrNull(val) {
  return val == null || isObject(val);
};
var isFunction = function isFunction(val) {
  return typeof val === 'function';
};
var find = function find(arr, predicate) {
  for (var i = 0, il = arr.length; i < il; i++) {
    if (predicate(arr[i], i, arr)) return arr[i];
  }

  return undefined;
};
var without = function without(arr) {
  for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

  return arr.filter(function (val) {
    return values.indexOf(val) === -1;
  });
};
var mapValues = function mapValues(object) {
  var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
  var keys = Object.keys(object);
  return keys.reduce(function (acc, cur) {
    return _objectSpread({}, acc, _defineProperty({}, cur, iteratee(cur)));
  }, {});
};
var keyBy = function keyBy(collection, iteratee) {
  var getKey = typeof iteratee === 'string' ? function (v) {
    return v[iteratee];
  } : iteratee;
  return collection.reduce(function (acc, cur) {
    return _objectSpread({}, acc, _defineProperty({}, getKey(cur), cur));
  }, {});
}; // https://vincent.billey.me/pure-javascript-immutable-array/#splice

var immutableSplice = function immutableSplice(arr, start, deleteCount) {
  for (var _len2 = arguments.length, items = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    items[_key2 - 3] = arguments[_key2];
  }

  return _toConsumableArray(arr.slice(0, start)).concat(items, _toConsumableArray(arr.slice(start + deleteCount)));
};
var applyQueryParams = function applyQueryParams(url, queryParams) {
  var _url$split = url.split('#'),
      _url$split2 = _slicedToArray(_url$split, 2),
      endpoint = _url$split2[0],
      hash = _url$split2[1];

  var querySeparator = endpoint.indexOf('?') === -1 ? '?' : '&';
  return "".concat(endpoint).concat(querySeparator).concat(queryParams).concat(hash ? "#".concat(hash) : '');
};
var defaultGetKeys = Reflect && Reflect.ownKeys;
var matchesObject = function matchesObject(obj, source) {
  var getKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultGetKeys;
  var maxLevel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 2;
  var level = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var srcKeys = getKeys(source);
  return !find(srcKeys, function (key) {
    var val = obj[key];
    var srcVal = source[key];

    if (isObject(srcVal)) {
      if (!isObject(val)) return true;
      if (level < maxLevel) return !matchesObject(val, srcVal, getKeys, maxLevel, level + 1);
    }

    return val !== srcVal;
  });
};
var normalizeArray = function normalizeArray(val) {
  return isArray(val) ? val : [val];
};
var once = function once(fn) {
  return function () {
    var result;
    if (!fn) return result;
    result = fn.apply(void 0, arguments);
    fn = null;
  };
};

/**
 * Key used to define the "cancel action" function in action meta
 * @alias module:core
 * @constant {string}
 */

var CANCEL = "".concat(ACTION_PATH, "/cancelAction");
/**
 * Default "Cancel Action" type
 * @alias module:core
 * @constant {string}
 */

var ACTION_CANCELED = "".concat(ACTION_PATH, "/canceled");
/**
 * Action Creator for ACTION_CANCELED actions
 * @alias module:core
 * @param {string} action the original action to be canceled
 * @return {{}} FSA w/ `ACTION_CANCELED` as type and `action` as payload
 */

var canceledAction = function canceledAction(action) {
  return {
    type: ACTION_CANCELED,
    payload: action
  };
};

/**
 * configurable version of cancelActionMiddleware, if user wants to use own
 * "cancelAction" creator, instead of built-in redux-foundry version.
 *
 * @alias module:core
 * @param {function} actionCreator override the default ACTION_CANCELED creator
 * @return {function} a redux-middleware function
 */

var configureCancelActionMiddleware = function configureCancelActionMiddleware() {
  var actionCreator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : canceledAction;
  return function (store) {
    return function (next) {
      return function (action) {
        var getState = store.getState;
        var _action$meta = action.meta,
            meta = _action$meta === void 0 ? {} : _action$meta;
        var cancel = isObject(meta) ? meta[CANCEL] : null;

        if (cancel && cancel(getState(), action)) {
          return next(actionCreator(action));
        }

        return next(action);
      };
    };
  };
};
var defaultCancelActionMiddleware = configureCancelActionMiddleware();
/**
 * Middleware that allows for cancelation of FSAs.
 *
 * To use, add a `CANCEL` function property to any normal FSA action's meta data.
 *
 * The value of the `CANCEL` function should be of form:
 *   (state: Object, action: FSA) => boolean
 *
 * When evaluated, if the function returns true the action will be replaced by `ACTION_CANCELED`.
 *
 * Example 1 (FSA):
 * Any normal FSA can be canceled:
 * ```
 * {
 *   type: 'FOO',
 *   meta: {
 *     [CANCEL]: (state, action) => (shouldCancel(state, action) ? true : false)
 *   }
 * }
 * ```
 *
 * Example 2: (RSAA)
 * When used alongside `redux-api-middleware` & `apiMeta` middleware, it gets more useful.
 * You can add `CANCEL` to an RSAA, and it can cancel the async request/success/failure FSAs.
 * ```
 * {
 *   [RSAA]: { ... },
 *   [RSAA_META]: {
 *     [CANCEL]: (state, action) => (shouldCancel(state, action) ? true : false)
 *   }
 * }
 * ```
 *
 * @alias module:core
 * @return {function} normal redux-middleware signature
 */

var cancelActionMiddleware = function cancelActionMiddleware(store) {
  return defaultCancelActionMiddleware(store);
};

/**
 * returns true if action's meta value matches target.
 * uses strict equality for matching property values.
 * useful for testing action against expected `meta` property when action's `type` isn't sufficient.
 * @alias module:core
 * @param {{}} action the action (FSA) to test
 * @param {{}} meta expected meta object for match
 * @param {function} [getKeys=Reflect.ownKeys] custom method to determine matchable properties
 * @param {number} [maxLevel=2] max object depth for matching algorithm. defaults to `2`
 * @return {boolean} returns `true` for match, `false` otherwise
 */

var matchesMeta = function matchesMeta(action, meta, getKeys, maxLevel) {
  if (isObjectOrNull(meta)) {
    return matchesObject(action.meta, meta || {}, getKeys, maxLevel);
  }

  return action.meta === meta;
};
/**
 * Configurable version of matchesMeta.
 * Accepts `options` and returns a function which calls matchesMeta using those options.
 * @alias module:core
 * @param {{}} options apiActionTypes options
 * @param {{}} [options.defaultMeta={}] default meta to use in result function, when meta arg not supplied
 * @param {function} [options.getKeys] getKeys argument for matchesMeta
 * @param {number} [options.maxLevel=2] maxLevel argument for matchesMeta
 * @return {function} preconfigured matchesMeta function that only accepts 2 arguments (type, meta)
 */

var configureMatchesMeta = function configureMatchesMeta() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      defaultMeta = _ref.defaultMeta,
      getKeys = _ref.getKeys,
      maxLevel = _ref.maxLevel;

  return function (action) {
    var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMeta;
    return matchesMeta(action, meta, getKeys, maxLevel);
  };
};

/**
 * returns true if action's type matches any supplied type.
 * @alias module:core
 * @param {object} action action (FSA) to test
 * @param {...string} types action type strings to test against
 * @return {boolean} returns `true` for match, `false` otherwise
 */
var matchesType = function matchesType(action) {
  var type = action.type;

  for (var _len = arguments.length, types = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    types[_key - 1] = arguments[_key];
  }

  return types.indexOf(type) !== -1;
};

/**
 * Basic "history" tracker reducer for ease-of-use w/ any FSA(s).
 * Keeps track of a stack action payloads for targeted action types.
 * If you would like to track a stack of "RSAA Response Errors" (or
 * something along those lines) you can combine this with the `withError`
 * higher order reducer.
 * ```
 * (...string) => (state: [], action: FSA) => []
 * ```
 * @alias module:core
 * @param {*} defaultState initial state to return, null or error
 * @param {...string} types action types to match for payload history
 * @return {function} redux reducer function
 */

var payloadHistoryReducer = function payloadHistoryReducer() {
  var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  for (var _len = arguments.length, types = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    types[_key - 1] = arguments[_key];
  }

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (matchesType.apply(void 0, [action].concat(types))) {
      return _toConsumableArray(state).concat([action.payload]);
    }

    return state;
  };
};

/**
 * Enhances reducer to handle "canceled" actions, as used by cancelActionMiddleware.
 * ```
 * type Reducer = (state: any, action: FSA) => any
 * (...string) => Reducer => Reducer
 * ```
 * @alias module:core
 * @param {...string} types additional "cancel" action types
 * @return {function} redux higher order reducer function
 */

var withCanceled = function withCanceled() {
  for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
    types[_key] = arguments[_key];
  }

  return function (reducer) {
    return function (state, action) {
      if (matchesType.apply(void 0, [action, ACTION_CANCELED].concat(types))) {
        var payload = action.payload;
        return reducer(state, payload);
      }

      return reducer(state, action);
    };
  };
};

/**
 * Enhances reducer to inclusively or exclusively handle actions with `error`
 * boolean property, as used by flux-standard-action (FSA) spec.
 * ```
 * type Reducer = (state: any, action: FSA) => any
 * (inclusive: boolean) => Reducer => Reducer
 * ```
 * @alias module:core
 * @param {boolean} [inclusive=true] if true forward action when error is true; inverse otherwise
 * @return {function} redux higher order reducer function
 */

var withError = function withError() {
  var inclusive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return function (reducer) {
    return function (state, action) {
      var error = action.error;

      if (inclusive) {
        return error ? reducer(state, action) : reducer(state, emptyAction());
      }

      return error ? reducer(state, emptyAction()) : reducer(state, action);
    };
  };
};

/**
 * Enhances reducer to limit length of array state.
 * ```
 * type Reducer = (state: any, action: FSA) => any
 * (limit: number, queue: boolean) => Reducer => Reducer
 * ```
 * @alias module:core
 * @param {number} [limit=10] max length for array
 * @param {boolean} [queue=false] slice array from begining|end (for queue|stack)
 * @return {function} redux higher order reducer function
 */
var withLimit = function withLimit() {
  var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var queue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return function (reducer) {
    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var action = arguments.length > 1 ? arguments[1] : undefined;
      var nextState = reducer(state, action);

      if (nextState.length > limit) {
        if (queue) return nextState.slice(0, limit);
        return nextState.slice(-limit);
      }

      return nextState;
    };
  };
};

/**
 * Enhances reducer to reset state when handling a configured action.
 * ```
 * type Reducer = (state: any, action: FSA) => any
 * (...string) => Reducer => Reducer
 * ```
 * @alias module:core
 * @param {...string} types action types that should trigger reset
 * @return {function} redux higher order reducer function
 */

var withReset = function withReset() {
  for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
    types[_key] = arguments[_key];
  }

  return function (reducer) {
    return function (state, action) {
      if (matchesType.apply(void 0, [action].concat(types))) {
        return reducer(undefined, {
          type: "".concat(ACTION_PATH, "/reset")
        });
      }

      return reducer(state, action);
    };
  };
};

/**
 * Enhances reducer to use a new "default state".
 * Generally, mostly useful for testing.
 * ```
 * type Reducer = (state: any, action: FSA) => any
 * (any) => Reducer => Reducer
 * ```
 * @alias module:core
 * @param {any} defaultState overrides the reducer's default state value
 * @return {function} redux higher order reducer function
 */
var withDefaultState = function withDefaultState(defaultState) {
  return function (reducer) {
    return function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
      var action = arguments.length > 1 ? arguments[1] : undefined;
      return reducer(state, action);
    };
  };
};

/**
 * Given an array of action objects, returns a function that accepts a
 * reducer function and returns all intermediary states, including initial
 * and final.  Useful for unit tests.
 *
 * Can also be called with inverted arguments. If you pass a `function` as
 * first argument, the result function will expect an array of actions.
 *
 * NOTE: This implementation will always include the "initial" state of
 * the reducer as the first element in result array.  If you would like
 * to omit this, you can use the `Array.prototype.slice` method like so:
 * ```
 * const states = reduceStates(actions)(reducer)
 * const withoutInitialState = states.slice(1)
 * const withoutFirstNStates = states.slice(N)
 * ```
 *
 * ```
 * type Reducer = (state: any, action: FSA) => any
 * ```
 * @alias module:core
 * @param {Object[]|Reducer} arg1 array of actions to process or reducer function
 * @return {function} (Reducer|Object[]) => any[]) produces resulting states as array
 */

var reduceStates = function reduceStates(arg1) {
  return function (arg2) {
    var actions = typeof arg1 === 'function' ? arg2 : arg1;
    var reducer = actions === arg1 ? arg2 : arg1;
    return actions.reduce(function (acc, cur, i) {
      return _toConsumableArray(acc).concat([reducer(acc[i], cur)]);
    }, [reducer(undefined, emptyAction())]);
  };
};

/**
 * core utilities
 * @module core
 */

var RSAA_EXT = "".concat(RSAA, "/ext/redux-foundry");

var RSAA_TYPES = ['request', 'success', 'failure'];
/**
 * Symbol used to define additional meta data for an RSAA
 * @alias module:api
 * @constant {symbol}
 */

var RSAA_META = Symbol("".concat(RSAA_EXT, "/meta"));
/**
 * Allows configuring RSAAs with meta data.  All async FSAs dispatched due to the api call
 * will include this data inside of their `meta` property.
 *
 * Only supports object values for the RSAA `meta` property.  If an RSAA type descriptor
 * returns a non-object value for its `meta` property, RSAA metadata won't be applied to FSA.
 *
 * Since RSAAs allows for typeDescriptors to be defined as a string before redux-api-middleware
 * blows them up to real flux standard actions (FSAs), rsaaMetaMiddleware should be added before
 * redux-api-middleware in the middleware chain so that it can modify type descriptors with
 * metadata before the RSAA is consumed by the apiMiddleware.
 *
 * The when applying values to FSA meta properties, rsaaMetaMiddleware will also append an
 * additional "rsaaProps" property, with the original RSAA params used to trigger the associated
 * network request.  This can be useful for debuggin, but also in case you need to perform some
 * async logic based on the response action AND the original rsaaProps.
 *
 * This is mainly a convienence option for common use-cases.  RSAA type descriptors
 * can also be configured manually in each API action creator function. See:
 *   https://github.com/agraboso/redux-api-middleware#customizing-the-dispatched-fsas
 *
 * Example 1:
 * Any RSAA can be given a `RSAA_META` symbol property:
 * ```
 * {
 *   [RSAA]: { ... },
 *   [RSAA_META]: {
 *     foo: 'bar'
 *   }
 * }
 * ```
 * All dispatched REQUEST|SUCCESS|FAILURE actions will then be dispatched with this same metadata:
 * ```
 * {
 *   type: FAILURE,
 *   payload: { ... },
 *   meta: {
 *     foo: 'bar',
 *     // ... and any additional meta values supplied by the original RSAA
 *   }
 * }
 * ```
 *
 * @alias module:api
 * @return {function} normal redux-middleware signature
 */

var rsaaMetaMiddleware = function rsaaMetaMiddleware() {
  return function (next) {
    return function (action) {
      if (isRSAA(action) && isObjectOrNull(action[RSAA_META])) {
        return next(rsaaMeta(action));
      }

      return next(action);
    };
  };
};

var rsaaMeta = function rsaaMeta(rsaa) {
  var nextRSAA = _objectSpread({}, rsaa);

  var rsaaTypes = rsaa[RSAA].types || [];
  var rsaaMeta = rsaa[RSAA_META] || {};
  var newTypes = RSAA_TYPES.map(function (defaultType, i) {
    var typeDescriptor = rsaaTypes[i] || defaultType;
    return processTypeDescriptor(typeDescriptor, rsaaMeta, nextRSAA);
  });
  return _objectSpread({}, nextRSAA, _defineProperty({}, RSAA, _objectSpread({}, nextRSAA[RSAA], {
    types: newTypes
  })));
};

var processTypeDescriptor = function processTypeDescriptor(typeDescriptor, rsaaMeta, rsaa) {
  var rsaaProps = _objectSpread({}, rsaa[RSAA]);

  if (isObject(typeDescriptor)) {
    var _meta = typeDescriptor.meta;

    if (isObjectOrNull(_meta)) {
      return _objectSpread({}, typeDescriptor, {
        meta: _objectSpread({}, _meta, rsaaMeta, {
          rsaaProps: rsaaProps
        })
      });
    }

    if (isFunction(_meta)) {
      return _objectSpread({}, typeDescriptor, {
        meta: function meta() {
          var metaValue = _meta.apply(void 0, arguments);

          return isObjectOrNull(metaValue) ? _objectSpread({}, metaValue, rsaaMeta, {
            rsaaProps: rsaaProps
          }) : metaValue;
        }
      });
    }

    return typeDescriptor;
  }

  return {
    type: typeDescriptor,
    meta: _objectSpread({}, rsaaMeta, {
      rsaaProps: rsaaProps
    })
  };
};

/**
 * Basic helper method to create a "Redux Standard Api Action" (RSAA)
 * Accepts a single object argument that must conform to RSAA spec,
 * see documentation: https://github.com/agraboso/redux-api-middleware
 *
 * ```
 * type RSAAction = { [RSAA]: {}, [RSAA_META]?: {} }
 * type apiAction = ({}) => RSAAction
 * ```
 *
 * @alias module:api
 * @param {{}} rsaaProps RSAA declaration object
 * @return {{}} {RSAAction} the RSAA object
 */

var apiAction = function apiAction() {
  var rsaaProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return _defineProperty({}, RSAA, rsaaProps);
};
/**
 * Helper method to create a "Redux Standard Api Action" (RSAA) using
 * `rsaaMeta` extensions.  Identical to the basic `apiAction` helper,
 * but accepts an additional object argument for specifying metadata
 * to relate the RSAA with cooresponding FSAs when fetched.
 *
 * ```
 * type apiActionWithMeta = ({}, {}?) => RSAAction
 * ```
 *
 * @alias module:api
 * @param {{}} rsaaProps RSAA declaration object
 * @param {{}} rsaaMeta metadata to assign to the RSAA
 * @return {{}} {RSAAction} the RSAA object
 */

var apiActionWithMeta = function apiActionWithMeta() {
  var rsaaProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var rsaaMeta = arguments.length > 1 ? arguments[1] : undefined;
  var rsaa = apiAction(rsaaProps);

  if (rsaaMeta) {
    // TODO: investigate issues bundling redux-foundry in ways that works nicely
    // with _any_ type of Symbol polyfill solution, like RN uses by default.
    // The following mutation seems to work with what we've tried, but needs investigation.
    // Using Objest.assign didn't work as expected here on RN.
    // Best github issue we've found realted to this:
    // https://github.com/zloirock/core-js/issues/118
    rsaa[RSAA_META] = rsaaMeta;
  }

  return rsaa;
};
/**
 * Factory method to create a function that accepts an RSAA object, and optionally
 * applies RSAA_META supplied query object data to RSAA endpoint as stringified
 * query params. Useful when you need to support dynamic queryParams, but want to
 * use a pre-configured url string with your RSAA params.  Most useful when used
 * alongside `rsaaMetaMiddleware`, so that any specified `query` params are
 * available as `meta` properties of resulting request, success, & failure FSAs.
 *
 * ```
 * type Stringify = ({}) => string
 * type configureMetaQuery = (Stringify, string) => (RSAAAction) => RSAAAction
 * ```
 *
 * @alias module:api
 * @param {function} stringify function used to convert object to query string
 * @param {string} [queryKey=query] RSAA_META property key for query params
 * @return {function} function to process query params for RSAA
 */

var configureMetaQuery = function configureMetaQuery(stringify) {
  var queryKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'query';
  return function (rsaa) {
    var rsaaProps = rsaa[RSAA];
    var rsaaMeta = rsaa[RSAA_META];
    var _rsaaProps$endpoint = rsaaProps.endpoint,
        endpoint = _rsaaProps$endpoint === void 0 ? '' : _rsaaProps$endpoint;

    var _ref2 = rsaaMeta || {},
        params = _ref2[queryKey];

    if (!params) return rsaa;
    var newEndpoint = applyQueryParams(endpoint, stringify(params));
    return _objectSpread({}, rsaa, _defineProperty({}, RSAA, _objectSpread({}, rsaaProps, {
      endpoint: newEndpoint
    })));
  };
};
/**
 * Factory method to create a function that can produce RSAA objects. Uses
 * apiAction, apiActionWithMeta, and configureMetaQuery utils internally.
 *
 * ```
 * type Options = {
 *   defaultRsaa?: {},
 *   enableMeta?: bool,
 *   metaQuery?: ({}) => string
 * }
 * type configureApiAction = (Options) => ({}, {}?) => RSAAction
 * ```
 *
 * @alias module:api
 * @param {{}} [options]
 * @param {{}} [options.defaultRsaa={}] default RSAA params
 * @param {string} [options.enableMeta=false] enable use of RSAA_META property
 * @param {string} [options.metaQuery=null] query param stringify method. if null|undefined, ignore param processing
 * @return {function} function to process query params for RSAA
 */

var configureApiAction = function configureApiAction() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$defaultRsaa = options.defaultRsaa,
      defaultRsaa = _options$defaultRsaa === void 0 ? {} : _options$defaultRsaa,
      _options$enableMeta = options.enableMeta,
      enableMeta = _options$enableMeta === void 0 ? false : _options$enableMeta,
      _options$metaQuery = options.metaQuery,
      metaQuery = _options$metaQuery === void 0 ? null : _options$metaQuery;

  if (!enableMeta) {
    return function () {
      var rsaaProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return apiAction(_objectSpread({}, defaultRsaa, rsaaProps));
    };
  }

  var actionCreator = function actionCreator() {
    var rsaaProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var rsaaMeta = arguments.length > 1 ? arguments[1] : undefined;
    return apiActionWithMeta(_objectSpread({}, defaultRsaa, rsaaProps), rsaaMeta);
  };

  if (metaQuery) {
    var withMetaQuery = configureMetaQuery(metaQuery);
    return function () {
      return withMetaQuery(actionCreator.apply(void 0, arguments));
    };
  }

  return actionCreator;
};

var isArray$1 = Array.isArray;
/**
 * Creates an array of 3 action types given a base "type" and options.
 * Intended to be used alongside the RSAA specification defined by `redux-api-middleware`:
 *   https://github.com/agraboso/redux-api-middleware
 *
 * ```
 * type API_ACTION_TYPES = [ request: string, success: string, failure: string ];
 * type ApiActionTypes = { request: string, success: string, failure: string };
 * ```
 *
 * Example:
 * ```
 * apiActionTypes('Foo', { suffix: ['R', 'S', 'F'], delim: '.' });
 * // -> ['Foo.R', 'Foo.S', 'Foo.F']
 * ```
 *
 * @alias module:api
 * @param {string} type base "type" all 3 result actions will share
 * @param {{}} [options] additional options
 * @param {string|string[]} [options.prefix] custom prefix for action type
 * @param {string|string[]} [options.suffix] custom suffix for action type
 * @param {string} [options.delim] custom delimiter for string segments
 * @return {API_ACTION_TYPES} array with 3 types; [request, success, failure]
 */

var apiActionTypes = function apiActionTypes(type) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$prefix = options.prefix,
      prefix = _options$prefix === void 0 ? null : _options$prefix,
      _options$suffix = options.suffix,
      suffix = _options$suffix === void 0 ? ['Request', 'Success', 'Failure'] : _options$suffix,
      _options$delim = options.delim,
      delim = _options$delim === void 0 ? '/' : _options$delim;
  var TYPE = "".concat(prefix ? delim : '').concat(type).concat(suffix ? delim : '');
  var prefixes = isStringOrNull(prefix) ? fillWith(prefix) : prefix;
  var suffixes = isStringOrNull(suffix) ? fillWith(suffix) : suffix;
  return ["".concat(prefixes[0]).concat(TYPE).concat(suffixes[0]), "".concat(prefixes[1]).concat(TYPE).concat(suffixes[1]), "".concat(prefixes[2]).concat(TYPE).concat(suffixes[2])];
};
/**
 * Convert Array API Action Types to Object form
 * @alias module:api
 * @param {string[]} array of 3 api action types: [ request, success, failure ]
 * @return {{}} object of 3 api action types: { request, success, failure }
 */

var asApiTypesObject = function asApiTypesObject() {
  var apiTypes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _apiTypes = _slicedToArray(apiTypes, 3),
      request = _apiTypes[0],
      success = _apiTypes[1],
      failure = _apiTypes[2];

  return {
    request: request,
    success: success,
    failure: failure
  };
};
/**
 * Convert Object API Action Types to Array form
 * @alias module:api
 * @param {{}} object of 3 api action types: { request, success, failure }
 * @return {string[]} array of 3 api action types: [ request, success, failure ]
 */

var asApiTypesArray = function asApiTypesArray() {
  var apiTypes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var request = apiTypes.request,
      success = apiTypes.success,
      failure = apiTypes.failure;
  return [request, success, failure];
};
/**
 * Accept either API Action Types in Array or Object form, and return Array form
 * @alias module:api
 * @param {{}|string[]} object or array of 3 api action types
 * @return {string[]} array of 3 api action types: [ request, success, failure ]
 */

var normalizeApiTypes = function normalizeApiTypes(types) {
  if (isArray$1(types)) return types;
  return asApiTypesArray(types);
};
/**
 * Like `normalizeApiTypes`, but supports api action types specified as arrays,
 * and ensures normalized result also defines api action types as an array of
 * arrays of action type strings.
 * @alias module:api
 * @param {{}|string[]} object or array of 3 api action types
 * @return {string[][]} array of 3 api action types: [ request: string[], success: string[], failure: string[] ]
 */

var normalizeApiTypeArrays = function normalizeApiTypeArrays(types) {
  var _normalizeApiTypes = normalizeApiTypes(types),
      _normalizeApiTypes2 = _slicedToArray(_normalizeApiTypes, 3),
      request = _normalizeApiTypes2[0],
      success = _normalizeApiTypes2[1],
      failure = _normalizeApiTypes2[2];

  return [normalizeArray(request), normalizeArray(success), normalizeArray(failure)];
};
/**
 * Configurable version of apiActionTypes.
 * Accepts `options` and returns a function which calls apiActionTypes with same `options`.
 * @alias module:api
 * @param {{}} options apiActionTypes options
 * @return {function} preconfigured apiActionTypes function that only accepts 1 `type` argument
 */

var configureApiActionTypes = function configureApiActionTypes(options) {
  return function (type) {
    return apiActionTypes(type, options);
  };
};

function fillWith(str) {
  return Array(3).fill(str || '');
}

// only support Observable implementations compliant with the latest tc39 proposal:
/**
 * Configure methods for directly fetching via RSAA, without relying on a redux store's
 * configured apiMiddleware.
 *
 * Generally used for advanced use-cases, where you'd like more control over async
 * action handling for one or more API requests within a context _other_ than the
 * redux-api-middleware instance configured with the redux store (e.g. redux-observable,
 * or redux-saga). Can be used outside of a redux context entirely if necessary.
 *
 * ```
 * type StoreInterface = { getState: Function, dispatch?: Function }
 * type CallRsaaApi = {|
 *   fetchRSAA: (rsaa: RSAA, store?: StoreInterface) => [Promise, FSA],
 *   fromRSAA: (rsaa: RSAA, store?: StoreInterface) => Observable
 * |}
 * ```
 *
 * Example Configuration:
 * ```
 * // use a tc39 compliant Observable implementation (until natively supported) like RxJS
 * import { Observable } from 'rxjs'
 *
 * // Some app middlewares we'd like to use for RSAAs.
 * // These would likely be ones that target the RSAA action type (i.e. isRSAA()).
 * const rsaaMiddleware = [
 *   authMiddleware,
 *   rsaaMetaMiddleware,
 * ]
 *
 * // Middleware that will target the FSAs produced by redux-api-middleware
 * const fsaMiddleware = [
 *   apiRetryMiddleware
 * ]
 *
 * // configure your store... use the same middleware arrays as above if you'd like :)
 * const store = configureStore( ... )
 *
 * // Then create your callRSAA methods using your desired middleware
 * export const { fromRSAA, fetchRSAA } = configureCallRSAA({
 *   Observable,
 *   rsaaMiddleware,
 *   fsaMiddleware,
 *   store
 * })
 * ```
 *
 * Example Use:
 * ```
 * // Returns an array whose first value is a Promise for the `fetch` request, and
 * // whose second value is the "request" FSA.  Promise will resolve the async result
 * // FSA.  If you'd like to dispatch the "request" action before handling the
 * // resolved value, you must do so manually.
 * const rsaa = rsaaCreator({ foo: 'bar' })
 * const [ promise, request ] = fetchRSAA(rsaa)
 * console.log(request)
 * promise.then((result) => {
 *   console.log(result)
 * })
 *
 * // Returns an Observable which will emit the "request" and "success|failure" FSAs to
 * // any subscriptions.  Useful for utilizing rxjs operators that leverage higher order
 * // operators like switchMap, or utils like forkJoin.
 * const testFromRSAA = action$ => action$.pipe(
 *   ofType('TEST_FETCH_RSAA'),
 *   switchMap(() => {
 *     const rsaa1 = rsaaCreator({ foo: 'bar' })
 *     const rsaa2 = rsaaCreator({ woot: 'booyah' })
 *     return forkJoin(
 *       fromRSAA(rsaa1),
 *       fromRSAA(rsaa2)
 *     )
 *   })
 * )
 * ```
 * @alias module:api
 * @param {Observable} Observable tc39 compliant Observable class to use for `fromRSAA`
 * @param {function} [apiMiddleware] override the redux-api-middleware with different implementation (useful for mocks/tests, generally not in production!)
 * @param {function[]} [fsaMiddleware] list of "redux" middleware functions to use for the RSAA's resulting FSAs
 * @param {function} [fsaTransform] custom "transform" to apply to resulting FSAs from called RSAA
 * @param {function[]} [rsaaMiddleware] list of "redux" middleware functions process incoming RSAA
 * @param {function} [rsaaTransform] custom "transform" to apply to incoming RSAA
 * @param {{}} [store] a redux store. leave `dispatch` method undefined if you wish to avoid dispatching action side-effects to store from configured middleware.
 * @return {CALL_RSAA_API} the 2 "Call RSAA" API methods
 */

var configureCallRSAA = function configureCallRSAA() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _options$Observable = options.Observable,
      Observable = _options$Observable === void 0 ? defaultObservable() : _options$Observable,
      _options$apiMiddlewar = options.apiMiddleware,
      apiMiddleware$$1 = _options$apiMiddlewar === void 0 ? apiMiddleware : _options$apiMiddlewar,
      _options$fsaMiddlewar = options.fsaMiddleware,
      fsaMiddleware = _options$fsaMiddlewar === void 0 ? [] : _options$fsaMiddlewar,
      _options$fsaTransform = options.fsaTransform,
      fsaTransform = _options$fsaTransform === void 0 ? function (n) {
    return n;
  } : _options$fsaTransform,
      _options$rsaaMiddlewa = options.rsaaMiddleware,
      rsaaMiddleware = _options$rsaaMiddlewa === void 0 ? [] : _options$rsaaMiddlewa,
      _options$rsaaTransfor = options.rsaaTransform,
      rsaaTransform = _options$rsaaTransfor === void 0 ? function (n) {
    return n;
  } : _options$rsaaTransfor,
      _options$store = options.store,
      store = _options$store === void 0 ? {} : _options$store;

  var rsaaInterceptor = function rsaaInterceptor(rsaa) {
    var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : store;
    var nextRsaa = reduceMiddleware('rsaa', rsaaMiddleware, rsaa, s);
    return rsaaTransform(nextRsaa, s.getState);
  };

  var fsaInterceptor = function fsaInterceptor(fsa) {
    var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : store;
    var nextFsa = reduceMiddleware('fsa', fsaMiddleware, fsa, s);
    return fsaTransform(nextFsa, s.getState);
  };

  return {
    fetchRSAA: fetchRSAA(apiMiddleware$$1, rsaaInterceptor, fsaInterceptor),
    fromRSAA: fromRSAA(Observable, apiMiddleware$$1, rsaaInterceptor, fsaInterceptor)
  };
};
var ErrorObservable = Object.freeze({
  create: function create(observer) {
    throw new Error('configureCallRSAA: assign Observable class to use fromRSAA.');
  }
});

var fetchRSAA = function fetchRSAA(middlewareFn, rsaaInterceptor, fsaInterceptor) {
  return function (rsaa, store) {
    var nextRSAA = rsaaInterceptor(rsaa, store);
    var requestAction = null;
    var promise = new Promise(function (resolve, reject) {
      var next = function next(action) {
        if (requestAction) {
          resolve(fsaInterceptor(action, store));
        } else {
          requestAction = fsaInterceptor(action, store);
        }
      };

      var apiFetch = middlewareFn(store)(next);
      apiFetch(nextRSAA).catch(reject);
    });
    return [promise, requestAction];
  };
};

var fromRSAA = function fromRSAA(ObservableClass, middlewareFn, rsaaInterceptor, fsaInterceptor) {
  return function (rsaa, store) {
    return ObservableClass.create(function (observer) {
      var nextRSAA = rsaaInterceptor(rsaa, store);

      var next = function next(action) {
        return observer.next(fsaInterceptor(action, store));
      };

      var apiFetch = middlewareFn(store)(next);
      apiFetch(nextRSAA).then(function () {
        observer.complete();
      }).catch(function (e) {
        observer.error(e);
      });
    });
  };
};

function throwDispatchError(action, mwType, index) {
  throw new Error("configureCallRSAA: configured middleware cannot dispatch action!\n\n    Either provide a 'store' configuration, or pass an override to callRSAA method directly.\n\n    dispatched: ".concat(action.toString(), ";\n\n    middleware type: ").concat(mwType, "\n\n    middleware index: ").concat(index, ";"));
} // TODO: until I can implement support for async MW functions configured with callRSAA
// methods, I think we should fix this w/ documentation.  Note that any valid redux MW
// _can_ be used for callRSAA config, but only synchronous MWs that immediately send a
// single action to "next" MW (perhaps after a transformation) are supported.  Anything
// else may result in undesired behavior.
// In practice, we generally only include these types of synchronous, transformation
// MWs since we don't really want side effects to occur within this call.  We are
// more likely going to handle side-effects and async processing with another tool,
// like redux-observable, when using this util.
// Maybe use Typed MW function signatures, that can limit the # of acceptable MWs?
// For practical use-cases, these are usually nothing more than a transform, and the
// side-effects are generally going to be handled at the call-site.  Otherwise, the
// MW isn't suited for callRSAA methods, and should only be used as a real, redux MW.
// Possible Type For Simple Transformation and (potential) action side-effect capable MW:
// type RSAANext = RSAA => any
// type FSANext = FSA => any
// type StoreInterface = { getState: () => any, dispatch?: any => any }
// type RSAAMiddleware = StoreInterface => RSAANext => RSAA => any
// type FSAMiddleware = StoreInterface => FSANext => FSA => any


function reduceMiddleware(type, middleware, action, store) {
  var dispatch = store.dispatch,
      getState = store.getState;
  return middleware.reduce(function (accAction, curMiddleware, i) {
    var nextAction = accAction;
    var mw = curMiddleware({
      dispatch: dispatch || function (a) {
        return throwDispatchError(a, type, i);
      },
      getState: getState
    });
    var next = once(function (a) {
      nextAction = a;
    });
    mw(next)(accAction);
    return nextAction;
  }, action);
}

function defaultObservable() {
  return ErrorObservable;
}

/**
 * Basic true/false loading indicator.  Can be used with a single endpoint by using
 * the request, success, failure actions for the RSAA. You can also specify the action
 * types as arrays, in cases where more than 1 action type should be handled for
 * request, success, and/or failure cases.
 * ```
 * type RequestActionTypes = {
 *   request: string | string[],
 *   success: string | string[],
 *   failure: string | string[]
 * }
 * type RequestActionTypesArr = [
 *   request: string | string[],
 *   success: string | string[],
 *   failure: string | string[]
 * ]
 * type ApiActionTypes = RequestActionTypes | RequestActionTypesArr
 * (defaultState: bool, actionTypes: ApiActionTypes) =>
 *   (state: bool, action: FSA) => bool
 * ```
 * @alias module:api
 * @param {boolean} defaultState initial state to return, true or false
 * @param {({}|Array)} actionTypes configured action types (see type ApiActionTypes)
 * @return {function} redux reducer function
 */

var loadingReducer = function loadingReducer() {
  var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var actionTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _normalizeApiTypeArra = normalizeApiTypeArrays(actionTypes),
      _normalizeApiTypeArra2 = _slicedToArray(_normalizeApiTypeArra, 3),
      request = _normalizeApiTypeArra2[0],
      success = _normalizeApiTypeArra2[1],
      failure = _normalizeApiTypeArra2[2];

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (matchesType.apply(void 0, [action].concat(_toConsumableArray(success), _toConsumableArray(failure)))) {
      return false;
    }

    if (matchesType.apply(void 0, [action].concat(_toConsumableArray(request)))) {
      if (action.error) return false;
      return true;
    }

    return state;
  };
};

/**
 * Counts a number of arbitrary "request" actions, and decriments count when
 * receiving cooresponding success|failure actions, indicating request has
 * resolved. This can be useful when making multiple API requests to the same
 * (or multiple) endpoint(s) without worrying about response order.
 * A pending state of 0 can indicate "no in-flight requests,"" and anything
 * greater indicates one or more pending requests.
 *
 * NOTE: when using this with `cancelAction` middleware, there may be situations
 * where you'd still like to use the "canceled" response action to decriment
 * count, like when you need to know the _real_ request count (i.e. for per-domain
 * request management).  In this case, you must enhance this reducer with one that
 * can forward the "canceled" action to this reducer.
 * ```
 * type RequestActionTypes = {
 *   request: string | string[],
 *   success: string | string[],
 *   failure: string | string[]
 * }
 * type RequestActionTypesArr = [
 *   request: string | string[],
 *   success: string | string[],
 *   failure: string | string[]
 * ]
 * type ApiActionTypes = RequestActionTypes | RequestActionTypesArr
 * (defaultState: number, actionTypes: ApiActionTypes) =>
 *   (state: number, action: FSA) => number
 * ```
 * @alias module:api
 * @param {number} defaultState initial state to return, natural number
 * @param {({}|Array)} actionTypes configured action types (see type ApiActionTypes)
 * @return {function} redux reducer function
 */

var pendingReducer = function pendingReducer() {
  var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var actionTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _normalizeApiTypeArra = normalizeApiTypeArrays(actionTypes),
      _normalizeApiTypeArra2 = _slicedToArray(_normalizeApiTypeArra, 3),
      request = _normalizeApiTypeArra2[0],
      success = _normalizeApiTypeArra2[1],
      failure = _normalizeApiTypeArra2[2];

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (matchesType.apply(void 0, [action].concat(_toConsumableArray(success), _toConsumableArray(failure)))) {
      return Math.max(0, state - 1);
    }

    if (matchesType.apply(void 0, [action].concat(_toConsumableArray(request)))) {
      if (action.error) return Math.max(0, state - 1);
      return state + 1;
    }

    return state;
  };
};

/**
 * Basic error tracker reducer for ease-of-use w/ RSAAs.  Keeps track of a single
 * error payload for targeted action types. Any tracked "success" response will reset
 * state to back to `null`.
 * Can be used with a single endpoint by using the request, success, failure actions
 * for the RSAA. You can also specify the action types as arrays, in cases where more
 * than 1 action type should be handled for request, success, and/or failure cases.
 ```
 type RequestActionTypes = {
   request: string | string[],
   success: string | string[],
   failure: string | string[]
 }
 type RequestActionTypesArr = [
   request: string | string[],
   success: string | string[],
   failure: string | string[]
 ]
 type ApiActionTypes = RequestActionTypes | RequestActionTypesArr
 (defaultState: object?, actionTypes: ApiActionTypes) =>
   (state: object?, action: FSA) => object?
 ```
 * @alias module:api
 * @param {*} defaultState initial state to return, null or error
 * @param {({}|Array)} actionTypes configured action types (see type ApiActionTypes)
 * @return {function} redux reducer function
 */

var rsaaErrorReducer = function rsaaErrorReducer() {
  var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var actionTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _normalizeApiTypeArra = normalizeApiTypeArrays(actionTypes),
      _normalizeApiTypeArra2 = _slicedToArray(_normalizeApiTypeArra, 3),
      request = _normalizeApiTypeArra2[0],
      success = _normalizeApiTypeArra2[1],
      failure = _normalizeApiTypeArra2[2];

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (matchesType.apply(void 0, [action].concat(_toConsumableArray(request), _toConsumableArray(failure)))) {
      return action.error ? action.payload : state;
    }

    if (matchesType.apply(void 0, [action].concat(_toConsumableArray(success)))) {
      return action.error ? action.payload : null;
    }

    return state;
  };
};

/**
 * REST||RPC|(...ish?) api integration utilities using web standard `fetch` api.
 * Depends on the (excellent) `redux-api-middleware` internally, and offers additional
 * utility methods and extensions.
 * @module api
 */

var isArray$2 = Array.isArray;
/**
 * processes object for safe addition/merge into collection.
 * uses idAttr as unique ID for model, if present, otherwise looks for a cid attribute.
 * if neither id nor cid exist on model, generates a new cid using provided uid method.
 *
 * @alias module:collection
 * @param {{}} model model to process
 * @param {string} idAttr id attribute assigned to models in collection
 * @param {string} cidAttr cid attribute assigned to all models in collection
 * @param {function} uid method to generate a uid as model's cid when processed without id or cid
 * @return {{}} processed model
 */

var processCollectionModel = function processCollectionModel(model, idAttr, cidAttr, uid) {
  // http://backbonejs.org/#Model-cid
  var modelID = model[idAttr];
  var modelCID = model[cidAttr];
  var id = isUndefined(modelID) ? null : modelID;
  var cid = isUndefined(modelCID) ? id || uid() : modelCID;
  return _objectSpread({}, model, _defineProperty({}, cidAttr, cid));
};
var processModel = processCollectionModel;
var processPayload = function processPayload(models) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (!isObject(models)) return [];
  return isArray$2(models) ? models.map(function (m) {
    return processModel.apply(void 0, [m].concat(args));
  }) : processModel.apply(void 0, [models].concat(args));
};
/**
 * creates a map of "collection" action creators.
 * produces an object with same properties as a collectionActionTypes object,
 * but with cooresponding action creator functions.
 *
 * @alias module:collection
 * @param {{}} [types] collectionActionTypes object
 * @param {{}} [options] action creator options
 * @param {function} [options.uid] uid generation method
 * @return {{}} map of "collection" action identifiers to action creators
 */

var collectionActions = function collectionActions(types) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$idAttribute = _ref.idAttribute,
      idAttribute = _ref$idAttribute === void 0 ? 'id' : _ref$idAttribute,
      _ref$cidAttribute = _ref.cidAttribute,
      cidAttribute = _ref$cidAttribute === void 0 ? 'cid' : _ref$cidAttribute,
      getUID = _ref.uid;

  var idCounter = 0;

  var uid = getUID || function () {
    return "".concat(idCounter++);
  };

  var add = function add(models, meta) {
    return {
      type: types.add,
      payload: processPayload(models, idAttribute, cidAttribute, uid),
      meta: meta
    };
  };

  var push = function push(model, meta) {
    return {
      type: types.push,
      payload: processPayload(model, idAttribute, cidAttribute, uid),
      meta: meta
    };
  };

  var pop = function pop(count, meta) {
    return {
      type: types.pop,
      payload: count,
      meta: meta
    };
  };

  var remove = function remove(ids, meta) {
    return {
      type: types.remove,
      payload: ids,
      meta: meta
    };
  };

  var filter = function filter(payload, meta) {
    return {
      type: types.filter,
      payload: payload,
      meta: meta
    };
  };

  var reject = function reject(payload, meta) {
    return {
      type: types.reject,
      payload: payload,
      meta: meta
    };
  };

  var reset = function reset(models, meta) {
    return {
      type: types.reset,
      payload: processPayload(models, idAttribute, cidAttribute, uid),
      meta: meta
    };
  };

  var unshift = function unshift(models, meta) {
    return {
      type: types.unshift,
      payload: processPayload(models, idAttribute, cidAttribute, uid),
      meta: meta
    };
  };

  var shift = function shift(count, meta) {
    return {
      type: types.shift,
      payload: count,
      meta: meta
    };
  };

  var reduce = function reduce(payload, meta) {
    return {
      type: types.reduce,
      payload: payload,
      meta: meta
    };
  };

  var batch = function batch(actions, meta) {
    return {
      type: types.batch,
      payload: actions,
      meta: meta
    };
  };

  return {
    add: add,
    push: push,
    pop: pop,
    remove: remove,
    filter: filter,
    reject: reject,
    reset: reset,
    unshift: unshift,
    shift: shift,
    reduce: reduce,
    batch: batch
  };
};

/**
 * action types for "collectionReducer"
 * @alias module:collection
 * @constant
 * @type {{}}
 * @prop {string} add
 * @prop {string} push
 * @prop {string} pop
 * @prop {string} remove
 * @prop {string} filter
 * @prop {string} reject
 * @prop {string} reset
 * @prop {string} unshift
 * @prop {string} shift
 * @prop {string} reduce
 * @prop {string} batch
 */

var COLLECTION_TYPES = Object.freeze({
  add: 'add',
  push: 'push',
  pop: 'pop',
  remove: 'remove',
  filter: 'filter',
  reject: 'reject',
  reset: 'reset',
  unshift: 'unshift',
  shift: 'shift',
  reduce: 'reduce',
  batch: 'batch'
});
/**
 * creates a map of "collection" action types.
 * produces an object in the form expected by the `actionTypes` argument
 * of the `collectionReducer` method.  can be given a `getType` argument
 * to customize the action type values, per action.
 *
 * @alias module:collection
 * @param {function} [getType] assigns property values to resulting object
 * @return {{}} map of "collection" action types to string|symbol values
 */

var collectionActionTypes = function collectionActionTypes(getType) {
  return mapValues(COLLECTION_TYPES, getType);
};

var isArray$3 = Array.isArray;

var defaultMerge = function defaultMerge(obj) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  return sources.reduce(function (o, s) {
    return _objectSpread({}, o, s);
  }, obj);
};

var normalizeArrayPayload = function normalizeArrayPayload(payload) {
  return normalizeArray(payload).filter(function (v) {
    return v;
  });
};
/**
 * Default value for collectionReducer's `getFilterCallback` option
 * @alias module:collection
 * @param {*} payload a filter action's payload
 * @returns {function} Array.filter callback function
 */


var getCollectionFilterCallback = function getCollectionFilterCallback(payload) {
  return function (element) {
    return matchesObject(element, payload);
  };
};
/**
 * Default value for collectionReducer's `getModelReducer` option
 * @alias module:collection
 * @param {{}} options subset of collectionReducer options
 * @param {string} options.idAttribute id attribute used for collection elements
 * @param {string} options.cidAttribute cid attribute used for collection elements
 * @returns {function} "redux-style" reducer; given a model, 'reduce' action, and model cid, returns next model
 */

var getCollectionModelReducer = function getCollectionModelReducer(_ref) {
  var idAttribute = _ref.idAttribute,
      cidAttribute = _ref.cidAttribute,
      merge = _ref.merge;
  return function (model, action, cid) {
    var payload = action.payload;

    var idsObj = _defineProperty({}, cidAttribute, cid);

    if (!isUndefined(model[idAttribute])) {
      idsObj[idAttribute] = model[idAttribute];
    }

    return merge(model, payload, idsObj);
  };
};

var add = function add(collection, payload, meta, cidAttr, mergeFn) {
  // http://backbonejs.org/#Collection-add
  // expects `payload` to be an array of models or a single model
  // expects `meta.at` to specify where to insert in collection (defaults
  //   to the end of the collection)
  // expect `meta.merge` (bool) to determine if models that are already part
  //   of the collection be merged onto existing objects in place.
  if (!isObject(payload)) return collection;

  var _ref2 = meta || {},
      _ref2$at = _ref2.at,
      at = _ref2$at === void 0 ? collection.length : _ref2$at,
      _ref2$merge = _ref2.merge,
      merge = _ref2$merge === void 0 ? true : _ref2$merge;

  var collectionMap = keyBy(collection, cidAttr);
  var newModels = normalizeArrayPayload(payload);
  var addedModels = newModels.filter(function (model) {
    return isUndefined(collectionMap[model[cidAttr]]);
  });

  if (merge) {
    // when merging/updating existing models, figure out which are new, and then
    // shallow merge updated models onto existing ones.
    var addedModelsMap = keyBy(addedModels, cidAttr);
    var newModelsMap = keyBy(newModels, cidAttr);
    return immutableSplice.apply(void 0, [collection.map(function (model) {
      var modelId = model[cidAttr];
      var mergeModel = newModelsMap[modelId];

      if (mergeModel && isUndefined(addedModelsMap[modelId])) {
        return mergeFn(model, mergeModel);
      }

      return model;
    }), at, 0].concat(_toConsumableArray(addedModels)));
  } // if merge not specified don't add new models to collection if they are
  // already in the collection.  this attempts to match Backbone "add"


  return immutableSplice.apply(void 0, [collection, at, 0].concat(_toConsumableArray(addedModels)));
};

var push = function push(collection, payload, meta) {
  // http://backbonejs.org/#Collection-push
  // expect `meta.merge` (bool) to determine if models that are already part
  //   of the collection be merged onto existing objects in place.
  var newMeta = _objectSpread({}, meta, {
    at: collection.length
  });

  for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    rest[_key2 - 3] = arguments[_key2];
  }

  return add.apply(void 0, [collection, payload, newMeta].concat(rest));
};

var pop = function pop(collection) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  // http://backbonejs.org/#Collection-pop
  if (!collection.length) return collection;
  return collection.slice(0, -count);
};

var remove = function remove(collection, payload, cidAttr) {
  // http://backbonejs.org/#Collection-remove
  // removes a model (or models) from collection by ID.
  // TODO: this doesn't quite match Backbone (which allows objects), but I
  // think (most often in redux-land with normalized objects) removing by ID
  // will be easiest and work for most of our needs.  If we find a use case
  // to remove by object _or_ by ID, we can implement that later.
  if (!collection.length) return collection;
  var ids = normalizeArrayPayload(payload);
  return collection.filter(function (model) {
    return ids.indexOf(model[cidAttr]) === -1;
  });
};

var filter = function filter(collection, payload, getCallback) {
  // filters collection for models using supplied getFilterCallback option.
  // default option attempts to mimic lodash.filter functionality, where any
  // objects that don't match the given payload are removed.
  if (!collection.length) return collection;
  return collection.filter(getCallback(payload));
};

var reject = function reject(collection, payload, getCallback) {
  // filters collection for models using supplied getFilterCallback option.
  // default option attempts to mimic lodash.reject functionality, where any
  // objects that match the given payload are removed.
  if (!collection.length) return collection;
  return collection.filter(function () {
    return !getCallback(payload).apply(void 0, arguments);
  });
};

var reset = function reset(payload) {
  // http://backbonejs.org/#Collection-reset
  // reset the collection
  // replaces collection with new models, or resets to empty array
  return normalizeArrayPayload(payload);
};

var unshift = function unshift(collection, payload, meta, cidAttr) {
  // http://backbonejs.org/#Collection-unshift
  // add model to beginning of array
  // supports same `meta.merge` option as `addReducer`
  if (!payload) return collection;

  var newMeta = _objectSpread({
    at: 0
  }, meta);

  return add(collection, payload, newMeta, cidAttr);
};

var shift = function shift(collection) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  // http://backbonejs.org/#Collection-shift
  // remove model from beginning of array
  if (!collection.length) return collection;
  return collection.slice(count);
};

var reduce = function reduce(collection, action, cidAttr, reducer) {
  if (!collection.length) return collection;
  var meta = action.meta;

  if (isNil(meta)) {
    return collection.map(function (model) {
      return reducer(model, action, model[cidAttr]);
    });
  }

  var ids = !isArray$3(meta) && isObject(meta) ? normalizeArray(meta.ids) : normalizeArray(meta);
  var idMap = keyBy(collection, cidAttr);
  var modelIds = ids.filter(function (id) {
    return !isNil(id) && idMap[id];
  });
  var indices = modelIds.map(function (id) {
    return collection.indexOf(idMap[id]);
  });
  return indices.reduce(function (acc, cur, i) {
    var id = modelIds[i];
    var nextModel = reducer(idMap[id], action, id);
    return immutableSplice(acc, cur, 1, nextModel);
  }, collection);
};

var batch = function batch(collection, reducer, actions) {
  return actions.reduce(function (acc, cur) {
    return reducer(acc, cur);
  }, collection);
};
/**
 * Inspired by the (most excellent) Backbone.Collection API
 * http://backbonejs.org/#Collection
 *
 * Action-managed "collection" implementation for common client-side
 * list operations when dealing with an array of uniquely identifiable
 * objects.  This can be useful for "list builder" features or anything
 * else that requires managing an array of objects w/ actions.
 *
 * @alias module:collection
 * @param {Object[]} [defaultState=[]] initial state to return, null or error
 * @param {{}} [types={}] action types to match for payload history
 * @param {string|symbol} types.add add action type
 * @param {string|symbol} types.push push action type
 * @param {string|symbol} types.pop pop action type
 * @param {string|symbol} types.remove remove action type
 * @param {string|symbol} types.filter filter action type
 * @param {string|symbol} types.reject reject action type
 * @param {string|symbol} types.reset reset action type
 * @param {string|symbol} types.unshift unshift action type
 * @param {string|symbol} types.shift shift action type
 * @param {string|symbol} types.reduce reduce action type
 * @param {string|symbol} types.batch batch action type}
 * @param {{}} [options={}] additional options for resulting reducer
 * @param {string|symbol} options.idAttribute model attribute to use as preassigned ID
 * @param {string|symbol} options.cidAttribute model attribute to use as dynamic "client ID"
 * @param {function} options.getModelReducer method to invoke on model(s) when processing "reduce" actions
 * @param {function} options.getFilterCallback given action payload, returns filter callback function
 * @param {function} options.merge object merge method for `add` reducer. defaults to shallow merge: (obj, source) => result
 * @param {function} options.uid method to make a unique id for "cid" generation. defaults to scoped, int incrementor
 * @return {function} redux reducer function
 */


var collectionReducer = function collectionReducer() {
  var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      addAction = _ref3.add,
      pushAction = _ref3.push,
      popAction = _ref3.pop,
      removeAction = _ref3.remove,
      filterAction = _ref3.filter,
      rejectAction = _ref3.reject,
      resetAction = _ref3.reset,
      unshiftAction = _ref3.unshift,
      shiftAction = _ref3.shift,
      reduceAction = _ref3.reduce,
      batchAction = _ref3.batch;

  var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref4$idAttribute = _ref4.idAttribute,
      idAttribute = _ref4$idAttribute === void 0 ? 'id' : _ref4$idAttribute,
      _ref4$cidAttribute = _ref4.cidAttribute,
      cidAttribute = _ref4$cidAttribute === void 0 ? 'cid' : _ref4$cidAttribute,
      _ref4$getModelReducer = _ref4.getModelReducer,
      getModelReducer = _ref4$getModelReducer === void 0 ? getCollectionModelReducer : _ref4$getModelReducer,
      _ref4$getFilterCallba = _ref4.getFilterCallback,
      getFilterCallback = _ref4$getFilterCallba === void 0 ? getCollectionFilterCallback : _ref4$getFilterCallba,
      _ref4$merge = _ref4.merge,
      merge = _ref4$merge === void 0 ? defaultMerge : _ref4$merge;

  var reduceHandler = getModelReducer({
    idAttribute: idAttribute,
    cidAttribute: cidAttribute,
    merge: merge
  });

  var reducer = function reducer() {
    var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyAction();
    var type = action.type,
        payload = action.payload,
        meta = action.meta;

    switch (type) {
      case addAction:
        {
          return add(collection, payload, meta, cidAttribute, merge);
        }

      case pushAction:
        {
          return push(collection, payload, meta, cidAttribute, merge);
        }

      case popAction:
        {
          return pop(collection, payload);
        }

      case removeAction:
        {
          return remove(collection, payload, cidAttribute);
        }

      case filterAction:
        {
          return filter(collection, payload, getFilterCallback);
        }

      case rejectAction:
        {
          return reject(collection, payload, getFilterCallback);
        }

      case resetAction:
        {
          return reset(payload);
        }

      case unshiftAction:
        {
          return unshift(collection, payload, meta || {}, cidAttribute);
        }

      case shiftAction:
        {
          return shift(collection, payload);
        }

      case reduceAction:
        {
          return reduce(collection, action, cidAttribute, reduceHandler);
        }

      case batchAction:
        {
          return batch(collection, reducer, normalizeArray(payload));
        }
      // TODO: Backbone.Collection "set" ("smart" merge of models)?

      default:
        {
          return collection;
        }
    }
  };

  return reducer;
};

/**
 * module for managing an array of objects in a redux store
 * inspired by the Backbone.Collection API.
 * @module collection
 */

/**
 * creates a map of "dictionary" action creators.
 * produces an object with same properties as a dictionaryActionTypes object,
 * but with cooresponding action creator functions.
 *
 * @alias module:dictionary
 * @param {{}} [types] dictionaryActionTypes object
 * @return {{}} map of "dictionary" action identifiers to action creators
 */

var dictionaryActions = function dictionaryActions(types) {
  var updateValue = function updateValue(ids, value, meta) {
    return {
      type: types.updateValue,
      payload: value,
      meta: isObject(meta) ? _objectSpread({}, meta, {
        ids: ids
      }) : ids
    };
  };

  var merge = function merge(dict, meta) {
    return {
      type: types.merge,
      payload: dict,
      meta: meta
    };
  };

  var mergeValue = function mergeValue(ids, value, meta) {
    return {
      type: types.mergeValue,
      payload: value,
      meta: isObject(meta) ? _objectSpread({}, meta, {
        ids: ids
      }) : ids
    };
  };

  var remove = function remove(ids, meta) {
    return {
      type: types.remove,
      payload: ids,
      meta: meta
    };
  };

  var filter = function filter(payload, meta) {
    return {
      type: types.filter,
      payload: payload,
      meta: meta
    };
  };

  var reject = function reject(payload, meta) {
    return {
      type: types.reject,
      payload: payload,
      meta: meta
    };
  };

  var reset = function reset(payload, meta) {
    return {
      type: types.reset,
      payload: payload,
      meta: meta
    };
  };

  var reduce = function reduce(payload, meta) {
    return {
      type: types.reduce,
      payload: payload,
      meta: meta
    };
  };

  var batch = function batch(actions, meta) {
    return {
      type: types.batch,
      payload: actions,
      meta: meta
    };
  };

  return {
    updateValue: updateValue,
    merge: merge,
    mergeValue: mergeValue,
    remove: remove,
    filter: filter,
    reject: reject,
    reset: reset,
    reduce: reduce,
    batch: batch
  };
};

/**
 * action types for "dictionaryReducer"
 * @alias module:dictionary
 * @constant
 * @type {{}}
 * @prop {string} updateValue
 * @prop {string} merge
 * @prop {string} mergeValue
 * @prop {string} remove
 * @prop {string} filter
 * @prop {string} reject
 * @prop {string} reset
 * @prop {string} reduce
 * @prop {string} batch
 */

var DICTIONARY_TYPES = Object.freeze({
  updateValue: 'updateValue',
  merge: 'merge',
  mergeValue: 'mergeValue',
  remove: 'remove',
  filter: 'filter',
  reject: 'reject',
  reset: 'reset',
  reduce: 'reduce',
  batch: 'batch'
});
/**
 * creates a map of "dictionary" action types.
 * produces an object in the form expected by the `actionTypes` argument
 * of the `dictionaryReducer` method.  can be given a `getType` argument
 * to customize the action type values, per action.
 *
 * @alias module:dictionary
 * @param {function} [getType] assigns property values to resulting object
 * @return {{}} map of "dictionary" action types to string|symbol values
 */

var dictionaryActionTypes = function dictionaryActionTypes(getType) {
  return mapValues(DICTIONARY_TYPES, getType);
};

var isArray$4 = Array.isArray;

var normalizeArrayPayload$1 = function normalizeArrayPayload(payload) {
  return normalizeArray(payload).filter(function (v) {
    return !isNil(v);
  });
};

var defaultMerge$1 = function defaultMerge(dest, source) {
  if (isArray$4(dest) && isArray$4(source)) {
    return _toConsumableArray(dest).concat(_toConsumableArray(source));
  }

  if (isNonArrayObject(dest) && isNonArrayObject(source)) {
    return _objectSpread({}, dest, source);
  }

  return source;
};
/**
 * Default value for dictionaryReducer's `getFilterCallback` option
 * @alias module:dictionary
 * @param {*} payload a filter action's payload
 * @returns {function} Array.filter callback function
 */


var getDictionaryFilterCallback = function getDictionaryFilterCallback(payload) {
  return function (value) {
    if (isArray$4(value) && isArray$4(payload)) {
      return value.length === payload.length && !find(value, function (elt, i) {
        return elt !== payload[i];
      });
    }

    if (isNonArrayObject(value) && isNonArrayObject(payload)) {
      return matchesObject(value, payload);
    } // TODO: handle more "common" filter cases in default filter callback?


    return payload === value;
  };
};
/**
 * Default value for dictionaryReducer's `getValueReducer` option
 * @alias module:dictionary
 * @param {{}} options subset of dictionaryReducer options.
 * @param {function} options.merge value merge implementation for duplicate keys in dict
 * @returns {function} "redux-style" reducer; given a value and 'reduce' action, returns next value
 */

var getDictionaryValueReducer = function getDictionaryValueReducer(_ref) {
  var merge = _ref.merge;
  return function (val, _ref2, id) {
    var payload = _ref2.payload;
    return merge(val, payload);
  };
};

var updateValue = function updateValue(dict, payload, meta) {
  var ids = isNonArrayObject(meta) ? normalizeArrayPayload$1(meta.ids) : normalizeArrayPayload$1(meta);
  return ids.reduce(function (acc, id) {
    return _objectSpread({}, acc, _defineProperty({}, id, payload));
  }, dict);
};

var merge = function merge(dict, payload, mergeFn) {
  var ids = Object.keys(payload || {}).filter(function (v) {
    return !isNil(v);
  });
  return ids.reduce(function (acc, id) {
    return _objectSpread({}, acc, _defineProperty({}, id, mergeFn(acc[id], payload[id])));
  }, dict);
};

var mergeValue = function mergeValue(dict, payload, meta, mergeFn) {
  var ids = isNonArrayObject(meta) ? normalizeArrayPayload$1(meta.ids) : normalizeArrayPayload$1(meta);
  return ids.reduce(function (acc, id) {
    return _objectSpread({}, acc, _defineProperty({}, id, mergeFn(acc[id], payload)));
  }, dict);
};

var remove$1 = function remove(dict, ids) {
  return ids.reduce(function (acc, id) {
    var _ = acc[id],
        rest = _objectWithoutProperties(acc, [id].map(_toPropertyKey));

    return rest;
  }, dict);
};

var filter$1 = function filter(dict, payload, getFilterCallback) {
  var ids = Object.keys(dict);
  return ids.reduce(function (acc, id) {
    if (!getFilterCallback(payload)(acc[id], id, acc)) {
      var _ = acc[id],
          rest = _objectWithoutProperties(acc, [id].map(_toPropertyKey));

      return rest;
    }

    return acc;
  }, dict);
};

var reject$1 = function reject(dict, payload, getFilterCallback) {
  var invertedCallback = function invertedCallback() {
    for (var _len = arguments.length, a = new Array(_len), _key = 0; _key < _len; _key++) {
      a[_key] = arguments[_key];
    }

    return function () {
      return !getFilterCallback.apply(void 0, a).apply(void 0, arguments);
    };
  };

  return filter$1(dict, payload, invertedCallback);
};

var reduce$1 = function reduce(dict, action, reducer) {
  var meta = action.meta;
  var normalizedMeta = isNonArrayObject(meta) ? normalizeArrayPayload$1(meta.ids) : normalizeArrayPayload$1(meta);
  var realIds = normalizedMeta.filter(function (id) {
    return !isNil(dict[id]);
  });
  var ids = realIds.length ? realIds : Object.keys(dict);
  return ids.reduce(function (acc, id) {
    return _objectSpread({}, acc, _defineProperty({}, id, reducer(dict[id], action, id)));
  }, dict);
};

var batch$1 = function batch(dict, reducer, actions) {
  return actions.reduce(function (acc, cur) {
    return reducer(acc, cur);
  }, dict);
};
/**
 * Generic "dictionary" implementation for redux.
 * Allows for action managed mutations of an arbitrary set of key-value pairs.
 * Useful for keeping track of client-side state for multiple entities by key,
 * such as mapping other client state to Server-API loaded entities by ID.
 *
 * @alias module:dictionary
 * @param {{}} defaultState
 * @param {{}} [types={}] action types to match for payload history
 * @param {string|symbol} types.updateValue update action type
 * @param {string|symbol} types.merge merge action type
 * @param {string|symbol} types.mergeValue mergeValue action type
 * @param {string|symbol} types.remove remove action type
 * @param {string|symbol} types.filter filter action type
 * @param {string|symbol} types.reject reject action type
 * @param {string|symbol} types.reset reset action type
 * @param {string|symbol} types.reduce reduce action type
 * @param {string|symbol} types.batch batch action type
 * @param {{}} [options={}] additional options for resulting reducer
 * @param {function} options.getValueReducer method to invoke on value(s) when processing "reduce" actions
 * @param {function} options.getFilterCallback given action payload, returns filter callback function
 * @param {function} options.merge merge method for reducers. see `defaultMerge`
 * @returns {function} redux reducer function
 */


var dictionaryReducer = function dictionaryReducer() {
  var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      updateValueAction = _ref3.updateValue,
      mergeAction = _ref3.merge,
      mergeValueAction = _ref3.mergeValue,
      removeAction = _ref3.remove,
      filterAction = _ref3.filter,
      rejectAction = _ref3.reject,
      resetAction = _ref3.reset,
      reduceAction = _ref3.reduce,
      batchAction = _ref3.batch;

  var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref4$getValueReducer = _ref4.getValueReducer,
      getValueReducer = _ref4$getValueReducer === void 0 ? getDictionaryValueReducer : _ref4$getValueReducer,
      _ref4$getFilterCallba = _ref4.getFilterCallback,
      getFilterCallback = _ref4$getFilterCallba === void 0 ? getDictionaryFilterCallback : _ref4$getFilterCallba,
      _ref4$merge = _ref4.merge,
      mergeFn = _ref4$merge === void 0 ? defaultMerge$1 : _ref4$merge;

  var reduceHandler = getValueReducer({
    merge: mergeFn
  });

  var reducer = function reducer() {
    var dict = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyAction();
    var type = action.type,
        payload = action.payload,
        meta = action.meta;

    switch (type) {
      case updateValueAction:
        {
          // take new "value", merge onto prev value(s) in dict or add new KvP(s), and return new state
          return updateValue(dict, payload, meta);
        }

      case mergeAction:
        {
          // take new "dict", merge onto prev dict, and return new state
          return merge(dict, payload, mergeFn);
        }

      case mergeValueAction:
        {
          return mergeValue(dict, payload, meta, mergeFn);
        }

      case removeAction:
        {
          // remove KvP(s) from "dict" by "key(s)"
          return remove$1(dict, normalizeArrayPayload$1(payload));
        }

      case filterAction:
        {
          // remove KvP(s) from "dict" by filterCallback condition
          return filter$1(dict, payload, getFilterCallback);
        }

      case rejectAction:
        {
          // inverse of filterAction
          return reject$1(dict, payload, getFilterCallback);
        }

      case resetAction:
        {
          // reset "dict" to default state, or to provided new "dict"
          return merge(defaultState, payload || defaultState, mergeFn);
        }

      case reduceAction:
        {
          // invoke reduceHandler on item value(s) in "dict" and return new state for each
          return reduce$1(dict, action, reduceHandler);
        }

      case batchAction:
        {
          // group together "dictionary" actions into a single action
          return batch$1(dict, reducer, normalizeArrayPayload$1(payload));
        }

      default:
        return dict;
    }
  };

  return reducer;
};

/**
 * module for managing a dictionary of key/value pairs in a redux store
 * @module dictionary
 */

/**
 * creates a map of "stack" action creators.
 * produces an object with same properties as a stackActionTypes object,
 * but with cooresponding action creator functions.
 *
 * @alias module:stack
 * @param {{}} [types] stackActionTypes object
 * @return {{}} map of "stack" action identifiers to action creators
 */
var stackActions = function stackActions(types) {
  var push = function push(value, meta) {
    return {
      type: types.push,
      payload: value,
      meta: meta
    };
  };

  var pop = function pop(count, meta) {
    return {
      type: types.pop,
      payload: count,
      meta: meta
    };
  };

  var replace = function replace(value, meta) {
    return {
      type: types.replace,
      payload: value,
      meta: meta
    };
  };

  var remove = function remove(value, meta) {
    return {
      type: types.remove,
      payload: value,
      meta: meta
    };
  };

  var clear = function clear(meta) {
    return {
      type: types.clear,
      meta: meta
    };
  }; // TODO: support "batch" and/or "reduce" actions for stack reducer?


  return {
    push: push,
    pop: pop,
    replace: replace,
    remove: remove,
    clear: clear
  };
};

/**
 * action types for "stackReducer"
 * @alias module:stack
 * @constant
 * @type {{}}
 * @prop {string} push
 * @prop {string} pop
 * @prop {string} replace
 * @prop {string} remove
 * @prop {string} clear
 */

var STACK_TYPES = Object.freeze({
  push: 'push',
  pop: 'pop',
  replace: 'replace',
  remove: 'remove',
  clear: 'clear'
});
/**
 * creates a map of "stack" action types.
 * produces an object in the form expected by the `actionTypes` argument
 * of the `stackReducer` method.  can be given a `getType` argument
 * to customize the action type values, per action.
 *
 * @alias module:stack
 * @param {function} [getType] assigns property values to resulting object
 * @return {{}} map of "stack" action types to string|symbol values
 */

var stackActionTypes = function stackActionTypes(getType) {
  return mapValues(STACK_TYPES, getType);
};

var push$1 = function push(stack, elt) {
  return _toConsumableArray(stack).concat(_toConsumableArray(normalizeArray(elt)));
};

var pop$1 = function pop(stack) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return stack.slice(0, -count);
};

var replace = function replace(stack, elt) {
  return push$1(pop$1(stack), elt);
};
/**
 * Basic "stack" reducer for arbitrary elements.
 * Works best with primitive types, since "REMOVE" functionality
 * will test for any element in stack that is strictly equal to the
 * desired element to remove.
 * For more advanced use-cases with arrays of objects tracked by
 * ID, see "collectionReducer".
 *
 * @alias module:stack
 * @param {Array} [defaultState=[]] initial state to return, null or error
 * @param {{}} [types] action types for stack actions
 * @param {string} types.push push action type
 * @param {string} types.pop pop action type
 * @param {string} types.replace replace action type
 * @param {string} types.remove remove action type
 * @param {string} types.clear clear action type
 * @return {function} redux reducer function
 */


var stackReducer = function stackReducer() {
  var defaultState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      pushAction = _ref.push,
      popAction = _ref.pop,
      replaceAction = _ref.replace,
      removeAction = _ref.remove,
      clearAction = _ref.clear;

  return function () {
    var stack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : emptyAction(),
        type = _ref2.type,
        payload = _ref2.payload;

    switch (type) {
      case pushAction:
        {
          return push$1(stack, payload);
        }

      case popAction:
        {
          return pop$1(stack, payload);
        }

      case replaceAction:
        {
          return replace(stack, payload);
        }

      case removeAction:
        {
          return without.apply(void 0, [stack].concat(_toConsumableArray(normalizeArray(payload))));
        }

      case clearAction:
        {
          return defaultState;
        }

      default:
        return stack;
    }
  };
};

/**
 * module for managing a simple stack in a redux store
 * @module stack
 */

export { CANCEL, ACTION_CANCELED, canceledAction, cancelActionMiddleware, configureCancelActionMiddleware, matchesMeta, configureMatchesMeta, matchesType, payloadHistoryReducer, reduceStates, withCanceled, withError, withLimit, withReset, withDefaultState, apiAction, apiActionWithMeta, configureMetaQuery, configureApiAction, apiActionTypes, asApiTypesObject, asApiTypesArray, normalizeApiTypes, normalizeApiTypeArrays, configureApiActionTypes, configureCallRSAA, rsaaMetaMiddleware, RSAA_META, loadingReducer, pendingReducer, rsaaErrorReducer, collectionActions, processCollectionModel, collectionActionTypes, COLLECTION_TYPES, collectionReducer, getCollectionFilterCallback, getCollectionModelReducer, dictionaryActions, dictionaryActionTypes, DICTIONARY_TYPES, dictionaryReducer, getDictionaryFilterCallback, getDictionaryValueReducer, stackActions, stackActionTypes, STACK_TYPES, stackReducer };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy5qcyIsIi4uLy4uL3NyYy9jb3JlL2NhbmNlbEFjdGlvbnMuanMiLCIuLi8uLi9zcmMvY29yZS9jYW5jZWxBY3Rpb25NaWRkbGV3YXJlLmpzIiwiLi4vLi4vc3JjL2NvcmUvbWF0Y2hlc01ldGEuanMiLCIuLi8uLi9zcmMvY29yZS9tYXRjaGVzVHlwZS5qcyIsIi4uLy4uL3NyYy9jb3JlL3BheWxvYWRIaXN0b3J5LmpzIiwiLi4vLi4vc3JjL2NvcmUvZW5oYW5jZXJzL3dpdGhDYW5jZWxlZC5qcyIsIi4uLy4uL3NyYy9jb3JlL2VuaGFuY2Vycy93aXRoRXJyb3IuanMiLCIuLi8uLi9zcmMvY29yZS9lbmhhbmNlcnMvd2l0aExpbWl0LmpzIiwiLi4vLi4vc3JjL2NvcmUvZW5oYW5jZXJzL3dpdGhSZXNldC5qcyIsIi4uLy4uL3NyYy9jb3JlL2VuaGFuY2Vycy93aXRoRGVmYXVsdFN0YXRlLmpzIiwiLi4vLi4vc3JjL2NvcmUvcmVkdWNlU3RhdGVzLmpzIiwiLi4vLi4vc3JjL2NvcmUvaW5kZXguanMiLCIuLi8uLi9zcmMvYXBpL3JzYWFFeHQuanMiLCIuLi8uLi9zcmMvYXBpL3JzYWFNZXRhLmpzIiwiLi4vLi4vc3JjL2FwaS9hcGlBY3Rpb24uanMiLCIuLi8uLi9zcmMvYXBpL2FwaUFjdGlvblR5cGVzLmpzIiwiLi4vLi4vc3JjL2FwaS9jb25maWd1cmVDYWxsUlNBQS5qcyIsIi4uLy4uL3NyYy9hcGkvbG9hZGluZy5qcyIsIi4uLy4uL3NyYy9hcGkvcGVuZGluZy5qcyIsIi4uLy4uL3NyYy9hcGkvcnNhYUVycm9yLmpzIiwiLi4vLi4vc3JjL2FwaS9pbmRleC5qcyIsIi4uLy4uL3NyYy9jb2xsZWN0aW9uL2NvbGxlY3Rpb25BY3Rpb25zLmpzIiwiLi4vLi4vc3JjL2NvbGxlY3Rpb24vY29sbGVjdGlvbkFjdGlvblR5cGVzLmpzIiwiLi4vLi4vc3JjL2NvbGxlY3Rpb24vY29sbGVjdGlvbi5qcyIsIi4uLy4uL3NyYy9jb2xsZWN0aW9uL2luZGV4LmpzIiwiLi4vLi4vc3JjL2RpY3Rpb25hcnkvZGljdGlvbmFyeUFjdGlvbnMuanMiLCIuLi8uLi9zcmMvZGljdGlvbmFyeS9kaWN0aW9uYXJ5QWN0aW9uVHlwZXMuanMiLCIuLi8uLi9zcmMvZGljdGlvbmFyeS9kaWN0aW9uYXJ5LmpzIiwiLi4vLi4vc3JjL2RpY3Rpb25hcnkvaW5kZXguanMiLCIuLi8uLi9zcmMvc3RhY2svc3RhY2tBY3Rpb25zLmpzIiwiLi4vLi4vc3JjL3N0YWNrL3N0YWNrQWN0aW9uVHlwZXMuanMiLCIuLi8uLi9zcmMvc3RhY2svc3RhY2suanMiLCIuLi8uLi9zcmMvc3RhY2svaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBpc0FycmF5IH0gPSBBcnJheVxuXG5leHBvcnQgY29uc3QgQUNUSU9OX1BBVEggPSAnQEByZWR1eC1mb3VuZHJ5J1xuZXhwb3J0IGNvbnN0IGVtcHR5QWN0aW9uID0gKCkgPT4gKHsgdHlwZTogYCR7QUNUSU9OX1BBVEh9L2VtcHR5YCB9KVxuXG5leHBvcnQgY29uc3QgaWRlbnRpdHkgPSB2YWwgPT4gdmFsXG5cbmV4cG9ydCBjb25zdCBpc05pbCA9IHZhbCA9PiB2YWwgPT0gbnVsbFxuXG5leHBvcnQgY29uc3QgaXNVbmRlZmluZWQgPSAodmFsKSA9PiB2YWwgPT09IHVuZGVmaW5lZFxuXG5leHBvcnQgY29uc3QgaXNTdHJpbmdPck51bGwgPSAoc3RyKSA9PiAoXG4gIHN0ciA9PSBudWxsIHx8IHR5cGVvZiBzdHIgPT09ICdzdHJpbmcnXG4pXG5cbmV4cG9ydCBjb25zdCBpc09iamVjdCA9ICh2YWwpID0+IChcbiAgdmFsICE9IG51bGwgJiYgdHlwZW9mIHZhbCA9PT0gJ29iamVjdCdcbilcblxuZXhwb3J0IGNvbnN0IGlzTm9uQXJyYXlPYmplY3QgPSAodmFsKSA9PiAoXG4gICFpc0FycmF5KHZhbCkgJiYgaXNPYmplY3QodmFsKVxuKVxuXG5leHBvcnQgY29uc3QgaXNPYmplY3RPck51bGwgPSAodmFsKSA9PiAoXG4gIHZhbCA9PSBudWxsIHx8IGlzT2JqZWN0KHZhbClcbilcblxuZXhwb3J0IGNvbnN0IGlzRnVuY3Rpb24gPSAodmFsKSA9PiAoXG4gIHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbidcbilcblxuZXhwb3J0IGNvbnN0IGZpbmQgPSAoYXJyLCBwcmVkaWNhdGUpID0+IHtcbiAgZm9yIChsZXQgaSA9IDAsIGlsID0gYXJyLmxlbmd0aDsgaSA8IGlsOyBpKyspIHtcbiAgICBpZiAocHJlZGljYXRlKGFycltpXSwgaSwgYXJyKSkgcmV0dXJuIGFycltpXVxuICB9XG4gIHJldHVybiB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGNvbnN0IHdpdGhvdXQgPSAoYXJyLCAuLi52YWx1ZXMpID0+IChcbiAgYXJyLmZpbHRlcih2YWwgPT4gdmFsdWVzLmluZGV4T2YodmFsKSA9PT0gLTEpXG4pXG5cbmV4cG9ydCBjb25zdCBtYXBWYWx1ZXMgPSAob2JqZWN0LCBpdGVyYXRlZSA9IGlkZW50aXR5KSA9PiB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpXG4gIHJldHVybiBrZXlzLnJlZHVjZSgoYWNjLCBjdXIpID0+IHtcbiAgICByZXR1cm4geyAuLi5hY2MsIFtjdXJdOiBpdGVyYXRlZShjdXIpIH1cbiAgfSwge30pXG59XG5cbmV4cG9ydCBjb25zdCBrZXlCeSA9IChjb2xsZWN0aW9uLCBpdGVyYXRlZSkgPT4ge1xuICBsZXQgZ2V0S2V5ID0gdHlwZW9mIGl0ZXJhdGVlID09PSAnc3RyaW5nJ1xuICAgID8gKHYpID0+IHZbaXRlcmF0ZWVdXG4gICAgOiBpdGVyYXRlZVxuICByZXR1cm4gY29sbGVjdGlvbi5yZWR1Y2UoKGFjYywgY3VyKSA9PiAoe1xuICAgIC4uLmFjYyxcbiAgICBbZ2V0S2V5KGN1cildOiBjdXJcbiAgfSksIHt9KVxufVxuXG4vLyBodHRwczovL3ZpbmNlbnQuYmlsbGV5Lm1lL3B1cmUtamF2YXNjcmlwdC1pbW11dGFibGUtYXJyYXkvI3NwbGljZVxuZXhwb3J0IGNvbnN0IGltbXV0YWJsZVNwbGljZSA9IChhcnIsIHN0YXJ0LCBkZWxldGVDb3VudCwgLi4uaXRlbXMpID0+IChcbiAgWyAuLi5hcnIuc2xpY2UoMCwgc3RhcnQpLCAuLi5pdGVtcywgLi4uYXJyLnNsaWNlKHN0YXJ0ICsgZGVsZXRlQ291bnQpIF1cbilcblxuZXhwb3J0IGNvbnN0IGFwcGx5UXVlcnlQYXJhbXMgPSAodXJsLCBxdWVyeVBhcmFtcykgPT4ge1xuICBjb25zdCBbIGVuZHBvaW50LCBoYXNoIF0gPSB1cmwuc3BsaXQoJyMnKVxuICBjb25zdCBxdWVyeVNlcGFyYXRvciA9IGVuZHBvaW50LmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJidcbiAgcmV0dXJuIGAke2VuZHBvaW50fSR7cXVlcnlTZXBhcmF0b3J9JHtxdWVyeVBhcmFtc30ke2hhc2ggPyBgIyR7aGFzaH1gIDogJyd9YFxufVxuXG5jb25zdCBkZWZhdWx0R2V0S2V5cyA9IFJlZmxlY3QgJiYgUmVmbGVjdC5vd25LZXlzXG5leHBvcnQgY29uc3QgbWF0Y2hlc09iamVjdCA9IChvYmosIHNvdXJjZSwgZ2V0S2V5cyA9IGRlZmF1bHRHZXRLZXlzLCBtYXhMZXZlbCA9IDIsIGxldmVsID0gMCkgPT4ge1xuICBjb25zdCBzcmNLZXlzID0gZ2V0S2V5cyhzb3VyY2UpXG4gIHJldHVybiAhZmluZChzcmNLZXlzLCBrZXkgPT4ge1xuICAgIGNvbnN0IHZhbCA9IG9ialtrZXldXG4gICAgY29uc3Qgc3JjVmFsID0gc291cmNlW2tleV1cbiAgICBpZiAoaXNPYmplY3Qoc3JjVmFsKSkge1xuICAgICAgaWYgKCFpc09iamVjdCh2YWwpKSByZXR1cm4gdHJ1ZVxuICAgICAgaWYgKGxldmVsIDwgbWF4TGV2ZWwpIHJldHVybiAhbWF0Y2hlc09iamVjdCh2YWwsIHNyY1ZhbCwgZ2V0S2V5cywgbWF4TGV2ZWwsIGxldmVsICsgMSlcbiAgICB9XG4gICAgcmV0dXJuIHZhbCAhPT0gc3JjVmFsXG4gIH0pXG59XG5cbmV4cG9ydCBjb25zdCBub3JtYWxpemVBcnJheSA9ICh2YWwpID0+IGlzQXJyYXkodmFsKSA/IHZhbCA6IFt2YWxdXG5cbmV4cG9ydCBjb25zdCBvbmNlID0gZm4gPT4gKC4uLmFyZ3MpID0+IHtcbiAgbGV0IHJlc3VsdFxuICBpZiAoIWZuKSByZXR1cm4gcmVzdWx0XG4gIHJlc3VsdCA9IGZuKC4uLmFyZ3MpXG4gIGZuID0gbnVsbFxufVxuIiwiaW1wb3J0IHsgQUNUSU9OX1BBVEggfSBmcm9tICcuLi91dGlscydcblxuLyoqXG4gKiBLZXkgdXNlZCB0byBkZWZpbmUgdGhlIFwiY2FuY2VsIGFjdGlvblwiIGZ1bmN0aW9uIGluIGFjdGlvbiBtZXRhXG4gKiBAYWxpYXMgbW9kdWxlOmNvcmVcbiAqIEBjb25zdGFudCB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgQ0FOQ0VMID0gYCR7QUNUSU9OX1BBVEh9L2NhbmNlbEFjdGlvbmBcblxuLyoqXG4gKiBEZWZhdWx0IFwiQ2FuY2VsIEFjdGlvblwiIHR5cGVcbiAqIEBhbGlhcyBtb2R1bGU6Y29yZVxuICogQGNvbnN0YW50IHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBBQ1RJT05fQ0FOQ0VMRUQgPSBgJHtBQ1RJT05fUEFUSH0vY2FuY2VsZWRgXG5cbi8qKlxuICogQWN0aW9uIENyZWF0b3IgZm9yIEFDVElPTl9DQU5DRUxFRCBhY3Rpb25zXG4gKiBAYWxpYXMgbW9kdWxlOmNvcmVcbiAqIEBwYXJhbSB7c3RyaW5nfSBhY3Rpb24gdGhlIG9yaWdpbmFsIGFjdGlvbiB0byBiZSBjYW5jZWxlZFxuICogQHJldHVybiB7e319IEZTQSB3LyBgQUNUSU9OX0NBTkNFTEVEYCBhcyB0eXBlIGFuZCBgYWN0aW9uYCBhcyBwYXlsb2FkXG4gKi9cbmV4cG9ydCBjb25zdCBjYW5jZWxlZEFjdGlvbiA9IChhY3Rpb24pID0+ICh7XG4gIHR5cGU6IEFDVElPTl9DQU5DRUxFRCxcbiAgcGF5bG9hZDogYWN0aW9uXG59KVxuIiwiaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7XG4gIENBTkNFTCxcbiAgY2FuY2VsZWRBY3Rpb25cbn0gZnJvbSAnLi9jYW5jZWxBY3Rpb25zJ1xuXG4vKipcbiAqIGNvbmZpZ3VyYWJsZSB2ZXJzaW9uIG9mIGNhbmNlbEFjdGlvbk1pZGRsZXdhcmUsIGlmIHVzZXIgd2FudHMgdG8gdXNlIG93blxuICogXCJjYW5jZWxBY3Rpb25cIiBjcmVhdG9yLCBpbnN0ZWFkIG9mIGJ1aWx0LWluIHJlZHV4LWZvdW5kcnkgdmVyc2lvbi5cbiAqXG4gKiBAYWxpYXMgbW9kdWxlOmNvcmVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGFjdGlvbkNyZWF0b3Igb3ZlcnJpZGUgdGhlIGRlZmF1bHQgQUNUSU9OX0NBTkNFTEVEIGNyZWF0b3JcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSBhIHJlZHV4LW1pZGRsZXdhcmUgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGNvbnN0IGNvbmZpZ3VyZUNhbmNlbEFjdGlvbk1pZGRsZXdhcmUgPSAoYWN0aW9uQ3JlYXRvciA9IGNhbmNlbGVkQWN0aW9uKSA9PlxuICBzdG9yZSA9PiBuZXh0ID0+IGFjdGlvbiA9PiB7XG4gICAgY29uc3QgeyBnZXRTdGF0ZSB9ID0gc3RvcmVcbiAgICBjb25zdCB7IG1ldGEgPSB7fSB9ID0gYWN0aW9uXG4gICAgY29uc3QgY2FuY2VsID0gaXNPYmplY3QobWV0YSkgPyBtZXRhW0NBTkNFTF0gOiBudWxsXG5cbiAgICBpZiAoY2FuY2VsICYmIGNhbmNlbChnZXRTdGF0ZSgpLCBhY3Rpb24pKSB7XG4gICAgICByZXR1cm4gbmV4dChhY3Rpb25DcmVhdG9yKGFjdGlvbikpXG4gICAgfVxuICAgIHJldHVybiBuZXh0KGFjdGlvbilcbiAgfVxuXG5jb25zdCBkZWZhdWx0Q2FuY2VsQWN0aW9uTWlkZGxld2FyZSA9IGNvbmZpZ3VyZUNhbmNlbEFjdGlvbk1pZGRsZXdhcmUoKVxuXG4vKipcbiAqIE1pZGRsZXdhcmUgdGhhdCBhbGxvd3MgZm9yIGNhbmNlbGF0aW9uIG9mIEZTQXMuXG4gKlxuICogVG8gdXNlLCBhZGQgYSBgQ0FOQ0VMYCBmdW5jdGlvbiBwcm9wZXJ0eSB0byBhbnkgbm9ybWFsIEZTQSBhY3Rpb24ncyBtZXRhIGRhdGEuXG4gKlxuICogVGhlIHZhbHVlIG9mIHRoZSBgQ0FOQ0VMYCBmdW5jdGlvbiBzaG91bGQgYmUgb2YgZm9ybTpcbiAqICAgKHN0YXRlOiBPYmplY3QsIGFjdGlvbjogRlNBKSA9PiBib29sZWFuXG4gKlxuICogV2hlbiBldmFsdWF0ZWQsIGlmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUgdGhlIGFjdGlvbiB3aWxsIGJlIHJlcGxhY2VkIGJ5IGBBQ1RJT05fQ0FOQ0VMRURgLlxuICpcbiAqIEV4YW1wbGUgMSAoRlNBKTpcbiAqIEFueSBub3JtYWwgRlNBIGNhbiBiZSBjYW5jZWxlZDpcbiAqIGBgYFxuICoge1xuICogICB0eXBlOiAnRk9PJyxcbiAqICAgbWV0YToge1xuICogICAgIFtDQU5DRUxdOiAoc3RhdGUsIGFjdGlvbikgPT4gKHNob3VsZENhbmNlbChzdGF0ZSwgYWN0aW9uKSA/IHRydWUgOiBmYWxzZSlcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogRXhhbXBsZSAyOiAoUlNBQSlcbiAqIFdoZW4gdXNlZCBhbG9uZ3NpZGUgYHJlZHV4LWFwaS1taWRkbGV3YXJlYCAmIGBhcGlNZXRhYCBtaWRkbGV3YXJlLCBpdCBnZXRzIG1vcmUgdXNlZnVsLlxuICogWW91IGNhbiBhZGQgYENBTkNFTGAgdG8gYW4gUlNBQSwgYW5kIGl0IGNhbiBjYW5jZWwgdGhlIGFzeW5jIHJlcXVlc3Qvc3VjY2Vzcy9mYWlsdXJlIEZTQXMuXG4gKiBgYGBcbiAqIHtcbiAqICAgW1JTQUFdOiB7IC4uLiB9LFxuICogICBbUlNBQV9NRVRBXToge1xuICogICAgIFtDQU5DRUxdOiAoc3RhdGUsIGFjdGlvbikgPT4gKHNob3VsZENhbmNlbChzdGF0ZSwgYWN0aW9uKSA/IHRydWUgOiBmYWxzZSlcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQGFsaWFzIG1vZHVsZTpjb3JlXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gbm9ybWFsIHJlZHV4LW1pZGRsZXdhcmUgc2lnbmF0dXJlXG4gKi9cbmNvbnN0IGNhbmNlbEFjdGlvbk1pZGRsZXdhcmUgPSAoc3RvcmUpID0+IGRlZmF1bHRDYW5jZWxBY3Rpb25NaWRkbGV3YXJlKHN0b3JlKVxuZXhwb3J0IGRlZmF1bHQgY2FuY2VsQWN0aW9uTWlkZGxld2FyZVxuIiwiaW1wb3J0IHsgaXNPYmplY3RPck51bGwsIG1hdGNoZXNPYmplY3QgfSBmcm9tICcuLi91dGlscydcblxuLyoqXG4gKiByZXR1cm5zIHRydWUgaWYgYWN0aW9uJ3MgbWV0YSB2YWx1ZSBtYXRjaGVzIHRhcmdldC5cbiAqIHVzZXMgc3RyaWN0IGVxdWFsaXR5IGZvciBtYXRjaGluZyBwcm9wZXJ0eSB2YWx1ZXMuXG4gKiB1c2VmdWwgZm9yIHRlc3RpbmcgYWN0aW9uIGFnYWluc3QgZXhwZWN0ZWQgYG1ldGFgIHByb3BlcnR5IHdoZW4gYWN0aW9uJ3MgYHR5cGVgIGlzbid0IHN1ZmZpY2llbnQuXG4gKiBAYWxpYXMgbW9kdWxlOmNvcmVcbiAqIEBwYXJhbSB7e319IGFjdGlvbiB0aGUgYWN0aW9uIChGU0EpIHRvIHRlc3RcbiAqIEBwYXJhbSB7e319IG1ldGEgZXhwZWN0ZWQgbWV0YSBvYmplY3QgZm9yIG1hdGNoXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0S2V5cz1SZWZsZWN0Lm93bktleXNdIGN1c3RvbSBtZXRob2QgdG8gZGV0ZXJtaW5lIG1hdGNoYWJsZSBwcm9wZXJ0aWVzXG4gKiBAcGFyYW0ge251bWJlcn0gW21heExldmVsPTJdIG1heCBvYmplY3QgZGVwdGggZm9yIG1hdGNoaW5nIGFsZ29yaXRobS4gZGVmYXVsdHMgdG8gYDJgXG4gKiBAcmV0dXJuIHtib29sZWFufSByZXR1cm5zIGB0cnVlYCBmb3IgbWF0Y2gsIGBmYWxzZWAgb3RoZXJ3aXNlXG4gKi9cbmNvbnN0IG1hdGNoZXNNZXRhID0gKGFjdGlvbiwgbWV0YSwgZ2V0S2V5cywgbWF4TGV2ZWwpID0+IHtcbiAgaWYgKGlzT2JqZWN0T3JOdWxsKG1ldGEpKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNPYmplY3QoYWN0aW9uLm1ldGEsIG1ldGEgfHwge30sIGdldEtleXMsIG1heExldmVsKVxuICB9XG4gIHJldHVybiBhY3Rpb24ubWV0YSA9PT0gbWV0YVxufVxuXG5leHBvcnQgZGVmYXVsdCBtYXRjaGVzTWV0YVxuXG4vKipcbiAqIENvbmZpZ3VyYWJsZSB2ZXJzaW9uIG9mIG1hdGNoZXNNZXRhLlxuICogQWNjZXB0cyBgb3B0aW9uc2AgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB3aGljaCBjYWxscyBtYXRjaGVzTWV0YSB1c2luZyB0aG9zZSBvcHRpb25zLlxuICogQGFsaWFzIG1vZHVsZTpjb3JlXG4gKiBAcGFyYW0ge3t9fSBvcHRpb25zIGFwaUFjdGlvblR5cGVzIG9wdGlvbnNcbiAqIEBwYXJhbSB7e319IFtvcHRpb25zLmRlZmF1bHRNZXRhPXt9XSBkZWZhdWx0IG1ldGEgdG8gdXNlIGluIHJlc3VsdCBmdW5jdGlvbiwgd2hlbiBtZXRhIGFyZyBub3Qgc3VwcGxpZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtvcHRpb25zLmdldEtleXNdIGdldEtleXMgYXJndW1lbnQgZm9yIG1hdGNoZXNNZXRhXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4TGV2ZWw9Ml0gbWF4TGV2ZWwgYXJndW1lbnQgZm9yIG1hdGNoZXNNZXRhXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gcHJlY29uZmlndXJlZCBtYXRjaGVzTWV0YSBmdW5jdGlvbiB0aGF0IG9ubHkgYWNjZXB0cyAyIGFyZ3VtZW50cyAodHlwZSwgbWV0YSlcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbmZpZ3VyZU1hdGNoZXNNZXRhID0gKHtcbiAgZGVmYXVsdE1ldGEsXG4gIGdldEtleXMsXG4gIG1heExldmVsXG59ID0ge30pID0+IChhY3Rpb24sIG1ldGEgPSBkZWZhdWx0TWV0YSkgPT4gbWF0Y2hlc01ldGEoYWN0aW9uLCBtZXRhLCBnZXRLZXlzLCBtYXhMZXZlbClcbiIsIi8qKlxuICogcmV0dXJucyB0cnVlIGlmIGFjdGlvbidzIHR5cGUgbWF0Y2hlcyBhbnkgc3VwcGxpZWQgdHlwZS5cbiAqIEBhbGlhcyBtb2R1bGU6Y29yZVxuICogQHBhcmFtIHtvYmplY3R9IGFjdGlvbiBhY3Rpb24gKEZTQSkgdG8gdGVzdFxuICogQHBhcmFtIHsuLi5zdHJpbmd9IHR5cGVzIGFjdGlvbiB0eXBlIHN0cmluZ3MgdG8gdGVzdCBhZ2FpbnN0XG4gKiBAcmV0dXJuIHtib29sZWFufSByZXR1cm5zIGB0cnVlYCBmb3IgbWF0Y2gsIGBmYWxzZWAgb3RoZXJ3aXNlXG4gKi9cbmNvbnN0IG1hdGNoZXNUeXBlID0gKGFjdGlvbiwgLi4udHlwZXMpID0+IHtcbiAgY29uc3QgeyB0eXBlIH0gPSBhY3Rpb25cbiAgcmV0dXJuIHR5cGVzLmluZGV4T2YodHlwZSkgIT09IC0xXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1hdGNoZXNUeXBlXG4iLCJpbXBvcnQgbWF0Y2hlc1R5cGUgZnJvbSAnLi9tYXRjaGVzVHlwZSdcblxuLyoqXG4gKiBCYXNpYyBcImhpc3RvcnlcIiB0cmFja2VyIHJlZHVjZXIgZm9yIGVhc2Utb2YtdXNlIHcvIGFueSBGU0EocykuXG4gKiBLZWVwcyB0cmFjayBvZiBhIHN0YWNrIGFjdGlvbiBwYXlsb2FkcyBmb3IgdGFyZ2V0ZWQgYWN0aW9uIHR5cGVzLlxuICogSWYgeW91IHdvdWxkIGxpa2UgdG8gdHJhY2sgYSBzdGFjayBvZiBcIlJTQUEgUmVzcG9uc2UgRXJyb3JzXCIgKG9yXG4gKiBzb21ldGhpbmcgYWxvbmcgdGhvc2UgbGluZXMpIHlvdSBjYW4gY29tYmluZSB0aGlzIHdpdGggdGhlIGB3aXRoRXJyb3JgXG4gKiBoaWdoZXIgb3JkZXIgcmVkdWNlci5cbiAqIGBgYFxuICogKC4uLnN0cmluZykgPT4gKHN0YXRlOiBbXSwgYWN0aW9uOiBGU0EpID0+IFtdXG4gKiBgYGBcbiAqIEBhbGlhcyBtb2R1bGU6Y29yZVxuICogQHBhcmFtIHsqfSBkZWZhdWx0U3RhdGUgaW5pdGlhbCBzdGF0ZSB0byByZXR1cm4sIG51bGwgb3IgZXJyb3JcbiAqIEBwYXJhbSB7Li4uc3RyaW5nfSB0eXBlcyBhY3Rpb24gdHlwZXMgdG8gbWF0Y2ggZm9yIHBheWxvYWQgaGlzdG9yeVxuICogQHJldHVybiB7ZnVuY3Rpb259IHJlZHV4IHJlZHVjZXIgZnVuY3Rpb25cbiAqL1xuY29uc3QgcGF5bG9hZEhpc3RvcnlSZWR1Y2VyID0gKGRlZmF1bHRTdGF0ZSA9IFtdLCAuLi50eXBlcykgPT4ge1xuICByZXR1cm4gKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24gPSB7fSkgPT4ge1xuICAgIGlmIChtYXRjaGVzVHlwZShhY3Rpb24sIC4uLnR5cGVzKSkge1xuICAgICAgcmV0dXJuIFsgLi4uc3RhdGUsIGFjdGlvbi5wYXlsb2FkIF1cbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcGF5bG9hZEhpc3RvcnlSZWR1Y2VyXG4iLCJpbXBvcnQgbWF0Y2hlc1R5cGUgZnJvbSAnLi4vbWF0Y2hlc1R5cGUnXG5pbXBvcnQgeyBBQ1RJT05fQ0FOQ0VMRUQgfSBmcm9tICcuLi9jYW5jZWxBY3Rpb25zJ1xuXG4vKipcbiAqIEVuaGFuY2VzIHJlZHVjZXIgdG8gaGFuZGxlIFwiY2FuY2VsZWRcIiBhY3Rpb25zLCBhcyB1c2VkIGJ5IGNhbmNlbEFjdGlvbk1pZGRsZXdhcmUuXG4gKiBgYGBcbiAqIHR5cGUgUmVkdWNlciA9IChzdGF0ZTogYW55LCBhY3Rpb246IEZTQSkgPT4gYW55XG4gKiAoLi4uc3RyaW5nKSA9PiBSZWR1Y2VyID0+IFJlZHVjZXJcbiAqIGBgYFxuICogQGFsaWFzIG1vZHVsZTpjb3JlXG4gKiBAcGFyYW0gey4uLnN0cmluZ30gdHlwZXMgYWRkaXRpb25hbCBcImNhbmNlbFwiIGFjdGlvbiB0eXBlc1xuICogQHJldHVybiB7ZnVuY3Rpb259IHJlZHV4IGhpZ2hlciBvcmRlciByZWR1Y2VyIGZ1bmN0aW9uXG4gKi9cbmNvbnN0IHdpdGhDYW5jZWxlZCA9ICguLi50eXBlcykgPT4gKHJlZHVjZXIpID0+IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGlmIChtYXRjaGVzVHlwZShhY3Rpb24sIEFDVElPTl9DQU5DRUxFRCwgLi4udHlwZXMpKSB7XG4gICAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb25cbiAgICByZXR1cm4gcmVkdWNlcihzdGF0ZSwgcGF5bG9hZClcbiAgfVxuICByZXR1cm4gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKVxufVxuXG5leHBvcnQgZGVmYXVsdCB3aXRoQ2FuY2VsZWRcbiIsImltcG9ydCB7IGVtcHR5QWN0aW9uIH0gZnJvbSAnLi4vLi4vdXRpbHMnXG5cbi8qKlxuICogRW5oYW5jZXMgcmVkdWNlciB0byBpbmNsdXNpdmVseSBvciBleGNsdXNpdmVseSBoYW5kbGUgYWN0aW9ucyB3aXRoIGBlcnJvcmBcbiAqIGJvb2xlYW4gcHJvcGVydHksIGFzIHVzZWQgYnkgZmx1eC1zdGFuZGFyZC1hY3Rpb24gKEZTQSkgc3BlYy5cbiAqIGBgYFxuICogdHlwZSBSZWR1Y2VyID0gKHN0YXRlOiBhbnksIGFjdGlvbjogRlNBKSA9PiBhbnlcbiAqIChpbmNsdXNpdmU6IGJvb2xlYW4pID0+IFJlZHVjZXIgPT4gUmVkdWNlclxuICogYGBgXG4gKiBAYWxpYXMgbW9kdWxlOmNvcmVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2luY2x1c2l2ZT10cnVlXSBpZiB0cnVlIGZvcndhcmQgYWN0aW9uIHdoZW4gZXJyb3IgaXMgdHJ1ZTsgaW52ZXJzZSBvdGhlcndpc2VcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSByZWR1eCBoaWdoZXIgb3JkZXIgcmVkdWNlciBmdW5jdGlvblxuICovXG5jb25zdCB3aXRoRXJyb3IgPSAoaW5jbHVzaXZlID0gdHJ1ZSkgPT4gKHJlZHVjZXIpID0+IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IHsgZXJyb3IgfSA9IGFjdGlvblxuICBpZiAoaW5jbHVzaXZlKSB7XG4gICAgcmV0dXJuIGVycm9yID8gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKSA6IHJlZHVjZXIoc3RhdGUsIGVtcHR5QWN0aW9uKCkpXG4gIH1cbiAgcmV0dXJuIGVycm9yID8gcmVkdWNlcihzdGF0ZSwgZW1wdHlBY3Rpb24oKSkgOiByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pXG59XG5cbmV4cG9ydCBkZWZhdWx0IHdpdGhFcnJvclxuIiwiLyoqXG4gKiBFbmhhbmNlcyByZWR1Y2VyIHRvIGxpbWl0IGxlbmd0aCBvZiBhcnJheSBzdGF0ZS5cbiAqIGBgYFxuICogdHlwZSBSZWR1Y2VyID0gKHN0YXRlOiBhbnksIGFjdGlvbjogRlNBKSA9PiBhbnlcbiAqIChsaW1pdDogbnVtYmVyLCBxdWV1ZTogYm9vbGVhbikgPT4gUmVkdWNlciA9PiBSZWR1Y2VyXG4gKiBgYGBcbiAqIEBhbGlhcyBtb2R1bGU6Y29yZVxuICogQHBhcmFtIHtudW1iZXJ9IFtsaW1pdD0xMF0gbWF4IGxlbmd0aCBmb3IgYXJyYXlcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3F1ZXVlPWZhbHNlXSBzbGljZSBhcnJheSBmcm9tIGJlZ2luaW5nfGVuZCAoZm9yIHF1ZXVlfHN0YWNrKVxuICogQHJldHVybiB7ZnVuY3Rpb259IHJlZHV4IGhpZ2hlciBvcmRlciByZWR1Y2VyIGZ1bmN0aW9uXG4gKi9cbmNvbnN0IHdpdGhMaW1pdCA9IChsaW1pdCA9IDEwLCBxdWV1ZSA9IGZhbHNlKSA9PiAocmVkdWNlcikgPT4gKHN0YXRlID0gW10sIGFjdGlvbikgPT4ge1xuICBjb25zdCBuZXh0U3RhdGUgPSByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pXG4gIGlmIChuZXh0U3RhdGUubGVuZ3RoID4gbGltaXQpIHtcbiAgICBpZiAocXVldWUpIHJldHVybiBuZXh0U3RhdGUuc2xpY2UoMCwgbGltaXQpXG4gICAgcmV0dXJuIG5leHRTdGF0ZS5zbGljZSgtKGxpbWl0KSlcbiAgfVxuICByZXR1cm4gbmV4dFN0YXRlXG59XG5cbmV4cG9ydCBkZWZhdWx0IHdpdGhMaW1pdFxuIiwiaW1wb3J0IG1hdGNoZXNUeXBlIGZyb20gJy4uL21hdGNoZXNUeXBlJ1xuaW1wb3J0IHsgQUNUSU9OX1BBVEggfSBmcm9tICcuLi8uLi91dGlscydcblxuLyoqXG4gKiBFbmhhbmNlcyByZWR1Y2VyIHRvIHJlc2V0IHN0YXRlIHdoZW4gaGFuZGxpbmcgYSBjb25maWd1cmVkIGFjdGlvbi5cbiAqIGBgYFxuICogdHlwZSBSZWR1Y2VyID0gKHN0YXRlOiBhbnksIGFjdGlvbjogRlNBKSA9PiBhbnlcbiAqICguLi5zdHJpbmcpID0+IFJlZHVjZXIgPT4gUmVkdWNlclxuICogYGBgXG4gKiBAYWxpYXMgbW9kdWxlOmNvcmVcbiAqIEBwYXJhbSB7Li4uc3RyaW5nfSB0eXBlcyBhY3Rpb24gdHlwZXMgdGhhdCBzaG91bGQgdHJpZ2dlciByZXNldFxuICogQHJldHVybiB7ZnVuY3Rpb259IHJlZHV4IGhpZ2hlciBvcmRlciByZWR1Y2VyIGZ1bmN0aW9uXG4gKi9cbmNvbnN0IHdpdGhSZXNldCA9ICguLi50eXBlcykgPT4gKHJlZHVjZXIpID0+IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGlmIChtYXRjaGVzVHlwZShhY3Rpb24sIC4uLnR5cGVzKSkge1xuICAgIHJldHVybiByZWR1Y2VyKHVuZGVmaW5lZCwgeyB0eXBlOiBgJHtBQ1RJT05fUEFUSH0vcmVzZXRgIH0pXG4gIH1cbiAgcmV0dXJuIHJlZHVjZXIoc3RhdGUsIGFjdGlvbilcbn1cblxuZXhwb3J0IGRlZmF1bHQgd2l0aFJlc2V0XG4iLCIvKipcbiAqIEVuaGFuY2VzIHJlZHVjZXIgdG8gdXNlIGEgbmV3IFwiZGVmYXVsdCBzdGF0ZVwiLlxuICogR2VuZXJhbGx5LCBtb3N0bHkgdXNlZnVsIGZvciB0ZXN0aW5nLlxuICogYGBgXG4gKiB0eXBlIFJlZHVjZXIgPSAoc3RhdGU6IGFueSwgYWN0aW9uOiBGU0EpID0+IGFueVxuICogKGFueSkgPT4gUmVkdWNlciA9PiBSZWR1Y2VyXG4gKiBgYGBcbiAqIEBhbGlhcyBtb2R1bGU6Y29yZVxuICogQHBhcmFtIHthbnl9IGRlZmF1bHRTdGF0ZSBvdmVycmlkZXMgdGhlIHJlZHVjZXIncyBkZWZhdWx0IHN0YXRlIHZhbHVlXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gcmVkdXggaGlnaGVyIG9yZGVyIHJlZHVjZXIgZnVuY3Rpb25cbiAqL1xuY29uc3Qgd2l0aERlZmF1bHRTdGF0ZSA9IChkZWZhdWx0U3RhdGUpID0+IChyZWR1Y2VyKSA9PlxuICAoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikgPT4gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKVxuXG5leHBvcnQgZGVmYXVsdCB3aXRoRGVmYXVsdFN0YXRlXG4iLCJpbXBvcnQgeyBlbXB0eUFjdGlvbiB9IGZyb20gJy4uL3V0aWxzJ1xuLyoqXG4gKiBHaXZlbiBhbiBhcnJheSBvZiBhY3Rpb24gb2JqZWN0cywgcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBhXG4gKiByZWR1Y2VyIGZ1bmN0aW9uIGFuZCByZXR1cm5zIGFsbCBpbnRlcm1lZGlhcnkgc3RhdGVzLCBpbmNsdWRpbmcgaW5pdGlhbFxuICogYW5kIGZpbmFsLiAgVXNlZnVsIGZvciB1bml0IHRlc3RzLlxuICpcbiAqIENhbiBhbHNvIGJlIGNhbGxlZCB3aXRoIGludmVydGVkIGFyZ3VtZW50cy4gSWYgeW91IHBhc3MgYSBgZnVuY3Rpb25gIGFzXG4gKiBmaXJzdCBhcmd1bWVudCwgdGhlIHJlc3VsdCBmdW5jdGlvbiB3aWxsIGV4cGVjdCBhbiBhcnJheSBvZiBhY3Rpb25zLlxuICpcbiAqIE5PVEU6IFRoaXMgaW1wbGVtZW50YXRpb24gd2lsbCBhbHdheXMgaW5jbHVkZSB0aGUgXCJpbml0aWFsXCIgc3RhdGUgb2ZcbiAqIHRoZSByZWR1Y2VyIGFzIHRoZSBmaXJzdCBlbGVtZW50IGluIHJlc3VsdCBhcnJheS4gIElmIHlvdSB3b3VsZCBsaWtlXG4gKiB0byBvbWl0IHRoaXMsIHlvdSBjYW4gdXNlIHRoZSBgQXJyYXkucHJvdG90eXBlLnNsaWNlYCBtZXRob2QgbGlrZSBzbzpcbiAqIGBgYFxuICogY29uc3Qgc3RhdGVzID0gcmVkdWNlU3RhdGVzKGFjdGlvbnMpKHJlZHVjZXIpXG4gKiBjb25zdCB3aXRob3V0SW5pdGlhbFN0YXRlID0gc3RhdGVzLnNsaWNlKDEpXG4gKiBjb25zdCB3aXRob3V0Rmlyc3ROU3RhdGVzID0gc3RhdGVzLnNsaWNlKE4pXG4gKiBgYGBcbiAqXG4gKiBgYGBcbiAqIHR5cGUgUmVkdWNlciA9IChzdGF0ZTogYW55LCBhY3Rpb246IEZTQSkgPT4gYW55XG4gKiBgYGBcbiAqIEBhbGlhcyBtb2R1bGU6Y29yZVxuICogQHBhcmFtIHtPYmplY3RbXXxSZWR1Y2VyfSBhcmcxIGFycmF5IG9mIGFjdGlvbnMgdG8gcHJvY2VzcyBvciByZWR1Y2VyIGZ1bmN0aW9uXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gKFJlZHVjZXJ8T2JqZWN0W10pID0+IGFueVtdKSBwcm9kdWNlcyByZXN1bHRpbmcgc3RhdGVzIGFzIGFycmF5XG4gKi9cbmNvbnN0IHJlZHVjZVN0YXRlcyA9IChhcmcxKSA9PiAoYXJnMikgPT4ge1xuICBjb25zdCBhY3Rpb25zID0gdHlwZW9mIGFyZzEgPT09ICdmdW5jdGlvbicgPyBhcmcyIDogYXJnMVxuICBjb25zdCByZWR1Y2VyID0gYWN0aW9ucyA9PT0gYXJnMSA/IGFyZzIgOiBhcmcxXG4gIHJldHVybiBhY3Rpb25zLnJlZHVjZSgoYWNjLCBjdXIsIGkpID0+IChcbiAgICBbIC4uLmFjYywgcmVkdWNlcihhY2NbaV0sIGN1cikgXVxuICApLCBbIHJlZHVjZXIodW5kZWZpbmVkLCBlbXB0eUFjdGlvbigpKSBdKVxufVxuXG5leHBvcnQgZGVmYXVsdCByZWR1Y2VTdGF0ZXNcbiIsIi8qKlxuICogY29yZSB1dGlsaXRpZXNcbiAqIEBtb2R1bGUgY29yZVxuICovXG5leHBvcnQge1xuICBDQU5DRUwsXG4gIEFDVElPTl9DQU5DRUxFRCxcbiAgY2FuY2VsZWRBY3Rpb25cbn0gZnJvbSAnLi9jYW5jZWxBY3Rpb25zJ1xuZXhwb3J0IHtcbiAgZGVmYXVsdCBhcyBjYW5jZWxBY3Rpb25NaWRkbGV3YXJlLFxuICBjb25maWd1cmVDYW5jZWxBY3Rpb25NaWRkbGV3YXJlXG59IGZyb20gJy4vY2FuY2VsQWN0aW9uTWlkZGxld2FyZSdcbmV4cG9ydCB7XG4gIGRlZmF1bHQgYXMgbWF0Y2hlc01ldGEsXG4gIGNvbmZpZ3VyZU1hdGNoZXNNZXRhXG59IGZyb20gJy4vbWF0Y2hlc01ldGEnXG5leHBvcnQge1xuICBkZWZhdWx0IGFzIG1hdGNoZXNUeXBlXG59IGZyb20gJy4vbWF0Y2hlc1R5cGUnXG5leHBvcnQgeyBkZWZhdWx0IGFzIHBheWxvYWRIaXN0b3J5UmVkdWNlciB9IGZyb20gJy4vcGF5bG9hZEhpc3RvcnknXG5leHBvcnQgKiBmcm9tICcuL2VuaGFuY2Vycy9pbmRleCdcbmV4cG9ydCB7IGRlZmF1bHQgYXMgcmVkdWNlU3RhdGVzIH0gZnJvbSAnLi9yZWR1Y2VTdGF0ZXMnXG4iLCJpbXBvcnQgeyBSU0FBIH0gZnJvbSAncmVkdXgtYXBpLW1pZGRsZXdhcmUnXG5cbmV4cG9ydCBjb25zdCBSU0FBX0VYVCA9IGAke1JTQUF9L2V4dC9yZWR1eC1mb3VuZHJ5YFxuIiwiaW1wb3J0IHsgUlNBQSwgaXNSU0FBIH0gZnJvbSAncmVkdXgtYXBpLW1pZGRsZXdhcmUnXG5pbXBvcnQge1xuICBpc09iamVjdCxcbiAgaXNPYmplY3RPck51bGwsXG4gIGlzRnVuY3Rpb25cbn0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBSU0FBX0VYVCB9IGZyb20gJy4vcnNhYUV4dCdcblxuY29uc3QgUlNBQV9UWVBFUyA9IFsncmVxdWVzdCcsICdzdWNjZXNzJywgJ2ZhaWx1cmUnXVxuXG4vKipcbiAqIFN5bWJvbCB1c2VkIHRvIGRlZmluZSBhZGRpdGlvbmFsIG1ldGEgZGF0YSBmb3IgYW4gUlNBQVxuICogQGFsaWFzIG1vZHVsZTphcGlcbiAqIEBjb25zdGFudCB7c3ltYm9sfVxuICovXG5leHBvcnQgY29uc3QgUlNBQV9NRVRBID0gU3ltYm9sKGAke1JTQUFfRVhUfS9tZXRhYClcblxuLyoqXG4gKiBBbGxvd3MgY29uZmlndXJpbmcgUlNBQXMgd2l0aCBtZXRhIGRhdGEuICBBbGwgYXN5bmMgRlNBcyBkaXNwYXRjaGVkIGR1ZSB0byB0aGUgYXBpIGNhbGxcbiAqIHdpbGwgaW5jbHVkZSB0aGlzIGRhdGEgaW5zaWRlIG9mIHRoZWlyIGBtZXRhYCBwcm9wZXJ0eS5cbiAqXG4gKiBPbmx5IHN1cHBvcnRzIG9iamVjdCB2YWx1ZXMgZm9yIHRoZSBSU0FBIGBtZXRhYCBwcm9wZXJ0eS4gIElmIGFuIFJTQUEgdHlwZSBkZXNjcmlwdG9yXG4gKiByZXR1cm5zIGEgbm9uLW9iamVjdCB2YWx1ZSBmb3IgaXRzIGBtZXRhYCBwcm9wZXJ0eSwgUlNBQSBtZXRhZGF0YSB3b24ndCBiZSBhcHBsaWVkIHRvIEZTQS5cbiAqXG4gKiBTaW5jZSBSU0FBcyBhbGxvd3MgZm9yIHR5cGVEZXNjcmlwdG9ycyB0byBiZSBkZWZpbmVkIGFzIGEgc3RyaW5nIGJlZm9yZSByZWR1eC1hcGktbWlkZGxld2FyZVxuICogYmxvd3MgdGhlbSB1cCB0byByZWFsIGZsdXggc3RhbmRhcmQgYWN0aW9ucyAoRlNBcyksIHJzYWFNZXRhTWlkZGxld2FyZSBzaG91bGQgYmUgYWRkZWQgYmVmb3JlXG4gKiByZWR1eC1hcGktbWlkZGxld2FyZSBpbiB0aGUgbWlkZGxld2FyZSBjaGFpbiBzbyB0aGF0IGl0IGNhbiBtb2RpZnkgdHlwZSBkZXNjcmlwdG9ycyB3aXRoXG4gKiBtZXRhZGF0YSBiZWZvcmUgdGhlIFJTQUEgaXMgY29uc3VtZWQgYnkgdGhlIGFwaU1pZGRsZXdhcmUuXG4gKlxuICogVGhlIHdoZW4gYXBwbHlpbmcgdmFsdWVzIHRvIEZTQSBtZXRhIHByb3BlcnRpZXMsIHJzYWFNZXRhTWlkZGxld2FyZSB3aWxsIGFsc28gYXBwZW5kIGFuXG4gKiBhZGRpdGlvbmFsIFwicnNhYVByb3BzXCIgcHJvcGVydHksIHdpdGggdGhlIG9yaWdpbmFsIFJTQUEgcGFyYW1zIHVzZWQgdG8gdHJpZ2dlciB0aGUgYXNzb2NpYXRlZFxuICogbmV0d29yayByZXF1ZXN0LiAgVGhpcyBjYW4gYmUgdXNlZnVsIGZvciBkZWJ1Z2dpbiwgYnV0IGFsc28gaW4gY2FzZSB5b3UgbmVlZCB0byBwZXJmb3JtIHNvbWVcbiAqIGFzeW5jIGxvZ2ljIGJhc2VkIG9uIHRoZSByZXNwb25zZSBhY3Rpb24gQU5EIHRoZSBvcmlnaW5hbCByc2FhUHJvcHMuXG4gKlxuICogVGhpcyBpcyBtYWlubHkgYSBjb252aWVuZW5jZSBvcHRpb24gZm9yIGNvbW1vbiB1c2UtY2FzZXMuICBSU0FBIHR5cGUgZGVzY3JpcHRvcnNcbiAqIGNhbiBhbHNvIGJlIGNvbmZpZ3VyZWQgbWFudWFsbHkgaW4gZWFjaCBBUEkgYWN0aW9uIGNyZWF0b3IgZnVuY3Rpb24uIFNlZTpcbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL2FncmFib3NvL3JlZHV4LWFwaS1taWRkbGV3YXJlI2N1c3RvbWl6aW5nLXRoZS1kaXNwYXRjaGVkLWZzYXNcbiAqXG4gKiBFeGFtcGxlIDE6XG4gKiBBbnkgUlNBQSBjYW4gYmUgZ2l2ZW4gYSBgUlNBQV9NRVRBYCBzeW1ib2wgcHJvcGVydHk6XG4gKiBgYGBcbiAqIHtcbiAqICAgW1JTQUFdOiB7IC4uLiB9LFxuICogICBbUlNBQV9NRVRBXToge1xuICogICAgIGZvbzogJ2JhcidcbiAqICAgfVxuICogfVxuICogYGBgXG4gKiBBbGwgZGlzcGF0Y2hlZCBSRVFVRVNUfFNVQ0NFU1N8RkFJTFVSRSBhY3Rpb25zIHdpbGwgdGhlbiBiZSBkaXNwYXRjaGVkIHdpdGggdGhpcyBzYW1lIG1ldGFkYXRhOlxuICogYGBgXG4gKiB7XG4gKiAgIHR5cGU6IEZBSUxVUkUsXG4gKiAgIHBheWxvYWQ6IHsgLi4uIH0sXG4gKiAgIG1ldGE6IHtcbiAqICAgICBmb286ICdiYXInLFxuICogICAgIC8vIC4uLiBhbmQgYW55IGFkZGl0aW9uYWwgbWV0YSB2YWx1ZXMgc3VwcGxpZWQgYnkgdGhlIG9yaWdpbmFsIFJTQUFcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQGFsaWFzIG1vZHVsZTphcGlcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSBub3JtYWwgcmVkdXgtbWlkZGxld2FyZSBzaWduYXR1cmVcbiAqL1xuY29uc3QgcnNhYU1ldGFNaWRkbGV3YXJlID0gKCkgPT4gbmV4dCA9PiBhY3Rpb24gPT4ge1xuICBpZiAoaXNSU0FBKGFjdGlvbikgJiYgaXNPYmplY3RPck51bGwoYWN0aW9uW1JTQUFfTUVUQV0pKSB7XG4gICAgcmV0dXJuIG5leHQocnNhYU1ldGEoYWN0aW9uKSlcbiAgfVxuICByZXR1cm4gbmV4dChhY3Rpb24pXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJzYWFNZXRhTWlkZGxld2FyZVxuXG5jb25zdCByc2FhTWV0YSA9IChyc2FhKSA9PiB7XG4gIGNvbnN0IG5leHRSU0FBID0geyAuLi5yc2FhIH1cbiAgY29uc3QgcnNhYVR5cGVzID0gcnNhYVtSU0FBXS50eXBlcyB8fCBbXVxuICBjb25zdCByc2FhTWV0YSA9IHJzYWFbUlNBQV9NRVRBXSB8fCB7fVxuXG4gIGNvbnN0IG5ld1R5cGVzID0gUlNBQV9UWVBFUy5tYXAoKGRlZmF1bHRUeXBlLCBpKSA9PiB7XG4gICAgY29uc3QgdHlwZURlc2NyaXB0b3IgPSByc2FhVHlwZXNbaV0gfHwgZGVmYXVsdFR5cGVcbiAgICByZXR1cm4gcHJvY2Vzc1R5cGVEZXNjcmlwdG9yKHR5cGVEZXNjcmlwdG9yLCByc2FhTWV0YSwgbmV4dFJTQUEpXG4gIH0pXG5cbiAgcmV0dXJuIHtcbiAgICAuLi5uZXh0UlNBQSxcbiAgICBbUlNBQV06IHtcbiAgICAgIC4uLm5leHRSU0FBW1JTQUFdLFxuICAgICAgdHlwZXM6IG5ld1R5cGVzXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IHByb2Nlc3NUeXBlRGVzY3JpcHRvciA9ICh0eXBlRGVzY3JpcHRvciwgcnNhYU1ldGEsIHJzYWEpID0+IHtcbiAgY29uc3QgcnNhYVByb3BzID0geyAuLi5yc2FhW1JTQUFdIH1cblxuICBpZiAoaXNPYmplY3QodHlwZURlc2NyaXB0b3IpKSB7XG4gICAgY29uc3QgeyBtZXRhIH0gPSB0eXBlRGVzY3JpcHRvclxuICAgIGlmIChpc09iamVjdE9yTnVsbChtZXRhKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4udHlwZURlc2NyaXB0b3IsXG4gICAgICAgIG1ldGE6IHsgLi4ubWV0YSwgLi4ucnNhYU1ldGEsIHJzYWFQcm9wcyB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0Z1bmN0aW9uKG1ldGEpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi50eXBlRGVzY3JpcHRvcixcbiAgICAgICAgbWV0YTogKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICBjb25zdCBtZXRhVmFsdWUgPSBtZXRhKC4uLmFyZ3MpXG4gICAgICAgICAgcmV0dXJuIGlzT2JqZWN0T3JOdWxsKG1ldGFWYWx1ZSlcbiAgICAgICAgICAgID8geyAuLi5tZXRhVmFsdWUsIC4uLnJzYWFNZXRhLCByc2FhUHJvcHMgfVxuICAgICAgICAgICAgOiBtZXRhVmFsdWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHlwZURlc2NyaXB0b3JcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHlwZTogdHlwZURlc2NyaXB0b3IsXG4gICAgbWV0YTogeyAuLi5yc2FhTWV0YSwgcnNhYVByb3BzIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgUlNBQSB9IGZyb20gJ3JlZHV4LWFwaS1taWRkbGV3YXJlJ1xuaW1wb3J0IHsgUlNBQV9NRVRBIH0gZnJvbSAnLi9yc2FhTWV0YSdcbmltcG9ydCB7IGFwcGx5UXVlcnlQYXJhbXMgfSBmcm9tICcuLi91dGlscydcblxuLyoqXG4gKiBCYXNpYyBoZWxwZXIgbWV0aG9kIHRvIGNyZWF0ZSBhIFwiUmVkdXggU3RhbmRhcmQgQXBpIEFjdGlvblwiIChSU0FBKVxuICogQWNjZXB0cyBhIHNpbmdsZSBvYmplY3QgYXJndW1lbnQgdGhhdCBtdXN0IGNvbmZvcm0gdG8gUlNBQSBzcGVjLFxuICogc2VlIGRvY3VtZW50YXRpb246IGh0dHBzOi8vZ2l0aHViLmNvbS9hZ3JhYm9zby9yZWR1eC1hcGktbWlkZGxld2FyZVxuICpcbiAqIGBgYFxuICogdHlwZSBSU0FBY3Rpb24gPSB7IFtSU0FBXToge30sIFtSU0FBX01FVEFdPzoge30gfVxuICogdHlwZSBhcGlBY3Rpb24gPSAoe30pID0+IFJTQUFjdGlvblxuICogYGBgXG4gKlxuICogQGFsaWFzIG1vZHVsZTphcGlcbiAqIEBwYXJhbSB7e319IHJzYWFQcm9wcyBSU0FBIGRlY2xhcmF0aW9uIG9iamVjdFxuICogQHJldHVybiB7e319IHtSU0FBY3Rpb259IHRoZSBSU0FBIG9iamVjdFxuICovXG5jb25zdCBhcGlBY3Rpb24gPSAocnNhYVByb3BzID0ge30pID0+ICh7XG4gIFtSU0FBXTogcnNhYVByb3BzXG59KVxuXG5leHBvcnQgZGVmYXVsdCBhcGlBY3Rpb25cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIHRvIGNyZWF0ZSBhIFwiUmVkdXggU3RhbmRhcmQgQXBpIEFjdGlvblwiIChSU0FBKSB1c2luZ1xuICogYHJzYWFNZXRhYCBleHRlbnNpb25zLiAgSWRlbnRpY2FsIHRvIHRoZSBiYXNpYyBgYXBpQWN0aW9uYCBoZWxwZXIsXG4gKiBidXQgYWNjZXB0cyBhbiBhZGRpdGlvbmFsIG9iamVjdCBhcmd1bWVudCBmb3Igc3BlY2lmeWluZyBtZXRhZGF0YVxuICogdG8gcmVsYXRlIHRoZSBSU0FBIHdpdGggY29vcmVzcG9uZGluZyBGU0FzIHdoZW4gZmV0Y2hlZC5cbiAqXG4gKiBgYGBcbiAqIHR5cGUgYXBpQWN0aW9uV2l0aE1ldGEgPSAoe30sIHt9PykgPT4gUlNBQWN0aW9uXG4gKiBgYGBcbiAqXG4gKiBAYWxpYXMgbW9kdWxlOmFwaVxuICogQHBhcmFtIHt7fX0gcnNhYVByb3BzIFJTQUEgZGVjbGFyYXRpb24gb2JqZWN0XG4gKiBAcGFyYW0ge3t9fSByc2FhTWV0YSBtZXRhZGF0YSB0byBhc3NpZ24gdG8gdGhlIFJTQUFcbiAqIEByZXR1cm4ge3t9fSB7UlNBQWN0aW9ufSB0aGUgUlNBQSBvYmplY3RcbiAqL1xuZXhwb3J0IGNvbnN0IGFwaUFjdGlvbldpdGhNZXRhID0gKHJzYWFQcm9wcyA9IHt9LCByc2FhTWV0YSkgPT4ge1xuICBjb25zdCByc2FhID0gYXBpQWN0aW9uKHJzYWFQcm9wcylcbiAgaWYgKHJzYWFNZXRhKSB7XG4gICAgLy8gVE9ETzogaW52ZXN0aWdhdGUgaXNzdWVzIGJ1bmRsaW5nIHJlZHV4LWZvdW5kcnkgaW4gd2F5cyB0aGF0IHdvcmtzIG5pY2VseVxuICAgIC8vIHdpdGggX2FueV8gdHlwZSBvZiBTeW1ib2wgcG9seWZpbGwgc29sdXRpb24sIGxpa2UgUk4gdXNlcyBieSBkZWZhdWx0LlxuICAgIC8vIFRoZSBmb2xsb3dpbmcgbXV0YXRpb24gc2VlbXMgdG8gd29yayB3aXRoIHdoYXQgd2UndmUgdHJpZWQsIGJ1dCBuZWVkcyBpbnZlc3RpZ2F0aW9uLlxuICAgIC8vIFVzaW5nIE9iamVzdC5hc3NpZ24gZGlkbid0IHdvcmsgYXMgZXhwZWN0ZWQgaGVyZSBvbiBSTi5cbiAgICAvLyBCZXN0IGdpdGh1YiBpc3N1ZSB3ZSd2ZSBmb3VuZCByZWFsdGVkIHRvIHRoaXM6XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzExOFxuICAgIHJzYWFbUlNBQV9NRVRBXSA9IHJzYWFNZXRhXG4gIH1cbiAgcmV0dXJuIHJzYWFcbn1cblxuLyoqXG4gKiBGYWN0b3J5IG1ldGhvZCB0byBjcmVhdGUgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgYW4gUlNBQSBvYmplY3QsIGFuZCBvcHRpb25hbGx5XG4gKiBhcHBsaWVzIFJTQUFfTUVUQSBzdXBwbGllZCBxdWVyeSBvYmplY3QgZGF0YSB0byBSU0FBIGVuZHBvaW50IGFzIHN0cmluZ2lmaWVkXG4gKiBxdWVyeSBwYXJhbXMuIFVzZWZ1bCB3aGVuIHlvdSBuZWVkIHRvIHN1cHBvcnQgZHluYW1pYyBxdWVyeVBhcmFtcywgYnV0IHdhbnQgdG9cbiAqIHVzZSBhIHByZS1jb25maWd1cmVkIHVybCBzdHJpbmcgd2l0aCB5b3VyIFJTQUEgcGFyYW1zLiAgTW9zdCB1c2VmdWwgd2hlbiB1c2VkXG4gKiBhbG9uZ3NpZGUgYHJzYWFNZXRhTWlkZGxld2FyZWAsIHNvIHRoYXQgYW55IHNwZWNpZmllZCBgcXVlcnlgIHBhcmFtcyBhcmVcbiAqIGF2YWlsYWJsZSBhcyBgbWV0YWAgcHJvcGVydGllcyBvZiByZXN1bHRpbmcgcmVxdWVzdCwgc3VjY2VzcywgJiBmYWlsdXJlIEZTQXMuXG4gKlxuICogYGBgXG4gKiB0eXBlIFN0cmluZ2lmeSA9ICh7fSkgPT4gc3RyaW5nXG4gKiB0eXBlIGNvbmZpZ3VyZU1ldGFRdWVyeSA9IChTdHJpbmdpZnksIHN0cmluZykgPT4gKFJTQUFBY3Rpb24pID0+IFJTQUFBY3Rpb25cbiAqIGBgYFxuICpcbiAqIEBhbGlhcyBtb2R1bGU6YXBpXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdHJpbmdpZnkgZnVuY3Rpb24gdXNlZCB0byBjb252ZXJ0IG9iamVjdCB0byBxdWVyeSBzdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbcXVlcnlLZXk9cXVlcnldIFJTQUFfTUVUQSBwcm9wZXJ0eSBrZXkgZm9yIHF1ZXJ5IHBhcmFtc1xuICogQHJldHVybiB7ZnVuY3Rpb259IGZ1bmN0aW9uIHRvIHByb2Nlc3MgcXVlcnkgcGFyYW1zIGZvciBSU0FBXG4gKi9cbmV4cG9ydCBjb25zdCBjb25maWd1cmVNZXRhUXVlcnkgPSAoc3RyaW5naWZ5LCBxdWVyeUtleSA9ICdxdWVyeScpID0+IChyc2FhKSA9PiB7XG4gIGNvbnN0IHJzYWFQcm9wcyA9IHJzYWFbUlNBQV1cbiAgY29uc3QgcnNhYU1ldGEgPSByc2FhW1JTQUFfTUVUQV1cbiAgY29uc3QgeyBlbmRwb2ludCA9ICcnIH0gPSByc2FhUHJvcHNcbiAgY29uc3QgeyBbcXVlcnlLZXldOiBwYXJhbXMgfSA9IHJzYWFNZXRhIHx8IHt9XG4gIGlmICghcGFyYW1zKSByZXR1cm4gcnNhYVxuXG4gIGNvbnN0IG5ld0VuZHBvaW50ID0gYXBwbHlRdWVyeVBhcmFtcyhlbmRwb2ludCwgc3RyaW5naWZ5KHBhcmFtcykpXG4gIHJldHVybiB7XG4gICAgLi4ucnNhYSxcbiAgICBbUlNBQV06IHtcbiAgICAgIC4uLnJzYWFQcm9wcyxcbiAgICAgIGVuZHBvaW50OiBuZXdFbmRwb2ludFxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEZhY3RvcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIGZ1bmN0aW9uIHRoYXQgY2FuIHByb2R1Y2UgUlNBQSBvYmplY3RzLiBVc2VzXG4gKiBhcGlBY3Rpb24sIGFwaUFjdGlvbldpdGhNZXRhLCBhbmQgY29uZmlndXJlTWV0YVF1ZXJ5IHV0aWxzIGludGVybmFsbHkuXG4gKlxuICogYGBgXG4gKiB0eXBlIE9wdGlvbnMgPSB7XG4gKiAgIGRlZmF1bHRSc2FhPzoge30sXG4gKiAgIGVuYWJsZU1ldGE/OiBib29sLFxuICogICBtZXRhUXVlcnk/OiAoe30pID0+IHN0cmluZ1xuICogfVxuICogdHlwZSBjb25maWd1cmVBcGlBY3Rpb24gPSAoT3B0aW9ucykgPT4gKHt9LCB7fT8pID0+IFJTQUFjdGlvblxuICogYGBgXG4gKlxuICogQGFsaWFzIG1vZHVsZTphcGlcbiAqIEBwYXJhbSB7e319IFtvcHRpb25zXVxuICogQHBhcmFtIHt7fX0gW29wdGlvbnMuZGVmYXVsdFJzYWE9e31dIGRlZmF1bHQgUlNBQSBwYXJhbXNcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5lbmFibGVNZXRhPWZhbHNlXSBlbmFibGUgdXNlIG9mIFJTQUFfTUVUQSBwcm9wZXJ0eVxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm1ldGFRdWVyeT1udWxsXSBxdWVyeSBwYXJhbSBzdHJpbmdpZnkgbWV0aG9kLiBpZiBudWxsfHVuZGVmaW5lZCwgaWdub3JlIHBhcmFtIHByb2Nlc3NpbmdcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSBmdW5jdGlvbiB0byBwcm9jZXNzIHF1ZXJ5IHBhcmFtcyBmb3IgUlNBQVxuICovXG5leHBvcnQgY29uc3QgY29uZmlndXJlQXBpQWN0aW9uID0gKG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCB7XG4gICAgZGVmYXVsdFJzYWEgPSB7fSxcbiAgICBlbmFibGVNZXRhID0gZmFsc2UsXG4gICAgbWV0YVF1ZXJ5ID0gbnVsbFxuICB9ID0gb3B0aW9uc1xuXG4gIGlmICghZW5hYmxlTWV0YSkge1xuICAgIHJldHVybiAocnNhYVByb3BzID0ge30pID0+IGFwaUFjdGlvbih7IC4uLmRlZmF1bHRSc2FhLCAuLi5yc2FhUHJvcHMgfSlcbiAgfVxuXG4gIGNvbnN0IGFjdGlvbkNyZWF0b3IgPSAocnNhYVByb3BzID0ge30sIHJzYWFNZXRhKSA9PiBhcGlBY3Rpb25XaXRoTWV0YShcbiAgICB7IC4uLmRlZmF1bHRSc2FhLCAuLi5yc2FhUHJvcHMgfSxcbiAgICByc2FhTWV0YVxuICApXG5cbiAgaWYgKG1ldGFRdWVyeSkge1xuICAgIGNvbnN0IHdpdGhNZXRhUXVlcnkgPSBjb25maWd1cmVNZXRhUXVlcnkobWV0YVF1ZXJ5KVxuICAgIHJldHVybiAoLi4uYXJncykgPT4gd2l0aE1ldGFRdWVyeShhY3Rpb25DcmVhdG9yKC4uLmFyZ3MpKVxuICB9XG5cbiAgcmV0dXJuIGFjdGlvbkNyZWF0b3Jcbn1cbiIsImltcG9ydCB7IGlzU3RyaW5nT3JOdWxsLCBub3JtYWxpemVBcnJheSB9IGZyb20gJy4uL3V0aWxzJ1xuXG5jb25zdCB7IGlzQXJyYXkgfSA9IEFycmF5XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiAzIGFjdGlvbiB0eXBlcyBnaXZlbiBhIGJhc2UgXCJ0eXBlXCIgYW5kIG9wdGlvbnMuXG4gKiBJbnRlbmRlZCB0byBiZSB1c2VkIGFsb25nc2lkZSB0aGUgUlNBQSBzcGVjaWZpY2F0aW9uIGRlZmluZWQgYnkgYHJlZHV4LWFwaS1taWRkbGV3YXJlYDpcbiAqICAgaHR0cHM6Ly9naXRodWIuY29tL2FncmFib3NvL3JlZHV4LWFwaS1taWRkbGV3YXJlXG4gKlxuICogYGBgXG4gKiB0eXBlIEFQSV9BQ1RJT05fVFlQRVMgPSBbIHJlcXVlc3Q6IHN0cmluZywgc3VjY2Vzczogc3RyaW5nLCBmYWlsdXJlOiBzdHJpbmcgXTtcbiAqIHR5cGUgQXBpQWN0aW9uVHlwZXMgPSB7IHJlcXVlc3Q6IHN0cmluZywgc3VjY2Vzczogc3RyaW5nLCBmYWlsdXJlOiBzdHJpbmcgfTtcbiAqIGBgYFxuICpcbiAqIEV4YW1wbGU6XG4gKiBgYGBcbiAqIGFwaUFjdGlvblR5cGVzKCdGb28nLCB7IHN1ZmZpeDogWydSJywgJ1MnLCAnRiddLCBkZWxpbTogJy4nIH0pO1xuICogLy8gLT4gWydGb28uUicsICdGb28uUycsICdGb28uRiddXG4gKiBgYGBcbiAqXG4gKiBAYWxpYXMgbW9kdWxlOmFwaVxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGUgYmFzZSBcInR5cGVcIiBhbGwgMyByZXN1bHQgYWN0aW9ucyB3aWxsIHNoYXJlXG4gKiBAcGFyYW0ge3t9fSBbb3B0aW9uc10gYWRkaXRpb25hbCBvcHRpb25zXG4gKiBAcGFyYW0ge3N0cmluZ3xzdHJpbmdbXX0gW29wdGlvbnMucHJlZml4XSBjdXN0b20gcHJlZml4IGZvciBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd8c3RyaW5nW119IFtvcHRpb25zLnN1ZmZpeF0gY3VzdG9tIHN1ZmZpeCBmb3IgYWN0aW9uIHR5cGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5kZWxpbV0gY3VzdG9tIGRlbGltaXRlciBmb3Igc3RyaW5nIHNlZ21lbnRzXG4gKiBAcmV0dXJuIHtBUElfQUNUSU9OX1RZUEVTfSBhcnJheSB3aXRoIDMgdHlwZXM7IFtyZXF1ZXN0LCBzdWNjZXNzLCBmYWlsdXJlXVxuICovXG5jb25zdCBhcGlBY3Rpb25UeXBlcyA9ICh0eXBlLCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3Qge1xuICAgIHByZWZpeCA9IG51bGwsXG4gICAgc3VmZml4ID0gWydSZXF1ZXN0JywgJ1N1Y2Nlc3MnLCAnRmFpbHVyZSddLFxuICAgIGRlbGltID0gJy8nXG4gIH0gPSBvcHRpb25zXG5cbiAgY29uc3QgVFlQRSA9IGAke3ByZWZpeCA/IGRlbGltIDogJyd9JHt0eXBlfSR7c3VmZml4ID8gZGVsaW0gOiAnJ31gXG4gIGNvbnN0IHByZWZpeGVzID0gaXNTdHJpbmdPck51bGwocHJlZml4KSA/IGZpbGxXaXRoKHByZWZpeCkgOiBwcmVmaXhcbiAgY29uc3Qgc3VmZml4ZXMgPSBpc1N0cmluZ09yTnVsbChzdWZmaXgpID8gZmlsbFdpdGgoc3VmZml4KSA6IHN1ZmZpeFxuXG4gIHJldHVybiBbXG4gICAgYCR7cHJlZml4ZXNbMF19JHtUWVBFfSR7c3VmZml4ZXNbMF19YCxcbiAgICBgJHtwcmVmaXhlc1sxXX0ke1RZUEV9JHtzdWZmaXhlc1sxXX1gLFxuICAgIGAke3ByZWZpeGVzWzJdfSR7VFlQRX0ke3N1ZmZpeGVzWzJdfWBcbiAgXVxufVxuXG5leHBvcnQgZGVmYXVsdCBhcGlBY3Rpb25UeXBlc1xuXG4vKipcbiAqIENvbnZlcnQgQXJyYXkgQVBJIEFjdGlvbiBUeXBlcyB0byBPYmplY3QgZm9ybVxuICogQGFsaWFzIG1vZHVsZTphcGlcbiAqIEBwYXJhbSB7c3RyaW5nW119IGFycmF5IG9mIDMgYXBpIGFjdGlvbiB0eXBlczogWyByZXF1ZXN0LCBzdWNjZXNzLCBmYWlsdXJlIF1cbiAqIEByZXR1cm4ge3t9fSBvYmplY3Qgb2YgMyBhcGkgYWN0aW9uIHR5cGVzOiB7IHJlcXVlc3QsIHN1Y2Nlc3MsIGZhaWx1cmUgfVxuICovXG5leHBvcnQgY29uc3QgYXNBcGlUeXBlc09iamVjdCA9IChhcGlUeXBlcyA9IFtdKSA9PiB7XG4gIGNvbnN0IFsgcmVxdWVzdCwgc3VjY2VzcywgZmFpbHVyZSBdID0gYXBpVHlwZXNcbiAgcmV0dXJuIHsgcmVxdWVzdCwgc3VjY2VzcywgZmFpbHVyZSB9XG59XG5cbi8qKlxuICogQ29udmVydCBPYmplY3QgQVBJIEFjdGlvbiBUeXBlcyB0byBBcnJheSBmb3JtXG4gKiBAYWxpYXMgbW9kdWxlOmFwaVxuICogQHBhcmFtIHt7fX0gb2JqZWN0IG9mIDMgYXBpIGFjdGlvbiB0eXBlczogeyByZXF1ZXN0LCBzdWNjZXNzLCBmYWlsdXJlIH1cbiAqIEByZXR1cm4ge3N0cmluZ1tdfSBhcnJheSBvZiAzIGFwaSBhY3Rpb24gdHlwZXM6IFsgcmVxdWVzdCwgc3VjY2VzcywgZmFpbHVyZSBdXG4gKi9cbmV4cG9ydCBjb25zdCBhc0FwaVR5cGVzQXJyYXkgPSAoYXBpVHlwZXMgPSB7fSkgPT4ge1xuICBjb25zdCB7IHJlcXVlc3QsIHN1Y2Nlc3MsIGZhaWx1cmUgfSA9IGFwaVR5cGVzXG4gIHJldHVybiBbIHJlcXVlc3QsIHN1Y2Nlc3MsIGZhaWx1cmUgXVxufVxuXG4vKipcbiAqIEFjY2VwdCBlaXRoZXIgQVBJIEFjdGlvbiBUeXBlcyBpbiBBcnJheSBvciBPYmplY3QgZm9ybSwgYW5kIHJldHVybiBBcnJheSBmb3JtXG4gKiBAYWxpYXMgbW9kdWxlOmFwaVxuICogQHBhcmFtIHt7fXxzdHJpbmdbXX0gb2JqZWN0IG9yIGFycmF5IG9mIDMgYXBpIGFjdGlvbiB0eXBlc1xuICogQHJldHVybiB7c3RyaW5nW119IGFycmF5IG9mIDMgYXBpIGFjdGlvbiB0eXBlczogWyByZXF1ZXN0LCBzdWNjZXNzLCBmYWlsdXJlIF1cbiAqL1xuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUFwaVR5cGVzID0gKHR5cGVzKSA9PiB7XG4gIGlmIChpc0FycmF5KHR5cGVzKSkgcmV0dXJuIHR5cGVzXG4gIHJldHVybiBhc0FwaVR5cGVzQXJyYXkodHlwZXMpXG59XG5cbi8qKlxuICogTGlrZSBgbm9ybWFsaXplQXBpVHlwZXNgLCBidXQgc3VwcG9ydHMgYXBpIGFjdGlvbiB0eXBlcyBzcGVjaWZpZWQgYXMgYXJyYXlzLFxuICogYW5kIGVuc3VyZXMgbm9ybWFsaXplZCByZXN1bHQgYWxzbyBkZWZpbmVzIGFwaSBhY3Rpb24gdHlwZXMgYXMgYW4gYXJyYXkgb2ZcbiAqIGFycmF5cyBvZiBhY3Rpb24gdHlwZSBzdHJpbmdzLlxuICogQGFsaWFzIG1vZHVsZTphcGlcbiAqIEBwYXJhbSB7e318c3RyaW5nW119IG9iamVjdCBvciBhcnJheSBvZiAzIGFwaSBhY3Rpb24gdHlwZXNcbiAqIEByZXR1cm4ge3N0cmluZ1tdW119IGFycmF5IG9mIDMgYXBpIGFjdGlvbiB0eXBlczogWyByZXF1ZXN0OiBzdHJpbmdbXSwgc3VjY2Vzczogc3RyaW5nW10sIGZhaWx1cmU6IHN0cmluZ1tdIF1cbiAqL1xuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUFwaVR5cGVBcnJheXMgPSAodHlwZXMpID0+IHtcbiAgY29uc3QgWyByZXF1ZXN0LCBzdWNjZXNzLCBmYWlsdXJlIF0gPSBub3JtYWxpemVBcGlUeXBlcyh0eXBlcylcbiAgcmV0dXJuIFtcbiAgICBub3JtYWxpemVBcnJheShyZXF1ZXN0KSxcbiAgICBub3JtYWxpemVBcnJheShzdWNjZXNzKSxcbiAgICBub3JtYWxpemVBcnJheShmYWlsdXJlKVxuICBdXG59XG5cbi8qKlxuICogQ29uZmlndXJhYmxlIHZlcnNpb24gb2YgYXBpQWN0aW9uVHlwZXMuXG4gKiBBY2NlcHRzIGBvcHRpb25zYCBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoIGNhbGxzIGFwaUFjdGlvblR5cGVzIHdpdGggc2FtZSBgb3B0aW9uc2AuXG4gKiBAYWxpYXMgbW9kdWxlOmFwaVxuICogQHBhcmFtIHt7fX0gb3B0aW9ucyBhcGlBY3Rpb25UeXBlcyBvcHRpb25zXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gcHJlY29uZmlndXJlZCBhcGlBY3Rpb25UeXBlcyBmdW5jdGlvbiB0aGF0IG9ubHkgYWNjZXB0cyAxIGB0eXBlYCBhcmd1bWVudFxuICovXG5leHBvcnQgY29uc3QgY29uZmlndXJlQXBpQWN0aW9uVHlwZXMgPSAob3B0aW9ucykgPT4gKHR5cGUpID0+IGFwaUFjdGlvblR5cGVzKHR5cGUsIG9wdGlvbnMpXG5cbmZ1bmN0aW9uIGZpbGxXaXRoIChzdHIpIHtcbiAgcmV0dXJuIEFycmF5KDMpLmZpbGwoc3RyIHx8ICcnKVxufVxuIiwiLy8gb25seSBzdXBwb3J0IE9ic2VydmFibGUgaW1wbGVtZW50YXRpb25zIGNvbXBsaWFudCB3aXRoIHRoZSBsYXRlc3QgdGMzOSBwcm9wb3NhbDpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLW9ic2VydmFibGVcbmltcG9ydCB7IGFwaU1pZGRsZXdhcmUgYXMgcmVkdXhBcGlNaWRkbGV3YXJlIH0gZnJvbSAncmVkdXgtYXBpLW1pZGRsZXdhcmUnXG5pbXBvcnQgeyBvbmNlIH0gZnJvbSAnLi4vdXRpbHMnXG5cbi8qKlxuICogQ29uZmlndXJlIG1ldGhvZHMgZm9yIGRpcmVjdGx5IGZldGNoaW5nIHZpYSBSU0FBLCB3aXRob3V0IHJlbHlpbmcgb24gYSByZWR1eCBzdG9yZSdzXG4gKiBjb25maWd1cmVkIGFwaU1pZGRsZXdhcmUuXG4gKlxuICogR2VuZXJhbGx5IHVzZWQgZm9yIGFkdmFuY2VkIHVzZS1jYXNlcywgd2hlcmUgeW91J2QgbGlrZSBtb3JlIGNvbnRyb2wgb3ZlciBhc3luY1xuICogYWN0aW9uIGhhbmRsaW5nIGZvciBvbmUgb3IgbW9yZSBBUEkgcmVxdWVzdHMgd2l0aGluIGEgY29udGV4dCBfb3RoZXJfIHRoYW4gdGhlXG4gKiByZWR1eC1hcGktbWlkZGxld2FyZSBpbnN0YW5jZSBjb25maWd1cmVkIHdpdGggdGhlIHJlZHV4IHN0b3JlIChlLmcuIHJlZHV4LW9ic2VydmFibGUsXG4gKiBvciByZWR1eC1zYWdhKS4gQ2FuIGJlIHVzZWQgb3V0c2lkZSBvZiBhIHJlZHV4IGNvbnRleHQgZW50aXJlbHkgaWYgbmVjZXNzYXJ5LlxuICpcbiAqIGBgYFxuICogdHlwZSBTdG9yZUludGVyZmFjZSA9IHsgZ2V0U3RhdGU6IEZ1bmN0aW9uLCBkaXNwYXRjaD86IEZ1bmN0aW9uIH1cbiAqIHR5cGUgQ2FsbFJzYWFBcGkgPSB7fFxuICogICBmZXRjaFJTQUE6IChyc2FhOiBSU0FBLCBzdG9yZT86IFN0b3JlSW50ZXJmYWNlKSA9PiBbUHJvbWlzZSwgRlNBXSxcbiAqICAgZnJvbVJTQUE6IChyc2FhOiBSU0FBLCBzdG9yZT86IFN0b3JlSW50ZXJmYWNlKSA9PiBPYnNlcnZhYmxlXG4gKiB8fVxuICogYGBgXG4gKlxuICogRXhhbXBsZSBDb25maWd1cmF0aW9uOlxuICogYGBgXG4gKiAvLyB1c2UgYSB0YzM5IGNvbXBsaWFudCBPYnNlcnZhYmxlIGltcGxlbWVudGF0aW9uICh1bnRpbCBuYXRpdmVseSBzdXBwb3J0ZWQpIGxpa2UgUnhKU1xuICogaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnXG4gKlxuICogLy8gU29tZSBhcHAgbWlkZGxld2FyZXMgd2UnZCBsaWtlIHRvIHVzZSBmb3IgUlNBQXMuXG4gKiAvLyBUaGVzZSB3b3VsZCBsaWtlbHkgYmUgb25lcyB0aGF0IHRhcmdldCB0aGUgUlNBQSBhY3Rpb24gdHlwZSAoaS5lLiBpc1JTQUEoKSkuXG4gKiBjb25zdCByc2FhTWlkZGxld2FyZSA9IFtcbiAqICAgYXV0aE1pZGRsZXdhcmUsXG4gKiAgIHJzYWFNZXRhTWlkZGxld2FyZSxcbiAqIF1cbiAqXG4gKiAvLyBNaWRkbGV3YXJlIHRoYXQgd2lsbCB0YXJnZXQgdGhlIEZTQXMgcHJvZHVjZWQgYnkgcmVkdXgtYXBpLW1pZGRsZXdhcmVcbiAqIGNvbnN0IGZzYU1pZGRsZXdhcmUgPSBbXG4gKiAgIGFwaVJldHJ5TWlkZGxld2FyZVxuICogXVxuICpcbiAqIC8vIGNvbmZpZ3VyZSB5b3VyIHN0b3JlLi4uIHVzZSB0aGUgc2FtZSBtaWRkbGV3YXJlIGFycmF5cyBhcyBhYm92ZSBpZiB5b3UnZCBsaWtlIDopXG4gKiBjb25zdCBzdG9yZSA9IGNvbmZpZ3VyZVN0b3JlKCAuLi4gKVxuICpcbiAqIC8vIFRoZW4gY3JlYXRlIHlvdXIgY2FsbFJTQUEgbWV0aG9kcyB1c2luZyB5b3VyIGRlc2lyZWQgbWlkZGxld2FyZVxuICogZXhwb3J0IGNvbnN0IHsgZnJvbVJTQUEsIGZldGNoUlNBQSB9ID0gY29uZmlndXJlQ2FsbFJTQUEoe1xuICogICBPYnNlcnZhYmxlLFxuICogICByc2FhTWlkZGxld2FyZSxcbiAqICAgZnNhTWlkZGxld2FyZSxcbiAqICAgc3RvcmVcbiAqIH0pXG4gKiBgYGBcbiAqXG4gKiBFeGFtcGxlIFVzZTpcbiAqIGBgYFxuICogLy8gUmV0dXJucyBhbiBhcnJheSB3aG9zZSBmaXJzdCB2YWx1ZSBpcyBhIFByb21pc2UgZm9yIHRoZSBgZmV0Y2hgIHJlcXVlc3QsIGFuZFxuICogLy8gd2hvc2Ugc2Vjb25kIHZhbHVlIGlzIHRoZSBcInJlcXVlc3RcIiBGU0EuICBQcm9taXNlIHdpbGwgcmVzb2x2ZSB0aGUgYXN5bmMgcmVzdWx0XG4gKiAvLyBGU0EuICBJZiB5b3UnZCBsaWtlIHRvIGRpc3BhdGNoIHRoZSBcInJlcXVlc3RcIiBhY3Rpb24gYmVmb3JlIGhhbmRsaW5nIHRoZVxuICogLy8gcmVzb2x2ZWQgdmFsdWUsIHlvdSBtdXN0IGRvIHNvIG1hbnVhbGx5LlxuICogY29uc3QgcnNhYSA9IHJzYWFDcmVhdG9yKHsgZm9vOiAnYmFyJyB9KVxuICogY29uc3QgWyBwcm9taXNlLCByZXF1ZXN0IF0gPSBmZXRjaFJTQUEocnNhYSlcbiAqIGNvbnNvbGUubG9nKHJlcXVlc3QpXG4gKiBwcm9taXNlLnRoZW4oKHJlc3VsdCkgPT4ge1xuICogICBjb25zb2xlLmxvZyhyZXN1bHQpXG4gKiB9KVxuICpcbiAqIC8vIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB3aGljaCB3aWxsIGVtaXQgdGhlIFwicmVxdWVzdFwiIGFuZCBcInN1Y2Nlc3N8ZmFpbHVyZVwiIEZTQXMgdG9cbiAqIC8vIGFueSBzdWJzY3JpcHRpb25zLiAgVXNlZnVsIGZvciB1dGlsaXppbmcgcnhqcyBvcGVyYXRvcnMgdGhhdCBsZXZlcmFnZSBoaWdoZXIgb3JkZXJcbiAqIC8vIG9wZXJhdG9ycyBsaWtlIHN3aXRjaE1hcCwgb3IgdXRpbHMgbGlrZSBmb3JrSm9pbi5cbiAqIGNvbnN0IHRlc3RGcm9tUlNBQSA9IGFjdGlvbiQgPT4gYWN0aW9uJC5waXBlKFxuICogICBvZlR5cGUoJ1RFU1RfRkVUQ0hfUlNBQScpLFxuICogICBzd2l0Y2hNYXAoKCkgPT4ge1xuICogICAgIGNvbnN0IHJzYWExID0gcnNhYUNyZWF0b3IoeyBmb286ICdiYXInIH0pXG4gKiAgICAgY29uc3QgcnNhYTIgPSByc2FhQ3JlYXRvcih7IHdvb3Q6ICdib295YWgnIH0pXG4gKiAgICAgcmV0dXJuIGZvcmtKb2luKFxuICogICAgICAgZnJvbVJTQUEocnNhYTEpLFxuICogICAgICAgZnJvbVJTQUEocnNhYTIpXG4gKiAgICAgKVxuICogICB9KVxuICogKVxuICogYGBgXG4gKiBAYWxpYXMgbW9kdWxlOmFwaVxuICogQHBhcmFtIHtPYnNlcnZhYmxlfSBPYnNlcnZhYmxlIHRjMzkgY29tcGxpYW50IE9ic2VydmFibGUgY2xhc3MgdG8gdXNlIGZvciBgZnJvbVJTQUFgXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbYXBpTWlkZGxld2FyZV0gb3ZlcnJpZGUgdGhlIHJlZHV4LWFwaS1taWRkbGV3YXJlIHdpdGggZGlmZmVyZW50IGltcGxlbWVudGF0aW9uICh1c2VmdWwgZm9yIG1vY2tzL3Rlc3RzLCBnZW5lcmFsbHkgbm90IGluIHByb2R1Y3Rpb24hKVxuICogQHBhcmFtIHtmdW5jdGlvbltdfSBbZnNhTWlkZGxld2FyZV0gbGlzdCBvZiBcInJlZHV4XCIgbWlkZGxld2FyZSBmdW5jdGlvbnMgdG8gdXNlIGZvciB0aGUgUlNBQSdzIHJlc3VsdGluZyBGU0FzXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZnNhVHJhbnNmb3JtXSBjdXN0b20gXCJ0cmFuc2Zvcm1cIiB0byBhcHBseSB0byByZXN1bHRpbmcgRlNBcyBmcm9tIGNhbGxlZCBSU0FBXG4gKiBAcGFyYW0ge2Z1bmN0aW9uW119IFtyc2FhTWlkZGxld2FyZV0gbGlzdCBvZiBcInJlZHV4XCIgbWlkZGxld2FyZSBmdW5jdGlvbnMgcHJvY2VzcyBpbmNvbWluZyBSU0FBXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbcnNhYVRyYW5zZm9ybV0gY3VzdG9tIFwidHJhbnNmb3JtXCIgdG8gYXBwbHkgdG8gaW5jb21pbmcgUlNBQVxuICogQHBhcmFtIHt7fX0gW3N0b3JlXSBhIHJlZHV4IHN0b3JlLiBsZWF2ZSBgZGlzcGF0Y2hgIG1ldGhvZCB1bmRlZmluZWQgaWYgeW91IHdpc2ggdG8gYXZvaWQgZGlzcGF0Y2hpbmcgYWN0aW9uIHNpZGUtZWZmZWN0cyB0byBzdG9yZSBmcm9tIGNvbmZpZ3VyZWQgbWlkZGxld2FyZS5cbiAqIEByZXR1cm4ge0NBTExfUlNBQV9BUEl9IHRoZSAyIFwiQ2FsbCBSU0FBXCIgQVBJIG1ldGhvZHNcbiAqL1xuY29uc3QgY29uZmlndXJlQ2FsbFJTQUEgPSAob3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHtcbiAgICBPYnNlcnZhYmxlID0gZGVmYXVsdE9ic2VydmFibGUoKSxcbiAgICBhcGlNaWRkbGV3YXJlID0gcmVkdXhBcGlNaWRkbGV3YXJlLFxuICAgIGZzYU1pZGRsZXdhcmUgPSBbXSxcbiAgICBmc2FUcmFuc2Zvcm0gPSBuID0+IG4sXG4gICAgcnNhYU1pZGRsZXdhcmUgPSBbXSxcbiAgICByc2FhVHJhbnNmb3JtID0gbiA9PiBuLFxuICAgIHN0b3JlID0ge31cbiAgfSA9IG9wdGlvbnNcbiAgY29uc3QgcnNhYUludGVyY2VwdG9yID0gKHJzYWEsIHMgPSBzdG9yZSkgPT4ge1xuICAgIGNvbnN0IG5leHRSc2FhID0gcmVkdWNlTWlkZGxld2FyZSgncnNhYScsIHJzYWFNaWRkbGV3YXJlLCByc2FhLCBzKVxuICAgIHJldHVybiByc2FhVHJhbnNmb3JtKG5leHRSc2FhLCBzLmdldFN0YXRlKVxuICB9XG4gIGNvbnN0IGZzYUludGVyY2VwdG9yID0gKGZzYSwgcyA9IHN0b3JlKSA9PiB7XG4gICAgY29uc3QgbmV4dEZzYSA9IHJlZHVjZU1pZGRsZXdhcmUoJ2ZzYScsIGZzYU1pZGRsZXdhcmUsIGZzYSwgcylcbiAgICByZXR1cm4gZnNhVHJhbnNmb3JtKG5leHRGc2EsIHMuZ2V0U3RhdGUpXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBmZXRjaFJTQUE6IGZldGNoUlNBQShhcGlNaWRkbGV3YXJlLCByc2FhSW50ZXJjZXB0b3IsIGZzYUludGVyY2VwdG9yKSxcbiAgICBmcm9tUlNBQTogZnJvbVJTQUEoT2JzZXJ2YWJsZSwgYXBpTWlkZGxld2FyZSwgcnNhYUludGVyY2VwdG9yLCBmc2FJbnRlcmNlcHRvcilcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25maWd1cmVDYWxsUlNBQVxuXG5leHBvcnQgY29uc3QgRXJyb3JPYnNlcnZhYmxlID0gT2JqZWN0LmZyZWV6ZSh7XG4gIGNyZWF0ZTogKG9ic2VydmVyKSA9PiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjb25maWd1cmVDYWxsUlNBQTogYXNzaWduIE9ic2VydmFibGUgY2xhc3MgdG8gdXNlIGZyb21SU0FBLicpXG4gIH1cbn0pXG5cbmNvbnN0IGZldGNoUlNBQSA9IChtaWRkbGV3YXJlRm4sIHJzYWFJbnRlcmNlcHRvciwgZnNhSW50ZXJjZXB0b3IpID0+IChyc2FhLCBzdG9yZSkgPT4ge1xuICBjb25zdCBuZXh0UlNBQSA9IHJzYWFJbnRlcmNlcHRvcihyc2FhLCBzdG9yZSlcbiAgbGV0IHJlcXVlc3RBY3Rpb24gPSBudWxsXG4gIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgbmV4dCA9IChhY3Rpb24pID0+IHtcbiAgICAgIGlmIChyZXF1ZXN0QWN0aW9uKSB7XG4gICAgICAgIHJlc29sdmUoZnNhSW50ZXJjZXB0b3IoYWN0aW9uLCBzdG9yZSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXF1ZXN0QWN0aW9uID0gZnNhSW50ZXJjZXB0b3IoYWN0aW9uLCBzdG9yZSlcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgYXBpRmV0Y2ggPSBtaWRkbGV3YXJlRm4oc3RvcmUpKG5leHQpXG4gICAgYXBpRmV0Y2gobmV4dFJTQUEpLmNhdGNoKHJlamVjdClcbiAgfSlcbiAgcmV0dXJuIFtwcm9taXNlLCByZXF1ZXN0QWN0aW9uXVxufVxuXG5jb25zdCBmcm9tUlNBQSA9IChPYnNlcnZhYmxlQ2xhc3MsIG1pZGRsZXdhcmVGbiwgcnNhYUludGVyY2VwdG9yLCBmc2FJbnRlcmNlcHRvcikgPT4gKHJzYWEsIHN0b3JlKSA9PiAoXG4gIE9ic2VydmFibGVDbGFzcy5jcmVhdGUob2JzZXJ2ZXIgPT4ge1xuICAgIGNvbnN0IG5leHRSU0FBID0gcnNhYUludGVyY2VwdG9yKHJzYWEsIHN0b3JlKVxuICAgIGNvbnN0IG5leHQgPSAoYWN0aW9uKSA9PiBvYnNlcnZlci5uZXh0KGZzYUludGVyY2VwdG9yKGFjdGlvbiwgc3RvcmUpKVxuICAgIGNvbnN0IGFwaUZldGNoID0gbWlkZGxld2FyZUZuKHN0b3JlKShuZXh0KVxuXG4gICAgYXBpRmV0Y2gobmV4dFJTQUEpLnRoZW4oKCkgPT4ge1xuICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKVxuICAgIH0pLmNhdGNoKChlKSA9PiB7XG4gICAgICBvYnNlcnZlci5lcnJvcihlKVxuICAgIH0pXG4gIH0pXG4pXG5cbmZ1bmN0aW9uIHRocm93RGlzcGF0Y2hFcnJvciAoYWN0aW9uLCBtd1R5cGUsIGluZGV4KSB7XG4gIHRocm93IG5ldyBFcnJvcihgY29uZmlndXJlQ2FsbFJTQUE6IGNvbmZpZ3VyZWQgbWlkZGxld2FyZSBjYW5ub3QgZGlzcGF0Y2ggYWN0aW9uIVxcblxuICAgIEVpdGhlciBwcm92aWRlIGEgJ3N0b3JlJyBjb25maWd1cmF0aW9uLCBvciBwYXNzIGFuIG92ZXJyaWRlIHRvIGNhbGxSU0FBIG1ldGhvZCBkaXJlY3RseS5cXG5cbiAgICBkaXNwYXRjaGVkOiAke2FjdGlvbi50b1N0cmluZygpfTtcXG5cbiAgICBtaWRkbGV3YXJlIHR5cGU6ICR7bXdUeXBlfVxcblxuICAgIG1pZGRsZXdhcmUgaW5kZXg6ICR7aW5kZXh9O2ApXG59XG5cbi8vIFRPRE86IHVudGlsIEkgY2FuIGltcGxlbWVudCBzdXBwb3J0IGZvciBhc3luYyBNVyBmdW5jdGlvbnMgY29uZmlndXJlZCB3aXRoIGNhbGxSU0FBXG4vLyBtZXRob2RzLCBJIHRoaW5rIHdlIHNob3VsZCBmaXggdGhpcyB3LyBkb2N1bWVudGF0aW9uLiAgTm90ZSB0aGF0IGFueSB2YWxpZCByZWR1eCBNV1xuLy8gX2Nhbl8gYmUgdXNlZCBmb3IgY2FsbFJTQUEgY29uZmlnLCBidXQgb25seSBzeW5jaHJvbm91cyBNV3MgdGhhdCBpbW1lZGlhdGVseSBzZW5kIGFcbi8vIHNpbmdsZSBhY3Rpb24gdG8gXCJuZXh0XCIgTVcgKHBlcmhhcHMgYWZ0ZXIgYSB0cmFuc2Zvcm1hdGlvbikgYXJlIHN1cHBvcnRlZC4gIEFueXRoaW5nXG4vLyBlbHNlIG1heSByZXN1bHQgaW4gdW5kZXNpcmVkIGJlaGF2aW9yLlxuLy8gSW4gcHJhY3RpY2UsIHdlIGdlbmVyYWxseSBvbmx5IGluY2x1ZGUgdGhlc2UgdHlwZXMgb2Ygc3luY2hyb25vdXMsIHRyYW5zZm9ybWF0aW9uXG4vLyBNV3Mgc2luY2Ugd2UgZG9uJ3QgcmVhbGx5IHdhbnQgc2lkZSBlZmZlY3RzIHRvIG9jY3VyIHdpdGhpbiB0aGlzIGNhbGwuICBXZSBhcmVcbi8vIG1vcmUgbGlrZWx5IGdvaW5nIHRvIGhhbmRsZSBzaWRlLWVmZmVjdHMgYW5kIGFzeW5jIHByb2Nlc3Npbmcgd2l0aCBhbm90aGVyIHRvb2wsXG4vLyBsaWtlIHJlZHV4LW9ic2VydmFibGUsIHdoZW4gdXNpbmcgdGhpcyB1dGlsLlxuLy8gTWF5YmUgdXNlIFR5cGVkIE1XIGZ1bmN0aW9uIHNpZ25hdHVyZXMsIHRoYXQgY2FuIGxpbWl0IHRoZSAjIG9mIGFjY2VwdGFibGUgTVdzP1xuLy8gRm9yIHByYWN0aWNhbCB1c2UtY2FzZXMsIHRoZXNlIGFyZSB1c3VhbGx5IG5vdGhpbmcgbW9yZSB0aGFuIGEgdHJhbnNmb3JtLCBhbmQgdGhlXG4vLyBzaWRlLWVmZmVjdHMgYXJlIGdlbmVyYWxseSBnb2luZyB0byBiZSBoYW5kbGVkIGF0IHRoZSBjYWxsLXNpdGUuICBPdGhlcndpc2UsIHRoZVxuLy8gTVcgaXNuJ3Qgc3VpdGVkIGZvciBjYWxsUlNBQSBtZXRob2RzLCBhbmQgc2hvdWxkIG9ubHkgYmUgdXNlZCBhcyBhIHJlYWwsIHJlZHV4IE1XLlxuLy8gUG9zc2libGUgVHlwZSBGb3IgU2ltcGxlIFRyYW5zZm9ybWF0aW9uIGFuZCAocG90ZW50aWFsKSBhY3Rpb24gc2lkZS1lZmZlY3QgY2FwYWJsZSBNVzpcbi8vIHR5cGUgUlNBQU5leHQgPSBSU0FBID0+IGFueVxuLy8gdHlwZSBGU0FOZXh0ID0gRlNBID0+IGFueVxuLy8gdHlwZSBTdG9yZUludGVyZmFjZSA9IHsgZ2V0U3RhdGU6ICgpID0+IGFueSwgZGlzcGF0Y2g/OiBhbnkgPT4gYW55IH1cbi8vIHR5cGUgUlNBQU1pZGRsZXdhcmUgPSBTdG9yZUludGVyZmFjZSA9PiBSU0FBTmV4dCA9PiBSU0FBID0+IGFueVxuLy8gdHlwZSBGU0FNaWRkbGV3YXJlID0gU3RvcmVJbnRlcmZhY2UgPT4gRlNBTmV4dCA9PiBGU0EgPT4gYW55XG5mdW5jdGlvbiByZWR1Y2VNaWRkbGV3YXJlIChcbiAgdHlwZSxcbiAgbWlkZGxld2FyZSxcbiAgYWN0aW9uLFxuICBzdG9yZVxuKSB7XG4gIGNvbnN0IHsgZGlzcGF0Y2gsIGdldFN0YXRlIH0gPSBzdG9yZVxuICByZXR1cm4gbWlkZGxld2FyZS5yZWR1Y2UoKGFjY0FjdGlvbiwgY3VyTWlkZGxld2FyZSwgaSkgPT4ge1xuICAgIGxldCBuZXh0QWN0aW9uID0gYWNjQWN0aW9uXG4gICAgY29uc3QgbXcgPSBjdXJNaWRkbGV3YXJlKHtcbiAgICAgIGRpc3BhdGNoOiBkaXNwYXRjaCB8fCAoYSA9PiB0aHJvd0Rpc3BhdGNoRXJyb3IoYSwgdHlwZSwgaSkpLFxuICAgICAgZ2V0U3RhdGVcbiAgICB9KVxuICAgIGNvbnN0IG5leHQgPSBvbmNlKGEgPT4geyBuZXh0QWN0aW9uID0gYSB9KVxuICAgIG13KG5leHQpKGFjY0FjdGlvbilcbiAgICByZXR1cm4gbmV4dEFjdGlvblxuICB9LCBhY3Rpb24pXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRPYnNlcnZhYmxlICgpIHtcbiAgcmV0dXJuIEVycm9yT2JzZXJ2YWJsZVxufVxuIiwiaW1wb3J0IHsgbWF0Y2hlc1R5cGUgfSBmcm9tICcuLi9jb3JlJ1xuaW1wb3J0IHsgbm9ybWFsaXplQXBpVHlwZUFycmF5cyB9IGZyb20gJy4vYXBpQWN0aW9uVHlwZXMnXG4vKipcbiAqIEJhc2ljIHRydWUvZmFsc2UgbG9hZGluZyBpbmRpY2F0b3IuICBDYW4gYmUgdXNlZCB3aXRoIGEgc2luZ2xlIGVuZHBvaW50IGJ5IHVzaW5nXG4gKiB0aGUgcmVxdWVzdCwgc3VjY2VzcywgZmFpbHVyZSBhY3Rpb25zIGZvciB0aGUgUlNBQS4gWW91IGNhbiBhbHNvIHNwZWNpZnkgdGhlIGFjdGlvblxuICogdHlwZXMgYXMgYXJyYXlzLCBpbiBjYXNlcyB3aGVyZSBtb3JlIHRoYW4gMSBhY3Rpb24gdHlwZSBzaG91bGQgYmUgaGFuZGxlZCBmb3JcbiAqIHJlcXVlc3QsIHN1Y2Nlc3MsIGFuZC9vciBmYWlsdXJlIGNhc2VzLlxuICogYGBgXG4gKiB0eXBlIFJlcXVlc3RBY3Rpb25UeXBlcyA9IHtcbiAqICAgcmVxdWVzdDogc3RyaW5nIHwgc3RyaW5nW10sXG4gKiAgIHN1Y2Nlc3M6IHN0cmluZyB8IHN0cmluZ1tdLFxuICogICBmYWlsdXJlOiBzdHJpbmcgfCBzdHJpbmdbXVxuICogfVxuICogdHlwZSBSZXF1ZXN0QWN0aW9uVHlwZXNBcnIgPSBbXG4gKiAgIHJlcXVlc3Q6IHN0cmluZyB8IHN0cmluZ1tdLFxuICogICBzdWNjZXNzOiBzdHJpbmcgfCBzdHJpbmdbXSxcbiAqICAgZmFpbHVyZTogc3RyaW5nIHwgc3RyaW5nW11cbiAqIF1cbiAqIHR5cGUgQXBpQWN0aW9uVHlwZXMgPSBSZXF1ZXN0QWN0aW9uVHlwZXMgfCBSZXF1ZXN0QWN0aW9uVHlwZXNBcnJcbiAqIChkZWZhdWx0U3RhdGU6IGJvb2wsIGFjdGlvblR5cGVzOiBBcGlBY3Rpb25UeXBlcykgPT5cbiAqICAgKHN0YXRlOiBib29sLCBhY3Rpb246IEZTQSkgPT4gYm9vbFxuICogYGBgXG4gKiBAYWxpYXMgbW9kdWxlOmFwaVxuICogQHBhcmFtIHtib29sZWFufSBkZWZhdWx0U3RhdGUgaW5pdGlhbCBzdGF0ZSB0byByZXR1cm4sIHRydWUgb3IgZmFsc2VcbiAqIEBwYXJhbSB7KHt9fEFycmF5KX0gYWN0aW9uVHlwZXMgY29uZmlndXJlZCBhY3Rpb24gdHlwZXMgKHNlZSB0eXBlIEFwaUFjdGlvblR5cGVzKVxuICogQHJldHVybiB7ZnVuY3Rpb259IHJlZHV4IHJlZHVjZXIgZnVuY3Rpb25cbiAqL1xuY29uc3QgbG9hZGluZ1JlZHVjZXIgPSAoXG4gIGRlZmF1bHRTdGF0ZSA9IGZhbHNlLFxuICBhY3Rpb25UeXBlcyA9IHt9XG4pID0+IHtcbiAgY29uc3QgWyByZXF1ZXN0LCBzdWNjZXNzLCBmYWlsdXJlIF0gPSBub3JtYWxpemVBcGlUeXBlQXJyYXlzKGFjdGlvblR5cGVzKVxuXG4gIHJldHVybiAoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbiA9IHt9KSA9PiB7XG4gICAgaWYgKG1hdGNoZXNUeXBlKGFjdGlvbiwgLi4uc3VjY2VzcywgLi4uZmFpbHVyZSkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBpZiAobWF0Y2hlc1R5cGUoYWN0aW9uLCAuLi5yZXF1ZXN0KSkge1xuICAgICAgaWYgKGFjdGlvbi5lcnJvcikgcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICByZXR1cm4gc3RhdGVcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBsb2FkaW5nUmVkdWNlclxuIiwiaW1wb3J0IHsgbWF0Y2hlc1R5cGUgfSBmcm9tICcuLi9jb3JlJ1xuaW1wb3J0IHsgbm9ybWFsaXplQXBpVHlwZUFycmF5cyB9IGZyb20gJy4vYXBpQWN0aW9uVHlwZXMnXG5cbi8qKlxuICogQ291bnRzIGEgbnVtYmVyIG9mIGFyYml0cmFyeSBcInJlcXVlc3RcIiBhY3Rpb25zLCBhbmQgZGVjcmltZW50cyBjb3VudCB3aGVuXG4gKiByZWNlaXZpbmcgY29vcmVzcG9uZGluZyBzdWNjZXNzfGZhaWx1cmUgYWN0aW9ucywgaW5kaWNhdGluZyByZXF1ZXN0IGhhc1xuICogcmVzb2x2ZWQuIFRoaXMgY2FuIGJlIHVzZWZ1bCB3aGVuIG1ha2luZyBtdWx0aXBsZSBBUEkgcmVxdWVzdHMgdG8gdGhlIHNhbWVcbiAqIChvciBtdWx0aXBsZSkgZW5kcG9pbnQocykgd2l0aG91dCB3b3JyeWluZyBhYm91dCByZXNwb25zZSBvcmRlci5cbiAqIEEgcGVuZGluZyBzdGF0ZSBvZiAwIGNhbiBpbmRpY2F0ZSBcIm5vIGluLWZsaWdodCByZXF1ZXN0cyxcIlwiIGFuZCBhbnl0aGluZ1xuICogZ3JlYXRlciBpbmRpY2F0ZXMgb25lIG9yIG1vcmUgcGVuZGluZyByZXF1ZXN0cy5cbiAqXG4gKiBOT1RFOiB3aGVuIHVzaW5nIHRoaXMgd2l0aCBgY2FuY2VsQWN0aW9uYCBtaWRkbGV3YXJlLCB0aGVyZSBtYXkgYmUgc2l0dWF0aW9uc1xuICogd2hlcmUgeW91J2Qgc3RpbGwgbGlrZSB0byB1c2UgdGhlIFwiY2FuY2VsZWRcIiByZXNwb25zZSBhY3Rpb24gdG8gZGVjcmltZW50XG4gKiBjb3VudCwgbGlrZSB3aGVuIHlvdSBuZWVkIHRvIGtub3cgdGhlIF9yZWFsXyByZXF1ZXN0IGNvdW50IChpLmUuIGZvciBwZXItZG9tYWluXG4gKiByZXF1ZXN0IG1hbmFnZW1lbnQpLiAgSW4gdGhpcyBjYXNlLCB5b3UgbXVzdCBlbmhhbmNlIHRoaXMgcmVkdWNlciB3aXRoIG9uZSB0aGF0XG4gKiBjYW4gZm9yd2FyZCB0aGUgXCJjYW5jZWxlZFwiIGFjdGlvbiB0byB0aGlzIHJlZHVjZXIuXG4gKiBgYGBcbiAqIHR5cGUgUmVxdWVzdEFjdGlvblR5cGVzID0ge1xuICogICByZXF1ZXN0OiBzdHJpbmcgfCBzdHJpbmdbXSxcbiAqICAgc3VjY2Vzczogc3RyaW5nIHwgc3RyaW5nW10sXG4gKiAgIGZhaWx1cmU6IHN0cmluZyB8IHN0cmluZ1tdXG4gKiB9XG4gKiB0eXBlIFJlcXVlc3RBY3Rpb25UeXBlc0FyciA9IFtcbiAqICAgcmVxdWVzdDogc3RyaW5nIHwgc3RyaW5nW10sXG4gKiAgIHN1Y2Nlc3M6IHN0cmluZyB8IHN0cmluZ1tdLFxuICogICBmYWlsdXJlOiBzdHJpbmcgfCBzdHJpbmdbXVxuICogXVxuICogdHlwZSBBcGlBY3Rpb25UeXBlcyA9IFJlcXVlc3RBY3Rpb25UeXBlcyB8IFJlcXVlc3RBY3Rpb25UeXBlc0FyclxuICogKGRlZmF1bHRTdGF0ZTogbnVtYmVyLCBhY3Rpb25UeXBlczogQXBpQWN0aW9uVHlwZXMpID0+XG4gKiAgIChzdGF0ZTogbnVtYmVyLCBhY3Rpb246IEZTQSkgPT4gbnVtYmVyXG4gKiBgYGBcbiAqIEBhbGlhcyBtb2R1bGU6YXBpXG4gKiBAcGFyYW0ge251bWJlcn0gZGVmYXVsdFN0YXRlIGluaXRpYWwgc3RhdGUgdG8gcmV0dXJuLCBuYXR1cmFsIG51bWJlclxuICogQHBhcmFtIHsoe318QXJyYXkpfSBhY3Rpb25UeXBlcyBjb25maWd1cmVkIGFjdGlvbiB0eXBlcyAoc2VlIHR5cGUgQXBpQWN0aW9uVHlwZXMpXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gcmVkdXggcmVkdWNlciBmdW5jdGlvblxuICovXG5jb25zdCBwZW5kaW5nUmVkdWNlciA9IChcbiAgZGVmYXVsdFN0YXRlID0gMCxcbiAgYWN0aW9uVHlwZXMgPSB7fVxuKSA9PiB7XG4gIGNvbnN0IFsgcmVxdWVzdCwgc3VjY2VzcywgZmFpbHVyZSBdID0gbm9ybWFsaXplQXBpVHlwZUFycmF5cyhhY3Rpb25UeXBlcylcblxuICByZXR1cm4gKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24gPSB7fSkgPT4ge1xuICAgIGlmIChtYXRjaGVzVHlwZShhY3Rpb24sIC4uLnN1Y2Nlc3MsIC4uLmZhaWx1cmUpKSB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoMCwgc3RhdGUgLSAxKVxuICAgIH1cbiAgICBpZiAobWF0Y2hlc1R5cGUoYWN0aW9uLCAuLi5yZXF1ZXN0KSkge1xuICAgICAgaWYgKGFjdGlvbi5lcnJvcikgcmV0dXJuIE1hdGgubWF4KDAsIHN0YXRlIC0gMSlcbiAgICAgIHJldHVybiBzdGF0ZSArIDFcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcGVuZGluZ1JlZHVjZXJcbiIsImltcG9ydCB7IG1hdGNoZXNUeXBlIH0gZnJvbSAnLi4vY29yZSdcbmltcG9ydCB7IG5vcm1hbGl6ZUFwaVR5cGVBcnJheXMgfSBmcm9tICcuL2FwaUFjdGlvblR5cGVzJ1xuXG4vKipcbiAqIEJhc2ljIGVycm9yIHRyYWNrZXIgcmVkdWNlciBmb3IgZWFzZS1vZi11c2Ugdy8gUlNBQXMuICBLZWVwcyB0cmFjayBvZiBhIHNpbmdsZVxuICogZXJyb3IgcGF5bG9hZCBmb3IgdGFyZ2V0ZWQgYWN0aW9uIHR5cGVzLiBBbnkgdHJhY2tlZCBcInN1Y2Nlc3NcIiByZXNwb25zZSB3aWxsIHJlc2V0XG4gKiBzdGF0ZSB0byBiYWNrIHRvIGBudWxsYC5cbiAqIENhbiBiZSB1c2VkIHdpdGggYSBzaW5nbGUgZW5kcG9pbnQgYnkgdXNpbmcgdGhlIHJlcXVlc3QsIHN1Y2Nlc3MsIGZhaWx1cmUgYWN0aW9uc1xuICogZm9yIHRoZSBSU0FBLiBZb3UgY2FuIGFsc28gc3BlY2lmeSB0aGUgYWN0aW9uIHR5cGVzIGFzIGFycmF5cywgaW4gY2FzZXMgd2hlcmUgbW9yZVxuICogdGhhbiAxIGFjdGlvbiB0eXBlIHNob3VsZCBiZSBoYW5kbGVkIGZvciByZXF1ZXN0LCBzdWNjZXNzLCBhbmQvb3IgZmFpbHVyZSBjYXNlcy5cbiBgYGBcbiB0eXBlIFJlcXVlc3RBY3Rpb25UeXBlcyA9IHtcbiAgIHJlcXVlc3Q6IHN0cmluZyB8IHN0cmluZ1tdLFxuICAgc3VjY2Vzczogc3RyaW5nIHwgc3RyaW5nW10sXG4gICBmYWlsdXJlOiBzdHJpbmcgfCBzdHJpbmdbXVxuIH1cbiB0eXBlIFJlcXVlc3RBY3Rpb25UeXBlc0FyciA9IFtcbiAgIHJlcXVlc3Q6IHN0cmluZyB8IHN0cmluZ1tdLFxuICAgc3VjY2Vzczogc3RyaW5nIHwgc3RyaW5nW10sXG4gICBmYWlsdXJlOiBzdHJpbmcgfCBzdHJpbmdbXVxuIF1cbiB0eXBlIEFwaUFjdGlvblR5cGVzID0gUmVxdWVzdEFjdGlvblR5cGVzIHwgUmVxdWVzdEFjdGlvblR5cGVzQXJyXG4gKGRlZmF1bHRTdGF0ZTogb2JqZWN0PywgYWN0aW9uVHlwZXM6IEFwaUFjdGlvblR5cGVzKSA9PlxuICAgKHN0YXRlOiBvYmplY3Q/LCBhY3Rpb246IEZTQSkgPT4gb2JqZWN0P1xuIGBgYFxuICogQGFsaWFzIG1vZHVsZTphcGlcbiAqIEBwYXJhbSB7Kn0gZGVmYXVsdFN0YXRlIGluaXRpYWwgc3RhdGUgdG8gcmV0dXJuLCBudWxsIG9yIGVycm9yXG4gKiBAcGFyYW0geyh7fXxBcnJheSl9IGFjdGlvblR5cGVzIGNvbmZpZ3VyZWQgYWN0aW9uIHR5cGVzIChzZWUgdHlwZSBBcGlBY3Rpb25UeXBlcylcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSByZWR1eCByZWR1Y2VyIGZ1bmN0aW9uXG4gKi9cbmNvbnN0IHJzYWFFcnJvclJlZHVjZXIgPSAoXG4gIGRlZmF1bHRTdGF0ZSA9IG51bGwsXG4gIGFjdGlvblR5cGVzID0ge31cbikgPT4ge1xuICBjb25zdCBbIHJlcXVlc3QsIHN1Y2Nlc3MsIGZhaWx1cmUgXSA9IG5vcm1hbGl6ZUFwaVR5cGVBcnJheXMoYWN0aW9uVHlwZXMpXG5cbiAgcmV0dXJuIChzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uID0ge30pID0+IHtcbiAgICBpZiAobWF0Y2hlc1R5cGUoYWN0aW9uLCAuLi5yZXF1ZXN0LCAuLi5mYWlsdXJlKSkge1xuICAgICAgcmV0dXJuIGFjdGlvbi5lcnJvciA/IGFjdGlvbi5wYXlsb2FkIDogc3RhdGVcbiAgICB9XG4gICAgaWYgKG1hdGNoZXNUeXBlKGFjdGlvbiwgLi4uc3VjY2VzcykpIHtcbiAgICAgIHJldHVybiBhY3Rpb24uZXJyb3IgPyBhY3Rpb24ucGF5bG9hZCA6IG51bGxcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgcnNhYUVycm9yUmVkdWNlclxuIiwiLyoqXG4gKiBSRVNUfHxSUEN8KC4uLmlzaD8pIGFwaSBpbnRlZ3JhdGlvbiB1dGlsaXRpZXMgdXNpbmcgd2ViIHN0YW5kYXJkIGBmZXRjaGAgYXBpLlxuICogRGVwZW5kcyBvbiB0aGUgKGV4Y2VsbGVudCkgYHJlZHV4LWFwaS1taWRkbGV3YXJlYCBpbnRlcm5hbGx5LCBhbmQgb2ZmZXJzIGFkZGl0aW9uYWxcbiAqIHV0aWxpdHkgbWV0aG9kcyBhbmQgZXh0ZW5zaW9ucy5cbiAqIEBtb2R1bGUgYXBpXG4gKi9cbmV4cG9ydCB7XG4gIGRlZmF1bHQgYXMgYXBpQWN0aW9uLFxuICBhcGlBY3Rpb25XaXRoTWV0YSxcbiAgY29uZmlndXJlTWV0YVF1ZXJ5LFxuICBjb25maWd1cmVBcGlBY3Rpb25cbn0gZnJvbSAnLi9hcGlBY3Rpb24nXG5leHBvcnQge1xuICBkZWZhdWx0IGFzIGFwaUFjdGlvblR5cGVzLFxuICBhc0FwaVR5cGVzT2JqZWN0LFxuICBhc0FwaVR5cGVzQXJyYXksXG4gIG5vcm1hbGl6ZUFwaVR5cGVzLFxuICBub3JtYWxpemVBcGlUeXBlQXJyYXlzLFxuICBjb25maWd1cmVBcGlBY3Rpb25UeXBlc1xufSBmcm9tICcuL2FwaUFjdGlvblR5cGVzJ1xuZXhwb3J0IHtcbiAgZGVmYXVsdCBhcyBjb25maWd1cmVDYWxsUlNBQVxufSBmcm9tICcuL2NvbmZpZ3VyZUNhbGxSU0FBJ1xuZXhwb3J0IHtcbiAgZGVmYXVsdCBhcyByc2FhTWV0YU1pZGRsZXdhcmUsXG4gIFJTQUFfTUVUQVxufSBmcm9tICcuL3JzYWFNZXRhJ1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBsb2FkaW5nUmVkdWNlciB9IGZyb20gJy4vbG9hZGluZydcbmV4cG9ydCB7IGRlZmF1bHQgYXMgcGVuZGluZ1JlZHVjZXIgfSBmcm9tICcuL3BlbmRpbmcnXG5leHBvcnQgeyBkZWZhdWx0IGFzIHJzYWFFcnJvclJlZHVjZXIgfSBmcm9tICcuL3JzYWFFcnJvcidcbiIsImltcG9ydCB7IGlzVW5kZWZpbmVkLCBpc09iamVjdCB9IGZyb20gJy4uL3V0aWxzJ1xuXG5jb25zdCB7IGlzQXJyYXkgfSA9IEFycmF5XG5cbi8qKlxuICogcHJvY2Vzc2VzIG9iamVjdCBmb3Igc2FmZSBhZGRpdGlvbi9tZXJnZSBpbnRvIGNvbGxlY3Rpb24uXG4gKiB1c2VzIGlkQXR0ciBhcyB1bmlxdWUgSUQgZm9yIG1vZGVsLCBpZiBwcmVzZW50LCBvdGhlcndpc2UgbG9va3MgZm9yIGEgY2lkIGF0dHJpYnV0ZS5cbiAqIGlmIG5laXRoZXIgaWQgbm9yIGNpZCBleGlzdCBvbiBtb2RlbCwgZ2VuZXJhdGVzIGEgbmV3IGNpZCB1c2luZyBwcm92aWRlZCB1aWQgbWV0aG9kLlxuICpcbiAqIEBhbGlhcyBtb2R1bGU6Y29sbGVjdGlvblxuICogQHBhcmFtIHt7fX0gbW9kZWwgbW9kZWwgdG8gcHJvY2Vzc1xuICogQHBhcmFtIHtzdHJpbmd9IGlkQXR0ciBpZCBhdHRyaWJ1dGUgYXNzaWduZWQgdG8gbW9kZWxzIGluIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBjaWRBdHRyIGNpZCBhdHRyaWJ1dGUgYXNzaWduZWQgdG8gYWxsIG1vZGVscyBpbiBjb2xsZWN0aW9uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSB1aWQgbWV0aG9kIHRvIGdlbmVyYXRlIGEgdWlkIGFzIG1vZGVsJ3MgY2lkIHdoZW4gcHJvY2Vzc2VkIHdpdGhvdXQgaWQgb3IgY2lkXG4gKiBAcmV0dXJuIHt7fX0gcHJvY2Vzc2VkIG1vZGVsXG4gKi9cbmV4cG9ydCBjb25zdCBwcm9jZXNzQ29sbGVjdGlvbk1vZGVsID0gKG1vZGVsLCBpZEF0dHIsIGNpZEF0dHIsIHVpZCkgPT4ge1xuICAvLyBodHRwOi8vYmFja2JvbmVqcy5vcmcvI01vZGVsLWNpZFxuICBjb25zdCBtb2RlbElEID0gbW9kZWxbaWRBdHRyXVxuICBjb25zdCBtb2RlbENJRCA9IG1vZGVsW2NpZEF0dHJdXG4gIGNvbnN0IGlkID0gaXNVbmRlZmluZWQobW9kZWxJRCkgPyBudWxsIDogbW9kZWxJRFxuICBjb25zdCBjaWQgPSBpc1VuZGVmaW5lZChtb2RlbENJRCkgPyAoaWQgfHwgdWlkKCkpIDogbW9kZWxDSURcbiAgcmV0dXJuIHsgLi4ubW9kZWwsIFtjaWRBdHRyXTogY2lkIH1cbn1cblxuY29uc3QgcHJvY2Vzc01vZGVsID0gcHJvY2Vzc0NvbGxlY3Rpb25Nb2RlbFxuXG5leHBvcnQgY29uc3QgcHJvY2Vzc1BheWxvYWQgPSAobW9kZWxzLCAuLi5hcmdzKSA9PiB7XG4gIGlmICghaXNPYmplY3QobW9kZWxzKSkgcmV0dXJuIFtdXG4gIHJldHVybiBpc0FycmF5KG1vZGVscylcbiAgICA/IG1vZGVscy5tYXAobSA9PiBwcm9jZXNzTW9kZWwobSwgLi4uYXJncykpXG4gICAgOiBwcm9jZXNzTW9kZWwobW9kZWxzLCAuLi5hcmdzKVxufVxuXG4vKipcbiAqIGNyZWF0ZXMgYSBtYXAgb2YgXCJjb2xsZWN0aW9uXCIgYWN0aW9uIGNyZWF0b3JzLlxuICogcHJvZHVjZXMgYW4gb2JqZWN0IHdpdGggc2FtZSBwcm9wZXJ0aWVzIGFzIGEgY29sbGVjdGlvbkFjdGlvblR5cGVzIG9iamVjdCxcbiAqIGJ1dCB3aXRoIGNvb3Jlc3BvbmRpbmcgYWN0aW9uIGNyZWF0b3IgZnVuY3Rpb25zLlxuICpcbiAqIEBhbGlhcyBtb2R1bGU6Y29sbGVjdGlvblxuICogQHBhcmFtIHt7fX0gW3R5cGVzXSBjb2xsZWN0aW9uQWN0aW9uVHlwZXMgb2JqZWN0XG4gKiBAcGFyYW0ge3t9fSBbb3B0aW9uc10gYWN0aW9uIGNyZWF0b3Igb3B0aW9uc1xuICogQHBhcmFtIHtmdW5jdGlvbn0gW29wdGlvbnMudWlkXSB1aWQgZ2VuZXJhdGlvbiBtZXRob2RcbiAqIEByZXR1cm4ge3t9fSBtYXAgb2YgXCJjb2xsZWN0aW9uXCIgYWN0aW9uIGlkZW50aWZpZXJzIHRvIGFjdGlvbiBjcmVhdG9yc1xuICovXG5jb25zdCBjb2xsZWN0aW9uQWN0aW9ucyA9ICh0eXBlcywge1xuICBpZEF0dHJpYnV0ZSA9ICdpZCcsXG4gIGNpZEF0dHJpYnV0ZSA9ICdjaWQnLFxuICB1aWQ6IGdldFVJRFxufSA9IHt9KSA9PiB7XG4gIGxldCBpZENvdW50ZXIgPSAwXG4gIGNvbnN0IHVpZCA9IGdldFVJRCB8fCAoKCkgPT4gYCR7aWRDb3VudGVyKyt9YClcblxuICBjb25zdCBhZGQgPSAobW9kZWxzLCBtZXRhKSA9PiAoe1xuICAgIHR5cGU6IHR5cGVzLmFkZCxcbiAgICBwYXlsb2FkOiBwcm9jZXNzUGF5bG9hZChtb2RlbHMsIGlkQXR0cmlidXRlLCBjaWRBdHRyaWJ1dGUsIHVpZCksXG4gICAgbWV0YVxuICB9KVxuXG4gIGNvbnN0IHB1c2ggPSAobW9kZWwsIG1ldGEpID0+ICh7XG4gICAgdHlwZTogdHlwZXMucHVzaCxcbiAgICBwYXlsb2FkOiBwcm9jZXNzUGF5bG9hZChtb2RlbCwgaWRBdHRyaWJ1dGUsIGNpZEF0dHJpYnV0ZSwgdWlkKSxcbiAgICBtZXRhXG4gIH0pXG5cbiAgY29uc3QgcG9wID0gKGNvdW50LCBtZXRhKSA9PiAoe1xuICAgIHR5cGU6IHR5cGVzLnBvcCxcbiAgICBwYXlsb2FkOiBjb3VudCxcbiAgICBtZXRhXG4gIH0pXG5cbiAgY29uc3QgcmVtb3ZlID0gKGlkcywgbWV0YSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlcy5yZW1vdmUsXG4gICAgcGF5bG9hZDogaWRzLFxuICAgIG1ldGFcbiAgfSlcblxuICBjb25zdCBmaWx0ZXIgPSAocGF5bG9hZCwgbWV0YSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlcy5maWx0ZXIsXG4gICAgcGF5bG9hZCxcbiAgICBtZXRhXG4gIH0pXG5cbiAgY29uc3QgcmVqZWN0ID0gKHBheWxvYWQsIG1ldGEpID0+ICh7XG4gICAgdHlwZTogdHlwZXMucmVqZWN0LFxuICAgIHBheWxvYWQsXG4gICAgbWV0YVxuICB9KVxuXG4gIGNvbnN0IHJlc2V0ID0gKG1vZGVscywgbWV0YSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlcy5yZXNldCxcbiAgICBwYXlsb2FkOiBwcm9jZXNzUGF5bG9hZChtb2RlbHMsIGlkQXR0cmlidXRlLCBjaWRBdHRyaWJ1dGUsIHVpZCksXG4gICAgbWV0YVxuICB9KVxuXG4gIGNvbnN0IHVuc2hpZnQgPSAobW9kZWxzLCBtZXRhKSA9PiAoe1xuICAgIHR5cGU6IHR5cGVzLnVuc2hpZnQsXG4gICAgcGF5bG9hZDogcHJvY2Vzc1BheWxvYWQobW9kZWxzLCBpZEF0dHJpYnV0ZSwgY2lkQXR0cmlidXRlLCB1aWQpLFxuICAgIG1ldGFcbiAgfSlcblxuICBjb25zdCBzaGlmdCA9IChjb3VudCwgbWV0YSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlcy5zaGlmdCxcbiAgICBwYXlsb2FkOiBjb3VudCxcbiAgICBtZXRhXG4gIH0pXG5cbiAgY29uc3QgcmVkdWNlID0gKHBheWxvYWQsIG1ldGEpID0+ICh7XG4gICAgdHlwZTogdHlwZXMucmVkdWNlLFxuICAgIHBheWxvYWQsXG4gICAgbWV0YVxuICB9KVxuXG4gIGNvbnN0IGJhdGNoID0gKGFjdGlvbnMsIG1ldGEpID0+ICh7XG4gICAgdHlwZTogdHlwZXMuYmF0Y2gsXG4gICAgcGF5bG9hZDogYWN0aW9ucyxcbiAgICBtZXRhXG4gIH0pXG5cbiAgcmV0dXJuIHtcbiAgICBhZGQsXG4gICAgcHVzaCxcbiAgICBwb3AsXG4gICAgcmVtb3ZlLFxuICAgIGZpbHRlcixcbiAgICByZWplY3QsXG4gICAgcmVzZXQsXG4gICAgdW5zaGlmdCxcbiAgICBzaGlmdCxcbiAgICByZWR1Y2UsXG4gICAgYmF0Y2hcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb2xsZWN0aW9uQWN0aW9uc1xuIiwiaW1wb3J0IHsgbWFwVmFsdWVzIH0gZnJvbSAnLi4vdXRpbHMnXG5cbi8qKlxuICogYWN0aW9uIHR5cGVzIGZvciBcImNvbGxlY3Rpb25SZWR1Y2VyXCJcbiAqIEBhbGlhcyBtb2R1bGU6Y29sbGVjdGlvblxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7e319XG4gKiBAcHJvcCB7c3RyaW5nfSBhZGRcbiAqIEBwcm9wIHtzdHJpbmd9IHB1c2hcbiAqIEBwcm9wIHtzdHJpbmd9IHBvcFxuICogQHByb3Age3N0cmluZ30gcmVtb3ZlXG4gKiBAcHJvcCB7c3RyaW5nfSBmaWx0ZXJcbiAqIEBwcm9wIHtzdHJpbmd9IHJlamVjdFxuICogQHByb3Age3N0cmluZ30gcmVzZXRcbiAqIEBwcm9wIHtzdHJpbmd9IHVuc2hpZnRcbiAqIEBwcm9wIHtzdHJpbmd9IHNoaWZ0XG4gKiBAcHJvcCB7c3RyaW5nfSByZWR1Y2VcbiAqIEBwcm9wIHtzdHJpbmd9IGJhdGNoXG4gKi9cbmV4cG9ydCBjb25zdCBDT0xMRUNUSU9OX1RZUEVTID0gT2JqZWN0LmZyZWV6ZSh7XG4gIGFkZDogJ2FkZCcsXG4gIHB1c2g6ICdwdXNoJyxcbiAgcG9wOiAncG9wJyxcbiAgcmVtb3ZlOiAncmVtb3ZlJyxcbiAgZmlsdGVyOiAnZmlsdGVyJyxcbiAgcmVqZWN0OiAncmVqZWN0JyxcbiAgcmVzZXQ6ICdyZXNldCcsXG4gIHVuc2hpZnQ6ICd1bnNoaWZ0JyxcbiAgc2hpZnQ6ICdzaGlmdCcsXG4gIHJlZHVjZTogJ3JlZHVjZScsXG4gIGJhdGNoOiAnYmF0Y2gnXG59KVxuXG4vKipcbiAqIGNyZWF0ZXMgYSBtYXAgb2YgXCJjb2xsZWN0aW9uXCIgYWN0aW9uIHR5cGVzLlxuICogcHJvZHVjZXMgYW4gb2JqZWN0IGluIHRoZSBmb3JtIGV4cGVjdGVkIGJ5IHRoZSBgYWN0aW9uVHlwZXNgIGFyZ3VtZW50XG4gKiBvZiB0aGUgYGNvbGxlY3Rpb25SZWR1Y2VyYCBtZXRob2QuICBjYW4gYmUgZ2l2ZW4gYSBgZ2V0VHlwZWAgYXJndW1lbnRcbiAqIHRvIGN1c3RvbWl6ZSB0aGUgYWN0aW9uIHR5cGUgdmFsdWVzLCBwZXIgYWN0aW9uLlxuICpcbiAqIEBhbGlhcyBtb2R1bGU6Y29sbGVjdGlvblxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2dldFR5cGVdIGFzc2lnbnMgcHJvcGVydHkgdmFsdWVzIHRvIHJlc3VsdGluZyBvYmplY3RcbiAqIEByZXR1cm4ge3t9fSBtYXAgb2YgXCJjb2xsZWN0aW9uXCIgYWN0aW9uIHR5cGVzIHRvIHN0cmluZ3xzeW1ib2wgdmFsdWVzXG4gKi9cbmNvbnN0IGNvbGxlY3Rpb25BY3Rpb25UeXBlcyA9IChnZXRUeXBlKSA9PiBtYXBWYWx1ZXMoQ09MTEVDVElPTl9UWVBFUywgZ2V0VHlwZSlcblxuZXhwb3J0IGRlZmF1bHQgY29sbGVjdGlvbkFjdGlvblR5cGVzXG4iLCJpbXBvcnQge1xuICBrZXlCeSxcbiAgaXNOaWwsXG4gIGlzVW5kZWZpbmVkLFxuICBpc09iamVjdCxcbiAgbWF0Y2hlc09iamVjdCxcbiAgbm9ybWFsaXplQXJyYXksXG4gIGVtcHR5QWN0aW9uLFxuICBpbW11dGFibGVTcGxpY2Vcbn0gZnJvbSAnLi4vdXRpbHMnXG5cbmNvbnN0IHsgaXNBcnJheSB9ID0gQXJyYXlcblxuY29uc3QgZGVmYXVsdE1lcmdlID0gKG9iaiwgLi4uc291cmNlcykgPT4gKFxuICBzb3VyY2VzLnJlZHVjZSgobywgcykgPT4gKHsgLi4ubywgLi4ucyB9KSwgb2JqKVxuKVxuXG5jb25zdCBub3JtYWxpemVBcnJheVBheWxvYWQgPSAocGF5bG9hZCkgPT4gbm9ybWFsaXplQXJyYXkocGF5bG9hZCkuZmlsdGVyKHYgPT4gdilcblxuLyoqXG4gKiBEZWZhdWx0IHZhbHVlIGZvciBjb2xsZWN0aW9uUmVkdWNlcidzIGBnZXRGaWx0ZXJDYWxsYmFja2Agb3B0aW9uXG4gKiBAYWxpYXMgbW9kdWxlOmNvbGxlY3Rpb25cbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBhIGZpbHRlciBhY3Rpb24ncyBwYXlsb2FkXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IEFycmF5LmZpbHRlciBjYWxsYmFjayBmdW5jdGlvblxuICovXG5leHBvcnQgY29uc3QgZ2V0Q29sbGVjdGlvbkZpbHRlckNhbGxiYWNrID0gKHBheWxvYWQpID0+IChlbGVtZW50KSA9PiBtYXRjaGVzT2JqZWN0KGVsZW1lbnQsIHBheWxvYWQpXG5cbi8qKlxuICogRGVmYXVsdCB2YWx1ZSBmb3IgY29sbGVjdGlvblJlZHVjZXIncyBgZ2V0TW9kZWxSZWR1Y2VyYCBvcHRpb25cbiAqIEBhbGlhcyBtb2R1bGU6Y29sbGVjdGlvblxuICogQHBhcmFtIHt7fX0gb3B0aW9ucyBzdWJzZXQgb2YgY29sbGVjdGlvblJlZHVjZXIgb3B0aW9uc1xuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMuaWRBdHRyaWJ1dGUgaWQgYXR0cmlidXRlIHVzZWQgZm9yIGNvbGxlY3Rpb24gZWxlbWVudHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmNpZEF0dHJpYnV0ZSBjaWQgYXR0cmlidXRlIHVzZWQgZm9yIGNvbGxlY3Rpb24gZWxlbWVudHNcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gXCJyZWR1eC1zdHlsZVwiIHJlZHVjZXI7IGdpdmVuIGEgbW9kZWwsICdyZWR1Y2UnIGFjdGlvbiwgYW5kIG1vZGVsIGNpZCwgcmV0dXJucyBuZXh0IG1vZGVsXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRDb2xsZWN0aW9uTW9kZWxSZWR1Y2VyID0gKHtcbiAgaWRBdHRyaWJ1dGUsXG4gIGNpZEF0dHJpYnV0ZSxcbiAgbWVyZ2Vcbn0pID0+IChtb2RlbCwgYWN0aW9uLCBjaWQpID0+IHtcbiAgY29uc3QgeyBwYXlsb2FkIH0gPSBhY3Rpb25cbiAgY29uc3QgaWRzT2JqID0geyBbY2lkQXR0cmlidXRlXTogY2lkIH1cbiAgaWYgKCFpc1VuZGVmaW5lZChtb2RlbFtpZEF0dHJpYnV0ZV0pKSB7XG4gICAgaWRzT2JqW2lkQXR0cmlidXRlXSA9IG1vZGVsW2lkQXR0cmlidXRlXVxuICB9XG4gIHJldHVybiBtZXJnZShtb2RlbCwgcGF5bG9hZCwgaWRzT2JqKVxufVxuXG5jb25zdCBhZGQgPSAoY29sbGVjdGlvbiwgcGF5bG9hZCwgbWV0YSwgY2lkQXR0ciwgbWVyZ2VGbikgPT4ge1xuICAvLyBodHRwOi8vYmFja2JvbmVqcy5vcmcvI0NvbGxlY3Rpb24tYWRkXG4gIC8vIGV4cGVjdHMgYHBheWxvYWRgIHRvIGJlIGFuIGFycmF5IG9mIG1vZGVscyBvciBhIHNpbmdsZSBtb2RlbFxuICAvLyBleHBlY3RzIGBtZXRhLmF0YCB0byBzcGVjaWZ5IHdoZXJlIHRvIGluc2VydCBpbiBjb2xsZWN0aW9uIChkZWZhdWx0c1xuICAvLyAgIHRvIHRoZSBlbmQgb2YgdGhlIGNvbGxlY3Rpb24pXG4gIC8vIGV4cGVjdCBgbWV0YS5tZXJnZWAgKGJvb2wpIHRvIGRldGVybWluZSBpZiBtb2RlbHMgdGhhdCBhcmUgYWxyZWFkeSBwYXJ0XG4gIC8vICAgb2YgdGhlIGNvbGxlY3Rpb24gYmUgbWVyZ2VkIG9udG8gZXhpc3Rpbmcgb2JqZWN0cyBpbiBwbGFjZS5cbiAgaWYgKCFpc09iamVjdChwYXlsb2FkKSkgcmV0dXJuIGNvbGxlY3Rpb25cbiAgY29uc3Qge1xuICAgIGF0ID0gY29sbGVjdGlvbi5sZW5ndGgsXG4gICAgbWVyZ2UgPSB0cnVlXG4gIH0gPSBtZXRhIHx8IHt9XG4gIGNvbnN0IGNvbGxlY3Rpb25NYXAgPSBrZXlCeShjb2xsZWN0aW9uLCBjaWRBdHRyKVxuICBjb25zdCBuZXdNb2RlbHMgPSBub3JtYWxpemVBcnJheVBheWxvYWQocGF5bG9hZClcbiAgY29uc3QgYWRkZWRNb2RlbHMgPSBuZXdNb2RlbHMuZmlsdGVyKG1vZGVsID0+IGlzVW5kZWZpbmVkKGNvbGxlY3Rpb25NYXBbbW9kZWxbY2lkQXR0cl1dKSlcblxuICBpZiAobWVyZ2UpIHtcbiAgICAvLyB3aGVuIG1lcmdpbmcvdXBkYXRpbmcgZXhpc3RpbmcgbW9kZWxzLCBmaWd1cmUgb3V0IHdoaWNoIGFyZSBuZXcsIGFuZCB0aGVuXG4gICAgLy8gc2hhbGxvdyBtZXJnZSB1cGRhdGVkIG1vZGVscyBvbnRvIGV4aXN0aW5nIG9uZXMuXG4gICAgY29uc3QgYWRkZWRNb2RlbHNNYXAgPSBrZXlCeShhZGRlZE1vZGVscywgY2lkQXR0cilcbiAgICBjb25zdCBuZXdNb2RlbHNNYXAgPSBrZXlCeShuZXdNb2RlbHMsIGNpZEF0dHIpXG5cbiAgICByZXR1cm4gaW1tdXRhYmxlU3BsaWNlKGNvbGxlY3Rpb24ubWFwKG1vZGVsID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsSWQgPSBtb2RlbFtjaWRBdHRyXVxuICAgICAgY29uc3QgbWVyZ2VNb2RlbCA9IG5ld01vZGVsc01hcFttb2RlbElkXVxuICAgICAgaWYgKG1lcmdlTW9kZWwgJiYgaXNVbmRlZmluZWQoYWRkZWRNb2RlbHNNYXBbbW9kZWxJZF0pKSB7XG4gICAgICAgIHJldHVybiBtZXJnZUZuKG1vZGVsLCBtZXJnZU1vZGVsKVxuICAgICAgfVxuICAgICAgcmV0dXJuIG1vZGVsXG4gICAgfSksIGF0LCAwLCAuLi5hZGRlZE1vZGVscylcbiAgfVxuICAvLyBpZiBtZXJnZSBub3Qgc3BlY2lmaWVkIGRvbid0IGFkZCBuZXcgbW9kZWxzIHRvIGNvbGxlY3Rpb24gaWYgdGhleSBhcmVcbiAgLy8gYWxyZWFkeSBpbiB0aGUgY29sbGVjdGlvbi4gIHRoaXMgYXR0ZW1wdHMgdG8gbWF0Y2ggQmFja2JvbmUgXCJhZGRcIlxuICByZXR1cm4gaW1tdXRhYmxlU3BsaWNlKGNvbGxlY3Rpb24sIGF0LCAwLCAuLi5hZGRlZE1vZGVscylcbn1cblxuY29uc3QgcHVzaCA9IChjb2xsZWN0aW9uLCBwYXlsb2FkLCBtZXRhLCAuLi5yZXN0KSA9PiB7XG4gIC8vIGh0dHA6Ly9iYWNrYm9uZWpzLm9yZy8jQ29sbGVjdGlvbi1wdXNoXG4gIC8vIGV4cGVjdCBgbWV0YS5tZXJnZWAgKGJvb2wpIHRvIGRldGVybWluZSBpZiBtb2RlbHMgdGhhdCBhcmUgYWxyZWFkeSBwYXJ0XG4gIC8vICAgb2YgdGhlIGNvbGxlY3Rpb24gYmUgbWVyZ2VkIG9udG8gZXhpc3Rpbmcgb2JqZWN0cyBpbiBwbGFjZS5cbiAgY29uc3QgbmV3TWV0YSA9IHsgLi4ubWV0YSwgYXQ6IGNvbGxlY3Rpb24ubGVuZ3RoIH1cbiAgcmV0dXJuIGFkZChjb2xsZWN0aW9uLCBwYXlsb2FkLCBuZXdNZXRhLCAuLi5yZXN0KVxufVxuXG5jb25zdCBwb3AgPSAoY29sbGVjdGlvbiwgY291bnQgPSAxKSA9PiB7XG4gIC8vIGh0dHA6Ly9iYWNrYm9uZWpzLm9yZy8jQ29sbGVjdGlvbi1wb3BcbiAgaWYgKCFjb2xsZWN0aW9uLmxlbmd0aCkgcmV0dXJuIGNvbGxlY3Rpb25cbiAgcmV0dXJuIGNvbGxlY3Rpb24uc2xpY2UoMCwgLShjb3VudCkpXG59XG5cbmNvbnN0IHJlbW92ZSA9IChjb2xsZWN0aW9uLCBwYXlsb2FkLCBjaWRBdHRyKSA9PiB7XG4gIC8vIGh0dHA6Ly9iYWNrYm9uZWpzLm9yZy8jQ29sbGVjdGlvbi1yZW1vdmVcbiAgLy8gcmVtb3ZlcyBhIG1vZGVsIChvciBtb2RlbHMpIGZyb20gY29sbGVjdGlvbiBieSBJRC5cbiAgLy8gVE9ETzogdGhpcyBkb2Vzbid0IHF1aXRlIG1hdGNoIEJhY2tib25lICh3aGljaCBhbGxvd3Mgb2JqZWN0cyksIGJ1dCBJXG4gIC8vIHRoaW5rIChtb3N0IG9mdGVuIGluIHJlZHV4LWxhbmQgd2l0aCBub3JtYWxpemVkIG9iamVjdHMpIHJlbW92aW5nIGJ5IElEXG4gIC8vIHdpbGwgYmUgZWFzaWVzdCBhbmQgd29yayBmb3IgbW9zdCBvZiBvdXIgbmVlZHMuICBJZiB3ZSBmaW5kIGEgdXNlIGNhc2VcbiAgLy8gdG8gcmVtb3ZlIGJ5IG9iamVjdCBfb3JfIGJ5IElELCB3ZSBjYW4gaW1wbGVtZW50IHRoYXQgbGF0ZXIuXG4gIGlmICghY29sbGVjdGlvbi5sZW5ndGgpIHJldHVybiBjb2xsZWN0aW9uXG4gIGNvbnN0IGlkcyA9IG5vcm1hbGl6ZUFycmF5UGF5bG9hZChwYXlsb2FkKVxuICByZXR1cm4gY29sbGVjdGlvbi5maWx0ZXIobW9kZWwgPT4gaWRzLmluZGV4T2YobW9kZWxbY2lkQXR0cl0pID09PSAtMSlcbn1cblxuY29uc3QgZmlsdGVyID0gKGNvbGxlY3Rpb24sIHBheWxvYWQsIGdldENhbGxiYWNrKSA9PiB7XG4gIC8vIGZpbHRlcnMgY29sbGVjdGlvbiBmb3IgbW9kZWxzIHVzaW5nIHN1cHBsaWVkIGdldEZpbHRlckNhbGxiYWNrIG9wdGlvbi5cbiAgLy8gZGVmYXVsdCBvcHRpb24gYXR0ZW1wdHMgdG8gbWltaWMgbG9kYXNoLmZpbHRlciBmdW5jdGlvbmFsaXR5LCB3aGVyZSBhbnlcbiAgLy8gb2JqZWN0cyB0aGF0IGRvbid0IG1hdGNoIHRoZSBnaXZlbiBwYXlsb2FkIGFyZSByZW1vdmVkLlxuICBpZiAoIWNvbGxlY3Rpb24ubGVuZ3RoKSByZXR1cm4gY29sbGVjdGlvblxuICByZXR1cm4gY29sbGVjdGlvbi5maWx0ZXIoZ2V0Q2FsbGJhY2socGF5bG9hZCkpXG59XG5cbmNvbnN0IHJlamVjdCA9IChjb2xsZWN0aW9uLCBwYXlsb2FkLCBnZXRDYWxsYmFjaykgPT4ge1xuICAvLyBmaWx0ZXJzIGNvbGxlY3Rpb24gZm9yIG1vZGVscyB1c2luZyBzdXBwbGllZCBnZXRGaWx0ZXJDYWxsYmFjayBvcHRpb24uXG4gIC8vIGRlZmF1bHQgb3B0aW9uIGF0dGVtcHRzIHRvIG1pbWljIGxvZGFzaC5yZWplY3QgZnVuY3Rpb25hbGl0eSwgd2hlcmUgYW55XG4gIC8vIG9iamVjdHMgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4gcGF5bG9hZCBhcmUgcmVtb3ZlZC5cbiAgaWYgKCFjb2xsZWN0aW9uLmxlbmd0aCkgcmV0dXJuIGNvbGxlY3Rpb25cbiAgcmV0dXJuIGNvbGxlY3Rpb24uZmlsdGVyKCguLi5hcmdzKSA9PiAhZ2V0Q2FsbGJhY2socGF5bG9hZCkoLi4uYXJncykpXG59XG5cbmNvbnN0IHJlc2V0ID0gKHBheWxvYWQpID0+IHtcbiAgLy8gaHR0cDovL2JhY2tib25lanMub3JnLyNDb2xsZWN0aW9uLXJlc2V0XG4gIC8vIHJlc2V0IHRoZSBjb2xsZWN0aW9uXG4gIC8vIHJlcGxhY2VzIGNvbGxlY3Rpb24gd2l0aCBuZXcgbW9kZWxzLCBvciByZXNldHMgdG8gZW1wdHkgYXJyYXlcbiAgcmV0dXJuIG5vcm1hbGl6ZUFycmF5UGF5bG9hZChwYXlsb2FkKVxufVxuXG5jb25zdCB1bnNoaWZ0ID0gKGNvbGxlY3Rpb24sIHBheWxvYWQsIG1ldGEsIGNpZEF0dHIpID0+IHtcbiAgLy8gaHR0cDovL2JhY2tib25lanMub3JnLyNDb2xsZWN0aW9uLXVuc2hpZnRcbiAgLy8gYWRkIG1vZGVsIHRvIGJlZ2lubmluZyBvZiBhcnJheVxuICAvLyBzdXBwb3J0cyBzYW1lIGBtZXRhLm1lcmdlYCBvcHRpb24gYXMgYGFkZFJlZHVjZXJgXG4gIGlmICghcGF5bG9hZCkgcmV0dXJuIGNvbGxlY3Rpb25cbiAgY29uc3QgbmV3TWV0YSA9IHsgYXQ6IDAsIC4uLm1ldGEgfVxuICByZXR1cm4gYWRkKGNvbGxlY3Rpb24sIHBheWxvYWQsIG5ld01ldGEsIGNpZEF0dHIpXG59XG5cbmNvbnN0IHNoaWZ0ID0gKGNvbGxlY3Rpb24sIGNvdW50ID0gMSkgPT4ge1xuICAvLyBodHRwOi8vYmFja2JvbmVqcy5vcmcvI0NvbGxlY3Rpb24tc2hpZnRcbiAgLy8gcmVtb3ZlIG1vZGVsIGZyb20gYmVnaW5uaW5nIG9mIGFycmF5XG4gIGlmICghY29sbGVjdGlvbi5sZW5ndGgpIHJldHVybiBjb2xsZWN0aW9uXG4gIHJldHVybiBjb2xsZWN0aW9uLnNsaWNlKGNvdW50KVxufVxuXG5jb25zdCByZWR1Y2UgPSAoY29sbGVjdGlvbiwgYWN0aW9uLCBjaWRBdHRyLCByZWR1Y2VyKSA9PiB7XG4gIGlmICghY29sbGVjdGlvbi5sZW5ndGgpIHJldHVybiBjb2xsZWN0aW9uXG4gIGNvbnN0IHsgbWV0YSB9ID0gYWN0aW9uXG4gIGlmIChpc05pbChtZXRhKSkge1xuICAgIHJldHVybiBjb2xsZWN0aW9uLm1hcChtb2RlbCA9PiByZWR1Y2VyKG1vZGVsLCBhY3Rpb24sIG1vZGVsW2NpZEF0dHJdKSlcbiAgfVxuICBjb25zdCBpZHMgPSAoIWlzQXJyYXkobWV0YSkgJiYgaXNPYmplY3QobWV0YSkpXG4gICAgPyBub3JtYWxpemVBcnJheShtZXRhLmlkcylcbiAgICA6IG5vcm1hbGl6ZUFycmF5KG1ldGEpXG4gIGNvbnN0IGlkTWFwID0ga2V5QnkoY29sbGVjdGlvbiwgY2lkQXR0cilcbiAgY29uc3QgbW9kZWxJZHMgPSBpZHMuZmlsdGVyKGlkID0+ICFpc05pbChpZCkgJiYgaWRNYXBbaWRdKVxuICBjb25zdCBpbmRpY2VzID0gbW9kZWxJZHMubWFwKGlkID0+IGNvbGxlY3Rpb24uaW5kZXhPZihpZE1hcFtpZF0pKVxuICByZXR1cm4gaW5kaWNlcy5yZWR1Y2UoKGFjYywgY3VyLCBpKSA9PiB7XG4gICAgY29uc3QgaWQgPSBtb2RlbElkc1tpXVxuICAgIGNvbnN0IG5leHRNb2RlbCA9IHJlZHVjZXIoaWRNYXBbaWRdLCBhY3Rpb24sIGlkKVxuICAgIHJldHVybiBpbW11dGFibGVTcGxpY2UoYWNjLCBjdXIsIDEsIG5leHRNb2RlbClcbiAgfSwgY29sbGVjdGlvbilcbn1cblxuY29uc3QgYmF0Y2ggPSAoY29sbGVjdGlvbiwgcmVkdWNlciwgYWN0aW9ucykgPT4gKFxuICBhY3Rpb25zLnJlZHVjZSgoYWNjLCBjdXIpID0+IHJlZHVjZXIoYWNjLCBjdXIpLCBjb2xsZWN0aW9uKVxuKVxuXG4vKipcbiAqIEluc3BpcmVkIGJ5IHRoZSAobW9zdCBleGNlbGxlbnQpIEJhY2tib25lLkNvbGxlY3Rpb24gQVBJXG4gKiBodHRwOi8vYmFja2JvbmVqcy5vcmcvI0NvbGxlY3Rpb25cbiAqXG4gKiBBY3Rpb24tbWFuYWdlZCBcImNvbGxlY3Rpb25cIiBpbXBsZW1lbnRhdGlvbiBmb3IgY29tbW9uIGNsaWVudC1zaWRlXG4gKiBsaXN0IG9wZXJhdGlvbnMgd2hlbiBkZWFsaW5nIHdpdGggYW4gYXJyYXkgb2YgdW5pcXVlbHkgaWRlbnRpZmlhYmxlXG4gKiBvYmplY3RzLiAgVGhpcyBjYW4gYmUgdXNlZnVsIGZvciBcImxpc3QgYnVpbGRlclwiIGZlYXR1cmVzIG9yIGFueXRoaW5nXG4gKiBlbHNlIHRoYXQgcmVxdWlyZXMgbWFuYWdpbmcgYW4gYXJyYXkgb2Ygb2JqZWN0cyB3LyBhY3Rpb25zLlxuICpcbiAqIEBhbGlhcyBtb2R1bGU6Y29sbGVjdGlvblxuICogQHBhcmFtIHtPYmplY3RbXX0gW2RlZmF1bHRTdGF0ZT1bXV0gaW5pdGlhbCBzdGF0ZSB0byByZXR1cm4sIG51bGwgb3IgZXJyb3JcbiAqIEBwYXJhbSB7e319IFt0eXBlcz17fV0gYWN0aW9uIHR5cGVzIHRvIG1hdGNoIGZvciBwYXlsb2FkIGhpc3RvcnlcbiAqIEBwYXJhbSB7c3RyaW5nfHN5bWJvbH0gdHlwZXMuYWRkIGFkZCBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd8c3ltYm9sfSB0eXBlcy5wdXNoIHB1c2ggYWN0aW9uIHR5cGVcbiAqIEBwYXJhbSB7c3RyaW5nfHN5bWJvbH0gdHlwZXMucG9wIHBvcCBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd8c3ltYm9sfSB0eXBlcy5yZW1vdmUgcmVtb3ZlIGFjdGlvbiB0eXBlXG4gKiBAcGFyYW0ge3N0cmluZ3xzeW1ib2x9IHR5cGVzLmZpbHRlciBmaWx0ZXIgYWN0aW9uIHR5cGVcbiAqIEBwYXJhbSB7c3RyaW5nfHN5bWJvbH0gdHlwZXMucmVqZWN0IHJlamVjdCBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd8c3ltYm9sfSB0eXBlcy5yZXNldCByZXNldCBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd8c3ltYm9sfSB0eXBlcy51bnNoaWZ0IHVuc2hpZnQgYWN0aW9uIHR5cGVcbiAqIEBwYXJhbSB7c3RyaW5nfHN5bWJvbH0gdHlwZXMuc2hpZnQgc2hpZnQgYWN0aW9uIHR5cGVcbiAqIEBwYXJhbSB7c3RyaW5nfHN5bWJvbH0gdHlwZXMucmVkdWNlIHJlZHVjZSBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd8c3ltYm9sfSB0eXBlcy5iYXRjaCBiYXRjaCBhY3Rpb24gdHlwZX1cbiAqIEBwYXJhbSB7e319IFtvcHRpb25zPXt9XSBhZGRpdGlvbmFsIG9wdGlvbnMgZm9yIHJlc3VsdGluZyByZWR1Y2VyXG4gKiBAcGFyYW0ge3N0cmluZ3xzeW1ib2x9IG9wdGlvbnMuaWRBdHRyaWJ1dGUgbW9kZWwgYXR0cmlidXRlIHRvIHVzZSBhcyBwcmVhc3NpZ25lZCBJRFxuICogQHBhcmFtIHtzdHJpbmd8c3ltYm9sfSBvcHRpb25zLmNpZEF0dHJpYnV0ZSBtb2RlbCBhdHRyaWJ1dGUgdG8gdXNlIGFzIGR5bmFtaWMgXCJjbGllbnQgSURcIlxuICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5nZXRNb2RlbFJlZHVjZXIgbWV0aG9kIHRvIGludm9rZSBvbiBtb2RlbChzKSB3aGVuIHByb2Nlc3NpbmcgXCJyZWR1Y2VcIiBhY3Rpb25zXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvcHRpb25zLmdldEZpbHRlckNhbGxiYWNrIGdpdmVuIGFjdGlvbiBwYXlsb2FkLCByZXR1cm5zIGZpbHRlciBjYWxsYmFjayBmdW5jdGlvblxuICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5tZXJnZSBvYmplY3QgbWVyZ2UgbWV0aG9kIGZvciBgYWRkYCByZWR1Y2VyLiBkZWZhdWx0cyB0byBzaGFsbG93IG1lcmdlOiAob2JqLCBzb3VyY2UpID0+IHJlc3VsdFxuICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy51aWQgbWV0aG9kIHRvIG1ha2UgYSB1bmlxdWUgaWQgZm9yIFwiY2lkXCIgZ2VuZXJhdGlvbi4gZGVmYXVsdHMgdG8gc2NvcGVkLCBpbnQgaW5jcmVtZW50b3JcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSByZWR1eCByZWR1Y2VyIGZ1bmN0aW9uXG4gKi9cbmNvbnN0IGNvbGxlY3Rpb25SZWR1Y2VyID0gKGRlZmF1bHRTdGF0ZSA9IFtdLCB7XG4gIGFkZDogYWRkQWN0aW9uLFxuICBwdXNoOiBwdXNoQWN0aW9uLFxuICBwb3A6IHBvcEFjdGlvbixcbiAgcmVtb3ZlOiByZW1vdmVBY3Rpb24sXG4gIGZpbHRlcjogZmlsdGVyQWN0aW9uLFxuICByZWplY3Q6IHJlamVjdEFjdGlvbixcbiAgcmVzZXQ6IHJlc2V0QWN0aW9uLFxuICB1bnNoaWZ0OiB1bnNoaWZ0QWN0aW9uLFxuICBzaGlmdDogc2hpZnRBY3Rpb24sXG4gIHJlZHVjZTogcmVkdWNlQWN0aW9uLFxuICBiYXRjaDogYmF0Y2hBY3Rpb25cbn0gPSB7fSwge1xuICBpZEF0dHJpYnV0ZSA9ICdpZCcsXG4gIGNpZEF0dHJpYnV0ZSA9ICdjaWQnLFxuICBnZXRNb2RlbFJlZHVjZXIgPSBnZXRDb2xsZWN0aW9uTW9kZWxSZWR1Y2VyLFxuICBnZXRGaWx0ZXJDYWxsYmFjayA9IGdldENvbGxlY3Rpb25GaWx0ZXJDYWxsYmFjayxcbiAgbWVyZ2UgPSBkZWZhdWx0TWVyZ2Vcbn0gPSB7fSkgPT4ge1xuICBjb25zdCByZWR1Y2VIYW5kbGVyID0gZ2V0TW9kZWxSZWR1Y2VyKHsgaWRBdHRyaWJ1dGUsIGNpZEF0dHJpYnV0ZSwgbWVyZ2UgfSlcblxuICBjb25zdCByZWR1Y2VyID0gKGNvbGxlY3Rpb24gPSBkZWZhdWx0U3RhdGUsIGFjdGlvbiA9IGVtcHR5QWN0aW9uKCkpID0+IHtcbiAgICBjb25zdCB7IHR5cGUsIHBheWxvYWQsIG1ldGEgfSA9IGFjdGlvblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBhZGRBY3Rpb246IHtcbiAgICAgICAgcmV0dXJuIGFkZChjb2xsZWN0aW9uLCBwYXlsb2FkLCBtZXRhLCBjaWRBdHRyaWJ1dGUsIG1lcmdlKVxuICAgICAgfVxuICAgICAgY2FzZSBwdXNoQWN0aW9uOiB7XG4gICAgICAgIHJldHVybiBwdXNoKGNvbGxlY3Rpb24sIHBheWxvYWQsIG1ldGEsIGNpZEF0dHJpYnV0ZSwgbWVyZ2UpXG4gICAgICB9XG4gICAgICBjYXNlIHBvcEFjdGlvbjoge1xuICAgICAgICByZXR1cm4gcG9wKGNvbGxlY3Rpb24sIHBheWxvYWQpXG4gICAgICB9XG4gICAgICBjYXNlIHJlbW92ZUFjdGlvbjoge1xuICAgICAgICByZXR1cm4gcmVtb3ZlKGNvbGxlY3Rpb24sIHBheWxvYWQsIGNpZEF0dHJpYnV0ZSlcbiAgICAgIH1cbiAgICAgIGNhc2UgZmlsdGVyQWN0aW9uOiB7XG4gICAgICAgIHJldHVybiBmaWx0ZXIoY29sbGVjdGlvbiwgcGF5bG9hZCwgZ2V0RmlsdGVyQ2FsbGJhY2spXG4gICAgICB9XG4gICAgICBjYXNlIHJlamVjdEFjdGlvbjoge1xuICAgICAgICByZXR1cm4gcmVqZWN0KGNvbGxlY3Rpb24sIHBheWxvYWQsIGdldEZpbHRlckNhbGxiYWNrKVxuICAgICAgfVxuICAgICAgY2FzZSByZXNldEFjdGlvbjoge1xuICAgICAgICByZXR1cm4gcmVzZXQocGF5bG9hZClcbiAgICAgIH1cbiAgICAgIGNhc2UgdW5zaGlmdEFjdGlvbjoge1xuICAgICAgICByZXR1cm4gdW5zaGlmdChjb2xsZWN0aW9uLCBwYXlsb2FkLCBtZXRhIHx8IHt9LCBjaWRBdHRyaWJ1dGUpXG4gICAgICB9XG4gICAgICBjYXNlIHNoaWZ0QWN0aW9uOiB7XG4gICAgICAgIHJldHVybiBzaGlmdChjb2xsZWN0aW9uLCBwYXlsb2FkKVxuICAgICAgfVxuICAgICAgY2FzZSByZWR1Y2VBY3Rpb246IHtcbiAgICAgICAgcmV0dXJuIHJlZHVjZShjb2xsZWN0aW9uLCBhY3Rpb24sIGNpZEF0dHJpYnV0ZSwgcmVkdWNlSGFuZGxlcilcbiAgICAgIH1cbiAgICAgIGNhc2UgYmF0Y2hBY3Rpb246IHtcbiAgICAgICAgcmV0dXJuIGJhdGNoKGNvbGxlY3Rpb24sIHJlZHVjZXIsIG5vcm1hbGl6ZUFycmF5KHBheWxvYWQpKVxuICAgICAgfVxuICAgICAgLy8gVE9ETzogQmFja2JvbmUuQ29sbGVjdGlvbiBcInNldFwiIChcInNtYXJ0XCIgbWVyZ2Ugb2YgbW9kZWxzKT9cbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb25cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlZHVjZXJcbn1cblxuZXhwb3J0IGRlZmF1bHQgY29sbGVjdGlvblJlZHVjZXJcbiIsIi8qKlxuICogbW9kdWxlIGZvciBtYW5hZ2luZyBhbiBhcnJheSBvZiBvYmplY3RzIGluIGEgcmVkdXggc3RvcmVcbiAqIGluc3BpcmVkIGJ5IHRoZSBCYWNrYm9uZS5Db2xsZWN0aW9uIEFQSS5cbiAqIEBtb2R1bGUgY29sbGVjdGlvblxuICovXG5leHBvcnQge1xuICBkZWZhdWx0IGFzIGNvbGxlY3Rpb25BY3Rpb25zLFxuICBwcm9jZXNzQ29sbGVjdGlvbk1vZGVsXG59IGZyb20gJy4vY29sbGVjdGlvbkFjdGlvbnMnXG5leHBvcnQge1xuICBkZWZhdWx0IGFzIGNvbGxlY3Rpb25BY3Rpb25UeXBlcyxcbiAgQ09MTEVDVElPTl9UWVBFU1xufSBmcm9tICcuL2NvbGxlY3Rpb25BY3Rpb25UeXBlcydcbmV4cG9ydCB7XG4gIGRlZmF1bHQgYXMgY29sbGVjdGlvblJlZHVjZXIsXG4gIGdldENvbGxlY3Rpb25GaWx0ZXJDYWxsYmFjayxcbiAgZ2V0Q29sbGVjdGlvbk1vZGVsUmVkdWNlclxufSBmcm9tICcuL2NvbGxlY3Rpb24nXG4iLCJpbXBvcnQgeyBpc09iamVjdCB9IGZyb20gJy4uL3V0aWxzJ1xuXG4vKipcbiAqIGNyZWF0ZXMgYSBtYXAgb2YgXCJkaWN0aW9uYXJ5XCIgYWN0aW9uIGNyZWF0b3JzLlxuICogcHJvZHVjZXMgYW4gb2JqZWN0IHdpdGggc2FtZSBwcm9wZXJ0aWVzIGFzIGEgZGljdGlvbmFyeUFjdGlvblR5cGVzIG9iamVjdCxcbiAqIGJ1dCB3aXRoIGNvb3Jlc3BvbmRpbmcgYWN0aW9uIGNyZWF0b3IgZnVuY3Rpb25zLlxuICpcbiAqIEBhbGlhcyBtb2R1bGU6ZGljdGlvbmFyeVxuICogQHBhcmFtIHt7fX0gW3R5cGVzXSBkaWN0aW9uYXJ5QWN0aW9uVHlwZXMgb2JqZWN0XG4gKiBAcmV0dXJuIHt7fX0gbWFwIG9mIFwiZGljdGlvbmFyeVwiIGFjdGlvbiBpZGVudGlmaWVycyB0byBhY3Rpb24gY3JlYXRvcnNcbiAqL1xuY29uc3QgZGljdGlvbmFyeUFjdGlvbnMgPSAodHlwZXMpID0+IHtcbiAgY29uc3QgdXBkYXRlVmFsdWUgPSAoaWRzLCB2YWx1ZSwgbWV0YSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlcy51cGRhdGVWYWx1ZSxcbiAgICBwYXlsb2FkOiB2YWx1ZSxcbiAgICBtZXRhOiBpc09iamVjdChtZXRhKSA/IHsgLi4ubWV0YSwgaWRzIH0gOiBpZHNcbiAgfSlcblxuICBjb25zdCBtZXJnZSA9IChkaWN0LCBtZXRhKSA9PiAoe1xuICAgIHR5cGU6IHR5cGVzLm1lcmdlLFxuICAgIHBheWxvYWQ6IGRpY3QsXG4gICAgbWV0YVxuICB9KVxuXG4gIGNvbnN0IG1lcmdlVmFsdWUgPSAoaWRzLCB2YWx1ZSwgbWV0YSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlcy5tZXJnZVZhbHVlLFxuICAgIHBheWxvYWQ6IHZhbHVlLFxuICAgIG1ldGE6IGlzT2JqZWN0KG1ldGEpID8geyAuLi5tZXRhLCBpZHMgfSA6IGlkc1xuICB9KVxuXG4gIGNvbnN0IHJlbW92ZSA9IChpZHMsIG1ldGEpID0+ICh7XG4gICAgdHlwZTogdHlwZXMucmVtb3ZlLFxuICAgIHBheWxvYWQ6IGlkcyxcbiAgICBtZXRhXG4gIH0pXG5cbiAgY29uc3QgZmlsdGVyID0gKHBheWxvYWQsIG1ldGEpID0+ICh7XG4gICAgdHlwZTogdHlwZXMuZmlsdGVyLFxuICAgIHBheWxvYWQsXG4gICAgbWV0YVxuICB9KVxuXG4gIGNvbnN0IHJlamVjdCA9IChwYXlsb2FkLCBtZXRhKSA9PiAoe1xuICAgIHR5cGU6IHR5cGVzLnJlamVjdCxcbiAgICBwYXlsb2FkLFxuICAgIG1ldGFcbiAgfSlcblxuICBjb25zdCByZXNldCA9IChwYXlsb2FkLCBtZXRhKSA9PiAoe1xuICAgIHR5cGU6IHR5cGVzLnJlc2V0LFxuICAgIHBheWxvYWQsXG4gICAgbWV0YVxuICB9KVxuXG4gIGNvbnN0IHJlZHVjZSA9IChwYXlsb2FkLCBtZXRhKSA9PiAoe1xuICAgIHR5cGU6IHR5cGVzLnJlZHVjZSxcbiAgICBwYXlsb2FkLFxuICAgIG1ldGFcbiAgfSlcblxuICBjb25zdCBiYXRjaCA9IChhY3Rpb25zLCBtZXRhKSA9PiAoe1xuICAgIHR5cGU6IHR5cGVzLmJhdGNoLFxuICAgIHBheWxvYWQ6IGFjdGlvbnMsXG4gICAgbWV0YVxuICB9KVxuXG4gIHJldHVybiB7XG4gICAgdXBkYXRlVmFsdWUsXG4gICAgbWVyZ2UsXG4gICAgbWVyZ2VWYWx1ZSxcbiAgICByZW1vdmUsXG4gICAgZmlsdGVyLFxuICAgIHJlamVjdCxcbiAgICByZXNldCxcbiAgICByZWR1Y2UsXG4gICAgYmF0Y2hcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkaWN0aW9uYXJ5QWN0aW9uc1xuIiwiaW1wb3J0IHsgbWFwVmFsdWVzIH0gZnJvbSAnLi4vdXRpbHMnXG5cbi8qKlxuICogYWN0aW9uIHR5cGVzIGZvciBcImRpY3Rpb25hcnlSZWR1Y2VyXCJcbiAqIEBhbGlhcyBtb2R1bGU6ZGljdGlvbmFyeVxuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7e319XG4gKiBAcHJvcCB7c3RyaW5nfSB1cGRhdGVWYWx1ZVxuICogQHByb3Age3N0cmluZ30gbWVyZ2VcbiAqIEBwcm9wIHtzdHJpbmd9IG1lcmdlVmFsdWVcbiAqIEBwcm9wIHtzdHJpbmd9IHJlbW92ZVxuICogQHByb3Age3N0cmluZ30gZmlsdGVyXG4gKiBAcHJvcCB7c3RyaW5nfSByZWplY3RcbiAqIEBwcm9wIHtzdHJpbmd9IHJlc2V0XG4gKiBAcHJvcCB7c3RyaW5nfSByZWR1Y2VcbiAqIEBwcm9wIHtzdHJpbmd9IGJhdGNoXG4gKi9cbmV4cG9ydCBjb25zdCBESUNUSU9OQVJZX1RZUEVTID0gT2JqZWN0LmZyZWV6ZSh7XG4gIHVwZGF0ZVZhbHVlOiAndXBkYXRlVmFsdWUnLFxuICBtZXJnZTogJ21lcmdlJyxcbiAgbWVyZ2VWYWx1ZTogJ21lcmdlVmFsdWUnLFxuICByZW1vdmU6ICdyZW1vdmUnLFxuICBmaWx0ZXI6ICdmaWx0ZXInLFxuICByZWplY3Q6ICdyZWplY3QnLFxuICByZXNldDogJ3Jlc2V0JyxcbiAgcmVkdWNlOiAncmVkdWNlJyxcbiAgYmF0Y2g6ICdiYXRjaCdcbn0pXG5cbi8qKlxuICogY3JlYXRlcyBhIG1hcCBvZiBcImRpY3Rpb25hcnlcIiBhY3Rpb24gdHlwZXMuXG4gKiBwcm9kdWNlcyBhbiBvYmplY3QgaW4gdGhlIGZvcm0gZXhwZWN0ZWQgYnkgdGhlIGBhY3Rpb25UeXBlc2AgYXJndW1lbnRcbiAqIG9mIHRoZSBgZGljdGlvbmFyeVJlZHVjZXJgIG1ldGhvZC4gIGNhbiBiZSBnaXZlbiBhIGBnZXRUeXBlYCBhcmd1bWVudFxuICogdG8gY3VzdG9taXplIHRoZSBhY3Rpb24gdHlwZSB2YWx1ZXMsIHBlciBhY3Rpb24uXG4gKlxuICogQGFsaWFzIG1vZHVsZTpkaWN0aW9uYXJ5XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZ2V0VHlwZV0gYXNzaWducyBwcm9wZXJ0eSB2YWx1ZXMgdG8gcmVzdWx0aW5nIG9iamVjdFxuICogQHJldHVybiB7e319IG1hcCBvZiBcImRpY3Rpb25hcnlcIiBhY3Rpb24gdHlwZXMgdG8gc3RyaW5nfHN5bWJvbCB2YWx1ZXNcbiAqL1xuY29uc3QgZGljdGlvbmFyeUFjdGlvblR5cGVzID0gKGdldFR5cGUpID0+IG1hcFZhbHVlcyhESUNUSU9OQVJZX1RZUEVTLCBnZXRUeXBlKVxuXG5leHBvcnQgZGVmYXVsdCBkaWN0aW9uYXJ5QWN0aW9uVHlwZXNcbiIsImltcG9ydCB7XG4gIGlzTmlsLFxuICBpc05vbkFycmF5T2JqZWN0LFxuICBtYXRjaGVzT2JqZWN0LFxuICBub3JtYWxpemVBcnJheSxcbiAgZW1wdHlBY3Rpb24sXG4gIGZpbmRcbn0gZnJvbSAnLi4vdXRpbHMnXG5cbmNvbnN0IHsgaXNBcnJheSB9ID0gQXJyYXlcblxuY29uc3Qgbm9ybWFsaXplQXJyYXlQYXlsb2FkID0gKHBheWxvYWQpID0+IG5vcm1hbGl6ZUFycmF5KHBheWxvYWQpLmZpbHRlcih2ID0+ICFpc05pbCh2KSlcblxuY29uc3QgZGVmYXVsdE1lcmdlID0gKGRlc3QsIHNvdXJjZSkgPT4ge1xuICBpZiAoaXNBcnJheShkZXN0KSAmJiBpc0FycmF5KHNvdXJjZSkpIHtcbiAgICByZXR1cm4gWyAuLi5kZXN0LCAuLi5zb3VyY2UgXVxuICB9XG4gIGlmIChpc05vbkFycmF5T2JqZWN0KGRlc3QpICYmIGlzTm9uQXJyYXlPYmplY3Qoc291cmNlKSkge1xuICAgIHJldHVybiB7IC4uLmRlc3QsIC4uLnNvdXJjZSB9XG4gIH1cbiAgcmV0dXJuIHNvdXJjZVxufVxuXG4vKipcbiAqIERlZmF1bHQgdmFsdWUgZm9yIGRpY3Rpb25hcnlSZWR1Y2VyJ3MgYGdldEZpbHRlckNhbGxiYWNrYCBvcHRpb25cbiAqIEBhbGlhcyBtb2R1bGU6ZGljdGlvbmFyeVxuICogQHBhcmFtIHsqfSBwYXlsb2FkIGEgZmlsdGVyIGFjdGlvbidzIHBheWxvYWRcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gQXJyYXkuZmlsdGVyIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjb25zdCBnZXREaWN0aW9uYXJ5RmlsdGVyQ2FsbGJhY2sgPSAocGF5bG9hZCkgPT4gKHZhbHVlKSA9PiB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSAmJiBpc0FycmF5KHBheWxvYWQpKSB7XG4gICAgcmV0dXJuIHZhbHVlLmxlbmd0aCA9PT0gcGF5bG9hZC5sZW5ndGggJiYgIWZpbmQodmFsdWUsIChlbHQsIGkpID0+IGVsdCAhPT0gcGF5bG9hZFtpXSlcbiAgfVxuICBpZiAoaXNOb25BcnJheU9iamVjdCh2YWx1ZSkgJiYgaXNOb25BcnJheU9iamVjdChwYXlsb2FkKSkge1xuICAgIHJldHVybiBtYXRjaGVzT2JqZWN0KHZhbHVlLCBwYXlsb2FkKVxuICB9XG4gIC8vIFRPRE86IGhhbmRsZSBtb3JlIFwiY29tbW9uXCIgZmlsdGVyIGNhc2VzIGluIGRlZmF1bHQgZmlsdGVyIGNhbGxiYWNrP1xuICByZXR1cm4gcGF5bG9hZCA9PT0gdmFsdWVcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHZhbHVlIGZvciBkaWN0aW9uYXJ5UmVkdWNlcidzIGBnZXRWYWx1ZVJlZHVjZXJgIG9wdGlvblxuICogQGFsaWFzIG1vZHVsZTpkaWN0aW9uYXJ5XG4gKiBAcGFyYW0ge3t9fSBvcHRpb25zIHN1YnNldCBvZiBkaWN0aW9uYXJ5UmVkdWNlciBvcHRpb25zLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5tZXJnZSB2YWx1ZSBtZXJnZSBpbXBsZW1lbnRhdGlvbiBmb3IgZHVwbGljYXRlIGtleXMgaW4gZGljdFxuICogQHJldHVybnMge2Z1bmN0aW9ufSBcInJlZHV4LXN0eWxlXCIgcmVkdWNlcjsgZ2l2ZW4gYSB2YWx1ZSBhbmQgJ3JlZHVjZScgYWN0aW9uLCByZXR1cm5zIG5leHQgdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IGdldERpY3Rpb25hcnlWYWx1ZVJlZHVjZXIgPSAoeyBtZXJnZSB9KSA9PiAodmFsLCB7IHBheWxvYWQgfSwgaWQpID0+IG1lcmdlKHZhbCwgcGF5bG9hZClcblxuY29uc3QgdXBkYXRlVmFsdWUgPSAoZGljdCwgcGF5bG9hZCwgbWV0YSkgPT4ge1xuICBjb25zdCBpZHMgPSBpc05vbkFycmF5T2JqZWN0KG1ldGEpXG4gICAgPyBub3JtYWxpemVBcnJheVBheWxvYWQobWV0YS5pZHMpXG4gICAgOiBub3JtYWxpemVBcnJheVBheWxvYWQobWV0YSlcbiAgcmV0dXJuIGlkcy5yZWR1Y2UoKGFjYywgaWQpID0+ICh7IC4uLmFjYywgW2lkXTogcGF5bG9hZCB9KSwgZGljdClcbn1cblxuY29uc3QgbWVyZ2UgPSAoZGljdCwgcGF5bG9hZCwgbWVyZ2VGbikgPT4ge1xuICBjb25zdCBpZHMgPSBPYmplY3Qua2V5cyhwYXlsb2FkIHx8IHt9KS5maWx0ZXIodiA9PiAhaXNOaWwodikpXG4gIHJldHVybiBpZHMucmVkdWNlKChhY2MsIGlkKSA9PiAoe1xuICAgIC4uLmFjYyxcbiAgICBbaWRdOiBtZXJnZUZuKGFjY1tpZF0sIHBheWxvYWRbaWRdKVxuICB9KSwgZGljdClcbn1cblxuY29uc3QgbWVyZ2VWYWx1ZSA9IChkaWN0LCBwYXlsb2FkLCBtZXRhLCBtZXJnZUZuKSA9PiB7XG4gIGNvbnN0IGlkcyA9IGlzTm9uQXJyYXlPYmplY3QobWV0YSlcbiAgICA/IG5vcm1hbGl6ZUFycmF5UGF5bG9hZChtZXRhLmlkcylcbiAgICA6IG5vcm1hbGl6ZUFycmF5UGF5bG9hZChtZXRhKVxuICByZXR1cm4gaWRzLnJlZHVjZSgoYWNjLCBpZCkgPT4gKHtcbiAgICAuLi5hY2MsXG4gICAgW2lkXTogbWVyZ2VGbihhY2NbaWRdLCBwYXlsb2FkKVxuICB9KSwgZGljdClcbn1cblxuY29uc3QgcmVtb3ZlID0gKGRpY3QsIGlkcykgPT4gaWRzLnJlZHVjZSgoYWNjLCBpZCkgPT4ge1xuICBjb25zdCB7IFtpZF06IF8sIC4uLnJlc3QgfSA9IGFjY1xuICByZXR1cm4gcmVzdFxufSwgZGljdClcblxuY29uc3QgZmlsdGVyID0gKGRpY3QsIHBheWxvYWQsIGdldEZpbHRlckNhbGxiYWNrKSA9PiB7XG4gIGNvbnN0IGlkcyA9IE9iamVjdC5rZXlzKGRpY3QpXG4gIHJldHVybiBpZHMucmVkdWNlKChhY2MsIGlkKSA9PiB7XG4gICAgaWYgKCFnZXRGaWx0ZXJDYWxsYmFjayhwYXlsb2FkKShhY2NbaWRdLCBpZCwgYWNjKSkge1xuICAgICAgY29uc3QgeyBbaWRdOiBfLCAuLi5yZXN0IH0gPSBhY2NcbiAgICAgIHJldHVybiByZXN0XG4gICAgfVxuICAgIHJldHVybiBhY2NcbiAgfSwgZGljdClcbn1cblxuY29uc3QgcmVqZWN0ID0gKGRpY3QsIHBheWxvYWQsIGdldEZpbHRlckNhbGxiYWNrKSA9PiB7XG4gIGNvbnN0IGludmVydGVkQ2FsbGJhY2sgPSAoLi4uYSkgPT4gKC4uLmIpID0+ICFnZXRGaWx0ZXJDYWxsYmFjayguLi5hKSguLi5iKVxuICByZXR1cm4gZmlsdGVyKGRpY3QsIHBheWxvYWQsIGludmVydGVkQ2FsbGJhY2spXG59XG5cbmNvbnN0IHJlZHVjZSA9IChkaWN0LCBhY3Rpb24sIHJlZHVjZXIpID0+IHtcbiAgY29uc3QgeyBtZXRhIH0gPSBhY3Rpb25cbiAgY29uc3Qgbm9ybWFsaXplZE1ldGEgPSBpc05vbkFycmF5T2JqZWN0KG1ldGEpXG4gICAgPyBub3JtYWxpemVBcnJheVBheWxvYWQobWV0YS5pZHMpXG4gICAgOiBub3JtYWxpemVBcnJheVBheWxvYWQobWV0YSlcbiAgY29uc3QgcmVhbElkcyA9IG5vcm1hbGl6ZWRNZXRhLmZpbHRlcihpZCA9PiAhaXNOaWwoZGljdFtpZF0pKVxuICBjb25zdCBpZHMgPSByZWFsSWRzLmxlbmd0aCA/IHJlYWxJZHMgOiBPYmplY3Qua2V5cyhkaWN0KVxuICByZXR1cm4gaWRzLnJlZHVjZSgoYWNjLCBpZCkgPT4gKHtcbiAgICAuLi5hY2MsXG4gICAgW2lkXTogcmVkdWNlcihkaWN0W2lkXSwgYWN0aW9uLCBpZClcbiAgfSksIGRpY3QpXG59XG5cbmNvbnN0IGJhdGNoID0gKGRpY3QsIHJlZHVjZXIsIGFjdGlvbnMpID0+IChcbiAgYWN0aW9ucy5yZWR1Y2UoKGFjYywgY3VyKSA9PiByZWR1Y2VyKGFjYywgY3VyKSwgZGljdClcbilcblxuLyoqXG4gKiBHZW5lcmljIFwiZGljdGlvbmFyeVwiIGltcGxlbWVudGF0aW9uIGZvciByZWR1eC5cbiAqIEFsbG93cyBmb3IgYWN0aW9uIG1hbmFnZWQgbXV0YXRpb25zIG9mIGFuIGFyYml0cmFyeSBzZXQgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICogVXNlZnVsIGZvciBrZWVwaW5nIHRyYWNrIG9mIGNsaWVudC1zaWRlIHN0YXRlIGZvciBtdWx0aXBsZSBlbnRpdGllcyBieSBrZXksXG4gKiBzdWNoIGFzIG1hcHBpbmcgb3RoZXIgY2xpZW50IHN0YXRlIHRvIFNlcnZlci1BUEkgbG9hZGVkIGVudGl0aWVzIGJ5IElELlxuICpcbiAqIEBhbGlhcyBtb2R1bGU6ZGljdGlvbmFyeVxuICogQHBhcmFtIHt7fX0gZGVmYXVsdFN0YXRlXG4gKiBAcGFyYW0ge3t9fSBbdHlwZXM9e31dIGFjdGlvbiB0eXBlcyB0byBtYXRjaCBmb3IgcGF5bG9hZCBoaXN0b3J5XG4gKiBAcGFyYW0ge3N0cmluZ3xzeW1ib2x9IHR5cGVzLnVwZGF0ZVZhbHVlIHVwZGF0ZSBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd8c3ltYm9sfSB0eXBlcy5tZXJnZSBtZXJnZSBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd8c3ltYm9sfSB0eXBlcy5tZXJnZVZhbHVlIG1lcmdlVmFsdWUgYWN0aW9uIHR5cGVcbiAqIEBwYXJhbSB7c3RyaW5nfHN5bWJvbH0gdHlwZXMucmVtb3ZlIHJlbW92ZSBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd8c3ltYm9sfSB0eXBlcy5maWx0ZXIgZmlsdGVyIGFjdGlvbiB0eXBlXG4gKiBAcGFyYW0ge3N0cmluZ3xzeW1ib2x9IHR5cGVzLnJlamVjdCByZWplY3QgYWN0aW9uIHR5cGVcbiAqIEBwYXJhbSB7c3RyaW5nfHN5bWJvbH0gdHlwZXMucmVzZXQgcmVzZXQgYWN0aW9uIHR5cGVcbiAqIEBwYXJhbSB7c3RyaW5nfHN5bWJvbH0gdHlwZXMucmVkdWNlIHJlZHVjZSBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd8c3ltYm9sfSB0eXBlcy5iYXRjaCBiYXRjaCBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHt7fX0gW29wdGlvbnM9e31dIGFkZGl0aW9uYWwgb3B0aW9ucyBmb3IgcmVzdWx0aW5nIHJlZHVjZXJcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMuZ2V0VmFsdWVSZWR1Y2VyIG1ldGhvZCB0byBpbnZva2Ugb24gdmFsdWUocykgd2hlbiBwcm9jZXNzaW5nIFwicmVkdWNlXCIgYWN0aW9uc1xuICogQHBhcmFtIHtmdW5jdGlvbn0gb3B0aW9ucy5nZXRGaWx0ZXJDYWxsYmFjayBnaXZlbiBhY3Rpb24gcGF5bG9hZCwgcmV0dXJucyBmaWx0ZXIgY2FsbGJhY2sgZnVuY3Rpb25cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG9wdGlvbnMubWVyZ2UgbWVyZ2UgbWV0aG9kIGZvciByZWR1Y2Vycy4gc2VlIGBkZWZhdWx0TWVyZ2VgXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IHJlZHV4IHJlZHVjZXIgZnVuY3Rpb25cbiAqL1xuY29uc3QgZGljdGlvbmFyeVJlZHVjZXIgPSAoZGVmYXVsdFN0YXRlID0ge30sIHtcbiAgdXBkYXRlVmFsdWU6IHVwZGF0ZVZhbHVlQWN0aW9uLFxuICBtZXJnZTogbWVyZ2VBY3Rpb24sXG4gIG1lcmdlVmFsdWU6IG1lcmdlVmFsdWVBY3Rpb24sXG4gIHJlbW92ZTogcmVtb3ZlQWN0aW9uLFxuICBmaWx0ZXI6IGZpbHRlckFjdGlvbixcbiAgcmVqZWN0OiByZWplY3RBY3Rpb24sXG4gIHJlc2V0OiByZXNldEFjdGlvbixcbiAgcmVkdWNlOiByZWR1Y2VBY3Rpb24sXG4gIGJhdGNoOiBiYXRjaEFjdGlvblxufSA9IHt9LCB7XG4gIGdldFZhbHVlUmVkdWNlciA9IGdldERpY3Rpb25hcnlWYWx1ZVJlZHVjZXIsXG4gIGdldEZpbHRlckNhbGxiYWNrID0gZ2V0RGljdGlvbmFyeUZpbHRlckNhbGxiYWNrLFxuICBtZXJnZTogbWVyZ2VGbiA9IGRlZmF1bHRNZXJnZVxufSA9IHt9KSA9PiB7XG4gIGNvbnN0IHJlZHVjZUhhbmRsZXIgPSBnZXRWYWx1ZVJlZHVjZXIoeyBtZXJnZTogbWVyZ2VGbiB9KVxuICBjb25zdCByZWR1Y2VyID0gKGRpY3QgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbiA9IGVtcHR5QWN0aW9uKCkpID0+IHtcbiAgICBjb25zdCB7IHR5cGUsIHBheWxvYWQsIG1ldGEgfSA9IGFjdGlvblxuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSB1cGRhdGVWYWx1ZUFjdGlvbjoge1xuICAgICAgICAvLyB0YWtlIG5ldyBcInZhbHVlXCIsIG1lcmdlIG9udG8gcHJldiB2YWx1ZShzKSBpbiBkaWN0IG9yIGFkZCBuZXcgS3ZQKHMpLCBhbmQgcmV0dXJuIG5ldyBzdGF0ZVxuICAgICAgICByZXR1cm4gdXBkYXRlVmFsdWUoZGljdCwgcGF5bG9hZCwgbWV0YSlcbiAgICAgIH1cbiAgICAgIGNhc2UgbWVyZ2VBY3Rpb246IHtcbiAgICAgICAgLy8gdGFrZSBuZXcgXCJkaWN0XCIsIG1lcmdlIG9udG8gcHJldiBkaWN0LCBhbmQgcmV0dXJuIG5ldyBzdGF0ZVxuICAgICAgICByZXR1cm4gbWVyZ2UoZGljdCwgcGF5bG9hZCwgbWVyZ2VGbilcbiAgICAgIH1cbiAgICAgIGNhc2UgbWVyZ2VWYWx1ZUFjdGlvbjoge1xuICAgICAgICByZXR1cm4gbWVyZ2VWYWx1ZShkaWN0LCBwYXlsb2FkLCBtZXRhLCBtZXJnZUZuKVxuICAgICAgfVxuICAgICAgY2FzZSByZW1vdmVBY3Rpb246IHtcbiAgICAgICAgLy8gcmVtb3ZlIEt2UChzKSBmcm9tIFwiZGljdFwiIGJ5IFwia2V5KHMpXCJcbiAgICAgICAgcmV0dXJuIHJlbW92ZShkaWN0LCBub3JtYWxpemVBcnJheVBheWxvYWQocGF5bG9hZCkpXG4gICAgICB9XG4gICAgICBjYXNlIGZpbHRlckFjdGlvbjoge1xuICAgICAgICAvLyByZW1vdmUgS3ZQKHMpIGZyb20gXCJkaWN0XCIgYnkgZmlsdGVyQ2FsbGJhY2sgY29uZGl0aW9uXG4gICAgICAgIHJldHVybiBmaWx0ZXIoZGljdCwgcGF5bG9hZCwgZ2V0RmlsdGVyQ2FsbGJhY2spXG4gICAgICB9XG4gICAgICBjYXNlIHJlamVjdEFjdGlvbjoge1xuICAgICAgICAvLyBpbnZlcnNlIG9mIGZpbHRlckFjdGlvblxuICAgICAgICByZXR1cm4gcmVqZWN0KGRpY3QsIHBheWxvYWQsIGdldEZpbHRlckNhbGxiYWNrKVxuICAgICAgfVxuICAgICAgY2FzZSByZXNldEFjdGlvbjoge1xuICAgICAgICAvLyByZXNldCBcImRpY3RcIiB0byBkZWZhdWx0IHN0YXRlLCBvciB0byBwcm92aWRlZCBuZXcgXCJkaWN0XCJcbiAgICAgICAgcmV0dXJuIG1lcmdlKGRlZmF1bHRTdGF0ZSwgcGF5bG9hZCB8fCBkZWZhdWx0U3RhdGUsIG1lcmdlRm4pXG4gICAgICB9XG4gICAgICBjYXNlIHJlZHVjZUFjdGlvbjoge1xuICAgICAgICAvLyBpbnZva2UgcmVkdWNlSGFuZGxlciBvbiBpdGVtIHZhbHVlKHMpIGluIFwiZGljdFwiIGFuZCByZXR1cm4gbmV3IHN0YXRlIGZvciBlYWNoXG4gICAgICAgIHJldHVybiByZWR1Y2UoZGljdCwgYWN0aW9uLCByZWR1Y2VIYW5kbGVyKVxuICAgICAgfVxuICAgICAgY2FzZSBiYXRjaEFjdGlvbjoge1xuICAgICAgICAvLyBncm91cCB0b2dldGhlciBcImRpY3Rpb25hcnlcIiBhY3Rpb25zIGludG8gYSBzaW5nbGUgYWN0aW9uXG4gICAgICAgIHJldHVybiBiYXRjaChkaWN0LCByZWR1Y2VyLCBub3JtYWxpemVBcnJheVBheWxvYWQocGF5bG9hZCkpXG4gICAgICB9XG4gICAgICBkZWZhdWx0OiByZXR1cm4gZGljdFxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVkdWNlclxufVxuXG5leHBvcnQgZGVmYXVsdCBkaWN0aW9uYXJ5UmVkdWNlclxuIiwiLyoqXG4gKiBtb2R1bGUgZm9yIG1hbmFnaW5nIGEgZGljdGlvbmFyeSBvZiBrZXkvdmFsdWUgcGFpcnMgaW4gYSByZWR1eCBzdG9yZVxuICogQG1vZHVsZSBkaWN0aW9uYXJ5XG4gKi9cbmV4cG9ydCB7IGRlZmF1bHQgYXMgZGljdGlvbmFyeUFjdGlvbnMgfSBmcm9tICcuL2RpY3Rpb25hcnlBY3Rpb25zJ1xuZXhwb3J0IHtcbiAgZGVmYXVsdCBhcyBkaWN0aW9uYXJ5QWN0aW9uVHlwZXMsXG4gIERJQ1RJT05BUllfVFlQRVNcbn0gZnJvbSAnLi9kaWN0aW9uYXJ5QWN0aW9uVHlwZXMnXG5leHBvcnQge1xuICBkZWZhdWx0IGFzIGRpY3Rpb25hcnlSZWR1Y2VyLFxuICBnZXREaWN0aW9uYXJ5RmlsdGVyQ2FsbGJhY2ssXG4gIGdldERpY3Rpb25hcnlWYWx1ZVJlZHVjZXJcbn0gZnJvbSAnLi9kaWN0aW9uYXJ5J1xuIiwiLyoqXG4gKiBjcmVhdGVzIGEgbWFwIG9mIFwic3RhY2tcIiBhY3Rpb24gY3JlYXRvcnMuXG4gKiBwcm9kdWNlcyBhbiBvYmplY3Qgd2l0aCBzYW1lIHByb3BlcnRpZXMgYXMgYSBzdGFja0FjdGlvblR5cGVzIG9iamVjdCxcbiAqIGJ1dCB3aXRoIGNvb3Jlc3BvbmRpbmcgYWN0aW9uIGNyZWF0b3IgZnVuY3Rpb25zLlxuICpcbiAqIEBhbGlhcyBtb2R1bGU6c3RhY2tcbiAqIEBwYXJhbSB7e319IFt0eXBlc10gc3RhY2tBY3Rpb25UeXBlcyBvYmplY3RcbiAqIEByZXR1cm4ge3t9fSBtYXAgb2YgXCJzdGFja1wiIGFjdGlvbiBpZGVudGlmaWVycyB0byBhY3Rpb24gY3JlYXRvcnNcbiAqL1xuY29uc3Qgc3RhY2tBY3Rpb25zID0gKHR5cGVzKSA9PiB7XG4gIGNvbnN0IHB1c2ggPSAodmFsdWUsIG1ldGEpID0+ICh7XG4gICAgdHlwZTogdHlwZXMucHVzaCxcbiAgICBwYXlsb2FkOiB2YWx1ZSxcbiAgICBtZXRhXG4gIH0pXG5cbiAgY29uc3QgcG9wID0gKGNvdW50LCBtZXRhKSA9PiAoe1xuICAgIHR5cGU6IHR5cGVzLnBvcCxcbiAgICBwYXlsb2FkOiBjb3VudCxcbiAgICBtZXRhXG4gIH0pXG5cbiAgY29uc3QgcmVwbGFjZSA9ICh2YWx1ZSwgbWV0YSkgPT4gKHtcbiAgICB0eXBlOiB0eXBlcy5yZXBsYWNlLFxuICAgIHBheWxvYWQ6IHZhbHVlLFxuICAgIG1ldGFcbiAgfSlcblxuICBjb25zdCByZW1vdmUgPSAodmFsdWUsIG1ldGEpID0+ICh7XG4gICAgdHlwZTogdHlwZXMucmVtb3ZlLFxuICAgIHBheWxvYWQ6IHZhbHVlLFxuICAgIG1ldGFcbiAgfSlcblxuICBjb25zdCBjbGVhciA9IChtZXRhKSA9PiAoe1xuICAgIHR5cGU6IHR5cGVzLmNsZWFyLFxuICAgIG1ldGFcbiAgfSlcblxuICAvLyBUT0RPOiBzdXBwb3J0IFwiYmF0Y2hcIiBhbmQvb3IgXCJyZWR1Y2VcIiBhY3Rpb25zIGZvciBzdGFjayByZWR1Y2VyP1xuXG4gIHJldHVybiB7XG4gICAgcHVzaCxcbiAgICBwb3AsXG4gICAgcmVwbGFjZSxcbiAgICByZW1vdmUsXG4gICAgY2xlYXJcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja0FjdGlvbnNcbiIsImltcG9ydCB7IG1hcFZhbHVlcyB9IGZyb20gJy4uL3V0aWxzJ1xuXG4vKipcbiAqIGFjdGlvbiB0eXBlcyBmb3IgXCJzdGFja1JlZHVjZXJcIlxuICogQGFsaWFzIG1vZHVsZTpzdGFja1xuICogQGNvbnN0YW50XG4gKiBAdHlwZSB7e319XG4gKiBAcHJvcCB7c3RyaW5nfSBwdXNoXG4gKiBAcHJvcCB7c3RyaW5nfSBwb3BcbiAqIEBwcm9wIHtzdHJpbmd9IHJlcGxhY2VcbiAqIEBwcm9wIHtzdHJpbmd9IHJlbW92ZVxuICogQHByb3Age3N0cmluZ30gY2xlYXJcbiAqL1xuZXhwb3J0IGNvbnN0IFNUQUNLX1RZUEVTID0gT2JqZWN0LmZyZWV6ZSh7XG4gIHB1c2g6ICdwdXNoJyxcbiAgcG9wOiAncG9wJyxcbiAgcmVwbGFjZTogJ3JlcGxhY2UnLFxuICByZW1vdmU6ICdyZW1vdmUnLFxuICBjbGVhcjogJ2NsZWFyJ1xufSlcblxuLyoqXG4gKiBjcmVhdGVzIGEgbWFwIG9mIFwic3RhY2tcIiBhY3Rpb24gdHlwZXMuXG4gKiBwcm9kdWNlcyBhbiBvYmplY3QgaW4gdGhlIGZvcm0gZXhwZWN0ZWQgYnkgdGhlIGBhY3Rpb25UeXBlc2AgYXJndW1lbnRcbiAqIG9mIHRoZSBgc3RhY2tSZWR1Y2VyYCBtZXRob2QuICBjYW4gYmUgZ2l2ZW4gYSBgZ2V0VHlwZWAgYXJndW1lbnRcbiAqIHRvIGN1c3RvbWl6ZSB0aGUgYWN0aW9uIHR5cGUgdmFsdWVzLCBwZXIgYWN0aW9uLlxuICpcbiAqIEBhbGlhcyBtb2R1bGU6c3RhY2tcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtnZXRUeXBlXSBhc3NpZ25zIHByb3BlcnR5IHZhbHVlcyB0byByZXN1bHRpbmcgb2JqZWN0XG4gKiBAcmV0dXJuIHt7fX0gbWFwIG9mIFwic3RhY2tcIiBhY3Rpb24gdHlwZXMgdG8gc3RyaW5nfHN5bWJvbCB2YWx1ZXNcbiAqL1xuY29uc3Qgc3RhY2tBY3Rpb25UeXBlcyA9IChnZXRUeXBlKSA9PiBtYXBWYWx1ZXMoU1RBQ0tfVFlQRVMsIGdldFR5cGUpXG5cbmV4cG9ydCBkZWZhdWx0IHN0YWNrQWN0aW9uVHlwZXNcbiIsImltcG9ydCB7IG5vcm1hbGl6ZUFycmF5LCB3aXRob3V0LCBlbXB0eUFjdGlvbiB9IGZyb20gJy4uL3V0aWxzJ1xuXG5jb25zdCBwdXNoID0gKHN0YWNrLCBlbHQpID0+IFsuLi5zdGFjaywgLi4ubm9ybWFsaXplQXJyYXkoZWx0KV1cblxuY29uc3QgcG9wID0gKHN0YWNrLCBjb3VudCA9IDEpID0+IHN0YWNrLnNsaWNlKDAsIC0oY291bnQpKVxuXG5jb25zdCByZXBsYWNlID0gKHN0YWNrLCBlbHQpID0+IHB1c2gocG9wKHN0YWNrKSwgZWx0KVxuXG4vKipcbiAqIEJhc2ljIFwic3RhY2tcIiByZWR1Y2VyIGZvciBhcmJpdHJhcnkgZWxlbWVudHMuXG4gKiBXb3JrcyBiZXN0IHdpdGggcHJpbWl0aXZlIHR5cGVzLCBzaW5jZSBcIlJFTU9WRVwiIGZ1bmN0aW9uYWxpdHlcbiAqIHdpbGwgdGVzdCBmb3IgYW55IGVsZW1lbnQgaW4gc3RhY2sgdGhhdCBpcyBzdHJpY3RseSBlcXVhbCB0byB0aGVcbiAqIGRlc2lyZWQgZWxlbWVudCB0byByZW1vdmUuXG4gKiBGb3IgbW9yZSBhZHZhbmNlZCB1c2UtY2FzZXMgd2l0aCBhcnJheXMgb2Ygb2JqZWN0cyB0cmFja2VkIGJ5XG4gKiBJRCwgc2VlIFwiY29sbGVjdGlvblJlZHVjZXJcIi5cbiAqXG4gKiBAYWxpYXMgbW9kdWxlOnN0YWNrXG4gKiBAcGFyYW0ge0FycmF5fSBbZGVmYXVsdFN0YXRlPVtdXSBpbml0aWFsIHN0YXRlIHRvIHJldHVybiwgbnVsbCBvciBlcnJvclxuICogQHBhcmFtIHt7fX0gW3R5cGVzXSBhY3Rpb24gdHlwZXMgZm9yIHN0YWNrIGFjdGlvbnNcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlcy5wdXNoIHB1c2ggYWN0aW9uIHR5cGVcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlcy5wb3AgcG9wIGFjdGlvbiB0eXBlXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZXMucmVwbGFjZSByZXBsYWNlIGFjdGlvbiB0eXBlXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZXMucmVtb3ZlIHJlbW92ZSBhY3Rpb24gdHlwZVxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVzLmNsZWFyIGNsZWFyIGFjdGlvbiB0eXBlXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gcmVkdXggcmVkdWNlciBmdW5jdGlvblxuICovXG5jb25zdCBzdGFja1JlZHVjZXIgPSAoXG4gIGRlZmF1bHRTdGF0ZSA9IFtdLFxuICB7XG4gICAgcHVzaDogcHVzaEFjdGlvbixcbiAgICBwb3A6IHBvcEFjdGlvbixcbiAgICByZXBsYWNlOiByZXBsYWNlQWN0aW9uLFxuICAgIHJlbW92ZTogcmVtb3ZlQWN0aW9uLFxuICAgIGNsZWFyOiBjbGVhckFjdGlvblxuICB9ID0ge31cbikgPT4ge1xuICByZXR1cm4gKHN0YWNrID0gZGVmYXVsdFN0YXRlLCB7IHR5cGUsIHBheWxvYWQgfSA9IGVtcHR5QWN0aW9uKCkpID0+IHtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgcHVzaEFjdGlvbjoge1xuICAgICAgICByZXR1cm4gcHVzaChzdGFjaywgcGF5bG9hZClcbiAgICAgIH1cbiAgICAgIGNhc2UgcG9wQWN0aW9uOiB7XG4gICAgICAgIHJldHVybiBwb3Aoc3RhY2ssIHBheWxvYWQpXG4gICAgICB9XG4gICAgICBjYXNlIHJlcGxhY2VBY3Rpb246IHtcbiAgICAgICAgcmV0dXJuIHJlcGxhY2Uoc3RhY2ssIHBheWxvYWQpXG4gICAgICB9XG4gICAgICBjYXNlIHJlbW92ZUFjdGlvbjoge1xuICAgICAgICByZXR1cm4gd2l0aG91dChzdGFjaywgLi4ubm9ybWFsaXplQXJyYXkocGF5bG9hZCkpXG4gICAgICB9XG4gICAgICBjYXNlIGNsZWFyQWN0aW9uOiB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0U3RhdGVcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6IHJldHVybiBzdGFja1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdGFja1JlZHVjZXJcbiIsIi8qKlxuICogbW9kdWxlIGZvciBtYW5hZ2luZyBhIHNpbXBsZSBzdGFjayBpbiBhIHJlZHV4IHN0b3JlXG4gKiBAbW9kdWxlIHN0YWNrXG4gKi9cbmV4cG9ydCB7IGRlZmF1bHQgYXMgc3RhY2tBY3Rpb25zIH0gZnJvbSAnLi9zdGFja0FjdGlvbnMnXG5leHBvcnQgeyBkZWZhdWx0IGFzIHN0YWNrQWN0aW9uVHlwZXMsIFNUQUNLX1RZUEVTIH0gZnJvbSAnLi9zdGFja0FjdGlvblR5cGVzJ1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBzdGFja1JlZHVjZXIgfSBmcm9tICcuL3N0YWNrJ1xuIl0sIm5hbWVzIjpbImlzQXJyYXkiLCJBcnJheSIsIkFDVElPTl9QQVRIIiwiZW1wdHlBY3Rpb24iLCJ0eXBlIiwiaWRlbnRpdHkiLCJ2YWwiLCJpc05pbCIsImlzVW5kZWZpbmVkIiwidW5kZWZpbmVkIiwiaXNTdHJpbmdPck51bGwiLCJzdHIiLCJpc09iamVjdCIsImlzTm9uQXJyYXlPYmplY3QiLCJpc09iamVjdE9yTnVsbCIsImlzRnVuY3Rpb24iLCJmaW5kIiwiYXJyIiwicHJlZGljYXRlIiwiaSIsImlsIiwibGVuZ3RoIiwid2l0aG91dCIsInZhbHVlcyIsImZpbHRlciIsImluZGV4T2YiLCJtYXBWYWx1ZXMiLCJvYmplY3QiLCJpdGVyYXRlZSIsImtleXMiLCJPYmplY3QiLCJyZWR1Y2UiLCJhY2MiLCJjdXIiLCJrZXlCeSIsImNvbGxlY3Rpb24iLCJnZXRLZXkiLCJ2IiwiaW1tdXRhYmxlU3BsaWNlIiwic3RhcnQiLCJkZWxldGVDb3VudCIsIml0ZW1zIiwic2xpY2UiLCJhcHBseVF1ZXJ5UGFyYW1zIiwidXJsIiwicXVlcnlQYXJhbXMiLCJzcGxpdCIsImVuZHBvaW50IiwiaGFzaCIsInF1ZXJ5U2VwYXJhdG9yIiwiZGVmYXVsdEdldEtleXMiLCJSZWZsZWN0Iiwib3duS2V5cyIsIm1hdGNoZXNPYmplY3QiLCJvYmoiLCJzb3VyY2UiLCJnZXRLZXlzIiwibWF4TGV2ZWwiLCJsZXZlbCIsInNyY0tleXMiLCJrZXkiLCJzcmNWYWwiLCJub3JtYWxpemVBcnJheSIsIm9uY2UiLCJmbiIsInJlc3VsdCIsIkNBTkNFTCIsIkFDVElPTl9DQU5DRUxFRCIsImNhbmNlbGVkQWN0aW9uIiwiYWN0aW9uIiwicGF5bG9hZCIsImNvbmZpZ3VyZUNhbmNlbEFjdGlvbk1pZGRsZXdhcmUiLCJhY3Rpb25DcmVhdG9yIiwic3RvcmUiLCJuZXh0IiwiZ2V0U3RhdGUiLCJtZXRhIiwiY2FuY2VsIiwiZGVmYXVsdENhbmNlbEFjdGlvbk1pZGRsZXdhcmUiLCJjYW5jZWxBY3Rpb25NaWRkbGV3YXJlIiwibWF0Y2hlc01ldGEiLCJjb25maWd1cmVNYXRjaGVzTWV0YSIsImRlZmF1bHRNZXRhIiwibWF0Y2hlc1R5cGUiLCJ0eXBlcyIsInBheWxvYWRIaXN0b3J5UmVkdWNlciIsImRlZmF1bHRTdGF0ZSIsInN0YXRlIiwid2l0aENhbmNlbGVkIiwicmVkdWNlciIsIndpdGhFcnJvciIsImluY2x1c2l2ZSIsImVycm9yIiwid2l0aExpbWl0IiwibGltaXQiLCJxdWV1ZSIsIm5leHRTdGF0ZSIsIndpdGhSZXNldCIsIndpdGhEZWZhdWx0U3RhdGUiLCJyZWR1Y2VTdGF0ZXMiLCJhcmcxIiwiYXJnMiIsImFjdGlvbnMiLCJSU0FBX0VYVCIsIlJTQUEiLCJSU0FBX1RZUEVTIiwiUlNBQV9NRVRBIiwiU3ltYm9sIiwicnNhYU1ldGFNaWRkbGV3YXJlIiwiaXNSU0FBIiwicnNhYU1ldGEiLCJyc2FhIiwibmV4dFJTQUEiLCJyc2FhVHlwZXMiLCJuZXdUeXBlcyIsIm1hcCIsImRlZmF1bHRUeXBlIiwidHlwZURlc2NyaXB0b3IiLCJwcm9jZXNzVHlwZURlc2NyaXB0b3IiLCJyc2FhUHJvcHMiLCJtZXRhVmFsdWUiLCJhcGlBY3Rpb24iLCJhcGlBY3Rpb25XaXRoTWV0YSIsImNvbmZpZ3VyZU1ldGFRdWVyeSIsInN0cmluZ2lmeSIsInF1ZXJ5S2V5IiwicGFyYW1zIiwibmV3RW5kcG9pbnQiLCJjb25maWd1cmVBcGlBY3Rpb24iLCJvcHRpb25zIiwiZGVmYXVsdFJzYWEiLCJlbmFibGVNZXRhIiwibWV0YVF1ZXJ5Iiwid2l0aE1ldGFRdWVyeSIsImFwaUFjdGlvblR5cGVzIiwicHJlZml4Iiwic3VmZml4IiwiZGVsaW0iLCJUWVBFIiwicHJlZml4ZXMiLCJmaWxsV2l0aCIsInN1ZmZpeGVzIiwiYXNBcGlUeXBlc09iamVjdCIsImFwaVR5cGVzIiwicmVxdWVzdCIsInN1Y2Nlc3MiLCJmYWlsdXJlIiwiYXNBcGlUeXBlc0FycmF5Iiwibm9ybWFsaXplQXBpVHlwZXMiLCJub3JtYWxpemVBcGlUeXBlQXJyYXlzIiwiY29uZmlndXJlQXBpQWN0aW9uVHlwZXMiLCJmaWxsIiwiY29uZmlndXJlQ2FsbFJTQUEiLCJPYnNlcnZhYmxlIiwiZGVmYXVsdE9ic2VydmFibGUiLCJhcGlNaWRkbGV3YXJlIiwicmVkdXhBcGlNaWRkbGV3YXJlIiwiZnNhTWlkZGxld2FyZSIsImZzYVRyYW5zZm9ybSIsIm4iLCJyc2FhTWlkZGxld2FyZSIsInJzYWFUcmFuc2Zvcm0iLCJyc2FhSW50ZXJjZXB0b3IiLCJzIiwibmV4dFJzYWEiLCJyZWR1Y2VNaWRkbGV3YXJlIiwiZnNhSW50ZXJjZXB0b3IiLCJmc2EiLCJuZXh0RnNhIiwiZmV0Y2hSU0FBIiwiZnJvbVJTQUEiLCJFcnJvck9ic2VydmFibGUiLCJmcmVlemUiLCJjcmVhdGUiLCJvYnNlcnZlciIsIkVycm9yIiwibWlkZGxld2FyZUZuIiwicmVxdWVzdEFjdGlvbiIsInByb21pc2UiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImFwaUZldGNoIiwiY2F0Y2giLCJPYnNlcnZhYmxlQ2xhc3MiLCJ0aGVuIiwiY29tcGxldGUiLCJlIiwidGhyb3dEaXNwYXRjaEVycm9yIiwibXdUeXBlIiwiaW5kZXgiLCJ0b1N0cmluZyIsIm1pZGRsZXdhcmUiLCJkaXNwYXRjaCIsImFjY0FjdGlvbiIsImN1ck1pZGRsZXdhcmUiLCJuZXh0QWN0aW9uIiwibXciLCJhIiwibG9hZGluZ1JlZHVjZXIiLCJhY3Rpb25UeXBlcyIsInBlbmRpbmdSZWR1Y2VyIiwiTWF0aCIsIm1heCIsInJzYWFFcnJvclJlZHVjZXIiLCJwcm9jZXNzQ29sbGVjdGlvbk1vZGVsIiwibW9kZWwiLCJpZEF0dHIiLCJjaWRBdHRyIiwidWlkIiwibW9kZWxJRCIsIm1vZGVsQ0lEIiwiaWQiLCJjaWQiLCJwcm9jZXNzTW9kZWwiLCJwcm9jZXNzUGF5bG9hZCIsIm1vZGVscyIsImFyZ3MiLCJtIiwiY29sbGVjdGlvbkFjdGlvbnMiLCJpZEF0dHJpYnV0ZSIsImNpZEF0dHJpYnV0ZSIsImdldFVJRCIsImlkQ291bnRlciIsImFkZCIsInB1c2giLCJwb3AiLCJjb3VudCIsInJlbW92ZSIsImlkcyIsInJlc2V0IiwidW5zaGlmdCIsInNoaWZ0IiwiYmF0Y2giLCJDT0xMRUNUSU9OX1RZUEVTIiwiY29sbGVjdGlvbkFjdGlvblR5cGVzIiwiZ2V0VHlwZSIsImRlZmF1bHRNZXJnZSIsInNvdXJjZXMiLCJvIiwibm9ybWFsaXplQXJyYXlQYXlsb2FkIiwiZ2V0Q29sbGVjdGlvbkZpbHRlckNhbGxiYWNrIiwiZWxlbWVudCIsImdldENvbGxlY3Rpb25Nb2RlbFJlZHVjZXIiLCJtZXJnZSIsImlkc09iaiIsIm1lcmdlRm4iLCJhdCIsImNvbGxlY3Rpb25NYXAiLCJuZXdNb2RlbHMiLCJhZGRlZE1vZGVscyIsImFkZGVkTW9kZWxzTWFwIiwibmV3TW9kZWxzTWFwIiwibW9kZWxJZCIsIm1lcmdlTW9kZWwiLCJuZXdNZXRhIiwicmVzdCIsImdldENhbGxiYWNrIiwiaWRNYXAiLCJtb2RlbElkcyIsImluZGljZXMiLCJuZXh0TW9kZWwiLCJjb2xsZWN0aW9uUmVkdWNlciIsImFkZEFjdGlvbiIsInB1c2hBY3Rpb24iLCJwb3BBY3Rpb24iLCJyZW1vdmVBY3Rpb24iLCJmaWx0ZXJBY3Rpb24iLCJyZWplY3RBY3Rpb24iLCJyZXNldEFjdGlvbiIsInVuc2hpZnRBY3Rpb24iLCJzaGlmdEFjdGlvbiIsInJlZHVjZUFjdGlvbiIsImJhdGNoQWN0aW9uIiwiZ2V0TW9kZWxSZWR1Y2VyIiwiZ2V0RmlsdGVyQ2FsbGJhY2siLCJyZWR1Y2VIYW5kbGVyIiwiZGljdGlvbmFyeUFjdGlvbnMiLCJ1cGRhdGVWYWx1ZSIsInZhbHVlIiwiZGljdCIsIm1lcmdlVmFsdWUiLCJESUNUSU9OQVJZX1RZUEVTIiwiZGljdGlvbmFyeUFjdGlvblR5cGVzIiwiZGVzdCIsImdldERpY3Rpb25hcnlGaWx0ZXJDYWxsYmFjayIsImVsdCIsImdldERpY3Rpb25hcnlWYWx1ZVJlZHVjZXIiLCJfIiwiaW52ZXJ0ZWRDYWxsYmFjayIsIm5vcm1hbGl6ZWRNZXRhIiwicmVhbElkcyIsImRpY3Rpb25hcnlSZWR1Y2VyIiwidXBkYXRlVmFsdWVBY3Rpb24iLCJtZXJnZUFjdGlvbiIsIm1lcmdlVmFsdWVBY3Rpb24iLCJnZXRWYWx1ZVJlZHVjZXIiLCJzdGFja0FjdGlvbnMiLCJyZXBsYWNlIiwiY2xlYXIiLCJTVEFDS19UWVBFUyIsInN0YWNrQWN0aW9uVHlwZXMiLCJzdGFjayIsInN0YWNrUmVkdWNlciIsInJlcGxhY2VBY3Rpb24iLCJjbGVhckFjdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUFRQSxVQUFZQyxNQUFaRDtBQUVSLEFBQU8sSUFBTUUsV0FBVyxHQUFHLGlCQUFwQjtBQUNQLEFBQU8sSUFBTUMsV0FBVyxHQUFHLFNBQWRBLFdBQWM7U0FBTztJQUFFQyxJQUFJLFlBQUtGLFdBQUw7R0FBYjtDQUFwQjtBQUVQLEFBQU8sSUFBTUcsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBQUMsR0FBRztTQUFJQSxHQUFKO0NBQXBCO0FBRVAsQUFBTyxJQUFNQyxLQUFLLEdBQUcsU0FBUkEsS0FBUSxDQUFBRCxHQUFHO1NBQUlBLEdBQUcsSUFBSSxJQUFYO0NBQWpCO0FBRVAsQUFBTyxJQUFNRSxXQUFXLEdBQUcsU0FBZEEsV0FBYyxDQUFDRixHQUFEO1NBQVNBLEdBQUcsS0FBS0csU0FBakI7Q0FBcEI7QUFFUCxBQUFPLElB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
/* eslint-enable */
