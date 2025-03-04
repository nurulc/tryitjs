// Required imports
const { version } = require('../package.json');
const { asHTML } = require('./display-utils');
const { pipe, PICK_PATH, flatten, last } = require('./func-utils');
const { sections } = require('./sections');
const toc = require('./toc');
const pathAddPrefix = require('./pathAddPrefix');
const { render_sections } = require('./render');
const { mdToHtml } = require('./mdToHtml');
const { getIncludesPromise } = require('./getIncludesPromise');
const { IncludeObject } = require('./IncludeObject');
const { progressHTML, bodyStart, bodyEnd } = require('./templates');
const { splitType } = require('./display-utils');
const tryit = require('./tryit');

/**
 * Generates the HTML for a "tryit" section where users can input and execute code.
 * 
 * @param {string} x - The code content to display in the textarea.
 * @param {number} i - The index of the tryit section.
 * @param {Object} options - Options for the tryit section (e.g., fold, title).
 * @param {boolean} options.fold - Whether the code block should be folded.
 * @param {string} options.title - The title of the code block.
 * @returns {string} The HTML for the tryit section.
 */
function tryit_old(x, i, options) {
    let { fold, title } = options || ({ fold: false });
    let run_title = i > 1 ? 'Execute Script, (execute all previous first)' : 'Execute script (Ctrl+Enter)';

    if (title && title.length > 0) {
        title = title.join(' ');
    } else title = '';

    return (`<a id="_tryit${i}">&nbsp</a>\n` +
        '<div class="html ui top attached segment tryit-container " >\n' +
        '    <div class="tryit-inner ui sizer vertical segment" style="padding-top: 1.9rem; margin-bottom: -3.5rem">\n' +
        '        <div class="ui sizer vertical segment bottom" style="border-bottom: none;">\n' +
        '            <textarea class="tryit ui " id="tryit' + i + '">\n' +
        asHTML(x) + '\n' +
        '            </textarea>\n' +
        '        </div>\n' +
        '        <a class="tryit-anchor" id="_end_tryit' + (i) + '">\n' + '&nbsp;</a>\n' +
        '        <div id="tryit' + i + '-output" style="display: none">\n' +
        '            <div id="tryit' + i + '-error" class="tryit-error"></div>\n' +
        '            <div id="tryit' + i + '-display" class="tryit-display rendered_html"></div>\n' +
        '        </div>' +
        '    </div>' +
        '    <div class="ui top attached label">\n' +
        `        <i class="caret square ${fold ? 'right' : 'down'} icon large" title="${fold ? 'Show' : 'Hide'} Code"></i>` +
        `        <button id="tryit${i}-run" data-tooltip="${run_title}" class="ui  ${i > 1 ? 'yellow' : 'green'} right labeled icon button exec">` +
        '            <i class="caret square right icon"></i>' +
        '            Run' +
        '        </button>' +
        `        &nbsp; <button id="jump_tryit${i + 1}" class="circular ui icon yellow button jump_next">` +
        '            <i class="icon angle double down"></i>' +
        '        </button>\n' +
        '        &nbsp; <button class="circular ui icon button green jump_back">' + '<i class="icon angle double up"></i>' + '</button>\n' +
        (title ? `<div class="center try-title">${title}</div>` : '') +
        '        &nbsp; <button id="save_' + i + '" data-tooltip="Save all user modifications" class="ui right floated button circular icon green save_data">' +
        '            <i class="save icon"></i>' +
        '        </button>\n' +
        '    </div>\n' +
        '</div>');
}

/**
 * Sets the version placeholder in a string with the current version.
 * 
 * @param {string} s - The string with the version placeholder.
 * @returns {string} The string with the version replaced.
 */
const setVersion = s => s.replace(/VERSION/g, version);

/**
 * Extracts the script name from a script path.
 * 
 * @param {string} s - The script path.
 * @returns {Array<string>} An array containing the script name and the path.
 */
const scriptInfo = s => ([last(s.split('/')), s]);

/**
 * Extracts the last part (name) of a script path.
 * 
 * @param {string} s - The script path.
 * @returns {string} The script name.
 */
const scriptName = s => last(s.split('/'));

/**
 * Retrieves local scripts and CSS for the configuration.
 * 
 * @param {Object} config - The configuration object.
 * @returns {Object} An object containing local CSS and scripts with their paths.
 */
function getLocal(config) {
    if (!config.isLocal) return {};
    return Object.fromEntries(flatten([
        PICK_PATH([], 'local', 'css')(config).map(scriptInfo),
        PICK_PATH([], 'local', 'scripts')(config).map(scriptInfo)
    ], 1));
}

/**
 * Generates HTML based on content types (e.g., sections, markdown, tryit blocks).
 * 
 * @param {Object} config - The configuration object.
 * @param {string} tocContents - The table of contents content.
 * @param {Function} addPrefix - Function to add prefixes to paths.
 * @returns {Function} A function that generates HTML for each content type.
 */
function gen(config, tocContents, addPrefix) {
    /*
    let aSet = getLocal(config);

   
    const translateLocal = s => addPrefix(aSet[scriptName(s)] || s);
    const translate = pipe(translateLocal, setVersion);

    let css = PICK_PATH([], 'headers', 'css')(config)
        .map(translate)
        .map(s => `<link rel="stylesheet" href="${s}" />`).join('\n');
    let scripts = PICK_PATH([], 'headers', 'scripts')(config)
        .map(translate)
        .map(s => `<script src="${s}"></script>`)
        .join('\n') + '\n';
    */
    let { css, scripts } = getCssAndScripts(config, addPrefix); // get the header css and scripts from the config
    let i = 1;
    return ([type, x], ix) => {
        let [atype, ...rest] = splitType(type.trim()); // split the type by spaces

        if (atype.startsWith('!render-')) {
            return render_sections([type, x]);
        } else {
            let fold = false, title;
            switch (atype) {
                case '!head':
                    return '<head>\n\t<meta charset="UTF-8">\n' + ([css, scripts].join('\n')) + (x) + '</head>\n<body>\n' + bodyStart(tocContents);
                case '!js': return '<script>' + x + '</script>';
                case '!md':
                    return mdToHtml(x);
                case '!tryit-': fold = true;
                case '!tryit+': 
                case '!tryit':
                    // check if fold is indicated by '-' or '+'
                    if (!fold && rest.length > 0 && rest[0].trim().match(/^%\s*[-+]$/)) {
                        let opt = rest[0].trim();
                        if (opt === '-') fold = true;
                        else if (opt === '+') fold = false;
                        //title = rest.join(' ');
                        rest = rest.slice(1);
                    }
                    title = (rest || rest.join(' '));
                    return '\n' + tryit(x, i++, { fold, title });
                case '!end':
                    return getEnd(config.onend, JSON.stringify(config.headers.colors)) + bodyEnd(version) + (x) + progressHTML + '\n</body></html>';
                case '!--': return '';
                default: return x;
            }
        }
    };
}

function getCssAndScripts(config, addPrefix) {
  const aSet = getLocal(config);
  const translateLocal = s => addPrefix(aSet[scriptName(s)] || s);
  const translate = pipe(translateLocal, setVersion);

  let css = PICK_PATH([], 'headers', 'css')(config)
            .map(translate)
            .map(s => `<link rel="stylesheet" href="${s}" />`).join('\n');
  let scripts = PICK_PATH([], 'headers', 'scripts')(config)
      .map(translate)
      .map(s => `<script src="${s}"></script>`)
      .join('\n') + '\n';
  return { css, scripts };
}

/**
 * Generates the ending HTML with color scripts.
 * 
 * @param {string|Array} strOrList - The script or list of scripts to append.
 * @param {string} colors - The colors object in string format.
 * @returns {string} The complete end HTML including color scripts.
 */
function getEnd(strOrList, colors) {
    const setcolors = `<script>const tryit$colors = ${colors}; </script>`;
    if (!strOrList) return setcolors;
    if (Array.isArray(strOrList)) return setcolors + strOrList.join('\n');
    return setcolors + strOrList;
}

/**
 * Splits a buffer string into lines.
 * 
 * @param {string} buffer - The buffer string to split.
 * @returns {string[]} The lines split by newlines.
 */
function splitLines(buffer) {
    return buffer.replace(/\r/g, '').split('\n');
}

/**
 * Generates the complete HTML from the configuration, reading source files and processing sections.
 * 
 * @param {string} bodyText - The body content.
 * @param {Object} config - The configuration object.
 * @param {Function} readLines - The function to read lines from a file.
 * @param {string} srcDir - The source directory.
 * @param {string} inputFile - The input file path.
 * @param {string} targetDir - The target directory.
 * @param {string} outFile - The output file path.
 * @returns {Promise<string>} The generated HTML as a string.
 */
function _genHTML(bodyText, config, readLines, srcDir, inputFile, targetDir, outFile) {
    const addPrefix = (url) => {
        let res = pathAddPrefix(srcDir, inputFile, url);
        return res;
    };

    var linesPromise = pipe(splitLines, getIncludesPromise(new Map(), readLines, srcDir, inputFile, config))(bodyText);
    let lines = linesPromise.then(val => flatten(IncludeObject.expand(new Set(), val)));

    return lines.then(lines => {
        let sects = sections(lines.filter(s => checkValid(s)));
        let tocContents = toc(sects);
        var html = sects.map(gen(config, tocContents, addPrefix)).join('\n');
        return ('<!DOCTYPE html>\n<html>' + html);
    });
}

/**
 * Checks if a given string or object is valid and not a comment or a Promise.
 * 
 * @param {string|Object} s - The string or object to validate.
 * @returns {boolean} True if the input is valid, false otherwise.
 */
function checkValid(s) {
    if (typeof s !== 'string') {
        if (s instanceof Promise) {
            console.log(s);
            throw new Error('Unexpected Promise');
        }
        console.log(s);
        return false;
    }
    return !s.trim().startsWith('!--');
}

/**
 * Logs surrounding lines of a specified index for debugging.
 * 
 * @param {Array} arr - The array of lines.
 * @param {number} ix - The index to inspect.
 */
function around(arr, ix) {
    let low = Math.max(0, ix - 5);
    let high = Math.min(ix + 5, arr.length);
    for (; low < high; low++) {
        console.log('***: ', low, arr[low]);
    }
}

module.exports.genHTML = _genHTML;
