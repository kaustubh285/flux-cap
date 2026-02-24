import { randomUUID } from "crypto";
import type { BrainDump, FluxConfig } from "../types";
import { FLUX_BRAIN_DUMP_PATH, FLUX_CONFIG_PATH } from "../utils/constants";
import { createBrainDumpFileIfNotExists, getConfigFile, getCurrentBranch, getFluxPath, getGitUncommittedChanges, getMonthString, getWorkingDir } from "../utils/";

export async function brainDumpAddCommand(message: string[]) {
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
		message: message.join(' '),
		workingDir,
		branch,
		hasUncommittedChanges
	};


	const data: { dumps: BrainDump[] } = JSON.parse(fs.readFileSync(`${fluxPath}${FLUX_BRAIN_DUMP_PATH}/${monthString}.json`, 'utf8'));

	config.sorted ? data.dumps.unshift(newDump) : data.dumps.push(newDump);

	fs.writeFileSync(`${fluxPath}${FLUX_BRAIN_DUMP_PATH}/${monthString}.json`, JSON.stringify(data, null, 2));

	// After writeFileSync, add:
	console.log(`✅ Brain dump saved: "${message.join(' ')}"`);

}
