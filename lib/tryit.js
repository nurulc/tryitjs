const { asHTML } = require('./display-utils');
/**
 * Generates the HTML for a !tryit code block where users can execute scripts.
 * This HTML assumes Semantic UI is being used.
 * 
 * @param {string} codeContent - The code content to display in the textarea.
 * @param {number} index - The index of the try-it section.
 * @param {Object} options - Options for the try-it section.
 * @param {boolean} [options.fold=false] - Whether the code block should be folded by default.
 * @param {string} [options.title=""] - The title of the code block.
 * @returns {string} The HTML for the !tryit section.
 */
function tryit(codeContent, index, options = {}) {
    const { fold = false, title = "" } = options;
    const runTitle = getRunTitle(index);
    const endAnchor = `<a class="tryit-anchor" id="_end_tryit${index}">\n&nbsp;\n</a>`;
    const tryItContainer = `
        <a id="_tryit${index}">&nbsp;</a>
        <div class="html ui top attached segment tryit-container">
            <div class="tryit-inner ui sizer vertical segment" style="padding-top: 1.9rem; margin-bottom: -3.5rem">
                ${getCodeEditorSection(codeContent, index)}
                ${endAnchor}
                ${getOutputSection(index)}
            </div>
            ${getFooterSection(index, fold, runTitle, title)}
        </div>`;

    return tryItContainer;
}

/**
 * Generates the HTML for the code editor section.
 * 
 * @param {string} codeContent - The code content to display in the textarea.
 * @param {number} index - The index of the try-it section.
 * @returns {string} The HTML for the code editor section.
 */
function getCodeEditorSection(codeContent, index) {
    return `
            <div class="ui sizer vertical segment bottom" style="border-bottom: none;">
                <textarea class="tryit ui" id="tryit${index}">\n${asHTML(codeContent)}\n</textarea>
            </div>
            `;   
}

/**
 * Generates the HTML for the output section (display and error handling).
 * 
 * @param {number} index - The index of the try-it section.
 * @returns {string} The HTML for the output section.
 */
function getOutputSection(index) {
    return `
        <div id="tryit${index}-output" style="display: none;">
            <div id="tryit${index}-error" class="tryit-error"></div>
            <div id="tryit${index}-display" class="tryit-display rendered_html"></div>
        </div>`;
}

/**
 * Generates the HTML for the footer section containing controls like run, save, and fold buttons.
 * 
 * @param {number} index - The index of the try-it section.
 * @param {boolean} fold - Whether the code block should be folded.
 * @param {string} runTitle - Tooltip for the run button.
 * @param {string} title - Title of the code block.
 * @returns {string} The HTML for the footer section.
 */
function getFooterSection(index, fold, runTitle, title) {
    const foldCode = getFoldIconHTML(fold);
    const runButtonHTML = getRunButtonHTML(index, runTitle);
    const jumpNextButtonHTML = getJumpNextButtonHTML(index);
    const jumpBackButtonHTML = getJumpBackButtonHTML();
    const titleHTML = getTitleHTML(title);
    const saveButtonHTML = getSaveButtonHTML(index);

    return `
        <div class="ui top attached label tryit-header">
            ${foldCode}
            ${runButtonHTML}&nbsp;
            ${jumpNextButtonHTML}&nbsp; 
            ${jumpBackButtonHTML}
            ${titleHTML}&nbsp; 
            ${saveButtonHTML}
        </div>`;
}

/**
 * Generates the HTML for the fold/unfold icon in the footer.
 * 
 * @param {boolean} fold - Whether the code block should be folded.
 * @returns {string} The HTML for the fold/unfold icon.
 */
function getFoldIconHTML(fold) {
    const foldDirection = fold ? 'right' : 'down';
    const foldTooltip = fold ? 'Show Code' : 'Hide Code';
    return `<i class="caret square ${foldDirection} icon large" title="${foldTooltip}"></i>`;
}

/**
 * Generates the HTML for the run button.
 * 
 * @param {number} index - The index of the try-it section.
 * @param {string} runTitle - Tooltip for the run button.
 * @returns {string} The HTML for the run button.
 */
function getRunButtonHTML(index, runTitle) {
    const buttonColor = index > 1 ? 'yellow' : 'green';
    return `
        <button id="tryit${index}-run" data-tooltip="${runTitle}" class="ui ${buttonColor} right labeled icon button exec">
            <i class="caret square right icon"></i> Run
        </button>`;
}

/**
 * Generates the HTML for the jump to next section button.
 * 
 * @param {number} index - The index of the try-it section.
 * @returns {string} The HTML for the jump to next section button.
 */
function getJumpNextButtonHTML(index) {
    return `
        <button id="jump_tryit${index + 1}" class="circular ui icon yellow button jump_next">
            <i class="icon angle double down"></i>
        </button>`;
}

/**
 * Generates the HTML for the jump back button.
 * 
 * @returns {string} The HTML for the jump back button.
 */
function getJumpBackButtonHTML() {
    return `
        <button class="circular ui icon button green jump_back">
            <i class="icon angle double up"></i>
        </button>`;
}

/**
 * Generates the HTML for the title of the try-it section.
 * 
 * @param {string} title - The title of the code block.
 * @returns {string} The HTML for the title if provided, otherwise an empty string.
 */
function getTitleHTML(title) {
    if (!title) return '';
    return `<div class="center try-title">${title}</div>`;
}

/**
 * Generates the HTML for the save button in the footer.
 * 
 * @param {number} index - The index of the try-it section.
 * @returns {string} The HTML for the save button.
 */
function getSaveButtonHTML(index) {
    return `
        <button id="save_${index}" data-tooltip="Save all user modifications" class="ui right floated button circular icon green save_data">
            <i class="save icon"></i>
        </button>`;
}


/**
 * Returns the tooltip for the run button, based on whether previous scripts need to be executed first.
 * 
 * @param {number} index - The index of the try-it section.
 * @returns {string} The tooltip text for the run button.
 */
function getRunTitle(index) {
    return index > 1 ? 'Execute Script, (execute all previous first)' : 'Execute script (Ctrl+Enter)';
}

module.exports = tryit;