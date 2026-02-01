import fs from "fs";
import { FLUX_BRAIN_DUMP_PATH, FLUX_CONFIG_PATH, FLUX_DEFAULT_CONFIG, FLUX_FOLDER_PATH, FLUX_SESSION_PATH } from "../utils/constants";
import { createIfNotExists } from "../utils/lib";

export async function initFluxCommand() {
	console.log("Initializing Flux Capacitor...");

	// CRITICAL SECTION
	try {
		// Check if .flux folder exists
		createIfNotExists(FLUX_FOLDER_PATH, 'directory');
		createIfNotExists(FLUX_BRAIN_DUMP_PATH, 'directory');
		createIfNotExists(FLUX_SESSION_PATH, 'directory');


		// Check if config.json exists
		createIfNotExists(FLUX_CONFIG_PATH, 'file', JSON.stringify(FLUX_DEFAULT_CONFIG, null, 4));
	}
	catch (error) {
		console.error("Error during initialization:", error);
		process.exit(1)
	}

	try {
		// NON-CRITICAL SECTION
		// If a git repo, add it to gitignore
		if (fs.existsSync('.git/')) {
			console.log("Git repository detected.");
		}
		else {
			console.log("Not a git repository. Skipping git integration.");
		}

		if (fs.existsSync('.gitignore')) {
			console.log("Gitignore file exists");
			const gitignoreContent = fs.readFileSync('.gitignore', 'utf8')

			if (gitignoreContent.includes(FLUX_FOLDER_PATH)) {
				console.log(".flux is already in .gitignore");
			}
			else {
				fs.appendFileSync('.gitignore', `\n${FLUX_FOLDER_PATH}`);
			}
		}
		else {
			fs.writeFileSync('.gitignore', '.flux');
			console.log("Created .gitignore file.");
		}
	}
	catch (error) {
		console.error(`Error during git setup: ${error}. \n You may need to manually add .flux/ to your .gitignore file.`);
	}

	console.log("Flux Capacitor initialized successfully!");
}


export const resetFluxCommand = () => {
	console.log("Resetting Flux Capacitor...");

	try {
		if (fs.existsSync(FLUX_FOLDER_PATH)) {
			fs.rmSync(FLUX_FOLDER_PATH, { recursive: true, force: true });
			console.log("Removed .flux directory and all its contents.");
		}
		else {
			console.log("Flux Capacitor is not initialized in this repository.");
		}
	}
	catch (error) {
		console.error("Error during reset:", error);
		process.exit(1)
	}

	console.log("Flux Capacitor reset successfully!");
}
