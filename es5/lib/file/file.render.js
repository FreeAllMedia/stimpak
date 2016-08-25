"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = render;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(callback) {
	var _this = this;

	var engine = this.engine();

	engine(this, function (error, rendered) {
		_fs2.default.writeFileSync(_this.path(), rendered);
		callback(error);
	});

	return this;
}