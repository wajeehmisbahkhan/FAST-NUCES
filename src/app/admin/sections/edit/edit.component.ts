import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ServerService } from 'src/app/services/server.service';
import { TCSEntry, Section } from 'src/app/services/helper-classes';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() section: Section;
  localSection: Section;
  // CS2016, EE2015 etc
  sectionId: string;

  constructor(
    private server: ServerService,
    private poc: PopoverController,
    private as: AlertService
  ) {}

  ngOnInit() {
    // Deep Copy
    this.localSection = JSON.parse(JSON.stringify(this.section));
    this.sectionId = this.localSection.department + this.localSection.batch;
  }

  // Check if numberOfSections decreases and if deleted sections are referenced
  determineUpdation() {
    const difference =
      this.localSection.numberOfSections - this.section.numberOfSections;
    const length = this.section.numberOfSections - 1;
    for (let i = length; i > length - difference; i--) {
      // letter = last letter, say 'H'
      const letter = String.fromCharCode('A'.charCodeAt(0) + i);
      // Checks letters in reverse if any are referenced
      if (this.isReferenced(this.sectionId + letter)) {
        this.as.notice(
          'Can not reduce section size as some sections are referenced in entries.'
        );
        return;
      }
    }
    this.updateSection();
  }

  updateSection() {
    // Just update on server
    // Live listener will update local automatically
    this.server.updateObject(
      'sections',
      this.localSection.id,
      this.localSection
    );
    this.poc.dismiss();
  }

  // Checks if an aggregate section can be deleted or not (referenced elsewhere)
  async determineDeletion() {
    // Check all letters
    for (let i = 0; i < this.section.numberOfSections; i++) {
      const letter = String.fromCharCode('A'.charCodeAt(0) + i);
      // Checks letters in reverse if any are referenced
      if (this.isReferenced(this.sectionId + letter)) {
        this.as.notice(
          'Can not delete as some sections are referenced in entries.'
        );
        return;
      }
    }
    // Safe to delete
    this.as.confirmation(
      'Are you sure you want to delete all of these sections?',
      // Confirmation handler
      () => {
        this.deleteSection(this.section.id);
        this.poc.dismiss();
      }
    );
  }

  // Search for references
  isReferenced(aggregateSectionId: string) {
    const references: Array<TCSEntry> = [];
    [aggregateSectionId + '1', aggregateSectionId + '2'].forEach(
      atomicSectionId => {
        // Check if atomic section is being referenced in entries
        references.push(
          ...this.server.getReferencesInEntry(
            atomicSectionId,
            'atomicSectionIds'
          )
        );
      }
    );
    return references.length > 0;
  }

  async deleteSection(id: string) {
    this.server.deleteObject('sections', id);
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  get courses() {
    return this.server.courses;
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
