import { Component, OnInit, Input } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Constraint } from 'src/app/services/helper-classes';
import { PopoverController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  @Input() element: Constraint;
  localElement: Constraint;
  showElectivesOnly: boolean;

  constructor(
    private server: ServerService,
    private poc: PopoverController,
    private as: AlertService
  ) {}

  ngOnInit() {
    this.localElement = JSON.parse(JSON.stringify(this.element));
  }

  updateElement() {
    // Just update on server
    // Live listener will update local automatically
    this.server.updateObject('entries', this.element.id, this.localElement);
    this.poc.dismiss();
  }

  deleteElement() {
    this.as.confirmation(
      'Are you sure you want to delete this constraint?',
      // Confirmation handler
      () => {
        this.server.deleteObject('entries', this.element.id);
        this.poc.dismiss();
      }
    );
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

  get courses() {
    return this.server.courses;
  }

  get constraints() {
    return this.server.constraints;
  }

  get popoverInterfaceOptions() {
    return {
      cssClass: 'popover-wider'
    };
  }
}
