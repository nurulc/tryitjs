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


function genSampleFiles(baseDir, packageName){
saveData([`${baseDir}/index.try`,`!head
    <title>TryIT ${packageName}</title>
    @@include includes/head.try
!md // Some markdown
    # Introduction


    This a introduction to package ${packageName}. The purpose of the package is to provide the following
    functionality:

    ## The first sample
    The descriptions given in the subsequest page will document functions and classes with sample code
    that will demonstrate hos to use the dunctionality provided by this package.

    The code below is an example of some sample code and how yo cal edit the code to explore the functionality

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

!html
    <form class="ui form">
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
    </form>
!md
    ### Note abou UI

    Note the UI above does not do anything, we need to wire this up. We can do the wiring using the code in the given in the script below. As
    stated earlier, Tryitjs using Semantic-UI and jQuery to provide functionality. We can take advantage of this to wire up the form above. After
    you have executed that script the form will acquire the necessary functionality.

!tryit
    // Non wire up the form above
    $('#val_exec').on('submit', () => {
        let list = $('#val_array').val().split(/ *,/);
        let search = list.indexOf($('#val_search').val());
        $('#val_resuly').val(''+search);



!md
    @@include main/index.try
    
!end
    <script>
      console.log('loaded');
    </script>
`], false, true);

saveData([`${baseDir}/main/index.try`,`
@@include page1.try
@@include page2.try

`], false, true);
    
saveData([`${baseDir}/main/page1.try`,`
!md
    # Page 1

    This is page1

!tryit
    array.filter(v => v&1);  // print odd values
`], false, true); 
saveData([`${baseDir}/main/page2.try`,`
!md
    # Page 2

    This is page2

!tryit
    array.filter(v => (v&1)===0);  // print even values
`], false, true);

saveData([`${baseDir}/includes/head.try`,`
    <!-- This is come additional head items -->
    <!-- We include lodash to demonstrate how a library can be included -->
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js"></script>
`], false, true);
}

module.exports = genSampleFiles;