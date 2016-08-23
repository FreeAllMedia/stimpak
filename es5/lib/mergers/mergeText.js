"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = mergeText;

var _diff = require("diff");

var jsdiff = _interopRequireWildcard(_diff);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function mergeText(stimpak, oldFile, newFile, done) {
	var oldContent = oldFile.contents.toString();
	var newContent = newFile.contents.toString();

	var differences = jsdiff.diffLines(oldContent, newContent);

	var mergedContent = differences
	//.filter(difference => !difference.removed)
	.map(function (difference) {
		return difference.value;
	}).join("");

	newFile.contents = new Buffer(mergedContent);

	done(null, newFile);
}