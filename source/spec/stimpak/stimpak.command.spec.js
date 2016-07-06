import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";

describe("stimpak.command()", () => {
	let stimpak,
			command,
			syncCommandCallback,
			asyncCommandCallback,
			errorCommand,
			results;

	beforeEach(() => {
		results = {};
		stimpak = new Stimpak();
		command = "echo 'The Dolphin'";
		errorCommand = "(>&2 echo 'error')";
		syncCommandCallback = sinon.spy((stim, stdout, stderr) => {
			results.stim = stim;
			results.stdout = stdout;
			results.stderr = stderr;
		});
		asyncCommandCallback = sinon.spy((stim, stdout, stderr, postCommandDone) => {
			results.stim = stim;
			results.stdout = stdout;
			results.stderr = stderr;
			postCommandDone();
		});
	});

	describe("Asynchronous callback", () => {
		beforeEach(done => {
			results.returnValue = stimpak
			.command(command, asyncCommandCallback);

			stimpak
			.generate(done);
		});

		it("should return itself to enable chaining", () => {
			results.returnValue.should.eql(stimpak);
		});

		it("should add its step to .steps", () => {
			stimpak.steps.length.should.eql(1);
		});

		it("should run the command and callback with stimpak", () => {
			results.stim.should.eql(stimpak);
		});

		it("should run the command and callback with stdout", () => {
			results.stdout.should.eql("The Dolphin\n");
		});

		describe("error", () => {
			it("should run the command and callback with stderr", done => {
				stimpak = new Stimpak()
					.command(errorCommand, asyncCommandCallback)
					.generate(() => {
						results.stderr.should.eql("error\n");
						done();
					});
			});
		});
	});

	describe("Synchronous callback", () => {
		beforeEach(done => {
			stimpak
			.command(command, syncCommandCallback)
			.generate(done);
		});

		it("should run the command with a synchronous callback", () => {
			syncCommandCallback.calledWith(stimpak).should.be.true;
		});

		describe("error", () => {
			it("should run the command and callback with stderr", done => {
				stimpak = new Stimpak()
					.command(errorCommand, syncCommandCallback)
					.generate(() => {
						results.stderr.should.eql("error\n");
						done();
					});
			});

			it("should callback with any errors thrown", done => {
				const expectedError = new Error("Doh!");
				stimpak = new Stimpak()
					.command(errorCommand, () => {
						throw expectedError;
					})
					.generate(actualError => {
						actualError.should.eql(expectedError);
						done();
					});
			});
		});
	});

	describe("No callback", () => {
		it("should run the command without a command callback", done => {
			stimpak = new Stimpak()
				.command(command)
				.generate(error => {
					done(error);
				});
		});
	});
});
