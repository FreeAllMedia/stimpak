"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = transform;
function transform(transformFunction) {
	this.transforms(transformFunction);
	return this;
}