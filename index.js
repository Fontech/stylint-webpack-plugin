const fs = require('fs');
const FileHound = require('filehound');
const stylint = require('stylint');

class StylintWebpackPlugin {
	constructor(options) {
		this.defaultOtions = {
			files: './',
			exclude: /node_modules/,
			stylintConfig: {}
		};
		this.options = {...this.defaultOtions, ...options};

		if (this.options.reporter) {
			this.reporter = require(this.options.reporter);
		}
	}

	apply(compiler) {
		compiler.hooks.done.tapAsync('StylintWebpackPlugin', (stats, callback) => {
			this.searchFiles(stats);

			setTimeout(function() {
        callback();
      }, 100);
		});
	}

	searchFiles(stats) {
		const options = this.options;
		const reporter = this.reporter;
		const files = FileHound.create().paths(this.options.files).discard(this.options.exclude).ext(['.styl', '.vue']).find();

		files.then(files => {
			files.forEach(file => {
				fs.readFile(file, 'utf8', (err, data) => {
					if (err) {
						throw new Error(err);
					}

					const lineBreaks = ['\n'];
					const strings = data.split('\n');
					let lintContent = '';

					if (/\.vue$/.test(file)) {
						strings.some(str => {
							if (/lang="stylus"/.test(str)) {
								return true;
							}
						});

						lintContent = data.match(/lang="stylus"\s*[a-z]*>([\s\S]+?)<\/style>/i);

						if (!lintContent) {
							return;
						}

						data = lineBreaks.join('') + lintContent[1];
					}

					if (/\.styl$/.test(file)) {

						data = lineBreaks.join('') + data;
					}

					stylint(data, options.rules)
						.methods({
							read() {
								this.cache.filesLen = 1;
								this.cache.fileNo = 1;
								this.cache.file = file;
								this.cache.files = [file];
								this.state.quiet = true;

								if (typeof reporter !== 'undefined') {
									this.reporter = reporter;
									this.config.reporterOptions = options.reporterOptions;
								}

								this.parse(null, [data]);
							},
							done() {
								const warningsOrErrors = [].concat(this.cache.errs, this.cache.warnings);

								if (warningsOrErrors.length) {
									let msg = warningsOrErrors.filter(Boolean).join('\n\n');

									msg += `\n${this.cache.msg}`;

									console.log(msg); // print in terminal
									stats.compilation.errors.push(msg) // print error on the web site
								}

								this.resetOnChange();
							}
						})
						.create({}, {
							config: options.config
						});
				});
			});
		});
	}
}

module.exports = StylintWebpackPlugin;
