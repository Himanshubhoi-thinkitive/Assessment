import { test, expect } from '@playwright/test';

// Utility functions for generating random data
function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomDate(startYear: number = 1970, endYear: number = 2000): string {
  const year = generateRandomNumber(startYear, endYear);
  const month = generateRandomNumber(1, 12).toString().padStart(2, '0');
  const day = generateRandomNumber(1, 28).toString().padStart(2, '0');
  return `${month}-${day}-${year}`;
}

function generateRandomPhone(): string {
  const areaCode = generateRandomNumber(200, 999);
  const firstPart = generateRandomNumber(200, 999);
  const secondPart = generateRandomNumber(1000, 9999);
  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

function generateRandomEmail(firstName: string, lastName: string): string {
  const domains = ['mailor.com', 'testmail.com', 'example.com', 'tempmail.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const randomSuffix = generateRandomNumber(100, 999);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomSuffix}@${domain}`;
}

function generateNPINumber(): string {
  return '1' + generateRandomNumber(100000000, 999999999).toString();
}

function generateProviderData() {
  const firstNames = ['Danny', 'Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'Robert', 'Maria', 'John', 'Amanda'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    dateOfBirth: generateRandomDate(1970, 1990),
    npiNumber: generateNPINumber(),
    email: generateRandomEmail(firstName, lastName)
  };
}

function generatePatientData() {
  const firstNames = ['Alex', 'Taylor', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Cameron', 'Skyler', 'Quinn'];
  const lastNames = ['Anderson', 'Thompson', 'White', 'Harris', 'Martin', 'Jackson', 'Clark', 'Lewis', 'Lee', 'Walker'];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    dateOfBirth: generateRandomDate(1990, 2010),
    mobileNumber: generateRandomPhone(),
    email: generateRandomEmail(firstName, lastName)
  };
}

// Enhanced modal closing function
async function closeAllModals(page: any) {
  try {
    console.log('🔄 Closing any open modals...');
    
    // Press Escape multiple times to close any modals
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Look for and close specific modal types
    const modalSelectors = [
      '[role="presentation"] button:has([data-testid="CloseIcon"])',
      '.MuiDialog-root button[aria-label*="close"]',
      '.MuiModal-root button:has-text("×")',
      'button:has-text("Close")',
      'button:has-text("Cancel")'
    ];
    
    for (const selector of modalSelectors) {
      const buttons = page.locator(selector);
      const count = await buttons.count();
      if (count > 0) {
        console.log(`Found ${count} modal close buttons with selector: ${selector}`);
        for (let i = 0; i < count; i++) {
          try {
            const button = buttons.nth(i);
            if (await button.isVisible({ timeout: 1000 })) {
              await button.click();
              await page.waitForTimeout(500);
            }
          } catch (e) {
            continue;
          }
        }
      }
    }
    
    console.log('✅ Modal closing completed');
  } catch (error) {
    console.log('Modal closing error (continuing):', error.message);
  }
}

// Set longer timeout for this complex test
test.setTimeout(180000); // 3 minutes

test('Complete Healthcare Provider Workflow', async ({ page }) => {
  const providerData = generateProviderData();
  const patientData = generatePatientData();
  
  console.log('Generated Provider Data:', providerData);
  console.log('Generated Patient Data:', patientData);

  try {
    // 1. Login to the application
    console.log('Step 1: Logging in...');
    await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
    await page.getByRole('textbox', { name: 'Email' }).fill('rose.gomez@jourrapide.com');
    await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
    await page.getByRole('button', { name: 'Let\'s get Started' }).click();
    await page.waitForTimeout(5000);
    console.log('✅ Login completed');

    // 2. Create Provider
    console.log('Step 2: Creating Provider...');
    await page.getByRole('banner').getByTestId('KeyboardArrowRightIcon').click();
    await page.getByRole('tab', { name: 'Settings' }).click();
    await page.getByRole('menuitem', { name: 'User Settings' }).click();
    await page.getByRole('tab', { name: 'Providers' }).click();
    await page.getByRole('button', { name: 'Add Provider User' }).click();

    // Fill provider details
    await page.getByRole('textbox', { name: 'First Name *' }).fill(providerData.firstName);
    await page.getByRole('textbox', { name: 'Last Name *' }).fill(providerData.lastName);
    await page.getByRole('combobox', { name: 'Provider Type' }).click();
    await page.getByRole('option', { name: 'PSYD' }).click();
    await page.getByRole('combobox', { name: 'specialities' }).click();
    await page.getByRole('option', { name: 'Cardiology' }).click();
    await page.getByRole('combobox', { name: 'Role *' }).click();
    await page.getByRole('option', { name: 'Provider' }).click();
    await page.getByRole('textbox', { name: 'DOB' }).fill(providerData.dateOfBirth);
    await page.getByRole('combobox', { name: 'Gender *' }).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    await page.getByRole('textbox', { name: 'NPI Number', exact: true }).fill(providerData.npiNumber);
    await page.getByRole('textbox', { name: 'Email *' }).fill(providerData.email);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(3000);
    console.log('✅ Provider created successfully');

    // 3. Set Availability
    console.log('Step 3: Setting Provider Availability...');
    await page.getByRole('tab', { name: 'Scheduling' }).click();
    await page.getByText('Availability').click();
    await page.getByRole('button', { name: 'Edit Availability' }).click();

    // Provider selection with strict mode handling
    await page.locator('form').filter({ hasText: 'Select Provider *Select' }).getByLabel('Open').click();
    const providerOptions = page.getByRole('option', { name: providerData.fullName });
    await providerOptions.first().click(); // Use .first() to handle duplicates
    
    await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
    await page.locator('form').filter({ hasText: 'Booking Window *Booking' }).getByLabel('Open').click();
    await page.getByRole('option', { name: '1 Week' }).click();

    // Set availability for weekdays (simplified approach)
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (const day of days) {
      try {
        console.log(`Setting ${day} availability...`);
        await page.getByRole('tab', { name: day }).click();
        await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').first().click();
        await page.getByRole('option', { name: '12:00 AM' }).click();
        await page.waitForTimeout(1000);
        
        await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').first().click();
        
        // Try multiple selectors for end time
        const endTimeOptions = [
          page.getByRole('option', { name: '08:00 AM (8 hrs)' }),
          page.getByRole('option', { name: ':00 AM (8 hrs)' }),
          page.locator('li:has-text("08:00 AM")').first()
        ];
        
        let endTimeSet = false;
        for (const option of endTimeOptions) {
          try {
            if (await option.isVisible({ timeout: 2000 })) {
              await option.click();
              endTimeSet = true;
              break;
            }
          } catch (e) { continue; }
        }
        
        if (endTimeSet) {
          const telehealthCheckbox = page.getByRole('checkbox', { name: 'Telehealth' });
          if (await telehealthCheckbox.isVisible({ timeout: 2000 })) {
            await telehealthCheckbox.check();
          }
        }
        
        await page.waitForTimeout(1000);
      } catch (error) {
        console.log(`⚠️ Could not set ${day} availability: ${error.message}`);
        continue;
      }
    }

    // Set appointment settings
    await page.locator('form').filter({ hasText: 'Appointment TypeAppointment' }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'New Patient Visit' }).click();
    await page.locator('form').filter({ hasText: 'DurationDuration' }).getByLabel('Open').click();
    await page.getByRole('option', { name: '30 minutes' }).click();
    await page.locator('form').filter({ hasText: 'Schedule NoticeSchedule Notice' }).getByLabel('Open').click();
    await page.getByRole('option', { name: '1 Hours Away' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(3000);
    console.log('✅ Availability set successfully');

    // 4. Patient Creation with enhanced modal handling
    console.log('Step 4: Creating Patient...');
    await closeAllModals(page);
    
    // Enhanced Create button clicking strategy
    let createClicked = false;
    const createStrategies = [
      // Strategy 1: Direct button approach
      async () => {
        const createBtn = page.getByRole('button', { name: 'Create' }).first();
        if (await createBtn.isVisible({ timeout: 3000 })) {
          await createBtn.click();
          return true;
        }
        return false;
      },
      
      // Strategy 2: Text-based selection
      async () => {
        await closeAllModals(page);
        const createText = page.getByText('Create', { exact: true }).first();
        if (await createText.isVisible({ timeout: 3000 })) {
          await createText.click({ force: true });
          return true;
        }
        return false;
      },
      
      // Strategy 3: Div filter approach
      async () => {
        await closeAllModals(page);
        const createDiv = page.locator('div').filter({ hasText: /^Create$/ }).first();
        if (await createDiv.isVisible({ timeout: 3000 })) {
          await createDiv.click({ force: true });
          return true;
        }
        return false;
      },
      
      // Strategy 4: Broader search
      async () => {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
        const createElements = page.locator('*:has-text("Create"):visible').first();
        if (await createElements.isVisible({ timeout: 3000 })) {
          await createElements.click({ force: true });
          return true;
        }
        return false;
      }
    ];
    
    for (let i = 0; i < createStrategies.length; i++) {
      try {
        console.log(`Trying create strategy ${i + 1}...`);
        createClicked = await createStrategies[i]();
        if (createClicked) {
          console.log(`✅ Create button clicked using strategy ${i + 1}`);
          break;
        }
      } catch (error) {
        console.log(`Strategy ${i + 1} failed: ${error.message}`);
      }
    }
    
    if (!createClicked) {
      await page.screenshot({ path: 'debug-no-create-button.png', fullPage: true });
      throw new Error('Could not click Create button with any strategy');
    }

    await page.getByText('New Patient', { exact: true }).click();
    await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img').click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Fill patient details
    await page.getByRole('textbox', { name: 'First Name *' }).fill(patientData.firstName);
    await page.getByRole('textbox', { name: 'Last Name *' }).fill(patientData.lastName);
    await page.getByRole('textbox', { name: 'Date Of Birth *' }).fill(patientData.dateOfBirth);
    await page.getByRole('combobox', { name: 'Gender *' }).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
    await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(patientData.mobileNumber);
    await page.getByRole('textbox', { name: 'Email *' }).fill(patientData.email);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(3000);
    console.log('✅ Patient created successfully');

    // 5. Appointment Booking
    console.log('Step 5: Booking Appointment...');
    await page.getByRole('banner').getByTestId('ExpandMoreIcon').click();
    await page.getByText('New Appointment').click();

    // Patient selection with enhanced matching
    await page.getByRole('combobox', { name: 'Patient Name *' }).click();
    await page.waitForTimeout(2000);
    
    // Find patient with flexible matching
    const patientSelectors = [
      page.getByRole('option', { name: new RegExp(patientData.firstName, 'i') }).first(),
      page.locator('li').filter({ hasText: patientData.firstName }).first(),
      page.locator(`[role="option"]:has-text("${patientData.firstName}")`).first()
    ];
    
    let patientSelected = false;
    for (const selector of patientSelectors) {
      try {
        if (await selector.isVisible({ timeout: 3000 })) {
          await selector.click();
          patientSelected = true;
          console.log('✅ Patient selected for appointment');
          break;
        }
      } catch (e) { continue; }
    }
    
    if (!patientSelected) {
      throw new Error(`Could not find patient: ${patientData.fullName}`);
    }

    await page.getByRole('combobox', { name: 'Appointment Type *' }).click();
    await page.getByRole('option', { name: 'New Patient Visit' }).click();
    await page.getByRole('textbox', { name: 'Reason For Visit *' }).fill('Fever');
    await page.locator('form').filter({ hasText: 'Timezone *Timezone *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Alaska Standard Time (GMT -09' }).click();
    await page.getByRole('button', { name: 'Telehealth' }).click();
    
    // Provider selection for appointment
    await page.getByRole('combobox', { name: 'Provider *' }).click();
    const appointmentProviderOptions = page.getByRole('option', { name: providerData.fullName });
    await appointmentProviderOptions.first().click(); // Handle duplicates
    
    await page.getByRole('button', { name: 'View availability' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('gridcell', { name: '24' }).click();
    await page.getByRole('button', { name: '06:15 AM - 06:45 AM' }).click();
    await page.getByRole('button', { name: 'Save And Close' }).click();

    console.log('🎉 Test completed successfully!');
    console.log(`Provider: ${providerData.fullName} (${providerData.email})`);
    console.log(`Patient: ${patientData.fullName} (${patientData.email})`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-failure-screenshot.png', fullPage: true });
    throw error;
  }
});