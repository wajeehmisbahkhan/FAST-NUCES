/*
  This is the template environment with dummy API keys.
  Create an environment.prod.ts and environment.ts files using your own API keys
  With production set to true or false
*/
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: '<your-key>',
    authDomain: '<your-project-authdomain>',
    databaseURL: '<your-database-URL>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>',
    appId: '<your-app-id>'
  },
  googleSheetsConfig: {
    apiKey: '<your-key>',
    clientId: '<your-client-id>',
    // Array of API discovery doc URLs for APIs used by the quickstart
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    // See, edit, create, and delete your spreadsheets in Google Drive
    scope: 'https://www.googleapis.com/auth/spreadsheets'
  }
};
