//genSampleFiles.js
//
const fs = require('fs');
const {saveData} = require('../lib/fileio');

// function saveData([location, text], mayOverwrite=false, doNotChange=false) {
//  if(fs.existsSync(location)) {
//      console.log("file already exists");
//  }
//  console.log('saveToFile:', location, {mayOverwrite, doNotChange});
//  console.log('content:', text);
// }


function genSampleFiles(baseDir, packageName,targetDir){
saveData([`${baseDir}\/default.html`, `<meta http-equiv="refresh" content="0; URL=${targetDir}/index.html" />`])
saveData([`${baseDir}/index.try`,`!head
    <title>TryIT ${packageName}</title>
    @@include ASSETS/frame.try
    @@include includes/head.try

!md // Some markdown
    # Introduction


    This a introduction to package ${packageName}. The purpose of the package is to provide the following
    functionality:

    ## The first sample
    The descriptions given in the subsequest page will document functions and classes with sample code
    that will demonstrate hos to use the dunctionality provided by this package.

    The code below is an example of some sample code and how yo cal edit the code to explore the functionality

    You can view your tryit files here: <a href="fileview/index.html" >View .try file</a>

!tryit /* some sample code */
    // This is an example of the playpen (tryit)

    var array = [1,2,3,4,5];        // note var x makes 'x' global, while let y.. 'y' is local to this small script
    let val = 4;                    // val is local to this script
    
    $$.D('array', array);           // this will display the array
    let ix = array.indexOf(val);    // note 'ix' is local to thi script
    
    $$.D("index",ix, "for value:", val, "in array", array);  // Final display


!md
    ## The next example

    This is amother example to show that data in a previous script can be used is subsequent scripts.

!tryit
    // 'ix' and 'val' were local to the previous script, while 'array' can be used in this and subsequent scripts  
    array.map(x => x*2);    // The last expression will be displayer
!md
    ## Creating a UI example

    This will demonstrate how to create a 'user interface' (UI) for same code (using Semantic-UI - _The default for Tryitjs):


!md
    ## Setup Event handler for UI

    Below is a script to create a function to setup handler of the a form. The wlwmenets of the form:

    
    |   ID       |  Action     |
    |------------|-------------|
    |   val_exec |  button when clicked will splits works |
    |  val_fill |   button to fill #val_array and #val_search with test values |






!tryit
    // Now wire up the form above
    function setHandlers() {
        $('#val_exec').on('click', (e) => {
            e.preventDefault();
            let content = $('#val_array').val();
            
            if(content.trim()) {
                    let list = content.split(/ *, */);
              let item = $('#val_search').val();
              let search = list.indexOf(item);
              $('#val_result').val('index: '+(search==-1?"Not found":\`"\${item}" found at index: \${search}\`));
            }
            else $('#val_result').val('Enter come values')
        });
    
        $('#val_fill').on('click', (e) => {
            e.preventDefault();
            $('#val_array').val("To, be, or, not, to, be");
            $('#val_search').val("be");
            $('#val_result').val("");
         });
    }


!md
    ### Note about UI

    Note the UI below does not do anything, we need to wire this up. We can do the wiring using the code in the given in the script below. As
    stated earlier, Tryitjs using Semantic-UI and jQuery to provide functionality. We can take advantage of this to wire up the form above. After
    you have executed that script the form will acquire the necessary functionality.

!tryit
    // Apply the handler to the form below
    setHandlers();

!html
    <form class="ui form" id="my_form">
      <div class="field">
        <label>Array of values</label>
        <input type="text" id="val_array" placeholder="To, be, or, not, to, be">
      </div>
      <div class="field">
        <label>Value to find</label>
        <input type="text" id="val_search" placeholder="not">
      </div>
      <div class="field">
          <input type="text" id="val_result">
          <label>Index of Value</label>
      </div>
      <button class="ui button" id="val_exec">Execute</button>
      <button class="ui button" id="val_fill">Fill some values</button>
    </form>

!md
    ### Updating UI

    We cam reset the form using the code given below 

!tryit
    var innerData = \`
      <div class="field">
        <label>UPDATED: Array of values</label>
        <input type="text" id="val_array" placeholder="To, be, or, not, to, be">
      </div>
      <div class="field">
        <label>Updated: Value to find</label>
        <div class="ui icon input">
            <i class="search icon"></i>
            <input type="text" id="val_search" placeholder="Search...">
        </div>
      </div>
      <div class="field">
          <input type="text" id="val_result">
          <label>Index of Value</label>
      </div>
      <button class="ui green button" id="val_exec">Execute&nbsp;&nbsp;<i class="search icon"></i></button>
      <button class="ui blue button" id="val_fill">Fill some values</button>
    \`;

    let form = document.getElementById('my_form')
    form.innerHTML = innerData;
    form.style.width = "60%";
    setHandlers();


!md
    @@include main/index.try
    
!end
    <script>
      console.log('loaded');
    </script>
`], false, true);

saveData([`${baseDir}/main/index.try`,`
@@include page2.try
@@include page3.try

`], false, true);
    
saveData([`${baseDir}/main/page2.try`,`
!md
    # Page 2 - Printing results

    ## Simplest way to print

    The result of the last expression of a 'script is always ptinted'. For Example:
!tryit
    Math.sin(Math.PI/2) // should print '1'

!md
    ## Handling Promis during printing

    If the last expression is a Promise, it will be resolved before printing the resolved value. So lets get some data from the internet,
    data about covid worldwide.

!tryit

    var csvData;
    let WORLD_COVID_DATA ='https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv';
    var p = fetch(WORLD_COVID_DATA)
      .then(response => response.text())
      .then(data => 
          Promise.resolve(csvData = data)
      );
      p // contents of the promise will be printed out

!md
    __Note: any \`promise\` that is displayed is also resolved before the next 'tryit' script is executed.

!md
    ## On declaring variables

    1. Use 'let' to declare variables local to the script
    2. Use 'var' to declare variable that are shared between scripts

    To convert the srring to useful data - using 
    <a href="https://nurulc.github.io/frame/tryit/data-frame-examples.html#page1" target="_blank">Frame</a>

!tryit
    //
var {Frame,csvLine} = DataFrame; // tool for dealing with large amounts of data
   let lines = csvData.split('\\n').map(csvLine);
   var covidFrame = new Frame(lines.slice(1), lines[0]);
   covidFrame
!md
    ## Printing from anywhere is a script

    1. \`$$.D(exp1,...)\` will print one or more arguments
    1. \`$$.D2(string)\` will evaluate (execute) \`string\` as a javascript expression and print the string as well as the resulting value
    1. \`$$.HTML(htmlString)\` will render the HTML in the output area
    1. \`$$.json(exp)\` convert the \`expr\` to JSON and print the results

!tryit




`], false, true); 
saveData([`${baseDir}/main/page3.try`,`
!md
    # Page 3

    This is page3

!tryit
    array.filter(v => (v&1)===0);  // print even values


`], false, true);

saveData([`${baseDir}/includes/head.try`,`
    <!-- This is come additional head items -->
    <!-- We include lodash to demonstrate how a library can be included -->
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js"></script>
`], false, true);

saveData([`${baseDir}/fileview/index.try`,`
!head
  <title>Browse Try Files</title>
  @@include ASSETS/file-tree.try
  
!md
    # Files Used In This Project

    This section will allow you to explore files In this project. The file browser below uses a JSON file created by TryITJs.
    executed in your project root directory:


    ## Generating the meta-data for the file browser.

    The command below id it is executed in to generate the file filelist.json

    \`\`\`bash
    tryitjs  --src try_src --dest try_it  --filelist
    \`\`\`
    1. **--src** is the location of the source directory
    2. **--dest** is the directory where the generated HTML file are located
    3. **--filelist** will generate a JSON file listing all the files in the source directory (try_src)
    

    * filelist.json 


    \`\`\`js
    @@include ESCAPE ../../${targetDir}/filelist.json
    \`\`\`
    <br>

    ## The File Browser

    This file is read and displayed in the file browser interface below. You can use the interface to inspect all the files use on this site.
    If none of this makes sense to you, don't worry; as you go thorugh this tutorial I hope it will make more sense.
    ## List of files


    @@include ASSETS/file-tree-body.try

!end
`], false, true);
}

module.exports = genSampleFiles;