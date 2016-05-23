import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.answers", () => {
	let stimpak;

	beforeEach(() => {
		stimpak = new Stimpak();
	});

	it("should be an empty object by default", () => {
		stimpak.answers().should.eql({});
	});

	it("should be settable", () => {
		const newAnswers = {
			foo: "bar"
		};
		stimpak.answers(newAnswers);
		stimpak.answers().should.eql(newAnswers);
	});

	it("should merge answers by name", () => {
		const answersOne = {
			foo: "bar",
			baz: "snarf"
		};

		const answersTwo = {
			baz: "blah"
		};

		const mergedAnswers = {
			foo: "bar",
			baz: "blah"
		};

		stimpak.answers(answersOne);
		stimpak.answers(answersTwo);
		stimpak.answers().should.eql(mergedAnswers);
	});
});
