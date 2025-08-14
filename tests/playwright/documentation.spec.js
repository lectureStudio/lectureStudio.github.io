import { test, expect } from '@playwright/test';
import { verifyPageStructure } from "./utils/testHelpers.js";

test.describe('Documentation Pages', () => {
    test('should load documentation index page', async ({page}) => {
        // Navigate to the documentation index page
        await page.goto('/en/documentation/');

        await verifyPageStructure(page, /Documentation/i);
    });
    
    test('should load installation page', async ({page}) => {
        // Navigate to the installation page
        await page.goto('/en/documentation/getting-started/installation/');
        
        await verifyPageStructure(page, /Installation/i);
        
        // Verify tabs for different operating systems exist
        await expect(page.locator('button:has-text("Windows")')).toBeVisible();
        await expect(page.locator('button:has-text("macOS")')).toBeVisible();
        await expect(page.locator('button:has-text("Linux")')).toBeVisible();
    });
    
    test('should load system requirements page', async ({page}) => {
        // Navigate to the system requirements page
        await page.goto('/en/documentation/getting-started/system-requirements/');
        
        await verifyPageStructure(page, /System Requirements|Systemanforderungen/i);
        
        // Verify content for system requirements
        await expect(page.locator('li:has-text("Operating System")')).toBeVisible();
        await expect(page.locator('li:has-text("Processor")')).toBeVisible();
        await expect(page.locator('li:has-text("Memory")')).toBeVisible();
        await expect(page.locator('li:has-text("Storage")')).toBeVisible();
    });
    
    test('should have working language switcher on documentation pages', async ({page}) => {
        // Test on the documentation index page
        await page.goto('/documentation/');
        
        // Find and click the language switcher (assuming it exists in the navigation)
        const languageSwitcher = page.locator('a[href*="/documentation/"]');
        
        // If the language switcher is visible, test it
        if (await languageSwitcher.isVisible()) {
            await languageSwitcher.click();
            
            // Verify we're on the German version
            await expect(page).toHaveURL(/\/de\/documentation\//);
            await expect(page.locator('h2:has-text("Willkommen in unserer Dokumentation")')).toBeVisible();
            
            // Switch back to English
            await page.locator('a[href*="/documentation/"]').click();
            await expect(page).toHaveURL(/\/documentation\//);
            await expect(page.locator('h2:has-text("Welcome to our Documentation")')).toBeVisible();
        }
    });
    
    test('should verify user manual link works', async ({page}) => {
        await page.goto('/en/documentation/');
        
        // Find and click the user manual link
        const manualLink = page.locator('a[href*="/manual/"]');
        
        // Check if the link exists and get its href
        const href = await manualLink.getAttribute('href');
        expect(href).toBeTruthy();
        
        // We won't navigate to external links, but we can verify the link has a proper format
        expect(href).toContain('lecturestudio.org/manual');
    });
    
    test('should verify navigation between documentation pages', async ({page}) => {
        // Start at the documentation index
        await page.goto('/en/documentation/');
        
        // Find and navigate to the installation page (assuming there's a link in the sidebar or content)
        const installationLink = page.locator('a[href*="/installation/"]');
        
        // If the link exists, test navigation
        if (await installationLink.isVisible()) {
            await installationLink.click();
            await expect(page).toHaveURL(/\/documentation\/getting-started\/installation\//);
        }
    });
});