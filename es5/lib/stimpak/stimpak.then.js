"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = then;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function then() {
	var action = (0, _incognito2.default)(this).action;

	action.series.apply(action, arguments);

	return this;
}