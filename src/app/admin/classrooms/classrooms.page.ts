import { Component, OnInit } from '@angular/core';
import { Room } from 'src/app/services/helper-classes';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.page.html',
  styleUrls: ['./classrooms.page.scss']
})
export class ClassroomsPage implements OnInit {
  room: Room;
  constructor(private server: ServerService) {
    this.room = new Room();
    // Not available on Friday
    this.room.availableSlots[4][5] = false;
  }

  ngOnInit() {}

  addRoom() {
    this.server.addPrimitiveObject('rooms', this.room);
    this.room = new Room();
    // Not available on Friday
    this.room.availableSlots[4][5] = false;
  }

  get rooms() {
    return this.server.rooms;
  }
}
