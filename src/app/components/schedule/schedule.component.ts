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
  @Input() timetable: Array<Lecture>;
  // Room & Slot
  table: Array<Array<TCSEntry>>;

  day: number;

  constructor(private server: ServerService, private poc: PopoverController) {}

  ngOnInit() {
    // For monday
    this.table = this.generateTableUsingDay(0);

    this.day = 0;
  }

  async presentSwapper(
    cell: Lecture,
    day: number,
    roomId: string,
    slot: number
  ) {
    const popover = await this.poc.create({
      component: SwapperComponent,
      componentProps: {
        cell,
        cellPosition: {
          day,
          roomId,
          slot
        },
        timetable: this.timetable
      }
    });
    return await popover.present();
  }

  setTable(event: any) {
    this.table = this.generateTableUsingDay(Number(event.detail.value));
  }

  generateTableUsingDay(day: number) {
    const table: Array<Array<TCSEntry>> = [];
    // Each room
    this.rooms.forEach(room => table.push([]));
    this.timetable.forEach(lecture =>
      lecture.assignedSlots.forEach(assignedSlot => {
        const roomIndex = this.rooms.findIndex(
          room => room.id === assignedSlot.roomId
        );
        if (assignedSlot.day === day)
          table[roomIndex][assignedSlot.time] = lecture;
      })
    );
    return table;
  }

  async presentPublisher() {
    const popover = await this.poc.create({
      component: PublishComponent,
      componentProps: {
        timetable: this.timetable
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
