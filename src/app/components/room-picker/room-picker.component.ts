import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ServerService } from 'src/app/services/server.service';
import { Room, sortAlphaNum } from 'src/app/services/helper-classes';

@Component({
  selector: 'app-room-picker',
  templateUrl: './room-picker.component.html',
  styleUrls: ['./room-picker.component.scss']
})
export class RoomPickerComponent implements OnInit {
  @Input() roomIds: Array<string>;
  localRoomIds: Array<string>;

  constructor(private server: ServerService, private poc: PopoverController) {}

  ngOnInit() {
    this.localRoomIds = JSON.parse(JSON.stringify(this.roomIds));
  }

  isLab(room: Room) {
    return room.name.toLowerCase().includes('lab');
  }

  hasLab(roomIds: Array<string>) {
    // Convert to rooms
    const rooms: Array<Room> = [];
    roomIds.forEach(roomId => rooms.push(this.getRoomById(roomId)));
    // Check if has lab
    let hasLab = false;
    for (const room of rooms) {
      if (this.isLab(room)) {
        hasLab = true;
        break;
      }
    }
    return hasLab;
  }

  toggleRooms() {}

  toggleLabs() {}

  roomTracker(index: number, item: boolean) {
    return index;
  }

  addRoom(roomId: string) {
    this.localRoomIds.push(roomId);
  }

  removeRoom(roomId: string) {
    this.localRoomIds = this.localRoomIds.filter(
      localRoomId => localRoomId !== roomId
    );
  }

  setRooms() {
    // Remove unmatching
    this.roomIds.forEach((roomId, index) => {
      if (!this.localRoomIds.includes(roomId)) this.roomIds.splice(index, 1);
    });
    // Add matching
    this.localRoomIds.forEach(localRoomId => {
      if (!this.roomIds.includes(localRoomId)) this.roomIds.push(localRoomId);
    });
    this.poc.dismiss();
  }

  getRoomById(id: string) {
    return this.rooms.find(room => room.id === id);
  }

  sortRoomIds(roomIds: Array<string>) {
    let rooms: Array<Room> = [];
    roomIds.forEach(roomId => rooms.push(this.getRoomById(roomId)));
    rooms = rooms.sort((a: Room, b: Room) => sortAlphaNum(a.name, b.name));
    return rooms.map(room => room.id);
  }

  get leftRoomIds() {
    const leftRooms = this.rooms.filter(
      room => !this.localRoomIds.includes(room.id)
    );
    return leftRooms.map(room => room.id);
  }

  get rooms() {
    return this.server.rooms;
  }
}
