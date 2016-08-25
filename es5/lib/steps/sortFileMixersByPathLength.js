"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = sortFileMixersByPathLength;

var _sortByPathLength = require("../sorters/sortByPathLength.js");

var _sortByPathLength2 = _interopRequireDefault(_sortByPathLength);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sortFileMixersByPathLength(fileMixers, done) {
	var sortedFileMixers = fileMixers.sort(_sortByPathLength2.default);
	done(null, sortedFileMixers);
}