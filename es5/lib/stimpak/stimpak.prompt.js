"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = prompt;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _inquirer = require("inquirer");

var _inquirer2 = _interopRequireDefault(_inquirer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prompt() {
	var _this = this;

	for (var _len = arguments.length, prompts = Array(_len), _key = 0; _key < _len; _key++) {
		prompts[_key] = arguments[_key];
	}

	this.debug("prompt", prompts);
	var _ = (0, _incognito2.default)(this);

	var action = _.action;

	if (prompts.length > 0) {
		action.step(function (generator, stepDone) {
			var unansweredPrompts = prompts;

			var answers = _this.answers();

			var _loop = function _loop(answerName) {
				unansweredPrompts = unansweredPrompts.filter(function (promptDefinition) {
					return promptDefinition.name !== answerName;
				});
			};

			for (var answerName in answers) {
				_loop(answerName);
			}

			if (unansweredPrompts.length > 0) {
				_inquirer2.default.prompt(prompts).then(function (questionAnswers) {
					_this.answers(questionAnswers);

					//process.stdout.write("\n");

					stepDone();
				});
			} else {
				stepDone();
			}
		});
	}

	return this;
}