

const mainMenu = `
<div class="ui right dropdown item">
    Options
    <i class="dropdown icon"></i>
    <div class="menu tryit_main">
      <div class="item save_all">Save All Changes</div>
      <div class="item revert_changes">Revert changes</div>
      <div class="item clear_storage">Delete All Changes</div>
    </div> 
  </div>
`;

const progressHTML = `
<div class="execution progress" 
     style="display: none;">
<div class="title">Executing previous dependent scripts</div> 
<div class="ui indicating progress" id="execution_progress">

  <div class="bar" >
    <div class="progress"></div>
  </div>
  <div class="label">Waiting to execute</div>
</div>
</div>
<div class="page-change" style="display: none">
<p class="tag-name" id="tag_name"></p>
</div>
`;

const bodyStart = (toc) =>(
`<div class="ui sidebar inverted vertical menu toc-area">
<div class="item"> <a href="https://github.com/nurulc/tryitjs" target="_blank"><img src="https://unpkg.com/tryitjs/tryit-small.png" title="Built using TryItJs"></a></div> 
<div class="item">${mainMenu}</div>
<div class="item toc_title">Contents</div>
${toc}
      </div>
      <div class="pusher">
      <div class="ui grid">
    <div class="two wide column" > <!--onclick="toggle()*/''}" title="Click to show sidebar"> -->
      <p class="click_me" onclick="toggle()">Click to show TOC</p>
    </div>
    <div class="thirteen wide column" id="tryit_body">
`
  )
const bodyEnd = version => (
` 
       </div>
     </div>
  </div>
`
);


// const highlighter = (`
// 	document.addEventListener('DOMContentLoaded', (event) => {
//   	document.querySelectorAll('pre code').forEach((block) => {
//     		hljs.highlightBlock(block);
//   		});
// 	});
// `)






module.exports = { mainMenu, progressHTML, bodyStart, bodyEnd/*, highlighter*/ };
//module.exports.getIncludesPromise = getIncludesPromise;


