import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";

xdescribe("stimpak.after()", () => {
	let stimpak,
			stepOne,
			stepTwo,
			stepThree;

	beforeEach(() => {
		stimpak = new Stimpak().test;

		const slowFunction = (generator, callback) => {
			setTimeout(callback, 100);
		};

		stepOne = sinon.spy(slowFunction);
		stepTwo = sinon.spy(slowFunction);
		stepThree = sinon.spy(slowFunction);
	});

	let clock;
	beforeEach(() => {
		clock = sinon.useFakeTimers();
	});
	afterEach(() => {
		clock.restore();
	});

	it("should return itself to enable chaining", () => {
		stimpak.after(stepOne).should.eql(stimpak);
	});

	it("should add a `stimpak step` to the list of steps to be executed", () => {
		stimpak.after(stepOne);
		stimpak.steps.length.should.eql(1);
	});

	it("should be able to add multiple functions at once", () => {
		stimpak.after(stepOne, stepTwo, stepThree);

		stimpak.steps[0].steps.length.should.eql(3);
	});

	it("should be able to add multiple functions at once to be run in series", () => {
		stimpak.after(stepOne, stepTwo, stepThree);
		stimpak.steps[0].concurrency.should.eql("series");
	});

	it("should call after all preceding `stimpak steps` are completed", () => {
		stimpak
			.after(stepOne, stepTwo)
			.after(stepThree);

		stimpak.generate();
		clock.tick(250);

		stepThree.called.should.be.true;
	});

	it("should not call before all preceding `stimpak steps` are completed", () => {
		stimpak
			.after(stepOne)
			.after(stepTwo);

		stimpak.generate();
		clock.tick(50);

		stepTwo.called.should.be.false;
	});
});
