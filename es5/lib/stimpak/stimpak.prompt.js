"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = prompt;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prompt() {
	for (var _len = arguments.length, prompts = Array(_len), _key = 0; _key < _len; _key++) {
		prompts[_key] = arguments[_key];
	}

	var _ = (0, _incognito2.default)(this);

	var action = _.action;
	var promptly = _.promptly;

	action.step(function (generator, stepDone) {
		_flowsync2.default.mapSeries(prompts, function (newPrompt, seriesDone) {
			var message = newPrompt.message;
			promptly.prompt(message, seriesDone);
		}, function (error, answers) {
			stepDone(error);
		});
	});

	return this;
}