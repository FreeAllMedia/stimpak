[![](../images/stimpak-logo.png?raw=true)](../../README.md)

# Stimpak Command-Line Interface

Stimpak works by installing a global command-line binary called `stimpak` when you install it via `npm`:

## Installation

``` shell
$ npm install stimpak -g --production
```

**Note:** The development libraries for stimpak are not needed for it to be used via the command-line, so we suggest adding the `--production` flag to cut down on `npm` install time.

## Finding Generators

All `stimpak` generators are prefixed with `stimpak-` in `npm`.

This makes finding stimpak generators very easy.

* [npmjs.com search (click for `stimpak` results)](https://www.npmjs.com/search?q=stimpak)

**Note:** We're looking into options for providing this functionality via the command-line.

## Installing Generators

After you have found a generator you want to use, in most cases you will needs to install that generator globally (using the `-g` flag). For example, if you wanted to use the `stimpak-generator` module which is used for generating and updating stimpak generators, you would need to install it globally via the following command:

``` shell
$ npm install stimpak-generator -g --production
```

**Note:** The development libraries for stimpak generators are not needed for them to be used via the command-line, so we suggest adding the `--production` flag to cut down on `npm` install time, and stimpak startup time.

## Using Generators

When you want to use a stimpak generator via the command-line, you will first **type `stimpak`, then the name of the generator minus the `stimpak-` prefix.**

**For example,** if you want to use the `stimpak-generator` module, you would type:

``` shell
$ stimpak generator
```

You can also run one generator after another to combine generators on-the-fly into a single workflow:

``` shell
$ npm install stimpak-npm stimpak-test-driven -g --production
$ stimpak npm test-driven
```

## Automatically Answering Questions

You can automatically answer questions by adding named flags to the end of your generator query.

``` shell
$ stimpak generator \
	--projectName="My Project Name" \
	--projectDescription="This is my description!"
```

**Note:** you will first need to know the names each question were given by the developer.

In the future, there will be a convenient command for getting this list, but right now the best way to find these names is to open the generator locally and look for the names in the `.prompt()` commands.

---

[Back to README.md](./README.md)
