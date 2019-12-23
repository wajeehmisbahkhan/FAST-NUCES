import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { EditComponent } from '../edit/edit.component';
import { Teacher } from 'src/app/services/helper-classes';

@Component({
  selector: 'view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.scss']
})
export class ViewTableComponent implements OnInit {
  @Input() teachers: Array<Teacher>;

  constructor(private poc: PopoverController) {}

  ngOnInit() {}

  async presentPopover(teacher: Teacher) {
    const popover = await this.poc.create({
      component: EditComponent,
      componentProps: {
        teacher
      }
    });
    return await popover.present();
  }

  trackById(item: object, index: number) {
    return item['id'];
  }

  getTeacherDepartments() {
    const departments = [];
    this.teachers.forEach(teacher => {
      if (!departments.includes(teacher.department))
        departments.push(teacher.department);
    });
    return departments;
  }

  getTeachersByDepartment(department: string) {
    return this.teachers.filter(teacher => teacher.department === department);
  }

  getTeacherById(id: string) {
    return this.teachers.find(teacher => teacher.id === id);
  }
}
