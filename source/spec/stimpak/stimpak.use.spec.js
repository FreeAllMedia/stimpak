import Stimpak from "../../lib/stimpak/stimpak.js";

describe("stimpak.use()", () => {
	let stimpak,
			generator,
			subGenerator,
			subSubGenerator,
			returnValue,
			results;

	class Generator {
		setup(stim) {
			results.argument = stim;
			results.generatorContext = this;

			// generator

			stim
				.then(this.recordThenContext)
				.then(this.setupTest);
		}

		setupTest(stim, done) {
			stim
				.then(this.recordThenContext)
				.use(SubGenerator)
				.then(this.recordThenContext);
			done();
		}

		recordThenContext(stim, done) {
			results.thenContexts.push(this.constructor.name);
			done();
		}
	}

	class SubGenerator {
		setup(stim) {
			results.subGeneratorContext = this;

			stim
				.then(this.recordThenContext)
				.then(this.setupTest);
		}

		setupTest(stim, done) {
			stim
				.then(this.recordThenContext)
				.use(SubSubGenerator)
				.then(this.recordThenContext);
			done();
		}

		recordThenContext(stim, done) {
			results.thenSubContexts.push(this.constructor.name);
			done();
		}
	}

	class SubSubGenerator {
		setup(stim) {
			results.subSubGeneratorContext = this;

			stim
				.then(this.recordThenContext)
				.then(this.setupTest);
		}

		setupTest(stim, done) {
			stim
				.then(this.recordThenContext);
			done();
		}

		recordThenContext(stim, done) {
			results.thenSubSubContexts.push(this.constructor.name);
			done();
		}
	}

	beforeEach(done => {
		results = {
			argument: null,
			thenContexts: [],
			thenSubContexts: [],
			thenSubSubContexts: []
		};

		stimpak = new Stimpak();

		returnValue = stimpak.use(Generator);

		stimpak
			.destination("/some/path")
			.generate(error => {
				generator = stimpak.generators[0];
				subGenerator = stimpak.generators[1];
				subSubGenerator = stimpak.generators[2];

				done(error);
			});
	});

	it("should return itself to enable chaining", () => {
		returnValue.should.eql(stimpak);
	});

	it("should call setup on the generator without binding", () => {
		results.generatorContext.should.eql(generator);
	});

	it("should call setup on the sub generator without binding", () => {
		results.subGeneratorContext.should.eql(subGenerator);
	});

	it("should call setup on the sub sub generator without binding", () => {
		results.subSubGeneratorContext.should.eql(subSubGenerator);
	});

	it("should keep then contexts stable", () => {
		const generatorName = generator.constructor.name;
		results.thenContexts.should.eql([generatorName, generatorName, generatorName]);
	});

	it("should keep then sub contexts stable", () => {
		const subGeneratorName = subGenerator.constructor.name;
		results.thenSubContexts.should.eql([subGeneratorName, subGeneratorName, subGeneratorName]);
	});

	it("should keep then sub sub contexts stable", () => {
		const subSubGeneratorName = subSubGenerator.constructor.name;
		results.thenSubSubContexts.should.eql([subSubGeneratorName, subSubGeneratorName]);
	});

	it("should add the instantiated generators to .generators", () => {
		generator.should.be.instanceOf(Generator);
	});

	it("should instantiate each provided generator constructor with stimpak as the first argument", () => {
		results.argument.should.eql(stimpak);
	});
});
