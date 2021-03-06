"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = command;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _child_process = require("child_process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function command(commandString, afterCommand) {
	var _this = this;

	this.debug(".command", commandString);
	var _ = (0, _incognito2.default)(this);
	_.action.step(function (stimpak, done) {
		(0, _child_process.exec)(commandString, function (error, stdout, stderr) {
			_.report.events.push({
				type: "command",
				command: commandString,
				stdout: stdout,
				stderr: stderr
			});
			if (afterCommand) {
				switch (afterCommand.length) {
					case 4:
						afterCommand(_this, stdout, stderr, done);
						break;
					default:
						try {
							afterCommand(_this, stdout, stderr);
							done();
						} catch (exception) {
							done(exception);
						}
				}
			} else {
				done();
			}
		});
	});
	return this;
}