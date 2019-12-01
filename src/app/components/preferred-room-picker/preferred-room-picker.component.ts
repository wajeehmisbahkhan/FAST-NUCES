import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { RoomPickerComponent } from '../room-picker/room-picker.component';

@Component({
  selector: 'preferred-room-picker',
  templateUrl: './preferred-room-picker.component.html',
  styleUrls: ['./preferred-room-picker.component.scss']
})
export class PreferredRoomPickerComponent implements OnInit {
  @Input() roomIds: Array<string>; // Room IDs

  constructor(private poc: PopoverController, private server: ServerService) {}

  ngOnInit() {}

  async presentRoomPicker() {
    // Show popover
    const popover = await this.poc.create({
      component: RoomPickerComponent,
      componentProps: {
        roomIds: this.roomIds
      }
    });
    return await popover.present();
  }

  get rooms() {
    return this.server.rooms;
  }
}
