import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'view-table',
  templateUrl: './view-table.component.html',
  styleUrls: ['./view-table.component.scss']
})
export class ViewTableComponent implements OnInit {
  @Input() data: Array<any>;
  @Input() type: string;

  constructor(private poc: PopoverController) {}

  ngOnInit() {}

  async presentPopover(element: any) {
    const popover = await this.poc.create({
      component: EditComponent,
      componentProps: {
        element,
        type: this.type
      }
    });
    return await popover.present();
  }

  trackById(item: object, index: number) {
    return item['id'];
  }

  isBool(value: any) {
    return typeof value === 'boolean';
  }

  getLengthOfObject(object: object) {
    return Object.keys(object).length;
  }
}
