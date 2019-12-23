import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TeachersPage } from './teachers.page';
import { SlotsPickerModule } from 'src/app/components/slots-picker.module';
import { RoomPickerModule } from 'src/app/components/room-picker.module';
import { ViewTableComponent } from './view-table/view-table.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: TeachersPage
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
  declarations: [TeachersPage, ViewTableComponent, EditComponent],
  entryComponents: [EditComponent]
})
export class TeachersPageModule {}
