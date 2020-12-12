
function capitalize (value) {
  return  value.split(' ')
                  .map(wordCap)
                .join(' ')
}

function wordCap(word) {
  if(!word) return '';
  return word.charAt(0).toUpperCase() + word.substr(1)
}
