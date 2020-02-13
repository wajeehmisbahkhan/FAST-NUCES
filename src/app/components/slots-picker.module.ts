import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferredSlotsPickerComponent } from './preferred-slots-picker/preferred-slots-picker.component';
import { SlotsPickerComponent } from './slots-picker/slots-picker.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PreferredSlotsPickerComponent, SlotsPickerComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [PreferredSlotsPickerComponent]
})
export class SlotsPickerModule {}
