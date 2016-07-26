"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = render;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(path) {
	var _this = this;

	var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

	_fs2.default.exists(path, function (exists) {
		if (exists) {
			fileDoesntExist(_this, path, callback);
		} else {
			fileExists(_this, path, callback);
		}
	});

	return this;
}

function fileExists(template, path, callback) {
	renderTemplate(template, function (error, renderedTemplate) {
		writeFile(path, renderedTemplate, callback);
	});
}

function fileDoesntExist(template, path, callback) {
	_flowsync2.default.waterfall([function (done) {
		renderTemplate(template, done);
	}, function (renderedTemplate, done) {
		readExistingFile(path, function (error, existingContent) {
			done(error, renderedTemplate, existingContent);
		});
	}, function (renderedTemplate, existingContent, done) {
		mergeContent(template, existingContent, renderedTemplate, done);
	}, function (mergedContent, done) {
		writeFile(path, mergedContent, done);
	}], callback);
}

function readExistingFile(path, done) {
	_fs2.default.readFile(path, { encoding: "utf8" }, done);
}

function renderTemplate(template, callback) {
	var templateEngine = template.engine();

	switch (templateEngine.length) {
		case 0:
		case 1:
			{
				try {
					var renderedTemplate = templateEngine(template);
					callback(null, renderedTemplate);
				} catch (exception) {
					callback(exception);
				}
				break;
			}
		case 2:
			templateEngine(template, callback);
			break;
	}
}

function writeFile(path, content, done) {
	_fs2.default.writeFile(path, content, done);
}

function mergeContent(template, existingContent, newContent, done) {
	var mergeStrategy = template.merge();
	if (mergeStrategy) {
		switch (mergeStrategy.length) {
			case 4:
				mergeStrategy(template, existingContent, newContent, done);
				break;
			case 3:
				try {
					var mergedContent = mergeStrategy(template, existingContent, newContent);
					done(null, mergedContent);
				} catch (exception) {
					done(exception);
				}
				break;
			default:
				done(new Error("Merge stategies must have either 3 or 4 arguments."));
		}
	} else {
		done(null, newContent);
	}
}