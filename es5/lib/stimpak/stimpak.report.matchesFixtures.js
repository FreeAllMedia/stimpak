"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = matchesFixtures;

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function matchesFixtures(fixturesDirectoryPath) {
	var _this = this;

	var fixtureFilePaths = _glob2.default.sync("**/*", { cwd: fixturesDirectoryPath, dot: true });

	var reportFilePaths = Object.keys(this.report.files).map(function (filePath) {
		return filePath.replace(_this.destination() + "/", "");
	});

	var match = true;

	fixtureFilePaths.forEach(function (fixtureFilePath) {
		var fileExists = reportFilePaths.indexOf(fixtureFilePath) !== -1;

		if (fileExists) {
			var fileReport = _this.report.files[_this.destination() + "/" + fixtureFilePath];
			if (!fileReport.isDirectory) {
				var expectedContent = _fs2.default.readFileSync(fixturesDirectoryPath + "/" + fixtureFilePath, { encoding: "utf-8" });
				var actualContent = _fs2.default.readFileSync(fileReport.path, { encoding: "utf-8" });

				if (actualContent !== expectedContent) {
					match = false;
				}
			}
		} else {
			match = false;
		}
	});

	return match;
}