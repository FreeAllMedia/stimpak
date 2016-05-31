export default function use(...generators) {
	this.debug("use", generators);
	generators.forEach(GeneratorConstructor => {
		this.generators.push(new GeneratorConstructor(this));
	});
	return this;
}
