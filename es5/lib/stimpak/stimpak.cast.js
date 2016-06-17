"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cast;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function cast(callback) {
  var _this = this;

  return this.then(function (stimpak) {
    _this.casts(callback);
  });
}