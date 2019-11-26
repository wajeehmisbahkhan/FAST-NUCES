import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ServerService } from 'src/app/services/server.service';
import { TCSEntry, Constraint, Course } from 'src/app/services/helper-classes';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  // Coming from table component
  @Input() course: Course;
  // For local form usage
  localCourse: Course;
  constructor(
    private server: ServerService,
    private poc: PopoverController,
    private as: AlertService
  ) {}

  ngOnInit() {
    console.log(this.course);
    // Creating a deep copy for local use
    this.localCourse = JSON.parse(JSON.stringify(this.course));
  }

  updateElement() {
    // Just update on server
    // Live listener will update local automatically
    this.server.updateObject('courses', this.localCourse.id, this.localCourse);
    this.poc.dismiss();
  }

  // Checks if element can be deleted or not (referenced elsewhere)
  async determineDeletion() {
    if (this.isReferenced(this.course.id, 'courseId')) {
      this.as.notice('Can not delete object as it is referenced in entries.');
      return;
    }
    // Safe to delete
    this.as.confirmation(
      'Are you sure you want to delete this course?',
      // Confirmation handler
      () => {
        this.deleteElement(this.course.id);
        this.poc.dismiss();
      }
    );
  }

  // Search for references
  isReferenced(
    id: string,
    entryProperty?: 'teacherIds' | 'sectionIds' | 'courseId'
  ) {
    let references: Array<TCSEntry | Constraint>;
    // Check if element is being referenced in entries
    references = this.server.getReferencesInEntry(id, entryProperty);
    // Check courses in constraints as well
    if (references.length === 0)
      references = this.server.getReferencesInCourses(id, 'pairedCourses');
    return references.length > 0;
  }

  async deleteElement(id: string) {
    this.server.deleteObject('courses', id);
  }

  isLabCourse(course: Course) {
    return course.shortTitle.toLowerCase().includes('lab');
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  get courses() {
    return this.server.courses;
  }

  get popoverInterfaceOptions() {
    return {
      cssClass: 'popover-wider'
    };
  }
}
