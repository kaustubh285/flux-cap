import { randomUUID } from "crypto";
import type { BrainDump, FluxConfig } from "../types";
import { FLUX_BRAIN_DUMP_PATH, FLUX_CONFIG_PATH } from "../utils/constants";
import { createBrainDumpFileIfNotExists, getConfigFile, getCurrentBranch, getFluxPath, getGitUncommittedChanges, getMonthString, getWorkingDir } from "../utils/";
import { editor } from '@inquirer/prompts';


export async function handleBrainDump(message: string[], options: { multiline?: boolean }) {
	try {
		let finalMessage: string;

		if (options.multiline) {
			console.log('Opening editor for multiline input...');
			const initialText = message ? message.join(' ') : '';

			const multilineInput = await editor({
				message: 'Enter your brain dump (save & exit when done):',
				default: initialText,
				waitForUserInput: false
			});

			if (!multilineInput.trim()) {
				console.log('Brain dump cancelled - no content provided');
				return;
			}

			finalMessage = multilineInput.trim();
		} else {
			if (!message || message.length === 0) {
				console.log('Please provide a message: flux dump "your message"');
				return;
			}
			finalMessage = message.join(' ');
		}

		await brainDumpAddCommand(finalMessage, { multiline: options.multiline });

	} catch (error) {
		console.error('Error creating brain dump:', error instanceof Error ? error.message : 'Unknown error');
		process.exit(1);
	}
}


export async function brainDumpAddCommand(message: string, options: { multiline?: boolean } = {}) {
	const fluxPath = await getFluxPath()
	const fs = await import("fs");

	console.log("Creating brain dump...");

	const monthString = getMonthString();
	await createBrainDumpFileIfNotExists(monthString, fluxPath);

	const config = await getConfigFile(fluxPath);
	const workingDir = await getWorkingDir(config)
	const branch = getCurrentBranch(config)
	const hasUncommittedChanges = getGitUncommittedChanges(config);

	const newDump: BrainDump = {
		id: randomUUID(),
		timestamp: new Date().toISOString(),
		message: message,
		workingDir,
		branch,
		hasUncommittedChanges
	};

	const data: { dumps: BrainDump[] } = JSON.parse(fs.readFileSync(`${fluxPath}${FLUX_BRAIN_DUMP_PATH}/${monthString}.json`, 'utf8'));

	config.sorted ? data.dumps.unshift(newDump) : data.dumps.push(newDump);

	fs.writeFileSync(`${fluxPath}${FLUX_BRAIN_DUMP_PATH}/${monthString}.json`, JSON.stringify(data, null, 2));

	const displayMessage = message.length > 50
		? message.substring(0, 47) + "..."
		: message;

	const preview = message.includes('\n')
		? `${message.split('\n')[0]}... (multiline)`
		: displayMessage;

	console.log(`✅ Brain dump saved: "${preview}"`);
}
