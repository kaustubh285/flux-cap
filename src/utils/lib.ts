import type { FluxConfig } from "../types";
import { FLUX_BRAIN_DUMP_PATH, FLUX_CONFIG_PATH } from "./constants";
import { execSync } from 'child_process';

export async function createIfNotExists(folderPath: string, type: 'file' | 'directory', data?: any): Promise<void> {
	try {
		const fs = await import("fs");

		if (!fs.existsSync(folderPath)) {
			if (type === 'file') {
				fs.writeFileSync(folderPath, data || '');
				// console.log(`Created file: ${folderPath}`);
				return;
			}
			fs.mkdirSync(folderPath, { recursive: true });
			// console.log(`Created directory: ${folderPath}`);
		} else {
			// console.log(`${type} already exists: ${folderPath}`);
		}
	} catch (error) {
		// console.error(`Error creating directory ${folderPath}:`, error);
		throw error;
	}
}

export async function createBrainDumpFileIfNotExists(dateString: string) {

	await createIfNotExists(`${FLUX_BRAIN_DUMP_PATH}${dateString}.json`, 'file', JSON.stringify({
		fluxVersion: "0.0.1",
		month: dateString,
		dumps: []
	}));
}


export async function getConfigFile(): Promise<FluxConfig> {
	const fs = await import("fs");
	const configPath = `${FLUX_CONFIG_PATH}`;
	let config: FluxConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
	return config;
}
