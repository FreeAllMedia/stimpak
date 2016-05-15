"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Generator = function Generator(stimpak) {
	_classCallCheck(this, Generator);

	console.log("STIMPAK", stimpak);

	process.stdout.write(stimpak.constructor.name);

	var filePath = process.cwd() + "/generated.js";

	//fileSystem.writeFileSync(filePath, "GENERATED!");
};

exports.default = Generator;