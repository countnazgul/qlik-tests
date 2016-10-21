module.exports = function (grunt) {

	//files = [];
	targetDir = '';

	grunt.initConfig({
		convert: {
			options: {
				explicitArray: false,
			},
			xml2json: {
				files: [
					{
						expand: true,
						//flatten: true,
						//cwd: '<%= source %>',
						src: '<%= files %>',
						dest: '',
						ext: '.json'
					}
				]
			},
		},
		mkdir: {
			all: {
				options: {
					create: '<%= targetDir %>'
				},
			},
		},
		clean: {
			folder: '<%= targetDir %>'
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: '<%= source %>',
						src: '<%= filesToCopy %>',
						dest: '<%= targetDir1 %>',
						filter: 'isFile'
					},
				],
			},
		},
	});

	function makeid() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < 5; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	}

	grunt.loadNpmTasks('grunt-convert');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('celanTempDir', '', function () {
		grunt.config.set('targetDir', '9ra4i');
		grunt.task.run('clean');
	});

	grunt.registerTask('tempDir', '', function () {
		targetDir = makeid();
		console.log(targetDir)
		grunt.config.set('targetDir', [targetDir]);

		//files = ['DocProperties.xml', 'AllProperties.xml'];
		grunt.task.run('mkdir');
	});

	grunt.registerTask('convert1', '', function () {

		//files = ['./Eu6V9/DocProperties.xml', './Eu6V9/AllProperties.xml'];
		//grunt.config.set('files', files);

		//files = ['DocProperties.xml', 'AllProperties.xml'];
		//grunt.task.run('convert');
	});

	grunt.registerTask('default', '', function () {

		source = grunt.option('source');
		console.log(source)
		//source = source.replace(/\\/g, '/');
		//source = '/' + source.replace(/:/g, ':');
		//console.log(source)
		//source = 'C:/Users/Home/Documents/test1/test-prj';

		targetDir = makeid();
		//targetDir = 'JM2AQ'

		grunt.config.set('targetDir', ['files/' + targetDir]); //[targetDir]
		grunt.config.set('targetDir1', 'files/' + targetDir);
		grunt.config.set('source', source);

		files = ['./' + targetDir + '/DocProperties.xml', './' + targetDir + '/AllProperties.xml'];
		filesToCopy = ['DocProperties.xml', 'AllProperties.xml', 'LoadScript.txt', 'Module.txt'];

		grunt.config.set('filesToCopy', filesToCopy);
		grunt.config.set('files', files);

		grunt.task.run('mkdir');
		grunt.task.run('copy');
		grunt.task.run('convert');
		grunt.task.run('localPath');
		grunt.task.run('macroOnOpen');
		grunt.task.run('macroOnPostReload');
		grunt.task.run('macroModule');
		grunt.task.run('generateLogFile');
		grunt.task.run('synKeys');
		//grunt.task.run('clean');

	});

	grunt.registerTask('test', '', function () {
		var target = grunt.option('myParam');
		console.log(t());
	});

	grunt.registerTask('synKeys', '', function () {
		mapping = grunt.file.readJSON('./' + targetDir + '/AllProperties.json');
		fields = mapping.AllProperties.FieldProperties.FieldProperties;

		synKeyCount = 0;
		for (var i = 0; i < fields.length; i++) {

			field = fields[i];
			if (field.Name.indexOf('$Syn') > -1) {
				synKeyCount++;
			}
		}

		if (synKeyCount > 0) {
			grunt.fail.warn(synKeyCount + ' synthetic key(s) found!')
		} else {
			grunt.log.ok('No synthetic keys');
		}

	});

	grunt.registerTask('localPath', '', function () {
		script = grunt.file.read('./' + targetDir + '/LoadScript.txt');
		count = (script.match(/:\\/g) || []).length;

		if (count > 0) {
			grunt.fail.warn('Local path used in the script!')
		} else {
			grunt.log.ok('No local paths in script')
		}
	});

	grunt.registerTask('macroOnOpen', '', function () {
		mapping = grunt.file.readJSON('./' + targetDir + '/DocProperties.json');
		onOpenActions = mapping.DocProperties.OnOpenActionItems.ActionItemDef;
		hasMacro = false;

		for (var i = 0; i < onOpenActions.length; i++) {
			actionItem = onOpenActions[i];

			if (actionItem.Type == 'TYPE_MACRO') {
				hasMacro = true;
			}
		}

		if (hasMacro = true) {
			grunt.fail.warn('Macro module OnOpen!')
		} else {
			grunt.log.ok('No macro OnOpen')
		}
	});

	grunt.registerTask('macroOnPostReload', '', function () {
		mapping = grunt.file.readJSON('./' + targetDir + '/DocProperties.json');
		onPostReloadActions = mapping.DocProperties.OnPostReloadActionItems.ActionItemDef;
		hasMacro = false;

		for (var i = 0; i < onPostReloadActions.length; i++) {
			actionItem = onPostReloadActions[i];

			if (actionItem.Type == 'TYPE_MACRO') {
				hasMacro = true;
			}
		}

		if (hasMacro = true) {
			grunt.fail.warn('Macro module OnPostReload!')
		} else {
			grunt.log.ok('No macro OnPostReload')
		}
	});

	grunt.registerTask('macroModule', '', function () {
		module = grunt.file.read('./' + targetDir + '/Module.txt')
		if (module.length > 0) {
			grunt.fail.warn('Macro module is used!');
		} else {
			grunt.log.ok('Macro module is empty');
		}
	});

	grunt.registerTask('generateLogFile', '', function () {
		mapping = grunt.file.readJSON('./' + targetDir + '/DocProperties.json');
		generateLogFile = mapping.DocProperties.GenerateLogfile;

		if (generateLogFile == "false") {
			grunt.fail.warn('Log file is NOT going to be generated after reload!')
		} else {
			grunt.log.ok('Log file will be generated upon reload')
		}
	});

};