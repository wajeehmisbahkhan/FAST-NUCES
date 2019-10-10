import { Component, OnInit } from '@angular/core';
import { Course } from '../../services/helper-classes';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss']
})
export class CoursesPage implements OnInit {
  course: Course;

  constructor(private server: ServerService) {
    this.course = new Course();
    // Some default preferences
    this.course.creditHours = 3;
    this.course.isCoreCourse = true;
    this.course.needsProjector = true;
  }

  ngOnInit() {}

  addCourse() {
    this.server.addPrimitiveObject('courses', this.course);
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

  autoFillShortTitle() {
    this.course.title = this.course.title.trim();
    let shortTitle = this.course.title[0];
    for (let i = 1; i < this.course.title.length; i++) {
      if (this.course.title[i] === ' ') {
        shortTitle += this.course.title[i + 1].toUpperCase();
        i++;
      }
    }
    this.course.shortTitle = shortTitle;
  }

  // Getter functions
  get courses() {
    return this.server.courses;
  }
}
