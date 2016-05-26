#!/usr/bin/env node
"use strict";

var _stimpakCliRunner = require("./stimpak.cli.runner.js");

var _stimpakCliRunner2 = _interopRequireDefault(_stimpakCliRunner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-polyfill");

var stimpakCliRunner = new _stimpakCliRunner2.default();

stimpakCliRunner.run(process.argv, function (error) {
	if (error) {
		throw error;
	}
	// All done
});