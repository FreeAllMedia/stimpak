"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = render;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _lodash = require("lodash.template");

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require("lodash.templatesettings");

var _lodash4 = _interopRequireDefault(_lodash3);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _vinyl = require("vinyl");

var _vinyl2 = _interopRequireDefault(_vinyl);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _minimatch = require("minimatch");

var _minimatch2 = _interopRequireDefault(_minimatch);

var _lodash5 = require("lodash.flattendeep");

var _lodash6 = _interopRequireDefault(_lodash5);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(done) {
	var _this = this;

	var templateFileNames = _glob2.default.sync(this.glob(), {
		cwd: this.directory(),
		dot: true
	});

	_flowsync2.default.mapSeries(templateFileNames, function (fileName, fileNameDone) {
		renderFile.call(_this.stimpak, fileName, _this, fileNameDone);
	}, done);
}

// TODO: Clean up renderFile by breaking it up into smaller functions
function renderFile(templateFileName, source, done) {
	var _this2 = this;

	var templateFilePath = source.directory() + "/" + templateFileName;
	var templateFileStats = _fsExtra2.default.statSync(templateFilePath);
	var answers = this.answers();

	var destinationFileName = String(templateFileName);

	for (var answerName in answers) {
		var answerValue = answers[answerName];
		var answerRegExp = new RegExp("##" + answerName + "##", "g");
		destinationFileName = destinationFileName.replace(answerRegExp, answerValue);
	}

	if (!shouldSkipFile.call(this, destinationFileName, templateFileName)) {
		if (templateFileStats.isDirectory()) {
			var directoryPath = this.destination() + "/" + destinationFileName;
			_fsExtra2.default.mkdirsSync(directoryPath);
			reportFile.call(this, directoryPath, {
				path: directoryPath,
				isDirectory: true,
				templatePath: templateFilePath,
				isMerged: false
			});
			reportEvent.call(this, {
				type: "writeDirectory",
				path: directoryPath,
				templatePath: templateFilePath
			});
			done();
		} else {
			(function () {
				var fileContents = renderTemplateFile.call(_this2, templateFilePath);

				var newFile = new _vinyl2.default({
					cwd: _this2.destination(),
					base: _this2.destination(),
					path: _this2.destination() + "/" + destinationFileName,
					contents: new Buffer(fileContents)
				});

				var newFileDetails = {
					path: newFile.path,
					isDirectory: templateFileStats.isDirectory(),
					content: fileContents.toString(),
					templatePath: templateFilePath,
					isMerged: false
				};

				if (_fsExtra2.default.existsSync(newFile.path)) {
					(function () {
						var oldFileContents = _fsExtra2.default.readFileSync(newFile.path);

						var mergeStrategies = _this2.merge();

						if (mergeStrategies.length > 0) {
							_flowsync2.default.mapSeries(mergeStrategies, function (mergeStrategy, mergeDone) {
								var mergePattern = new RegExp(mergeStrategy[0]);

								if (newFile.path.match(mergePattern)) {
									(function () {
										var mergeFunction = mergeStrategy[1];
										var oldFile = new _vinyl2.default({
											cwd: newFile.cwd,
											base: newFile.base,
											path: newFile.path,
											contents: oldFileContents
										});

										mergeFunction(_this2, newFile, oldFile, function (error, mergedFile) {
											var mergedFileDetails = newFileDetails;

											if (error) {
												mergeDone(error);
											} else {
												mergedFileDetails.isMerged = true;
												mergedFileDetails.path = mergedFile.path;
												mergedFileDetails.oldContent = oldFile.contents.toString();
												mergedFileDetails.oldPath = oldFile.path;
												mergeFile.call(_this2, mergedFile, mergedFileDetails, mergeDone);
											}
										});
									})();
								} else {
									writeFile.call(_this2, newFile, newFileDetails, mergeDone);
								}
							}, done);
						} else {
							writeFile.call(_this2, newFile, newFileDetails, done);
						}
					})();
				} else {
					writeFile.call(_this2, newFile, newFileDetails, done);
				}
			})();
		}
	} else {
		done();
	}
}

function renderTemplateFile(templateFilePath) {
	_lodash4.default.interpolate = /<%=([\s\S]+?)%>/g;

	var templateFileContents = _fsExtra2.default.readFileSync(templateFilePath);
	var template = (0, _lodash2.default)(templateFileContents);
	var renderedTemplateContents = template(this.answers());

	return renderedTemplateContents;
}

function mergeFile(file, fileDetails, done) {
	var filePath = file.path;
	var fileContents = file.contents;

	_fsExtra2.default.writeFileSync(filePath, fileContents);

	reportFile.call(this, filePath, fileDetails);
	reportEvent.call(this, {
		type: "mergeFile",
		path: fileDetails.path,
		oldPath: fileDetails.oldPath,
		templatePath: fileDetails.templatePath,
		content: fileDetails.content,
		oldContent: fileDetails.oldContent
	});

	done();
}

function writeFile(file, fileDetails, done) {
	var filePath = file.path;
	var fileContents = file.contents;

	_fsExtra2.default.writeFileSync(filePath, fileContents);

	reportFile.call(this, filePath, fileDetails);
	reportEvent.call(this, {
		type: "writeFile",
		path: fileDetails.path,
		templatePath: fileDetails.templatePath,
		content: fileDetails.content
	});

	done();
}

function reportFile(filePath, fileDetails) {
	(0, _incognito2.default)(this).report.files[filePath] = fileDetails;
}

function reportEvent(eventDetails) {
	(0, _incognito2.default)(this).report.events.push(eventDetails);
}

function shouldSkipFile(filePath, templateFileName) {
	var skips = this.skip();
	var skipFile = false;

	var flattenedSkips = (0, _lodash6.default)(skips);

	for (var index in flattenedSkips) {
		var skipGlob = flattenedSkips[index];

		if ((0, _minimatch2.default)(filePath, skipGlob, { dot: true }) || (0, _minimatch2.default)(templateFileName, skipGlob, { dot: true })) {
			skipFile = true;
			break;
		}
	}

	return skipFile;
}