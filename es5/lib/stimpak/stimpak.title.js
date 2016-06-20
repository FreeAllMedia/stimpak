"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = title;

var _asciiArt = require("ascii-art");

var _asciiArt2 = _interopRequireDefault(_asciiArt);

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_asciiArt2.default.Figlet.fontPath = __dirname + "/../../../figlet-fonts/";

function title() {
	var message = arguments.length <= 0 || arguments[0] === undefined ? "Title" : arguments[0];
	var figletFont = arguments.length <= 1 || arguments[1] === undefined ? "Standard" : arguments[1];

	this.debug("title", message);

	var needsLineBreak = Boolean((0, _incognito2.default)(this).needsLineBreak);

	this.then(function (stimpak, done) {
		if (needsLineBreak) {
			process.stdout.write("\n");
		}

		_asciiArt2.default.font(message, figletFont, function (renderedMessage) {
			process.stdout.write(renderedMessage);
			done();
		});
	});

	return this;
}