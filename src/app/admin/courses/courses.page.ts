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

  constructor(private server: ServerService) {}

  ngOnInit() {
    this.course = new Course(this.rooms);
    // Some default preferences
    this.course.creditHours = 3;
    this.course.duration = 3;
    this.course.isCoreCourse = true;
  }

  addCourse() {
    // Casings
    this.course.courseCode = this.course.courseCode.toUpperCase();
    this.course.department = this.course.department.toUpperCase();
    this.course.title = new TitleCasePipe().transform(this.course.title);
    this.course.shortTitle = this.course.shortTitle.toUpperCase();
    this.server.addObject('courses', this.course);
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

  autoFillDuration() {
    if (this.course.creditHours === 1) this.course.duration = 3;
    else this.course.duration = this.course.creditHours;
  }

  isLabCourse(course: Course) {
    return course.shortTitle.toLowerCase().includes('lab');
  }

  // Getter functions
  get courses() {
    return this.server.courses;
  }

  get rooms() {
    return this.server.rooms;
  }
}
