import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EntriesPage } from './entries.page';
import { EditComponent } from './edit/edit.component';
import { AdminInputFormatModule } from 'src/app/pipes/admin-input-format/admin-input-format.module';

const routes: Routes = [
  {
    path: '',
    component: EntriesPage
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
  declarations: [EntriesPage, EditComponent],
  entryComponents: [EditComponent]
})
export class EntriesPageModule {}
