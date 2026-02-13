import type { FluxConfig } from "../types";
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
