/**
 * Test Data Configuration
 * Contains all test data used across the test suite
 */

export const TestData = {
  // Valid login credentials
  validCredentials: {
    username: 'tomsmith',
    password: 'SuperSecretPassword!'
  },

  // Invalid credentials for negative testing
  invalidCredentials: {
    invalidUsername: {
      username: 'invaliduser',
      password: 'SuperSecretPassword!'
    },
    invalidPassword: {
      username: 'tomsmith',
      password: 'wrongpassword'
    },
    bothInvalid: {
      username: 'invaliduser',
      password: 'wrongpassword'
    },
    emptyUsername: {
      username: '',
      password: 'SuperSecretPassword!'
    },
    emptyPassword: {
      username: 'tomsmith',
      password: ''
    },
    bothEmpty: {
      username: '',
      password: ''
    }
  },

  // Expected messages
  expectedMessages: {
    loginSuccess: 'You logged into a secure area!',
    loginFailureInvalidUsername: 'Your username is invalid!',
    loginFailureInvalidPassword: 'Your password is invalid!',
    logoutSuccess: 'You logged out of the secure area!'
  },

  // Page URLs
  urls: {
    loginPage: '/login',
    securePage: '/secure'
  },

  // Timeouts (in milliseconds)
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000
  }
};

/**
 * Browser configuration data
 */
export const BrowserConfig = {
  defaultViewport: {
    width: 1280,
    height: 720
  },
  mobileViewport: {
    width: 375,
    height: 812
  }
};

/**
 * Test environment configuration
 */
export const Environment = {
  baseUrl: 'https://the-internet.herokuapp.com',
  testEnvironment: process.env.TEST_ENV || 'staging'
};
