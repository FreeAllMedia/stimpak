export default function transform(transformFunction) {
	this.transforms(transformFunction);
	return this;
}
