import Fuse from "fuse.js"
import { FLUX_BRAIN_DUMP_PATH, getAllBrainDumpFilePaths, getConfigFile, getMonthString, searchResultFormat } from "../utils";
import { createFuseInstance } from "../utils/fuse.instance";
import type { BrainDump } from "../types";
import fs from "fs";

export async function searchBrainDumpCommand(query: string[]) {
	console.log("Searching all brain dumps...");

	const config = await getConfigFile();
	const monthString = getMonthString();

	let searchResults = []
	const allFilePaths = await getAllBrainDumpFilePaths();

	for await (const filePath of allFilePaths) {
		const fileData: { dumps: BrainDump[] } = JSON.parse(fs.readFileSync(filePath, 'utf8'));
		const fuse = createFuseInstance(fileData.dumps, config);
		const results = fuse.search(query.join(' '));
		searchResults.push(...results);
		if (searchResults.length > 30) {
			break;
		}
	}

	if (query.length > 0) {
		if (searchResults.length === 0) {
			console.log("No brain dumps found matching the query.");
			return;
		}

		const resultLimit = config?.search?.resultLimit || 10;
		const limitedResults = searchResults.slice(0, resultLimit);
		console.log(`Found ${searchResults.length} brain dumps matching the query${searchResults.length > resultLimit ? ` (showing first ${resultLimit})` : ''}:`);
		limitedResults.forEach((result, index) => {
			const dump = result.item;
			console.log(searchResultFormat({ index: index, timestamp: dump.timestamp, message: dump.message, score: result.score?.toFixed(2) }))
		});
	} else {
		const resultLimit = config?.search?.resultLimit || 3;
		let totalCount = 0;

		for await (const filePath of allFilePaths) {
			if (totalCount >= resultLimit) {
				break;
			}

			const fileData: { dumps: BrainDump[] } = JSON.parse(fs.readFileSync(filePath, 'utf8'));
			for (let i = 0; i < fileData.dumps.length && totalCount < resultLimit; i++) {
				const dump = fileData.dumps[i];
				if (!dump || !dump.message || dump.message.trim() === '') {
					continue;
				}
				totalCount += 1;
				console.log(searchResultFormat({ index: totalCount, timestamp: dump.timestamp, message: dump.message, score: '0.00' }))
			}
		}
	}
}
