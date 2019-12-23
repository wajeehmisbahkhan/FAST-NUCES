import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ServerService } from 'src/app/services/server.service';
import { Teacher } from 'src/app/services/helper-classes';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  // Coming from table component
  @Input() teacher: Teacher;
  // For local form usage
  localTeacher: Teacher;
  constructor(
    private server: ServerService,
    private poc: PopoverController,
    private as: AlertService
  ) {}

  ngOnInit() {
    // Creating a deep copy for local use
    this.localTeacher = JSON.parse(JSON.stringify(this.teacher));
  }

  updateTeacher() {
    // Just update on server
    // Live listener will update local automatically
    this.server.updateObject(
      'teachers',
      this.localTeacher.id,
      this.localTeacher
    );
    this.poc.dismiss();
  }

  // Checks if teacher can be deleted or not (referenced elsewhere)
  async determineDeletion() {
    if (this.isReferenced(this.teacher.id)) {
      this.as.notice(
        'Can not delete the teacher as they are referenced in entries.'
      );
      return;
    }
    // Safe to delete
    this.as.confirmation(
      'Are you sure you want to delete this teacher?',
      // Confirmation handler
      () => {
        this.deleteTeacher(this.teacher.id);
        this.poc.dismiss();
      }
    );
  }

  // Search for references
  isReferenced(id: string) {
    // Check if teacher is being referenced in entries
    return this.server.getReferencesInEntry(id, 'teacherIds').length > 0;
  }

  async deleteTeacher(id: string) {
    this.server.deleteObject('teachers', id);
  }

  getTeacherById(id: string) {
    return this.teachers.find(teacher => teacher.id === id);
  }

  get teachers() {
    return this.server.teachers;
  }

  get rooms() {
    return this.server.rooms;
  }

  get popoverInterfaceOptions() {
    return {
      cssClass: 'popover-wider'
    };
  }
}
