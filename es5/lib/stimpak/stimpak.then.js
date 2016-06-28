"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = then;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// TODO: Optimize .then
function then() {
	var _this = this;

	for (var _len = arguments.length, stepFunctions = Array(_len), _key = 0; _key < _len; _key++) {
		stepFunctions[_key] = arguments[_key];
	}

	this.debug("then", stepFunctions);

	var _ = (0, _incognito2.default)(this);
	var action = _.action;

	var originalContext = this.context();

	var stepFunctionTasks = stepFunctions.map(function (stepFunction) {
		var stepFunctionTask = function stepFunctionTask(stim, done) {
			var newContext = _this.context();
			_this.context(originalContext);

			var isAsynchronous = stepFunction.length === 2;

			if (isAsynchronous) {
				stepFunction.call(_this.context(), stim, function (error) {
					_this.context(newContext);
					done(error);
				});
			} else {
				try {
					stepFunction.call(_this.context(), stim);
					_this.context(newContext);
					done();
				} catch (error) {
					done(error);
				}
			}

			_.stepFunctionTasks = null;
		};

		return stepFunctionTask;
	});

	action.series.apply(action, _toConsumableArray(stepFunctionTasks));

	// if (_.stepFunctionTasks) {
	// 	const parentStep = action.steps.filter(step => {
	// 		return step.steps === _.stepFunctionTasks;
	// 	})[0];
	//
	// 	const parentStepIndex = action.steps.indexOf(parentStep);
	//
	// 	action.steps.splice(parentStepIndex + 1, 0, {
	// 		concurrency: "series",
	// 		steps: stepFunctionTasks
	// 	});
	//
	// 	console.log("HMM");
	// } else {
	// 	action.series(...stepFunctionTasks);
	// }

	return this;
}