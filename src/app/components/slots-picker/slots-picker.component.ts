import { Component, OnInit, Input } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Teacher } from 'src/app/services/helper-classes';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-slots-picker',
  templateUrl: './slots-picker.component.html',
  styleUrls: ['./slots-picker.component.scss']
})
export class SlotsPickerComponent implements OnInit {
  @Input() slots: Array<boolean>;
  localSlots: Array<boolean>;

  constructor(private server: ServerService, private poc: PopoverController) {}

  ngOnInit() {
    this.localSlots = JSON.parse(JSON.stringify(this.slots));
    // Should be independent of slots
    if (!this.localSlots) this.localSlots = new Teacher().preferredSlots;
  }

  selectRow(roomNumber: number) {
    const rowStart = roomNumber * 5;
    // Determine which value to fill with
    let value = false; // Start with assumption that all are checked
    for (let i = rowStart; i < rowStart + 5; i++) {
      // If any slot is unchecked
      if (!this.localSlots[i]) {
        value = true; // Fill with true
      }
    }
    for (let i = rowStart; i < rowStart + 5; i++) {
      this.localSlots[i] = value;
    }
  }

  selectCol(dayNumber: number) {
    const colEnd = dayNumber + 5 * this.rooms.length;
    // Determine which value to fill with
    let value = false; // Start with assumption that all are checked
    for (let i = dayNumber; i < colEnd; i += 5) {
      // If any slot is unchecked
      if (!this.localSlots[i]) {
        value = true; // Fill with true
      }
    }
    for (let i = dayNumber; i < colEnd; i += 5) {
      this.localSlots[i] = value;
    }
  }

  selectAll() {
    this.localSlots = this.localSlots.map(() => true);
  }

  deselectAll() {
    this.localSlots = this.localSlots.map(() => false);
  }

  setSlots() {
    // In case of varying lengths in both
    for (let i = 0; i < this.slots.length; i++) {
      this.slots[i] = this.localSlots[i];
    }
    this.poc.dismiss();
  }

  get rooms() {
    return this.server.rooms;
  }
}
