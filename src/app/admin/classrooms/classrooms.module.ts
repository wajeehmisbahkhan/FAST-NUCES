import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClassroomsPage } from './classrooms.page';
import { SlotsPickerModule } from 'src/app/components/slots-picker.module';
import { ViewTableComponent } from './view-table/view-table.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: ClassroomsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SlotsPickerModule
  ],
  declarations: [ClassroomsPage, ViewTableComponent, EditComponent]
})
export class ClassroomsPageModule {}
