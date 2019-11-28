import { Component, OnInit, Input } from '@angular/core';
import { SlotsPickerComponent } from '../slots-picker/slots-picker.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'preferred-slots-picker',
  templateUrl: './preferred-slots-picker.component.html',
  styleUrls: ['./preferred-slots-picker.component.scss']
})
export class PreferredSlotsPickerComponent implements OnInit {
  @Input() slots: Array<Array<boolean>>; // [Day][Time]

  constructor(private poc: PopoverController) {}

  ngOnInit() {}

  async presentSlotsPicker() {
    // Show popover
    const popover = await this.poc.create({
      component: SlotsPickerComponent,
      componentProps: {
        slots: this.slots
      }
    });
    return await popover.present();
  }
}
