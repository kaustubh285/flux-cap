#!/usr/bin/env node
import { Command } from "commander";
import { initFluxCommand, resetFluxCommand } from "./commands/init.command";
import { brainDumpAddCommand, handleBrainDump } from "./commands/dump.command";
import { searchBrainDumpCommand } from "./commands/search.command";
import { configCommand } from "./commands/config.command";
import { helpOption } from "./commands/flux.option";
import packageJson from "../package.json"
import { getFluxPath } from "./utils";

const program = new Command()

program.name(`flux`).description('Git-aware CLI context manager for ADHD developers').version(packageJson.version);

program.command('init')
	.description('Initialize flux in the current repository')
	.action(initFluxCommand)

program.command('reset')
	.description('Resets flux in the current repository')
	.action(resetFluxCommand)

program.command('dump [message...]')
	.option('-m, --multiline', 'Enable multiline input mode')
	.description('Add a brain dump with a message. Use --multiline for multi-line input.')
	.action(async (message, options) => {
		await handleBrainDump(message, options);
	})

program.command('search [query...]')
	.description('Search brain dumps with a query. If no query is provided, lists all brain dumps for the current month.')
	.action((query?: string[]) => {
		searchBrainDumpCommand(query ? query : [""]);
	})

program.command('config <fields...>')
	.description('Update configuration fields. Example: flux config search.limit 10')
	.action(configCommand)


program.parse(process.argv);
