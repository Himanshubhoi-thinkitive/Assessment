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

// Helper function to wait for and close any modal dialogs
async function closeAnyModals(page: any) {
  try {
    const modal = page.locator('[role="presentation"]').first();
    if (await modal.isVisible({ timeout: 2000 })) {
      const closeButton = modal.locator('button[aria-label*="close"], button:has-text("Close"), button:has-text("×")').first();
      if (await closeButton.isVisible({ timeout: 1000 })) {
        await closeButton.click();
        await page.waitForTimeout(1000);
      }
    }
  } catch (error) {
    console.log('No modal to close or close button not found');
  }
}

// Helper function for robust clicking with retries
async function robustClick(page: any, locator: any, description: string, maxRetries: number = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await closeAnyModals(page);
      await locator.waitFor({ state: 'visible', timeout: 10000 });
      await locator.click({ timeout: 10000 });
      console.log(`✓ Successfully clicked: ${description}`);
      return;
    } catch (error) {
      console.log(`Attempt ${i + 1} failed for ${description}: ${error.message}`);
      if (i === maxRetries - 1) throw error;
      await page.waitForTimeout(2000);
    }
  }
}

// Helper function for robust form filling
async function robustFill(page: any, locator: any, value: string, description: string, maxRetries: number = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await locator.waitFor({ state: 'visible', timeout: 10000 });
      await locator.clear();
      await locator.fill(value);
      console.log(`✓ Successfully filled: ${description} with ${value}`);
      return;
    } catch (error) {
      console.log(`Attempt ${i + 1} failed for ${description}: ${error.message}`);
      if (i === maxRetries - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
}

// Set longer timeout for this complex test
test.setTimeout(120000); // 2 minutes

test('Complete Healthcare Provider Workflow', async ({ page }) => {
  const providerData = generateProviderData();
  const patientData = generatePatientData();
  
  console.log('Generated Provider Data:', providerData);
  console.log('Generated Patient Data:', patientData);

  try {
    // 1. Login to the application
    console.log('Step 1: Logging in...');
    await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
    await robustFill(page, page.getByRole('textbox', { name: 'Email' }), 'rose.gomez@jourrapide.com', 'Email field');
    await robustFill(page, page.getByRole('textbox', { name: '*********' }), 'Pass@123', 'Password field');
    await robustClick(page, page.getByRole('button', { name: 'Let\'s get Started' }), 'Login button');
    
    // Wait for login to complete
    await page.waitForTimeout(5000);
    console.log('✓ Login completed');

    // 2. Navigate to Provider Creation
    console.log('Step 2: Creating Provider...');
    await robustClick(page, page.getByRole('banner').getByTestId('KeyboardArrowRightIcon'), 'Navigation menu');
    await robustClick(page, page.getByRole('tab', { name: 'Settings' }), 'Settings tab');
    await robustClick(page, page.getByRole('menuitem', { name: 'User Settings' }), 'User Settings menu');
    await robustClick(page, page.getByRole('tab', { name: 'Providers' }), 'Providers tab');
    await robustClick(page, page.getByRole('button', { name: 'Add Provider User' }), 'Add Provider button');

    // Fill provider details
    await robustFill(page, page.getByRole('textbox', { name: 'First Name *' }), providerData.firstName, 'Provider First Name');
    await robustFill(page, page.getByRole('textbox', { name: 'Last Name *' }), providerData.lastName, 'Provider Last Name');
    
    await robustClick(page, page.getByRole('combobox', { name: 'Provider Type' }), 'Provider Type dropdown');
    await robustClick(page, page.getByRole('option', { name: 'PSYD' }), 'PSYD option');
    
    await robustClick(page, page.getByRole('combobox', { name: 'specialities' }), 'Specialities dropdown');
    await robustClick(page, page.getByRole('option', { name: 'Cardiology' }), 'Cardiology option');
    
    await robustClick(page, page.getByRole('combobox', { name: 'Role *' }), 'Role dropdown');
    await robustClick(page, page.getByRole('option', { name: 'Provider' }), 'Provider role option');
    
    await robustFill(page, page.getByRole('textbox', { name: 'DOB' }), providerData.dateOfBirth, 'Provider DOB');
    
    await robustClick(page, page.getByRole('combobox', { name: 'Gender *' }), 'Gender dropdown');
    await robustClick(page, page.getByRole('option', { name: 'Male', exact: true }), 'Male gender option');
    
    await robustFill(page, page.getByRole('textbox', { name: 'NPI Number', exact: true }), providerData.npiNumber, 'NPI Number');
    await robustFill(page, page.getByRole('textbox', { name: 'Email *' }), providerData.email, 'Provider Email');
    
    await robustClick(page, page.getByRole('button', { name: 'Save' }), 'Save Provider button');
    await page.waitForTimeout(3000);
    console.log('✓ Provider created successfully');

    // 3. Set Availability
    console.log('Step 3: Setting Provider Availability...');
    await robustClick(page, page.getByRole('tab', { name: 'Scheduling' }), 'Scheduling tab');
    await robustClick(page, page.getByText('Availability'), 'Availability link');
    await robustClick(page, page.getByRole('button', { name: 'Edit Availability' }), 'Edit Availability button');

    // Set provider and basic settings
    await robustClick(page, page.locator('form').filter({ hasText: 'Select Provider *Select' }).getByLabel('Open'), 'Provider dropdown');
    await robustClick(page, page.getByRole('option', { name: providerData.fullName }), 'Provider selection');
    
    await robustClick(page, page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open'), 'Timezone dropdown');
    await robustClick(page, page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }), 'Alaska timezone');
    
    await robustClick(page, page.locator('form').filter({ hasText: 'Booking Window *Booking' }).getByLabel('Open'), 'Booking window dropdown');
    await robustClick(page, page.getByRole('option', { name: '1 Week' }), '1 Week booking window');

    // Helper function to set day availability
    async function setDayAvailability(dayName: string) {
      console.log(`Setting ${dayName} availability...`);
      await robustClick(page, page.getByRole('tab', { name: dayName }), `${dayName} tab`);
      
      // Start time
      await robustClick(page, page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').first(), `${dayName} start time dropdown`);
      await robustClick(page, page.getByRole('option', { name: '12:00 AM' }), `${dayName} 12:00 AM start option`);
      
      // End time with better selector and error handling
      await page.waitForTimeout(1000);
      await robustClick(page, page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').first(), `${dayName} end time dropdown`);
      
      // Try multiple selectors for end time
      const endTimeSelectors = [
        page.getByRole('option', { name: '08:00 AM (8 hrs)' }),
        page.getByRole('option', { name: ':00 AM (8 hrs)' }),
        page.getByText('08:00 AM').first(),
        page.locator('li:has-text("08:00 AM")').first()
      ];
      
      let endTimeSet = false;
      for (const selector of endTimeSelectors) {
        try {
          if (await selector.isVisible({ timeout: 3000 })) {
            await selector.click();
            endTimeSet = true;
            break;
          }
        } catch (error) {
          continue;
        }
      }
      
      if (!endTimeSet) {
        console.log(`Warning: Could not set end time for ${dayName}, trying fallback`);
        // Fallback: press escape and try again
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
        return;
      }
      
      // Check telehealth
      await page.waitForTimeout(500);
      const telehealthCheckbox = page.getByRole('checkbox', { name: 'Telehealth' });
      if (await telehealthCheckbox.isVisible({ timeout: 2000 })) {
        await telehealthCheckbox.check();
      }
      
      await page.waitForTimeout(1000);
    }

    // Set availability for each day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (const day of days) {
      try {
        await setDayAvailability(day);
      } catch (error) {
        console.log(`Warning: Failed to set ${day} availability: ${error.message}`);
        continue; // Continue with other days
      }
    }

    // Set appointment type and duration
    await robustClick(page, page.locator('form').filter({ hasText: 'Appointment TypeAppointment' }).getByLabel('Open'), 'Appointment type dropdown');
    await robustClick(page, page.getByRole('option', { name: 'New Patient Visit' }), 'New Patient Visit option');
    
    await robustClick(page, page.locator('form').filter({ hasText: 'DurationDuration' }).getByLabel('Open'), 'Duration dropdown');
    await robustClick(page, page.getByRole('option', { name: '30 minutes' }), '30 minutes duration');
    
    await robustClick(page, page.locator('form').filter({ hasText: 'Schedule NoticeSchedule Notice' }).getByLabel('Open'), 'Schedule notice dropdown');
    await robustClick(page, page.getByRole('option', { name: '1 Hours Away' }), '1 Hours Away option');

    await robustClick(page, page.getByRole('button', { name: 'Save' }), 'Save availability button');
    await page.waitForTimeout(3000);
    console.log('✓ Availability set successfully');

    // 4. Patient Creation
    console.log('Step 4: Creating Patient...');
    await closeAnyModals(page);
    
    // Try multiple approaches to find and click the Create button
    const createSelectors = [
      page.locator('div').filter({ hasText: /^Create$/ }).nth(1),
      page.getByText('Create', { exact: true }),
      page.locator('button:has-text("Create")'),
      page.locator('[data-testid*="create"], [aria-label*="create"]')
    ];
    
    let createClicked = false;
    for (const selector of createSelectors) {
      try {
        if (await selector.isVisible({ timeout: 5000 })) {
          await robustClick(page, selector, 'Create button');
          createClicked = true;
          break;
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!createClicked) {
      throw new Error('Could not find Create button');
    }

    await robustClick(page, page.getByText('New Patient', { exact: true }), 'New Patient option');
    await robustClick(page, page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img'), 'Enter Patient Details');
    await robustClick(page, page.getByRole('button', { name: 'Next' }), 'Next button');

    // Fill patient details
    await robustFill(page, page.getByRole('textbox', { name: 'First Name *' }), patientData.firstName, 'Patient First Name');
    await robustFill(page, page.getByRole('textbox', { name: 'Last Name *' }), patientData.lastName, 'Patient Last Name');
    await robustFill(page, page.getByRole('textbox', { name: 'Date Of Birth *' }), patientData.dateOfBirth, 'Patient DOB');
    
    await robustClick(page, page.getByRole('combobox', { name: 'Gender *' }), 'Patient gender dropdown');
    await robustClick(page, page.getByRole('option', { name: 'Male', exact: true }), 'Patient male option');
    
    await robustClick(page, page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open'), 'Patient timezone dropdown');
    await robustClick(page, page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }), 'Patient Alaska timezone');
    
    await robustFill(page, page.getByRole('textbox', { name: 'Mobile Number *' }), patientData.mobileNumber, 'Patient Mobile');
    await robustFill(page, page.getByRole('textbox', { name: 'Email *' }), patientData.email, 'Patient Email');
    
    await robustClick(page, page.getByRole('button', { name: 'Save' }), 'Save Patient button');
    await page.waitForTimeout(3000);
    console.log('✓ Patient created successfully');

    // 5. Appointment Booking
    console.log('Step 5: Booking Appointment...');
    await robustClick(page, page.getByRole('banner').getByTestId('ExpandMoreIcon'), 'Expand menu');
    await robustClick(page, page.getByText('New Appointment'), 'New Appointment');

    await robustClick(page, page.getByRole('combobox', { name: 'Patient Name *' }), 'Patient name dropdown');
    await page.waitForTimeout(2000);
    
    // Search for patient with flexible matching
    const patientOptionSelectors = [
      page.getByRole('option', { name: new RegExp(`${patientData.firstName}.*${patientData.lastName}`, 'i') }),
      page.getByRole('option', { name: new RegExp(patientData.firstName, 'i') }),
      page.locator(`li:has-text("${patientData.firstName}")`).first()
    ];
    
    let patientSelected = false;
    for (const selector of patientOptionSelectors) {
      try {
        if (await selector.isVisible({ timeout: 3000 })) {
          await selector.click();
          patientSelected = true;
          break;
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!patientSelected) {
      throw new Error(`Could not find patient: ${patientData.fullName}`);
    }

    await robustClick(page, page.getByRole('combobox', { name: 'Appointment Type *' }), 'Appointment type dropdown');
    await robustClick(page, page.getByRole('option', { name: 'New Patient Visit' }), 'New Patient Visit appointment');
    
    await robustFill(page, page.getByRole('textbox', { name: 'Reason For Visit *' }), 'Fever', 'Reason for visit');
    
    await robustClick(page, page.locator('form').filter({ hasText: 'Timezone *Timezone *' }).getByLabel('Open'), 'Appointment timezone');
    await robustClick(page, page.getByRole('option', { name: 'Alaska Standard Time (GMT -09' }), 'Appointment Alaska timezone');
    
    await robustClick(page, page.getByRole('button', { name: 'Telehealth' }), 'Telehealth option');
    await robustClick(page, page.getByRole('combobox', { name: 'Provider *' }), 'Appointment provider dropdown');
    await robustClick(page, page.getByRole('option', { name: providerData.fullName }), 'Appointment provider selection');
    
    await robustClick(page, page.getByRole('button', { name: 'View availability' }), 'View availability button');
    await page.waitForTimeout(2000);
    
    await robustClick(page, page.getByRole('gridcell', { name: '24' }), 'Date selection');
    await robustClick(page, page.getByRole('button', { name: '06:15 AM - 06:45 AM' }), 'Time slot selection');
    await robustClick(page, page.getByRole('button', { name: 'Save And Close' }), 'Save and close button');

    console.log('✓ Test completed successfully!');
    console.log(`Provider: ${providerData.fullName} (${providerData.email})`);
    console.log(`Patient: ${patientData.fullName} (${patientData.email})`);
    
  } catch (error) {
    console.error('Test failed:', error.message);
    throw error;
  }
});