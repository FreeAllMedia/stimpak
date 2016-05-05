"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

var _suppose = require("suppose");

var _suppose2 = _interopRequireDefault(_suppose);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("stimpak.prompt()", function () {
	var stimpak = void 0,
	    prompts = void 0,
	    returnValue = void 0;

	beforeEach(function (done) {
		var babelNodeFilePath = _path2.default.join(_path2.default.normalize(__dirname + "/../../../"), "node_modules/babel-cli/bin/babel-node.js");

		(0, _suppose2.default)(babelNodeFilePath, ["./fixtures/stimpak.prompt.js"], {})
		// .when(/name\: \([\w|\-]+\)[\s]*/)
		// 	.respond("awesome_package\n")

		.on("error", function (error) {
			done(error);
		}).end(function (code) {
			console.log("code", code);
			//done();
		});
	});

	it("should return itself to enable chaining", function () {
		returnValue.should.eql(stimpak);
	});

	xit("should add a step to display each prompt's questions", function () {
		stimpak.steps.length.should.eql(1);
	});

	xit("should display each prompt's questions when `.generate()` is called", function (done) {
		stimpak.generate(function () {
			process.stdin.write("Bob\n");
			stdout.should.contain(prompts[0].message);
			done();
		});
	});

	xit("should accept each prompt's answers");
});