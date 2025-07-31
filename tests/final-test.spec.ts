import { test, expect } from '@playwright/test';

test('Complete Healthcare Provider Workflow', async ({ page }) => {
  // 1. Login to the application
  await page.goto('https://stage_aithinkitive.uat.provider.ecarehealth.com/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('rose.gomez@jourrapide.com');
  await page.getByRole('textbox', { name: '*********' }).click();
  await page.getByRole('textbox', { name: '*********' }).fill('Pass@123');
  await page.getByRole('button', { name: 'Let\'s get Started' }).click();

  // 2. Create Provider - Navigate to User Settings and add a new provider
  await page.getByRole('banner').getByTestId('KeyboardArrowRightIcon').click();
  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByRole('menuitem', { name: 'User Settings' }).click();
  await page.getByRole('tab', { name: 'Providers' }).click();
  await page.getByRole('button', { name: 'Add Provider User' }).click();

  // Fill provider details
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill('Goal');
  await page.getByRole('paragraph').filter({ hasText: 'Last Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('Sol');
  await page.getByRole('combobox', { name: 'Provider Type' }).click();
  await page.getByRole('option', { name: 'PSYD' }).click();
  await page.getByRole('combobox', { name: 'specialities' }).click();
  await page.getByRole('option', { name: 'Cardiology' }).click();
  await page.getByRole('combobox', { name: 'Role *' }).click();
  await page.getByRole('option', { name: 'Provider' }).click();
  await page.getByRole('textbox', { name: 'DOB' }).click();
  await page.getByRole('textbox', { name: 'DOB' }).fill('02-20-2001');
  await page.getByRole('combobox', { name: 'Gender *' }).click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  await page.getByRole('textbox', { name: 'NPI Number', exact: true }).click();
  await page.getByRole('textbox', { name: 'NPI Number', exact: true }).fill('2325648783');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('goal.sol@mailor.com');
  await page.getByRole('button', { name: 'Save' }).click();

  // 3. Set Availability - Navigate to Scheduling and set up availability
  await page.getByRole('tab', { name: 'Scheduling' }).click();
  await page.getByText('Availability').click();
  await page.getByRole('button', { name: 'Edit Availability' }).click();

  // Set provider and basic settings
  await page.locator('form').filter({ hasText: 'Select Provider *Select' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Goal Sol' }).click();
  await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
  await page.locator('form').filter({ hasText: 'Booking Window *Booking' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '1 Week' }).click();

  // Set Monday availability
  await page.getByRole('tab', { name: 'Monday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Tuesday availability
  await page.getByRole('tab', { name: 'Tuesday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Wednesday availability
  await page.getByRole('tab', { name: 'Wednesday' }).click();
  await page.locator('form').filter({ hasText: 'Start Time *Start Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Thursday availability
  await page.getByRole('tab', { name: 'Thursday' }).click();
  await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
  await page.getByRole('checkbox', { name: 'Telehealth' }).check();

  // Set Friday availability
  await page.getByRole('tab', { name: 'Friday' }).click();
  await page.locator('div').filter({ hasText: /^Start Time \*$/ }).nth(1).click();
  await page.getByRole('option', { name: '12:00 AM' }).click();
  await page.locator('form').filter({ hasText: 'End Time *End Time *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: ':00 AM (8 hrs)' }).click();
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

  // 4. Patient Creation - Create a new patient
  await page.locator('div').filter({ hasText: /^Create$/ }).nth(1).click();
  await page.getByText('New Patient', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^Enter Patient Details$/ }).getByRole('img').click();
  await page.getByRole('button', { name: 'Next' }).click();

  // Fill patient details
  await page.locator('form').filter({ hasText: 'Provider Group' }).getByLabel('Open').click();
  await page.getByRole('textbox', { name: 'First Name *' }).click();
  await page.getByRole('textbox', { name: 'First Name *' }).fill('Shubhq');
  await page.getByRole('textbox', { name: 'Last Name *' }).click();
  await page.getByRole('textbox', { name: 'Last Name *' }).fill('Sing');
  await page.getByRole('textbox', { name: 'Date Of Birth *' }).click();
  await page.getByRole('textbox', { name: 'Date Of Birth *' }).fill('02-03-2002');
  await page.getByRole('combobox', { name: 'Gender *' }).click();
  await page.getByRole('option', { name: 'Male', exact: true }).click();
  await page.locator('form').filter({ hasText: 'Time Zone *Time Zone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (UTC -9)' }).click();
  await page.getByRole('textbox', { name: 'Mobile Number *' }).click();
  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('(786) 543-5799');
  await page.getByRole('textbox', { name: 'Email *' }).click();
  await page.getByRole('textbox', { name: 'Email *' }).fill('Shubhq.sing@mailor.com');
  await page.getByRole('button', { name: 'Save' }).click();

  // 5. Appointment Booking - Create a new appointment for the patient
  await page.getByRole('banner').getByTestId('ExpandMoreIcon').click();
  await page.getByText('New Appointment').click();

  // Fill appointment details
  await page.getByRole('combobox', { name: 'Patient Name *' }).click();
  await page.getByRole('option', { name: 'Shubhq Sing 3 Feb' }).click();
  await page.getByRole('combobox', { name: 'Appointment Type *' }).click();
  await page.getByRole('option', { name: 'New Patient Visit' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).click();
  await page.getByRole('textbox', { name: 'Reason For Visit *' }).fill('Fever');
  await page.locator('form').filter({ hasText: 'Timezone *Timezone *' }).getByLabel('Open').click();
  await page.getByRole('option', { name: 'Alaska Standard Time (GMT -09' }).click();
  await page.getByRole('button', { name: 'Telehealth' }).click();

  // Select provider and schedule appointment
  await page.getByRole('combobox', { name: 'Provider *' }).click();
  await page.getByRole('option', { name: 'Goal sol' }).click();
  await page.getByRole('button', { name: 'View availability' }).click({
    button: 'right'
  });
  await page.getByRole('button', { name: 'View availability' }).click();
  await page.getByRole('gridcell', { name: '31' }).click();
  await page.getByRole('button', { name: '06:15 AM - 06:45 AM' }).click();
  await page.getByRole('button', { name: 'Save And Close' }).click();
});