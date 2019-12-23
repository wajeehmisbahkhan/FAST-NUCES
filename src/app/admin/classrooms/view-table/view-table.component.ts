import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { EditComponent } from '../edit/edit.component';
import { Room } from 'src/app/services/helper-classes';

@Component({
  selector: 'view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.scss']
})
export class ViewTableComponent implements OnInit {
  @Input() rooms: Array<Room>;

  constructor(private poc: PopoverController) {}

  ngOnInit() {}

  async presentPopover(room: Room) {
    const popover = await this.poc.create({
      component: EditComponent,
      componentProps: {
        room
      }
    });
    return await popover.present();
  }

  trackById(item: object, index: number) {
    return item['id'];
  }

  getRoomById(id: string) {
    return this.rooms.find(room => room.id === id);
  }
}
