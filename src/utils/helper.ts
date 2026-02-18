export function getMonthString(): string {
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	return `${year}-${month}`;
}

export function searchResultFormat({ message, timestamp, score, index }: { message: string, timestamp: string, score?: string, index?: number }): string {
	const formattedTimestamp = new Date(timestamp).toLocaleString();
	return `${index !== undefined ? index + 1 : ''}. [${score || '0.00'}] [${formattedTimestamp}] ${message}`
}
