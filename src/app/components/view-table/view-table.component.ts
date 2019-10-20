import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { EditComponent } from '../edit/edit.component';
import { KeyValue } from '@angular/common';

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

  filterBy(prop: string) {
    // If exists in any element
    if (this.data[0])
      if (prop in this.data[0])
        // Order by that property ex: name
        return this.data.sort((a, b) =>
          a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1
        );
    return this.data;
  }

  keyNameOrder(a: KeyValue<string, string>): number {
    // Prefer name
    const key = a.key.toLowerCase();
    return key === 'name' || key === 'title' ? -1 : 0;
  }

  isBool(value: any) {
    return typeof value === 'boolean';
  }

  getLengthOfObject(object: object) {
    return Object.keys(object).length;
  }
}
