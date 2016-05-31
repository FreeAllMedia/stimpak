const stimpak = new Stimpak({
	logStream: process.stdout,
	debugStream: fileSystem.createWriteStream("./debug.txt")
});

stimpak.logStream(fileSystem.createWriteStream("./log.txt"));
stimpak.debugStream(fileSystem.createWriteStream("./debug.txt"));

stimpak.log("This is a log message", object);
stimpak.debug("This is some debug stuff", object);

stimpak.logCallback("Extra info for the last log message", object);
stimpak.debugCallback("Extra info for the last debug call", object);
