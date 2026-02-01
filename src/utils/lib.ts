export async function createIfNotExists(folderPath: string, type: 'file' | 'directory', data?: any): Promise<void> {
	try {
		const fs = await import("fs");

		if (!fs.existsSync(folderPath)) {
			if (type === 'file') {
				fs.writeFileSync(folderPath, data || '');
				console.log(`Created file: ${folderPath}`);
				return;
			}
			fs.mkdirSync(folderPath, { recursive: true });
			console.log(`Created directory: ${folderPath}`);
		} else {
			console.log(`Directory already exists: ${folderPath}`);
		}
	} catch (error) {
		console.error(`Error creating directory ${folderPath}:`, error);
		throw error;
	}
}
