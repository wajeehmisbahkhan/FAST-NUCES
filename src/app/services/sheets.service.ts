import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { AlertService } from './alert.service';
import { BatchCourse, Course, Cell, RoomSlots } from './helper-classes';

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

  async createSpreadsheet(
    templateSpreadsheet: gapi.client.sheets.Spreadsheet = {}
  ) {
    if (templateSpreadsheet && templateSpreadsheet.spreadsheetId) {
      // Ensure unique id
      delete templateSpreadsheet.spreadsheetId;
    }
    const spreadSheetResponse = await this.spreadsheetApi.create({
      resource: templateSpreadsheet
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

  async updateSheetValues(
    spreadsheetId: string,
    rangeValues: Array<
      [
        string, // Range
        any // Value
      ]
    >,
    sheetTitle?: string
  ) {
    return new Promise<
      gapi.client.Response<gapi.client.sheets.BatchUpdateValuesResponse>
    >((resolve, reject) => {
      const valueRanges: Array<gapi.client.sheets.ValueRange> = [];
      rangeValues.forEach(rangeValue => {
        valueRanges.push(
          this.makeValueRange(rangeValue[0], rangeValue[1], sheetTitle)
        );
      });
      this.spreadsheetApi.values
        .batchUpdate({
          spreadsheetId,
          resource: {
            valueInputOption: 'RAW',
            data: valueRanges
          },
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

  makeBatchRangeValues(
    rowNumber: number,
    serialNumber: number,
    batchCourse: BatchCourse,
    batchYear: number
  ): Array<[string, any]> {
    // Serial no
    return [
      [`B${rowNumber}`, serialNumber],
      // Course details
      [`C${rowNumber}`, batchCourse.course.courseCode],
      [`D${rowNumber}`, batchCourse.course.title],
      [`E${rowNumber}`, batchCourse.course.shortTitle],
      [`F${rowNumber}`, batchCourse.numberOfSections],
      [`G${rowNumber}`, batchCourse.course.creditHours],
      [`H${rowNumber}`, batchYear],
      // Teachers
      [`I${rowNumber}`, batchCourse.getInstructorSectionsText()]
    ];
  }

  makeDayRangeValues(
    rowNumber: number,
    roomName: string,
    slots: Array<Cell> // 8 slots
  ) {
    // Room name
    const dayRangeValues: Array<[string, any]> = [[`A${rowNumber}`, roomName]];
    // Slots
    let letter = 'B';
    slots.forEach(slot => {
      // Could be null
      if (slot)
        dayRangeValues.push([
          `${letter}${rowNumber}`,
          `${slot.courseName} - ${slot.sectionName}\n${slot.teacherNames}`
        ]);
      letter = String.fromCodePoint(letter.charCodeAt(0) + 1);
    });
    return dayRangeValues;
  }

  makeInsertRowsRequest(
    sheetId: number,
    rowStart: number,
    numberOfRows: number
  ) {
    // Ensure positive ending index
    const endIndex = rowStart + (numberOfRows >= 0 ? numberOfRows : 0);
    return {
      insertDimension: {
        range: {
          sheetId,
          dimension: 'ROWS',
          startIndex: rowStart,
          endIndex
        },
        inheritFromBefore: true
      }
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
  // Title Sheet
  async createTitleSheet(
    department: string,
    semesterType: string,
    year: number,
    batches: Array<number>,
    createdSpreadsheet: gapi.client.sheets.Spreadsheet,
    templateSpreadsheet: gapi.client.sheets.Spreadsheet
  ) {
    const title = `${semesterType}-${year}`;
    const titleSheetProperties = await this.copySheet(
      templateSpreadsheet.spreadsheetId,
      templateSpreadsheet.sheets[0].properties.sheetId,
      createdSpreadsheet.spreadsheetId
    );
    titleSheetProperties.title = title;
    await this.updateSpreadsheet(createdSpreadsheet.spreadsheetId, [
      // Title of front page
      {
        updateSheetProperties: {
          properties: titleSheetProperties,
          fields: '*'
        }
      },
      // Delete default page
      this.makeDeleteSheetRequest(
        createdSpreadsheet.sheets[0].properties.sheetId
      )
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
    await this.updateSheetValues(
      createdSpreadsheet.spreadsheetId,
      [
        ['H14:P14', `Department of ${department}`],
        ['H16:P16', `TIMETABLE for ${semesterType} ${year} Semester`],
        ['K20', `Batch ${batches[0]}`],
        ['K21', `Batch ${batches[1]}`],
        ['K22', `Batch ${batches[2]}`],
        ['K23', `Batch ${batches[3]}`],
        [
          'E26:I26',
          `${issuedDate.getDate()}/${issuedDate.getMonth() +
            1}/${issuedDate.getFullYear()}`
        ],
        [
          'E27:I27',
          `${effectiveDate.getDate()}/${effectiveDate.getMonth() +
            1}/${effectiveDate.getFullYear()}`
        ]
      ],
      title
    );
    // Delete batch values which do not exist
    batches.forEach((batch, index) => {
      if (!batch) {
        this.updateSheetValues(
          createdSpreadsheet.spreadsheetId,
          [
            [`K2${index}`, '-'],
            [`L2${index}`, '-']
          ],
          title
        );
      }
    });
  }

  // Batch Sheets
  async createBatchSheets(
    semesterType: string,
    year: number,
    batches: Array<number>,
    batchesCourses: Array<Array<BatchCourse>>,
    createdSpreadsheet: gapi.client.sheets.Spreadsheet,
    templateSpreadsheet: gapi.client.sheets.Spreadsheet
  ) {
    // Year titles
    const yearTitles = ['Freshmen', 'Sophomores', 'Juniors', 'Seniors'];
    // For each batch - starting with freshmen
    for (const [index, batch] of batches.entries()) {
      if (!batch) return;
      // Should be copied in order
      const batchSheetProperties = await this.copySheet(
        templateSpreadsheet.spreadsheetId,
        templateSpreadsheet.sheets[1 + index].properties.sheetId,
        createdSpreadsheet.spreadsheetId
      );
      // Can be filled asynchronously
      this.updateBatchSheet(
        semesterType,
        year,
        batch,
        yearTitles[index],
        batchesCourses[index],
        createdSpreadsheet,
        batchSheetProperties
      );
    }
  }

  async updateBatchSheet(
    semesterType: string,
    year: number,
    batch: number,
    yearTitle: string,
    batchCourses: Array<BatchCourse>,
    createdSpreadsheet: gapi.client.sheets.Spreadsheet,
    batchSheetProperties: gapi.client.sheets.SheetProperties
  ) {
    // First wait to update static stuff
    // Title
    batchSheetProperties.title = `BATCH ${batch}`;
    await this.updateSpreadsheet(createdSpreadsheet.spreadsheetId, [
      {
        updateSheetProperties: {
          properties: batchSheetProperties,
          fields: '*'
        }
      }
    ]);
    await this.updateSheetValues(
      createdSpreadsheet.spreadsheetId,
      [
        ['A3:A12', `${semesterType} SEMESTER ${year}`],
        ['B3:I3', `Offered Courses in ${semesterType} ${year}`],
        ['B4:I4', `Batch ${batch} (${yearTitle})`]
      ],
      batchSheetProperties.title
    );
    // Update dynamic stuff
    const coreCourses: Array<BatchCourse> = [],
      repeatCourses: Array<BatchCourse> = [],
      electiveCourses: Array<BatchCourse> = [];
    batchCourses.forEach(batchCourse => {
      if (batchCourse.course.isCoreCourse) {
        if (
          this.isRepeatCourse(
            batchCourse.course,
            batchCourses.map(batchCourse => batchCourse.course)
          )
        ) {
          repeatCourses.push(batchCourse);
        } else {
          coreCourses.push(batchCourse);
        }
      } else {
        electiveCourses.push(batchCourse);
      }
    });
    // Add rows first
    const coreRows = coreCourses.length === 0 ? 1 : coreCourses.length,
      electiveRows = electiveCourses.length === 0 ? 1 : electiveCourses.length;
    await this.updateSpreadsheet(createdSpreadsheet.spreadsheetId, [
      this.makeInsertRowsRequest(
        batchSheetProperties.sheetId,
        7,
        coreCourses.length - 1
      ),
      this.makeInsertRowsRequest(
        batchSheetProperties.sheetId,
        9 + coreRows - 1,
        electiveCourses.length - 1
      ),
      this.makeInsertRowsRequest(
        batchSheetProperties.sheetId,
        11 + coreRows + electiveRows - 2,
        repeatCourses.length - 1
      )
    ]);
    // Add values
    const rangeValues: Array<[string, any]> = [];
    coreCourses.forEach((coreCourse, index) =>
      rangeValues.push(
        ...this.makeBatchRangeValues(7 + index, index + 1, coreCourse, batch)
      )
    );
    electiveCourses.forEach((electiveCourse, index) =>
      rangeValues.push(
        ...this.makeBatchRangeValues(
          9 + coreRows - 1 + index,
          index + 1,
          electiveCourse,
          batch
        )
      )
    );
    repeatCourses.forEach((repeatCourse, index) =>
      rangeValues.push(
        ...this.makeBatchRangeValues(
          11 + coreRows + electiveRows - 2 + index,
          index + 1,
          repeatCourse,
          batch
        )
      )
    );
    await this.updateSheetValues(
      createdSpreadsheet.spreadsheetId,
      rangeValues,
      batchSheetProperties.title
    );
  }

  isRepeatCourse(course: Course, currentCourses: Array<Course>) {
    let isRepeat = false;
    for (const currentCourse of currentCourses) {
      // If a course is being taught which requires this course as its prerequisite
      if (currentCourse.prerequisiteIds.includes(course.id)) {
        isRepeat = true;
        break;
      }
    }
    return isRepeat;
  }

  // Course Pairing
  async createCoursePairingSheet(
    batches: Array<number>,
    coursesForBatches: Array<Array<Course>>,
    createdSpreadsheet: gapi.client.sheets.Spreadsheet,
    templateSpreadsheet: gapi.client.sheets.Spreadsheet
  ) {
    // Create and set title
    const title = `COURSE PAIRING INFO`;
    const coursePairingSheetProperties = await this.copySheet(
      templateSpreadsheet.spreadsheetId,
      templateSpreadsheet.sheets[5].properties.sheetId,
      createdSpreadsheet.spreadsheetId
    );
    coursePairingSheetProperties.title = title;
    await this.updateSpreadsheet(createdSpreadsheet.spreadsheetId, [
      // Title of page
      {
        updateSheetProperties: {
          properties: coursePairingSheetProperties,
          fields: '*'
        }
      }
    ]);
    // Heading for each year
    let headingIndex = 5;
    const yearTitles = ['Freshmen', 'Sophomores', 'Juniors', 'Seniors'];
    for (const [batchIndex, batch] of batches.entries()) {
      // Electives text
      const electivesText = coursesForBatches[batchIndex]
        .filter(courseForBatch => !courseForBatch.isCoreCourse)
        .map(course => course.title)
        .join(' OR ');
      await this.updateSheetValues(
        createdSpreadsheet.spreadsheetId,
        [
          [
            `C${headingIndex}:J${headingIndex + 1}`,
            `${yearTitles[batchIndex]} (BATCH-${batch}):`
          ],
          [`C${headingIndex + 3}:J${headingIndex + 4}`, electivesText]
        ],
        coursePairingSheetProperties.title
      );
      headingIndex += 7;
    }
    // Prerequisites
    const prerequisiteBatchesTexts: Array<Array<string>> = [[], [], [], []];
    coursesForBatches.forEach((coursesForBatch, batchIndex) => {
      coursesForBatch.forEach(course => {
        const successor = this.findSuccessor(course, coursesForBatch);
        if (successor) {
          prerequisiteBatchesTexts[batchIndex].push(
            `If ${course.title} is not clear, can't take ${successor.title}.`
          );
        }
      });
    });
    // Prerequisite rows
    let currentPrerequisiteRow = 10;
    const prerequisiteRangeValues: Array<[string, string]> = [];
    for (const prerequisiteTexts of prerequisiteBatchesTexts) {
      const numberOfRows =
        prerequisiteTexts.length > 1 ? prerequisiteTexts.length : 1;
      if (numberOfRows > 1)
        await this.updateSpreadsheet(createdSpreadsheet.spreadsheetId, [
          this.makeInsertRowsRequest(
            coursePairingSheetProperties.sheetId,
            currentPrerequisiteRow,
            prerequisiteTexts.length - 1
          )
          // {
          //   copyPaste: {
          //     source: {
          //       startRowIndex: currentPrerequisiteRow,
          //       endRowIndex: currentPrerequisiteRow + 1,
          //       sheetId: coursePairingSheetProperties.sheetId
          //     },
          //     destination: {
          //       startRowIndex: currentPrerequisiteRow + 1,
          //       endRowIndex: currentPrerequisiteRow + 2,
          //       sheetId: coursePairingSheetProperties.sheetId
          //     },
          //     pasteType: 'PASTE_FORMAT',
          //     pasteOrientation: 'NORMAL'
          //   }
          // }
        ]);
      // Fill requests
      let i = 0;
      do {
        if (prerequisiteTexts[i])
          prerequisiteRangeValues.push([
            `C${currentPrerequisiteRow}:J${currentPrerequisiteRow}`,
            prerequisiteTexts[i]
          ]);
        currentPrerequisiteRow += 1;
        i++;
      } while (i < prerequisiteTexts.length);
      // Next prerequisite box
      currentPrerequisiteRow += 6;
    }
    // Update values
    this.updateSheetValues(
      createdSpreadsheet.spreadsheetId,
      prerequisiteRangeValues,
      coursePairingSheetProperties.title
    );
  }

  findSuccessor(course: Course, currentCourses: Array<Course>): Course {
    let successor = null;
    for (const currentCourse of currentCourses) {
      // If a course is being taught which requires this course as its prerequisite
      if (currentCourse.prerequisiteIds.includes(course.id)) {
        successor = currentCourse;
        break;
      }
    }
    return successor;
  }

  // Days
  async createDaySheets(
    roomCells: Array<Array<RoomSlots>>,
    labCells: Array<Array<RoomSlots>>,
    createdSpreadsheet: gapi.client.sheets.Spreadsheet,
    templateSpreadsheet: gapi.client.sheets.Spreadsheet
  ) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    // For each day
    for (const [dayIndex, day] of days.entries()) {
      // Should be copied in order
      const daySheetProperties = await this.copySheet(
        templateSpreadsheet.spreadsheetId,
        templateSpreadsheet.sheets[6 + dayIndex].properties.sheetId,
        createdSpreadsheet.spreadsheetId
      );
      // Can be filled asynchronously
      this.updateDaySheet(
        day,
        roomCells[dayIndex],
        labCells[dayIndex],
        createdSpreadsheet,
        daySheetProperties
      );
    }
  }

  async updateDaySheet(
    day: string,
    roomCells: Array<RoomSlots>,
    labCells: Array<RoomSlots>,
    createdSpreadsheet: gapi.client.sheets.Spreadsheet,
    daySheetProperties: gapi.client.sheets.SheetProperties
  ) {
    // Update title
    daySheetProperties.title = day;
    await this.updateSpreadsheet(createdSpreadsheet.spreadsheetId, [
      {
        updateSheetProperties: {
          properties: daySheetProperties,
          fields: '*'
        }
      }
    ]);
    // Add room and lab rows
    let roomRows = 0,
      labRows = 0;
    for (const roomSlots of roomCells)
      if (!this.isEmptySlotRow(roomSlots.slots)) roomRows++;
    for (const labSlots of labCells)
      if (!this.isEmptySlotRow(labSlots.slots)) labRows++;
    roomRows = roomRows > 1 ? roomRows : 1;
    labRows = labRows > 1 ? labRows : 1;
    await this.updateSpreadsheet(createdSpreadsheet.spreadsheetId, [
      this.makeInsertRowsRequest(daySheetProperties.sheetId, 5, roomRows - 1),
      this.makeInsertRowsRequest(
        daySheetProperties.sheetId,
        6 + roomRows,
        labRows - 1
      )
    ]);
    // Update values
    let currentRow = 5;
    roomCells.forEach(roomCell => {
      if (this.isEmptySlotRow(roomCell.slots)) return;
      this.updateSheetValues(
        createdSpreadsheet.spreadsheetId,
        this.makeDayRangeValues(
          currentRow++,
          roomCell.roomName,
          roomCell.slots
        ),
        daySheetProperties.title
      );
    });
    currentRow = 6 + roomRows;
    labCells.forEach(labCell => {
      if (this.isEmptySlotRow(labCell.slots)) return;
      this.updateSheetValues(
        createdSpreadsheet.spreadsheetId,
        this.makeDayRangeValues(currentRow++, labCell.roomName, labCell.slots),
        daySheetProperties.title
      );
    });
    // Update colors
    // this.updateSpreadsheet(createdSpreadsheet.spreadsheetId, [{}]);
  }

  isEmptySlotRow(slots: Cell[]): boolean {
    let isEmpty = true;
    for (const slot of slots) {
      // If a slot exists
      if (slot) {
        isEmpty = false;
        break;
      }
    }
    return isEmpty;
  }

  get spreadsheetApi() {
    return gapi.client.sheets.spreadsheets;
  }
}
