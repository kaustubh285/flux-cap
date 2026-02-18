#!/usr/bin/env node
import { Command } from "commander";
import { initFluxCommand, resetFluxCommand } from "./commands/init.command";
import { brainDumpAddCommand } from "./commands/dump.command";
import { searchBrainDumpCommand } from "./commands/search.command";
import { configCommand } from "./commands/config.command";
import { helpOption } from "./commands/flux.option";

const program = new Command()

program.name(`flux`).description('Git-aware CLI context manager for ADHD developers').version('0.1.0');

program.command('init')
	.description('Initialize flux in the current repository')
	.action(initFluxCommand)

program.command('reset')
	.description('Resets flux in the current repository')
	.action(resetFluxCommand)

program.command('dump <message...>')
	.description('Add a brain dump with a message. You can also include tags by using #tag in the message.')
	.action(brainDumpAddCommand)

program.command('search [query...]')
	.description('Search brain dumps with a query. If no query is provided, lists all brain dumps for the current month.')
	.action((query?: string[]) => {
		searchBrainDumpCommand(query ? query : [""]);
	})

program.command('config <fields...>')
	.description('Update configuration fields. Example: flux config search.limit 10')
	.action(configCommand)

program.parse(process.argv);
