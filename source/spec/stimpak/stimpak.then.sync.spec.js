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

		const slowFunction = () => {};

		stepOne = sinon.spy(slowFunction);
		stepTwo = sinon.spy(slowFunction);
		stepThree = sinon.spy(slowFunction);
	});

	it("should return itself to enable chaining", () => {
		stimpak.then(stepOne).should.eql(stimpak);
	});

	it("should add a `stimpak step` to the list of steps to be executed", () => {
		stimpak.then(stepOne);
		stimpak.steps.length.should.eql(1);
	});

	it("should be able to add multiple functions at once", () => {
		stimpak.then(stepOne, stepTwo, stepThree);

		stimpak.steps[0].steps.length.should.eql(3);
	});

	it("should be able to add multiple functions at once to be run in series", () => {
		stimpak.then(stepOne, stepTwo, stepThree);
		stimpak.steps[0].concurrency.should.eql("series");
	});

	it("should call each step in order", done => {
		stimpak
			.then(stepOne, stepTwo)
			.then(stepThree)
			.generate(error => {
				sinon.assert.callOrder(stepOne, stepTwo, stepThree);
				done(error);
			});
	});

	it("should boil up thrown errors from synchronous steps", done => {
		const expectedError = new Error();
		stimpak
			.then(() => {
				throw expectedError;
			})
			.generate(error => {
				error.should.eql(expectedError);
				done();
			});
	});
});
