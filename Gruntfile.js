module.exports = function(grunt) {

	targetDir = '';

	grunt.initConfig({
		convert: {
			options: {
				explicitArray: false,
			},
			xml2json: {
				files: [{
					expand: true,
					src: '<%= files %>',
					dest: '',
					ext: '.json'
				}]
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
			folder: './files'
		},
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: '<%= source %>',
					src: '<%= filesToCopy %>',
					dest: '<%= targetDir1 %>',
					filter: 'isFile'
				}],
			},
		}
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

	grunt.registerTask('default', '', function() {

		grunt.task.run('clean');
		source = grunt.option('source');

		if (source) {

			targetDir = makeid();

			grunt.config.set('targetDir', ['files/' + targetDir]);
			grunt.config.set('targetDir1', 'files/' + targetDir);
			grunt.config.set('source', source);

			files = ['files/' + targetDir + '/DocProperties.xml', 'files/' + targetDir + '/AllProperties.xml'];
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
			grunt.task.run('clean');
		}
		else {
			grunt.fail.fatal('No source folder provided! Pleaase start the test with --source=MyDir parameter.');
		}

	});

	grunt.registerTask('synKeys', '', function() {
		mapping = grunt.file.readJSON('files/' + targetDir + '/AllProperties.json');
		fields = mapping.AllProperties.FieldProperties.FieldProperties;

		synKeyCount = 0;
		for (var i = 0; i < fields.length; i++) {

			field = fields[i];
			if (field.Name.indexOf('$Syn') > -1) {
				synKeyCount++;
			}
		}

		if (synKeyCount > 0) {
			grunt.fail.warn(synKeyCount + ' synthetic key(s) found!');
		}
		else {
			grunt.log.ok('No synthetic keys').ok();
		}

	});

	grunt.registerTask('localPath', '', function() {
		script = grunt.file.read('files/' + targetDir + '/LoadScript.txt');
		count = (script.match(/:\\/g) || []).length;

		if (count > 0) {
			grunt.fail.warn('Local path used in the script!');
		}
		else {
			grunt.log.ok('No local paths in script').ok();
		}
	});

	grunt.registerTask('macroOnOpen', '', function() {
		mapping = grunt.file.readJSON('files/' + targetDir + '/DocProperties.json');
		onOpenActions = mapping.DocProperties.OnOpenActionItems.ActionItemDef;
		hasMacro = false;

		if (onOpenActions) {
			for (var i = 0; i < onOpenActions.length; i++) {
				actionItem = onOpenActions[i];

				if (actionItem.Type == 'TYPE_MACRO') {
					hasMacro = true;
				}
			}

			if (hasMacro == true) {
				grunt.fail.warn('Macro module OnOpen!');
			}
			else {
				grunt.log.ok('No macro OnOpen').ok();
			}
		}
		else {
			grunt.log.ok('No macro OnOpen').ok();
		}
	});

	grunt.registerTask('macroOnPostReload', '', function() {
		mapping = grunt.file.readJSON('files/' + targetDir + '/DocProperties.json');
		onPostReloadActions = mapping.DocProperties.OnPostReloadActionItems.ActionItemDef;
		hasMacro = false;

		if (onPostReloadActions) {
			for (var i = 0; i < onPostReloadActions.length; i++) {
				actionItem = onPostReloadActions[i];

				if (actionItem.Type == 'TYPE_MACRO') {
					hasMacro = true;
				}
			}

			if (hasMacro == true) {
				grunt.fail.warn('Macro module OnPostReload!');
			}
			else {
				grunt.log.ok('No macro OnPostReload').ok();
			}
		}
		else {
			grunt.log.ok('No macro OnPostReload').ok();
		}
	});

	grunt.registerTask('macroModule', '', function() {
		module = grunt.file.read('files/' + targetDir + '/Module.txt');
		if (module.length > 0) {
			grunt.fail.warn('Macro module is used!');
		}
		else {
			grunt.log.ok('Macro module is empty').ok();
		}
	});

	grunt.registerTask('generateLogFile', '', function() {
		mapping = grunt.file.readJSON('files/' + targetDir + '/DocProperties.json');
		generateLogFile = mapping.DocProperties.GenerateLogfile;

		if (generateLogFile == "false") {
			grunt.fail.warn('Log file is NOT going to be generated after reload!');
		}
		else {
			grunt.log.ok('Log file will be generated upon reload').ok();
		}
	});
};
