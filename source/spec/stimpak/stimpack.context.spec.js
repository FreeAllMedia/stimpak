import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.context()", () => {
	let stimpak;
  let object = { "foo": "bar" };

	beforeEach(() => {
		stimpak = new Stimpak();
	});

	it("should return itself to enable chaining", () => {
		stimpak.context(object).should.eql(stimpak);
	});

  it("should run each step with the given context", done => {
    stimpak.context(object);
		stimpak.then(function (self, stepDone) {
			this.called = true;
			stepDone();
		});

		stimpak
			.generate(error => {
				(object.called === undefined).should.not.be.true;

				done(error);
			});
	});
});
