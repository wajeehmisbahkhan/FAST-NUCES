import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  // Coming from table component
  @Input() element: any;
  // For local form usage
  localElement: any;
  constructor(
    // private db: DatabaseService,
    private poc: PopoverController // private as: AlertService
  ) {}

  ngOnInit() {
    // Creating a deep copy for local use
    this.localElement = JSON.parse(JSON.stringify(this.element));
  }

  updateElement() {
    this.element = this.localElement;
    // this.db.updateAccount(this.cashAccount);
    this.poc.dismiss();
  }

  deleteElement() {
    // this.as.confirmation(
    //   'Are you sure you want to delete this account?',
    //   // Confirmation handler
    //   () => {
    //     this.db.deleteAccount(this.cashAccount);
    //     this.poc.dismiss();
    //   }
    // );
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
