import { Component, OnInit, Input } from '@angular/core';
import {
  TCSEntry,
  AggregateSection,
  sortAlphaNum
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
  @Input() element: TCSEntry;
  // For local form usage
  localElement: TCSEntry;
  constructor(
    private server: ServerService,
    private poc: PopoverController,
    private as: AlertService
  ) {}

  ngOnInit() {
    // Creating a deep copy for local use
    this.localElement = JSON.parse(JSON.stringify(this.element));
  }

  updateElement() {
    // Just update on server
    // Live listener will update local automatically
    this.server.updatePrimitiveObject(
      'entries',
      this.element.id,
      this.localElement
    );
    this.poc.dismiss();
  }

  deleteElement() {
    this.as.confirmation(
      'Are you sure you want to delete this object?',
      // Confirmation handler
      () => {
        this.server.deletePrimitiveObject('entries', this.element.id);
        this.poc.dismiss();
      }
    );
  }

  // Auto fill
  fillSectionName() {
    let sectionName = '';
    if (!this.localElement.hasAtomicSections) {
      this.normalSections.forEach(section => {
        // Show all sections which are included
        if (this.localElement.sectionIds.includes(section.id)) {
          // Comma for multiple sections
          if (sectionName.length > 0) {
            sectionName += ', ';
          }
          sectionName += section.name;
        }
      });
    }
    this.localElement.name = sectionName;
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  get normalSections() {
    return AggregateSection.aggregateToNormalSections(
      // Send copy not original to avoid changeafterread error
      AggregateSection.atomicToAggregateSections(this.sections.slice(0))
    ).sort((a, b) => sortAlphaNum(a.name, b.name)); // Sorted
  }

  get repeatCourse() {
    return (
      this.getCourseById(this.localElement.courseId) &&
      this.getCourseById(this.localElement.courseId).isRepeatCourse
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
    const keys = Object.keys(this.localElement);
    keys.forEach(key => {
      // Only compare value not types
      // tslint:disable-next-line: triple-equals
      if (this.localElement[key] != this.element[key]) {
        formChanged = true;
      }
    });
    return formChanged;
  }
}
