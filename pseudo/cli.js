
npm install stimpak -g
npm install stimpak-new-project -g


// Running stimpak without arguments
$ stimpak new-project something-else

// Help commands
$ stimpak
$ stimpak -h

// Answering questions via CLI
$ stimpak new-project
	--fileName="something"
	--useSomething=true


ASK QUESTIONS EHRERERE

GENERATE CODE


/////////////////////


import Stimpak from "stimpak";
import AdvancedProjectGenerator from "stimpak-advanced-project";

const generator = new Stimpak().use(AdvancedProjectGenerator);

generator
	.answers({
		something: "blah"
	})
	.generate(error => {
		if (error) { throw error; }
	});

const callFunction = Symbol();
