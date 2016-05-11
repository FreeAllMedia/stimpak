"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = generate;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _lodash = require("lodash.template");

var _lodash2 = _interopRequireDefault(_lodash);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

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
	var _this = this;

	var templateFilePaths = [];

	stimpak.sources.forEach(function (source) {
		var absoluteSourceGlob = source.directory() + "/" + source.glob();
		var sourceFilePaths = _glob2.default.sync(absoluteSourceGlob);

		templateFilePaths = templateFilePaths.concat(sourceFilePaths);
	});

	templateFilePaths.forEach(function (templateFilePath) {
		var renderedTemplateContents = renderTemplateFile.call(_this, templateFilePath);

		var answers = _this.answers();
		for (var answerName in answers) {
			var answerValue = answers[answerName];

			var answerRegExp = new RegExp("##" + answerName + "##", "g");

			templateFilePath = templateFilePath.replace(answerRegExp, answerValue);
		}

		var templateFile = newFile.call(_this, templateFilePath, renderedTemplateContents);

		console.log("templateFile", templateFile);
	});

	done();
}

function renderTemplateFile(templateFilePath) {
	var templateFileContents = _fs2.default.readFileSync(templateFilePath);

	var template = (0, _lodash2.default)(templateFileContents);

	var renderedTemplateContents = template(this.answers());

	return renderedTemplateContents;
}

function newFile(filePath, fileContents) {
	var templateFile = new _vinyl2.default({
		cwd: this.destination(),
		base: this.basePath(),
		path: filePath,
		contents: new Buffer(fileContents)
	});

	return templateFile;
}