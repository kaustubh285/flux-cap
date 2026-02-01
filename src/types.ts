export type FluxConfig = {
	fluxVersion: string;
	defaultFocusDuration: number;
	todoKeywords: string[];
	notifications: boolean;
	theme: "minimal";
};

export type BrainDump = {
	timestamp: string;
	message: string;
	workingDir: string;
	branch?: string | null;
	hasUncommittedChanges?: boolean;
}
