import fs from "fs";
import { FLUX_BRAIN_DUMP_PATH, FLUX_CONFIG_PATH, FLUX_DEFAULT_CONFIG, FLUX_FOLDER_PATH, FLUX_SESSION_PATH } from "../utils/constants";
import { createIfNotExists } from "../utils/";

export async function initFluxCommand() {
	console.log("Initializing Flux Capacitor...");

	// CRITICAL SECTION
	try {
		// Check if .flux folder exists
		await createIfNotExists(FLUX_FOLDER_PATH, 'directory');
		await createIfNotExists(FLUX_BRAIN_DUMP_PATH, 'directory');
		await createIfNotExists(FLUX_SESSION_PATH, 'directory');


		// Check if config.json exists
		const config = FLUX_DEFAULT_CONFIG

		const workingDirData = prompt("Do you want to include your current working directory in logs? (y/n)")
		if (workingDirData && workingDirData.toLowerCase() === 'y') {
			config.privacy.hideWorkingDir = false
		}
		else {
			config.privacy.hideWorkingDir = true
		}

		const branchNameData = prompt("Do you want to include your git branch name in logs? (y/n)")
		if (branchNameData && branchNameData.toLowerCase() === 'y') {
			config.privacy.hideBranchName = false
		}
		else {
			config.privacy.hideBranchName = true
		}

		const uncommittedChangesData = prompt("Do you want to include uncommitted git changes in logs? (y/n)")
		if (uncommittedChangesData && uncommittedChangesData.toLowerCase() === 'y') {
			config.privacy.hideUncommittedChanges = false
		}
		else {
			config.privacy.hideUncommittedChanges = true
		}
		await createIfNotExists(FLUX_CONFIG_PATH, 'file', JSON.stringify(config, null, 4));

		console.log("If you want to customize your configuration, you can edit the config.json file located in the .flux directory.");
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
