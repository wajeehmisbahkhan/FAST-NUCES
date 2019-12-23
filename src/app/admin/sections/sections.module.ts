import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SectionsPage } from './sections.page';
import { CrudModule } from 'src/app/components/crud.module';
import { EditComponent } from './edit/edit.component';
import { ViewTableComponent } from './view-table/view-table.component';

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
    RouterModule.forChild(routes)
  ],
  declarations: [SectionsPage, ViewTableComponent, EditComponent],
  entryComponents: [EditComponent]
})
export class SectionsPageModule {}
