"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("stimpak.command()", function () {
	var stimpak = void 0,
	    command = void 0,
	    commandCallback = void 0,
	    errorCommand = void 0,
	    results = void 0;

	beforeEach(function (done) {
		results = {};
		stimpak = new _stimpak2.default();
		command = "echo 'The Dolphin'";
		errorCommand = "(>&2 echo 'error')";
		commandCallback = _sinon2.default.spy(function (generator, stdout, stderr, postCommandDone) {
			results.generator = generator;
			results.stdout = stdout;
			results.stderr = stderr;
			postCommandDone();
		});
		results.returnValue = stimpak.command(command, commandCallback);

		stimpak.destination("/some/path").generate(done);
	});

	it("should return itself to enable chaining", function () {
		results.returnValue.should.eql(stimpak);
	});

	it("should add its step to .steps", function () {
		stimpak.steps.length.should.eql(2);
	});

	it("should run the command and callback with stimpak", function () {
		results.generator.should.eql(stimpak);
	});

	it("should run the command and callback with stdout", function () {
		results.stdout.should.eql("The Dolphin\n");
	});

	it("should run the command and callback with stderr", function (done) {
		stimpak = new _stimpak2.default().command(errorCommand, commandCallback).destination("/some/path").generate(function () {
			results.stderr.should.eql("error\n");
			done();
		});
	});
});