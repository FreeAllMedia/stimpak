"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = 



logo;var _incognito = require("incognito");var _incognito2 = _interopRequireDefault(_incognito);var _lodash = require("lodash.template");var _lodash2 = _interopRequireDefault(_lodash);var _fs = require("fs");var _fs2 = _interopRequireDefault(_fs);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function logo() {var message = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];
	var templateContents = _fs2.default.readFileSync(__dirname + "/../cli/templates/logo.txt");
	var template = (0, _lodash2.default)(templateContents);
	var renderedNote = template({ 
		message: message });


	var _ = (0, _incognito2.default)(this);
	_.action.
	step(function (stimpak, done) {
		process.stdout.write(renderedNote);
		done();});

	return this;}