"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = diffFixtures;

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _sortByLength = require("../sorters/sortByLength.js");

var _sortByLength2 = _interopRequireDefault(_sortByLength);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function diffFixtures(fixturesDirectoryPath) {
	var _this = this;

	var fixtureFilePaths = _glob2.default.sync("**/*", { cwd: fixturesDirectoryPath, dot: true }).sort(_sortByLength2.default);

	var reportFilePaths = Object.keys(this.report.files).map(function (filePath) {
		return filePath.replace(_this.destination() + "/", "");
	});

	var actualFilePaths = _fs2.default.readdirSync(fixturesDirectoryPath);

	console.log({
		actualFilePaths: actualFilePaths,
		fixturesDirectoryPath: fixturesDirectoryPath,
		fixtureFilePaths: fixtureFilePaths,
		reportFilePaths: reportFilePaths
	});

	var differences = {
		paths: {
			actual: reportFilePaths,
			expected: fixtureFilePaths
		},
		contents: {}
	};

	fixtureFilePaths.forEach(function (fixtureFilePath) {
		var fileReport = _this.report.files[_this.destination() + "/" + fixtureFilePath];

		if (fileReport && !fileReport.isDirectory) {
			var expectedContent = _fs2.default.readFileSync(fixturesDirectoryPath + "/" + fixtureFilePath, { encoding: "utf-8" });
			var actualContent = _fs2.default.readFileSync(fileReport.path, { encoding: "utf-8" });

			if (actualContent !== expectedContent) {
				differences.contents[fixtureFilePath] = {
					actual: actualContent,
					expected: expectedContent
				};
			}
		}
	});

	return differences;
}