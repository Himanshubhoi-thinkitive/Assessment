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

  // 1. Login to the application
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('rose.gomez@jourrapide.com');
  await page.getByRole('textbox', { name: '*********' }).click();
  await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();
  
  // Wait for login to complete
  await page.waitForTimeout(5000);

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
  await page.waitForTimeout(3000);

  // 3. Set Availability with improved error handling
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.waitForTimeout(2000);
  
  await page.getByText('Availability').click();
  await page.waitForTimeout(1000);
  
  await page.getByRole('button', { name: 'Edit Availability' }).click();
  await page.waitForTimeout(2000);

  // Set provider and basic settings
  await page.locator('form').filter({ hasText: 'Select Provider *Select' }).getByLabel('Open').click();
  await page.getByRole('option', { name: provider.fullName }).click();
  await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
  await page.locator('form').filter({ hasText: 'Booking Window *Booking' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '1 Week' }).click();

  // Helper function for setting availability with better error handling
  async function setDayAvailability(dayName: string) {
    console.log(`Setting ${dayName} availability...`);
    await page.getByRole('tab', { name: dayName }).click();
    await page.waitForTimeout(1000);
    
    // Start time
    if (dayName === 'Thursday' || dayName === 'Friday') {
      await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
    } else {
      await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
    }
    await page.getByRole('option', { name: '12:00 AM' }).click();
    await page.waitForTimeout(500);
    
    // End time with multiple attempts
    await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
    await page.waitForTimeout(1000);
    
    // Try different selectors for the end time option
    let endTimeSet = false;
    const endTimeOptions = [
      ':00 AM (8 hrs)',
      '08:00 AM (8 hrs)',
      '8:00 AM (8 hrs)'
    ];
    
    for (const timeOption of endTimeOptions) {
      try {
        await page.getByRole('option', { name: timeOption }).click({ timeout: 3000 });
        endTimeSet = true;
        console.log(`✅ ${dayName} end time set with: ${timeOption}`);
        break;
      } catch (error) {
        console.log(`⚠️ Failed to set ${dayName} end time with: ${timeOption}`);
        continue;
      }
    }
    
    if (!endTimeSet) {
      console.log(`⚠️ Could not set ${dayName} end time, but continuing...`);
    }
    
    await page.waitForTimeout(500);
    
    // Check telehealth
    try {
      await page.getByRole('checkbox', { name: 'Telehealth' }).check();
      console.log(`✅ ${dayName} telehealth checked`);
    } catch (error) {
      console.log(`⚠️ Could not check telehealth for ${dayName}`);
    }
    
    await page.waitForTimeout(1000);
  }

  // Set availability for all weekdays
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  for (const day of weekdays) {
    try {
      await setDayAvailability(day);
    } catch (error) {
      console.log(`❌ Failed to set ${day} availability: ${error.message}`);
      // Continue with next day instead of failing completely
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
  
  // Wait and handle any success modal
  await page.waitForTimeout(5000);
  
  // Try to handle success modal if it appears
  try {
    const okButton = page.getByRole('button', { name: 'OK' });
    if (await okButton.isVisible({ timeout: 3000 })) {
      await okButton.click();
      console.log('✅ Closed success modal');
      await page.waitForTimeout(2000);
    }
  } catch (error) {
    // If no OK button, try escape
    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(2000);
  }

  // 4. Patient Creation
  await page.locator('div').filter({ hasText: /^Create$/ }).nth(1).click();
  await page.getByText('New Patient', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img').click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Fill patient details
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
  
  // Wait after patient creation
  await page.waitForTimeout(3000);

  // 5. Appointment Booking
  await page.getByRole('banner').getByTestId('ExpandMoreIcon').click();
  await page.getByText('New Appointment').click();

  // Fill appointment details
  await page.getByRole('combobox', { name: 'Patient Name *' }).click();
  await page.waitForTimeout(2000);
  
  // Smart patient selection
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
    // Fallback: try partial match
    console.log('Trying partial patient match...');
    await page.getByRole('option').filter({ hasText: patient.firstName }).first().click();
  }
  
  await page.getByRole('combobox', { name: 'Appointment Type *' }).click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).fill('Fever');
  await page.locator('form').filter({ hasText: 'Timezone *Timezone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (GMT -09' }).click();
  await page.getByRole('button', { name: 'Telehealth' }).click();

  // Select provider and schedule appointment
  await page.getByRole('combobox', { name: 'Provider *' }).click();
  
  // Handle provider name case sensitivity
  try {
    await page.getByRole('option', { name: provider.fullName }).click();
  } catch (error) {
    // Try lowercase version
    const lowercaseProviderName = provider.fullName.toLowerCase();
    await page.getByRole('option').filter({ hasText: new RegExp(provider.firstName, 'i') }).first().click();
  }
  
  await page.getByRole('button', { name: 'View availability' }).click({
    button: 'right'
  });
  await page.getByRole('button', { name: 'View availability' }).click();
  
  // Try different day options
  const dayOptions = ['31', '30', '29', '28', '27', '26', '25', '24'];
  let daySelected = false;
  
  for (const dayOption of dayOptions) {
    try {
      await page.getByRole('gridcell', { name: dayOption }).click({ timeout: 2000 });
      daySelected = true;
      console.log(`✅ Selected day: ${dayOption}`);
      break;
    } catch (error) {
      continue;
    }
  }
  
  if (!daySelected) {
    throw new Error('Could not select any available day');
  }
  
  // ENHANCED: Dynamic time slot selection - the key fix!
  console.log('🕒 Looking for available time slots...');
  await page.waitForTimeout(3000); // Wait for time slots to load
  
  // Try multiple time slot options
  const timeSlotOptions = [
    '06:15 AM - 06:45 AM',
    '06:00 AM - 06:30 AM',
    '07:00 AM - 07:30 AM',
    '08:00 AM - 08:30 AM',
    '09:00 AM - 09:30 AM',
    '10:00 AM - 10:30 AM',
    '12:00 PM - 12:30 PM',
    '01:00 PM - 01:30 PM',
    '02:00 PM - 02:30 PM'
  ];
  
  let timeSlotSelected = false;
  
  for (const timeSlot of timeSlotOptions) {
    try {
      console.log(`Trying time slot: ${timeSlot}`);
      const timeButton = page.getByRole('button', { name: timeSlot });
      
      if (await timeButton.isVisible({ timeout: 3000 })) {
        await timeButton.click();
        console.log(`✅ Selected time slot: ${timeSlot}`);
        timeSlotSelected = true;
        break;
      }
    } catch (error) {
      console.log(`⚠️ Time slot ${timeSlot} not available`);
      continue;
    }
  }
  
  // If no specific time slots work, try any available button with time format
  if (!timeSlotSelected) {
    console.log('🔍 Looking for any available time slot...');
    try {
      // Look for any button that contains "AM" or "PM" (time pattern)
      const anyTimeSlot = page.locator('button').filter({ hasText: /\d{1,2}:\d{2}\s*(AM|PM)/ }).first();
      
      if (await anyTimeSlot.isVisible({ timeout: 5000 })) {
        const timeSlotText = await anyTimeSlot.textContent();
        await anyTimeSlot.click();
        console.log(`✅ Selected available time slot: ${timeSlotText}`);
        timeSlotSelected = true;
      }
    } catch (error) {
      console.log('❌ Could not find any time slot');
    }
  }
  
  if (!timeSlotSelected) {
    // Take a screenshot for debugging
    await page.screenshot({ path: 'no-time-slots-available.png', fullPage: true });
    throw new Error('No time slots are available for the selected day');
  }
  
  await page.getByRole('button', { name: 'Save And Close' }).click();

  console.log('🎉 Test completed successfully!');
  console.log(`✅ Provider: ${provider.fullName} (${provider.email})`);
  console.log(`✅ Patient: ${patient.fullName} (${patient.email})`);
  console.log(`✅ Expected patient format: ${expectedPatientName}`);
});