"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = prompt;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _inquirer = require("inquirer");

var _inquirer2 = _interopRequireDefault(_inquirer);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prompt() {
	var _this = this;

	for (var _len = arguments.length, prompts = Array(_len), _key = 0; _key < _len; _key++) {
		prompts[_key] = arguments[_key];
	}

	this.debug("prompt", prompts);

	var _ = (0, _incognito2.default)(this);
	var action = _.action;

	var needsLineBreak = Boolean(_.needsLineBreak);

	if (prompts.length > 0) {
		action.step(function (stimpak, stepDone) {
			if (needsLineBreak) {
				_this.write("\n");
			}

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

			_flowsync2.default.mapSeries(unansweredPrompts, function (unansweredPrompt, done) {
				var askQuestion = true;

				if (unansweredPrompt.when) {
					askQuestion = unansweredPrompt.when(_this);
					delete unansweredPrompt.when;
				}

				if (typeof unansweredPrompt.message === "function") {
					unansweredPrompt.message = unansweredPrompt.message(_this);
				}

				if (typeof unansweredPrompt.default === "function") {
					unansweredPrompt.default = unansweredPrompt.default(_this);
				}

				if (typeof unansweredPrompt.choices === "function") {
					unansweredPrompt.choices = unansweredPrompt.choices(_this);
				}

				if (askQuestion) {
					_inquirer2.default.prompt(unansweredPrompt).then(function (questionAnswers) {
						var casts = _this.casts();

						var _loop2 = function _loop2(question) {
							var answer = questionAnswers[question];

							casts.forEach(function (cast) {
								answer = cast(answer);
							});

							questionAnswers[question] = answer;
						};

						for (var question in questionAnswers) {
							_loop2(question);
						}
						_this.answers(questionAnswers);
						done();
					});
				} else {
					done();
				}
			}, stepDone);
		});
	}

	return this;
}