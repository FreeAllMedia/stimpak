"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = generate;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generate(callback) {
	var action = (0, _incognito2.default)(this).action;

	action.results(callback);

	return this;
}