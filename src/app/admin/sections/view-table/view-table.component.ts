import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { EditComponent } from '../edit/edit.component';
import { Section } from 'src/app/services/helper-classes';

@Component({
  selector: 'view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.scss']
})
export class ViewTableComponent implements OnInit {
  @Input() sections: Array<Section>;

  constructor(private poc: PopoverController) {}

  ngOnInit() {}

  async presentPopover(section: Section) {
    const popover = await this.poc.create({
      component: EditComponent,
      componentProps: {
        section
      }
    });
    return await popover.present();
  }

  trackById(item: object, index: number) {
    return item['id'];
  }

  getSectionDepartments() {
    const departments = [];
    this.sections.forEach(section => {
      if (!departments.includes(section.department))
        departments.push(section.department);
    });
    return departments;
  }

  getSectionsByDepartment(department: string) {
    return this.sections.filter(section => section.department === department);
  }

  getSectionById(id: string) {
    return this.sections.find(section => section.id === id);
  }
}
