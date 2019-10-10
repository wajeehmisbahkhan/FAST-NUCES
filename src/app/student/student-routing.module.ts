import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StudentPage } from './student.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: StudentPage,
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  }
];

@NgModule({
  declarations: [StudentPage],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  exports: [StudentPage]
})
export class StudentRoutingModule {}
