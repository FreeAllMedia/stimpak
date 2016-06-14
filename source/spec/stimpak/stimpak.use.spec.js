import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";

describe("stimpak.use()", () => {
	let stimpak,
			returnValue;

	class MockGenerator {
		setup(stim) {
			this.constructorSpy = sinon.spy();
			this.constructorSpy(stim);
			stim.then(this.doSomething);
		}

		doSomething(stim, done) {
			this.context = this;
			done();
		}
	}

	beforeEach(done => {
		stimpak = new Stimpak();
		returnValue = stimpak.use(MockGenerator);

		stimpak
			.destination("/some/path")
			.generate(done);
	});

	it("should return itself to enable chaining", () => {
		returnValue.should.eql(stimpak);
	});

	it("should use the context of the generator being used", () => {
		const generator = stimpak.generators[0];
		generator.context.should.eql(generator);
	});

	it("should restore the context to it's previous value after using a generator", () => {
		stimpak.context().should.eql(stimpak);
	});

	it("should add the instantiated generators to .generators", () => {
		stimpak.generators[0].should.be.instanceOf(MockGenerator);
	});

	it("should instantiate each provided generator constructor with stimpak as the first argument", () => {
		stimpak.generators[0].constructorSpy.calledWith(stimpak).should.be.true;
	});
});
