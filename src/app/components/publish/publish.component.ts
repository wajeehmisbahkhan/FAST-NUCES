import { Component, OnInit, Input } from '@angular/core';
import {
  PublishedTimetable,
  Cell,
  Lecture,
  BatchCourse,
  RoomSlots
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
  @Input() timetable: Array<Lecture>; // To be uploaded
  @Input() roomNames: Array<string>;
  @Input() department: string;
  @Input() publishedTimetable: PublishedTimetable;
  // Generated
  cells: Array<Cell>;

  // Page switcher
  creatingNew: boolean;
  publishedSpreadsheet: gapi.client.sheets.Spreadsheet;
  // Form
  semesterType: 'Spring' | 'Summer' | 'Fall';
  year: number;

  // Template schedule
  templateSpreadsheetId = '1sq55sYHHZfuLxgjxAp8if-rwMeesjMqzR_P8ffh7rdw';
  templateSpreadsheet: gapi.client.sheets.Spreadsheet;

  // Created sheet - global for ease
  createdSpreadsheet: gapi.client.sheets.Spreadsheet;

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
      this.publishedSpreadsheet = await this.sheetsService.getSpreadsheet(
        this.publishedTimetable.sheetId
      );
    }
    // Template sheet is public and can be accessed even without authorization
    this.templateSpreadsheet = await this.sheetsService.getSpreadsheet(
      this.templateSpreadsheetId
    );
    // Generate cells for publishing
    // Create cells for publishing since multidimensional arrays are not allowed in firestore
    this.cells = [];
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
          this.cells.push(
            new Cell(section.batch, course.shortTitle, entry.name, teacherNames)
          );
          return;
        }
      }
      // If empty cell
      this.cells.push(null);
    });
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
    const newTimetable = new PublishedTimetable(
      spreadsheetId,
      this.department,
      this.semesterType,
      this.year,
      this.roomNames
    );
    // TODO: Uncomment
    // newTimetable.timetable = this.cells;
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
    this.createdSpreadsheet = {
      properties: this.templateSpreadsheet.properties
    };
    // Generate custom title
    this.createdSpreadsheet.properties.title = `${this.department}-${this.semesterType}-${this.year}`;
    // Make it online
    this.createdSpreadsheet = await this.sheetsService.createSpreadsheet(
      this.createdSpreadsheet
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
    const inPlaceBatches = []; // We need [2016, null, 2018, 2019]
    let freshmenYear = new Date().getFullYear();
    if (this.semesterType !== 'Fall') freshmenYear -= 1;
    for (let i = freshmenYear - 3; i <= freshmenYear; i++) {
      if (batches.includes(i)) {
        inPlaceBatches.unshift(i);
      } else {
        inPlaceBatches.unshift(null);
      }
    }
    // Entries & Courses for each batch
    // [[2016 batchCourses], [null], [2018 batchCourses], [2019 batchCourses]]
    const batchesCourses: Array<Array<BatchCourse>> = [[], [], [], []];
    this.getCoursesForDepartment(this.department).forEach(course => {
      // Get all entries for this course
      const courseEntries = this.entries.filter(
        entry => entry.courseId === course.id
      );
      // Add course
      const batchCourse = new BatchCourse(course);
      let batchIndex = null;
      // Find batch
      if (courseEntries.length > 0) {
        const atomicSection = this.getAtomicSectionById(
          courseEntries[0].atomicSectionIds[0]
        );
        if (atomicSection && atomicSection.batch) {
          // Where to place
          batchIndex = inPlaceBatches.findIndex(
            batch => batch === atomicSection.batch
          );
        }
      }
      // Add course details for each entry according to batch
      courseEntries.forEach(entry => {
        if (batchesCourses[batchIndex]) {
          // Add instructor sections
          const teacher = this.getTeacherById(entry.teacherIds[0]);
          batchCourse.addInstructorSection(
            teacher ? teacher.name : '',
            entry.name
          );
        }
      });
      // Push batchCourse
      if (batchesCourses[batchIndex])
        batchesCourses[batchIndex].push(batchCourse);
    });
    // 1D cells 3D room
    const roomCells: Array<Array<RoomSlots>> = [[], [], [], [], []]; // 5 days
    let cellIndex = 0;
    // Rooms
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
      this.roomNames.forEach((roomName, roomIndex) => {
        roomCells[dayIndex].push({
          roomName,
          slots: []
        });
        // Push 8 slots from the 1d array
        for (let slotIndex = 0; slotIndex < 8; slotIndex++) {
          roomCells[dayIndex][roomIndex].slots.push(this.cells[cellIndex++]);
        }
      });
    }
    // Remove from rooms and add to labs
    const labCells: Array<Array<RoomSlots>> = [[], [], [], [], []]; // 5 days
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
      let roomIndex = 0;
      while (roomIndex < roomCells[dayIndex].length) {
        const roomName = roomCells[dayIndex][roomIndex].roomName.toLowerCase();
        if (roomName.includes('lab') || roomName.includes('llc')) {
          // Add to labCells
          labCells[dayIndex].push(
            JSON.parse(JSON.stringify(roomCells[dayIndex][roomIndex]))
          );
          // Remove from roomCells
          roomCells[dayIndex].splice(roomIndex, 1);
        } else {
          roomIndex++;
        }
      }
    }
    // Update new sheet according to generated timetable
    await this.sheetsService.createTitleSheet(
      this.department,
      this.semesterType,
      this.year,
      inPlaceBatches,
      this.createdSpreadsheet,
      this.templateSpreadsheet
    );
    await this.sheetsService.createBatchSheets(
      this.semesterType,
      this.year,
      inPlaceBatches,
      batchesCourses,
      this.createdSpreadsheet,
      this.templateSpreadsheet
    );
    await this.sheetsService.createCoursePairingSheet(
      batches,
      batchesCourses.map(batchCourse =>
        batchCourse.map(course => course.course)
      ),
      this.createdSpreadsheet,
      this.templateSpreadsheet
    );
    await this.sheetsService.createDaySheets(
      roomCells,
      labCells,
      this.createdSpreadsheet,
      this.templateSpreadsheet
    );
    // Return id
    return this.createdSpreadsheet.spreadsheetId;
  }

  isPublished() {
    return (
      this.publishedTimetable &&
      this.publishedTimetable.helperData.semesterType === this.semesterType &&
      this.publishedTimetable.helperData.year === this.year
    );
  }

  // Getters
  getCoursesForDepartment(department: string) {
    return this.courses.filter(course => course.department === department);
  }

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

  get entries() {
    return this.server.entries;
  }
}
