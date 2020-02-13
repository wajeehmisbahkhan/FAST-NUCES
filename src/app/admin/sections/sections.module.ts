import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SectionsPage } from './sections.page';
import { EditComponent } from './edit/edit.component';
import { ViewTableComponent } from './view-table/view-table.component';
import { SlotsPickerModule } from 'src/app/components/slots-picker.module';
import { RoomPickerModule } from 'src/app/components/room-picker.module';

const routes: Routes = [
  {
    path: '',
    component: SectionsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SlotsPickerModule,
    RoomPickerModule
  ],
  declarations: [SectionsPage, ViewTableComponent, EditComponent]
})
export class SectionsPageModule {}
