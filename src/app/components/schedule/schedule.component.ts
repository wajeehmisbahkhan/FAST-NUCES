import { Component, OnInit, Input } from '@angular/core';
import {
  TCSEntry,
  Room,
  Lecture,
  ThreeDimensionalArray
} from 'src/app/services/helper-classes';
import { ServerService } from 'src/app/services/server.service';
import { PopoverController } from '@ionic/angular';
import { PublishComponent } from '../publish/publish.component';
import { SwapperComponent } from '../swapper/swapper.component';
import { SheetsService } from 'src/app/services/sheets.service';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  // [Day+RoomId+Slots]
  @Input() lectures: Array<Lecture>;
  @Input() department: string;
  // [Day][RoomId][Slot]
  timetable: ThreeDimensionalArray<TCSEntry>;

  day: number;

  // Length collections
  slotNumbers: Array<number>;

  constructor(
    private server: ServerService,
    private poc: PopoverController,
    private sheetsService: SheetsService
  ) {
    this.slotNumbers = Array(8)
      .fill(null)
      .map((x, i) => i); // [0,1,2,3,4]
  }

  ngOnInit() {
    // Convert time table
    this.timetable = new ThreeDimensionalArray(5, this.rooms.length, 8);
    this.timetable.setArray(this.lectures, new TCSEntry());
    // Monday by default
    this.day = 0;

    // this.presentPublisher();
  }

  async presentSwapper(
    cell: TCSEntry,
    day: number,
    roomId: string,
    slot: number
  ) {
    const roomIndex = this.rooms.findIndex(room => room.id === roomId);
    const popover = await this.poc.create({
      component: SwapperComponent,
      componentProps: {
        cell,
        cellPosition: {
          day,
          roomIndex,
          slot
        },
        timetable: this.timetable,
        rooms: this.rooms
      }
    });
    return await popover.present();
  }

  setTable(event: any) {
    this.day = Number(event.detail.value);
  }

  async presentPublisher() {
    // Wait for google sheets to load
    await this.sheetsService.init();
    // Check for published timetable
    const publishedTimetable = this.published.find(
      timetable => timetable.department === this.department
    );
    // Rooms for publishing
    const roomNames = this.rooms.map(room => room.name);
    // Present popover
    const popover = await this.poc.create({
      component: PublishComponent,
      componentProps: {
        timetable: this.timetable.getArray(),
        department: this.department,
        publishedTimetable,
        roomNames
      },
      cssClass: 'popover-wider'
    });
    return await popover.present();
  }

  getColor(lecture: TCSEntry): string {
    if (!lecture || !lecture.courseId) return 'white';
    // Batch of any section
    const batch = this.getAtomicSectionById(lecture.atomicSectionIds[0]).batch;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    let semester: number;
    // If Jan-Jun - freshies will remain freshies
    if (currentMonth < 6) semester = 1;
    else semester = 0;
    if (batch + semester === currentYear) {
      // Freshies
      return '#63FD4B';
    } else if (batch + semester === currentYear - 1) {
      // Sophomore
      return '#FF60C9';
    } else if (batch + semester === currentYear - 2) {
      // Junior
      return '#23B0EE';
    } else {
      // Senior
      return '#F5954A';
    }
  }

  itemTracker(index: number, item: Room | TCSEntry) {
    if (item && item.id) return item.id;
    return index;
  }

  getTeacherById(id: string) {
    return this.teachers.find(teacher => teacher.id === id);
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  getAtomicSectionById(id: string) {
    return this.atomicSections.find(section => section.id === id);
  }

  get courses() {
    return this.server.courses;
  }

  get rooms() {
    return this.server.rooms;
  }

  get teachers() {
    return this.server.teachers;
  }

  get atomicSections() {
    return this.server.atomicSections;
  }

  get published() {
    return this.server.published;
  }
}
