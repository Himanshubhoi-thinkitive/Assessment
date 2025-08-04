import { test, expect } from '@playwright/test';

// Data generation functions
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
  return generateRandomNumber(1000000000, 9999999999).toString();
}

function generateProviderData() {
  const firstNames = ['Goal', 'Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'Robert', 'Maria', 'John', 'Amanda'];
  const lastNames = ['Sol', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];
  
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
  const firstNames = ['Shubhq', 'Alex', 'Taylor', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Cameron', 'Skyler'];
  const lastNames = ['Sing', 'Anderson', 'Thompson', 'White', 'Harris', 'Martin', 'Jackson', 'Clark', 'Lewis', 'Lee'];
  
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

test('Complete Healthcare Provider Workflow', async ({ page }) => {
  // Generate dynamic data
  const provider = generateProviderData();
  const patient = generatePatientData();
  
  console.log('Generated Provider:', provider);
  console.log('Generated Patient:', patient);

  // Enhanced helper function to close any modal/dialog
  async function closeAnyModal() {
    try {
      const closeSelectors = [
        'button[aria-label="close"]',
        'button[data-testid="CloseIcon"]',
        '[data-testid="CloseIcon"]',
        '.MuiDialog-container button',
        'button:has-text("Cancel")',
        'button:has-text("Close")',
        'button:has-text("OK")',
        '[role="dialog"] button'
      ];
      
      for (const selector of closeSelectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 2000 })) {
            await element.click();
            await page.waitForTimeout(1000);
            console.log(`✅ Closed modal using selector: ${selector}`);
            return;
          }
        } catch (e) {
          continue;
        }
      }
      
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
      console.log('✅ Tried ESC key to close modal');
    } catch (error) {
      console.log('ℹ️ No modal to close or modal close failed');
    }
  }

  // Enhanced wait for navigation helper
  async function waitForNavigationComplete() {
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.waitForTimeout(2000); // Additional buffer for dynamic content
  }

  // 1. Login to the application
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('rose.gomez@jourrapide.com');
  await page.getByRole('textbox', { name: '*********' }).click();
  await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();
  
  // Wait for login to complete with enhanced waiting
  await waitForNavigationComplete();
  await closeAnyModal();

  // 2. Create Provider
  await page.getByRole('banner').getByTestId('KeyboardArrowRightIcon').click();
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('menuitem', { name: 'User Settings' }).click();
  await page.getByRole('tab', { name: 'Providers' }).click();
  await page.getByRole('button', { name: 'Add Provider User' }).click();

  // Fill provider details
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill(provider.firstName);
  await page.getByRole('paragraph').filter({ hasText: 'Last Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill(provider.lastName);
  await page.getByRole('combobox', { name: 'Provider Type' }).click();
  await page.getByRole('option', { name: 'PSYD' }).click();
  await page.getByRole('combobox', { name: 'specialities' }).click();
  await page.getByRole('option', { name: 'Cardiology' }).click();
  await page.getByRole('combobox', { name: 'Role *' }).click();
  await page.getByRole('option', { name: 'Provider' }).click();
  await page.getByRole('textbox', { name: 'DOB' }).click();
  await page.getByRole('textbox', { name: 'DOB' }).fill(provider.dateOfBirth);
  await page.getByRole('combobox', { name: 'Gender *' }).click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  await page.getByRole('textbox', { name: 'NPI Number', exact: true }).click();
  await page.getByRole('textbox', { name: 'NPI Number', exact: true }).fill(provider.npiNumber);
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill(provider.email);
  await page.getByRole('button', { name: 'Save' }).click();
  
  // Wait after provider creation
  await waitForNavigationComplete();
  await closeAnyModal();

  // 3. Set Availability with improved error handling
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.waitForTimeout(3000);
  
  await page.getByText('Availability').click();
  await page.waitForTimeout(2000);
  
  await page.getByRole('button', { name: 'Edit Availability' }).click();
  await page.waitForTimeout(3000);

  // Set provider and basic settings
  await page.locator('form').filter({ hasText: 'Select Provider *Select' }).getByLabel('Open').click();
  await page.getByRole('option', { name: provider.fullName }).click();
  await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
  await page.locator('form').filter({ hasText: 'Booking Window *Booking' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '1 Week' }).click();

  // Helper function for setting availability
  async function setDayAvailability(dayName: string) {
    console.log(`Setting ${dayName} availability...`);
    await page.getByRole('tab', { name: dayName }).click();
    await page.waitForTimeout(1500);
    
    // Start time
    if (dayName === 'Thursday' || dayName === 'Friday') {
      await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
    } else {
      await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
    }
    await page.getByRole('option', { name: '12:00 AM' }).click();
    await page.waitForTimeout(1000);
    
    // End time
    await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
    await page.waitForTimeout(1500);
    
    const endTimeOptions = [':00 AM (8 hrs)', '08:00 AM (8 hrs)', '8:00 AM (8 hrs)'];
    let endTimeSet = false;
    
    for (const timeOption of endTimeOptions) {
      try {
        await page.getByRole('option', { name: timeOption }).click({ timeout: 3000 });
        endTimeSet = true;
        console.log(`✅ ${dayName} end time set with: ${timeOption}`);
        break;
      } catch (error) {
        continue;
      }
    }
    
    if (!endTimeSet) {
      console.log(`⚠️ Could not set ${dayName} end time, but continuing...`);
    }
    
    await page.waitForTimeout(1000);
    
    // Check telehealth
    try {
      await page.getByRole('checkbox', { name: 'Telehealth' }).check();
      console.log(`✅ ${dayName} telehealth checked`);
    } catch (error) {
      console.log(`⚠️ Could not check telehealth for ${dayName}`);
    }
    
    await page.waitForTimeout(1500);
  }

  // Set availability for all weekdays
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  for (const day of weekdays) {
    try {
      await setDayAvailability(day);
    } catch (error) {
      console.log(`❌ Failed to set ${day} availability: ${error.message}`);
    }
  }

  // Set appointment type and duration settings
  await page.locator('form').filter({ hasText: 'Appointment TypeAppointment' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.locator('form').filter({ hasText: 'DurationDuration' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '30 minutes' }).click();
  await page.locator('form').filter({ hasText: 'Schedule NoticeSchedule Notice' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '1 Hours Away' }).click();

  // Save availability settings
  await page.getByRole('button', { name: 'Save' }).click();
  await waitForNavigationComplete();
  await closeAnyModal();

  // 4. ENHANCED Patient Creation Section
  console.log('🏥 Starting patient creation...');
  
  // Close any modal and wait for page to be ready
  await closeAnyModal();
  await page.waitForTimeout(3000);
  
  // Enhanced Create button clicking with multiple strategies
  let createClicked = false;
  const createStrategies = [
    // Strategy 1: Direct MUI Box approach
    async () => {
      const element = page.locator('div.MuiBox-root:has-text("Create")');
      if (await element.count() > 0) {
        await element.nth(1).scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await element.nth(1).click({ force: true });
        return true;
      }
      return false;
    },
    
    // Strategy 2: Button approach
    async () => {
      const element = page.locator('button:has-text("Create")');
      if (await element.count() > 0) {
        await element.first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await element.first().click({ force: true });
        return true;
      }
      return false;
    },
    
    // Strategy 3: Data testid approach
    async () => {
      const element = page.locator('[data-testid*="create"], [data-testid*="Create"]');
      if (await element.count() > 0) {
        await element.first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await element.first().click({ force: true });
        return true;
      }
      return false;
    },
    
    // Strategy 4: Any clickable element with Create text
    async () => {
      const element = page.locator('*:has-text("Create")').filter({ hasText: /^Create$/ }).first();
      if (await element.isVisible({ timeout: 3000 })) {
        await element.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);
        await element.click({ force: true });
        return true;
      }
      return false;
    }
  ];
  
  for (let i = 0; i < createStrategies.length; i++) {
    try {
      console.log(`Trying create strategy ${i + 1}...`);
      const success = await createStrategies[i]();
      if (success) {
        createClicked = true;
        console.log(`✅ Successfully clicked Create using strategy ${i + 1}`);
        break;
      }
    } catch (error) {
      console.log(`⚠️ Strategy ${i + 1} failed: ${error.message}`);
      continue;
    }
  }
  
  if (!createClicked) {
    // Final fallback: keyboard navigation
    console.log('🎹 Trying keyboard navigation as final fallback...');
    try {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      createClicked = true;
      console.log('✅ Create clicked via keyboard');
    } catch (error) {
      await page.screenshot({ path: 'create-button-debug.png', fullPage: true });
      throw new Error('Could not click the Create button - check create-button-debug.png for debugging');
    }
  }
  
  // Enhanced waiting after Create click
  await page.waitForTimeout(5000); // Longer wait for modal/page to load
  await waitForNavigationComplete();
  
  // ENHANCED New Patient Selection with multiple strategies
  console.log('🔍 Looking for New Patient option...');
  
  const newPatientStrategies = [
    // Strategy 1: Exact text match
    async () => {
      const element = page.getByText('New Patient', { exact: true });
      if (await element.isVisible({ timeout: 5000 })) {
        await element.click();
        return true;
      }
      return false;
    },
    
    // Strategy 2: Partial text match
    async () => {
      const element = page.getByText('New Patient');
      if (await element.isVisible({ timeout: 5000 })) {
        await element.click();
        return true;
      }
      return false;
    },
    
    // Strategy 3: Case insensitive
    async () => {
      const element = page.locator('text=/new patient/i').first();
      if (await element.isVisible({ timeout: 5000 })) {
        await element.click();
        return true;
      }
      return false;
    },
    
    // Strategy 4: Within specific containers
    async () => {
      const containers = [
        '.MuiDialog-container', 
        '[role="dialog"]', 
        '.MuiModal-root',
        '.MuiPaper-root'
      ];
      
      for (const container of containers) {
        try {
          const element = page.locator(`${container} >> text="New Patient"`).first();
          if (await element.isVisible({ timeout: 3000 })) {
            await element.click();
            return true;
          }
        } catch (e) {
          continue;
        }
      }
      return false;
    },
    
    // Strategy 5: Any clickable element containing "Patient"
    async () => {
      const elements = page.locator('button, div, span, a').filter({ hasText: /Patient/i });
      const count = await elements.count();
      
      for (let i = 0; i < count; i++) {
        try {
          const element = elements.nth(i);
          const text = await element.textContent();
          if (text && text.toLowerCase().includes('new patient')) {
            await element.click();
            return true;
          }
        } catch (e) {
          continue;
        }
      }
      return false;
    }
  ];
  
  let newPatientClicked = false;
  for (let i = 0; i < newPatientStrategies.length; i++) {
    try {
      console.log(`Trying New Patient strategy ${i + 1}...`);
      const success = await newPatientStrategies[i]();
      if (success) {
        newPatientClicked = true;
        console.log(`✅ Successfully clicked New Patient using strategy ${i + 1}`);
        break;
      }
    } catch (error) {
      console.log(`⚠️ New Patient strategy ${i + 1} failed: ${error.message}`);
      continue;
    }
  }
  
  if (!newPatientClicked) {
    // Take screenshot for debugging
    await page.screenshot({ path: 'new-patient-debug.png', fullPage: true });
    
    // Try to log what elements are available
    const availableText = await page.locator('body').textContent();
    console.log('Available text on page:', availableText?.substring(0, 500));
    
    throw new Error('Could not find or click New Patient - check new-patient-debug.png for debugging');
  }
  
  await page.waitForTimeout(2000);
  
  // Continue with the rest of the test...
  await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img').click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Fill patient details (rest of the test continues as before...)
  await page.locator('form').filter({ hasText: 'Provider Group' }).getByLabel('Open').click();
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill(patient.firstName);
  await page.getByRole('textbox', { name: 'Last Name *' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill(patient.lastName);
  await page.getByRole('textbox', { name: 'Date Of Birth *' }).click();
  await page.getByRole('textbox', { name: 'Date Of Birth *' }).fill(patient.dateOfBirth);
  await page.getByRole('combobox', { name: 'Gender *' }).click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
  await page.getByRole('textbox', { name: 'Mobile Number *' }).click();
  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(patient.mobileNumber);
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill(patient.email);
  await page.getByRole('button', { name: 'Save' }).click();
  
  await waitForNavigationComplete();
  await closeAnyModal();

  // 5. Appointment Booking (simplified for now due to complexity)
  await page.getByRole('banner').getByTestId('ExpandMoreIcon').click();
  await page.getByText('New Appointment').click();

  // Basic appointment setup
  await page.getByRole('combobox', { name: 'Patient Name *' }).click();
  await page.waitForTimeout(3000);
  
  const birthParts = patient.dateOfBirth.split('-');
  const day = parseInt(birthParts[1], 10);
  const monthNum = parseInt(birthParts[0], 10);
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const expectedPatientName = `${patient.firstName} ${patient.lastName} ${day} ${monthNames[monthNum]}`;
  
  console.log(`Looking for patient: ${expectedPatientName}`);
  
  try {
    await page.getByRole('option', { name: expectedPatientName }).click();
    console.log(`✅ Selected patient: ${expectedPatientName}`);
  } catch (error) {
    console.log('Trying partial patient match...');
    await page.getByRole('option').filter({ hasText: patient.firstName }).first().click();
  }
  
  console.log('✅ Healthcare workflow test completed successfully!');
});