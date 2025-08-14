# lectureStudio Website

[![Deploy to GitHub Pages](https://github.com/lectureStudio/lectureStudio.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/lectureStudio/lectureStudio.github.io/actions/workflows/deploy.yml)

This repository contains the source code for the [lectureStudio website](https://lecturestudio.org/), built with [Hugo](https://gohugo.io/) and [Tailwind CSS](https://tailwindcss.com/).

## About lectureStudio

lectureStudio is a free, open-source software tool for presenting PDF-based lectures. It integrates a wide spectrum of interactive features, including:

- Annotation of slides with pen-based tools
- Streaming and recording of audio and video
- Classroom response system with interactive quizzes and messaging
- Multi-platform support (Windows, Linux, macOS)
- Post-processing capabilities for recorded lectures

The software is designed to digitize lectures with ease, making it an ideal tool for educators in both in-person and remote teaching environments.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Hugo](https://gohugo.io/) (v0.147.3 or later)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development Workflow

To run the development server with live reloading:

```bash
npm run dev
```

This will start a local server at `http://localhost:1313/` with hot reloading enabled.

### Linting

The project uses linting tools to maintain code quality:

- ESLint for JavaScript
- Stylelint for CSS
- HTMLHint for HTML

To run all linters:

```bash
npm run lint
```

To run individual linters:

```bash
npm run lint:js    # Lint JavaScript files
npm run lint:css   # Lint CSS files
npm run lint:html  # Lint HTML files
```

To automatically fix issues where possible:

```bash
npm run lint:fix
```

The project uses pre-commit hooks to ensure code quality. These hooks automatically run linters on staged files before each commit:

- JavaScript files are checked with ESLint and automatically fixed when possible
- CSS files are checked with Stylelint and automatically fixed when possible
- HTML files are checked with HTMLHint

This ensures that all committed code meets the project's coding standards.

### Building for Production

To build the site for production:

```bash
npm run build
```

This generates static files in the `public` directory.

### Update Downloads Information

To update the download information with the latest lectureStudio release:

```bash
npm run update-downloads
```

This script fetches the latest release information from GitHub and updates the download data files.

## Testing

The project includes automated tests for critical site functionality, content validation, link checking, and end-to-end testing.

### Running Tests

To run all tests:

```bash
npm run test:all
```

This will run the Jest and Playwright tests. For more information on each type of test, see the sections below.

### JavaScript Tests

The project uses Jest for testing JavaScript functionality:

```bash
npm run test          # Run all Jest tests
```

These tests verify critical site functionality, including:
- Dead link detection
- Download information updates

**Note:** The link checker requires the site to be built first.

### End-to-End Tests with Playwright

The project includes end-to-end tests using Playwright to test the website in real browsers:

```bash
npm run test:e2e          # Run all Playwright tests
npm run test:e2e:ui       # Run tests with Playwright UI
npm run test:e2e:report   # Show HTML report of test results
```

Before running Playwright tests for the first time, install the required browsers:

```bash
npx playwright install
```

These tests verify the website functionality across different browsers and devices, including the responsive design.

## Continuous Integration and Deployment

The project uses GitHub Actions for continuous integration and deployment.

### CI Pipeline

The CI pipeline automatically runs on every push to the main branch and on pull requests:

1. Sets up the Hugo environment
2. Installs dependencies
3. Builds the site
4. Runs linting checks
5. Runs unit and end-to-end tests
6. Uploads the test report as an artifact

You can view the CI status and logs in the [Actions tab](https://github.com/lectureStudio/.github.io/actions) of the repository.

To run the same checks locally before pushing:

```bash
npm run lint && npm run test:all
```

### Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch:

1. Builds the site using Hugo
2. Uploads the built site as a GitHub Pages artifact
3. Deploys the site to GitHub Pages

You can manually trigger a deployment from the [Actions tab](https://github.com/lectureStudio/.github.io/actions/workflows/deploy.yml) by clicking "Run workflow".

## Project Structure

- `config/`: Hugo configuration files
- `content/`: Website content organized by section
- `i18n/`: Translation files for UI elements
- `layouts/`: HTML templates and partials
- `assets/`: CSS, JavaScript, and other assets
- `static/`: Static files copied directly to the `public` directory
- `data/`: Data files used by Hugo templates
- `scripts/`: Utility scripts for the project
- `tests/`: Automated tests (unit, integration, end-to-end)

### Configuration

The site configuration is managed through several files:

- `config/_default/hugo.yaml`: Main Hugo configuration
- `config/_default/languages/`: Language-specific configurations
- `config/_default/params/`: Site parameters
- `config/_default/navigation/`: Navigation menus

## Multilingual Support

The website supports multiple languages:

- Content is stored with language suffixes (e.g., `index.en.md`, `index.de.md`)
- UI translations are in the `i18n` directory
- Language-specific configurations are in `config/_default/languages/`

## Contributing

Contributions to the lectureStudio website are welcome! Please follow these guidelines:

- Use 4-space indentation for JavaScript files and follow the existing style for other file types
- Follow the existing code style in the project
- Use kebab-case for filenames and directories
- Keep templates modular and reusable
- Test all language versions when making changes

For more detailed information, please refer to the [GUIDELINES.md](GUIDELINES.md) file.

## License

This project is dual-licensed under the MIT License and the CC BY-NC-ND 4.0 License. For details, see the [LICENSE](LICENSE) file.

## Links

- [lectureStudio Website](https://lecturestudio.org/)
- [lectureStudio GitHub Repository](https://github.com/lectureStudio/lectureStudio)
