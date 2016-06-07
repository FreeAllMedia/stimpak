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

	it.only("should bind the correct context into then() callbacks", done => {
    stimpak
      .context(object)
      .then(function (self, stepDone) {
        this.should.eql(object);
        console.log("this", this, object);
        stepDone();
      });

      stimpak
  			.generate(() => {
  				done();
  			});
	});
});
