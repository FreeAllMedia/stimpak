"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = diffFixtures;

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _diff = require("diff");

var diff = _interopRequireWildcard(_diff);

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function diffFixtures(fixturesDirectoryPath) {
	var _this = this;

	var fixtureFilePaths = _glob2.default.sync("**/*", { cwd: fixturesDirectoryPath, dot: true });

	var reportFilePaths = Object.keys(this.report.files).map(function (filePath) {
		return filePath.replace(_this.destination() + "/", "");
	});

	var differences = {
		paths: {
			actual: reportFilePaths,
			expected: fixtureFilePaths
		},
		content: {}
	};

	fixtureFilePaths.forEach(function (fixtureFilePath) {
		var fileReport = _this.report.files[_this.destination() + "/" + fixtureFilePath];

		if (fileReport && !fileReport.isDirectory) {
			var expectedContent = _fs2.default.readFileSync(fixturesDirectoryPath + "/" + fixtureFilePath, { encoding: "utf-8" });
			var actualContent = _fs2.default.readFileSync(fileReport.path, { encoding: "utf-8" });

			if (actualContent !== expectedContent) {
				differences.content[fixtureFilePath] = {
					actual: actualContent,
					expected: expectedContent
				};
			}
		}
	});

	return differences;
}