"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = dog;
function dog(message) {
	this.logStream().write(message);
	return this;
}