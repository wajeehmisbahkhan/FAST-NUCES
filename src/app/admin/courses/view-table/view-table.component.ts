import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { EditComponent } from '../edit/edit.component';
import { Course } from 'src/app/services/helper-classes';

@Component({
  selector: 'view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.scss']
})
export class ViewTableComponent implements OnInit {
  @Input() courses: Array<Course>;
  @Input() type: string;

  constructor(private poc: PopoverController) {}

  ngOnInit() {}

  async presentPopover(element: any) {
    const popover = await this.poc.create({
      component: EditComponent,
      componentProps: {
        element,
        type: this.type
      }
    });
    return await popover.present();
  }

  trackById(item: object, index: number) {
    return item['id'];
  }

  getCourseDepartments() {
    const departments = [];
    this.courses.forEach(course => {
      if (!departments.includes(course.department))
        departments.push(course.department);
    });
    return departments;
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }
}
