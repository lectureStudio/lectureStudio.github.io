import { test, expect } from '@playwright/test';
import { verifyPageStructure } from "./utils/testHelpers.js";

test.describe('Sponsors Page', () => {
    test('should load successfully', async ({page}) => {
        // Navigate to the sponsor page
        await page.goto('/en/sponsors/');

        await verifyPageStructure(page, /Sponsors/);
    });

    test('should display sponsor cards', async ({page}) => {
        // Navigate to the sponsor page
        await page.goto('/en/sponsors/');

        // Verify that sponsor cards are present
        const sponsorCards = page.locator('main .sponsor-card');
        
        // Check that we have multiple sponsor cards
        const count = await sponsorCards.count();
        expect(count).toBeGreaterThan(0);

        // Verify each sponsor card has the expected elements
        for (let i = 0; i < count; i++) {
            const card = sponsorCards.nth(i);
            
            // Verify SVG logo is present
            const logo = card.locator('svg');
            await expect(logo).toBeVisible();
            
            // Verify the sponsor name is present and not empty
            const name = card.locator('.sponsor-name');
            await expect(name).toBeVisible();
            const nameText = await name.textContent();
            expect(nameText.trim().length).toBeGreaterThan(0);
            
            // Verify the sponsor description is present and not empty
            const description = card.locator('.sponsor-description');
            await expect(description).toBeVisible();
            const descriptionText = await description.textContent();
            expect(descriptionText.trim().length).toBeGreaterThan(0);
            
            // Verify the sponsor link is present and has a href attribute
            const link = card.locator('a[target="_blank"]');
            await expect(link).toBeVisible();
            const href = await link.getAttribute('href');
            expect(href).toBeTruthy();
            expect(href.startsWith('http')).toBeTruthy();
        }
    });
});