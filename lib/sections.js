
module.exports.sections = function (lines) {
    let lastLine = '';
    var [list, type, agg] = lines.reduce( ([list, type, agg], line) =>{
        if(line.match(/^(![a-z]+|!--)/)) {
           if(agg) list.push([type, agg]);
           lastLine="";
           return [list, line, ''];
        }
        if(line === '' && lastLine === '') {
            line = '';
        } else {
            lastLine = line.trim();
            line = (agg?'\n':'')+line;
        }
        return [list, type, agg+line];
    }, [[], '!html', '']);
    if(type === '!end' || agg) list.push([type, agg]);
    return list;
} 