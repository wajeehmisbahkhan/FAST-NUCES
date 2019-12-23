import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ServerService } from 'src/app/services/server.service';
import { Room } from 'src/app/services/helper-classes';

@Component({
  selector: 'edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  // Coming from table component
  @Input() room: Room;
  // For local form usage
  localRoom: Room;
  constructor(
    private server: ServerService,
    private poc: PopoverController,
    private as: AlertService
  ) {}

  ngOnInit() {
    // Creating a deep copy for local use
    this.localRoom = JSON.parse(JSON.stringify(this.room));
  }

  updateRoom() {
    // Just update on server
    // Live listener will update local automatically
    this.server.updateObject('rooms', this.localRoom.id, this.localRoom);
    this.poc.dismiss();
  }

  // Checks if room can be deleted or not (referenced elsewhere)
  async determineDeletion() {
    if (this.isReferenced(this.room.id)) {
      this.as.notice('Can not delete room as it is referenced in entries.');
      return;
    }
    // Safe to delete
    this.as.confirmation(
      'Are you sure you want to delete this room?',
      // Confirmation handler
      () => {
        this.deleteRoom(this.room.id);
        this.poc.dismiss();
      }
    );
  }

  // Search for references
  isReferenced(roomId: string) {
    // Check if room is being referenced in availableRoom (course & teacher)
    return (
      this.courses.filter(course => course.availableRooms.includes(roomId))
        .length > 0 ||
      this.teachers.filter(teacher => teacher.availableRooms.includes(roomId))
        .length > 0
    );
  }

  async deleteRoom(id: string) {
    this.server.deleteObject('rooms', id);
  }

  getRoomById(id: string) {
    return this.rooms.find(room => room.id === id);
  }

  get courses() {
    return this.server.courses;
  }

  get teachers() {
    return this.server.teachers;
  }

  get rooms() {
    return this.server.rooms;
  }

  get popoverInterfaceOptions() {
    return {
      cssClass: 'popover-wider'
    };
  }
}
