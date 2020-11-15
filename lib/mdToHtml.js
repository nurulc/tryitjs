const showdown = require('showdown');


/**
 * [mdToHtml description]
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
function mdToHtml(x) {
    var converter = new showdown.Converter();
    let html = converter.makeHtml(x);
    return html.split('\n')
        .map(fixPageMarker)
        .join('\n');
}

function fixPageMarker(line) {
  if( findStr(line, 'class="try-page"') || findStr(line, ' @@END_PAGE@@ ') ) {
    return line.replace(/<p>/g,"").replace(/<\/p>/g,"");
  }
  else return line;
}

function findStr(line, strToFind) {
  return line.indexOf(strToFind) !== -1;
}

module.exports.mdToHtml = mdToHtml;
