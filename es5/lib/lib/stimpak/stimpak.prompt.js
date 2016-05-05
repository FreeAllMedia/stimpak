"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = prompt;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prompt() {
	for (var _len = arguments.length, prompts = Array(_len), _key = 0; _key < _len; _key++) {
		prompts[_key] = arguments[_key];
	}

	var _ = (0, _incognito2.default)(this);

	var action = _.action;
	var inquirer = _.inquirer;

	action.step(function (generator, done) {
		inquirer.prompt.apply(inquirer, prompts);

		done();
	});

	return this;
}