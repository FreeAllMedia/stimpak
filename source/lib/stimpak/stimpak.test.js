import temp from "temp";

temp.track();

export default function test() {
	this.write = () => {};

	this.debug("test");
	this.destination(temp.mkdirSync("stimpak-test"));
	return this;
}
