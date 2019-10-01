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
    this.element.accountHolder = this.localElement.accountHolder;
    this.element.particulars = this.localElement.particulars;
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
    return (
      this.localElement.particulars !== this.element.particulars ||
      this.localElement.accountHolder !== this.element.accountHolder
    );
  }
}
