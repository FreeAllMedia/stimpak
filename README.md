![](./images/stimpak-logo.png?raw=true)
![](./images/generate.gif?raw=true)

# Stimpak: A Pattern Management System

[![npm version](https://img.shields.io/npm/v/stimpak.svg)](https://www.npmjs.com/package/stimpak) [![license type](https://img.shields.io/npm/l/stimpak.svg)](https://github.com/FreeAllMedia/stimpak.git/blob/master/LICENSE)  [![Build Status](https://travis-ci.org/FreeAllMedia/stimpak.png?branch=master)](https://travis-ci.org/FreeAllMedia/stimpak) [![Coverage Status](https://coveralls.io/repos/github/FreeAllMedia/stimpak/badge.svg?branch=master)](https://coveralls.io/github/FreeAllMedia/stimpak?branch=master) [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/stimpak/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/stimpak) [![bitHound Dependencies](https://www.bithound.io/github/FreeAllMedia/stimpak/badges/dependencies.svg)](https://www.bithound.io/github/FreeAllMedia/stimpak/dependencies/npm) [![bitHound Dev Dependencies](https://www.bithound.io/github/FreeAllMedia/stimpak/badges/devDependencies.svg)](https://www.bithound.io/github/FreeAllMedia/stimpak/dependencies/npm) [![npm downloads](https://img.shields.io/npm/dm/stimpak.svg)](https://www.npmjs.com/package/stimpak) ![Source: ECMAScript 6](https://img.shields.io/badge/Source-ECMAScript_2015-green.svg)

Software development (when doing it right) involves mostly patterns in both our code and our workflows. Automating these routine patterns and tasks frees us up to be more productive.

**Stimpak is a system for defining, discovering, and re-using code and workflow patterns:**

* Formalize code and workflow patterns with minimal effort so that they can be re-used and shared with others.
* Cut down on time doing routine tasks by generating new files based upon simple patterns.
* Update old files with new patterns using simple merging strategies.
* Develop automated expert systems that guide users through complicated tasks.

## Main Features

* **Built for Ease-of-Use**
	* Everything about stimpak was designed with ease-of-use and time-savings in mind.
	* Minimal learning required. Get up and running within a few minutes.
	* Automatic just-in-time transpiling for automatic backwards compatible with older versions of nodejs.
* **Minimally-Opinionated Generator Design**
	* Very little learning required to write your own generators. Make your first pattern in less than 5 minutes.
	* Setup your directory structures the way you want. Change them later if you want to.
	* Name your methods how you'd like. Except for one `.setup` method on each generator, you're free to use any method name you'd like, or to change them later.
* **Composable Generators**
	* Create several small generators that work independently.
	* Combine generators together on-the-fly via the CLI.
	* Combine generators into a new generator that can guide the user through multiple tasks at once.
* **Smart File Merging**
	* Easily tell stimpak what to do if a file you're trying to generate already exists.
	* Merge strategies use `vinyl` file objects for ultimate flexibility when merging.
* **Customizable ASCII-Art**
	* Built-in ASCII-Art generator for BIG popping titles in any of 680 built-in figlet fonts.
	* Optionally choose *not* to have ASCII-Art whenever you use your generators. It's all up to you!
* **Quality-Controlled**
	* Well-tested with meaningful assertions.
	* 100% test coverage.
	* Continuous Integration
	* Automated Code Quality Auditing
	* Automated Dependency Management
	* Automated Up-Stream Security Vulnerability Reporting


## Getting Started Guides

Stimpak can be used as both a command-line interface (CLI), and as a standalone library that can be embedded into your own code. Choose the guide below to help you get started with either integration method, or with writing a new stimpak generator from scratch:

1. [Stimpak Command-Line Interface](./CLI.md)
2. [Stimpak API](./API.md)
3. [Stimpak Generator Development](./GENERATORS.md)

## How to Contribute

We *love* pull requests and issue reports! **Really!**

If you find a bug or have a feature suggestion, please feel free to [submit an issue here](https://github.com/FreeAllMedia/stimpak/issues).

For more information on *how* to submit a pull request, please [read this guide on contributing to open-source projects](https://guides.github.com/activities/contributing-to-open-source/).
