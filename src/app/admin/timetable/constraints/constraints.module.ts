import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConstraintsPage } from './constraints.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { EditComponent } from './edit/edit.component';

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
    PipesModule
  ],
  declarations: [ConstraintsPage, EditComponent],
  entryComponents: [EditComponent]
})
export class ConstraintsPageModule {}
