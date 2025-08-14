# Website Scripts

This directory contains utility scripts for managing the lectureStudio website.

## Update Downloads Script

The `update-downloads.cjs` script automatically updates the download data files based on GitHub releases. It fetches information from the GitHub API and generates YAML files for the website's download section.

### Features

- Fetches release information from GitHub
- Extracts version numbers, release dates, and changelog entries
- Matches release assets to platforms based on filename patterns
- Generates YAML files for each supported language
- Calculates file sizes and formats them appropriately

### Prerequisites

- Node.js installed
- Required dependencies installed (`npm install`)

### Usage

Run the script using npm:

```bash
npm run update-downloads
```

For higher GitHub API rate limits, you can provide a GitHub token:

```bash
GITHUB_TOKEN=your_token npm run update-downloads
```

### Configuration

The script can be configured by modifying the `config` object at the top of the file:

- **GitHub Repository**: Update the owner and repo names if needed
- **Languages**: Add or remove supported languages
- **Platforms**: Define platforms and asset patterns
- **Default Changelog**: Provide default changelog entries for when a release doesn't include them

### Asset Patterns

The script uses regular expressions to match release assets to platforms. The default patterns are:

- **Windows**: Files ending with `.msi` and containing "win"
- **macOS**: 
  - Intel: Files ending with `.pkg` and containing "mac" and "x86"
  - Apple Silicon: Files ending with `.pkg` and containing "mac" and "arm64"
- **Linux**:
  - DEB: Files ending with `.deb` and containing "linux"
  - RPM: Files ending with `.rpm` and containing "linux"
  - ZIP: Files ending with `.zip` and containing "linux"

Adjust these patterns to match your release asset naming conventions.

### Output

The script creates YAML files in the `data/downloads/[version]` directory, with one file per language (e.g., `downloads_en.yaml`, `downloads_de.yaml`).

### Troubleshooting

If you encounter issues:

1. Check that your GitHub repository information is correct
2. Verify that your release assets match the expected naming patterns
3. Ensure you have the required dependencies installed
4. Check GitHub API rate limits (use a token if needed)
