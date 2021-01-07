const showdown = require('showdown');


/**
 * [mdToHtml description]
 * @param  {[type]} x [description]
 * @return {[type]}   [description]
 */
function mdToHtml(x) {
    var converter = new showdown.Converter({tables: true, strikethrough: true, literalMidWordUnderscores: true});
    //converter.setFlavor('github');
    x = x.replace(/<div([^>]*)>/g, "@@DIV $1@@VID")
    let html = converter.makeHtml(x);
//    if(html.indexOf('@@DIV') !== -1 ) console.log(html,'\n\n' );
    html = html.replace(/@@DIV([^@]*)@@VID/g, '<div $1>');

    //console.log('MD_TO_HTML', html);
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
