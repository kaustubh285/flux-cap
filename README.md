# flux-cap

**A git-aware CLI context manager for ADHD developers**

> *Never lose track of what you were coding after interruptions again.*

flux-cap is a terminal-native tool that captures your thoughts, tracks your context, and integrates seamlessly with your git workflow. Built specifically for developers who context-switch frequently.

## Features

### Brain Dump System
- Instantly capture thoughts without breaking flow: `flux dump "fix auth validation bug"`
- Git-aware context tracking (branch, working directory, uncommitted changes)
- Monthly file organization for easy browsing
- Privacy-first design - you control what gets tracked

### Search
- Fuzzy search across all your brain dumps: `flux search "auth"`
- Configurable search fields (message, branch, working directory)
- Result ranking with relevance scores
- Multi-month search with automatic limits

### Privacy Controls
- Choose what information to track during setup
- Hide working directory paths, branch names, or git status
- All data stored locally in human-readable JSON
- Edit or delete your data anytime

### Git Integration
- Automatic branch context detection
- Uncommitted changes tracking
- .gitignore management
- Works in non-git directories too

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/flux-cap
cd flux-cap

# Install dependencies
bun install

# Run locally
bun run dev <command>
```

## Quick Start

### 1. Initialize flux-cap in your project
```bash
bun run dev init
```
*Interactive setup will ask about your privacy preferences*

### 2. Start capturing thoughts
```bash
bun run dev dump "remember to add error handling to auth module"
bun run dev dump "bug in user validation - check line 42"
bun run dev dump "idea: add dark mode toggle"
```

### 3. Search your brain dumps
```bash
# Search with a query
bun run dev search "auth"

# List recent dumps (no query)
bun run dev search
```

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `flux init` | Initialize flux-cap with privacy setup | `bun run dev init` |
| `flux dump <message...>` | Capture a brain dump | `bun run dev dump "fix the bug in auth.ts"` |
| `flux search [query...]` | Search brain dumps or list recent ones | `bun run dev search "authentication"` |
| `flux config <fields...>` | View or update configuration | `bun run dev config` |
| `flux reset` | Complete reset (deletes all data) | `bun run dev reset` |

## Configuration

flux-cap stores configuration in `.flux/config.json`. You can customize:

### Privacy Settings
```json
{
  "privacy": {
    "hideWorkingDir": false,       // Hide file paths
    "hideBranchName": false,       // Hide git branch names  
    "hideUncommittedChanges": false // Hide git status
  }
}
```

### Search Configuration  
```json
{
  "search": {
    "searchFields": ["message", "branch", "workingDir"],
    "resultLimit": 10,
    "fuseOptions": {
      "threshold": 0.3,            // 0.0 = exact match, 1.0 = match anything
      "includeScore": true
    }
  }
}
```

### Other Options
```json
{
  "defaultFocusDuration": 1500,    // 25 minutes in seconds
  "todoKeywords": ["TODO", "FIXME", "BUG", "OPTIMIZE", "HACK"],
  "sorted": true,                  // Sort dumps chronologically
  "theme": "minimal"
}
```

## Data Structure

```
.flux/
├── config.json          # Your configuration
├── dumps/               # Brain dumps organized by month
│   ├── 2026-02.json     
│   └── 2026-03.json     
└── sessions/            # Future: Focus session tracking
```

### Brain Dump Format
```json
{
  "id": "019c5419-671b-7000-9600-5d9b4c563579",
  "timestamp": "2026-02-12T23:04:36.891Z", 
  "message": "fix auth validation bug",
  "workingDir": "/Users/you/project",
  "branch": "feature/auth-fix",
  "hasUncommittedChanges": true
}
```

## Use Cases

### Context Switching
```bash
# Before switching tasks
flux dump "was working on user auth, next: add validation to login form"

# After interruption  
flux search "auth"  # Quickly find where you left off
```

### Bug Tracking
```bash
flux dump "weird bug in payment flow - users can't checkout"
flux dump "bug seems related to session timeout"

# Later...
flux search "payment bug"
```

### Idea Capture
```bash
flux dump "idea: add keyboard shortcuts to dashboard"
flux dump "maybe use React.memo for performance optimization"
```

## Development

Built with:
- **Bun** - Fast JavaScript runtime
- **TypeScript** - Type safety
- **Commander.js** - CLI parsing
- **Fuse.js** - Fuzzy search

### Project Structure
```
src/
├── commands/           # Command implementations
│   ├── dump.command.ts
│   ├── search.command.ts
│   └── init.command.ts
├── utils/             # Shared utilities
│   ├── privacy.ts     # Git integration
│   ├── fuse.instance.ts # Search configuration
│   └── lib.ts         # File operations
└── types/             # TypeScript definitions
```

## Roadmap

### Phase 2 (Coming Soon)
- [ ] ASCII Pomodoro timer with themes
- [ ] Visual focus mode display
- [ ] Theme rotation system

### Phase 3 (Future)
- [ ] Advanced git context switching
- [ ] Session restoration
- [ ] Time tracking per context

### Phase 4 (Maybe)
- [ ] AI-powered brain dump analysis
- [ ] Team collaboration features
- [ ] Cross-machine sync

## Contributing

This is currently a personal learning project, but feedback and suggestions are welcome!

## License

MIT

---

Built for developers who think fast, context-switch often, and never want to lose a good idea.
