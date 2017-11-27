#!/usr/bin/env node
"use strict";
const meow = require("meow");
const Caption = require('caption-core');
const Observable = require("zen-observable");
const inquirer = require('inquirer');
const logUpdate = require('log-update');
const Listr = require('listr');
var clear = require('clear');
const ListrMultilineRenderer = require('listr-multiline-renderer');

const cli = meow(`
Usage
	$ caption <search_query>

Options
	--language, -l  The language you would like to search for.

Examples
	$ caption Mr Robot S01E02 --language=en
`,
{
	flags: {
		language: {
			type: 'string',
			alias: 'l',
			default: 'eng'
		}
	}
});

const searchQuery = cli.input.join(' ');
const language = cli.flags.language;

