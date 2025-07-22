import { test, expect } from '@playwright/test';

test.describe('Patient Registration - Mandatory Fields', () => {
  test('should successfully register a new patient with mandatory fields', async ({ page }) => {
    // Navigate to the application
    await page.goto('https://stage_ketamin.uat.provider.ecarehealth.com/');

    // Step 1: Login with credentials
    await page.fill('input[id=":r2:"]', 'amol.shete+TP@medarch.com');
    await page.fill('input[type="password"]', 'Test@123$');
    await page.click('button[class*="MuiButton-root"]');

    // Wait for navigation to complete
    await page.waitForSelector('text=Create');

    // Step 2: Click "Create" button to open dropdown
    await page.click('text=Create');

    // Step 3: Select "New Patient" from dropdown
    await page.click('#create-navbar-button-menu li:has-text("New Patient")');

    // Step 4: Click "Enter Patient Details"
    await page.click('text=Enter Patient Details');

    // Step 5: Click "Next" to proceed to the form
    await page.click('button:has-text("Next")');

    // Step 6: Fill Patient Details - Mandatory Fields
    await page.fill('input[name="firstName"]', 'Das');
    await page.fill('input[name="lastName"]', 'Gone');
    await page.fill('input[name="birthDate"]', '01-01-1995');
    
    // Handle Gender dropdown - click to open dropdown first
    await page.evaluate(() => {
      const genderInput = document.querySelector('input[name="gender"]');
      if (genderInput) {
        const parent = genderInput.closest('div[class*="MuiAutocomplete"]');
        if (parent) {
          const button = parent.querySelector('button');
          if (button) {
            button.click();
          }
        }
      }
    });
    
    // Select "Male" from dropdown
    await page.click('li:has-text("Male")');

    // Step 7: Fill Contact Information - Mandatory Fields
    await page.fill('input[name="mobileNumber"]', '9022312345');
    await page.fill('input[name="email"]', 'Das@mailinator.com');

    // Step 8: Save the patient
    await page.click('button:has-text("Save")');

    // Step 9: Verify patient was created successfully
    // Wait for navigation to patient list
    await page.waitForSelector('text=Patients');
    
    // Verify the new patient appears in the list
    await expect(page.locator('text=Danny  Jon')).toBeVisible();
    await expect(page.locator('text=Danny@mailinator.com')).toBeVisible();
    await expect(page.locator('text=01/01/1995')).toBeVisible();
    await expect(page.locator('text=(900) 900-00')).toBeVisible();
    
    // Verify patient status is Active
    const patientRow = page.locator('tr:has-text("Danny  Jon")');
    await expect(patientRow.locator('text=Active')).toBeVisible();
    
    console.log('✅ Patient registration test completed successfully');
    console.log('✅ New patient "Danny Jon" has been saved and is visible in patient list');
  });

  test.beforeEach(async ({ page }) => {
    // Set longer timeout for form operations
    page.setDefaultTimeout(30000);
  });

  test.afterEach(async ({ page }) => {
    // Clean up - close browser
    await page.close();
  });
});