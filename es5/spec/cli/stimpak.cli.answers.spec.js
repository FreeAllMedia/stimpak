"use strict";

var _child_process = require("child_process");

var _stimpakCliHelper = require("./stimpak.cli.helper.js");

describe("(CLI) stimpak --answers", function () {
	var command = void 0,
	    userProjectDirectoryPath = void 0;

	beforeEach(function () {
		var options = (0, _stimpakCliHelper.setupCliEnvironment)();
		command = options.command;
		userProjectDirectoryPath = options.userProjectDirectoryPath;
	});

	it("should use provided answer and skip question prompt", function (done) {
		command += " test-4";
		(0, _child_process.exec)(command, { cwd: userProjectDirectoryPath }, function (error, stdout, stderr) {
			stderr.should.eql("");
			stdout.should.eql("");
			done();
		});
	});
});