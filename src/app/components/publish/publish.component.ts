import { Component, OnInit, Input } from '@angular/core';
import {
  PublishedTimetable,
  Cell,
  TCSEntry,
  ThreeDimensionalArray
} from 'src/app/services/helper-classes';
import { ServerService } from 'src/app/services/server.service';
import { AlertService } from 'src/app/services/alert.service';
import { PopoverController } from '@ionic/angular';
import { SheetsService } from 'src/app/services/sheets.service';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {
  // Inputs
  @Input() timetable: Array<TCSEntry>;
  @Input() roomNames: Array<string>;
  @Input() department: string;
  @Input() publishedTimetable: PublishedTimetable;

  // Page switcher
  creatingNew: boolean;
  publishedSheet: gapi.client.sheets.Spreadsheet;
  // Form
  semesterType: 'Spring' | 'Summer' | 'Fall';
  year: number;

  // Template schedule
  templateSheetId = '1sq55sYHHZfuLxgjxAp8if-rwMeesjMqzR_P8ffh7rdw';
  templateSheet: gapi.client.sheets.Spreadsheet;

  // Created sheet - global for ease
  createdSheet: gapi.client.sheets.Spreadsheet;

  constructor(
    private server: ServerService,
    private poc: PopoverController,
    private alertService: AlertService,
    private sheetsService: SheetsService
  ) {
    // Default values
    this.creatingNew = true;
    const date = new Date();
    this.year = date.getFullYear();
    this.semesterType =
      date.getMonth() < 5 ? 'Spring' : date.getMonth() < 7 ? 'Summer' : 'Fall';
  }

  async ngOnInit() {
    // Load published sheet if already published
    if (this.publishedTimetable) {
      this.publishedSheet = await this.sheetsService.getSpreadsheet(
        this.publishedTimetable.sheetId
      );
    }
    // Template sheet is public and can be accessed even without authorization
    this.templateSheet = await this.sheetsService.getSpreadsheet(
      this.templateSheetId
    );
  }

  setCreation(event: any) {
    if (event.detail.value === 'true') this.creatingNew = true;
    else this.creatingNew = false;
  }

  async publishTimetable() {
    // Delete old PublishedTimetable object
    if (this.publishedTimetable) {
      await this.server.deleteObject('published', this.publishedTimetable.id);
    }
    let spreadsheetId: string;
    // Create spreadsheet
    try {
      spreadsheetId = (await this.alertService.load(
        'Publishing timetable. This may take a few minutes...',
        this.createNewTimetable(),
        Infinity
      )) as string;
    } catch (error) {
      console.log(error);
      this.alertService.error(error);
      return;
    }
    // Create PublishedTimetable object
    // Create cells for publishing since multidimensional arrays are not allowed in firestore
    const newTimetable = new PublishedTimetable(
      spreadsheetId,
      this.department,
      this.semesterType,
      this.year,
      this.roomNames
    );
    const cells: Array<Cell> = [];
    this.timetable.forEach(entry => {
      // If defined
      if (entry && entry.atomicSectionIds) {
        const section = this.getAtomicSectionById(entry.atomicSectionIds[0]);
        const course = this.getCourseById(entry.courseId);
        const teacherNames: Array<string> = [];
        entry.teacherIds.forEach(teacherId =>
          teacherNames.push(this.getTeacherById(teacherId).name)
        );
        if (course && section) {
          cells.push(
            new Cell(section.batch, course.shortTitle, entry.name, teacherNames)
          );
          return;
        }
      }
      // If empty cell
      cells.push(null);
    });
    // TODO: Uncomment
    // newTimetable.timetable = cells;
    // Update published timetables
    // await this.server.addObject('published', newTimetable);
    await this.alertService.notice(
      `Timetable Published! Open Google Sheets and update the view access
      to FAST-NU once you've finalized the document.`
    );
    await this.poc.dismiss();
  }

  async deleteTimetable() {
    await this.alertService.confirmation(
      'Are you sure you want to delete the current timetable?',
      async () => {
        await this.server.deleteObject('published', this.publishedTimetable.id);
        this.poc.dismiss();
      }
    );
  }

  async updateTimetable() {}

  async createNewTimetable() {
    // Create a new spreadsheet using the template
    this.createdSheet = {
      properties: this.templateSheet.properties
    };
    // Generate custom title
    this.createdSheet.properties.title = `${this.department}-${this.semesterType}-${this.year}`;
    // Make it online
    this.createdSheet = await this.sheetsService.createSpreadsheet(
      this.createdSheet
    );
    // Data needed for new sheet
    // Freshmen-Senior Year
    const batches: Array<number> = [];
    this.timetable.forEach(entry => {
      if (entry && entry.atomicSectionIds) {
        try {
          const { batch } = this.getAtomicSectionById(
            entry.atomicSectionIds[0]
          );
          if (!batches.includes(batch)) {
            batches.push(batch);
          }
        } catch (error) {}
      }
    });
    // Ensure in order
    const inPlaceBatches = [];
    let freshmenYear = new Date().getFullYear();
    if (this.semesterType !== 'Fall') freshmenYear -= 1;
    for (let i = freshmenYear - 3; i <= freshmenYear; i++) {
      if (batches.includes(i)) {
        inPlaceBatches.unshift(i);
      } else {
        inPlaceBatches.unshift(null);
      }
    }
    // Update new sheet according to generated timetable
    await this.sheetsService.updateTitlePage(
      this.department,
      this.semesterType,
      this.year,
      this.createdSheet,
      this.templateSheet,
      inPlaceBatches
    );
    // Batch sheets
    // const batches = this
    // Create sheets
    // for(let i = 0; i < batches)

    // Course pairing sheet

    // Day sheets

    // Make the created spreadsheet online - we only need the spreadsheetId

    // Return id
    return this.createdSheet.spreadsheetId;
  }

  isPublished() {
    return (
      this.publishedTimetable &&
      this.publishedTimetable.helperData.semesterType === this.semesterType &&
      this.publishedTimetable.helperData.year === this.year
    );
  }

  // Getters
  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  getTeacherById(id: string) {
    return this.teachers.find(teacher => teacher.id === id);
  }

  getAtomicSectionById(id: string) {
    return this.atomicSections.find(section => section.id === id);
  }

  get courses() {
    return this.server.courses;
  }

  get teachers() {
    return this.server.teachers;
  }

  get atomicSections() {
    return this.server.atomicSections;
  }
}
