"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = render;

var _source = require("../source/source.js");

var _source2 = _interopRequireDefault(_source);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(globString, directoryPath) {
	var newSource = new _source2.default(this, globString, directoryPath);

	this.sources.push(newSource);

	this.then(function (stimpak, done) {
		newSource.render(done);
	});

	return newSource;
}