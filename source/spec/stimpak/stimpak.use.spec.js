import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";

describe("stimpak.use()", () => {
	let stimpak,
			returnValue;

	class MockGenerator {
		constructor(...options) {
			this.constructorSpy = sinon.spy();
			this.constructorSpy(...options);
		}
	}

	beforeEach(() => {
		stimpak = new Stimpak();
		returnValue = stimpak.use(MockGenerator);
	});

	it("should return itself to enable chaining", () => {
		returnValue.should.eql(stimpak);
	});

	it("should add the instantiated generators to .generators", () => {
		stimpak.generators[0].should.be.instanceOf(MockGenerator);
	});

	it("should instantiate each provided generator constructor with stimpak as the first argument", () => {
		stimpak.generators[0].constructorSpy.calledWith(stimpak).should.be.true;
	});
});
