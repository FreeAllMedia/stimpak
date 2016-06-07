"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = context;
function context(object) {
  var action = privateData(this).action;
  if (object) {
    action.context(object);
    return this;
  }

  return action.context();
}