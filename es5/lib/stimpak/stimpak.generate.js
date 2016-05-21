"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = generate;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _lodash = require("lodash.template");

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require("lodash.templatesettings");

var _lodash4 = _interopRequireDefault(_lodash3);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _vinyl = require("vinyl");

var _vinyl2 = _interopRequireDefault(_vinyl);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generate(callback) {
	if (this.destination()) {
		var _ = (0, _incognito2.default)(this);
		var action = _.action;

		action.step(renderFiles.bind(this)).results(callback);
	} else {
		callback(new Error("You must set .destination() before you can .generate()"));
	}

	return this;
}

function renderFiles(stimpak, done) {
	_flowsync2.default.mapSeries(stimpak.sources, renderSource.bind(this), done);
}

function renderSource(source, done) {
	var _this = this;

	var templateFileNames = _glob2.default.sync(source.glob(), {
		cwd: source.directory(),
		dot: true
	});

	_flowsync2.default.mapSeries(templateFileNames, function (fileName, fileNameDone) {
		renderFile.call(_this, fileName, source, fileNameDone);
	}, done);
}

// TODO: Clean up function by breaking it up into smaller ones
function renderFile(fileName, source, done) {
	var _this2 = this;

	var templateFilePath = source.directory() + "/" + fileName;
	var templateFileStats = _fsExtra2.default.statSync(templateFilePath);
	var answers = this.answers();

	var filePath = "" + fileName;

	for (var answerName in answers) {
		var answerValue = answers[answerName];
		var answerRegExp = new RegExp("##" + answerName + "##", "g");
		filePath = filePath.replace(answerRegExp, answerValue);
	}

	if (templateFileStats.isDirectory()) {
		_fsExtra2.default.mkdirsSync(this.destination() + "/" + filePath);
		done();
	} else {
		(function () {
			var fileContents = renderTemplateFile.call(_this2, templateFilePath);

			var newFile = new _vinyl2.default({
				cwd: _this2.destination(),
				base: _this2.destination(),
				path: _this2.destination() + "/" + filePath,
				contents: new Buffer(fileContents)
			});

			if (_fsExtra2.default.existsSync(newFile.path)) {
				(function () {
					var oldFileContents = _fsExtra2.default.readFileSync(newFile.path);

					var mergeStrategies = _this2.merge();

					if (mergeStrategies.length > 0) {
						_flowsync2.default.mapSeries(mergeStrategies, function (mergeStrategy, mergeDone) {
							var mergePattern = new RegExp(mergeStrategy[0]);

							if (newFile.path.match(mergePattern)) {
								var mergeFunction = mergeStrategy[1];
								var oldFile = new _vinyl2.default({
									cwd: newFile.cwd,
									base: newFile.base,
									path: newFile.path,
									contents: oldFileContents
								});

								mergeFunction(_this2, newFile, oldFile, function (error, mergedFile) {
									if (error) {
										mergeDone(error);
									} else {
										writeFile(mergedFile.path, mergedFile.contents, mergeDone);
									}
								});
							} else {
								writeFile(newFile.path, newFile.contents, mergeDone);
							}
						}, done);
					} else {
						writeFile(newFile.path, newFile.contents, done);
					}
				})();
			} else {
				writeFile(newFile.path, newFile.contents, done);
			}
		})();
	}
}

function renderTemplateFile(templateFilePath) {
	_lodash4.default.interpolate = /<%=([\s\S]+?)%>/g;

	var templateFileContents = _fsExtra2.default.readFileSync(templateFilePath);
	var template = (0, _lodash2.default)(templateFileContents);
	var renderedTemplateContents = template(this.answers());

	return renderedTemplateContents;
}

function writeFile(filePath, fileContents, done) {
	_fsExtra2.default.writeFileSync(filePath, fileContents);
	done();
}