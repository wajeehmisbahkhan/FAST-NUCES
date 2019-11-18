import { Component, OnInit, Input } from '@angular/core';
import { TCSEntry, Room } from 'src/app/services/helper-classes';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  // [Day][Room][Slots]
  @Input() timetable: Array<Array<Array<TCSEntry>>>;
  // Room & Day
  table: Array<Array<TCSEntry>>;

  constructor(private server: ServerService) {}

  ngOnInit() {
    // For monday
    this.table = this.timetable[0];
  }

  setTable(event: any) {
    this.table = this.timetable[event.detail.value];
  }

  getColor(lecture: TCSEntry): string {
    if (!lecture || !lecture.courseId) return 'white';
    const batch = this.getCourseById(lecture.courseId).batch;
    const currentYear = new Date().getFullYear();
    if (batch === currentYear) {
      // Freshies
      return 'green';
    } else if (batch === currentYear - 1) {
      // Sophomore
      return 'pink';
    } else if (batch === currentYear - 2) {
      // Junior
      return 'blue';
    } else {
      // Senior
      return 'orange';
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

  getSectionById(id: string) {
    return this.sections.find(section => section.id === id);
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

  get sections() {
    return this.server.sections;
  }

  get entries() {
    return this.server.entries;
  }
}
