import { test, expect } from '@playwright/test';
import { verifyPageStructure } from "./utils/testHelpers.js";

test.describe('Tutorials Page', () => {
    test('should load successfully', async ({page}) => {
        // Navigate to the tutorials page
        await page.goto('/en/tutorials/');

        await verifyPageStructure(page, /Tutorials/);
    });

    test('should display tutorial cards', async ({page}) => {
        // Navigate to the tutorials page
        await page.goto('/en/tutorials/');

        // Verify that tutorial cards are present
        const tutorialCards = page.locator('.tutorial-card');

        // Check that we have multiple tutorial cards
        const count = await tutorialCards.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const card = tutorialCards.nth(i);

            // Verify video element exists
            const video = card.locator('.tutorial-content video');
            await expect(video).toBeVisible();

            // Verify the video has a 'controls' attribute
            const hasControls = await video.evaluate(el => el.hasAttribute('controls'));
            expect(hasControls).toBe(true);

            // Verify the video has a source element with type="video/mp4"
            const source = video.locator('source');
            await expect(source).toBeAttached();

            const sourceType = await source.getAttribute('type');
            expect(sourceType).toBe('video/mp4');

            // Verify the source has a valid src attribute
            const src = await source.getAttribute('src');
            expect(src).toBeTruthy();
            expect(src).toMatch(/\.mp4$/);

            const info = card.locator('.tutorial-info');

            // Verify the title exists
            const title = info.locator('.tutorial-title');
            await expect(title).toBeVisible();

            // Verify description exists
            const description = info.locator('.tutorial-description');
            await expect(description).toBeVisible();

            // Verify duration exists
            const duration = info.locator('.tutorial-duration');
            await expect(duration).toBeVisible();

            // Verify PDF link exists
            const pdfLink = info.locator('a[href$=".pdf"]');
            await expect(pdfLink).toBeVisible();

            // Verify the link has a target="_blank" attribute
            const target = await pdfLink.getAttribute('target');
            expect(target).toBe('_blank');
        }
    });
});