
/**
 * [NOT description]
 * @param {Function} fn [description]
 */
function NOT(fn) {
  return (...args) => !fn(...args);
}


/**
 * [MATCH description]
 * @param {[type]} valArrOrSet [description]
 */
function MATCH(valArrOrSet) {
  if (typeof valArrOrSet === 'function') return valArrOrSet;
  if (valArrOrSet instanceof Set) return (v => valArrOrSet.has(v));
  if (Array.isArray(valArrOrSet)) return (v => valArrOrSet.indexOf(v) !== -1);
  if ( valArrOrSet && typeof valArrOrSet.indexOf === 'function'  ) return (v => valArrOrSet.indexOf(v) !== -1);
  if ( valArrOrSet && typeof valArrOrSet.has === 'function'  ) return (v => valArrOrSet.has(v));
  return (v => v === valArrOrSet);
}

/**
 * [SOME description]
 * @param {Function} fn [description]
 */
function SOME(fn) {
  return (arr => (arr ? (Array.isArray(ar) ? arr.some(fn) : fn(arr)) : false));
}


/**
 * [FILTER description]
 * @param {Function} fn [description]
 */
function FILTER(fn) {
  return (
    (arr) => {
      if (Array.isArray(arr)) return arr.filter(fn);
      if (arr && typeof arr.filter === 'function') return arr.filter(fn);
      return fn(arr)? [a]:[];
    }
  );
}

function PICK(nameOrArrayOfNames) {
  if (isString(nameOrArrayOfNames)) return (obj => (obj ? obj[nameOrArrayOfNames] : obj));
  if (Array.isArray(nameOrArrayOfNames) && nameOrArrayOfNames.every(isString)) { 
      return obj => (obj ? nameOrArrayOfNames.map(name => obj[name]) : obj); 
  }
}

function isString(s) { return typeof s === 'string'; }

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

//===================
//
function flatten(arr, level) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Invalid argument, Please pass proper array argument');
  }
  var result = [];
  if (level === undefined)
    return recursiveFlatten(arr, result);
  else
    return recursiveFlattenWithDepth(arr, result, level);
}

function recursiveFlatten(arr, result) {
  for (var i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      recursiveFlatten(arr[i], result);
    } else
      result.push(arr[i]);
  }
  return result;
}


module.exports = {
  NOT: NOT,
  MATCH: MATCH,
  SOME: SOME,
  FILTER: FILTER,
  PICK: PICK,
  isString: isString,
  pipe: pipe,
  flatten: flatten
};