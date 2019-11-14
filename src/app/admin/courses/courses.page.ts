import { Component, OnInit } from '@angular/core';
import { Course } from '../../services/helper-classes';
import { ServerService } from 'src/app/services/server.service';
import { TitleCasePipe } from '@angular/common';

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
    this.course.duration = 3;
    this.course.isCoreCourse = true;
  }

  ngOnInit() {}

  addCourse() {
    // Casings
    this.course.courseCode = this.course.courseCode.toUpperCase();
    this.course.department = this.course.department.toUpperCase();
    this.course.title = new TitleCasePipe().transform(this.course.title);
    this.course.shortTitle = this.course.shortTitle.toUpperCase();
    this.server.addPrimitiveObject('courses', this.course);
    // Reset particular parts
    this.course.courseCode = '';
    this.course.title = '';
    this.course.shortTitle = '';
    this.course.availableSlots = new Course().availableSlots;
  }

  // Helper functions
  autoFillShortTitle() {
    if (!this.course.title) return;
    this.course.title = this.course.title.trim();
    let shortTitle = '';
    this.course.title.split(' ').forEach(word => {
      // For lab
      if (word.toLowerCase() === 'lab') {
        shortTitle += '-Lab';
      } else {
        // One letter
        shortTitle += word[0].toUpperCase();
      }
    });
    this.course.shortTitle = shortTitle;
  }

  tickRepeat() {
    if (!this.course.isCoreCourse)
      this.course.isRepeatCourse = this.course.isCoreCourse;
  }

  tickCore() {
    if (this.course.isRepeatCourse)
      this.course.isCoreCourse = this.course.isRepeatCourse;
  }

  autoFillDuration() {
    if (this.course.creditHours === 1) this.course.duration = 3;
    else this.course.duration = this.course.creditHours;
  }

  // Getter functions
  get courses() {
    return this.server.courses;
  }
}
