import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.generate() (changed context)", () => {
  let stimpak;
  let object = { "foo": "bar" };

	beforeEach(() => {
		stimpak = new Stimpak();
		stimpak.destination('some/path');
	});

  it("should run each step with the given context", done => {
    stimpak.context(object);
    stimpak.then(function (self, stepDone) {
      this.called = true;
      stepDone();
    });

    stimpak.generate(error => {
      object.should.eql({
        "foo": "bar",
        called: true,
      });

      done(error);
    });
  });
});
