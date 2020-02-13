import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferredRoomPickerComponent } from './preferred-room-picker/preferred-room-picker.component';
import { RoomPickerComponent } from './room-picker/room-picker.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [PreferredRoomPickerComponent, RoomPickerComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [PreferredRoomPickerComponent]
})
export class RoomPickerModule {}
