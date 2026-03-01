import { getConfigFile } from "../utils";

export async function versionOption() {
	const config = await getConfigFile();
	console.log(`flux-cap version: ${config?.fluxVersion || "unknown"}`);
}

export function helpOption() {
	console.log(`
🍅 flux-cap - A git-aware CLI context manager for ADHD developers

USAGE:
  flux <command> [options]

COMMANDS:
  init                     Initialize flux-cap with privacy setup
  dump <message...>        Capture a brain dump with context
  search [query...]        Search brain dumps or list recent ones
  config <fields...>       View or update configuration
  reset                    Complete reset (deletes all data)
  help                     Show this help message

EXAMPLES:
  # Initialize in your project
  flux init

  # Capture thoughts
  flux dump "fix auth validation bug"
  flux dump "remember to add error handling to auth module"
  flux dump "idea: add dark mode toggle"

  # Search your brain dumps
  flux search "auth"
  flux search "validation bug"
  flux search              # List recent dumps

  # Update configuration
  flux config search.resultLimit 20
  flux config privacy.hideWorkingDir true

FEATURES:
  🧠 Brain Dump System     - Instantly capture thoughts without breaking flow
  🔍 Intelligent Search    - Fuzzy search across all your brain dumps
  🔒 Privacy Controls      - Choose what information to track
  🚀 Git Integration       - Automatic branch context detection

DATA LOCATION:
  All data stored in .flux/ directory:
  - .flux/config.json      Your configuration
  - .flux/dumps/           Brain dumps organized by month

For more information, visit: https://github.com/yourusername/flux-cap
  `);
}
