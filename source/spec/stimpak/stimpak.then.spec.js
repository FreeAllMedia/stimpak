import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";

describe("stimpak.then()", () => {
	let stimpak,
			stepOne,
			stepTwo,
			stepThree;

	beforeEach(() => {
		stimpak = new Stimpak()
			.destination("/some/path");

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
		stimpak.then(stepOne).should.eql(stimpak);
	});

	it("should add a `stimpak step` to the list of steps to be executed", () => {
		stimpak.then(stepOne);
		stimpak.steps[0].should.eql({
			concurrency: "series",
			steps: [stepOne]
		});
	});

	it("should be able to add multiple functions at once", () => {
		stimpak.then(stepOne, stepTwo, stepThree);

		stimpak.steps[0].steps.should.have.members([
			stepOne, stepTwo, stepThree
		]);
	});

	it("should be able to add multiple functions at once to be run in series", () => {
		stimpak.then(stepOne, stepTwo, stepThree);
		stimpak.steps[0].concurrency.should.eql("series");
	});

	it("should call after all preceding `stimpak steps` are completed", () => {
		stimpak
			.then(stepOne, stepTwo)
			.then(stepThree);

		stimpak.generate();
		clock.tick(250);

		stepThree.called.should.be.true;
	});

	it("should not call before all preceding `stimpak steps` are completed", () => {
		stimpak
			.then(stepOne)
			.then(stepTwo);

		stimpak.generate();
		clock.tick(50);

		stepTwo.called.should.be.false;
	});
});
