function Identity(a) { return a; }


function tee(x, msg) { console.log(x, msg || ''); return x; }

function show_bytes_read(data) {
  log(data.length / (1024 * 1024), 'MB read');
}


function asHTML(x) {
   return x.replace(/&/g, '~AMP~').replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/~AMP~/g,"&amp;")
}


function round(v) { return isNaN(+v) ? '' : Math.round(v * 10000.0) / 10000.0; }
function round2(v) { return isNaN(+v) ? '' : Math.round(v * 100.0) / 100.0; }

module.exports = {
  Identity: Identity,
  tee: tee,
  show_bytes_read: show_bytes_read,
  asHTML: asHTML,
  round: round,
  round2: round2
}