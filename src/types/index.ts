export type FluxConfig = {
	fluxVersion: string;
	defaultFocusDuration: number;
	todoKeywords: string[];
	notifications: boolean;
	theme: "minimal";
	sorted: boolean;
	privacy: {
		hideWorkingDir: boolean;
		hideBranchName: boolean;
		hideUncommittedChanges: boolean;
	},
	search: {
		searchFields: ("message" | "workingDir" | "branch" | "tags")[];
		resultLimit: number | null;
		fuseOptions?: {
			threshold: number,
			includeScore: boolean
		}
	}
};

export type BrainDump = {
	id: string;
	timestamp: string;
	message: string;
	workingDir?: string;
	branch?: string | null;
	tags?: [],
	hasUncommittedChanges?: boolean;
}
