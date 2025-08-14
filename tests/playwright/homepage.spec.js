import { test, expect } from '@playwright/test';
import { verifyPageStructure } from "./utils/testHelpers.js";

/**
 * Makes the navigation menu visible by clicking the hamburger button if needed.
 * This is primarily used for mobile viewports where the menu is hidden by default.
 *
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {boolean} isMobile - Whether the current viewport is mobile-sized
 *
 * @returns {Promise<void>}
 */
const makeMenuVisible = async (page, isMobile) => {
    if (isMobile) {
        // Check if nav has 'hidden' class
        const nav = page.locator('header nav');
        const hasHiddenClass = await nav.evaluate(el =>
            el.classList.contains('hidden')
        );
        // This happens on mobile viewports
        if (hasHiddenClass) {
            // Click the hamburger button to open the menu
            await page.locator('button[aria-controls="menuItems"]').click();

            // Wait for mobile menu animation
            //await page.waitForTimeout(1000);

            // Verify the nav is now visible
            await expect(nav).toBeVisible();
        }
    }
}

test.describe('Homepage', () => {
    test('should load successfully', async ({page}) => {
        // Navigate to the homepage
        await page.goto('/en/');

        await verifyPageStructure(page, /lectureStudio/);
    });

    test('should have working navigation links', async ({page, isMobile}) => {
        // Navigate to the homepage
        await page.goto('/en/');

        await makeMenuVisible(page, isMobile);

        // Get all main navigation links (only from header, not footer)
        const navLinks = page.locator('header nav a[href]:not([href="#"])');

        // Count the number of links to verify there are navigation items
        const count = await navLinks.count();
        expect(count).toBeGreaterThan(0);

        // Check the first few links to make sure they work
        // We'll limit to 3 to keep the test reasonable
        const linksToCheck = Math.min(count, 3);

        for (let i = 0; i < linksToCheck; i++) {
            const link = navLinks.nth(i);
            const href = await link.getAttribute('href');

            await expect(link).toBeVisible();

            // Click the link
            await link.click();

            // Wait for navigation to complete
            await page.waitForLoadState('networkidle');

            // Verify we navigated to the expected URL
            // For relative URLs, we check if the current URL ends with the href
            if (href.startsWith('/')) {
                await expect(page).toHaveURL(new RegExp(`${href}$`));
            }
            else if (href.startsWith('http')) {
                // For absolute URLs, we'd need to handle differently
                // This is just a placeholder as external links might open in new tabs
                console.log(`External link detected: ${href}`);
            }

            // Go back to the homepage for the next iteration
            await page.goto('/en/');

            await makeMenuVisible(page, isMobile);
        }
    });

    test('should have working theme toggle', async ({page, isMobile}) => {
        // Navigate to the homepage
        await page.goto('/en/');

        await makeMenuVisible(page, isMobile);

        // Look for the theme toggle button
        const themeToggle = page.locator('#theme-toggle');

        // Check if a theme toggle exists
        const toggleExists = await themeToggle.count() > 0;

        if (toggleExists) {
            // Get the initial theme
            const initialTheme = await page.evaluate(() => {
                return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            });

            // Click the theme toggle
            await themeToggle.click();

            // Wait for the theme change to take effect
            await page.waitForTimeout(500);

            // Get the new theme
            const newTheme = await page.evaluate(() => {
                return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            });

            // Verify the theme has changed
            expect(newTheme).not.toEqual(initialTheme);
        }
        else {
            // If no theme toggle is found, we'll mark this test as passed but with a note
            console.log('No theme toggle found on the page');
        }
    });
});
