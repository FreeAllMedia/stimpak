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

var _mrt = require("mrt");

var _mrt2 = _interopRequireDefault(_mrt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var externalFunction = Symbol();

var Stimpak = function (_ChainLink) {
	_inherits(Stimpak, _ChainLink);

	function Stimpak() {
		_classCallCheck(this, Stimpak);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Stimpak).apply(this, arguments));
	}

	_createClass(Stimpak, [{
		key: "initialize",
		value: function initialize() {
			var _ = (0, _incognito2.default)(this);
			_.action = new _staircase2.default(this);
			_.promptly = _promptly2.default;

			this.answers = {};
			this.steps = _.action.steps;
			this.generators = [];

			this.parameters("destination");

			this.parameters("source", "onMerge").multiValue.aggregate;
		}
	}, {
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
		key: "command",
		value: function command(_command, callback) {
			return this[externalFunction]("./stimpak.command.js", _command, callback);
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
}(_mrt2.default);

exports.default = Stimpak;