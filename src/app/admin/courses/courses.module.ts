import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoursesPage } from './courses.page';

import { SlotsPickerModule } from 'src/app/components/slots-picker.module';
import { ViewTableComponent } from './view-table/view-table.component';
import { EditComponent } from './edit/edit.component';
import { RoomPickerModule } from 'src/app/components/room-picker.module';

const routes: Routes = [
  {
    path: '',
    component: CoursesPage
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
  declarations: [CoursesPage, ViewTableComponent, EditComponent],
  entryComponents: [EditComponent]
})
export class CoursesPageModule {}
