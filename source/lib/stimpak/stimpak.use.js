export default function use(...generators) {
	generators.forEach(GeneratorConstructor => {
		this.generators.push(new GeneratorConstructor(this));
	});
	return this;
}
