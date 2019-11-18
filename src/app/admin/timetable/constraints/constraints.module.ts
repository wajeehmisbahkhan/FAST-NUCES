import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConstraintsPage } from './constraints.page';
import { EditComponent } from './edit/edit.component';
import { AdminInputFormatModule } from 'src/app/pipes/admin-input-format/admin-input-format.module';

const routes: Routes = [
  {
    path: '',
    component: ConstraintsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    AdminInputFormatModule
  ],
  declarations: [ConstraintsPage, EditComponent],
  entryComponents: [EditComponent]
})
export class ConstraintsPageModule {}
