"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mrt = require("mrt");

var _mrt2 = _interopRequireDefault(_mrt);

var _ejs = require("ejs");

var _ejs2 = _interopRequireDefault(_ejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import privateData from "incognito";

var externalFunction = Symbol();

var File = function (_ChainLink) {
	_inherits(File, _ChainLink);

	function File() {
		_classCallCheck(this, File);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(File).apply(this, arguments));
	}

	_createClass(File, [{
		key: "initialize",
		value: function initialize() {
			var _this2 = this;

			var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			this.parameters("content", "engine", "debug", "merge", "difference");

			this.parameters("values").merge;

			this.content(options.content);
			this.values(options.values);
			this.engine(function (self, complete) {
				var rendered = _ejs2.default.render(_this2.content(), _this2.values());
				complete(null, rendered);
			});
		}
	}, {
		key: "render",
		value: function render(path, callback) {
			return this[externalFunction](__dirname + "/template.render.js", path, callback);
		}
	}, {
		key: "log",
		value: function log(message, payload) {
			return this[externalFunction](__dirname + "/template.log.js", message, payload);
		}
	}, {
		key: externalFunction,
		value: function value(functionFilePath) {
			var _require$default;

			for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				options[_key - 1] = arguments[_key];
			}

			var returnValue = (_require$default = require(functionFilePath).default).call.apply(_require$default, [this].concat(options));

			return returnValue;
		}
	}]);

	return File;
}(_mrt2.default);

exports.default = File;