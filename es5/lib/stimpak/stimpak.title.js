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
	var _this = this;

	var message = arguments.length <= 0 || arguments[0] === undefined ? "Title" : arguments[0];
	var figletFont = arguments.length <= 1 || arguments[1] === undefined ? "standard" : arguments[1];

	this.debug("title", message, figletFont);

	var _ = (0, _incognito2.default)(this);

	if (!_.titleShown) {
		_.titleShown = true;
		this.then(function (stimpak, done) {
			_asciiArt2.default.font(message, figletFont, function (renderedMessage) {
				_this.write("\n" + renderedMessage);
				done();
			});
		});
	}

	return this;
}