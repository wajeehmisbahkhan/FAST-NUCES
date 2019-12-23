import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import {
  TCSEntry,
  AggregateSection,
  Section,
  AtomicSection
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
  showAtomicSections: boolean;
  mixedSections: Array<AtomicSection> | Array<AggregateSection>;

  constructor(private server: ServerService, private poc: PopoverController) {
    this.entry = new TCSEntry();
  }

  ngOnInit() {}

  addEntry() {
    const entry: TCSEntry = JSON.parse(JSON.stringify(this.entry));
    entry.atomicSectionIds = Section.mixedSectionsToAtomicSections(
      this.mixedSections
    ).map(atomicSection => atomicSection.id);
    this.server.addObject('entries', entry);
    // Reset entry
    this.entry = new TCSEntry();
    this.entry.teacherIds = entry.teacherIds;
    this.entry.courseId = entry.courseId;
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

  deselectMixedSections() {
    this.mixedSections = [];
  }

  // Auto fill
  fillSectionName() {
    this.entry.name = this.generateSectionName(
      this.mixedSections,
      this.showAtomicSections
    );
  }

  generateSectionName(
    atomicSections: Array<AtomicSection | AggregateSection>,
    isAtomicSections = true
  ) {
    let sectionName = '';
    let mixedSections: Array<AtomicSection | AggregateSection> = JSON.parse(
      JSON.stringify(atomicSections)
    );
    if (isAtomicSections)
      mixedSections = Section.atomicSectionsToMixedSections(atomicSections);
    mixedSections.forEach(section => {
      // Comma for multiple sections
      if (sectionName.length > 0) sectionName += ', ';
      sectionName += section.name;
    });
    return sectionName;
  }

  get teachers() {
    return this.server.teachers;
  }

  get courses() {
    return this.server.courses;
  }

  get sections(): Array<AtomicSection> | Array<AggregateSection> {
    // Return atomic or aggregate depending on user tick
    return this.showAtomicSections
      ? this.atomicSections
      : this.aggregateSections;
  }

  get atomicSections() {
    return this.server.atomicSections;
  }

  get aggregateSections() {
    return Section.atomicSectionsToMixedSections(this.server.atomicSections);
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
