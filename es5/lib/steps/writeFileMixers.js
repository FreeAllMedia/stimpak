"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = writeFileMixers;

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function writeFileMixers(stimpak, fileMixers, done) {
	_async2.default.mapSeries(fileMixers, _async2.default.apply(writeFileMixer, stimpak), done);
}

function writeFileMixer(stimpak, fileMixer, done) {
	var report = stimpak.report;

	var pathParts = _path2.default.dirname(fileMixer.path()).split("/");

	var missingPaths = [];

	_async2.default.whilst(function () {
		return pathParts.length > 1;
	}, function (whilstDone) {
		var pathToCheck = pathParts.join("/");

		_fs2.default.exists(pathToCheck, function (exists) {
			if (!exists) {
				missingPaths.push(pathToCheck);
			}
			whilstDone();
		});

		pathParts.pop();
	}, function () {
		fileMixer.write(function (error, file) {
			missingPaths.reverse().forEach(function (missingPath) {
				report.events.push({
					type: "writeDirectory",
					path: missingPath
				});

				var base = file.base;
				var name = missingPath.replace(base, "");

				report.files[missingPath] = {
					path: missingPath,
					base: base,
					name: name,
					isDirectory: true,
					isFile: false,
					isMerged: false
				};
			});

			var event = void 0;
			if (!error) {
				if (!file.isMerged) {
					if (file.isFile) {
						event = {
							type: "writeFile",
							templatePath: fileMixer.templatePath,
							path: file.path,
							contents: file.contents
						};
					} else {
						event = {
							type: "writeDirectory",
							templatePath: fileMixer.templatePath,
							path: file.path
						};

						delete file.contents;
					}

					file.templatePath = fileMixer.templatePath;

					report.events.push(event);
					report.files[file.path] = file;
				} else {
					report.events.push({
						contents: file.contents,
						oldContents: fileMixer.originalContents,
						oldPath: fileMixer.originalPath,
						path: file.path,
						templatePath: fileMixer.templatePath,
						type: "mergeFile"
					});

					var reportFileObject = Object.assign({
						templatePath: fileMixer.templatePath,
						oldContents: fileMixer.originalContents,
						oldPath: fileMixer.originalPath
					}, file);

					stimpak.report.files[file.path] = reportFileObject;
				}
				done(null, file);
			} else {
				error.message = error.message.replace(/(.*) is not defined/, "\"$1\" is not defined in \"" + fileMixer.templatePath + "\"");
				done(error);
			}
		});
	});
}