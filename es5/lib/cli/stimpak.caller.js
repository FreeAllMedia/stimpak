#!/usr/bin/env node
"use strict";

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _child_process = require("child_process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var binDirectoryPath = __dirname + "/../../../node_modules/.bin";
var stimpakCliPath = __dirname + "/stimpak.cli.js";
var command = _path2.default.normalize(binDirectoryPath + "/babel-node");

var commandArguments = [stimpakCliPath].concat(process.argv.splice(2));

(0, _child_process.spawn)(command, commandArguments, {
	cwd: process.cwd(),
	stdio: "inherit"
});