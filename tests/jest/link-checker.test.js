const fs = require('fs');
const path = require('path');
const { JSDOM } = require("jsdom");

describe('Link Checker', () => {
    test('check for broken links in public directory', () => {
        // Configuration
        const publicDir = path.join(__dirname, '..', '..', 'public');
        const ignoredExtensions = ['.jpg', '.png', '.gif', '.svg', '.ico', '.pdf', '.zip', '.exe', '.dmg', '.deb', '.rpm'];
        const defaultLanguage = 'en'; // Default language from Hugo config

        // Result tracking
        const brokenLinks = [];
        const checkedLinks = new Set();

        // Your existing functions
        function isInternalLink(url) {
            return !url.startsWith('http') && !url.startsWith('mailto:') && !url.startsWith('tel:');
        }

        function fileExists(filePath) {
            try {
                return fs.existsSync(filePath);
            }
            catch (_err) {
                return false;
            }
        }

        function processHtmlFile(filePath) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const dom = new JSDOM(content);
                const links = dom.window.document.querySelectorAll('a');
                const fileRelativePath = filePath.replace(publicDir, '');
                const fileBaseUrl = path.dirname(fileRelativePath);

                links.forEach(link => {
                    const href = link.getAttribute('href');

                    if (!href || checkedLinks.has(href)) {
                        return;
                    }

                    checkedLinks.add(href);

                    // Only check internal links
                    if (isInternalLink(href)) {
                        // Skip anchor links and ignored extensions
                        if (href === '#' || ignoredExtensions.some(ext => href.endsWith(ext))) {
                            return;
                        }

                        let targetPath;
                        if (href.startsWith('/')) {
                            // Absolute path
                            // First try the path as is
                            targetPath = path.join(publicDir, href.substring(1));

                            // If the file doesn't exist and the path doesn't already start with the language code,
                            // try with the default language prefix
                            if (!fileExists(targetPath) && !href.startsWith(`/${defaultLanguage}/`)) {
                                const withLangPrefix = path.join('/', defaultLanguage, href);
                                const langPrefixPath = path.join(publicDir, withLangPrefix.substring(1));

                                // If the path with a language prefix exists, use it instead
                                if (fileExists(langPrefixPath)) {
                                    targetPath = langPrefixPath;
                                }
                            }
                        }
                        else {
                            // Relative path - normalize properly
                            // Check if href starts with a language code that's already in fileBaseUrl
                            const langMatch = href.match(/^([a-z]{2})\//);
                            let resolvedPath;

                            if (langMatch && fileBaseUrl.includes(`/${langMatch[1]}`)) {
                                // If href starts with a language code that's already in the base URL,
                                // use the absolute path to avoid duplication
                                resolvedPath = path.normalize(path.join('/', href));
                            } else {
                                // Normal relative path resolution
                                resolvedPath = path.normalize(path.join('/', fileBaseUrl, href));
                            }

                            targetPath = path.join(publicDir, resolvedPath.substring(1));
                        }

                        // Handle paths that end with / by looking for index.html
                        if (targetPath.endsWith('/') || !path.extname(targetPath)) {
                            if (!targetPath.endsWith('/')) {
                                targetPath += '/';
                            }
                            targetPath += 'index.html';

                            // If index.html doesn't exist and the path doesn't already have a language prefix,
                            // try with the default language prefix
                            if (!fileExists(targetPath) && !targetPath.includes(`/${defaultLanguage}/`)) {
                                // Extract the path relative to publicDir
                                const relativePath = targetPath.replace(publicDir, '');
                                // Create a new path with the language prefix
                                const withLangPrefix = path.join('/', defaultLanguage, relativePath);
                                const langPrefixPath = path.join(publicDir, withLangPrefix.substring(1));

                                // If the path with language prefix exists, use it instead
                                if (fileExists(langPrefixPath)) {
                                    targetPath = langPrefixPath;
                                }
                            }
                        }

                        if (!fileExists(targetPath)) {
                            brokenLinks.push({
                                source: fileRelativePath,
                                link: href,
                                target: targetPath.replace(publicDir, '')
                            });
                        }
                    }
                });
            }
            catch (err) {
                console.error(`Error processing ${filePath}:`, err);
            }
        }

        function scanDirectory(dir) {
            const files = fs.readdirSync(dir);

            files.forEach(file => {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    scanDirectory(filePath);
                }
                else if (file.endsWith('.html')) {
                    processHtmlFile(filePath);
                }
            });
        }

        // Ensure public directory exists
        expect(fs.existsSync(publicDir)).toBeTruthy();
        expect(fs.readdirSync(publicDir).length).toBeGreaterThan(0);

        // Run the scan
        scanDirectory(publicDir);

        // Assert results
        expect(checkedLinks.size).toBeGreaterThan(0);
        expect(brokenLinks).toEqual([]);
    });
});
