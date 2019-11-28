import { Component, OnInit, Input } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { PopoverController } from '@ionic/angular';
import { Room } from 'src/app/services/helper-classes';

@Component({
  selector: 'app-slots-picker',
  templateUrl: './slots-picker.component.html',
  styleUrls: ['./slots-picker.component.scss']
})
export class SlotsPickerComponent implements OnInit {
  @Input() slots: Array<Array<boolean>>;
  localSlots: Array<Array<boolean>>;

  constructor(private poc: PopoverController) {}

  ngOnInit() {
    this.localSlots = JSON.parse(JSON.stringify(this.slots));
  }

  toggleRow(dayNumber: number, fillValue?: boolean) {
    if (fillValue === undefined) {
      // Determine which value to fill with
      fillValue = false; // Start with assumption that all are checked so fill with false
      for (const slot of this.localSlots[dayNumber]) {
        if (!slot) {
          // If any slot is unchecked
          fillValue = true; // Fill all with true and break out
          break;
        }
      }
    }
    // Fill values
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.localSlots[dayNumber].length; i++) {
      this.localSlots[dayNumber][i] = fillValue;
    }
  }

  toggleColumn(time: number, fillValue?: boolean) {
    if (fillValue === undefined) {
      // Determine which value to fill with
      fillValue = false; // Start with assumption that all are checked so fill with false
      for (const day of this.localSlots) {
        if (!day[time]) {
          // If any slot is unchecked
          fillValue = true; // Fill all with true and break out
          break;
        }
      }
    }
    // Fill values
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.localSlots.length; i++) {
      this.localSlots[i][time] = fillValue;
    }
  }

  selectAll() {
    this.localSlots.forEach((row, index) => {
      this.toggleRow(index, true);
    });
  }

  deselectAll() {
    this.localSlots.forEach((row, index) => {
      this.toggleRow(index, false);
    });
  }

  setSlots() {
    for (let i = 0; i < this.slots.length; i++)
      for (let j = 0; j < this.slots[i].length; j++)
        this.slots[i][j] = this.localSlots[i][j];
    this.poc.dismiss();
  }

  slotTracker(index: number, item: boolean) {
    return index;
  }
}
