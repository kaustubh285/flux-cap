import { Command } from "commander";
import { initFluxCommand, resetFluxCommand } from "./commands/init.command";
import { brainDumpAddCommand } from "./commands/dump.command";

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

program.command('split')
	.argument('<parts...>', 'string to split (space‑separated tokens)')
	.action((parts, options) => {
		const str = parts.join(' ');
		console.log(str.split(options.separator ?? ','));
	});

program.parse(process.argv);
