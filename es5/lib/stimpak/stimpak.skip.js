"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = skip;
function skip(globOrGlobs) {
	if (globOrGlobs.constructor === Array) {
		var multipleGlobs = globOrGlobs;
		multipleGlobs.forEach(function () {});
	} else {
		var singleGlob = globOrGlobs;
	}
}