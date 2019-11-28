import { Component, OnInit, Input } from '@angular/core';
import { SlotsPickerComponent } from '../slots-picker/slots-picker.component';
import { PopoverController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { AlertService } from 'src/app/services/alert.service';
import { SlotsPickerRoomComponent } from '../slots-picker-room/slots-picker-room.component';

@Component({
  selector: 'preferred-slots-picker',
  templateUrl: './preferred-slots-picker.component.html',
  styleUrls: ['./preferred-slots-picker.component.scss']
})
export class PreferredSlotsPickerComponent implements OnInit {
  @Input() slots: Array<Array<Array<boolean>>> | Array<Array<boolean>>;
  dimensions: number;

  constructor(
    private as: AlertService,
    private server: ServerService,
    private poc: PopoverController
  ) {}

  ngOnInit() {
    // 3D
    if (this.slots[0][0][0] !== undefined) {
      console.log(this.slots);
      this.dimensions = 3;
    } else {
      // 2D
      this.dimensions = 2;
    }
  }

  async presentSlotsPicker() {
    if (this.dimensions === 3) {
      // Days + Room + Time
      if (this.server.rooms.length > 0) {
        // Ensure proper room length of slots
        for (let i = 0; i < this.slots.length; i++) {
          this.slots[i] = this.slots[i].splice(0, this.server.rooms.length);
        }
        // Show popover
        const popover = await this.poc.create({
          component: SlotsPickerComponent,
          componentProps: {
            slots: this.slots
          }
        });
        return await popover.present();
      }
      // Rooms not loaded yet
      this.as.notice('Rooms not loaded yet');
    } else {
      // Show popover
      const popover = await this.poc.create({
        component: SlotsPickerRoomComponent,
        componentProps: {
          slots: this.slots
        }
      });
      return await popover.present();
    }
  }
}
