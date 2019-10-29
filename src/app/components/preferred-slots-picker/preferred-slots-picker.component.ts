import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SlotsPickerComponent } from '../slots-picker/slots-picker.component';

@Component({
  selector: 'preferred-slots-picker',
  templateUrl: './preferred-slots-picker.component.html',
  styleUrls: ['./preferred-slots-picker.component.scss']
})
export class PreferredSlotsPickerComponent implements OnInit {
  @Input() slots: Array<boolean>;

  constructor(private poc: PopoverController) {}

  ngOnInit() {}

  async presentSlotsPicker() {
    const popover = await this.poc.create({
      component: SlotsPickerComponent,
      componentProps: {
        slots: this.slots
      }
    });
    return await popover.present();
  }

  get icon(): { name: string; color: string } {
    const icon = {
      name: '',
      color: ''
    };
    let hasTrue = false,
      hasFalse = false;
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      // Check for one value
      if (slot) hasTrue = true;
      else hasFalse = true;
      // Return if both have been fulfilled
      if (hasTrue && hasFalse) {
        icon.name = 'remove-circle';
        icon.color = 'warning';
        break;
      }
      // If last loop
      if (i === this.slots.length - 1) {
        // Only has true
        if (hasTrue) {
          icon.name = 'checkmark-circle';
          icon.color = 'success';
        } else {
          icon.name = 'close-circle';
          icon.color = 'danger';
        }
      }
    }
    return icon;
  }
}
