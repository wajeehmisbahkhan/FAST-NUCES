import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CoursesPage } from './courses.page';

import { CrudModule } from '../../components/crud.module';
import { SlotsPickerModule } from 'src/app/components/slots-picker.module';

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
    CrudModule,
    SlotsPickerModule
  ],
  declarations: [CoursesPage]
})
export class CoursesPageModule {}
