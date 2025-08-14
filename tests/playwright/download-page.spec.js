import { test, expect } from '@playwright/test';
import { verifyPageStructure } from "./utils/testHelpers.js";

/**
 * Verifies the validity of download links within a given page element.
 * Checks that download links exist, have valid href attributes, and point to
 * either relative or absolute URLs.
 *
 * @param {import('@playwright/test').Locator} element - The Playwright locator containing download links
 *
 * @returns {Promise<void>} - A promise that resolves when all checks are complete
 */
const checkDownloadLinks = async (element) => {
    // Find all download links
    const downloadLinks = element.locator('a[href*=".msi"], a[href*=".pkg"], a[href*=".deb"], a[href*=".rpm"], a[href*=".zip"]');

    // Verify there are download links
    const count = await downloadLinks.count();
    expect(count).toBeGreaterThan(0);

    // Check each download link has a valid href
    for (let i = 0; i < count; i++) {
        const link = downloadLinks.nth(i);
        const href = await link.getAttribute('href');

        // Verify the href is not empty
        expect(href).toBeTruthy();

        // Verify the href points to a valid URL (either relative or absolute)
        expect(href.startsWith('/') || href.startsWith('http')).toBeTruthy();
    }
}

test.describe('Download Page', () => {
    test('should load successfully', async ({page}) => {
        // Navigate to the download page
        await page.goto('/en/download/');

        await verifyPageStructure(page, /Official Releases/i);
    });

    test('should display download options Linux', async ({page}) => {
        // Navigate to the download page
        await page.goto('/en/download/');

        // Check for a Linux download section
        const linuxSection = page.locator('main nav .tab-button', {hasText: /Linux/i});
        await expect(linuxSection).toBeVisible();

        await linuxSection.click();

        // Verify platform information is displayed
        const platformContent = page.locator('main .tab-content:not(.hidden)');
        const platformName = platformContent.locator('.platform-name');

        await expect(platformName).toBeVisible();
        await expect(platformName).toHaveText(/Linux/i);

        // Verify version information is displayed
        const versionInfo = platformContent.locator('.platform-version', {hasText: /\w+\s\d+\.\d+\.\d+/});
        await expect(versionInfo.first()).toBeVisible();

        // Verify that the changelog content is visible
        const changelogContent = platformContent.locator('.version-content .changelog-content');
        await expect(changelogContent.first()).toBeVisible();

        await checkDownloadLinks(platformContent);
    });

    test('should display download options macOS', async ({page}) => {
        // Navigate to the download page
        await page.goto('/en/download/');

        // Check for the macOS download section
        const macOSSection = page.locator('main nav .tab-button', {hasText: /macOS/i});
        await expect(macOSSection).toBeVisible();

        await macOSSection.click();

        // Verify platform information is displayed
        const platformContent = page.locator('main .tab-content:not(.hidden)');
        const platformName = platformContent.locator('.platform-name');

        await expect(platformName).toBeVisible();
        await expect(platformName).toHaveText(/macOS/i);

        // Verify version information is displayed
        const versionInfo = platformContent.locator('.platform-version', {hasText: /\w+\s\d+\.\d+\.\d+/});
        await expect(versionInfo.first()).toBeVisible();

        // Verify that the changelog content is visible
        const changelogContent = platformContent.locator('.version-content .changelog-content');
        await expect(changelogContent.first()).toBeVisible();

        await checkDownloadLinks(platformContent);
    });

    test('should display download options Windows', async ({page}) => {
        // Navigate to the download page
        await page.goto('/en/download/');

        // Check for a Windows download section
        const windowsSection = page.locator(`main nav .tab-button`, {hasText: /Windows/i});
        await expect(windowsSection).toBeVisible();

        await windowsSection.click();

        // Verify platform information is displayed
        const platformContent = page.locator('main .tab-content:not(.hidden)');
        const platformName = platformContent.locator('.platform-name');

        await expect(platformName).toBeVisible();
        await expect(platformName).toHaveText(/Windows/i);

        // Verify version information is displayed
        const versionInfo = platformContent.locator('.platform-version', {hasText: /\w+\s\d+\.\d+\.\d+/});
        await expect(versionInfo.first()).toBeVisible();

        // Verify that the changelog content is visible
        const changelogContent = platformContent.locator('.version-content .changelog-content');
        await expect(changelogContent.first()).toBeVisible();

        await checkDownloadLinks(platformContent);
    });
});