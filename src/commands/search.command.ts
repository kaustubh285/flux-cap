import Fuse from "fuse.js"
import { displaySearchResults, FLUX_BRAIN_DUMP_PATH, getAllBrainDumpFilePaths, getConfigFile, getFluxPath, getMonthString, searchResultFormat } from "../utils";
import { createFuseInstance } from "../utils/fuse.instance";
import type { BrainDump } from "../types";
import fs from "fs";

export async function searchBrainDumpCommand(query: string[]) {
	console.log("Searching all brain dumps...");
	const fluxPath = await getFluxPath()
	const config = await getConfigFile(fluxPath);
	const combinedQuery = query.join(' ').trim();

	let searchResults: Array<{ item: BrainDump, score?: number }> = [];
	const allFilePaths = await getAllBrainDumpFilePaths(fluxPath);

	for (const searchQuery of query) {
		for await (const filePath of allFilePaths) {
			const fileData: { dumps: BrainDump[] } = JSON.parse(fs.readFileSync(filePath, 'utf8'));

			if (searchQuery) {
				const fuse = createFuseInstance(fileData.dumps, config);
				const results = fuse.search(searchQuery);
				searchResults.push(...results);
			} else {
				const recentDumps = fileData.dumps
					.filter(dump => dump && dump.message && dump.message.trim() !== '')
					.map(dump => ({
						item: dump,
						score: 0,
						timestamp: new Date(dump.timestamp).getTime()
					}));

				searchResults.push(...recentDumps);
			}
		}
		if (searchQuery) {
			searchResults.sort((a, b) => (a.score || 0) - (b.score || 0));
		} else {
			searchResults.sort((a, b) => {
				const timeA = new Date(a.item.timestamp).getTime();
				const timeB = new Date(b.item.timestamp).getTime();
				return timeB - timeA;
			});
		}
	}



	const resultLimit = config?.search?.resultLimit || (combinedQuery ? 10 : 5);
	const limitedResults = searchResults.slice(0, resultLimit);

	if (searchResults.length > limitedResults.length) {
		console.log(`\n(Showing ${limitedResults.length} of ${searchResults.length} results)`);
	}

	displaySearchResults(limitedResults, combinedQuery || undefined);

}
