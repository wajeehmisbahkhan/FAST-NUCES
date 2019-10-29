import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TeachersPage } from './teachers.page';
import { CrudModule } from 'src/app/components/crud.module';
import { SlotsPickerModule } from 'src/app/components/slots-picker.module';

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
    CrudModule,
    SlotsPickerModule
  ],
  declarations: [TeachersPage]
})
export class TeachersPageModule {}
