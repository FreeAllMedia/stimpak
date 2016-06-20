export default function cast(callback) {
	return this.then(stimpak => {
		this.casts(callback);
	});
}
