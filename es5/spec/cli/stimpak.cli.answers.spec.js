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
		command += " test-4 --promptName=Blah";
		(0, _child_process.exec)(command, { cwd: userProjectDirectoryPath }, function (error, stdout, stderr) {
			try {
				stdout.should.eql("DONE!\n");
				done();
			} catch (err) {
				done(err);
			}
		});
	});

	it("should use report malformed answers", function (done) {
		command += " test-4 --promptName=Blah --malformed1:Blah --malformed2";
		(0, _child_process.exec)(command, { cwd: userProjectDirectoryPath }, function (error, stdout, stderr) {
			try {
				stderr.should.match(/The provided answer "--malformed1:Blah" is malformed.*\nThe provided answer "--malformed2" is malformed/);
				done();
			} catch (err) {
				done(err);
			}
		});
	});
});