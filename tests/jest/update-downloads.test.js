/**
 * Tests for update-downloads.cjs
 *
 * This file tests the functionality for updating download information, including:
 * - GitHub API requests
 * - Release data processing
 * - File generation
 */

// Mock the fs and https modules
jest.mock('fs');
jest.mock('https');

describe('Update Downloads Script', () => {
    // Original process.env
    const originalEnv = process.env;

    // Mock GitHub API response for the latest release
    const mockLatestRelease = {
        tag_name: 'v6.2.0',
        published_at: '2023-05-15T12:00:00Z',
        body: '### Features\n- Added new feature 1\n- Added new feature 2\n\n### Bug Fixes\n- Fixed issue 1\n- Fixed issue 2',
        assets: [
            {
                name: 'lectureStudio-win-6.2.0.msi',
                browser_download_url: 'https://github.com/lectureStudio/lectureStudio/releases/download/v6.2.0/lectureStudio-win-6.2.0.msi',
                size: 52428800 // 50 MB
            },
            {
                name: 'lectureStudio-mac-x86_64-6.2.0.pkg',
                browser_download_url: 'https://github.com/lectureStudio/lectureStudio/releases/download/v6.2.0/lectureStudio-mac-x86_64-6.2.0.pkg',
                size: 41943040 // 40 MB
            },
            {
                name: 'lectureStudio-mac-arm64-6.2.0.pkg',
                browser_download_url: 'https://github.com/lectureStudio/lectureStudio/releases/download/v6.2.0/lectureStudio-mac-arm64-6.2.0.pkg',
                size: 41943040 // 40 MB
            },
            {
                name: 'lectureStudio-linux-6.2.0.deb',
                browser_download_url: 'https://github.com/lectureStudio/lectureStudio/releases/download/v6.2.0/lectureStudio-linux-6.2.0.deb',
                size: 36700160 // 35 MB
            },
            {
                name: 'lectureStudio-linux-6.2.0.rpm',
                browser_download_url: 'https://github.com/lectureStudio/lectureStudio/releases/download/v6.2.0/lectureStudio-linux-6.2.0.rpm',
                size: 36700160 // 35 MB
            }
        ]
    };

    // Setup mocks before each test
    beforeEach(() => {
        // Reset all mocks
        jest.resetAllMocks();

        // Clear module cache to force re-import
        jest.resetModules();

        // Mock process.env
        process.env = {...originalEnv};

        // Re-mock the fs module after module reset
        const fs = require('fs');

        // Mock fs.existsSync to return true for directories
        fs.existsSync.mockImplementation(_path => {
            return true;
        });

        // Mock fs.mkdirSync
        fs.mkdirSync.mockImplementation(() => {
        });

        // Mock fs.writeFileSync
        fs.writeFileSync.mockImplementation(() => {
        });

        // Mock fs.readdirSync
        fs.readdirSync.mockImplementation(() => []);

        // Mock fs.statSync
        fs.statSync.mockImplementation(() => ({
            isDirectory: () => false
        }));

        // Mock https.request
        const mockHttpsRequest = {
            on: jest.fn().mockImplementation(function (_event, _callback) {
                return this;
            }),
            end: jest.fn().mockImplementation(function () {
                // Simulate successful response
                const mockResponse = {
                    statusCode: 200,
                    on: jest.fn().mockImplementation((event, callback) => {
                        if (event === 'data') {
                            callback(JSON.stringify(mockLatestRelease));
                        }
                        if (event === 'end') {
                            callback();
                        }
                        return mockResponse;
                    })
                };

                this.callback(mockResponse);
                return this;
            })
        };

        require('https').request.mockImplementation((options, callback) => {
            mockHttpsRequest.callback = callback;
            return mockHttpsRequest;
        });
    });

    // Restore process.env after tests
    afterEach(() => {
        process.env = originalEnv;
    });

    test('should fetch latest release from GitHub', async () => {
        // Import the script (which will execute immediately)
        require('../../scripts/update-downloads.cjs');

        // Wait for any promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify that https.request was called with the correct GitHub API endpoint
        expect(require('https').request).toHaveBeenCalledWith(
            expect.objectContaining({
                hostname: 'api.github.com',
                path: '/repos/lectureStudio/lectureStudio/releases/latest'
            }),
            expect.any(Function)
        );
    });

    test('should create download data files for each language', async () => {
        const fs = require('fs');

        // Import the script (which will execute immediately)
        require('../../scripts/update-downloads.cjs');

        // Wait for any promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify that writeFileSync was called for each language
        expect(fs.writeFileSync).toHaveBeenCalledTimes(2); // en and de

        // Check that the first call was for English
        expect(fs.writeFileSync.mock.calls[0][0]).toContain('downloads_en.yaml');

        // Check that the second call was for German
        expect(fs.writeFileSync.mock.calls[1][0]).toContain('downloads_de.yaml');

        // Verify the content of files includes a version and platforms
        const enFileContent = fs.writeFileSync.mock.calls[0][1];
        expect(enFileContent).toContain('version: "6.2.0"');
        expect(enFileContent).toContain('date: "2023-05-15"');
        expect(enFileContent).toContain('- name: "Windows"');
        expect(enFileContent).toContain('- name: "macOS"');
        expect(enFileContent).toContain('- name: "Linux"');
    });

    test('should use GitHub token if provided', async () => {
        // Set GitHub token in environment
        process.env.GITHUB_TOKEN = 'test-token';

        // Import the script (which will execute immediately)
        require('../../scripts/update-downloads.cjs');

        // Wait for any promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify that https.request was called with the authorization header
        expect(require('https').request).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': 'token test-token'
                })
            }),
            expect.any(Function)
        );
    });

    test('should handle errors gracefully', async () => {
        // Mock console.error
        const originalConsoleError = console.error;
        console.error = jest.fn();

        // Mock process.exit
        const originalProcessExit = process.exit;
        process.exit = jest.fn();

        // Mock https.request to simulate an error
        require('https').request.mockImplementation((_options, _callback) => {
            // Return the complete mock request object
            return {
                on: jest.fn().mockImplementation(function (event, callback) {
                    if (event === 'error') {
                        callback(new Error('Network error'));
                    }
                    return this;
                }),
                end: jest.fn()
            };
        });

        // Import the script (which will execute immediately)
        require('../../scripts/update-downloads.cjs');

        // Wait for any promises to resolve
        await new Promise(resolve => setTimeout(resolve, 0));

        // Verify that error was logged and process.exit was called
        expect(console.error).toHaveBeenCalledWith(
            'Error updating download data:',
            expect.any(Error)
        );
        expect(process.exit).toHaveBeenCalledWith(1);

        // Restore console.error and process.exit
        console.error = originalConsoleError;
        process.exit = originalProcessExit;
    });
});
