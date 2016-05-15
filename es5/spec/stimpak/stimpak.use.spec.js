"use strict";

var _stimpak = require("../../lib/stimpak/stimpak.js");

var _stimpak2 = _interopRequireDefault(_stimpak);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("stimpak.use()", function () {
	var stimpak = void 0,
	    returnValue = void 0;

	var MockGenerator = function MockGenerator() {
		_classCallCheck(this, MockGenerator);

		this.constructorSpy = _sinon2.default.spy();
		this.constructorSpy.apply(this, arguments);
	};

	beforeEach(function () {
		stimpak = new _stimpak2.default();
		returnValue = stimpak.use(MockGenerator);
	});

	it("should return itself to enable chaining", function () {
		returnValue.should.eql(stimpak);
	});

	it("should add the instantiated generators to .generators", function () {
		stimpak.generators[0].should.be.instanceOf(MockGenerator);
	});

	it("should instantiate each provided generator constructor with stimpak as the first argument", function () {
		stimpak.generators[0].constructorSpy.calledWith(stimpak).should.be.true;
	});
});