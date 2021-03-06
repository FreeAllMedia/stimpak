"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _staircase = require("staircase");

var _staircase2 = _interopRequireDefault(_staircase);

var _mrt = require("mrt");

var _mrt2 = _interopRequireDefault(_mrt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var externalFunction = Symbol(),
    initializePrivateData = Symbol(),
    initializeInterface = Symbol(),
    parseOptions = Symbol(),
    addLineBreak = Symbol();

var Stimpak = function (_ChainLink) {
	_inherits(Stimpak, _ChainLink);

	function Stimpak() {
		_classCallCheck(this, Stimpak);

		return _possibleConstructorReturn(this, (Stimpak.__proto__ || Object.getPrototypeOf(Stimpak)).apply(this, arguments));
	}

	_createClass(Stimpak, [{
		key: "initialize",
		value: function initialize(options) {
			this[initializePrivateData]();
			this[initializeInterface]();
			this[parseOptions](options);
		}
	}, {
		key: initializePrivateData,
		value: function value() {
			var _ = (0, _incognito2.default)(this);
			_.action = new _staircase2.default(this);
			_.action.context(this);
			_.report = {
				events: [],
				files: {},
				diffFixtures: require("./stimpak.report.diffFixtures.js").default.bind(this)
			};
		}
	}, {
		key: initializeInterface,
		value: function value() {
			var _this2 = this;

			this.steps = (0, _incognito2.default)(this).action.steps;
			this.generators = [];
			this.sources = [];

			this.properties("destination", "debugStream", "logStream");

			this.properties("skip").aggregate;

			this.properties("transforms").aggregate;

			this.properties("answers").merged.filter(function (answer) {
				var transformedAnswerValue = answer;
				function transformUnlessFalsy(originalValue, transform) {
					var transformedValue = transform(originalValue);

					/* eslint-disable eqeqeq */
					if (transformedValue == false || isNaN(transformedValue)) {
						transformedValue = originalValue;
					}

					return transformedValue;
				}

				_this2.transforms().forEach(function (transformFunction) {
					if (transformedAnswerValue.constructor === Array) {
						transformedAnswerValue = transformedAnswerValue.map(function (value) {
							return transformUnlessFalsy(value, transformFunction);
						});
					} else {
						transformedAnswerValue = transformUnlessFalsy(transformedAnswerValue, transformFunction);
					}
				});

				return transformedAnswerValue;
			});

			this.properties("merge").multi.aggregate;
		}
	}, {
		key: parseOptions,
		value: function value() {
			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			this.debugStream(options.debugStream);
			this.logStream(options.logStream || process.stdout);
		}
	}, {
		key: externalFunction,
		value: function value(functionFilePath) {
			var _require$default;

			for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				options[_key - 1] = arguments[_key];
			}

			this.debug("externalFunction: " + functionFilePath, options);

			this[addLineBreak](functionFilePath);

			var returnValue = (_require$default = require(functionFilePath).default).call.apply(_require$default, [this].concat(options));

			return returnValue;
		}
	}, {
		key: addLineBreak,
		value: function value(functionFilePath) {
			var _ = (0, _incognito2.default)(this);

			var notDefined = void 0;

			_.needsLineBreak = false;

			switch (functionFilePath) {
				case "./stimpak.prompt.js":
					switch (_.lastWritingStepType) {
						case "./stimpak.note.js":
						case "./stimpak.info.js":
						case "./stimpak.title.js":
						case "./stimpak.subtitle.js":
						case notDefined:
							_.needsLineBreak = true;
					}
					_.lastWritingStepType = functionFilePath;
					break;
				case "./stimpak.note.js":
				case "./stimpak.info.js":
				case "./stimpak.title.js":
				case "./stimpak.subtitle.js":
					_.lastWritingStepType = functionFilePath;
			}
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
		key: "transform",
		value: function transform(callback) {
			return this[externalFunction]("./stimpak.transform.js", callback);
		}
	}, {
		key: "context",
		value: function context(object) {
			return this[externalFunction]("./stimpak.context.js", object);
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
	}, {
		key: "note",
		value: function note(message) {
			return this[externalFunction]("./stimpak.note.js", message);
		}
	}, {
		key: "info",
		value: function info(message, payload) {
			return this[externalFunction]("./stimpak.info.js", message, payload);
		}
	}, {
		key: "title",
		value: function title(message, font) {
			return this[externalFunction]("./stimpak.title.js", message, font);
		}
	}, {
		key: "subtitle",
		value: function subtitle(message, font) {
			return this[externalFunction]("./stimpak.subtitle.js", message, font);
		}
	}, {
		key: "log",
		value: function log(message, payload) {
			return this[externalFunction]("./stimpak.log.js", message, payload);
		}
	}, {
		key: "render",
		value: function render(globString, directoryPath) {
			return this[externalFunction]("./stimpak.render.js", globString, directoryPath);
		}
	}, {
		key: "add",
		value: function add(path, contents) {
			return this[externalFunction]("./stimpak.add.js", path, contents);
		}
	}, {
		key: "debug",
		value: function debug(message, payload) {
			return require("./stimpak.debug.js").default.call(this, message, payload);
		}
	}, {
		key: "write",
		value: function write(message) {
			process.stdout.write(message);
		}
	}, {
		key: "report",
		get: function get() {
			return (0, _incognito2.default)(this).report;
		}
	}, {
		key: "test",
		get: function get() {
			return this[externalFunction]("./stimpak.test.js");
		}
	}]);

	return Stimpak;
}(_mrt2.default);

exports.default = Stimpak;