import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClassroomsPage } from './classrooms.page';
import { CrudModule } from 'src/app/components/crud.module';

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
    CrudModule
  ],
  declarations: [ClassroomsPage]
})
export class ClassroomsPageModule {}
