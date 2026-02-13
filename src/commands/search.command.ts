import Fuse from "fuse.js"
import { FLUX_BRAIN_DUMP_PATH, getConfigFile, getMonthString } from "../utils";
import { createFuseInstance } from "../utils/fuse.instance";
import type { BrainDump } from "../types";
import fs from "fs";

export async function searchBrainDumpCommand(query: string[]) {
	console.log("Searching all brain dumps...");

	const config = await getConfigFile();
	const monthString = getMonthString();

	const data: { dumps: BrainDump[] } = JSON.parse(fs.readFileSync(`${FLUX_BRAIN_DUMP_PATH}/${monthString}.json`, 'utf8'));

	const fuse = createFuseInstance(data.dumps, config)

	if (query.length > 0) {
		const searchResults = fuse.search(query.join(' '));
		if (searchResults.length === 0) {
			console.log("No brain dumps found matching the query.");
			return;
		}
		console.log(`Found ${searchResults.length} brain dumps matching the query:`);
		searchResults.forEach((result, index) => {
			const dump = result.item;
			console.log(`${index + 1}. [${result.score?.toFixed(4) || '0.0000'}] [${dump.timestamp}] ${dump.message}`);
		});
	} else {
		if (data.dumps.length === 0) {
			console.log("No brain dumps found for this month.");
			return;
		}
		console.log(`Listing all ${data.dumps.length} brain dumps for this month:`);
		data.dumps.forEach((dump, index) => {
			console.log(`${index + 1}. [${dump.timestamp}] ${dump.message}`);
		});
	}
}
