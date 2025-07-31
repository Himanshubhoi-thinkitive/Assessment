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
  return generateRandomNumber(1000000000, 9999999999).toString();
}

function generateProviderData() {
  const firstNames = ['Danny', 'Sarah', 'Michael', 'Jennifer', 'David', 'Lisa', 'Robert', 'Maria', 'John', 'Amanda'];
  const lastNames = ['Defy', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];
  
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
  const firstNames = ['Shubh', 'Alex', 'Taylor', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Cameron', 'Skyler'];
  const lastNames = ['Singu', 'Anderson', 'Thompson', 'White', 'Harris', 'Martin', 'Jackson', 'Clark', 'Lewis', 'Lee'];
  
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
  // Generate dynamic data for this test run
  const providerData = generateProviderData();
  const patientData = generatePatientData();
  
  console.log('🎭 Generated Provider Data:', providerData);
  console.log('👤 Generated Patient Data:', patientData);

  // 1. Login to the application
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('rose.gomez@jourrapide.com');
  await page.getByRole('textbox', { name: '*********' }).click();
  await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();

  // 2. Create Provider
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

  // 3. Set Availability
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByText('Availability').click();
  await page.getByRole('button', { name: 'Edit Availability' }).click();

  // Set provider and basic settings
  await page.locator('form').filter({ hasText: 'Select Provider *Select' }).getByLabel('Open').click();
  await page.getByRole('option', { name: providerData.fullName }).first().click(); // Use .first() to handle duplicates
  await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
  await page.locator('form').filter({ hasText: 'Booking Window *Booking' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '1 Week' }).click();

  // Set Monday availability - simplified
  await page.getByRole('tab', { name: 'Monday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  try {
    await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click({ timeout: 5000 });
  } catch {
    await page.getByRole('option', { name: '08:00 AM (8 hrs)' }).click();
  }
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Tuesday availability - simplified
  await page.getByRole('tab', { name: 'Tuesday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  try {
    await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click({ timeout: 5000 });
  } catch {
    await page.getByRole('option', { name: '08:00 AM (8 hrs)' }).click();
  }
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Wednesday availability - simplified
  await page.getByRole('tab', { name: 'Wednesday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  try {
    await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click({ timeout: 5000 });
  } catch {
    await page.getByRole('option', { name: '08:00 AM (8 hrs)' }).click();
  }
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Thursday availability - simplified
  await page.getByRole('tab', { name: 'Thursday' }).click();
  await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  try {
    await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click({ timeout: 5000 });
  } catch {
    await page.getByRole('option', { name: '08:00 AM (8 hrs)' }).click();
  }
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Friday availability - simplified
  await page.getByRole('tab', { name: 'Friday' }).click();
  await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  try {
    await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click({ timeout: 5000 });
  } catch {
    await page.getByRole('option', { name: '08:00 AM (8 hrs)' }).click();
  }
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set appointment type and duration settings
  await page.locator('form').filter({ hasText: 'Appointment TypeAppointment' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.locator('form').filter({ hasText: 'DurationDuration' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '30 minutes' }).click();
  await page.locator('form').filter({ hasText: 'Schedule NoticeSchedule Notice' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '1 Hours Away' }).click();

  // Save availability settings
  await page.getByRole('button', { name: 'Save' }).click();
  
  // CRITICAL: Handle the modal that appears after saving
  await page.waitForTimeout(3000); // Wait for modal to appear
  
  // Try to handle success modal
  try {
    const okButton = page.getByRole('button', { name: 'OK' });
    if (await okButton.isVisible({ timeout: 3000 })) {
      await okButton.click();
      console.log('✅ Clicked OK to close success modal');
    }
  } catch (e1) {
    try {
      const closeButton = page.locator('[role="presentation"] button[aria-label*="close"]').first();
      if (await closeButton.isVisible({ timeout: 2000 })) {
        await closeButton.click();
        console.log('✅ Clicked close button to close modal');
      }
    } catch (e2) {
      // Final fallback: multiple escapes
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      console.log('✅ Used Escape to close modal');
    }
  }
  
  // Wait for modal to fully close
  await page.waitForTimeout(2000);

  // 4. Patient Creation - YOUR EXACT WORKING CODE
  await page.locator('div').filter({ hasText: /^Create$/ }).nth(1).click();
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

  // 5. Appointment Booking
  await page.getByRole('banner').getByTestId('ExpandMoreIcon').click();
  await page.getByText('New Appointment').click();

  // Fill appointment details with smart patient selection
  await page.getByRole('combobox', { name: 'Patient Name *' }).click();
  
  // Smart patient selection using birth date pattern
  const patientBirthDate = patientData.dateOfBirth.split('-');
  const birthDay = parseInt(patientBirthDate[1], 10);
  const birthMonth = parseInt(patientBirthDate[0], 10);
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const expectedPattern = `${patientData.firstName} ${patientData.lastName} ${birthDay} ${monthNames[birthMonth]}`;
  
  try {
    await page.getByRole('option', { name: expectedPattern }).click();
    console.log(`✅ Selected patient: ${expectedPattern}`);
  } catch (error) {
    // Fallback to partial match
    await page.getByRole('option').filter({ hasText: patientData.firstName }).first().click();
    console.log(`✅ Selected patient using partial match: ${patientData.firstName}`);
  }

  await page.getByRole('combobox', { name: 'Appointment Type *' }).click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).fill('Fever');
  await page.locator('form').filter({ hasText: 'Timezone *Timezone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (GMT -09' }).click();
  await page.getByRole('button', { name: 'Telehealth' }).click();

  // Select provider for appointment
  await page.getByRole('combobox', { name: 'Provider *' }).click();
  await page.getByRole('option', { name: providerData.fullName }).first().click(); // Use .first() for duplicates
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
});