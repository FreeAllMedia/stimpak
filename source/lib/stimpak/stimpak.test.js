import temp from "temp";

temp.track();

export default function test() {
	this.debug("test");
	this.destination(temp.mkdirSync("stimpak-test"));
	return this;
}
