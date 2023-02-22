/**
 * [tryit_new description]
 * @param  {[type]} x  [description]
 * @param  {[type]} ix [description]
 * @return {[type]}    [description]
 */
function tryit_new(x,ix) {
    let run_title = ix>1?"Script not ready - Execute 'tryit' scripts above first":"Execute script"
    const {a,div, textarea, button, i} = $$$;
    return (
            a({id: "_tryit"+ix},"&nbsp;")+
            div( {class: "html ui top attached segment tryit-container"},
              div( {class: "ui sizer vertical segment", style: "font-size: 1rem; padding-top: 2rem;"},
                div( {class: "ui sizer vertical segment bottom"},
                   textarea( {class: "tryit ui", id: "tryit"+ix}, asHTML(x) )
                ),

                a( {id: "_end_tryit"+ix}, "&nbsp;" ),

                div( {id: "tryit"+ix+"-error", class: "tryit-error"},
                    div( {id: "tryit"+ix+"-display", class: "tryit-display rendered_html"}),
                ),

                div( {class: "ui top attached label"},
                    button( 
                      { id: "tryit" +ix+ "-run", 
                        "data-tooltip": run_title, 
                        class:"ui "+ (ix>1?'yellow':'green')+ " right labeled icon button exec"
                      },
                      i( {class: "caret square right icon"}),
                      "Run"  
                    ), "&nbsp;",

                    button( 
                      {
                        id: "jump_tryit"+ (ix+1), 
                        class:"circular ui icon yellow button jump_next"
                      },
                      i( {class: "icon angle double down"}) 
                    ),
                    button( 
                      {
                        id: "jump_tryit" + (ix+1), 
                        class:"circular ui icon yellow button jump_back"
                      },
                      i( {class: "icon angle double up"}) 
                    ),
                    button( 
                      {
                        id:   "ra_" + (ix+1), 
                        class: "ui right floated button circular icon green run_all",
                        "data-tooltip": "Execute all scripts above"
                      },
                      i( {class: "fast backward icon"}) 
                    ),
                    button( 
                      {
                        id:   `save_${ix}`, 
                        class: "ui right floated button circular icon green save_data",
                        "data-tooltip": "Save your changes"
                      },
                      i( {class: "save icon"}) 
                    ),
                  
                )
              ) 
            )
    ); 
}

module.exports.tryNew = tryNew;