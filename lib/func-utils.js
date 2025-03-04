const DEBUG = false;
/**
 * Negates the result of the given function.
 * @param {Function} fn - The function whose result is to be negated.
 * @returns {Function} A function that returns the negated result of 'fn'.
 */
function NOT(fn) {
  return (...args) => !fn(...args);
}

/**
 * Returns a function that performs logical OR on multiple functions.
 * @param {...Function} fns - The functions to combine.
 * @returns {Function} A function that returns true if any function returns true.
 */
function OR(...fns) {
  if (fns.length === 0) return () => false;
  if (fns.length === 1) return (...args) => fns[0](...args);
  if (fns.length === 2) return (...args) => fns[0](...args) || fns[1](...args);
  if (fns.length === 3) return (...args) => fns[0](...args) || fns[1](...args) || fns[2](...args);
  return test;

  function test(...args) {
    for (let i = 0; i < fns.length; i++) {
      let res = fns[i](...args);
      if (res) return res;
    }
    return undefined;
  }
}

/**
 * Matches a value against an array, set, or function.
 * @param {Array|Set|Function} valArrOrSet - The value, array, set, or function to match.
 * @returns {Function} A function that returns true if the value matches.
 */
function MATCH(valArrOrSet) {
  if (typeof valArrOrSet === 'function') return valArrOrSet;
  if (valArrOrSet instanceof Set) return v => valArrOrSet.has(v);
  if (Array.isArray(valArrOrSet)) return v => valArrOrSet.indexOf(v) !== -1;
  if (valArrOrSet && typeof valArrOrSet.indexOf === 'function') return v => valArrOrSet.indexOf(v) !== -1;
  if (valArrOrSet && typeof valArrOrSet.has === 'function') return v => valArrOrSet.has(v);
  return v => v === valArrOrSet;
}

/**
 * Checks if a function returns true for some elements in an array.
 * @param {Function} fn - The function to check against.
 * @returns {Function} A function that returns true if fn returns true for some elements.
 */
function SOME(fn) {
  return arr => (arr ? (Array.isArray(arr) ? arr.some(fn) : fn(arr)) : false);
}

/**
 * Functionalized version of Array.filter.
 * @param {Function} fn - The filter function.
 * @param {any} [dfltV] - Default value if the array is undefined.
 * @returns {Function} A function that filters an array.
 */
function FILTER(fn, dfltV) {
  return arr => {
    if (Array.isArray(arr)) return arr.filter(fn);
    if (arr && typeof arr.filter === 'function') return arr.filter(fn);
    return arr === undefined ? dfltV : fn(arr);
  };
}

/**
 * Functionalized version of Array.map.
 * @param {Function} fn - The map function.
 * @param {any} [dfltV] - Default value if the array is undefined.
 * @returns {Function} A function that maps over an array.
 */
function MAP(fn, dfltV) {
  return arr => {
    if (Array.isArray(arr)) return arr.map(fn);
    if (arr && typeof arr.map === 'function') return arr.map(fn);
    return arr === undefined ? dfltV : fn(arr);
  };
}

/**
 * Functionalized version of Array.flatMap.
 * @param {Function} fn - The flatMap function.
 * @param {any} [dfltV] - Default value if the array is undefined.
 * @returns {Function} A function that flatMaps over an array.
 */
function FLATMAP(fn, dfltV) {
  return arr => {
    if (Array.isArray(arr)) return arr.flatMap(fn);
    if (arr && typeof arr.flatMap === 'function') return arr.flatMap(fn);
    return arr === undefined ? dfltV : flatten(fn(arr), 1);
  };
}

/**
 * Pick out elements of an object or array.
 * @param {string|string[]} nameOrArrayOfNames - The key(s) to pick from the object.
 * @returns {Function} A function that picks the specified key(s) from an object.
 */
function PICK(nameOrArrayOfNames) {
  if (isStringOrNuner(nameOrArrayOfNames)) return obj => (obj ? obj[nameOrArrayOfNames] : obj);
  if (Array.isArray(nameOrArrayOfNames) && nameOrArrayOfNames.every(isStringOrNuner)) {
    return obj => (obj ? nameOrArrayOfNames.map(name => obj[name]) : obj);
  }
  throw new TypeError('expected string or number');
}

/**
 * Identity function that returns the argument unchanged.
 * @param {any} a - The input value.
 * @returns {any} The same input value.
 */
function Identity(a) {
  return a;
}

/**
 * Provides a default value if the input is undefined.
 * @param {any} defVal - The default value.
 * @returns {Function} A function that returns the default value if input is undefined.
 */
function DEFAULT(defVal) {
  return val => (val !== undefined ? val : defVal);
}

/**
 * Retturns a dunction that picks a value from a list of keys, using a default value if any of the keys return a null.
 * for example, PICK_PATH(0, 'a', 'b', 'c') 
 *  will return a function: 
 *      f(obj){ return obj.a.b.c||  0; } 
 *  the dflt (0 in this case) if any of the keys (a,b,c) are undefined.
 * @param {any} dflt - The default value.
 * @param {...string} list - The list of keys to pick from.
 * @returns {Function} A function that picks the value of the specified key.
 */
function PICK_PATH(dflt, ...list) {
  if (arguments.length === 0) return Identity;
  if (typeof dflt !== 'function') dflt = DEFAULT(dflt);
  if(list.length === 0) return dflt;
  return pipe(...list.map(name => PICK(name)), dflt);
}

/**
 * Checks if the input is a string.
 * @param {any} s - The input value.
 * @returns {boolean} True if the input is a string, otherwise false.
 */
function isString(s) {
  return typeof s === 'string';
}

/**
 * Checks if the input is a number.
 * @param {any} v - The input value.
 * @returns {boolean} True if the input is a number, otherwise false.
 */
function isNumber(v) {
  return typeof v === 'number';
}

/**
 * Checks if the input is a string or number.
 * @param {any} v - The input value.
 * @returns {boolean} True if the input is a string or number, otherwise false.
 */
function isStringOrNuner(v) {
  return isNumber(v) || isString(v);
}

/**
 * Pipes multiple functions together.
 * @param {...Function} args - The functions to pipe.
 * @returns {Function} A function that applies the functions in sequence.
 */
function pipe(...args) {
  switch (args.length) {
    case 0: return v => v;
    case 1: return (...v) => args[0](...v);
    case 2: return (...v) => args[1](args[0](...v));
    case 3: return (...v) => args[2](args[1](args[0](...v)));
    case 4: return (...v) => args[3](args[2](args[1](args[0](...v))));
    case 5: return (...v) => args[4](args[3](args[2](args[1](args[0](...v)))));
    default: return (...v) => args.slice(1).reduce((res, f) => f(res), args[0](...v));
  }
}

/**
 * Memoizes a function by caching its results.
 * @param {Function} fn - The function to memoize.
 * @returns {Function} A memoized version of the function.
 */
function memoize(fn) {
  let dict = new Map();
  return arg => {
    if (dict.has(arg)) return dict.get(arg);
    let val = fn(arg);
    dict.set(arg, val);
    return val;
  };
}

/**
 * Flattens an array up to a specified depth.
 * @param {Array} arr - The array to flatten.
 * @param {number} [level] - The depth to flatten the array to.
 * @returns {Array} The flattened array.
 */
function flatten(arr, level) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Invalid argument, Please pass proper array argument');
  }
  if (!arr.some(Array.isArray)) return arr;
  var result = [];
  if (level === undefined) return recursiveFlatten(arr, result);
  else return recursiveFlattenWithDepth(arr, result, level);
}

function recursiveFlatten(arr, result) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      recursiveFlatten(arr[i], result);
    } else result.push(arr[i]);
  }
  return result;
}

function recursiveFlattenWithDepth(arr, result, depth) {
  for (var i = 0; i < arr.length; i++) {
    if (depth > 0 && Array.isArray(arr[i])) {
      recursiveFlattenWithDepth(arr[i], result, depth - 1);
    } else result.push(arr[i]);
  }
  return result;
}

/**
 * Returns the last element of an array.
 * @param {Array} arr - The array to get the last element from.
 * @returns {any} The last element of the array.
 */
function last(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr[arr.length - 1];
}

/**
 * Checks if the input is empty.
 * @param {any} obj - The object to check.
 * @returns {boolean} True if the input is empty, otherwise false.
 */
function isEmpty(obj) {
  if (obj === undefined || obj === null) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;
  if (typeof obj === 'string') return !obj;
  if (obj instanceof Set || obj instanceof Map) return obj.size === 0;
  if (obj instanceof ArrayBuffer) return obj.byteLength === 0;
  if (obj.length !== undefined) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

/**
 * Checks if a promise is not expected where it shouldn't be.
 * @param {string} inFile - The file being checked.
 * @param {any} p - The value to check.
 * @returns {any} The original value.
 */
function checkNoPromise(inFile, p) {
  if (!DEBUG) return p;
  if (p instanceof Promise) {
    p.then(v => checkNoPromise(inFile, v));
  } else if (Array.isArray(p) && p.some(v => v instanceof Promise)) {
    console.log('Unexpected Promise in file', inFile);
    p.forEach((v, ix) => console.log('>>> ', ix, v));
  }
  return p;
}

module.exports = {
  NOT: NOT,
  MATCH: MATCH,
  SOME: SOME,
  FILTER: FILTER,
  MAP: MAP,
  FLATMAP: FLATMAP,
  PICK: PICK,
  PICK_PATH: PICK_PATH,
  DEFAULT: DEFAULT,
  memoize: memoize,
  isString: isString,
  pipe: pipe,
  flatten: flatten,
  last: last,
  isEmpty: isEmpty,
  isNumber: isNumber,
  checkNoPromise: checkNoPromise,
  Identity: Identity,
  isStringOrNuner: isStringOrNuner
};
