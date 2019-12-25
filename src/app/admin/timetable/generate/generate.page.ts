import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Lecture } from 'src/app/services/helper-classes';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss']
})
export class GeneratePage implements OnInit {
  departments: Array<string>;
  timetables: Array<Array<Lecture>>;

  constructor(private server: ServerService) {}

  ngOnInit() {
    this.departments = [];
    this.timetables = [];
    // Departments in timetable
    this.timetable.forEach(lecture => {
      const department = this.getCourseById(lecture.courseId).department;
      if (!this.departments.includes(department))
        this.departments.push(department);
    });
    // Timetables based on departments
    this.departments.forEach(department => {
      const timetable = this.timetable.filter(
        lecture =>
          this.getCourseById(lecture.courseId).department === department
      );
      this.timetables.push(timetable);
    });
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  get courses() {
    return this.server.courses;
  }

  get timetable() {
    return this.server.timetable;
  }
}
