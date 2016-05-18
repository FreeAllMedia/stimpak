"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("stimpak.generate()", function () {
	var stimpak = void 0,
	    stepOne = void 0,
	    stepTwo = void 0;

	beforeEach(function () {
		var asyncFunction = function asyncFunction(generator, callback) {
			callback();
		};

		stepOne = _sinon2.default.spy(asyncFunction);
		stepTwo = _sinon2.default.spy(asyncFunction);

		stimpak = new _stimpak2.default();

		stimpak.destination("/some/path").then(stepOne, stepTwo);
	});

	it("should return itself to enable chaining", function () {
		stimpak.generate().should.eql(stimpak);
	});

	it("should run each step in series then callback", function (done) {
		stimpak.generate(function () {
			var results = {
				stepOne: stepOne.called,
				stepTwo: stepTwo.called
			};

			results.should.eql({
				stepOne: true,
				stepTwo: true
			});

			done();
		});
	});

	it("should call each step function with `this` as the first argument", function (done) {
		stimpak.generate(function () {
			var results = {
				stepOne: stepOne.calledWith(stimpak),
				stepTwo: stepTwo.calledWith(stimpak)
			};

			results.should.eql({
				stepOne: true,
				stepTwo: true
			});

			done();
		});
	});

	it("should callback with an error if one occurs", function () {
		var expectedError = new Error("Something went wrong!");

		stimpak.steps.push({
			concurrency: "series",
			steps: [function (generator, callback) {
				callback(expectedError);
			}]
		});

		stimpak.generate(function (error) {
			error.should.eql(expectedError);
		});
	});
});