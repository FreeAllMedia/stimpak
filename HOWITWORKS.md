1. Get the generator module directory path.
2. Check if module is in the global directory or not.
3. If module is in global directory, move it into the stimpak/generators directory temporarily
4. Symlink dependencies into module directory
5. `stimpak.use(Generator)`
6. `stimpak.generate()`
7. Remove Symlinks
8. Move module back to original directory if moved
