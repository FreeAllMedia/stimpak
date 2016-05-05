"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("stimpak.then()", function () {
	var stimpak = void 0,
	    stepOne = void 0,
	    stepTwo = void 0,
	    stepThree = void 0;

	beforeEach(function () {
		stimpak = new _stimpak2.default();

		var slowFunction = function slowFunction(generator, callback) {
			setTimeout(callback, 100);
		};

		stepOne = _sinon2.default.spy(slowFunction);
		stepTwo = _sinon2.default.spy(slowFunction);
		stepThree = _sinon2.default.spy(slowFunction);
	});

	var clock = void 0;
	beforeEach(function () {
		clock = _sinon2.default.useFakeTimers();
	});
	afterEach(function () {
		clock.restore();
	});

	it("should return itself to enable chaining", function () {
		stimpak.then(stepOne).should.eql(stimpak);
	});

	it("should add a `stimpak step` to the list of steps to be executed", function () {
		stimpak.then(stepOne);
		stimpak.steps[0].should.eql({
			concurrency: "series",
			steps: [stepOne]
		});
	});

	it("should be able to add multiple functions at once", function () {
		stimpak.then(stepOne, stepTwo, stepThree);

		stimpak.steps[0].steps.should.have.members([stepOne, stepTwo, stepThree]);
	});

	it("should be able to add multiple functions at once to be run in series", function () {
		stimpak.then(stepOne, stepTwo, stepThree);
		stimpak.steps[0].concurrency.should.eql("series");
	});

	it("should call after all preceding `stimpak steps` are completed", function () {
		stimpak.then(stepOne, stepTwo).then(stepThree);

		stimpak.generate();
		clock.tick(250);

		stepThree.called.should.be.true;
	});

	it("should not call before all preceding `stimpak steps` are completed", function () {
		stimpak.then(stepOne).then(stepTwo);

		stimpak.generate();
		clock.tick(50);

		stepTwo.called.should.be.false;
	});
});