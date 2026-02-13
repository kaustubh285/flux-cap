import { Command } from "commander";
import { initFluxCommand, resetFluxCommand } from "./commands/init.command";
import { brainDumpAddCommand } from "./commands/dump.command";
import { searchBrainDumpCommand } from "./commands/search.command";

const program = new Command()

program.name(`flux`).description('Git-aware CLI context manager for ADHD developers').version('0.0.1');

program.command('init')
	.description('Initialize flux in the current repository')
	.action(initFluxCommand)

program.command('reset')
	.description('Resets flux in the current repository')
	.action(resetFluxCommand)

program.command('dump <message...>')
	.description('Initialize flux in the current repository')
	.action(brainDumpAddCommand)

program.command('search <query...>')
	.description('Initialize flux in the current repository')
	.action(searchBrainDumpCommand)


program.parse(process.argv);
