# qlik-tests (Qlikview only ... for now)

### Why?
Sometimes I'm leaving some dev code in pruction apps (not on purpose) and I've wanted a way to check the app before move it to the live environment. For this reason this small `Grunt` script was created. At the moment the script check for the following items:

  * localPath - loading data from local drives (c:, d: etc)
  * macroOnOpen - no mactos are being set on open event
  * macroOnPostReload - no macros are being set on post reload event
  * macroModule - macro module should be empty
  * generateLogFile - should have "Generate log file" checked
  * synKeys - are there any synth keys in the data model

### Install 
  * clone this repo `git clone https://github.com/countnazgul/qlik-tests.git`
  * open cmd and navigate to the folder where the repo is cloned
  * run `npm install`
    
### Usage
(Before use it make sure that `-prj` folder is created and populated)

The gruntfile accept one command line argument: `--source`. This argument defines the path to the `-prj` folder where the xml 
files are. For example if the `-prj` path is `c:\projects\myFirstProject\myapp-prj` then the grunt command will look like:

`grunt default --source=c:\projects\myFirstProject\myapp-prj`

This will run all the tests and will stop on the first test that fails (or all of them are passed). If you want to run all the tests
at once (ignoring the failings) use the `--force` option as well:

`grunt default --force --source=c:\projects\myFirstProject\myapp-prj`

### Example output (using `--force`)


    Running "default" task
    
    Running "clean:folder" (clean) task
    >> 1 path cleaned.
    
    Running "mkdir:all" (mkdir) task
    Creating "files/0qQeb"...OK
    
    Running "copy:main" (copy) task
    Copied 4 files
    
    Running "convert:xml2json" (convert) task
    >> File files/0qQeb/DocProperties.json converted. OK
    >> File files/0qQeb/AllProperties.json converted. OK
    
    Running "localPath" task
    >> No local paths in script
    OK
    
    Running "macroOnOpen" task
    >> No macro OnOpen
    OK
    
    Running "macroOnPostReload" task
    >> No macro OnPostReload
    OK
    
    Running "macroModule" task
    >> Macro module is empty
    OK
    
    Running "generateLogFile" task
    Warning: Log file is NOT going to be generated after reload! Used --force, continuing.
    
    Running "synKeys" task
    >> No synthetic keys
    OK
    
    Running "clean:folder" (clean) task
    >> 1 path cleaned.


As you can see only one task not ok `generateLogFile`
