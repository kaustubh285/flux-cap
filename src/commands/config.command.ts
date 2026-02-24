import { FLUX_CONFIG_PATH } from "../utils";
import { getConfigFile, getFluxPath } from "../utils/lib";

export async function configCommand(options: { a?: string, r?: string }, tag: string[]) {

	const fluxPath = await getFluxPath()
	const fs = await import("fs");
	const config = await getConfigFile(fluxPath);


	if (options.a) {
		console.log("Adding tag(s) to configuration...");
		if (!config.tags) {
			config.tags = [];
		}
		if (!config.tags.includes(options.a)) {
			config.tags = Array.from(new Set([...config.tags, ...options.a]))
			console.log(config.tags)
			fs.writeFileSync(fluxPath + FLUX_CONFIG_PATH, JSON.stringify(config, null, 4));
			console.log(`Tag "${options.a}" added to configuration.`);
		} else {
			console.log(`Tag "${options.a}" already exists in configuration.`);
		}
	}

	if (options.r) {
		console.log("Removing tag(s) from configuration...");
		for (const removeTag of options.r) {
			if (config.tags && config.tags.includes(removeTag)) {
				config.tags = config.tags.filter(tag => tag !== removeTag);
				fs.writeFileSync(fluxPath + FLUX_CONFIG_PATH, JSON.stringify(config, null, 4));
				console.log(`Tag "${removeTag}" removed from configuration.`);
			} else {
				console.log(`Tag "${removeTag}" does not exist in configuration.`);
			}
		}
	}
}
