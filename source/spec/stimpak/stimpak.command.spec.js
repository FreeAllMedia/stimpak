import Stimpak from "../../lib/stimpak/stimpak.js";
import sinon from "sinon";

describe("stimpak.command()", () => {
	let stimpak,
			command,
			commandCallback,
			errorCommand,
			results;

	beforeEach(done => {
		results = {};
		stimpak = new Stimpak();
		command = "echo 'The Dolphin'";
		errorCommand = "(>&2 echo 'error')";
		commandCallback = sinon.spy((generator, stdout, stderr, postCommandDone) => {
			results.generator = generator;
			results.stdout = stdout;
			results.stderr = stderr;
			postCommandDone();
		});
		results.returnValue = stimpak
			.command(command, commandCallback);

		stimpak
			.destination("/some/path")
			.generate(done);
	});

	it("should return itself to enable chaining", () => {
		results.returnValue.should.eql(stimpak);
	});

	it("should add its step to .steps", () => {
		stimpak.steps.length.should.eql(1);
	});

	it("should run the command and callback with stimpak", () => {
		results.generator.should.eql(stimpak);
	});

	it("should run the command and callback with stdout", () => {
		results.stdout.should.eql("The Dolphin\n");
	});

	it("should run the command and callback with stderr", done => {
		stimpak = new Stimpak()
			.command(errorCommand, commandCallback)
			.destination("/some/path")
			.generate(() => {
				results.stderr.should.eql("error\n");
				done();
			});
	});
});
