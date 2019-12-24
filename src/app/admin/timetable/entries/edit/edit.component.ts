import { Component, OnInit, Input } from '@angular/core';
import {
  TCSEntry,
  AggregateSection,
  AtomicSection,
  Section
} from 'src/app/services/helper-classes';
import { ServerService } from 'src/app/services/server.service';
import { PopoverController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  // Coming from table component
  @Input() entry: TCSEntry;
  showAtomicSections: boolean;
  mixedSections: Array<AtomicSection> | Array<AggregateSection>;
  // Cache
  atomicSections: Array<AtomicSection>;
  aggregateSections: Array<AggregateSection>;

  // For local form usage
  localEntry: TCSEntry;
  constructor(
    private server: ServerService,
    private poc: PopoverController,
    private as: AlertService
  ) {
    // For caching purposes
    this.atomicSections = this.server.atomicSections;
    this.aggregateSections = Section.atomicSectionsToMixedSections(
      this.server.atomicSections
    );
  }

  ngOnInit() {
    // Creating a deep copy for local use
    this.localEntry = JSON.parse(JSON.stringify(this.entry));
    // TODO: Check if sections are aggregate then set show atomic sections
    this.showAtomicSections = true;
    // Set mixed sections according to default sections
    this.mixedSections = [];
    this.localEntry.atomicSectionIds.forEach(atomicSectionId =>
      this.mixedSections.push(this.getAtomicSectionById(atomicSectionId))
    );
  }

  updateEntry() {
    // Just update on server
    // Live listener will update local automatically
    this.localEntry.atomicSectionIds = Section.mixedSectionsToAtomicSections(
      this.mixedSections
    ).map(atomicSection => atomicSection.id);
    this.server.updateObject('entries', this.entry.id, this.localEntry);
    this.poc.dismiss();
  }

  deleteEntry() {
    this.as.confirmation(
      'Are you sure you want to delete this lecture?',
      // Confirmation handler
      () => {
        this.server.deleteObject('entries', this.entry.id);
        this.poc.dismiss();
      }
    );
  }

  deselectMixedSections() {
    this.mixedSections = [];
  }

  // Auto fill
  fillSectionName() {
    let sectionName = '';
    Section.atomicSectionsToMixedSections(this.mixedSections).forEach(
      section => {
        // Comma for multiple sections
        if (sectionName.length > 0) sectionName += ', ';
        sectionName += section.name;
      }
    );
    this.localEntry.name = sectionName;
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  getAtomicSectionById(id: string) {
    return this.atomicSections.find(atomicSection => atomicSection.id === id);
  }

  trackById(item: object, index: number) {
    return item['id'];
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

  get entries() {
    return this.server.entries;
  }

  get popoverInterfaceOptions() {
    return {
      cssClass: 'popover-wider'
    };
  }

  editFormChanged() {
    let formChanged = false;
    const keys = Object.keys(this.localEntry);
    keys.forEach(key => {
      // Only compare value not types
      // tslint:disable-next-line: triple-equals
      if (this.localEntry[key] != this.entry[key]) {
        formChanged = true;
      }
    });
    return formChanged;
  }
}
