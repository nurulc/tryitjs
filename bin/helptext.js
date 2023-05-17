/**
 * The simple documentation language syntax used in the comments is as follows:
 * #title - Indicates the title of the help section. The content after #title represents the title string.
 * 
 * #opt - Represents an option description. The content after #opt represents the option text.
 * 
 * #examples - Marks the start of the examples section.
 * 
 * [code for example] - Represents the start of a new example. The content within [...] represents the example code. Text after the [...] is the description for the example.
 * 
 * Regular text comments provide additional explanations and clarify the purpose of specific sections.
 */

const fs = require('fs'); 
const chalk = require('chalk');
 /**
 * Displays the help information read from a text file with specified formatting.
 *
 * @param {string} helpFilePath - The path to the help text file.
 * @returns {string} The formatted help information as a string.
 */
function showHelp(helpFilePath) {
  // Read the help text from the file
  const helpText = fs.readFileSync(helpFilePath, 'utf8');

  // Split the text into individual lines
  const lines = helpText.split('\n');

  // Variable to store the formatted help information
  let helpString = '';

  // Flag to indicate if we are in the examples section
  let inExamplesSection = false;
  let padLength = 0;
  const PD = (str,padd='       ') => padRight(padd+str, padLength);
  // Process each line of the help text
  lines.forEach(line => {
    if (line.startsWith('#title')) {
    	inExamplesSection = false;
    	padLength = 0;
      // Extract the title and format it with bold style
      const title = line.substring('#title'.length).trim();
      helpString += chalk.bold(title) + '\n\n';
    } else if (line.startsWith('#opt')) {
      inExamplesSection = false;
      padLength = 30;
      // Extract the option and description
      const opt = line.substring('#opt'.length).trim();
      const [option, description] = splitOnWhitespace(opt); // Split on first space or tab

      // Format the option and description with yellow color
      helpString += chalk.yellow(PD(option)) + ' - ' + (description||'') + '\n';
    } else if (line.startsWith('#examples')) {
      // Start of the examples section
      inExamplesSection = true;
      padLength = 30;
      helpString += '\n' + chalk.bold('Examples:') + '\n';
    } else if (inExamplesSection) {
      const exampleLine = line.trim();
      if (exampleLine.startsWith('[')) {
        const [exampleCode, exampleDescription] = extractExampleCode(exampleLine);
        padLength = 30;
        helpString += chalk.cyan(PD(exampleCode)) + ' ' + exampleDescription + '\n';
      } else {
        helpString += PD(exampleLine,'') + '\n';
      }
    } else {
      // Regular text outside of examples section
      helpString += PD(line,'') + '\n';
    }
  });

  // Return the formatted help information
  return helpString;
}

/**
 * Extracts the example code from a line starting with '['.
 *
 * @param {string} line - The line containing the example code.
 * @returns {string} The extracted example code.
 */
function extractExampleCode(line) {
  let code = '';
  let nestedBracketCount = 0;
  let i = 1;

  while (i < line.length) {
    if (line[i] === '[') {
      nestedBracketCount++;
    } else if (line[i] === ']') {
      if (nestedBracketCount === 0) {
        break;
      }
      nestedBracketCount--;
    }

    code += line[i];
    i++;
  }

  return [code.trim(), line.substr(i+1).trim()];
}

/**
 * Splits a string into two parts based on the first occurrence of a space or tab character.
 *
 * @param {string} input - The input string to split.
 * @returns [left,right] An array containing the left side and right side of the split string.
 */
function splitOnWhitespace(input) {
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === ' ' || char === '\t') {
      const leftSide = input.substring(0, i);
      const rightSide = input.substring(i + 1);
      return [leftSide, rightSide];
    }
  }
  return  [input, ''];
}

/**
 * Pads a string on the right side with a specified character to make it a certain length.
 *
 * @param {string} input - The input string to pad.
 * @param {number} length - The desired length of the padded string.
 * @param {string} [padChar=' '] - The character used for padding. Defaults to a space.
 * @returns {string} The padded string.
 */
function padRight(input, length=30, padChar = ' ') {
  if (input.length >= length) {
    return input;
  }

  const paddingLength = length - input.length;
  const padding = padChar.repeat(paddingLength);
  return input + padding;
}




module.exports = showHelp;