
function capitalize (value) {
  return  value.trim()
               .split(' ')
                  .map(s => s.charAt(0).toUpperCase() + s.slice(1))
               .join(' ')
}
