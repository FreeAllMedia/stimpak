# Stimpak Functionality Roadmap

1. Allow overwriting of directories.
2. Allow dot files `.babelrc` to be generated. (add the dotFile: true option to the globs)
3. Reporting! We need to know what stimpak did during a `.generate()` (D.C. will do this.)
4. Remove the need for moving generators (especially globally installed generators) into a temporary directory before `require()`-ing. (Special Prize for whoever figures this out)
	* Cannot change specs!
	* Must provide an elegant solution. Don't want to trade an ugly solution for another ugly solution.
	* All specs must pass
	* Make it as readable as possible!
	* Minimize dependency additions!
