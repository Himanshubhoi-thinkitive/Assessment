import { test, expect } from '@playwright/test';

// Simple data generation functions
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

// Generate provider data
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

// Generate patient data
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
  // Generate dynamic data
  const provider = generateProviderData();
  const patient = generatePatientData();
  
  console.log('Generated Provider:', provider);
  console.log('Generated Patient:', patient);

  // 1. Login to the application (EXACT COPY of your working code)
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('rose.gomez@jourrapide.com');
  await page.getByRole('textbox', { name: '*********' }).click();
  await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();

  // 2. Create Provider (EXACT COPY with dynamic data in .fill() only)
  await page.getByRole('banner').getByTestId('KeyboardArrowRightIcon').click();
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('menuitem', { name: 'User Settings' }).click();
  await page.getByRole('tab', { name: 'Providers' }).click();
  await page.getByRole('button', { name: 'Add Provider User' }).click();

  // Fill provider details - ONLY changed the .fill() values
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill(provider.firstName); // Changed
  await page.getByRole('paragraph').filter({ hasText: 'Last Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill(provider.lastName); // Changed
  await page.getByRole('combobox', { name: 'Provider Type' }).click();
  await page.getByRole('option', { name: 'PSYD' }).click();
  await page.getByRole('combobox', { name: 'specialities' }).click();
  await page.getByRole('option', { name: 'Cardiology' }).click();
  await page.getByRole('combobox', { name: 'Role *' }).click();
  await page.getByRole('option', { name: 'Provider' }).click();
  await page.getByRole('textbox', { name: 'DOB' }).click();
  await page.getByRole('textbox', { name: 'DOB' }).fill(provider.dateOfBirth); // Changed
  await page.getByRole('combobox', { name: 'Gender *' }).click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  await page.getByRole('textbox', { name: 'NPI Number', exact: true }).click();
  await page.getByRole('textbox', { name: 'NPI Number', exact: true }).fill(provider.npiNumber); // Changed
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill(provider.email); // Changed
  await page.getByRole('button', { name: 'Save' }).click();

  // 3. Set Availability (EXACT COPY with dynamic provider name)
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByText('Availability').click();
  await page.getByRole('button', { name: 'Edit Availability' }).click();

  // Set provider and basic settings
  await page.locator('form').filter({ hasText: 'Select Provider *Select' }).getByLabel('Open').click();
  await page.getByRole('option', { name: provider.fullName }).click(); // Changed
  await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
  await page.locator('form').filter({ hasText: 'Booking Window *Booking' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '1 Week' }).click();

  // Set Monday availability (EXACT COPY)
  await page.getByRole('tab', { name: 'Monday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Tuesday availability (EXACT COPY)
  await page.getByRole('tab', { name: 'Tuesday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Wednesday availability (EXACT COPY)
  await page.getByRole('tab', { name: 'Wednesday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Thursday availability (EXACT COPY)
  await page.getByRole('tab', { name: 'Thursday' }).click();
  await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Friday availability (EXACT COPY)
  await page.getByRole('tab', { name: 'Friday' }).click();
  await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set appointment type and duration settings (EXACT COPY)
  await page.locator('form').filter({ hasText: 'Appointment TypeAppointment' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.locator('form').filter({ hasText: 'DurationDuration' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '30 minutes' }).click();
  await page.locator('form').filter({ hasText: 'Schedule NoticeSchedule Notice' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '1 Hours Away' }).click();

  // Save availability settings (EXACT COPY)
  await page.getByRole('button', { name: 'Save' }).click();

  // 4. Patient Creation (EXACT COPY with dynamic data in .fill() only)
  await page.locator('div').filter({ hasText: /^Create$/ }).nth(1).click();
  await page.getByText('New Patient', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img').click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Fill patient details - ONLY changed the .fill() values
  await page.locator('form').filter({ hasText: 'Provider Group' }).getByLabel('Open').click();
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill(patient.firstName); // Changed
  await page.getByRole('textbox', { name: 'Last Name *' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill(patient.lastName); // Changed
  await page.getByRole('textbox', { name: 'Date Of Birth *' }).click();
  await page.getByRole('textbox', { name: 'Date Of Birth *' }).fill(patient.dateOfBirth); // Changed
  await page.getByRole('combobox', { name: 'Gender *' }).click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
  await page.getByRole('textbox', { name: 'Mobile Number *' }).click();
  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill(patient.mobileNumber); // Changed
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill(patient.email); // Changed
  await page.getByRole('button', { name: 'Save' }).click();

  // 5. Appointment Booking (EXACT COPY but need to handle dynamic patient name)
  await page.getByRole('banner').getByTestId('ExpandMoreIcon').click();
  await page.getByText('New Appointment').click();

  // Fill appointment details
  await page.getByRole('combobox', { name: 'Patient Name *' }).click();
  
  // Convert patient birth date to expected format (MM-DD-YYYY to "DD Mon")
  const birthParts = patient.dateOfBirth.split('-');
  const day = parseInt(birthParts[1], 10); // Remove leading zero
  const monthNum = parseInt(birthParts[0], 10);
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const expectedPatientName = `${patient.firstName} ${patient.lastName} ${day} ${monthNames[monthNum]}`;
  
  await page.getByRole('option', { name: expectedPatientName }).click(); // Changed to dynamic
  await page.getByRole('combobox', { name: 'Appointment Type *' }).click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).fill('Fever');
  await page.locator('form').filter({ hasText: 'Timezone *Timezone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (GMT -09' }).click();
  await page.getByRole('button', { name: 'Telehealth' }).click();

  // Select provider and schedule appointment
  await page.getByRole('combobox', { name: 'Provider *' }).click();
  await page.getByRole('option', { name: provider.fullName }).click(); // Changed
  await page.getByRole('button', { name: 'View availability' }).click({
    button: 'right'
  });
  await page.getByRole('button', { name: 'View availability' }).click();
  await page.getByRole('gridcell', { name: '24' }).click();
  await page.getByRole('button', { name: '06:15 AM - 06:45 AM' }).click();
  await page.getByRole('button', { name: 'Save And Close' }).click();

  // Log success
  console.log('🎉 Test completed successfully!');
  console.log(`✅ Provider: ${provider.fullName} (${provider.email})`);
  console.log(`✅ Patient: ${patient.fullName} (${patient.email})`);
  console.log(`✅ Expected patient name format: ${expectedPatientName}`);
});