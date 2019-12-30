import { Component, OnInit, Input } from '@angular/core';
import { TCSEntry, Room, Lecture } from 'src/app/services/helper-classes';
import { ServerService } from 'src/app/services/server.service';
import { PopoverController } from '@ionic/angular';
import { PublishComponent } from '../publish/publish.component';
import { SwapperComponent } from '../swapper/swapper.component';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  // [Day+RoomId+Slots]
  @Input() lectures: Array<Lecture>;
  // [Day][RoomId][Slot]
  timetable: Array<Array<Array<TCSEntry>>>;
  table: Array<Array<TCSEntry>>;

  day: number;

  constructor(private server: ServerService, private poc: PopoverController) {}

  ngOnInit() {
    // Convert time table
    this.timetable = [];
    // TODO: Optimize
    for (let i = 0; i < 5; i++)
      this.timetable.push(this.generateTableUsingDay(i));
    // Monday by default
    this.day = 0;
    this.table = this.timetable[this.day];
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
    this.table = this.timetable[this.day];
  }

  // Empty cells = new Lecture
  generateTableUsingDay(day: number) {
    const table: Array<Array<TCSEntry>> = [];
    // Each room
    this.rooms.forEach(room => table.push([]));
    this.lectures.forEach(lecture =>
      lecture.assignedSlots.forEach(assignedSlot => {
        const roomIndex = this.rooms.findIndex(
          room => room.id === assignedSlot.roomId
        );
        if (assignedSlot.day === day)
          table[roomIndex][assignedSlot.time] = lecture;
      })
    );
    // Ensure a cell is generated for each slot
    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < 8; j++) {
        // If undefined
        if (!table[i][j]) table[i][j] = new TCSEntry();
      }
    }
    return table;
  }

  async presentPublisher() {
    const popover = await this.poc.create({
      component: PublishComponent,
      componentProps: {
        timetable: this.lectures
      }
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
}
