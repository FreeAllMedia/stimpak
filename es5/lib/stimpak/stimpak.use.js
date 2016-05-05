"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = use;
function use() {
	var _this = this;

	for (var _len = arguments.length, generators = Array(_len), _key = 0; _key < _len; _key++) {
		generators[_key] = arguments[_key];
	}

	generators.forEach(function (GeneratorConstructor) {
		_this.generators.push(new GeneratorConstructor(_this));
	});
	return this;
}