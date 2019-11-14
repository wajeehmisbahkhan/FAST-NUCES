import { Component, OnInit } from '@angular/core';
import { Teacher } from 'src/app/services/helper-classes';
import { ServerService } from 'src/app/services/server.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss']
})
export class TeachersPage implements OnInit {
  teacher: Teacher;
  constructor(private server: ServerService) {
    this.teacher = new Teacher();
  }

  ngOnInit() {}

  addTeacher() {
    this.teacher.department = this.teacher.department.toUpperCase();
    this.teacher.name = new TitleCasePipe().transform(this.teacher.name);
    this.server.addPrimitiveObject('teachers', this.teacher);
    this.teacher.name = '';
    this.teacher.availableSlots = new Teacher().availableSlots;
  }

  get teachers() {
    return this.server.teachers;
  }
}
