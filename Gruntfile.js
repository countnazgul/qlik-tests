 module.exports = function (grunt) {

    grunt.initConfig({
        convert: {
			options: {
				explicitArray: false,
			},
			xml2json: {
				files: [
					{
						expand: true,
						src: ['DocProperties.xml'],
						dest: '',
						ext: '.json'
					}
				]
			},
		}  		
    });

	grunt.loadNpmTasks('grunt-convert');
	grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ["convert", "checkGenerateLog"]);
	grunt.registerTask('convertFiles','', function() {
		
		
	});
	
	
	grunt.registerTask('generateLogFile', 'do some stuff.', function() {
	  mapping = grunt.file.readJSON('DocProperties.json');
	  generateLogFile = mapping.DocProperties.GenerateLogfile;
	  
	  if(generateLogFile == "false") {
		grunt.fail.warn('Log file is NOT going to be generated after reload!')
	  } else {
		grunt.log.ok('Log file will be generated upon reload')  
	  }
	});	
	
	grunt.registerTask('emptyModule', 'do some stuff.', function() {
		module = grunt.file.read('../test-prj_original/Module.txt')
		if( module.length > 0 ) {
			grunt.fail.warn('Macro module is used!');
		} else {
			grunt.log.ok('Macro module is empty');
		}
	  

	});		
};