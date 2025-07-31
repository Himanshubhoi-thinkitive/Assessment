import { test, expect } from '@playwright/test';

// Utility functions for generating random data
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

// Set test timeout
test.setTimeout(180000); // 3 minutes

test('Complete Healthcare Provider Workflow', async ({ page }) => {
  // Generate dynamic data
  const providerData = generateProviderData();
  const patientData = generatePatientData();
  
  console.log('Generated Provider Data:', providerData);
  console.log('Generated Patient Data:', patientData);

  try {
    // 1. Login to the application (using original working code)
    await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('rose.gomez@jourrapide.com');
    await page.getByRole('textbox', { name: '*********' }).click();
    await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
    await page.getByRole('button', { name: 'Let\'s get Started' }).click();
    
    // Wait for login to complete
    await page.waitForTimeout(5000);
    console.log('✅ Login completed');

    // 2. Create Provider - using original selectors with dynamic data
    await page.getByRole('banner').getByTestId('KeyboardArrowRightIcon').click();
    await page.getByRole('tab', { name: 'Settings' }).click();
    await page.getByRole('menuitem', { name: 'User Settings' }).click();
    await page.getByRole('tab', { name: 'Providers' }).click();
    await page.getByRole('button', { name: 'Add Provider User' }).click();

    // Fill provider details with generated data
    await page.getByRole('textbox', { name: 'First Name *' }).click();
    await page.getByRole('textbox', { name: 'First Name *' }).fill(providerData.firstName);
    await page.getByRole('paragraph').filter({ hasText: 'Last Name' }).click();
    await page.getByRole('textbox', { name: 'Last Name *' }).fill(providerData.lastName);
    await page.getByRole('combobox', { name: 'Provider Type' }).click();
    await page.getByRole('option', { name: 'PSYD' }).click();
    await page.getByRole('combobox', { name: 'specialities' }).click();
    await page.getByRole('option', { name: 'Cardiology' }).click();
    await page.getByRole('combobox', { name: 'Role *' }).click();
    await page.getByRole('option', { name: 'Provider' }).click();
    await page.getByRole('textbox', { name: 'DOB' }).click();
    await page.getByRole('textbox', { name: 'DOB' }).fill(providerData.dateOfBirth);
    await page.getByRole('combobox', { name: 'Gender *' }).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    await page.getByRole('textbox', { name: 'NPI Number', exact: true }).click();
    await page.getByRole('textbox', { name: 'NPI Number', exact: true }).fill(providerData.npiNumber);
    await page.getByRole('textbox', { name: 'Email *' }).click();
    await page.getByRole('textbox', { name: 'Email *' }).fill(providerData.email);
    await page.getByRole('button', { name: 'Save' }).click();
    
    await page.waitForTimeout(3000);
    console.log('✅ Provider created:', providerData.fullName);

    // 3. Set Availability - using original working selectors with dynamic provider name
    await page.getByRole('tab', { name: 'Scheduling' }).click();
    await page.getByText('Availability').click();
    await page.getByRole('button', { name: 'Edit Availability' }).click();

    // Set provider and basic settings - with error handling for duplicates
    await page.locator('form').filter({ hasText: 'Select Provider *Select' }).getByLabel('Open').click();
    
    // Handle potential duplicate provider names
    try {
      await page.getByRole('option', { name: providerData.fullName }).click();
    } catch (error) {
      // If strict mode violation, use first occurrence
      await page.getByRole('option', { name: providerData.fullName }).first().click();
    }
    
    await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
    await page.locator('form').filter({ hasText: 'Booking Window *Booking' }).getByLabel('Open').click();
    await page.getByRole('option', { name: '1 Week' }).click();

    // Set availability for all weekdays (using original working selectors)
    await page.getByRole('tab', { name: 'Monday' }).click();
    await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: '12:00 AM' }).click();
    await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
    await page.getByRole('checkbox', { name: 'Telehealth' }).check();

    await page.getByRole('tab', { name: 'Tuesday' }).click();
    await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: '12:00 AM' }).click();
    await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
    await page.getByRole('checkbox', { name: 'Telehealth' }).check();

    await page.getByRole('tab', { name: 'Wednesday' }).click();
    await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: '12:00 AM' }).click();
    await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
    await page.getByRole('checkbox', { name: 'Telehealth' }).check();

    await page.getByRole('tab', { name: 'Thursday' }).click();
    await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
    await page.getByRole('option', { name: '12:00 AM' }).click();
    await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
    await page.getByRole('checkbox', { name: 'Telehealth' }).check();

    await page.getByRole('tab', { name: 'Friday' }).click();
    await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
    await page.getByRole('option', { name: '12:00 AM' }).click();
    await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
    await page.getByRole('checkbox', { name: 'Telehealth' }).check();

    await page.locator('form').filter({ hasText: 'Appointment TypeAppointment' }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'New Patient Visit' }).click();
    await page.locator('form').filter({ hasText: 'DurationDuration' }).getByLabel('Open').click();
    await page.getByRole('option', { name: '30 minutes' }).click();
    await page.locator('form').filter({ hasText: 'Schedule NoticeSchedule Notice' }).getByLabel('Open').click();
    await page.getByRole('option', { name: '1 Hours Away' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    
    // CRITICAL: Handle the modal that appears after saving availability
    console.log('🔄 Handling post-save modal...');
    await page.waitForTimeout(2000); // Wait for modal to appear
    
    // Try to find and handle success/confirmation modal
    const modalHandlers = [
      // Try OK button
      async () => {
        const okBtn = page.getByRole('button', { name: 'OK' });
        if (await okBtn.isVisible({ timeout: 3000 })) {
          await okBtn.click();
          console.log('✅ Clicked OK button');
          return true;
        }
        return false;
      },
      
      // Try Continue button
      async () => {
        const continueBtn = page.getByRole('button', { name: 'Continue' });
        if (await continueBtn.isVisible({ timeout: 3000 })) {
          await continueBtn.click();
          console.log('✅ Clicked Continue button');
          return true;
        }
        return false;
      },
      
      // Try Close button in modal
      async () => {
        const modal = page.locator('[role="presentation"]').first();
        if (await modal.isVisible({ timeout: 3000 })) {
          const closeBtn = modal.locator('button[aria-label*="close"], button:has([data-testid="CloseIcon"])').first();
          if (await closeBtn.isVisible({ timeout: 2000 })) {
            await closeBtn.click();
            console.log('✅ Clicked modal close button');
            return true;
          }
        }
        return false;
      },
      
      // Try any button in modal that might dismiss it
      async () => {
        const modal = page.locator('[role="presentation"]').first();
        if (await modal.isVisible({ timeout: 3000 })) {
          const anyButton = modal.locator('button').first();
          if (await anyButton.isVisible({ timeout: 2000 })) {
            await anyButton.click();
            console.log('✅ Clicked first available button in modal');
            return true;
          }
        }
        return false;
      }
    ];
    
    // Try each handler
    let modalHandled = false;
    for (let i = 0; i < modalHandlers.length; i++) {
      try {
        modalHandled = await modalHandlers[i]();
        if (modalHandled) {
          break;
        }
      } catch (error) {
        console.log(`Modal handler ${i + 1} failed: ${error.message}`);
      }
    }
    
    // If no modal button worked, try escape
    if (!modalHandled) {
      console.log('No modal buttons found, trying escape...');
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }
    
    // Wait for modal to close
    await page.waitForTimeout(3000);
    console.log('✅ Availability set successfully');

    // 4. Patient Creation - simplified approach after proper modal handling
    console.log('Step 4: Creating patient...');
    
    // Verify no modals are blocking before proceeding
    const blockingModals = await page.locator('[role="presentation"], .MuiDialog-root').count();
    if (blockingModals > 0) {
      console.log(`⚠️ Found ${blockingModals} potential blocking modals, handling them...`);
      
      // One more round of modal cleanup
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
      
      // Try clicking outside any modal area
      await page.click('body', { position: { x: 100, y: 100 }, force: true });
      await page.waitForTimeout(1000);
    }
    
    // Now try the Create button with the original working selector
    try {
      console.log('Clicking Create button...');
      await page.locator('div').filter({ hasText: /^Create$/ }).nth(1).click({ timeout: 15000 });
      console.log('✅ Create button clicked successfully');
    } catch (error) {
      console.log('❌ Original selector failed, trying alternatives...');
      
      // Take debug screenshot
      await page.screenshot({ path: 'create-button-issue-debug.png', fullPage: true });
      
      // Try force click
      try {
        await page.locator('div').filter({ hasText: /^Create$/ }).nth(1).click({ force: true, timeout: 10000 });
        console.log('✅ Create button clicked with force');
      } catch (forceError) {
        // Try first occurrence instead of nth(1)
        await page.locator('div').filter({ hasText: /^Create$/ }).first().click({ force: true, timeout: 10000 });
        console.log('✅ Create button clicked using first() with force');
      }
    }
    await page.getByText('New Patient', { exact: true }).click();
    await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img').click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Fill patient details with generated data
    await page.locator('form').filter({ hasText: 'Provider Group' }).getByLabel('Open').click();
    await page.getByRole('textbox', { name: 'First Name *' }).click();
    await page.getByRole('textbox', { name: 'First Name *' }).fill(patientData.firstName);
    await page.getByRole('textbox', { name: 'Last Name *' }).click();
    await page.getByRole('textbox', { name: 'Last Name *' }).fill(patientData.lastName);
    await page.getByRole('textbox', { name: 'Date Of Birth *' }).click();
    await page.getByRole('textbox', { name: 'Date Of Birth *' }).fill(patientData.dateOfBirth);
    await page.getByRole('combobox', { name: 'Gender *' }).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click();
    await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
    await page.getByRole('textbox', { name: 'Mobile Number *' }).click();
    await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(patientData.mobileNumber);
    await page.getByRole('textbox', { name: 'Email *' }).click();
    await page.getByRole('textbox', { name: 'Email *' }).fill(patientData.email);
    await page.getByRole('button', { name: 'Save' }).click();
    
    await page.waitForTimeout(3000);
    console.log('✅ Patient created:', patientData.fullName);

    // 5. Appointment Booking - using original selectors with dynamic names
    await page.getByRole('banner').getByTestId('ExpandMoreIcon').click();
    await page.getByText('New Appointment').click();

    await page.getByRole('combobox', { name: 'Patient Name *' }).click();
    
    // Enhanced patient selection to handle dynamic names
    await page.waitForTimeout(2000);
    
    // Create a search pattern for the patient (FirstName LastName + birth info)
    const patientSearchPatterns = [
      `${patientData.firstName} ${patientData.lastName}`,
      patientData.firstName,
      new RegExp(`${patientData.firstName}.*${patientData.lastName}`, 'i')
    ];
    
    let patientSelected = false;
    for (const pattern of patientSearchPatterns) {
      try {
        if (typeof pattern === 'string') {
          const option = page.getByRole('option', { name: pattern });
          if (await option.isVisible({ timeout: 3000 })) {
            await option.first().click(); // Use first() in case of duplicates
            patientSelected = true;
            break;
          }
        } else {
          // RegExp pattern
          const option = page.getByRole('option', { name: pattern });
          if (await option.first().isVisible({ timeout: 3000 })) {
            await option.first().click();
            patientSelected = true;
            break;
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    if (!patientSelected) {
      throw new Error(`Could not find patient: ${patientData.fullName}`);
    }

    await page.getByRole('combobox', { name: 'Appointment Type *' }).click();
    await page.getByRole('option', { name: 'New Patient Visit' }).click();
    await page.getByRole('textbox', { name: 'Reason For Visit *' }).click();
    await page.getByRole('textbox', { name: 'Reason For Visit *' }).fill('Fever');
    await page.locator('form').filter({ hasText: 'Timezone *Timezone *' }).getByLabel('Open').click();
    await page.getByRole('option', { name: 'Alaska Standard Time (GMT -09' }).click();
    await page.getByRole('button', { name: 'Telehealth' }).click();

    await page.getByRole('combobox', { name: 'Provider *' }).click();
    
    // Handle provider selection with potential duplicates
    try {
      await page.getByRole('option', { name: providerData.fullName }).click();
    } catch (error) {
      await page.getByRole('option', { name: providerData.fullName }).first().click();
    }
    
    await page.getByRole('button', { name: 'View availability' }).click({
      button: 'right'
    });
    await page.getByRole('button', { name: 'View availability' }).click();
    await page.getByRole('gridcell', { name: '24' }).click();
    await page.getByRole('button', { name: '06:15 AM - 06:45 AM' }).click();
    await page.getByRole('button', { name: 'Save And Close' }).click();

    console.log('🎉 Test completed successfully!');
    console.log(`✅ Provider: ${providerData.fullName} (${providerData.email})`);
    console.log(`✅ Patient: ${patientData.fullName} (${patientData.email})`);
    console.log(`✅ Appointment scheduled successfully`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'test-failure-debug.png', fullPage: true });
    throw error;
  }
});