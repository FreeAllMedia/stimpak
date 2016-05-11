"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Source = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _staircase = require("staircase");

var _staircase2 = _interopRequireDefault(_staircase);

var _promptly = require("promptly");

var _promptly2 = _interopRequireDefault(_promptly);

var _mrt = require("mrt");

var _mrt2 = _interopRequireDefault(_mrt);

var _source = require("../source/source.js");

var _source2 = _interopRequireDefault(_source);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.Source = _source2.default;


var externalFunction = Symbol(),
    initializePrivateData = Symbol(),
    initializeInterface = Symbol(),
    initializeDefaults = Symbol();

var Stimpak = function (_ChainLink) {
	_inherits(Stimpak, _ChainLink);

	function Stimpak() {
		_classCallCheck(this, Stimpak);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(Stimpak).apply(this, arguments));
	}

	_createClass(Stimpak, [{
		key: "initialize",
		value: function initialize() {
			this[initializePrivateData]();
			this[initializeInterface]();
			this[initializeDefaults]();
		}
	}, {
		key: initializePrivateData,
		value: function value() {
			var _ = (0, _incognito2.default)(this);
			_.action = new _staircase2.default(this);
			_.promptly = _promptly2.default;
		}
	}, {
		key: initializeInterface,
		value: function value() {
			this.steps = (0, _incognito2.default)(this).action.steps;
			this.generators = [];

			this.link("source", _source2.default).into("sources");

			this.parameters("destination", "answers");

			this.parameters("merge").multiValue.aggregate;
		}
	}, {
		key: initializeDefaults,
		value: function value() {
			this.answers({});
		}
	}, {
		key: externalFunction,
		value: function value(functionFilePath) {
			var _require$default;

			for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				options[_key - 1] = arguments[_key];
			}

			return (_require$default = require(functionFilePath).default).call.apply(_require$default, [this].concat(options));
		}
	}, {
		key: "use",
		value: function use() {
			for (var _len2 = arguments.length, generators = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				generators[_key2] = arguments[_key2];
			}

			return this[externalFunction].apply(this, ["./stimpak.use.js"].concat(generators));
		}
	}, {
		key: "then",
		value: function then() {
			for (var _len3 = arguments.length, stepFunctions = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				stepFunctions[_key3] = arguments[_key3];
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
			for (var _len4 = arguments.length, prompts = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				prompts[_key4] = arguments[_key4];
			}

			return this[externalFunction].apply(this, ["./stimpak.prompt.js"].concat(prompts));
		}
	}, {
		key: "generate",
		value: function generate(callback) {
			return this[externalFunction]("./stimpak.generate.js", callback);
		}
	}]);

	return Stimpak;
}(_mrt2.default);

exports.default = Stimpak;