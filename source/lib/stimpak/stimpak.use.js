export default function use(...generators) {
	this.debug("use", generators);
	generators.forEach(GeneratorConstructor => {
		const originalContext = this.context();
		const generator = new GeneratorConstructor(this);
		this.generators.push(generator);

		this.context(generator);
		generator.setup(this);
		this.context(originalContext);
	});
	return this;
}
