"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mrt = require("mrt");

var _mrt2 = _interopRequireDefault(_mrt);

var _vinyl = require("vinyl");

var _vinyl2 = _interopRequireDefault(_vinyl);

var _ejs = require("ejs");

var _ejs2 = _interopRequireDefault(_ejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var File = function (_ChainLink) {
	_inherits(File, _ChainLink);

	function File() {
		_classCallCheck(this, File);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(File).apply(this, arguments));
	}

	_createClass(File, [{
		key: "initialize",
		value: function initialize(path, content, values) {
			var _this2 = this;

			this.parameters("path", "content", "vinyl", "engine");

			this.parameters("values").merge;

			this.path(path);
			this.content(content);
			this.vinyl(new _vinyl2.default());
			this.values(values);
			this.engine(function (self, complete) {
				var rendered = _ejs2.default.render(_this2.content(), _this2.values());
				complete(null, rendered);
			});
		}
	}, {
		key: "render",
		value: function render(callback) {
			return require(__dirname + "/file.render.js").default.call(this, callback);
		}
	}]);

	return File;
}(_mrt2.default);

exports.default = File;