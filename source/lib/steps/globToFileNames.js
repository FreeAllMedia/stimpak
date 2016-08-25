import glob from "glob";

export default function globToFileNames(globString, directoryPath, done) {
	glob(globString, { cwd: directoryPath, dot: true }, done);
}
