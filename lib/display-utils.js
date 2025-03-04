/**
 * Identity function that returns the same value that is passed in.
 * 
 * @param {*} a - The input value.
 * @returns {*} The same value that was passed in.
 */
function Identity(a) { 
  return a; 
}

/**
 * Logs the input value and an optional message, then returns the input value.
 * Useful for debugging while maintaining function chaining.
 * 
 * @param {string} [msg] - Optional message to log.
 * @returns {Function} Function that logs 'x' and 'msg', then returns 'x'.
 */
function tee(msg) {  
  return x => { 
    console.log(x, msg || '');  // Logs 'x' and the optional 'msg'
    return x;  // Returns 'x' for chaining
  }; 
}

/**
 * Logs the size of the data in megabytes (MB).
 * 
 * @param {Buffer|Uint8Array} data - The data to measure in bytes.
 */
function show_bytes_read(data) {
  log(data.length / (1024 * 1024), 'MB read');  // Log the size in MB
}

/**
 * Escapes certain characters in a string into their HTML entity equivalents.
 * Specifically converts '&', '<', and '>' to their respective HTML entities.
 * 
 * @param {string} x - The input string.
 * @returns {string} The string with HTML entities escaped.
 */
function asHTML(x) {
   return x.replace(/&/g, '~AMP~')  // Temporarily replace '&' to avoid double encoding
           .replace(/</g,"&lt;")    // Replace '<' with its HTML entity
           .replace(/>/g,"&gt;")    // Replace '>' with its HTML entity
           .replace(/~AMP~/g,"&amp;");  // Replace temporary '~AMP~' back to '&amp;'
}

/**
 * Escapes '<' and '>' characters in a string into their HTML entity equivalents.
 * 
 * @param {string} x - The input string.
 * @returns {string} The string with '<' and '>' escaped.
 */
function asHTMLSimple(x) {
   return x.replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

/**
 * Converts a string into a JSON-compatible string.
 * If the string is falsy (null, undefined, empty), it defaults to an empty string.
 * 
 * @param {string} [str] - The input string to convert to JSON.
 * @returns {string} The JSON-compatible string.
 */
function propString(str) {
	return JSON.stringify(str || '');
}

/**
 * Splits a string into the first word (type) and the remaining text.
 * 
 * @param {string} line - The input string to split.
 * @returns {Array} An array containing the first word and the remaining text.
 */
function splitType(line) {
  let [type, ...rest] = (line || '').split(' ');  // Split the string by spaces
  return [type, rest.join(' ')];  // Return the first word and the rest as two parts
}

/**
 * Rounds a number to four decimal places.
 * Returns an empty string if the input is not a valid number.
 * 
 * @param {number} v - The value to round.
 * @returns {string|number} The rounded number or an empty string if the input is invalid.
 */
function round(v) { 
  return isNaN(+v) ? '' : Math.round(v * 10000.0) / 10000.0; 
}

/**
 * Rounds a number to two decimal places.
 * Returns an empty string if the input is not a valid number.
 * 
 * @param {number} v - The value to round.
 * @returns {string|number} The rounded number or an empty string if the input is invalid.
 */
function round2(v) { 
  return isNaN(+v) ? '' : Math.round(v * 100.0) / 100.0; 
}

/**
 * Exports the utility functions as part of the module for use in other files.
 */
module.exports = {
  Identity: Identity,
  tee: tee,
  show_bytes_read: show_bytes_read,
  asHTML: asHTML,
  asHTMLSimple: asHTMLSimple,
  round: round,
  round2: round2,
  propString: propString,
  splitType: splitType
};
