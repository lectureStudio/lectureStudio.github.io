# lectureStudio Website Development Guidelines

This document provides guidelines and instructions for developing and maintaining the lectureStudio website. It's intended for developers who are already familiar with web development concepts.

## Build and Configuration Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Hugo](https://gohugo.io/) (v0.147.3 or later)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To run the development server with live reloading:

```bash
npm run dev
```

This will start a local server at `http://localhost:1313/` with hot reloading enabled.

### Building for Production

To build the site for production:

```bash
npm run build
```

This generates static files in the `public` directory.

### Configuration

The site configuration is managed through several files:

- `config/_default/hugo.yaml`: Main Hugo configuration
- `config/_default/languages/`: Language-specific configurations
- `config/_default/params/`: Site parameters
- `config/_default/navigation/`: Navigation menus

### Content Management

- Content is stored in the `content` directory, organized by section
- Multilingual content uses language suffixes (e.g., `index.en.md`, `index.de.md`)
- The `i18n` directory contains translation files for UI elements

### Update Downloads Information

To update the downloads information with the latest release:

```bash
npm run update-downloads
```

This script fetches the latest release information from GitHub and updates the download data files.

## Testing Information

### Link Checker Test

The project includes a link checker test that verifies all internal links in the generated site:

1. Build the site first:
   ```bash
   npm run build
   ```

2. Run the link checker:
   ```bash
   node .junie/test-links.js
   ```

This will scan all HTML files in the `public` directory and report any broken internal links.

### Adding New Tests

To add new tests to the project:

1. Create test scripts in the `.junie` directory
2. Use Node.js for testing functionality
3. Install any required dependencies with `npm install --save-dev`

### Example: Creating a Content Validation Test

Here's an example of how to create a simple test that validates the structure of content files:

```javascript
// .junie/test-content.js
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Configuration
const contentDir = path.join(__dirname, '..', 'content');
const requiredFields = ['title', 'date'];

// Results tracking
const invalidFiles = [];

// Recursively scan content directory
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.md')) {
      validateContentFile(filePath);
    }
  });
}

// Validate a content file
function validateContentFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(content);

    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      invalidFiles.push({
        file: filePath.replace(contentDir, ''),
        missingFields
      });
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

// Main execution
console.log('Starting content validation...');
scanDirectory(contentDir);

// Report results
if (invalidFiles.length === 0) {
  console.log('All content files are valid!');
} else {
  console.log(`Found ${invalidFiles.length} invalid content files:`);
  invalidFiles.forEach(file => {
    console.log(`- ${file.file} is missing: ${file.missingFields.join(', ')}`);
  });
}
```

To use this test, you would need to install the gray-matter package:

```bash
npm install --save-dev gray-matter
```

Then run the test:

```bash
node .junie/test-content.js
```

## Development Guidelines

### Code Style

- Use 2-space indentation for all files
- Follow the existing code style in the project
- Use kebab-case for filenames and directories

The project uses linting tools to enforce code style:

- **ESLint** for JavaScript:
  - 2-space indentation
  - Semicolons required
  - Prefer const/let over var
  - Standard JavaScript style guide

- **Stylelint** for CSS:
  - 2-space indentation
  - Tailwind CSS compatible rules
  - Trailing semicolons required

- **HTMLHint** for HTML:
  - Lowercase tag names and attributes
  - Double quotes for attribute values
  - Unique IDs
  - Alt attributes for images
  - Kebab-case for class and ID names

Run linters before committing changes:

```bash
npm run lint
```

Fix automatically fixable issues:

```bash
npm run lint:fix
```

The project uses pre-commit hooks to automatically run linters on staged files before each commit:

- JavaScript files are checked with ESLint and automatically fixed when possible
- CSS files are checked with Stylelint and automatically fixed when possible
- HTML files are checked with HTMLHint

This ensures that all committed code meets the project's coding standards without requiring manual linting.

### Hugo Templates

- Keep templates modular and reusable
- Use partials for components that are used in multiple places
- Use Hugo's built-in functions for data manipulation

### CSS/Styling

- The project uses Tailwind CSS for styling
- Custom styles should be added to the appropriate files in the `assets/css` directory
- Follow the utility-first approach of Tailwind CSS

### JavaScript

- Keep JavaScript minimal and focused on enhancing functionality
- Use modern ES6+ syntax
- Consider accessibility when adding interactive elements

### Multilingual Support

- All user-facing text should be in the `i18n` directory
- Content files should have language-specific versions
- Test all language versions when making changes

### Performance Considerations

- Optimize images before adding them to the project
- Minimize the use of external dependencies
- Use Hugo's built-in asset pipeline for CSS and JS

## Debugging

- Use Hugo's verbose mode for detailed build information:
  ```bash
  hugo --verbose
  ```

- Check the browser console for JavaScript errors
- Use the link checker test to find broken links
- For template issues, use Hugo's debug functions:
  ```go
  {{ printf "%#v" . }}
  ```
