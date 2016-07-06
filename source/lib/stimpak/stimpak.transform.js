export default function transform(callback) {
	return this.then(stimpak => {
		this.transforms(callback);
	});
}
