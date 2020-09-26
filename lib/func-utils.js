

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
 * Functionalized version of Array.filter
 * @param {Function} fn [description]
 * @returns 
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

/**
 * Functionalized version of Array.map
 * @param {Function} fn [description]
 */
function MAP(fn) {
  return (
    (arr) => {
      if (Array.isArray(arr)) return arr.map(fn);
      if (arr && typeof arr.map === 'function') return arr.map(fn);
      return fn(arr)? [a]:[];
    }
  );
}
/**
 * [PICK description]
 * @param {[type]} nameOrArrayOfNames [description]
 */
function PICK(nameOrArrayOfNames) {
  if (isString(nameOrArrayOfNames)) return (obj => (obj ? obj[nameOrArrayOfNames] : obj));
  if (Array.isArray(nameOrArrayOfNames) && nameOrArrayOfNames.every(isString)) { 
      return obj => (obj ? nameOrArrayOfNames.map(name => obj[name]) : obj); 
  }
}

/**
 * [Identity description]
 * @param {[type]} a [description]
 */
function Identity(a) { return a; }
function DEFAULT(defVal) {
  return val => val !== undefined ? val : defVal
}

/**
 * [PICK_PATH description]
 * @param {[type]}    dflt [description]
 * @param {...[type]} list [description]
 */
function PICK_PATH(dflt,...list) {
    if(arguments.length === 0) return Identity;
    //console.log(dflt,list)
    if(typeof dflt !== 'function') dflt = DEFAULT(dflt);
    return pipe(...list.map(name => PICK(name)), dflt);
}

function isString(s) { return typeof s === 'string'; }

/**
 * [pipe description]
 * @param  {...[type]} args [description]
 * @return {[type]}         [description]
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
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      recursiveFlatten(arr[i], result);
    } else
      result.push(arr[i]);
  }
  return result;
}

function recursiveFlattenWithDepth(arr, result, depth) {
  for (var i = 0; i < arr.length; i++) {
    if (depth > 0 && Array.isArray(arr[i]) ) {
      recursiveFlattenWithDepth(arr[i], result, depth-1);
    } else
      result.push(arr[i]);
  }
  return result;
}


function last(arr) {
  if(!Array.isArray(arr) ) return arr;
  return arr[arr.length-1];
}


module.exports = {
  NOT: NOT,
  MATCH: MATCH,
  SOME: SOME,
  FILTER: FILTER,
  MAP: MAP,
  PICK: PICK,
  PICK_PATH: PICK_PATH,
  DEFAULT: DEFAULT,
  isString: isString,
  pipe: pipe,
  flatten: flatten,
  last: last
};