import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import {
  TCSEntry,
  AggregateSection,
  sortAlphaNum
} from 'src/app/services/helper-classes';
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
    const entry: TCSEntry = JSON.parse(JSON.stringify(this.entry));
    entry.sectionIds = this.ensureNormalSectionIds(entry.sectionIds);
    this.server.addPrimitiveObject('entries', entry);
    // Reset entry
    this.entry = new TCSEntry();
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

  ensureNormalSectionIds(sectionIds: Array<string>) {
    const normalSectionIds: Array<string> = [];
    sectionIds.forEach(sectionId => {
      if (sectionId.includes('\n')) {
        // Convert to single array containing atomic values
        sectionId.split('\n').forEach(id => normalSectionIds.push(id));
      } else {
        normalSectionIds.push(sectionId);
      }
    });
    return normalSectionIds;
  }

  // Auto fill
  fillSectionName() {
    let sectionName = '';
    if (!this.entry.hasAtomicSections) {
      this.normalSections.forEach(section => {
        // Show all sections which are included
        if (this.entry.sectionIds.includes(section.id)) {
          // Comma for multiple sections
          if (sectionName.length > 0) {
            sectionName += ', ';
          }
          sectionName += section.name;
        }
      });
    }
    this.entry.name = sectionName;
  }

  get repeatCourse() {
    return (
      this.getCourseById(this.entry.courseId) &&
      this.getCourseById(this.entry.courseId).isRepeatCourse
    );
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

  get normalSections() {
    return AggregateSection.aggregateToNormalSections(
      // Send copy not original to avoid changeafterread error
      AggregateSection.atomicToAggregateSections(this.sections.slice(0))
    ).sort((a, b) => sortAlphaNum(a.name, b.name)); // Sorted
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
