"use strict";

var _stimpak = require("../../../es5/lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prompts = [{
	type: "input",
	name: "firstName",
	message: "What is your first name?",
	default: "Bob"
}, {
	type: "input",
	name: "lastName",
	message: "What is your last name?",
	default: "Belcher"
}];

var stimpak = new _stimpak2.default();

stimpak.prompt.apply(stimpak, prompts).generate(function (answers) {
	console.log("answers", answers);
});