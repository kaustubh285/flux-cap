import type { BrainDumpOptions, FluxConfig } from "../types";
import { execSync } from 'child_process';

export function getGitUncommittedChanges(config: FluxConfig): boolean {
	if (config.privacy.hideUncommittedChanges) {
		return false
	}
	try {
		const status = execSync('git status --porcelain',
			{ encoding: 'utf8', cwd: process.cwd(), timeout: 1000 }
		).trim();
		return status.length > 0;
	} catch (error) {
		return false;
	}
}

export async function getWorkingDir(config: FluxConfig): Promise<string> {

	return config.privacy.hideWorkingDir ? "" : process.cwd();
}

export function getCurrentBranch(config: FluxConfig): string | null {
	if (config.privacy.hideBranchName) {
		return ""
	}
	try {
		const branch = execSync('git rev-parse --abbrev-ref HEAD',
			{ encoding: 'utf8', cwd: process.cwd(), timeout: 1000 }
		).trim();
		return branch;
	} catch (error) {
		return "";
	}
}

export function getTags(options: BrainDumpOptions, config: FluxConfig) {

	let tags: string[] = [];
	let optionTags = Object.keys(options).filter(key => options[key as keyof BrainDumpOptions] === true);

	if (!config.tags) {
		console.log("You do not have any tags configured. You can add tags to your config to use this feature. or run `flux config --add-tags notes ideas tasks` to add default tags. or update the config file");
	} else {

		for (const tag of optionTags) {
			if (config.tags && config.tags.includes(tag)) {
				tags.push(tag);
			}
		}
	}

	return tags;


}
