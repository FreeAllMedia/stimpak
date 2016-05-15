import fileSystem from "fs";

export default class Generator {
	constructor(stimpak) {
		console.log("STIMPAK", stimpak);

		process.stdout.write(
			stimpak.constructor.name
		);

		const filePath = `${process.cwd()}/generated.js`;

		//fileSystem.writeFileSync(filePath, "GENERATED!");
	}
}
