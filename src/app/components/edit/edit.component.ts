import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ServerService } from 'src/app/services/server.service';

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

  updateElement() {
    // Just update on server
    // Live listener will update local automatically
    this.server.updatePrimitiveObject(
      this.type,
      this.element.id,
      this.localElement
    );
    this.poc.dismiss();
  }

  async deleteElement() {
    // Check if element is being referenced in entries
    const references = this.server.getPrimitiveReferencesInEntry(
      this.element.id
    );
    if (references.length === 0)
      this.as.confirmation(
        'Are you sure you want to delete this object?',
        // Confirmation handler
        () => {
          this.server.deletePrimitiveObject(this.type, this.element.id);
          this.poc.dismiss();
        }
      );
    else
      this.as.notice('Can not delete object as it is referenced in entries.');
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
}
