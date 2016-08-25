"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = mergeJSON;

var _lodash = require("lodash.mergewith");

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require("lodash.union");

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require("lodash.isarray");

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mergeJSON(stimpak, oldFile, newFile, done) {
	var oldFileJSON = JSON.parse(oldFile.contents);
	var newFileJSON = JSON.parse(newFile.contents);

	function concatArrays(array, value) {
		var newArray = void 0;

		if ((0, _lodash6.default)(array)) {
			newArray = (0, _lodash4.default)(array, value);
		}

		return newArray;
	}

	var mergedJSON = (0, _lodash2.default)(oldFileJSON, newFileJSON, concatArrays);
	var mergedJSONString = JSON.stringify(mergedJSON, null, 2);

	newFile.contents = new Buffer(mergedJSONString + "\n");

	done(null, newFile);
}