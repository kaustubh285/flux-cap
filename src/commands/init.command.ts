import fs from "fs";
import { FLUX_BRAIN_DUMP_PATH, FLUX_CONFIG_PATH, FLUX_DEFAULT_CONFIG, FLUX_FOLDER_PATH, FLUX_SESSION_PATH } from "../utils/constants";
import { createIfNotExists } from "../utils/";
import inquirer from "inquirer";

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

		const answers = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'includeWorkingDir',
				message: 'Include your current working directory in logs?',
				default: true
			},
			{
				type: 'confirm',
				name: 'includeBranch',
				message: 'Include your git branch name in logs?',
				default: true
			},
			{
				type: 'confirm',
				name: 'includeUncommitted',
				message: 'Include uncommitted git changes in logs?',
				default: true
			}
		]);

		config.privacy.hideWorkingDir = !answers.includeWorkingDir;
		config.privacy.hideBranchName = !answers.includeBranch;
		config.privacy.hideUncommittedChanges = !answers.includeUncommitted;



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

	console.log(`Flux Cap folder structure created at ${FLUX_FOLDER_PATH}, with cwd as ${process.cwd()}`);
	console.log("Flux Capacitor initialized successfully!");
}


export const resetFluxCommand = async () => {
	console.log("Resetting Flux Capacitor...");

	const { confirmed } = await inquirer.prompt([{
		type: 'confirm',
		name: 'confirmed',
		message: 'Are you sure? This will delete all your brain dumps and sessions.',
		default: false
	}]);

	if (!confirmed) {
		console.log("Reset cancelled.");
		return;
	}

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
