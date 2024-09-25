

  // Extend JavaScript hinting to include user-declared variables/functions
  /**
   * Custom hint function that provides autocomplete suggestions for both
   * standard JavaScript functions and user-declared variables/functions.
   *
   * @param {CodeMirror.Editor} cm - The active CodeMirror instance.
   * @returns {Object} - Returns an object containing the list of suggestions.
   */
  function customHint(cm) {
    var cur = cm.getCursor();
    var token = cm.getTokenAt(cur);

    // Get the default JavaScript hints
    var defaultHints = CodeMirror.hint.javascript(cm) || { list: [] };

    // Extract declared variables/functions from the editor content
    var userDeclarations = extractDeclarations(cm.getValue());

    // Add custom hints (user-defined variables/functions)
    defaultHints.list = defaultHints.list.concat(userDeclarations);

    return defaultHints;
  }

  // Function to extract user-declared variables/functions
  /**
   * Extracts user-declared variables and functions from a given code string.
   * It supports the extraction of `var`, `let`, `const`, and function declarations.
   *
   * @param {string} code - The code string to parse for declarations.
   * @returns {string[]} - An array of variable and function names found in the code.
   */
  function cmExtractDeclarations(code) {
    var declarations = [];
    var varRegex = /var\s+(\w+)/g;
    var funcRegex = /function\s+(\w+)/g;
    var letConstRegex = /(let|const)\s+(\w+)/g;

    var match;
    while ((match = varRegex.exec(code)) !== null) {
      declarations.push(match[1]);
    }

    while ((match = funcRegex.exec(code)) !== null) {
      declarations.push(match[1]);
    }

    while ((match = letConstRegex.exec(code)) !== null) {
      declarations.push(match[2]);
    }

    return declarations;
  }

  // Set the custom hint as the hint function for CodeMirror
  editor.on("keyup", function(cm, event) {
    if (!cm.state.completionActive && event.key !== "Enter") {
      CodeMirror.showHint(cm, customHint);
    }
  });
