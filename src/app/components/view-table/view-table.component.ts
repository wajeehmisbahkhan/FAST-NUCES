import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { EditComponent } from '../edit/edit.component';
import { KeyValue } from '@angular/common';
import { sortAlphaNum } from 'src/app/services/helper-classes';

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
        return this.data.sort((a, b) => sortAlphaNum(a[prop], b[prop]));
    return this.data;
  }

  keyNameOrder(
    a: KeyValue<string, string>,
    b: KeyValue<string, string>
  ): number {
    const key = a.key.toLowerCase();
    return key === 'name' || key === 'title' ? -1 : 0;
    // For sections department -> batch -> name
    // if (this.type === 'sections') {
    //   if (key === 'department')
    //     return a.value[0].toLowerCase() > b.value[0].toLowerCase() ? 1 : a.value < b.value ? -1 : 0;
    //   else if (key === 'batch')
    //     return a.value > b.value ? 1 : a.value < b.value ? -1 : this.keyNameOrder({})
    // }
  }

  isBool(value: any) {
    return typeof value === 'boolean';
  }

  isArray(value: any) {
    return Array.isArray(value);
  }

  calculateNumberOfColumns(object: object) {
    let length = Object.keys(object).length;
    Object.keys(object).forEach(key => {
      if (key === 'id' || this.isArray(object[key])) {
        length--;
      }
    });
    return length;
  }
}
