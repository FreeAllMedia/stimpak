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

	this.debug("use", generators);
	generators.forEach(function (GeneratorConstructor) {
		var originalContext = _this.context();
		var generator = new GeneratorConstructor(_this);
		_this.generators.push(generator);

		_this.context(generator);
		generator.setup(_this);
		_this.context(originalContext);
	});
	return this;
}