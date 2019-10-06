import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { TCSEntry } from 'src/app/services/helper-classes';
import { PopoverController } from '@ionic/angular';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.page.html',
  styleUrls: ['./entries.page.scss']
})
export class EntriesPage implements OnInit {
  entry: TCSEntry;

  constructor(private server: ServerService, private poc: PopoverController) {
    this.entry = new TCSEntry();
  }

  ngOnInit() {}

  addEntry() {
    this.server.addPrimitiveObject('entries', this.entry);
  }

  async presentPopover(element: any) {
    const popover = await this.poc.create({
      component: EditComponent,
      componentProps: {
        element
      }
    });
    return await popover.present();
  }

  trackById(item: object, index: number) {
    return item['id'];
  }

  getTeacherById(id: string) {
    return this.teachers.find(teacher => teacher.id === id);
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  getSectionById(id: string) {
    return this.sections.find(section => section.id === id);
  }

  get teachers() {
    return this.server.teachers;
  }

  get courses() {
    return this.server.courses;
  }

  get sections() {
    return this.server.sections;
  }

  get entries() {
    return this.server.entries;
  }

  get popoverInterfaceOptions() {
    return {
      cssClass: 'popover-wider'
    };
  }
}
