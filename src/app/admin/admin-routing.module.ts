import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPage } from './admin.page';
import { CommonModule } from '@angular/common';
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
    loadChildren: () =>
      import('./courses/courses.module').then(m => m.CoursesPageModule)
  },
  {
    path: 'teachers',
    component: AdminPage,
    loadChildren: () =>
      import('./teachers/teachers.module').then(m => m.TeachersPageModule)
  },
  {
    path: 'sections',
    component: AdminPage,
    loadChildren: () =>
      import('./sections/sections.module').then(m => m.SectionsPageModule)
  },
  {
    path: 'classrooms',
    component: AdminPage,
    loadChildren: () =>
      import('./classrooms/classrooms.module').then(m => m.ClassroomsPageModule)
  },
  {
    path: 'timetable',
    component: AdminPage,
    loadChildren: () =>
      import('./timetable/timetable-routing.module').then(
        m => m.TimetableRoutingModule
      )
  }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [AdminPage]
})
export class AdminRoutingModule {}
