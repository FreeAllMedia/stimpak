"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = merge;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function merge(strategy) {
	_incognito2.default.mergeStrategies.push(strategy);
	return this;
}