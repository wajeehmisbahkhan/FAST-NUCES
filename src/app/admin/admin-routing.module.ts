import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPage } from './admin.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'courses',
    pathMatch: 'full'
  },
  {
    path: 'courses',
    component: AdminPage,
    loadChildren: './courses/courses.module#CoursesPageModule'
  },
  {
    path: 'teachers',
    component: AdminPage,
    loadChildren: './teachers/teachers.module#TeachersPageModule'
  },
  {
    path: 'sections',
    component: AdminPage,
    loadChildren: './sections/sections.module#SectionsPageModule'
  },
  {
    path: 'classrooms',
    component: AdminPage,
    loadChildren: './classrooms/classrooms.module#ClassroomsPageModule'
  },
  {
    path: 'timetable',
    component: AdminPage,
    loadChildren: './timetable/timetable-routing.module#TimetableRoutingModule'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [AdminPage]
})
export class AdminRoutingModule {}
