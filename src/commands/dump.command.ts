import { randomUUIDv7 } from "bun";
import type { BrainDump, FluxConfig } from "../types";
import { FLUX_BRAIN_DUMP_PATH, FLUX_CONFIG_PATH } from "../utils/constants";
import { createBrainDumpFileIfNotExists, getConfigFile, getCurrentBranch, getGitUncommittedChanges, getMonthString, getWorkingDir } from "../utils/";

export async function brainDumpAddCommand(message: string[]) {
	const fs = await import("fs");
	console.log("Creating brain dump...");

	const monthString = getMonthString();
	await createBrainDumpFileIfNotExists(monthString);

	const config = await getConfigFile();
	const workingDir = await getWorkingDir(config)
	const branch = getCurrentBranch(config)
	const hasUncommittedChanges = getGitUncommittedChanges(config);

	const newDump: BrainDump = {
		id: randomUUIDv7(),
		timestamp: new Date().toISOString(),
		message: message.join(' '),
		workingDir,
		branch,
		hasUncommittedChanges
	};


	const data: { dumps: BrainDump[] } = JSON.parse(fs.readFileSync(`${FLUX_BRAIN_DUMP_PATH}/${monthString}.json`, 'utf8'));

	config.sorted ? data.dumps.unshift(newDump) : data.dumps.push(newDump);

	fs.writeFileSync(`${FLUX_BRAIN_DUMP_PATH}/${monthString}.json`, JSON.stringify(data, null, 2));

}
