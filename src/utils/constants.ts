import packageJson from "../../package.json"

import type { FluxConfig } from "../types";

export const FLUX_FOLDER_PATH = ".flux/";

export const FLUX_BRAIN_DUMP_PATH = `${FLUX_FOLDER_PATH}dumps/`;

export const FLUX_SESSION_PATH = `${FLUX_FOLDER_PATH}sessions/`;

export const FLUX_CONFIG_PATH = `${FLUX_FOLDER_PATH}config.json`;

export const FLUX_DEFAULT_CONFIG: FluxConfig = {
	fluxVersion: packageJson.version,
	defaultFocusDuration: 1500, // 25 minutes
	todoKeywords: ["TODO", "FIXME", "BUG", "OPTIMIZE", "HACK"],
	notifications: true,
	theme: "minimal",
	sorted: true,
	privacy: {
		hideWorkingDir: false,
		hideBranchName: false,
		hideUncommittedChanges: false,
	},
	search: {
		searchFields: ["message", "workingDir", "branch", "tags", "id"],
		resultLimit: 10,
		fuseOptions: {
			threshold: 0.3,
			includeScore: true
		}
	},
	tags: ["notes", "ideas", "tasks"],
};

export const FLUX_DEFAULT_BRAIN_DUMP_CONTENT = {
	fluxVersion: "0.0.1",
}
