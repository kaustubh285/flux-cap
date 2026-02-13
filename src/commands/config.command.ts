import { getConfigFile } from "../utils/lib";

// TODO: Still to be implemented
export async function configCommand(fields: string[]) {
	const fs = await import("fs");
	const config = await getConfigFile();

	const value = fields[fields.length - 1];
	const keys = fields.slice(0, -1)[0]?.split('.').map(k => k.trim()) || [];

	console.log(`want to update config field: ${JSON.stringify(keys)} with value: ${value}`);

	if (keys.length === 0 || value === undefined) {
		console.log("Current Flux Capacitor configuration:");
		console.log(JSON.stringify(config, null, 4));
		return;
	}
}
