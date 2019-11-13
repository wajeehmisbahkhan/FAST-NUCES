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
  }

  ngOnInit() {}

  addCourse() {
    this.server.addPrimitiveObject('courses', this.course);
    this.course = new Course();
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

  // Getter functions
  get courses() {
    return this.server.courses;
  }
}
