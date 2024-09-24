const {version} = require('../package.json');
 /**
  * Split the string by new line, trim each line and join them back
  * 
  * @param {string} s 
  * @returns string
  */
function RI(s) {
    return s.split('\n').map(x => x.trim()).join('\n');
}
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
    function addNextPrev(counter, hasNext, version) {
        return RI(`
            <br/><hr /><hr />
            <div class="verybottom">
                ${generatePrevButton(counter)}
                ${generatePageNumber(counter)}
                ${generateNextButton(counter, hasNext)}
            </div>
            <br/><br/>
            ${generateFooter(version)}
        `);
    }
    // ==================
        function generatePrevButton(counter) {
            if (counter === 1) {
                return '';
            }
            return RI(`
                <span style="float: left">
                    <button class="large ui left floated blue labeled icon button page_prev" data-page="${counter - 2}">
                        <i class="left arrow icon"></i> Prev
                    </button>
                </span>
            `);
        }
        function generatePageNumber(counter) {
            return `<div class="pagenum">Page - ${counter}</div>`;
        }
        function generateNextButton(counter, hasNext) {
            if (!hasNext) {
                return '';
            }
            return RI(`
                <span style="float: right">
                    <button class="ui large right labeled icon green button page_next" data-page="${counter}">
                        Next <i class="right arrow floated icon"></i>
                    </button>
                </span>
            `);
        }
        function generateFooter(version) {
            return RI(`
                <div class="verybottom">
                    <div class="page-footer">
                        <a href="https://github.com/nurulc/tryitjs" target="_blank">
                            <i class="tiny black">Built with TryITjs (v${version})</i>
                            <i class="small red external alternate icon"></i>
                        </a>
                    </div>
                </div>
                <br/><br/>
            `);
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
            //console.log('****',end);
            let res = [ (end +' ' + 
                         `<div id="page${counter-1}" class="try-page" data-pagevisible="false">`
                         //`<div id="page${counter-1}" class="try-page" data-pagevisible="${!(prevSectionName)?'true':'false'}">`
                         //`<div id="page${counter-1}" class="try-page" data-pagevisible="${'true'}">`
                        ),
                       line 
                      ];
            counter++;
            prevSectionName = stripped;
            return res;
        }
         return line.replace(/&#64;/g, "@").replace(/"&#96;/g, '`');
        function endTheLastPage(next,counter,hasNext) {
            //console.log("endLast", {next,counter,hasNext});
            if(next === undefined) return '';
            return nextPrev(counter,hasNext)+'</div> <!--- '+ next.substr(1).replace(/>/g, '&gt;') + '  @@END_PAGE@@ -->'
        }
    })
}