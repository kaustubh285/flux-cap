export type FluxConfig = {
	fluxVersion: string;
	defaultFocusDuration: number;
	todoKeywords: string[];
	notifications: boolean;
	theme: "minimal";
	privacy: {
		hideWorkingDir: boolean;
		hideBranchName: boolean;
		hideUncommittedChanges: boolean;
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
