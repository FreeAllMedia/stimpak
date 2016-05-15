import fileSystem from "fs";

export default class Generator {
	constructor(stimpak) {
		process.stdout.write(
			stimpak.constructor.name
		);

		const filePath = `${stimpak.destination()}/generated.js`;
		fileSystem.writeFileSync(filePath, "GENERATED!");
	}
}
