"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = virtualFileToJob;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function virtualFileToJob(filePath, fileContents, done) {
	var base = _path2.default.dirname(filePath) + "/";
	var fileName = _path2.default.basename(filePath);

	var jobs = [{
		base: base,
		name: fileName,
		path: filePath,
		contents: fileContents
	}];

	done(null, jobs);
}