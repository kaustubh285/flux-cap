import { brainDumpAddCommand } from "../commands/dump.command";
import type { BrainDump } from "../types";

export function getMonthString(): string {
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	return `${year}-${month}`;
}


export function searchResultFormat({ message, timestamp, score, index }: { message: string, timestamp: string, score?: string, index?: number }): string {
	const formattedTimestamp = new Date(timestamp).toLocaleString();
	const indexStr = index !== undefined ? `${index + 1}.` : '';
	const scoreStr = `[${score || '0.00'}]`;
	const timeStr = `[${formattedTimestamp}]`;

	const formattedMessage = formatMessageForDisplay(message);

	return `${indexStr} ${scoreStr} ${timeStr} ${formattedMessage}`;
}

function formatMessageForDisplay(message: string): string {
	const lines = message.split('\n').map(line => line.trim()).filter(line => line.length > 0);

	if (lines.length <= 1) {
		const singleLine = lines[0] || message;
		return singleLine.length > 80 ? singleLine.substring(0, 77) + '...' : singleLine;
	}

	const firstLine = lines[0];
	const truncatedFirst = firstLine?.length > 60 ? firstLine?.substring(0, 57) + '...' : firstLine;
	const remainingCount = lines.length - 1;

	return `${truncatedFirst} (+${remainingCount} more line${remainingCount === 1 ? '' : 's'})`;
}

export function displaySearchResults(results: Array<{ item: BrainDump, score?: number }>, query?: string) {
	if (results.length === 0) {
		if (query) {
			console.log(`❌ No brain dumps found matching "${query}"`);
		} else {
			console.log("No brain dumps found. Try 'flux dump' to create your first one!");
		}
		return;
	}

	const queryText = query ? ` for "${query}"` : '';
	console.log(`\nFound ${results.length} brain dump${results.length === 1 ? '' : 's'}${queryText}:\n`);


	const terminalWidth = process.stdout.columns || 80;
	const maxIndexWidth = results.length.toString().length;

	results.forEach((result, index) => {
		const dump = result.item;
		const score = result.score?.toFixed(2) || '0.00';
		const shortId = dump.id.substring(0, 8);


		const indexStr = `${(index + 1).toString().padStart(maxIndexWidth)}`;
		const scoreStr = `[${score}]`;
		const idStr = `${shortId}`;

		const headerLine = `${indexStr} ${idStr} ${scoreStr}`;
		console.log(headerLine);

		const messageIndent = ' '.repeat(maxIndexWidth + 1);


		const lines = dump.message.split('\n').map(l => l.trim()).filter(l => l.length > 0);
		const availableWidth = terminalWidth - messageIndent.length - 2;

		if (lines.length === 0) {
			console.log(`${messageIndent}(empty message)`);
		} else {
			lines.forEach((line, lineIndex) => {
				if (lineIndex < 3) {
					const truncatedLine = line.length > availableWidth
						? line.substring(0, availableWidth - 3) + '...'
						: line;
					console.log(`${messageIndent}${truncatedLine}`);
				}
			});

			if (lines.length > 3) {
				console.log(`${messageIndent}... (+${lines.length - 3} more line${lines.length - 3 === 1 ? '' : 's'})`);
			}
		}

		const contextInfo = [];
		const date = new Date(dump.timestamp);
		const timeAgo = getTimeAgo(date);
		contextInfo.push('----------------');
		contextInfo.push(`${timeAgo}`);
		contextInfo.push('----------------');
		contextInfo.push('\n');

		if (dump.branch && dump.branch !== 'main') {
			contextInfo.push(`🌿 ${dump.branch}${dump.hasUncommittedChanges ? ' (uncommitted)' : ''}`);
		}

		if (contextInfo.length > 0) {
			console.log(`${messageIndent}${contextInfo.join(' • ')}`);
		}

		console.log('');
	});

	console.log(`!! Use the 8-character ID (like ${results[0]?.item.id.substring(0, 8)}) to reference specific dumps\n`);
}


function getTimeAgo(date: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMins / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffMins < 60) return `${diffMins}m ago`;
	if (diffHours < 24) return `${diffHours}h ago`;
	if (diffDays < 7) return `${diffDays}d ago`;

	return date.toLocaleDateString();
}
