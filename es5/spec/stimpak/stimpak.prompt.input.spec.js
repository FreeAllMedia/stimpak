"use strict";

var _stimpak5 = require("../../lib/stimpak/stimpak.js");

var _stimpak6 = _interopRequireDefault(_stimpak5);

var _interceptStdout = require("intercept-stdout");

var _interceptStdout2 = _interopRequireDefault(_interceptStdout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

describe("stimpak.prompt() (intercept)", function () {
	var stimpak = void 0,
	    prompts = void 0,
	    promptOne = void 0,
	    promptTwo = void 0,
	    answers = void 0;

	beforeEach(function () {
		stimpak = new _stimpak6.default().destination("/some/path");

		prompts = [{
			type: "input",
			name: "firstName",
			message: "What is your first name?",
			default: "Bob"
		}, {
			type: "input",
			name: "lastName",
			message: "What is your last name?",
			default: "Belcher"
		}];

		answers = {
			firstName: "Gene",
			lastName: "Belcher"
		};

		promptOne = prompts[0];
		promptTwo = prompts[1];
	});

	it("should return itself to enable chaining", function () {
		stimpak.prompt().should.eql(stimpak);
	});

	it("should add a step to display each prompt's questions", function () {
		var _stimpak;

		(_stimpak = stimpak).prompt.apply(_stimpak, _toConsumableArray(prompts)).steps.length.should.eql(1);
	});

	it("should not add a step if no prompts given", function () {
		stimpak.prompt().steps.length.should.eql(0);
	});

	it("should display each prompt's questions when `.generate()` is called", function (done) {
		var _stimpak2;

		var stdout = "";

		var stopIntercept = (0, _interceptStdout2.default)(function (data) {
			stdout += data.toString();
		});

		(_stimpak2 = stimpak).prompt.apply(_stimpak2, _toConsumableArray(prompts)).generate(function (error) {
			var results = {
				promptOne: stdout.indexOf(promptOne.message) !== -1,
				promptTwo: stdout.indexOf(promptTwo.message) !== -1
			};

			// TODO: Figure out why this test times out when failing
			results.should.eql({
				promptOne: true,
				promptTwo: true
			});

			stopIntercept();

			done(error);
		});

		setTimeout(function () {
			process.stdin.emit("data", answers.firstName + "\n");
		}, 100);

		setTimeout(function () {
			process.stdin.emit("data", answers.lastName + "\n");
		}, 200);
	});

	it("should accept each prompt's answers", function (done) {
		var _stimpak3;

		(_stimpak3 = stimpak).prompt.apply(_stimpak3, _toConsumableArray(prompts)).generate(function (error) {
			stimpak.answers().should.eql(answers);
			done(error);
		});

		setTimeout(function () {
			process.stdin.emit("data", answers.firstName + "\n");
		}, 100);

		setTimeout(function () {
			process.stdin.emit("data", answers.lastName + "\n");
		}, 200);
	});

	it("should skip prompts that already have answers", function (done) {
		var _stimpak$answers;

		var stdout = "";

		var stopIntercept = (0, _interceptStdout2.default)(function (data) {
			stdout += data.toString();
		});

		(_stimpak$answers = stimpak.answers({
			firstName: "Neil"
		})).prompt.apply(_stimpak$answers, _toConsumableArray(prompts)).generate(function (error) {
			var results = {
				promptOne: stdout.indexOf(promptOne.message) !== -1,
				promptTwo: stdout.indexOf(promptTwo.message) !== -1
			};

			stopIntercept();

			// TODO: Figure out why this test times out when failing
			results.should.eql({
				promptOne: false,
				promptTwo: true
			});

			done(error);
		});

		setTimeout(function () {
			process.stdin.emit("data", answers.firstName + "\n");
		}, 100);

		setTimeout(function () {
			process.stdin.emit("data", "BAD VALUE\n");
		}, 500);
	});

	it("should use existing answers", function () {
		var _stimpak4;

		var firstName = "Neil";

		(_stimpak4 = stimpak).prompt.apply(_stimpak4, _toConsumableArray(prompts)).answers({
			firstName: firstName
		}).generate(function () {
			stimpak.answers().should.eql({
				firstName: firstName,
				lastName: answers.lastName
			});
		});
	});
});