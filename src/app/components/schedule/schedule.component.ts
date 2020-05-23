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
  viewTimetable: ThreeDimensionalArray<Lecture>;

  day: number;

  // Length collections
  dayNumbers: Array<number>;
  roomNumbers: Array<number>;
  slotNumbers: Array<number>;

  constructor(
    private server: ServerService,
    private poc: PopoverController,
    private sheetsService: SheetsService
  ) {
    // TODO: Generate HTML when page opens
    // [0...4]
    this.dayNumbers = Array(5)
      .fill(null)
      .map((x, i) => i);
    // [0...rooms.length - 1]
    this.roomNumbers = Array(this.rooms.length)
      .fill(null)
      .map((x, i) => i);
    // [0,1,2...7]
    this.slotNumbers = Array(8)
      .fill(null)
      .map((x, i) => i);
  }

  ngOnInit() {
    // Convert time table
    this.viewTimetable = new ThreeDimensionalArray(5, this.rooms.length, 8);
    this.convertLecturesToViewTimetable();
    // Monday by default
    this.day = 0;
  }

  convertLecturesToViewTimetable() {
    this.lectures.forEach(lecture => {
      lecture.assignedSlots.forEach(assignedSlot => {
        const roomIndex = this.rooms.findIndex(
          room => room.id === assignedSlot.roomId
        );
        this.viewTimetable.set(
          assignedSlot.day,
          roomIndex,
          assignedSlot.time,
          lecture
        );
      });
    });

    // Ensure entry for each day
    this.dayNumbers.forEach(dayNumber =>
      this.roomNumbers.forEach(roomNumber =>
        this.slotNumbers.forEach(slotNumber => {
          if (!this.viewTimetable.get(dayNumber, roomNumber, slotNumber))
            this.viewTimetable.set(
              dayNumber,
              roomNumber,
              slotNumber,
              new Lecture()
            );
        })
      )
    );
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
        viewTimetable: this.viewTimetable,
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
        timetable: this.viewTimetable.getArray(),
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
      return '#66FF33';
    } else if (batch + semester === currentYear - 1) {
      // Sophomore
      return '#FF66CC';
    } else if (batch + semester === currentYear - 2) {
      // Junior
      return '#00B0F0';
    } else {
      // Senior
      return '#F79646';
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
