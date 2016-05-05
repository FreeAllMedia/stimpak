"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _staircase = require("staircase");

var _staircase2 = _interopRequireDefault(_staircase);

var _promptly = require("promptly");

var _promptly2 = _interopRequireDefault(_promptly);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var externalFunction = Symbol();

var Stimpak = function () {
	function Stimpak() {
		_classCallCheck(this, Stimpak);

		var _ = (0, _incognito2.default)(this);
		_.action = new _staircase2.default(this);
		_.promptly = _promptly2.default;
		this.answers = {};
		this.steps = _.action.steps;
		this.generators = [];
	}

	_createClass(Stimpak, [{
		key: "use",
		value: function use() {
			for (var _len = arguments.length, generators = Array(_len), _key = 0; _key < _len; _key++) {
				generators[_key] = arguments[_key];
			}

			return this[externalFunction].apply(this, ["./stimpak.use.js"].concat(generators));
		}
	}, {
		key: "then",
		value: function then() {
			for (var _len2 = arguments.length, stepFunctions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				stepFunctions[_key2] = arguments[_key2];
			}

			return this[externalFunction].apply(this, ["./stimpak.then.js"].concat(stepFunctions));
		}
	}, {
		key: "prompt",
		value: function prompt() {
			for (var _len3 = arguments.length, prompts = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				prompts[_key3] = arguments[_key3];
			}

			return this[externalFunction].apply(this, ["./stimpak.prompt.js"].concat(prompts));
		}
	}, {
		key: "generate",
		value: function generate(callback) {
			return this[externalFunction]("./stimpak.generate.js", callback);
		}
	}, {
		key: externalFunction,
		value: function value(functionFilePath) {
			var _require$default;

			for (var _len4 = arguments.length, options = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
				options[_key4 - 1] = arguments[_key4];
			}

			return (_require$default = require(functionFilePath).default).call.apply(_require$default, [this].concat(options));
		}
	}]);

	return Stimpak;
}();

exports.default = Stimpak;