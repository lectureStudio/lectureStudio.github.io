import {test, expect} from '@playwright/test';
import { verifyPageStructure } from "./utils/testHelpers.js";

test.describe('Contact Page', () => {
    test('should load successfully', async ({page}) => {
        // Navigate to the contact page
        await page.goto('/en/contact/');

        await verifyPageStructure(page, /Contact/);
    });

    test('should display contributors section', async ({page}) => {
        // Navigate to the contact page
        await page.goto('/en/contact/');

        // Verify that the contributor list is present
        const contributorsList = page.locator('main ul[role="list"]');
        await expect(contributorsList).toBeVisible();

        // Verify that contributor items are present
        const contributorItems = page.locator('main ul[role="list"] li');

        // Check that we have multiple contributor items
        const count = await contributorItems.count();
        expect(count).toBeGreaterThan(0);

        // Verify each contributor item has the expected elements
        for (let i = 0; i < count; i++) {
            const item = contributorItems.nth(i);

            // Verify the contributor name is present and not empty
            const name = item.locator('.contributor-mail');
            await expect(name).toBeVisible();
            const nameText = await name.textContent();
            expect(nameText.trim().length).toBeGreaterThan(0);

            // Verify the email link is present and has a mailto attribute
            const href = await name.getAttribute('href');
            expect(href).toBeTruthy();
            expect(href.startsWith('mailto:')).toBeTruthy();

            // Verify the contribution tags are present
            const contributionTags = item.locator('.contributor-contributions');
            const tagsCount = await contributionTags.count();
            expect(tagsCount).toBeGreaterThan(0);
        }
    });

    test('should display support section', async ({page}) => {
        // Navigate to the contact page
        await page.goto('/en/contact/');

        // Verify that a support section is present
        const supportSection = page.locator('main .support-container');
        await expect(supportSection).toBeVisible();

        // Verify that support items are present
        const supportItems = supportSection.locator('.support-item');

        // Check that we have multiple support items
        const count = await supportItems.count();
        expect(count).toBeGreaterThan(0);

        // Verify each support item has the expected elements
        for (let i = 0; i < count; i++) {
            const item = supportItems.nth(i);

            // Verify the icon is present
            const icon = item.locator('.support-icon');
            await expect(icon).toBeVisible();

            // Verify the title is present and not empty
            const title = item.locator('.support-title');
            await expect(title).toBeVisible();
            const titleText = await title.textContent();
            expect(titleText.trim().length).toBeGreaterThan(0);

            // Verify the description is present and not empty
            const description = item.locator('.support-description');
            await expect(description).toBeVisible();
            const descriptionText = await description.textContent();
            expect(descriptionText.trim().length).toBeGreaterThan(0);

            // Check if there's a contact link (it's optional in the HTML)
            const contactLink = item.locator('.support-link');
            const hasLink = await contactLink.count() > 0;

            if (hasLink) {
                await expect(contactLink).toBeVisible();
                const linkText = await contactLink.textContent();
                expect(linkText.trim().length).toBeGreaterThan(0);

                // Verify the href attribute
                const href = await contactLink.getAttribute('href');
                expect(href).toBeTruthy();
                expect(href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('/')).toBeTruthy();

                // Verify the arrow icon is present
                const arrowIcon = contactLink.locator('svg');
                await expect(arrowIcon).toBeVisible();
            }
        }
    });
});