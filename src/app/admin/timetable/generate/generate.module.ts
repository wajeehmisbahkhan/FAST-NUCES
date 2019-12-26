import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GeneratePage } from './generate.page';
import { TimetableModule } from 'src/app/components/timetable.module';

const routes: Routes = [
  {
    path: '',
    component: GeneratePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TimetableModule
  ],
  declarations: [GeneratePage]
})
export class GeneratePageModule {}
