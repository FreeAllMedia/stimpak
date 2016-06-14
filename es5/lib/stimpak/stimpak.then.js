"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = then;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function then() {
	for (var _len = arguments.length, stepFunctions = Array(_len), _key = 0; _key < _len; _key++) {
		stepFunctions[_key] = arguments[_key];
	}

	this.debug("then", stepFunctions);
	var action = (0, _incognito2.default)(this).action;

	stepFunctions.push(this.context());

	action.series.apply(action, stepFunctions);

	return this;
}