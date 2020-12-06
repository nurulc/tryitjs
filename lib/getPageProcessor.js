/**
 *  Create pages from the try information
 *
 *  usage:
 *
 *  const pp = pageProcessor();
 *
 *  tryAST.map(([type,str]) => type   )
 *
 *
 * 
 */
module.exports  = () => {
    const addSection = page(addNextPrev);

    return function (string) {
        if(arguments.length === 0 ) return addSection();
        return string.split('\n').flatMap(addSection).join('\n');
    };
    // ==================
    function  addNextPrev(counter, hasNext) {
        return ('\n'+(counter===1? 
                      ''
                      : `<button class="ui button page_prev" data-page="${counter-2}">Prev</button>`
                      ) +
                     (hasNext ? 
                        `<button class="ui button page_next" data-page="${counter}">Next</button>`:
                      ''
                     )+"<br/><br/>"
        );
    }

};

//=============== utility ============
function page(nextPrev) {
    let prevSectionName;
    let counter = 0;
    let inCodeSection = false;   // line starts with ```  we toggle thi value
    return (line => {
        if(line === undefined) { // last thing to perform
            //console.log('end-all', {prevSectionName,counter});
            return endTheLastPage(prevSectionName,counter,false);
        }
        
        let stripped = line.trim();
        let op = stripped.substr(0,2).trim();
        if(stripped.startsWith('```')) inCodeSection  = !inCodeSection;

        
        if(  !inCodeSection && op[0]==='#' && op[1] !== '#' ) {
            let end = endTheLastPage(prevSectionName,counter, true);
            
            let res = [ (end +' ' + 
                         `<div id="page${counter-1}" class="try-page" data-pagevisible="${'true'/*!(prevSectionName)*/}">`
                        ),
                       line 
                      ];
            counter++;
            prevSectionName = stripped;
            return res;
        }
         return line;
        function endTheLastPage(next,counter,hasNext) {
            //console.log("endLast", {next,counter,hasNext});
            if(next === undefined) return '';
            return nextPrev(counter,hasNext)+'</div> <!--- '+ next.substr(1).replace(/>/g, '&gt;') + '  @@END_PAGE@@ -->'
        }
    })
}