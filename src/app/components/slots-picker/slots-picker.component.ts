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
  @Input() slots: Array<Array<Array<boolean>>>;
  localSlots: Array<Array<Array<boolean>>>;
  // For specific day
  table: Array<Array<boolean>>;

  constructor(private server: ServerService, private poc: PopoverController) {}

  ngOnInit() {
    this.localSlots = JSON.parse(JSON.stringify(this.slots));
    // Monday by default
    this.table = this.localSlots[0]; // [room][time]
  }

  setTable(event: any) {
    this.table = this.localSlots[event.detail.value];
  }

  toggleRow(roomNumber: number, fillValue?: boolean) {
    if (fillValue === undefined) {
      // Determine which value to fill with
      fillValue = false; // Start with assumption that all are checked so fill with false
      for (const slot of this.table[roomNumber]) {
        if (!slot) {
          // If any slot is unchecked
          fillValue = true; // Fill all with true and break out
          break;
        }
      }
    }
    // Fill values
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.table[roomNumber].length; i++) {
      this.table[roomNumber][i] = fillValue;
    }
  }

  toggleColumn(slotNumber: number, fillValue?: boolean) {
    if (fillValue === undefined) {
      // Determine which value to fill with
      fillValue = false; // Start with assumption that all are checked so fill with false
      for (const room of this.table) {
        if (!room[slotNumber]) {
          // If any slot is unchecked
          fillValue = true; // Fill all with true and break out
          break;
        }
      }
    }
    // Fill values
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.table.length; i++) {
      this.table[i][slotNumber] = fillValue;
    }
  }

  toggleRooms(labs = false) {
    // Indexes to toggle
    const rows: Array<number> = [];
    let fillValue = false;
    this.table.forEach((room, index) => {
      // If lab
      if (this.rooms[index].name.toLowerCase().includes('lab') === labs) {
        // Determine fill value - if still not disproven
        if (!fillValue)
          room.forEach(slot => {
            if (!slot) fillValue = true;
          });
        // Include as lab
        rows.push(index);
      }
    });
    // Toggle
    rows.forEach(index => this.toggleRow(index, fillValue));
  }

  selectAll() {
    this.table.forEach((row, index) => {
      this.toggleRow(index, true);
    });
  }

  deselectAll() {
    this.table.forEach((row, index) => {
      this.toggleRow(index, false);
    });
  }

  setSlots() {
    for (let i = 0; i < this.slots.length; i++)
      for (let j = 0; j < this.slots[i].length; j++)
        for (let k = 0; k < this.slots[i][j].length; k++)
          this.slots[i][j][k] = this.localSlots[i][j][k];
    this.poc.dismiss();
  }

  get rooms() {
    return this.server.rooms;
  }

  roomTracker(index: number, item: Room) {
    return item.id;
  }

  slotTracker(index: number, item: boolean) {
    return index;
  }
}
