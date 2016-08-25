"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = globToFileNames;

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function globToFileNames(globString, directoryPath, done) {
	(0, _glob2.default)(globString, { cwd: directoryPath, dot: true }, done);
}