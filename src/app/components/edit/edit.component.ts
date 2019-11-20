import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ServerService } from 'src/app/services/server.service';
import { Section } from 'src/app/services/helper-classes';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  // Coming from table component
  @Input() element: any;
  @Input() type: string; // 'courses' | 'rooms' | 'sections' | 'teachers'
  // For local form usage
  localElement: any;
  constructor(
    private server: ServerService,
    private poc: PopoverController,
    private as: AlertService
  ) {}

  ngOnInit() {
    // Creating a deep copy for local use
    this.localElement = JSON.parse(JSON.stringify(this.element));
  }

  // Checks which element needs to be updated
  determineUpdation() {
    // Ids of elements - only two in section case
    const ids: Array<string> = this.element.id.split('\n');
    if (this.type === 'sections') {
      // Since two sections
      ids.forEach((id, index) => {
        // Updated version
        const atomicSection: Section = JSON.parse(
          JSON.stringify(this.localElement)
        );
        // Id should be according to index
        atomicSection.id = ids[index];
        // Strength should be divided equally
        atomicSection.strength =
          index === 0
            ? Math.floor(atomicSection.strength / 2)
            : Math.ceil(atomicSection.strength / 2);
        // Name should have digits (C => C1)
        atomicSection.name += index + 1;
        this.updateElement(id, atomicSection);
      });
    } else {
      // Only one object
      this.updateElement(ids[0], this.localElement);
    }
  }

  updateElement(id: string, updatedElement: any) {
    // Just update on server
    // Live listener will update local automatically
    this.server.updatePrimitiveObject(this.type, id, updatedElement);
    this.poc.dismiss();
  }

  // Checks which element needs to be deleted
  // And if it can be deleted or not (referenced elsewhere)
  async determineDeletion() {
    // Element id could be simple id (room) or two combined (C1\nC2)
    // Just pick C1 for now in case it is two
    const id: string = this.element.id.split('\n')[0];
    // Check if referenced
    if (this.isReferenced(id)) {
      this.as.notice('Can not delete object as it is referenced in entries.');
      return;
    }
    // Safe to delete
    this.as.confirmation(
      'Are you sure you want to delete this object?',
      // Confirmation handler
      () => {
        // Check if multiple ids
        if (this.type === 'sections') {
          const ids: Array<string> = this.element.id.split('\n');
          ids.forEach(id => this.deleteElement(id));
        } else {
          // Else delete one
          this.deleteElement(this.element.id);
        }
        this.poc.dismiss();
      }
    );
  }

  // Search for references
  isReferenced(id: string) {
    // Check if element is being referenced in entries
    const references = this.server.getPrimitiveReferencesInEntry(
      this.element.id
    );
    return references.length > 0;
  }

  async deleteElement(id: string) {
    this.server.deletePrimitiveObject(this.type, id);
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

  isBool(value: any) {
    return typeof value === 'boolean';
  }

  isString(value: any) {
    return typeof value === 'string';
  }

  isNumber(value: any) {
    return typeof value === 'number';
  }

  isArray(value: any) {
    return Array.isArray(value);
  }
}
