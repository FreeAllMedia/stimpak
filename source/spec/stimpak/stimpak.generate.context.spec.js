import Stimpak from "../../lib/stimpak/stimpak.js";

// @TODO: remove .only
describe.only("stimpak.generate() (changed context)", () => {
  let stimpak;
  let object = { "foo": "bar" };

	beforeEach(() => {
		stimpak = new Stimpak();
	});

  it("should run each step with the given context", done => {
    stimpak.context(object);
    stimpak.then(function (self, stepDone) {
      this.called = true;
      stepDone();
    });

    stimpak.generate(error => {
      (object.called === undefined).should.not.be.true;

      done(error);
    });
  });
});
