import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class SheetsService {
  // Authentication State
  authState = new BehaviorSubject(false);

  constructor(private alertService: AlertService) {}

  // Initializes the library and shows a loading screen which ends after authentication
  async init() {
    // If already initialized
    if (this.authState.value) {
      console.log(gapi.auth.getToken()['status']['signed_in']);
      return;
    }
    // Load gapi client library
    gapi.load('client', this.loadSheetsLibrary.bind(this));

    // Waiting for authentication
    try {
      await this.alertService.load(
        'Waiting For Sheets Authentication',
        new Promise((resolve, reject) => {
          const authListener = this.authState.subscribe(authorized => {
            if (authorized) {
              authListener.unsubscribe();
              resolve();
            }
          }, reject);
        }),
        Infinity
      );
    } catch (error) {
      throw error;
    }
  }

  // Load sheets library
  loadSheetsLibrary() {
    gapi.client.load('sheets', 'v4', this.authenticate.bind(this));
  }

  // Authorization to use sheets
  authenticate() {
    gapi.auth.authorize(
      {
        client_id: environment.googleSheetsConfig.clientId,
        scope: environment.googleSheetsConfig.scope
      },
      this.handleAuthentication.bind(this)
    );
  }

  handleAuthentication(authResult: gapi.auth.GoogleApiOAuth2TokenObject) {
    if (authResult && !authResult.error) {
      this.authState.next(true);
    } else {
      /* handle authorization error */
      this.alertService.notice(authResult.error);
    }
  }

  async createSpreadsheet(templateSheet: gapi.client.sheets.Spreadsheet = {}) {
    if (templateSheet && templateSheet.spreadsheetId) {
      // Ensure unique id
      delete templateSheet.spreadsheetId;
    }
    const spreadSheetResponse = await this.spreadsheetApi.create({
      resource: templateSheet
    });
    return spreadSheetResponse.result;
  }

  async getSpreadsheet(sheetId: string) {
    const spreadsheetResponse = await this.spreadsheetApi.get({
      spreadsheetId: sheetId
    });
    return spreadsheetResponse.result;
  }

  // Applies the list of requests to the provided spreadsheet
  async updateSpreadsheet(
    spreadsheetId: string,
    requests: Array<gapi.client.sheets.Request>
  ) {
    return new Promise(async (resolve, reject) => {
      this.spreadsheetApi
        .batchUpdate({
          spreadsheetId,
          resource: {
            requests
          },
          fields: '*'
        })
        .then(resolve, reject);
    }).catch(console.log);
  }

  async updateSpreadsheetValues(
    spreadsheetId: string,
    request: gapi.client.sheets.BatchUpdateValuesRequest
  ) {
    return new Promise(async (resolve, reject) => {
      this.spreadsheetApi.values
        .batchUpdate({
          spreadsheetId,
          resource: request,
          fields: '*'
        })
        .then(resolve, reject);
    }).catch(console.log);
  }

  makeDeleteSheetRequest(sheetId: number) {
    return {
      deleteSheet: {
        sheetId
      }
    };
  }

  makeValueRange(
    range: string,
    value: any,
    sheetTitle?: string
  ): gapi.client.sheets.ValueRange {
    if (sheetTitle) {
      range = `'${sheetTitle}'!${range}`;
    }
    return {
      values: [[value]],
      range
    };
  }

  async copySheet(
    copyingFromId: string,
    toBeCopiedId: number,
    copyToId: string
  ) {
    const copySheetResponse = this.spreadsheetApi.sheets.copyTo({
      spreadsheetId: copyingFromId,
      sheetId: toBeCopiedId,
      resource: {
        destinationSpreadsheetId: copyToId
      }
    });
    return new Promise<gapi.client.sheets.SheetProperties>(
      (resolve, reject) => {
        copySheetResponse.then(sheet => {
          resolve(sheet.result);
        }, reject);
      }
    );
  }

  // Specific functions for sheet manipulation
  async updateTitlePage(
    department: string,
    semesterType: string,
    year: number,
    createdSheet: gapi.client.sheets.Spreadsheet,
    templateSheet: gapi.client.sheets.Spreadsheet,
    batches: Array<number>
  ) {
    // Title page
    const title = `${semesterType}-${year}`;
    const titleSheetProperties = await this.copySheet(
      templateSheet.spreadsheetId,
      templateSheet.sheets[0].properties.sheetId,
      createdSheet.spreadsheetId
    );
    titleSheetProperties.title = title;
    await this.updateSpreadsheet(createdSheet.spreadsheetId, [
      // Title of front page
      {
        updateSheetProperties: {
          properties: titleSheetProperties,
          fields: '*'
        }
      },
      // Delete default page
      this.makeDeleteSheetRequest(createdSheet.sheets[0].properties.sheetId)
    ]);
    // Update values
    // Issued and effective dates
    const issuedDate = new Date();
    const effectiveDate = new Date();
    let weekends = 0;
    if (effectiveDate.getDay() === 5) {
      weekends += 2;
    }
    effectiveDate.setDate(issuedDate.getDate() + 1 + weekends);
    // Update request
    await this.updateSpreadsheetValues(createdSheet.spreadsheetId, {
      valueInputOption: 'RAW',
      data: [
        this.makeValueRange(`H14:P14`, `Department of ${department}`, title),
        this.makeValueRange(
          `H16:P16`,
          `TIMETABLE for ${semesterType} ${year} Semester`,
          title
        ),
        this.makeValueRange(`K20`, `Batch ${batches[0]}`, title),
        this.makeValueRange(`K21`, `Batch ${batches[1]}`, title),
        this.makeValueRange(`K22`, `Batch ${batches[2]}`, title),
        this.makeValueRange(`K23`, `Batch ${batches[3]}`, title),
        this.makeValueRange(
          `E26:I26`,
          `${issuedDate.getDate()}/${issuedDate.getMonth() +
            1}/${issuedDate.getFullYear()}`,
          title
        ),
        this.makeValueRange(
          `E27:I27`,
          `${effectiveDate.getDate()}/${effectiveDate.getMonth() +
            1}/${effectiveDate.getFullYear()}`,
          title
        )
      ]
    });
    // Delete batch values which do not exist
    batches.forEach((batch, index) => {
      if (!batch) {
        this.updateSpreadsheetValues(createdSheet.spreadsheetId, {
          valueInputOption: 'RAW',
          data: [
            this.makeValueRange(`K2${index}`, '-', title),
            this.makeValueRange(`L2${index}`, '-', title)
          ]
        });
      }
    });
  }

  get spreadsheetApi() {
    return gapi.client.sheets.spreadsheets;
  }
}
