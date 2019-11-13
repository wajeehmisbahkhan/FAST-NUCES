import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferredSlotsPickerComponent } from './preferred-slots-picker/preferred-slots-picker.component';
import { SlotsPickerComponent } from './slots-picker/slots-picker.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SlotsPickerRoomComponent } from './slots-picker-room/slots-picker-room.component';

@NgModule({
  declarations: [
    PreferredSlotsPickerComponent,
    SlotsPickerComponent,
    SlotsPickerRoomComponent
  ],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [PreferredSlotsPickerComponent],
  entryComponents: [SlotsPickerComponent, SlotsPickerRoomComponent]
})
export class SlotsPickerModule {}
