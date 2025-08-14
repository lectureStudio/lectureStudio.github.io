import { test, expect } from '@playwright/test';
import { verifyPageStructure } from "./utils/testHelpers.js";

test.describe('FAQ Page', () => {
    test('should load successfully', async ({page}) => {
        // Navigate to the FAQ page
        await page.goto('/en/faq/');

        await verifyPageStructure(page, /Frequently Asked Questions/);
    });

    test('should display FAQ items', async ({page}) => {
        // Navigate to the FAQ page
        await page.goto('/en/faq/');

        // Verify that FAQ items are present
        const faqItems = page.locator('main .faq-item');

        // Check that we have multiple FAQ items
        const count = await faqItems.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const item = faqItems.nth(i);
            const button = item.locator('button');
            await button.click();

            await page.waitForTimeout(500);

            const question = item.locator('.faq-question');
            const answer = item.locator('div[id^="faq-"]');

            // Verify each FAQ item has a question and an answer
            await expect(question).toBeVisible();
            await expect(answer).toBeVisible();

            // Verify the question text is not empty
            const questionText = await question.textContent();
            expect(questionText.trim().length).toBeGreaterThan(0);

            // Verify the answer text is not empty
            const answerText = await answer.evaluate(element => {
                function getAllText(element) {
                    let text = '';
                    // Get direct text of this element
                    if (element.childNodes) {
                        for (const node of element.childNodes) {
                            if (node.nodeType === Node.TEXT_NODE) {
                                text += node.textContent.trim() + ' ';
                            }
                            else if (node.nodeType === Node.ELEMENT_NODE) {
                                text += getAllText(node) + ' ';
                            }
                        }
                    }
                    return text.trim();
                }

                return getAllText(element);
            });
            expect(answerText.length).toBeGreaterThan(0);

            // Click the question again to collapse the answer
            await button.click();
        }
    });

    test('should toggle FAQ answers when clicked', async ({page}) => {
        // Navigate to the FAQ page
        await page.goto('/en/faq/');

        // Get all FAQ items
        const faqItems = page.locator('main .faq-item');
        const count = await faqItems.count();
        expect(count).toBeGreaterThan(0);

        // Test the accordion functionality on the first item
        const firstItem = faqItems.first();
        const firstQuestion = firstItem.locator('button');
        const firstAnswer = firstItem.locator('div[id^="faq-"]');
        const firstIcon = firstItem.locator('svg[id^="faq-icon-"]');

        // Verify the answer is initially hidden
        await expect(firstAnswer).toHaveClass(/hidden/);
        
        // Click the question to expand the answer
        await firstQuestion.click();
        
        // Verify the answer is now visible
        await expect(firstAnswer).not.toHaveClass(/hidden/);
        
        // Verify the icon has rotated
        await expect(firstIcon).toHaveClass(/rotate-180/);
        
        // Click the question again to collapse the answer
        await firstQuestion.click();
        
        // Verify the answer is hidden again
        await expect(firstAnswer).toHaveClass(/hidden/);
        
        // Verify the icon has rotated back
        await expect(firstIcon).not.toHaveClass(/rotate-180/);
    });
});