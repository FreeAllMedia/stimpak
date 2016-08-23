"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = sortByPathLength;
function sortByPathLength(a, b) {
	return a.path().length - b.path().length;
}