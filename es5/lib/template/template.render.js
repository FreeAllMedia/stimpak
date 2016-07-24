"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = render;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function render(path) {
	var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

	var templateEngine = this.engine();

	switch (templateEngine.length) {
		case 0:
		case 1:
			{
				var renderedTemplate = templateEngine(this);

				_fs2.default.writeFileSync(path, renderedTemplate);

				callback();
				break;
			}
		case 2:
			templateEngine(this, function (error, renderedTemplate) {
				_fs2.default.writeFileSync(path, renderedTemplate);
				callback(error);
			});
			break;
	}

	return this;
}