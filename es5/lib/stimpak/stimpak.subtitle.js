"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = subtitle;

var _asciiArt = require("ascii-art");

var _asciiArt2 = _interopRequireDefault(_asciiArt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_asciiArt2.default.Figlet.fontPath = __dirname + "/../../figlet-fonts/";

function subtitle() {
	var _this = this;

	var message = arguments.length <= 0 || arguments[0] === undefined ? "Sub-Title" : arguments[0];
	var figletFont = arguments.length <= 1 || arguments[1] === undefined ? "standard" : arguments[1];

	this.debug("subtitle", message, figletFont);

	this.then(function (stimpak, done) {
		_asciiArt2.default.font(message, figletFont, function (renderedMessage) {
			_this.write("\n" + renderedMessage);
			done();
		});
	});

	return this;
}