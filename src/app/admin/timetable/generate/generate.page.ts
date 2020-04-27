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

  generating: boolean;

  constructor(private server: ServerService) {
    // TODO: Set by server
    this.generating = false;
  }

  ngOnInit() {
    this.departments = ['CS'];
    // const csLecture = new Lecture();
    // csLecture.assignedSlots = [
    //   {
    //     day: 0,
    //     roomId: this.server.rooms[0].id,
    //     time: 0
    //   }
    // ];
    // csLecture.atomicSectionIds = [this.server.atomicSections[0].id];
    // csLecture.courseId = this.courses[0].id;
    // csLecture.id = 'cs-lecture';
    // csLecture.name = 'GR1';
    // csLecture.strength = 50;
    // csLecture.teacherIds = [this.server.teachers[0].id];
    this.timetables = [
      // CS
      // [csLecture]
    ];
  }

  generateTimetable() {
    this.generating = true;
    // TODO: Send request to server
    setTimeout(this.server.generateTimeTable.bind(this.server), 1000);
    setTimeout(this.generateTimetablesAndDepartments.bind(this), 1200);
  }

  generateTimetablesAndDepartments() {
    // Departments in timetable
    this.generated.forEach(lecture => {
      const department = this.getCourseById(lecture.courseId).department;
      if (!this.departments.includes(department))
        this.departments.push(department);
    });
    // Timetables based on departments
    this.departments.forEach(department => {
      const timetable = this.generated.filter(
        lecture =>
          this.getCourseById(lecture.courseId).department === department
      );
      this.timetables.push(timetable);
    });
    this.generating = false;
  }

  cancel() {
    // TODO: Send request to server
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  get courses() {
    return this.server.courses;
  }

  get generated() {
    return this.server.generated;
  }
}
