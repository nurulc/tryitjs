//genSampleFiles.js
//
//const {saveData} = require('../lib/fileio');

function saveData([location, text], mayOverwrite=false, doNotChange=false) {
	if(fs.existsSync(location)) {
		console.log("file already exists");
	}
	console.log('saveToFile:', location, {mayOverwrite, doNotChange});
	console.log('content:', text);
}


function genSampleFiles(baseDir, packageName){
saveData([`${baseDir}/index.try`,`!head
    <title>TryIT ${packageName}</title>
    @@include includes/head.try
!md // Some markdown
    # Introduction
    This a introduction to package ${packageName}. The purpose of the package is to provide the following
    functionality...

    The descriptions given in the subsequest page will document functions and classes with sample code
    that will demonstrate hos to use the dunctionality provided by this package.

    The code below is an example of some sample code and how yo cal edit the code to explore the functionality

!tryit /* some sample code */

    // This is an example to the playpen (tryit)
    var array = [1,2,3,4,5];  // note var x makes 'x' global, while let y.. 'y' is local to this small script
    
    $$.D('array', array); // this will display the array
    let ix = array.indexOf(2);  // note 'ix' is local to thi script
    
    ix;  // the last expression is always displayed

!md
    ## One more example

    This is amother example to show that data in a previous script can be used is subsequent scripts.

!tryit
    // 'ix' was local to the previous script, while 'array' can be used in this and sebsequent scripts  
    array.map(x => x*2); 

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