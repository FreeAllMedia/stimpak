"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = mergeJSON;

var _lodash = require("lodash.mergewith");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mergeJSON(stimpak, newFile, oldFile, done) {
	var newFileJSON = JSON.parse(newFile.contents);
	var oldFileJSON = JSON.parse(oldFile.contents);

	function concatArrays(array, value) {
		var newArray = void 0;

		if (array.constructor === Array) {
			newArray = array.concat(value);
		}

		return newArray;
	}

	var mergedJSON = (0, _lodash2.default)(oldFileJSON, newFileJSON, concatArrays);
	var mergedJSONString = JSON.stringify(mergedJSON, null, 2);

	newFile.contents = new Buffer(mergedJSONString + "\n");

	done(null, newFile);
}