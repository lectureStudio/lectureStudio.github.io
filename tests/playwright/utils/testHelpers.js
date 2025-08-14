import { expect } from '@playwright/test';

/**
 * Verifies the basic structure of a web page including title, navigation, main content, and footer.
 *
 * @param {import('playwright').Page} page - The Playwright page object to verify
 * @param {string|RegExp} titleOrRegExp - The expected page title or a regular expression to match the title
 *
 * @returns {Promise<void>} - A promise that resolves when all verification is complete
 */
export async function verifyPageStructure(page, titleOrRegExp) {
    // Verify the page title
    await expect(page).toHaveTitle(titleOrRegExp);

    // Verify navigation menu is present
    const navMenu = page.locator('header');
    await expect(navMenu).toBeVisible();

    // Verify the main content is present
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();

    // Verify footer is present
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
}