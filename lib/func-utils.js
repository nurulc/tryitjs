

/**
 * [NOT description]
 * @param {Function} fn [description]
 */
function NOT(fn) {
  return (...args) => !fn(...args);
}

function OR(...fns) {
  if(fns.length === 0) return () => false;
  if(fns.length === 1) (...args) => fns[0](...args);
  if(fns.length === 2) (...args) => fns[0](...args) || fns[1](...args);
  if(fns.length === 3) (...args) => fns[0](...args) || fns[1](...args) || fns[2](...args);
  return test;

  function test(...args) {
    for(let i=0; i< fns.length; i++) {
      let res = fns[i](...args);
      if( res ) return res;
    }
    return undefined;
  }
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
  return (arr => (arr ? (Array.isArray(arr) ? arr.some(fn) : fn(arr)) : false));
}


/**
 * Functionalized version of Array.filter
 * @param {Function} fn [description]
 * @returns 
 */
function FILTER(fn,dfltV) {
  return (
    (arr) => {
      if (Array.isArray(arr)) return arr.filter(fn);
      if (arr && typeof arr.filter === 'function') return arr.filter(fn);
      return arr===undefined? dfltV: fn(arr)
    }
  );
}

/**
 * Functionalized version of Array.map
 * @param {Function} fn [description]
 * @param {any} dfltV value if we try to map an undefined element
 */
function MAP(fn,dfltV) {
  return (
    (arr) => {
      if (Array.isArray(arr)) return arr.map(fn);
      if (arr && typeof arr.map === 'function') return arr.map(fn);
      return arr===undefined? dfltV: fn(arr)
    }
  );
}

/**
 * Functionalized version of Array.flatMap
 * @param {Function} fn [description]
 * @param {any} dfltV value if we try to map an undefined element
 */
function FLATMAP(fn,dfltV) {
  return (
    (arr) => {
      if (Array.isArray(arr)) return arr.flatMap(fn);
      if (arr && typeof arr.flatMap === 'function') return arr.flatMap(fn);
      return arr===undefined? dfltV: flatten(fn(arr),1)
    }
  );
}
/**
 * Pick out elements of a object or array
 * @param {[type]} nameOrArrayOfNames [description]
 */
function PICK(nameOrArrayOfNames) {
  if (isStringOrNuner(nameOrArrayOfNames)) return (obj => (obj ? obj[nameOrArrayOfNames] : obj));
  if (Array.isArray(nameOrArrayOfNames) && nameOrArrayOfNames.every(isStringOrNuner)) { 
      return obj => (obj ? nameOrArrayOfNames.map(name => obj[name]) : obj); 
  }
  else  throw new TypeError("expected string or number");
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
function isNumber(v) { return typeof v === 'number'; }
function isStringOrNuner(v) {
  return isNumber(v) || isString(v);
}

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

let dict = new Map();
function memoize(fn) {
  return ( (arg) => {
     if(dict.has(arg)) return dict.get(arg);
     let val = fn(arg);
     dict.set(arg,val);
     return val; 
  });
}

//===================
//
function flatten(arr, level) {
  if (!Array.isArray(arr)) {
    throw new TypeError('Invalid argument, Please pass proper array argument');
  }
  if(!arr.some(Array.isArray)) return arr;
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

/**
 * very basic is empty test
 * @param  {[type]}  obj [description]
 * @return {Boolean}     [description]
 */
function isEmpty(obj) {
  if(obj === undefined || obj === null ) return true;
  if(Array.isArray(obj) ) return obj.length === 0;
  if(typeof obj === 'number') return false;
  if(typeof obj === 'boolean') return false;
  if(typeof obj === 'string') return !obj;

  if(((obj instanceof Set) || (obj instanceof Map))) return  obj.size === 0;
  if(obj instanceof ArrayBuffer) return obj.byteLength === 0;
  if(obj.length !== undefined) return obj.length === 0;
  
  if(typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;  
}

const DEBUG = false
function checkNoPromise(inFile, p) {
  if(!DEBUG) return p;
  if(p instanceof Promise) {
    p.then(v => checkNoPromise(inFile, v));
  } else if(Array.isArray(p) && p.some(v => v instanceof Promise)) {
    console.log("Unexpected Promis in file", inFile);
    p.forEach((v,ix) => console.log(">>> ", ix, v));
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