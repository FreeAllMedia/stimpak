"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = generate;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generate(callback) {
	this.debug("generate");

	var _ = (0, _incognito2.default)(this);
	var action = _.action;
	action.results(callback);

	return this;
}