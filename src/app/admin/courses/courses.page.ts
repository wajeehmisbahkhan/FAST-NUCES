import { Component, OnInit } from '@angular/core';
import { Course } from '../../services/helper-classes';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss']
})
export class CoursesPage implements OnInit {
  course: Course;
  data: Array<Course> = [];

  constructor() {
    this.course = new Course(
      'MT-201',
      'CS',
      'MT',
      'Operational Research',
      'OR',
      3,
      2017,
      4,
      false,
      false,
      false,
      false,
      false
    );
    // Some default preferences
    this.course.creditHours = 3;
    this.course.isCoreCourse = true;
    this.data.push(this.course);
  }

  ngOnInit() {}

  addCourse() {
    console.log(this.course);
  }

  // Helper functions
  autoFillSchool() {
    this.course.school = this.course.courseCode.slice(0, 2);
  }

  autoFillSemester() {
    const currentDate = new Date();
    let yearOffered = Number(this.course.yearOffered);
    if (Math.floor(yearOffered / 100) === 0) {
      yearOffered += 2000;
    }
    // If month is January
    if (currentDate.getMonth() === 1) {
      // Spring
      this.course.semesterOffered =
        (currentDate.getFullYear() - yearOffered) * 2;
    } else {
      // Fall
      this.course.semesterOffered =
        (currentDate.getFullYear() - yearOffered) * 2 + 1;
    }
  }
}
