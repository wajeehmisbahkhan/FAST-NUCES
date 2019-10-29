import { Component, OnInit } from '@angular/core';
import { Teacher } from 'src/app/services/helper-classes';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss']
})
export class TeachersPage implements OnInit {
  teacher: Teacher;
  constructor(private server: ServerService) {
    this.teacher = new Teacher();
    // Default preferences
    // Resize preferred slots
    this.teacher.preferredSlots.splice(0, this.server.rooms.length);
  }

  ngOnInit() {}

  addTeacher() {
    this.server.addPrimitiveObject('teachers', this.teacher);
  }

  get teachers() {
    return this.server.teachers;
  }
}
