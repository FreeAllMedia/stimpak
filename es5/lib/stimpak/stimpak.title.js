"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = title;

var _asciiArt = require("ascii-art");

var _asciiArt2 = _interopRequireDefault(_asciiArt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_asciiArt2.default.Figlet.fontPath = __dirname + "/../../../figlet-fonts/";

function title() {
	var message = arguments.length <= 0 || arguments[0] === undefined ? "Title" : arguments[0];
	var figletFont = arguments.length <= 1 || arguments[1] === undefined ? "Standard" : arguments[1];

	this.debug("title", message);

	this.then(function (stimpak, done) {
		_asciiArt2.default.font(message, figletFont, function (renderedMessage) {
			process.stdout.write("\n" + renderedMessage);
			done();
		});
	});

	return this;
}