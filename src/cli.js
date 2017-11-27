#!/usr/bin/env node
"use strict";
const meow = require("meow");
const Caption = require('caption-core');
const Observable = require("zen-observable");
const inquirer = require('inquirer');
const logUpdate = require('log-update');
const Listr = require('listr');
var clear = require('clear');

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

let results = [];

clear();

const tasks = new Listr([
	{
		title: 'Checking sources',
		task: () => new Observable((observer) => {
			observer.next(`Searching`);

			Caption
				.searchByQuery(searchQuery, language)
				.on("fastest", subtitles => {
					observer.next(`First source responded with ${subtitles.length} results`);
				})
				.on("completed", subtitles => {
					results = subtitles;
					observer.next(`All sources checked. Found ${subtitles.length} results`);
					observer.complete();
				});
		})
	},
	{
		title: `Found ${results.length} results`,
		task: () => {
			Promise.resolve()
		}
	},
	{
		title: 'Select subtitle',
		task: () => {
			inquirer.prompt([
				{
					type: 'list',
					name: 'selectedSubtitle',
					message: 'Select a subtitle',
					choices: results.map(result => result.name)
				}
			]).then(function (answers) {
				console.log(JSON.stringify(answers, null, '  '));
			});
		}
	}
]);

tasks.run().catch(err => {
	console.error(err);
});
