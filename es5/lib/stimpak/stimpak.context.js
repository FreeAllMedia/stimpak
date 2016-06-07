"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = context;

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function context(object) {
  var action = (0, _incognito2.default)(this).action;
  if (object) {
    action.context(object);
    return this;
  }

  return action.context();
}