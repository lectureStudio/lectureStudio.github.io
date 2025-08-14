/**
 * Script to update download data files based on GitHub releases
 *
 * This script fetches release information from GitHub and generates YAML files
 * for the website's download section. It extracts:
 * - Version numbers
 * - Release dates
 * - Changelog entries
 * - Download URLs for different platforms
 * - File sizes
 *
 * Usage:
 * 1. Install dependencies: npm install
 * 2. Run the script: npm run update-downloads
 *
 * Configuration:
 * - Update the GitHub repository information in the config object if needed
 * - Adjust platform patterns to match your release asset naming conventions
 * - Set GITHUB_TOKEN environment variable for higher API rate limits (optional)
 *
 * Example:
 * GITHUB_TOKEN=your_token npm run update-downloads
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const config = {
    // GitHub repository information
    github: {
        owner: 'lectureStudio', // GitHub organization
        repo: 'lectureStudio', // Repository name
        // Optional: GitHub token for API authentication (increases rate limits)
        token: process.env.GITHUB_TOKEN
    },
    // Languages supported
    languages: ['en', 'de'],
    // Platform definitions
    platforms: [
        {
            name: 'Windows',
            nameTranslations: { en: 'Windows', de: 'Windows' },
            descriptionTranslations: {
                en: 'Installer for Windows 10/11',
                de: 'Installer für Windows 10/11'
            },
            assetPatterns: [
                { pattern: /.*win.*\.msi$/i, type: 'MSI' },
                { pattern: /.*win.*\.exe$/i, type: 'EXE' }
            ]
        },
        {
            name: 'macOS',
            nameTranslations: { en: 'macOS', de: 'macOS' },
            descriptionTranslations: {
                en: 'Installer for macOS',
                de: 'Installer für macOS'
            },
            assetPatterns: [
                { pattern: /.*mac.*x86.*\.pkg$/i, type: 'Intel x86' },
                { pattern: /.*mac.*arm64.*\.pkg$/i, type: 'Apple Silicon' }
            ]
        },
        {
            name: 'Linux',
            nameTranslations: { en: 'Linux', de: 'Linux' },
            descriptionTranslations: {
                en: 'Packages for Linux distributions',
                de: 'Pakete für Linux-Distributionen'
            },
            assetPatterns: [
                { pattern: /.*linux.*\.deb$/i, type: 'DEB' },
                { pattern: /.*linux.*\.rpm$/i, type: 'RPM' },
                { pattern: /.*linux.*\.zip$/i, type: 'ZIP' }
            ]
        }
    ],
    // Output directory for download data files
    outputDir: path.join(__dirname, '..', 'data', 'downloads'),
    // Default changelog if none is provided in the release
    defaultChangelog: {
        en: ['Bug fixes and performance improvements'],
        de: ['Fehlerbehebungen und Leistungsverbesserungen']
    }
};

/**
 * Make an HTTPS request to the GitHub API
 * @param {string} path - API endpoint path
 * @returns {Promise<Object>} - JSON response
 */
function githubApiRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path,
            method: 'GET',
            headers: {
                'User-Agent': 'Download-Data-Updater',
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        // Add authorization header if token is provided
        if (config.github.token) {
            options.headers['Authorization'] = `token ${config.github.token}`;
        }

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(new Error(`Failed to parse GitHub API response: ${error.message}`));
                    }
                } else {
                    reject(new Error(`GitHub API request failed with status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

/**
 * Get the latest GitHub release
 * @returns {Promise<Object>} - Release data
 */
async function getLatestRelease() {
    const { owner, repo } = config.github;
    return githubApiRequest(`/repos/${owner}/${repo}/releases/latest`);
}

/**
 * Get a specific GitHub release by tag
 * @param {string} tag - Release tag
 * @returns {Promise<Object>} - Release data
 */
async function getReleaseByTag(tag) {
    const { owner, repo } = config.github;
    return githubApiRequest(`/repos/${owner}/${repo}/releases/tags/${tag}`);
}

/**
 * Get all GitHub releases
 * @returns {Promise<Array>} - Array of release data
 */
async function getAllReleases() {
    const { owner, repo } = config.github;
    return githubApiRequest(`/repos/${owner}/${repo}/releases`);
}

/**
 * Calculate file size in MB from bytes
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size string (e.g., "25.1 MB")
 */
function formatFileSize(bytes) {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
}

/**
 * Parse changelog from release body
 * @param {string} body - Release body text
 * @returns {Object} - Changelog entries by language
 */
function parseChangelog(body) {
    if (!body) {
        return null;
    }

    // Default changelog structure
    const changelog = {};

    // Split by newlines but preserve markdown syntax
    const lines = body.split('\n');

    // For now, use the same changelog for all languages
    // In a real implementation, you might want to parse language-specific sections
    config.languages.forEach(lang => {
        changelog[lang] = lines;
    });

    return changelog;
}

/**
 * Generate download data for a release
 * @param {Object} release - GitHub release data
 * @returns {Object} - Download data by language
 */
function generateDownloadData(release) {
    const versionNumber = release.tag_name.replace(/^v/, '');
    const releaseDate = new Date(release.published_at).toISOString().split('T')[0];

    // Parse changelog from release body or use default
    const changelog = parseChangelog(release.body) || config.defaultChangelog;

    // Process assets by platform
    const platformData = {};

    config.platforms.forEach(platform => {
        const packages = [];

        // Match assets to platform patterns
        platform.assetPatterns.forEach(({ pattern, type }) => {
            const matchingAsset = release.assets.find(asset => pattern.test(asset.name));
            if (matchingAsset) {
                packages.push({
                    type,
                    url: matchingAsset.browser_download_url,
                    size: formatFileSize(matchingAsset.size)
                });
            }
        });

        // Only include platform if it has packages
        if (packages.length > 0) {
            platformData[platform.name] = {
                packages,
                nameTranslations: platform.nameTranslations,
                descriptionTranslations: platform.descriptionTranslations
            };
        }
    });

    // Generate data for each language
    const downloadData = {};

    config.languages.forEach(lang => {
        const platforms = Object.entries(platformData).map(([name, data]) => ({
            name: data.nameTranslations[lang] || name,
            description: data.descriptionTranslations[lang] || '',
            packages: data.packages
        }));

        downloadData[lang] = {
            changelog: changelog[lang] || config.defaultChangelog[lang],
            version: versionNumber,
            date: releaseDate,
            platforms
        };
    });

    return downloadData;
}

/**
 * Write download data to YAML files
 * @param {string} version - Version string (e.g., "v1.3.0")
 * @param {Object} data - Download data by language
 */
function writeDownloadFiles(version, data) {
    const outputDir = path.join(config.outputDir, version);

    // Create an output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write files for each language
    Object.entries(data).forEach(([lang, langData]) => {
        const filePath = path.join(outputDir, `downloads_${lang}.yaml`);

        // Format YAML content with preserved Markdown
        const yamlContent = [
            'changelog: |',
            ...langData.changelog.map(item => `  ${item}`),
            '',
            `version: "${langData.version}"`,
            `date: "${langData.date}"`,
            '',
            'platforms:',
            ...langData.platforms.flatMap(platform => [
                `  - name: "${platform.name}"`,
                `    description: "${platform.description}"`,
                '    packages:',
                ...platform.packages.flatMap(pkg => [
                    `      - type: "${pkg.type}"`,
                    `        url: "${pkg.url}"`,
                    `        size: "${pkg.size}"`
                ])
            ])
        ].join('\n');

        fs.writeFileSync(filePath, yamlContent, 'utf8');
        console.log(`Created ${filePath}`);
    });
}

/**
 * Main function to update download data for the latest release
 */
async function updateLatestRelease() {
    try {
        console.log('Fetching latest release from GitHub...');
        const latestRelease = await getLatestRelease();

        console.log(`Processing release: ${latestRelease.tag_name}`);
        const downloadData = generateDownloadData(latestRelease);

        console.log('Writing download data files...');
        writeDownloadFiles(latestRelease.tag_name, downloadData);

        console.log('Download data update completed successfully!');
    } catch (error) {
        console.error('Error updating download data:', error);
        process.exit(1);
    }
}

/**
 * Main function to update download data for all releases
 */
async function updateAllReleases() {
    try {
        console.log('Fetching all releases from GitHub...');
        const releases = await getAllReleases();

        console.log(`Found ${releases.length} releases`);

        for (const release of releases) {
            console.log(`Processing release: ${release.tag_name}`);
            const downloadData = generateDownloadData(release);

            console.log('Writing download data files...');
            writeDownloadFiles(release.tag_name, downloadData);
        }

        console.log('All releases download data update completed successfully!');
    } catch (error) {
        console.error('Error updating all releases download data:', error);
        process.exit(1);
    }
}

// Run the update processes
updateLatestRelease();
// Get all releases
// updateAllReleases();
